#!/usr/bin/env python3
"""
Neighborhood Identification Pipeline for BaseScape
===================================================

Identifies subdivisions along the Wasatch Front with high density of newer homes
on sloped lots — prime candidates for walkout basement conversions.

Data sources:
  - UGRC ArcGIS Feature Services (LIR data): year built, property type, subdivision
  - USGS Elevation Point Query Service: slope analysis per subdivision

Pipeline:
  Phase 1: Pull LIR data from Salt Lake, Utah, Davis counties
  Phase 2: Filter for single-family residential, built 2000-2020
  Phase 3: Cluster by subdivision, count qualifying homes
  Phase 4: Score top subdivisions by slope (elevation variance)
  Phase 5: Output ranked target list to data/neighborhoods/

Usage:
  python3 tools/neighborhood_pipeline.py
  python3 tools/neighborhood_pipeline.py --skip-elevation   # Phase 1-3 only (fast)
  python3 tools/neighborhood_pipeline.py --min-homes 10     # Minimum homes per subdivision
  python3 tools/neighborhood_pipeline.py --year-min 2005 --year-max 2018
"""

import argparse
import csv
import json
import math
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlencode

import requests
import pandas as pd

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

BASE_URL = "https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services"

COUNTIES = {
    "Salt Lake": {
        "lir_service": "Parcels_SaltLake_LIR",
        "parcel_service": "Parcels_SaltLake",
    },
    "Utah": {
        "lir_service": "Parcels_Utah_LIR",
        "parcel_service": "Parcels_Utah",
    },
    "Davis": {
        "lir_service": "Parcels_Davis_LIR",
        "parcel_service": "Parcels_Davis",
    },
}

# Fields to pull from LIR (shared across all 3 counties)
LIR_FIELDS = [
    "PARCEL_ID",
    "PARCEL_ADD",
    "PARCEL_CITY",
    "SUBDIV_NAME",
    "BUILT_YR",
    "EFFBUILT_YR",
    "PROP_CLASS",
    "PRIMARY_RES",
    "FLOORS_CNT",
    "BLDG_SQFT",
    "TOTAL_MKT_VALUE",
    "PARCEL_ACRES",
    "HOUSE_CNT",
]

# USGS Elevation Point Query Service
EPQS_URL = "https://epqs.nationalmap.gov/v1/json"

OUTPUT_DIR = Path(__file__).parent.parent / "data" / "neighborhoods"


# ---------------------------------------------------------------------------
# Phase 1: Pull LIR data from ArcGIS Feature Services
# ---------------------------------------------------------------------------


def query_feature_service(
    service_name: str,
    where: str,
    out_fields: list[str],
    return_geometry: bool = False,
    max_total: int = 0,
) -> list[dict]:
    """Query an ArcGIS Feature Service with pagination. max_total=0 means no limit."""
    url = f"{BASE_URL}/{service_name}/FeatureServer/0/query"
    all_features = []
    offset = 0
    page_size = min(2000, max_total) if max_total > 0 else 2000

    while True:
        params = {
            "where": where,
            "outFields": ",".join(out_fields),
            "returnGeometry": str(return_geometry).lower(),
            "f": "json",
            "resultOffset": offset,
            "resultRecordCount": page_size,
        }
        if return_geometry:
            params["outSR"] = "4326"  # WGS84 for lat/lon

        resp = requests.get(url, params=params, timeout=120)
        resp.raise_for_status()
        data = resp.json()

        if "error" in data:
            print(f"  API error: {data['error']}", file=sys.stderr)
            break

        features = data.get("features", [])
        if not features:
            break

        if return_geometry:
            # GeoJSON-style: features have geometry + attributes
            for f in features:
                row = f.get("attributes", {})
                geom = f.get("geometry", {})
                if geom:
                    # ArcGIS returns rings for polygons; compute centroid
                    rings = geom.get("rings", [])
                    if rings and rings[0]:
                        coords = rings[0]
                        cx = sum(p[0] for p in coords) / len(coords)
                        cy = sum(p[1] for p in coords) / len(coords)
                        row["_lon"] = cx
                        row["_lat"] = cy
                all_features.append(row)
        else:
            for f in features:
                all_features.append(f.get("attributes", {}))

        print(f"    Fetched {len(all_features)} records (offset={offset})...")

        if max_total > 0 and len(all_features) >= max_total:
            all_features = all_features[:max_total]
            break
        if not data.get("exceededTransferLimit", False) and len(features) < page_size:
            break
        offset += len(features)

    return all_features


