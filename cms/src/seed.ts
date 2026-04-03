import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { getPayload } from 'payload'
import { loadEnv } from 'payload/node'
import config from './dev-config.js'

loadEnv()

// Minimal 1x1 white PNG for placeholder images
const PNG_1x1 = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489' +
    '0000000a49444154789c626000000002000198e195280000000049454e44ae426082',
  'hex',
)

// Lexical richText helper
function richText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text,
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

// Lexical node helpers for complex body content
function heading(text: string) {
  return {
    type: 'heading',
    tag: 'h2',
    children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

function paragraph(text: string) {
  return {
    type: 'paragraph',
    children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

function listItem(text: string) {
  return {
    type: 'list',
    listType: 'bullet',
    children: [
      {
        type: 'listitem',
        children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        value: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    start: 1,
    tag: 'ul',
    version: 1,
  }
}

const CITIES = [
  { cityName: 'Provo', county: 'utah', lat: 40.2338, lng: -111.6585 },
  { cityName: 'Orem', county: 'utah', lat: 40.2969, lng: -111.6946 },
  { cityName: 'Sandy', county: 'salt-lake', lat: 40.5649, lng: -111.859 },
  { cityName: 'Lehi', county: 'utah', lat: 40.3916, lng: -111.8508 },
  { cityName: 'South Jordan', county: 'salt-lake', lat: 40.5622, lng: -111.9297 },
  { cityName: 'Herriman', county: 'salt-lake', lat: 40.5141, lng: -112.033 },
  { cityName: 'Taylorsville', county: 'salt-lake', lat: 40.6677, lng: -111.9388 },
  { cityName: 'Eagle Mountain', county: 'utah', lat: 40.3141, lng: -112.0069 },
  { cityName: 'Draper', county: 'salt-lake', lat: 40.5246, lng: -111.8638 },
  { cityName: 'Saratoga Springs', county: 'utah', lat: 40.3491, lng: -111.9046 },
  { cityName: 'Riverton', county: 'salt-lake', lat: 40.5219, lng: -111.9391 },
  { cityName: 'Spanish Fork', county: 'utah', lat: 40.1149, lng: -111.6549 },
  { cityName: 'Pleasant Grove', county: 'utah', lat: 40.3641, lng: -111.7385 },
  { cityName: 'American Fork', county: 'utah', lat: 40.3769, lng: -111.7952 },
  { cityName: 'Springville', county: 'utah', lat: 40.1652, lng: -111.6107 },
  { cityName: 'Payson', county: 'utah', lat: 40.0441, lng: -111.7322 },
  { cityName: 'Bluffdale', county: 'salt-lake', lat: 40.4897, lng: -111.938 },
  { cityName: 'Santaquin', county: 'utah', lat: 39.9755, lng: -111.785 },
  { cityName: 'Mapleton', county: 'utah', lat: 40.1363, lng: -111.5785 },
  { cityName: 'Alpine', county: 'utah', lat: 40.4533, lng: -111.778 },
  { cityName: 'Salem', county: 'utah', lat: 40.053, lng: -111.6735 },
  { cityName: 'Cedar Hills', county: 'utah', lat: 40.4141, lng: -111.758 },
  { cityName: 'Nephi', county: 'utah', lat: 39.7105, lng: -111.8363 },
  { cityName: 'Mona', county: 'utah', lat: 39.8152, lng: -111.8555 },
  { cityName: 'Elk Ridge', county: 'utah', lat: 40.0152, lng: -111.6707 },
]

async function createPlaceholder(payload: any, name: string, alt: string) {
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: PNG_1x1,
      mimetype: 'image/png',
      name: `${name}.png`,
      size: PNG_1x1.length,
    },
  })
  return media.id
}

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding BaseScape CMS...')

  // 0. Clear existing data to prevent duplicates on re-seed
  console.log('Clearing existing media and lead magnets...')
  const existingLeadMagnets = await payload.find({ collection: 'lead-magnets', limit: 100 })
  for (const doc of existingLeadMagnets.docs) {
    await payload.delete({ collection: 'lead-magnets', id: doc.id })
  }
  const existingMedia = await payload.find({ collection: 'media', limit: 100 })
  for (const doc of existingMedia.docs) {
    await payload.delete({ collection: 'media', id: doc.id })
  }

  // 0. Placeholder images
  console.log('Creating placeholder images...')
  const heroWalkout = await createPlaceholder(payload, 'hero-walkout', 'Walkout basement conversion in progress')
  const heroEgress = await createPlaceholder(payload, 'hero-egress', 'Egress window installation')
  const projectBefore = await createPlaceholder(payload, 'project-before', 'Basement before walkout conversion')
  const projectAfter = await createPlaceholder(payload, 'project-after', 'Completed walkout basement with natural light')

  // 1. Site Settings
  console.log('Creating SiteSettings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      businessName: 'BaseScape',
      phone: '(888) 414-0007',
      email: 'hello@basescape.com',
      address: {
        street: '123 Innovation Way',
        city: 'Draper',
        state: 'UT',
        zip: '84020',
      },
      operatingHours: [
        { day: 'Monday', open: '08:00', close: '18:00' },
        { day: 'Tuesday', open: '08:00', close: '18:00' },
        { day: 'Wednesday', open: '08:00', close: '18:00' },
        { day: 'Thursday', open: '08:00', close: '18:00' },
        { day: 'Friday', open: '08:00', close: '18:00' },
        { day: 'Saturday', open: '09:00', close: '14:00' },
      ],
      licenseNumber: '14082066-5501 B100',
      insuranceInfo: 'Fully Insured & Bonded — General Liability',
      showReviews: true,
      showGallery: false,
      riskReversals: [
        { statement: 'Free Written Estimates' },
        { statement: 'No Hidden Charges' },
        { statement: 'Dust Containment System' },
        { statement: 'Structural Engineering Guarantee' },
      ],
      serviceAreaZipCodes: '84020\n84043\n84003\n84045\n84065\n84096\n84129\n84005\n84070\n84095',
    } as any,
  })

  // 2. Navigation
  console.log('Creating Navigation...')
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      mainNav: [
        {
          label: 'Services',
          url: '/services/walkout-basements',
          children: [
            { label: 'Walkout Basements', url: '/services/walkout-basements' },
            { label: 'Basement Remodeling', url: '/services/basement-remodeling' },
            { label: 'Pavers & Hardscapes', url: '/services/pavers-hardscapes' },
            { label: 'Retaining Walls', url: '/services/retaining-walls' },
            { label: 'Artificial Turf', url: '/services/artificial-turf' },
            { label: 'Egress Windows', url: '/services/egress-windows' },
          ],
        },
        { label: 'How It Works', url: '/how-it-works' },
        { label: 'Financing', url: '/financing' },
        { label: 'About', url: '/about' },
        { label: 'FAQ', url: '/faq' },
      ],
      footerNav: [
        {
          heading: 'Services',
          links: [
            { label: 'Walkout Basements', url: '/services/walkout-basements' },
            { label: 'Basement Remodeling', url: '/services/basement-remodeling' },
            { label: 'Pavers & Hardscapes', url: '/services/pavers-hardscapes' },
            { label: 'Retaining Walls', url: '/services/retaining-walls' },
            { label: 'Artificial Turf', url: '/services/artificial-turf' },
            { label: 'Egress Windows', url: '/services/egress-windows' },
          ],
        },
        {
          heading: 'Company',
          links: [
            { label: 'About', url: '/about' },
            { label: 'How It Works', url: '/how-it-works' },
            { label: 'FAQ', url: '/faq' },
          ],
        },
        {
          heading: 'Resources',
          links: [
            { label: 'Financing', url: '/financing' },
            { label: 'Blog', url: '/blog' },
            { label: 'Privacy Policy', url: '/privacy' },
          ],
        },
      ],
    } as any,
  })

  // 3. Services
  console.log('Creating Services...')
  const anxietyStackWalkout = {
    structuralSafety: richText('Every walkout conversion starts with a licensed structural engineer\'s assessment. We design steel headers and reinforced openings that exceed IRC load-bearing requirements.'),
    codeCompliance: richText('BaseScape handles all permitting, city inspections, and code compliance. We meet or exceed IRC 2021 requirements for egress, ventilation, and structural modifications.'),
    drainageMoisture: richText('French drains, waterproof membranes, and proper grading are engineered into every project. Water management is designed from day one.'),
    dustDisruption: richText('Our sealed dust containment system uses negative air pressure barriers. Most families stay in their homes throughout the 4-8 week build.'),
    costAffordability: richText('Walkout conversions typically range $50K-$100K. Many homeowners offset costs with $1,200-$2,000/month in rental income, seeing ROI within 2-5 years.'),
    aesthetics: richText('Floor-to-ceiling glass doors, landscaped entries, and finished outdoor living spaces transform dark basements into premium living areas.'),
    timeline: richText('Most walkout conversions complete in 4-8 weeks. We provide a detailed timeline at the engineering phase so you know exactly what to expect.'),
  }

  const walkout = await payload.create({
    collection: 'services',
    data: {
      title: 'Walkout Basements',
      slug: 'walkout-basements',
      tagline: 'Transform your basement into a light-filled walkout with direct landscape access.',
      primaryValuePillar: 'financial',
      serviceType: 'core',
      heroImage: heroWalkout,
      overview: richText('A walkout basement conversion is one of the highest-ROI improvements you can make to your home. By creating a ground-level entry from your existing below-grade basement, we open your lower level to natural light, fresh air, and direct outdoor access — transforming dark, underused square footage into premium living space or a legal rental unit that generates $1,200-$2,000/month in income. Every BaseScape walkout starts with a licensed structural engineer\'s plan and ends with a finished space you\'ll wonder how you ever lived without.'),
      anxietyStack: anxietyStackWalkout,
      seo: {
        metaTitle: 'Walkout Basement Conversions | BaseScape Utah',
        metaDescription: 'Transform your basement with a walkout conversion. Licensed structural engineering, dust containment, and financing options. Free estimates in Utah.',
      },
      status: 'published',
    } as any,
  })

  const egress = await payload.create({
    collection: 'services',
    data: {
      title: 'Egress Windows',
      slug: 'egress-windows',
      tagline: 'Code-compliant emergency exit windows that flood basements with natural light.',
      primaryValuePillar: 'safety',
      serviceType: 'core',
      heroImage: heroEgress,
      overview: richText('Every basement bedroom needs a safe way out — and egress windows deliver that peace of mind while flooding your lower level with natural light. Required by the IRC for any sleeping room, a properly installed egress window transforms a dark, non-conforming basement room into a legally counted bedroom that adds real value to your home. BaseScape handles the full scope — structural cutting, engineered window wells, waterproof flashing, and all permits and inspections — so you get code compliance, safety, and a brighter home in as little as two days.'),
      anxietyStack: {
        structuralSafety: richText('Engineered window wells and reinforced headers maintain foundation integrity. Every installation includes a structural assessment.'),
        codeCompliance: richText('IRC 2021 compliant: minimum 5.7 sq ft opening, 44-inch max sill height, 20-inch minimum width. We handle permits and inspections.'),
        drainageMoisture: richText('Window well drains, covers, and waterproof flashing prevent water intrusion. Proper drainage is built into every installation.'),
        dustDisruption: richText('Egress window installations typically complete in 2-3 days. Our containment system minimizes dust and disruption to your home.'),
        costAffordability: richText('Egress windows typically cost $3,000-$8,000 per window including the well. A fraction of the cost of a walkout with significant safety and value benefits.'),
        aesthetics: richText('Modern egress windows with premium wells add curb appeal and flood basements with natural light, making rooms feel open and inviting.'),
        timeline: richText('Most egress window installations complete in 2-3 days per window. Multi-window projects typically finish within a week.'),
      },
      seo: {
        metaTitle: 'Egress Window Installation | BaseScape Utah',
        metaDescription: 'Code-compliant egress windows for basement bedrooms. Natural light, emergency exits, and increased home value. Free estimates in Utah.',
      },
      status: 'published',
    } as any,
  })

  const pavers = await payload.create({
    collection: 'services',
    data: {
      title: 'Pavers & Hardscapes',
      slug: 'pavers-hardscapes',
      tagline: 'Custom paver patios, walkways, and hardscape installations that extend your living space outdoors.',
      primaryValuePillar: 'transformation',
      serviceType: 'specialized',
      heroImage: heroWalkout,
      overview: richText('Your outdoor space should be an extension of your home — not a cracked concrete slab you avoid. BaseScape designs and installs custom paver patios, walkways, driveways, fire pit surrounds, and outdoor living areas using premium interlocking pavers, natural stone, and engineered base systems purpose-built for the Wasatch Front\'s punishing freeze-thaw cycles. Unlike poured concrete, interlocking pavers flex with ground movement without cracking and can be individually replaced if ever damaged. The result is a stunning, durable outdoor space that adds real value to your property and years of enjoyment for your family.'),
      anxietyStack: {
        structuralSafety: richText('Every hardscape installation starts with a compacted aggregate base engineered for your soil conditions. We use 6-8 inches of base material for patios and 10-12 inches for driveways.'),
        codeCompliance: richText('We verify setback requirements, HOA guidelines, and local drainage ordinances before design begins. Retaining walls over 4 feet require engineered plans — we handle that too.'),
        drainageMoisture: richText('Proper slope (minimum 1% grade away from structures), French drains, and permeable paver options ensure water moves away from your foundation.'),
        costAffordability: richText('Paver patios typically range from $15-$35 per square foot installed, depending on paver selection and site complexity.'),
        aesthetics: richText('Choose from hundreds of paver styles, colors, and patterns — from classic herringbone brick to modern large-format slabs that complement your home\'s exterior.'),
        timeline: richText('Most patio installations complete in 3-5 days. Larger projects with retaining walls may take 1-2 weeks.'),
      },
      seo: {
        metaTitle: 'Paver Patios & Hardscapes | BaseScape Utah',
        metaDescription: 'Custom paver patios, walkways, and hardscape installations in Utah. Engineered for freeze-thaw durability. Free estimates.',
      },
      status: 'published',
    } as any,
  })

  const turf = await payload.create({
    collection: 'services',
    data: {
      title: 'Artificial Turf',
      slug: 'artificial-turf',
      tagline: 'Low-maintenance, year-round green spaces that save water and eliminate mowing.',
      primaryValuePillar: 'transformation',
      serviceType: 'specialized',
      heroImage: heroWalkout,
      overview: richText('Imagine a lush, green lawn that never needs watering, mowing, or fertilizing — and looks perfect twelve months a year. BaseScape installs premium synthetic turf systems with realistic multi-toned blades, proper drainage, and antimicrobial infill for pet-friendly performance. In Utah\'s semi-arid climate, where outdoor water use accounts for up to 60% of residential consumption, artificial turf saves homeowners $500-$1,000+ annually in water and maintenance costs. Most installations complete in just 2-4 days, and available water district rebates can offset 10-30% of your investment.'),
      anxietyStack: {
        structuralSafety: richText('Our turf installations use a compacted aggregate base (3-4 inches) over geotextile fabric to prevent settling, sinkholes, and weed growth.'),
        drainageMoisture: richText('Premium artificial turf drains at 30+ inches per hour — faster than natural grass. Combined with a properly graded base, standing water is never an issue.'),
        costAffordability: richText('Artificial turf installation typically costs $8-$15 per square foot installed. Most homeowners recoup costs within 3-5 years through water savings.'),
        aesthetics: richText('Modern artificial turf features multi-toned blades, realistic thatch layers, and varied pile heights that look and feel like natural grass.'),
        timeline: richText('Most residential turf installations complete in 2-4 days depending on area size and site preparation requirements.'),
      },
      seo: {
        metaTitle: 'Artificial Turf Installation | BaseScape Utah',
        metaDescription: 'Professional artificial turf installation in Utah. Water-saving, pet-friendly, year-round green. Free estimates.',
      },
      status: 'published',
    } as any,
  })

  const basementRemodeling = await payload.create({
    collection: 'services',
    data: {
      title: 'Basement Remodeling',
      slug: 'basement-remodeling',
      tagline: 'Turn your unfinished basement into the most-used room in your home.',
      primaryValuePillar: 'transformation',
      serviceType: 'core',
      heroImage: heroWalkout,
      overview: richText('That unfinished basement is not wasted space — it is your home\'s biggest untapped asset. BaseScape transforms raw, concrete-walled lower levels into beautiful, fully finished living spaces: custom framing, drywall, flooring, recessed lighting, full bathrooms, kitchenettes, home theaters, gyms, and guest suites. We handle every trade under one roof — structural, electrical, plumbing, HVAC, and finish carpentry — so you get a seamless build with a single point of accountability. Whether you want a rentable apartment, a space for your growing family, or a personal retreat, we deliver a finished basement that feels like it was always meant to be there.'),
      anxietyStack: {
        structuralSafety: richText('Every basement remodel begins with a structural assessment to identify load-bearing walls, foundation conditions, and any existing moisture issues. We reinforce and frame to code before any finish work begins.'),
        codeCompliance: richText('BaseScape manages all permits, inspections, and code requirements — including egress, fire separation, ceiling height minimums, and ADU regulations if you plan to rent the space.'),
        drainageMoisture: richText('We install vapor barriers, interior drainage systems, and waterproof membranes before framing. Moisture issues are solved at the root cause so your finished space stays dry for decades.'),
        dustDisruption: richText('Our sealed dust containment system with negative air pressure keeps construction debris out of your living space. Most families stay comfortably in their homes throughout the project.'),
        costAffordability: richText('Basement remodels typically range from $30K-$80K depending on scope and finishes. Financing options are available, and rental-ready units can generate $1,200-$2,000/month to offset your investment.'),
        aesthetics: richText('From modern open-concept layouts to cozy theater rooms with custom built-ins, we design spaces that match your vision and your home\'s style. Premium finishes, professional lighting design, and thoughtful layouts make your basement feel like a natural extension of your home — not an afterthought.'),
        timeline: richText('Most basement remodels complete in 6-10 weeks depending on scope. We provide a detailed project timeline before work begins so you know exactly what to expect at every phase.'),
      },
      seo: {
        metaTitle: 'Basement Remodeling & Finishing | BaseScape Utah',
        metaDescription: 'Transform your unfinished basement into beautiful living space. Full-service remodeling with premium finishes. Free estimates in Utah.',
      },
      status: 'published',
    } as any,
  })

  const retainingWalls = await payload.create({
    collection: 'services',
    data: {
      title: 'Retaining Walls',
      slug: 'retaining-walls',
      tagline: 'Engineered retaining walls that turn problem slopes into usable outdoor space.',
      primaryValuePillar: 'transformation',
      serviceType: 'specialized',
      heroImage: heroWalkout,
      overview: richText('Utah\'s hillside lots create beautiful views — and serious grading challenges. BaseScape designs and builds engineered retaining walls that stabilize slopes, prevent erosion, and create usable flat space where none existed before. We work with segmental block, natural stone, and poured concrete systems, each selected to match your site conditions, aesthetic preferences, and budget. Every wall over 4 feet is backed by structural engineering calculations for soil pressure, drainage, and load-bearing capacity. The result is a wall that performs for decades and transforms your yard from a liability into a landscape you actually use.'),
      anxietyStack: {
        structuralSafety: richText('Every retaining wall is engineered for your specific soil conditions, slope grade, and surcharge loads. Walls over 4 feet include geogrid reinforcement and are designed by a licensed structural engineer to meet or exceed code requirements.'),
        codeCompliance: richText('Retaining walls over 4 feet require building permits and engineered plans in most Utah jurisdictions. BaseScape handles the full permitting process, engineering submittals, and inspection scheduling.'),
        drainageMoisture: richText('Proper drainage is the single most important factor in retaining wall longevity. Every BaseScape wall includes perforated drain pipe, drainage aggregate backfill, and surface water management to prevent hydrostatic pressure buildup.'),
        costAffordability: richText('Retaining walls typically cost $20-$50 per square foot of wall face, depending on material selection, wall height, and site access. We provide free on-site estimates with transparent pricing and no hidden charges.'),
        aesthetics: richText('From clean-lined modern segmental block to rustic natural stone, we help you select materials that complement your home and landscape. Terraced walls with integrated planting beds, lighting, and seating areas turn functional structures into landscape features.'),
        timeline: richText('Most residential retaining wall projects complete in 1-3 weeks depending on wall length, height, and site preparation requirements. We provide a detailed project schedule before breaking ground.'),
      },
      seo: {
        metaTitle: 'Retaining Walls | BaseScape Utah',
        metaDescription: 'Engineered retaining walls for Utah hillside properties. Segmental block, natural stone, poured concrete. Built to last. Free estimates.',
      },
      status: 'published',
    } as any,
  })

  // 4. Service Areas
  console.log('Creating 25 Service Areas...')
  const serviceAreaIds: Record<string, string | number> = {}
  for (const city of CITIES) {
    const area = await payload.create({
      collection: 'service-areas',
      data: {
        cityName: city.cityName,
        stateAbbrev: 'UT',
        slug: `${city.cityName.toLowerCase().replace(/\s+/g, '-')}-ut`,
        county: city.county,
        coordinates: { lat: city.lat, lng: city.lng },
        serviceRadius: 15,
        localContent: richText(`BaseScape serves ${city.cityName}, UT with specialized walkout basements, basement remodeling, pavers & hardscapes, retaining walls, artificial turf, and egress windows.`),
        localReferences: `${city.cityName} area homeowners`,
        seo: {
          metaTitle: `Walkout Basements & Egress Windows in ${city.cityName}, UT`,
          metaDescription: `BaseScape provides walkout basement conversions and egress window installations in ${city.cityName}, Utah. Licensed, insured, free estimates.`,
        },
        status: 'published',
      } as any,
    })
    serviceAreaIds[city.cityName] = area.id
  }

  // 5. Sample FAQs
  console.log('Creating Sample FAQs...')
  const faqCategories = [
    // Existing walkout FAQs
    { question: 'How much does a walkout basement conversion cost?', answer: richText('Walkout conversions typically range from $50K-$100K depending on complexity, soil conditions, and finish level. We provide free written estimates with detailed scope breakdowns.'), category: 'cost' },
    { question: 'Does a walkout basement need a building permit?', answer: richText('Yes. All structural foundation work requires city permits, structural engineering plans, and inspection sign-offs. BaseScape handles the entire permitting process.'), category: 'code-compliance' },
    { question: 'How long does a walkout conversion take?', answer: richText('Most walkout conversions complete in 4-8 weeks. Egress windows typically take 2-3 days. We provide a detailed timeline at the engineering phase.'), category: 'timeline' },
    { question: 'Will there be dust and disruption during construction?', answer: richText('Our dust containment system uses negative air pressure and sealed barriers to minimize impact. Most families stay in their homes throughout the project.'), category: 'disruption' },
    { question: 'Can I use my walkout basement as a rental unit?', answer: richText("Yes — with proper ADU compliance. Utah's HB 398 and SB 174 make this possible in most Wasatch Front cities. Adding a full kitchen triggers ADU classification with additional building code requirements."), category: 'rental-readiness' },
    { question: 'What financing options are available?', answer: richText('Common options include home equity loans, HELOCs, and construction loans with interest-only periods during the build phase. Many homeowners see ROI through rental income within 2-5 years.'), category: 'financing-rebates' },
    { question: 'How do you handle drainage and moisture?', answer: richText('Proper grading, French drain systems, waterproof membranes, and moisture barriers are engineered into every project. Water management is designed from day one, not added as an afterthought.'), category: 'drainage-moisture' },
    { question: 'Do building codes vary by city in Utah?', answer: richText('Yes. While the IRC provides the base code, individual cities may have additional requirements for setbacks, egress specifications, and ADU regulations. BaseScape navigates the specific requirements for each city we serve.'), category: 'city-variability' },
    // Additional walkout FAQs (T034)
    { question: 'Does a walkout basement increase home value?', answer: richText('Yes. A walkout basement conversion typically adds $50,000-$100,000+ to home value, depending on the market and finish level. The added square footage, natural light, and potential rental income make walkouts one of the highest-ROI home improvements. In the Wasatch Front market, homes with walkout basements consistently appraise higher than comparable homes without.'), category: 'cost' },
    { question: 'Can any basement be converted to a walkout?', answer: richText('Most basements can be converted, but feasibility depends on your lot\'s topography, soil conditions, and foundation type. Homes on sloped lots are ideal candidates. Flat lots may require more extensive grading and retaining wall work. BaseScape provides a free structural assessment to determine if your home is a good candidate.'), category: 'general' },
    { question: 'What happens to my landscaping during a walkout conversion?', answer: richText('Excavation will disturb the area around the new walkout entry. We protect existing landscaping where possible and include landscape restoration in our scope. The final result includes proper grading, a concrete or paver landing, and seamless integration with your yard. Many homeowners use the project as an opportunity to upgrade their outdoor living space.'), category: 'disruption' },
    // Additional egress FAQs (T035)
    { question: 'What size does an egress window need to be?', answer: richText('Per IRC Section R310, egress windows must have a minimum net clear opening of 5.7 square feet, with a minimum width of 20 inches and minimum height of 24 inches. The sill height cannot exceed 44 inches from the finished floor. These requirements ensure both occupants and firefighters can pass through the opening in an emergency.'), category: 'code-compliance' },
    { question: 'Do I need an egress window in my basement bedroom?', answer: richText('Yes. The International Residential Code requires every sleeping room to have at least one egress window or door. Without a code-compliant egress window, your basement bedroom cannot legally be counted as a bedroom on your home\'s listing or appraisal. This directly impacts your home\'s market value and — more importantly — your family\'s safety.'), category: 'code-compliance' },
    { question: 'How much does an egress window add to home value?', answer: richText('An egress window installation typically costs $5,000-$12,000 and can add $10,000-$25,000+ to your home\'s value by legally converting non-conforming basement space into a counted bedroom. This is one of the highest-ROI improvements available — most homeowners see a 2:1 or better return on their investment.'), category: 'cost' },
    // Basement Remodeling FAQs
    { question: 'How much does a basement remodel cost?', answer: richText('Basement remodeling projects typically range from $30K-$80K depending on scope, finishes, and structural work needed. A basic finish (framing, drywall, flooring, lighting) starts around $30K, while full transformations with bathrooms, kitchens, and high-end finishes can reach $80K+. We provide free, detailed estimates.'), category: 'cost' },
    { question: 'Can I turn my basement into a rental unit?', answer: richText('Yes — with proper ADU compliance. Utah\'s HB 398 and SB 174 allow accessory dwelling units in most Wasatch Front cities. Requirements include separate egress, fire separation, and (if adding a kitchen with a stove) utility metering. BaseScape handles the code requirements.'), category: 'rental-readiness' },
    { question: 'How do you handle moisture in basement remodels?', answer: richText('Every project starts with a moisture assessment. We install vapor barriers, interior drainage systems, and waterproof membranes as needed before any finish work. We address root causes — not symptoms — so your finished space stays dry permanently.'), category: 'drainage-moisture' },
    // Retaining Wall FAQs
    { question: 'Do retaining walls need a permit?', answer: richText('In most Utah jurisdictions, retaining walls over 4 feet in height require a building permit and engineered plans. BaseScape handles the entire permitting process, including structural engineering calculations for soil pressure, drainage, and load-bearing requirements.'), category: 'code-compliance' },
    { question: 'How much do retaining walls cost?', answer: richText('Retaining wall costs typically range from $20-$50 per square foot of wall face, depending on materials (segmental block, natural stone, poured concrete) and site complexity. Walls requiring engineered drainage, tiebacks, or significant excavation will be on the higher end. We provide free on-site estimates.'), category: 'cost' },
    // Pavers & Hardscapes FAQs
    { question: 'How long do paver patios last in Utah?', answer: richText('A properly installed paver patio with an engineered base lasts 25-50 years in Utah\'s climate. The key is base preparation — 6-8 inches of compacted aggregate that prevents settling and shifting during freeze-thaw cycles. Individual pavers that crack or stain can be replaced without disturbing the rest of the patio.'), category: 'general' },
    { question: 'Are pavers better than concrete for patios?', answer: richText('For Utah\'s freeze-thaw climate, pavers are generally superior to poured concrete. Poured concrete develops cracks as the ground shifts, requiring costly repairs or full replacement. Interlocking pavers flex with ground movement without cracking. They\'re also easier to repair — you can replace individual pavers instead of tearing out an entire slab.'), category: 'general' },
    { question: 'How much does a paver patio cost per square foot?', answer: richText('Paver patio installation in Utah typically costs $15-$35 per square foot, including materials, base preparation, and labor. Budget-friendly concrete pavers start around $15/sq ft, while premium natural stone or large-format porcelain pavers can reach $35/sq ft or more. A typical 300 sq ft patio runs $4,500-$10,500 installed.'), category: 'cost' },
    { question: 'Do paver patios need maintenance?', answer: richText('Paver patios require minimal maintenance: annual polymeric sand replenishment (every 2-3 years), occasional pressure washing, and prompt weed removal. Unlike concrete, pavers don\'t need sealing (though optional sealers can enhance color). Snow removal is safe with a standard snow blower or shovel — pavers handle salt and ice melt without damage.'), category: 'general' },
    { question: 'Can you install pavers over existing concrete?', answer: richText('In some cases, yes — if the existing concrete is level, structurally sound, and has proper drainage. Pavers are installed on a thin sand setting bed over the concrete. However, if the existing concrete is cracked, heaved, or has drainage issues, removal and a proper aggregate base installation is the better long-term investment.'), category: 'general' },
    { question: 'Do I need a permit for a paver patio in Utah?', answer: richText('Most residential paver patios don\'t require a building permit. However, retaining walls over 4 feet, structures with electrical or plumbing (outdoor kitchens), and patios that affect drainage patterns may need permits. HOA approval is often required. BaseScape verifies all requirements before starting your project.'), category: 'code-compliance' },
    // Artificial Turf FAQs
    { question: 'How long does artificial turf last?', answer: richText('Premium artificial turf installed with proper base preparation lasts 15-20 years. UV-stabilized fibers resist fading from Utah\'s intense sun exposure. The infill may need replenishment every 5-7 years. Lifespan depends on usage intensity — pet areas and high-traffic zones may need replacement sooner than decorative lawns.'), category: 'general' },
    { question: 'Is artificial turf safe for pets?', answer: richText('Yes. Modern pet-friendly turf features antimicrobial infill that prevents bacteria and odor. Liquid waste drains through the turf (30+ inches per hour drainage rate), and solid waste is easily picked up. Regular rinsing with a garden hose keeps the surface clean. We recommend antimicrobial infill options like Zeofill or BioFill for homes with dogs.'), category: 'general' },
    { question: 'Does artificial turf get hot in summer?', answer: richText('Artificial turf can get warm on hot summer days, reaching 120-150°F in direct sunlight. However, it cools quickly in shade and with a light spray of water. We offer heat-reflective turf options with cooling technology that reduces surface temperatures by 15-20%. For play areas, we recommend shaded installations or cool-turf products.'), category: 'general' },
    { question: 'How much water does artificial turf save?', answer: richText('A typical 1,000 sq ft lawn uses 40,000-60,000 gallons of water per year in Utah. Artificial turf eliminates virtually all of that — saving $200-$500+ per year on water bills alone. Add in eliminated costs for mowing, fertilizing, aerating, and weed control, and most homeowners save $500-$1,000+ annually.'), category: 'cost' },
    { question: 'Are there rebates for artificial turf in Utah?', answer: richText('Several Utah water districts offer rebates for converting natural grass to water-efficient landscaping, including artificial turf. Rebates typically range from $1-$3 per square foot, potentially covering 10-30% of installation costs. BaseScape helps you identify and apply for available rebates in your area.'), category: 'financing-rebates' },
    { question: 'Does artificial turf drain well in rain and snow?', answer: richText('Premium artificial turf drains at 30+ inches per hour — significantly faster than natural grass. Combined with a properly graded aggregate base, water passes through the turf and into the ground without pooling. Snow melts normally on turf and can be gently removed with a leaf blower or plastic shovel.'), category: 'drainage-moisture' },
  ]

  for (const faq of faqCategories) {
    await payload.create({
      collection: 'faqs',
      data: {
        ...faq,
        status: 'published',
        sortOrder: 0,
      } as any,
    })
  }

  // 6. Sample Reviews
  console.log('Creating Sample Reviews...')
  const reviews = [
    { reviewerName: 'Sarah M.', reviewText: 'We had BaseScape convert our walkout last spring and it completely changed how we use our home. The basement went from a dark storage dump to a bright one-bedroom apartment that rents for $1,600/month. Six months in, the rental income has already made a serious dent in our mortgage. The crew was professional, the structural engineer explained everything clearly, and they finished in five weeks. Worth every penny.', starRating: 5, source: 'via Google', featured: true },
    { reviewerName: 'David L.', reviewText: 'We were nervous about living in the house during a full basement remodel, but BaseScape\'s dust containment system genuinely works. They sealed off the construction area with plastic barriers and ran negative air pressure the entire build. My wife has allergies and she said she never once noticed dust upstairs. The crew showed up on time every morning, cleaned up every evening, and finished our theater room and guest suite right on schedule. Very impressed with the professionalism.', starRating: 5, source: 'via Google', featured: true },
    { reviewerName: 'Jennifer K.', reviewText: 'We were about to list our house and our agent told us the two basement bedrooms couldn\'t be counted without egress windows — which would have cost us tens of thousands in listing price. BaseScape installed two egress windows in three days, handled the permits and inspections, and now both rooms are code-compliant. Bonus: the natural light completely transformed those rooms. They went from feeling like a cave to bright, inviting spaces. Wish we had done it years ago.', starRating: 5, source: 'via Yelp', featured: true },
  ]

  for (const review of reviews) {
    await payload.create({
      collection: 'reviews',
      data: {
        ...review,
        status: 'published',
      } as any,
    })
  }

  // 7. Sample Project
  console.log('Creating Sample Project...')
  await payload.create({
    collection: 'projects',
    data: {
      title: 'Draper Walkout — Full Basement Access',
      slug: 'draper-walkout-full-access',
      projectType: walkout.id,
      city: serviceAreaIds['Draper'],
      challenge: richText('Homeowner wanted to convert their dark, landlocked basement into a rentable walkout apartment with direct backyard access.'),
      solution: richText('Structural assessment, foundation wall extraction, steel header installation, walkout door framing, exterior grading, and landscape restoration.'),
      outcome: richText('Complete walkout conversion generating $1,500/month in rental income. Natural light floods the former basement. Property value increased by an estimated $60,000.'),
      beforeImages: [{ image: projectBefore, caption: 'Dark basement before conversion' }],
      afterImages: [{ image: projectAfter, caption: 'Bright walkout with landscape access' }],
      featured: true,
      status: 'published',
    } as any,
  })

  // 8. Paid Landing Pages
  console.log('Creating Paid Landing Pages...')

  await payload.create({
    collection: 'paid-landing-pages',
    data: {
      campaignSlug: 'walkout-basements',
      headline: 'Your Basement Could Be Earning $1,500/Month',
      subheadline: 'We build code-compliant walkout entries that turn finished basements into legal rental units. Fixed pricing, structural engineering included, 4–5 weeks from permit to done.',
      heroImage: heroWalkout,
      trustBadges: ['licensed', 'insured', 'free-estimate', 'no-hidden-charges'],
      formType: 'multi-step',
      targetService: walkout.id,
      suppressNavigation: true,
      utmCampaign: 'walkout-basements',
      bodyContent: {
        root: {
          type: 'root',
          children: [
            heading('Here\u2019s How the Numbers Work for Most Utah Homeowners'),
            paragraph('A finished walkout entry rents for $1,200\u2013$2,000/month on the Wasatch Front \u2014 that\u2019s $14,400\u2013$24,000/year in new income from space you already own.'),
            paragraph('Most homeowners recoup the full investment in under 2 years. A walkout adds an estimated $40,000\u2013$60,000 in appraised home value on day one. With Utah\u2019s HB 82 ADU laws, your basement apartment is legal and in demand.'),
            heading('Everything We Handle So You Don\u2019t Have To'),
            listItem('Structural engineering stamp \u2014 so your wall meets code the first time'),
            listItem('Full excavation and soil retention \u2014 we protect your yard and neighboring property'),
            listItem('Waterproof membrane with 10-year warranty \u2014 no leaks, guaranteed'),
            listItem('Concrete landing, stairs, and approach \u2014 finished and ready to use'),
            listItem('All permits and inspections \u2014 you never visit city hall'),
            listItem('Finish grading and full site cleanup \u2014 your yard looks better than before'),
            heading('How Your Walkout Gets Built'),
            paragraph('Step 1: We Visit Your Home \u2014 Free, no obligation.'),
            paragraph('Step 2: You Get a Fixed Price \u2014 No surprises, ever.'),
            paragraph('Step 3: We Handle the Paperwork \u2014 Permits, plans, inspections.'),
            paragraph('Step 4: We Build It \u2014 4\u20135 weeks on site.'),
            paragraph('Most projects completed in 6\u20138 weeks from contract to final inspection. Spring 2026 schedule is filling \u2014 book your visit this week.'),
            heading('Common Questions'),
            paragraph('How much does a walkout basement cost?'),
            paragraph('Most walkout projects on the Wasatch Front run $35,000\u2013$55,000 depending on site conditions, length of the opening, and finish level. You\u2019ll get a fixed price after our free site visit \u2014 no ranges, no surprises.'),
            paragraph('Do I need a permit?'),
            paragraph('Yes \u2014 and we handle all of it. We pull the building permit, coordinate the structural engineering stamp, and schedule every required inspection. You never visit city hall.'),
            paragraph('How long does it take?'),
            paragraph('4\u20135 weeks of on-site work after permits are approved (permit approval takes 1\u20132 weeks). Most projects are done in 6\u20138 weeks total.'),
            paragraph('What if you find something unexpected during excavation?'),
            paragraph('Any work outside the original scope is documented in a written change order with pricing you approve before we proceed. No surprise charges, ever.'),
            heading('Let\u2019s See If a Walkout Makes Sense for Your Home'),
            paragraph('The first step is a free 15-minute site visit. We\u2019ll evaluate your property and show you the numbers \u2014 no obligation.'),
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      seo: {
        metaTitle: 'Walkout Basements | Earn $1,500/Month from Your Basement',
        metaDescription: 'Code-compliant walkout basement entries on the Wasatch Front. Fixed pricing, structural engineering included, 4\u20135 weeks. Free site visit.',
        noindex: true,
      },
      status: 'published',
    } as any,
  })

  await payload.create({
    collection: 'paid-landing-pages',
    data: {
      campaignSlug: 'retaining-walls',
      headline: 'Retaining Walls That Actually Last on Wasatch Front Soil',
      subheadline: 'Engineered retaining walls that stop erosion, redirect water, and add usable yard space. Structural engineering included. Fixed pricing \u2014 no surprises.',
      heroImage: heroWalkout,
      trustBadges: ['licensed', 'insured', 'bonded', 'free-estimate'],
      formType: 'quick-callback',
      targetService: retainingWalls.id,
      suppressNavigation: true,
      utmCampaign: 'retaining-walls',
      bodyContent: {
        root: {
          type: 'root',
          children: [
            heading('Why Retaining Walls Can\u2019t Wait'),
            paragraph('Wasatch Front soils shift. Spring runoff, clay expansion, and freeze-thaw cycles put pressure on slopes every year. A failing hillside doesn\u2019t fix itself \u2014 it gets worse and more expensive.'),
            paragraph('Sound familiar? If you\u2019re seeing any of these, your slope is moving:'),
            listItem('Fence or existing wall starting to lean'),
            listItem('Cracks in your foundation, driveway, or patio'),
            listItem('Water pooling against the house after rain'),
            listItem('Soil creeping downhill or visible erosion channels'),
            listItem('Doors or windows that stick (sign of settling)'),
            paragraph('Even one of these means your slope is actively moving. The cost to fix it only goes up.'),
            heading('We\u2019ll Recommend the Right Wall for Your Site'),
            paragraph('Every slope is different. During your free site assessment, we evaluate soil type, grade, and drainage to recommend the best solution \u2014 not a one-size-fits-all answer.'),
            listItem('Segmental block walls \u2014 versatile, cost-effective, great for 2\u20136 ft heights'),
            listItem('Poured concrete walls \u2014 maximum strength for tall or load-bearing applications'),
            listItem('Natural stone walls \u2014 premium look with structural engineering behind it'),
            listItem('Terraced systems \u2014 multi-tier solutions that turn steep slopes into usable yard'),
            paragraph('All walls over 4 feet include structural engineering stamp. Drainage systems included in every project.'),
            heading('How Your Wall Gets Built'),
            paragraph('Step 1: We Assess Your Site \u2014 Soil, grade, drainage \u2014 free.'),
            paragraph('Step 2: You Get a Fixed Price \u2014 Engineered plans included.'),
            paragraph('Step 3: We Build the Wall \u2014 Proper base, drainage, backfill.'),
            paragraph('Step 4: You Get Your Yard Back \u2014 Inspected, cleaned up, done.'),
            heading('Common Questions'),
            paragraph('How much does a retaining wall cost?'),
            paragraph('It depends on height, length, material, and site conditions. A short segmental block wall runs less than a tall engineered concrete wall. You\u2019ll get a fixed price after our free site visit \u2014 no vague ranges.'),
            paragraph('Do retaining walls need permits?'),
            paragraph('In most Wasatch Front cities, walls over 4 feet require a permit and structural engineering. We handle both. Even shorter walls get proper engineering when the soil or grade warrants it.'),
            paragraph('How long does construction take?'),
            paragraph('Most retaining wall projects take 1\u20133 weeks of on-site work, depending on length and complexity. Terraced or multi-wall systems may take longer.'),
            paragraph('What happens if I wait?'),
            paragraph('Slope erosion is progressive \u2014 every rain cycle makes it worse. A wall that costs $X today may cost 2\u20133X next year if the hillside reaches your foundation. The assessment is free. At minimum, you\u2019ll know what you\u2019re dealing with.'),
            heading('The Assessment Is Free. The Peace of Mind Is Immediate.'),
            paragraph('We\u2019ll evaluate your slope, explain your options, and give you a fixed price. No obligation, no pressure.'),
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      seo: {
        metaTitle: 'Retaining Walls | Wasatch Front Slope Solutions',
        metaDescription: 'Engineered retaining walls that stop erosion and add usable yard space. Structural engineering included. Fixed pricing. Free site assessment.',
        noindex: true,
      },
      status: 'published',
    } as any,
  })

  // 9. Lead Magnets
  console.log('Creating Lead Magnets...')

  const pdfDir = existsSync(resolve('docs/lead-magnets'))
    ? resolve('docs/lead-magnets')
    : resolve('..', 'docs', 'lead-magnets')

  const rwPdfPath = resolve(pdfDir, 'retaining-walls-guide.pdf')
  const rwPdfBuffer = readFileSync(rwPdfPath)
  const rwPdfMedia = await payload.create({
    collection: 'media',
    data: { alt: 'The Utah Homeowner\'s Guide to Retaining Walls PDF' },
    file: {
      data: rwPdfBuffer,
      mimetype: 'application/pdf',
      name: 'retaining-walls-guide.pdf',
      size: rwPdfBuffer.length,
    },
  })

  await payload.create({
    collection: 'lead-magnets',
    data: {
      title: 'The Utah Homeowner\'s Guide to Retaining Walls',
      slug: 'retaining-walls-guide',
      description: 'Costs, materials, common problems, and questions to ask any contractor — so you can make an informed decision.',
      file: rwPdfMedia.id,
      ctaText: 'Download Free Guide',
      requiredFields: ['email'],
      status: 'published',
    } as any,
  })

  const wbPdfPath = resolve(pdfDir, 'walkout-basements-guide.pdf')
  const wbPdfBuffer = readFileSync(wbPdfPath)
  const wbPdfMedia = await payload.create({
    collection: 'media',
    data: { alt: 'The Utah Homeowner\'s Guide to Walkout Basements PDF' },
    file: {
      data: wbPdfBuffer,
      mimetype: 'application/pdf',
      name: 'walkout-basements-guide.pdf',
      size: wbPdfBuffer.length,
    },
  })

  await payload.create({
    collection: 'lead-magnets',
    data: {
      title: 'The Utah Homeowner\'s Guide to Walkout Basements',
      slug: 'walkout-basements-guide',
      description: 'Costs, ROI, ADU potential, common problems, and questions to ask any contractor — so you can move forward with confidence.',
      file: wbPdfMedia.id,
      ctaText: 'Download Free Guide',
      requiredFields: ['email'],
      status: 'published',
    } as any,
  })

  console.log('Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
