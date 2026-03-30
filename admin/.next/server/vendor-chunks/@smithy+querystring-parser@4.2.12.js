"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@smithy+querystring-parser@4.2.12";
exports.ids = ["vendor-chunks/@smithy+querystring-parser@4.2.12"];
exports.modules = {

/***/ "(rsc)/../node_modules/.pnpm/@smithy+querystring-parser@4.2.12/node_modules/@smithy/querystring-parser/dist-es/index.js":
/*!************************************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@smithy+querystring-parser@4.2.12/node_modules/@smithy/querystring-parser/dist-es/index.js ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   parseQueryString: () => (/* binding */ parseQueryString)\n/* harmony export */ });\nfunction parseQueryString(querystring) {\n    const query = {};\n    querystring = querystring.replace(/^\\?/, \"\");\n    if (querystring) {\n        for (const pair of querystring.split(\"&\")) {\n            let [key, value = null] = pair.split(\"=\");\n            key = decodeURIComponent(key);\n            if (value) {\n                value = decodeURIComponent(value);\n            }\n            if (!(key in query)) {\n                query[key] = value;\n            }\n            else if (Array.isArray(query[key])) {\n                query[key].push(value);\n            }\n            else {\n                query[key] = [query[key], value];\n            }\n        }\n    }\n    return query;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrcXVlcnlzdHJpbmctcGFyc2VyQDQuMi4xMi9ub2RlX21vZHVsZXMvQHNtaXRoeS9xdWVyeXN0cmluZy1wYXJzZXIvZGlzdC1lcy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiL1VzZXJzL3N0ZXZlbmJ1bmtlci9jbGllbnRzL2dlbmVyYWwtY29udHJhY3Rpbmcvbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrcXVlcnlzdHJpbmctcGFyc2VyQDQuMi4xMi9ub2RlX21vZHVsZXMvQHNtaXRoeS9xdWVyeXN0cmluZy1wYXJzZXIvZGlzdC1lcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhxdWVyeXN0cmluZykge1xuICAgIGNvbnN0IHF1ZXJ5ID0ge307XG4gICAgcXVlcnlzdHJpbmcgPSBxdWVyeXN0cmluZy5yZXBsYWNlKC9eXFw/LywgXCJcIik7XG4gICAgaWYgKHF1ZXJ5c3RyaW5nKSB7XG4gICAgICAgIGZvciAoY29uc3QgcGFpciBvZiBxdWVyeXN0cmluZy5zcGxpdChcIiZcIikpIHtcbiAgICAgICAgICAgIGxldCBba2V5LCB2YWx1ZSA9IG51bGxdID0gcGFpci5zcGxpdChcIj1cIik7XG4gICAgICAgICAgICBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQoa2V5KTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKGtleSBpbiBxdWVyeSkpIHtcbiAgICAgICAgICAgICAgICBxdWVyeVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHF1ZXJ5W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgcXVlcnlba2V5XS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHF1ZXJ5W2tleV0gPSBbcXVlcnlba2V5XSwgdmFsdWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBxdWVyeTtcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/@smithy+querystring-parser@4.2.12/node_modules/@smithy/querystring-parser/dist-es/index.js\n");

/***/ })

};
;