def get_record_count(service_name: str, where: str) -> int:
    """Get the total record count for a query."""
    url = f"{BASE_URL}/{service_name}/FeatureServer/0/query"
    params = {
        "where": where,
        "returnCountOnly": "true",
        "f": "json",
    }
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json().get("count", 0)


def pull_lir_data(year_min: int, year_max: int) -> pd.DataFrame:
    """Phase 1: Pull LIR data for all three Wasatch Front counties."""
    print("\n" + "=" * 60)
    print("PHASE 1: Pulling LIR data from UGRC Feature Services")
    print("=" * 60)

    all_records = []

    for county_name, services in COUNTIES.items():
        service = services["lir_service"]
        where = (
            f"BUILT_YR >= {year_min} AND BUILT_YR <= {year_max}"
        )

        print(f"\n  {county_name} County ({service}):")
        count = get_record_count(service, where)
        print(f"    Total matching records: {count:,}")

        if count == 0:
            continue

        records = query_feature_service(
            service, where, LIR_FIELDS, return_geometry=False
        )

        for r in records:
            r["COUNTY"] = county_name

        all_records.extend(records)
        print(f"    Retrieved: {len(records):,} records")

    df = pd.DataFrame(all_records)
    print(f"\n  Total records across all counties: {len(df):,}")
    return df


# ---------------------------------------------------------------------------
# Phase 2: Filter for target properties
# ---------------------------------------------------------------------------


def filter_properties(df: pd.DataFrame) -> pd.DataFrame:
    """Phase 2: Filter for single-family residential with subdivision."""
    print("\n" + "=" * 60)
    print("PHASE 2: Filtering for target properties")
    print("=" * 60)

    initial_count = len(df)

    # Normalize text fields
    for col in ["PROP_CLASS", "PROP_TYPE", "SUBDIV_NAME", "PARCEL_CITY"]:
        if col in df.columns:
            df[col] = df[col].fillna("").astype(str).str.strip()

    # Show unique PROP_CLASS values for debugging
    print(f"\n  Unique PROP_CLASS values:")
    for val, cnt in df["PROP_CLASS"].value_counts().head(15).items():
        print(f"    {val}: {cnt:,}")

    # Filter: residential properties (include "Unknown" with subdivision names — likely residential)
    residential_keywords = [
        "residential", "single", "sfr", "house", "dwelling", "home",
    ]
    exclude_keywords = [
        "commercial", "industrial", "tax exempt", "greenbelt", "agricultural",
        "vacant", "recreational",
    ]
    mask_residential = df["PROP_CLASS"].str.lower().apply(
        lambda x: any(kw in x for kw in residential_keywords)
    )
    mask_unknown_with_subdiv = (
        df["PROP_CLASS"].str.lower().isin(["unknown", ""])
        & (df["SUBDIV_NAME"].str.len() > 0)
    )
    mask_exclude = df["PROP_CLASS"].str.lower().apply(
        lambda x: any(kw in x for kw in exclude_keywords)
    )
    mask_final = (mask_residential | mask_unknown_with_subdiv) & ~mask_exclude

    df = df[mask_final].copy()
    print(f"\n  After residential filter: {len(df):,} ({initial_count - len(df):,} removed)")

    # Filter: must have a subdivision name
    df = df[df["SUBDIV_NAME"].str.len() > 0].copy()
    print(f"  After subdivision filter: {len(df):,}")

    # Filter: exclude condos, townhomes, apartments (not walkout candidates)
    condo_keywords = ["condo", "townhome", "townhouse", "apartment", "apt"]
    mask_condo = df["SUBDIV_NAME"].str.lower().apply(
        lambda x: any(kw in x for kw in condo_keywords)
    )
    df = df[~mask_condo].copy()
    print(f"  After condo/townhome filter: {len(df):,}")

    # Filter: reasonable built year (sanity check)
    df = df[df["BUILT_YR"] > 0].copy()
    print(f"  After year sanity check: {len(df):,}")

    return df


# ---------------------------------------------------------------------------
# Phase 3: Cluster by subdivision
# ---------------------------------------------------------------------------


def cluster_by_subdivision(df: pd.DataFrame, min_homes: int) -> pd.DataFrame:
    """Phase 3: Group by subdivision, compute stats, filter by min homes."""
    print("\n" + "=" * 60)
    print("PHASE 3: Clustering by subdivision")
    print("=" * 60)

    # Create subdivision key (county + subdivision name for uniqueness)
    df["_subdiv_key"] = df["COUNTY"] + " | " + df["SUBDIV_NAME"]

    grouped = df.groupby("_subdiv_key").agg(
        county=("COUNTY", "first"),
        subdivision=("SUBDIV_NAME", "first"),
        home_count=("PARCEL_ID", "count"),
        avg_year_built=("BUILT_YR", "mean"),
        min_year_built=("BUILT_YR", "min"),
        max_year_built=("BUILT_YR", "max"),
        avg_sqft=("BLDG_SQFT", "mean"),
        avg_floors=("FLOORS_CNT", "mean"),
        avg_value=("TOTAL_MKT_VALUE", "mean"),
        avg_acres=("PARCEL_ACRES", "mean"),
        cities=("PARCEL_CITY", lambda x: ", ".join(sorted(x.unique()))),
        sample_addresses=("PARCEL_ADD", lambda x: "; ".join(str(a) for a in x.head(3) if a)),
    ).reset_index(drop=True)

    print(f"  Total subdivisions: {len(grouped):,}")

    # Filter by minimum home count
    grouped = grouped[grouped["home_count"] >= min_homes].copy()
    grouped = grouped.sort_values("home_count", ascending=False)
    print(f"  Subdivisions with {min_homes}+ homes: {len(grouped):,}")

    # Round numeric columns
    for col in ["avg_year_built", "avg_sqft", "avg_floors", "avg_value", "avg_acres"]:
        grouped[col] = grouped[col].round(1)

    return grouped


# ---------------------------------------------------------------------------
# Phase 4: Slope analysis via USGS Elevation API
# ---------------------------------------------------------------------------


def get_elevation(lat: float, lon: float, retries: int = 2) -> float | None:
    """Query USGS Elevation Point Query Service for a single point."""
    for attempt in range(retries + 1):
        try:
            resp = requests.get(
                EPQS_URL,
                params={"x": lon, "y": lat, "wkid": 4326, "units": "Meters"},
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()
            val = data.get("value")
            if val is not None and float(val) > -1000:  # sanity check
                return float(val)
        except requests.exceptions.Timeout:
            if attempt < retries:
                time.sleep(1)
                continue
        except Exception:
            pass
        break
    return None


def get_subdivision_centroids(
    county_name: str, subdiv_name: str, year_min: int, year_max: int, sample_size: int = 8
) -> list[dict]:
    """Get parcel centroids for a subdivision (with geometry)."""
    service = COUNTIES[county_name]["lir_service"]
    # Escape single quotes in subdivision name
    safe_name = subdiv_name.replace("'", "''")
    where = (
        f"SUBDIV_NAME = '{safe_name}' "
        f"AND BUILT_YR >= {year_min} AND BUILT_YR <= {year_max}"
    )

    records = query_feature_service(
        service,
        where,
        ["PARCEL_ID", "PARCEL_ADD"],
        return_geometry=True,
        max_total=50,  # Only need a handful for elevation sampling
    )

    # Sample evenly if we have more records than needed
    if len(records) > sample_size:
        step = len(records) // sample_size
        records = records[::step][:sample_size]

    return [r for r in records if "_lat" in r and "_lon" in r]


def _score_one_subdivision(
    county: str,
    subdiv: str,
    home_count: int,
    year_min: int,
    year_max: int,
    samples: int,
) -> dict:
    """Score a single subdivision's slope. Runs in a thread."""
    centroids = get_subdivision_centroids(county, subdiv, year_min, year_max, sample_size=samples)
    if len(centroids) < 2:
        return {"elevation_range_m": 0, "avg_elevation_m": 0, "slope_score": 0, "api_calls": 0}

    # Concurrent elevation queries within this subdivision
    elevations = []
    api_calls = 0
    with ThreadPoolExecutor(max_workers=6) as elev_pool:
        futures = {
            elev_pool.submit(get_elevation, c["_lat"], c["_lon"]): c
            for c in centroids
        }
        for f in as_completed(futures):
            api_calls += 1
            result = f.result()
            if result is not None:
                elevations.append(result)

    if len(elevations) < 2:
        return {"elevation_range_m": 0, "avg_elevation_m": 0, "slope_score": 0, "api_calls": api_calls}

    elev_range = max(elevations) - min(elevations)
    avg_elev = sum(elevations) / len(elevations)
    score = elev_range * math.log2(max(home_count, 2))

    return {
        "elevation_range_m": round(elev_range, 1),
        "avg_elevation_m": round(avg_elev, 1),
        "slope_score": round(score, 1),
        "api_calls": api_calls,
        "elev_min": min(elevations),
        "elev_max": max(elevations),
    }


def score_subdivisions_by_slope(
    subdivisions: pd.DataFrame,
    year_min: int,
    year_max: int,
    top_n: int = 80,
    samples_per_subdiv: int = 6,
) -> pd.DataFrame:
    """Phase 4: Score top subdivisions by elevation variance (slope proxy)."""
    print("\n" + "=" * 60)
    print(f"PHASE 4: Slope analysis for top {top_n} subdivisions")
    print("=" * 60)

    candidates = subdivisions.head(top_n).copy()
    candidates["elevation_range_m"] = 0.0
    candidates["avg_elevation_m"] = 0.0
    candidates["slope_score"] = 0.0

    total = len(candidates)
    total_api_calls = 0

    # Process subdivisions 4 at a time for throughput
    batch_size = 4
    indices = list(candidates.index)

    for batch_start in range(0, total, batch_size):
        batch_indices = indices[batch_start : batch_start + batch_size]

        with ThreadPoolExecutor(max_workers=batch_size) as pool:
            futures = {}
            for idx in batch_indices:
                row = candidates.loc[idx]
                pos = indices.index(idx) + 1
                print(f"  [{pos}/{total}] {row['subdivision']} ({row['county']} Co., {int(row['home_count'])} homes)")
                futures[pool.submit(
                    _score_one_subdivision,
                    row["county"], row["subdivision"], int(row["home_count"]),
                    year_min, year_max, samples_per_subdiv,
                )] = idx

            for f in as_completed(futures):
                idx = futures[f]
                result = f.result()
                total_api_calls += result.get("api_calls", 0)
                candidates.at[idx, "elevation_range_m"] = result["elevation_range_m"]
                candidates.at[idx, "avg_elevation_m"] = result["avg_elevation_m"]
                candidates.at[idx, "slope_score"] = result["slope_score"]

                if result["slope_score"] > 0:
                    row = candidates.loc[idx]
                    print(
                        f"    ✓ {row['subdivision']}: "
                        f"{result['elevation_range_m']}m range "
                        f"({result.get('elev_min', 0):.0f}–{result.get('elev_max', 0):.0f}m) "
                        f"| Score: {result['slope_score']}"
                    )

    print(f"\n  Total USGS API calls: {total_api_calls}")
    candidates = candidates.sort_values("slope_score", ascending=False)
    return candidates


# ---------------------------------------------------------------------------
# Phase 5: Output
# ---------------------------------------------------------------------------


def write_outputs(
    subdivisions: pd.DataFrame,
    scored: pd.DataFrame | None,
    all_properties: pd.DataFrame,
    year_min: int,
    year_max: int,
):
    """Phase 5: Write output files."""
    print("\n" + "=" * 60)
    print("PHASE 5: Writing output files")
    print("=" * 60)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 1. All subdivisions (Phase 3 output)
    subdiv_path = OUTPUT_DIR / "subdivisions-all.csv"
    subdivisions.to_csv(subdiv_path, index=False)
    print(f"  {subdiv_path}: {len(subdivisions)} subdivisions")

    # 2. Scored subdivisions (Phase 4 output) — if available
    if scored is not None and len(scored) > 0:
        scored_path = OUTPUT_DIR / "subdivisions-scored.csv"
        scored.to_csv(scored_path, index=False)
        print(f"  {scored_path}: {len(scored)} scored subdivisions")

        # 3. Top targets — the actionable hit list
        top = scored[scored["slope_score"] > 0].head(30).copy()
        targets_path = OUTPUT_DIR / "target-neighborhoods.csv"
        top.to_csv(targets_path, index=False)
        print(f"  {targets_path}: {len(top)} target neighborhoods")

        # 4. Markdown summary for easy reading
        md_path = OUTPUT_DIR / "target-neighborhoods.md"
        write_markdown_summary(top, md_path, year_min, year_max)
        print(f"  {md_path}: Markdown summary")

    # 5. Raw property data for deep dives
    props_path = OUTPUT_DIR / "properties-filtered.csv"
    export_cols = [c for c in all_properties.columns if not c.startswith("_")]
    all_properties[export_cols].to_csv(props_path, index=False)
    print(f"  {props_path}: {len(all_properties)} filtered properties")


def write_markdown_summary(
    top: pd.DataFrame, path: Path, year_min: int, year_max: int
):
    """Write a human-readable markdown summary of target neighborhoods."""
    lines = [
        "# Target Neighborhoods for Walkout Basement Canvassing",
        "",
        f"> Generated {time.strftime('%Y-%m-%d')} | "
        f"Homes built {year_min}–{year_max} | "
        f"Wasatch Front (Salt Lake, Utah, Davis counties)",
        "",
        "Subdivisions ranked by **slope score** (elevation range × log₂(home count)).",
        "Higher slope = more walkout conversion potential. Higher home count = denser canvassing ROI.",
        "",
        "| Rank | Subdivision | County | City | Homes | Avg Year | Elev Range (m) | Slope Score |",
        "|------|-------------|--------|------|------:|:--------:|:--------------:|:-----------:|",
    ]

    for i, (_, row) in enumerate(top.iterrows(), 1):
        city = row["cities"].split(",")[0].strip() if row["cities"] else ""
        lines.append(
            f"| {i} | {row['subdivision']} | {row['county']} | {city} "
            f"| {int(row['home_count'])} | {int(row['avg_year_built'])} "
            f"| {row['elevation_range_m']:.1f} | {row['slope_score']:.1f} |"
        )

    lines.extend([
        "",
        "## How to Use This List",
        "",
        "1. **Canvassing:** Start with top-ranked subdivisions. Print door hangers with before/after photos + QR code to the walkout basement guide.",
        "2. **Geo-targeted Meta Ads:** Upload these subdivision addresses as a custom audience, or geo-fence the neighborhoods.",
        "3. **Nextdoor:** Post in the neighborhood groups for top subdivisions.",
        "4. **Drive-by validation:** Before committing to canvass, drive through the top 5 to visually confirm sloped lots with standard basements.",
        "",
        "## Methodology",
        "",
        "- **Data source:** UGRC ArcGIS Feature Services (Land Information Records)",
        "- **Filter:** Single-family residential, built within target year range, in named subdivisions",
        "- **Slope analysis:** USGS Elevation Point Query Service — sampled 6-8 parcel centroids per subdivision",
        "- **Assumption:** ~85% of Wasatch Front homes have basements (per market research). Slope is the differentiator — a sloped lot with a standard basement is a walkout conversion candidate.",
        "",
    ])

    path.write_text("\n".join(lines))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


CACHE_PATH = OUTPUT_DIR / "_lir_cache.parquet"


def main():
    parser = argparse.ArgumentParser(
        description="Identify target neighborhoods for walkout basement canvassing"
    )
    parser.add_argument(
        "--year-min", type=int, default=2000, help="Minimum build year (default: 2000)"
    )
    parser.add_argument(
        "--year-max", type=int, default=2020, help="Maximum build year (default: 2020)"
    )
    parser.add_argument(
        "--min-homes",
        type=int,
        default=15,
        help="Minimum homes per subdivision (default: 15)",
    )
    parser.add_argument(
        "--skip-elevation",
        action="store_true",
        help="Skip Phase 4 (elevation/slope analysis)",
    )
    parser.add_argument(
        "--top-n",
        type=int,
        default=80,
        help="Number of top subdivisions to score for slope (default: 80)",
    )
    parser.add_argument(
        "--use-cache",
        action="store_true",
        help="Use cached LIR data from previous run (skips Phase 1 API calls)",
    )
    args = parser.parse_args()

    print("=" * 60)
    print("BaseScape Neighborhood Identification Pipeline")
    print("=" * 60)
    print(f"  Year range: {args.year_min}–{args.year_max}")
    print(f"  Min homes per subdivision: {args.min_homes}")
    print(f"  Counties: {', '.join(COUNTIES.keys())}")
    print(f"  Slope analysis: {'skip' if args.skip_elevation else f'top {args.top_n}'}")

    # Phase 1: Pull data (or use cache)
    if args.use_cache and CACHE_PATH.exists():
        print(f"\n  Using cached data from {CACHE_PATH}")
        df = pd.read_parquet(CACHE_PATH)
        print(f"  Loaded {len(df):,} records from cache")
    else:
        df = pull_lir_data(args.year_min, args.year_max)
        if df.empty:
            print("\nNo data retrieved. Check network connection and API availability.")
            sys.exit(1)
        # Cache for future runs
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        df.to_parquet(CACHE_PATH, index=False)
        print(f"\n  Cached {len(df):,} records to {CACHE_PATH}")

    # Phase 2: Filter
    filtered = filter_properties(df)
    if filtered.empty:
        print("\nNo properties matched filters. Try adjusting year range or check PROP_CLASS values.")
        sys.exit(1)

    # Phase 3: Cluster
    subdivisions = cluster_by_subdivision(filtered, args.min_homes)
    if subdivisions.empty:
        print(f"\nNo subdivisions with {args.min_homes}+ homes. Try lowering --min-homes.")
        sys.exit(1)

    # Phase 4: Slope analysis (optional)
    scored = None
    if not args.skip_elevation:
        scored = score_subdivisions_by_slope(
            subdivisions, args.year_min, args.year_max, top_n=args.top_n
        )

    # Phase 5: Output
    write_outputs(subdivisions, scored, filtered, args.year_min, args.year_max)

    print("\n" + "=" * 60)
    print("DONE")
    print("=" * 60)

    if scored is not None:
        top5 = scored[scored["slope_score"] > 0].head(5)
        if not top5.empty:
            print("\nTop 5 target neighborhoods:")
            for i, (_, row) in enumerate(top5.iterrows(), 1):
                print(
                    f"  {i}. {row['subdivision']} ({row['county']} Co.) "
                    f"— {int(row['home_count'])} homes, "
                    f"{row['elevation_range_m']:.1f}m elevation range, "
                    f"score: {row['slope_score']:.1f}"
                )


if __name__ == "__main__":
    main()
