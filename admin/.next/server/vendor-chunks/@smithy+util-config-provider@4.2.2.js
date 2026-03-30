"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@smithy+util-config-provider@4.2.2";
exports.ids = ["vendor-chunks/@smithy+util-config-provider@4.2.2"];
exports.modules = {

/***/ "(rsc)/../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/booleanSelector.js":
/*!*************************************************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/booleanSelector.js ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   booleanSelector: () => (/* binding */ booleanSelector)\n/* harmony export */ });\nconst booleanSelector = (obj, key, type) => {\n    if (!(key in obj))\n        return undefined;\n    if (obj[key] === \"true\")\n        return true;\n    if (obj[key] === \"false\")\n        return false;\n    throw new Error(`Cannot load ${type} \"${key}\". Expected \"true\" or \"false\", got ${obj[key]}.`);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrdXRpbC1jb25maWctcHJvdmlkZXJANC4yLjIvbm9kZV9tb2R1bGVzL0BzbWl0aHkvdXRpbC1jb25maWctcHJvdmlkZXIvZGlzdC1lcy9ib29sZWFuU2VsZWN0b3IuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLE1BQU0sR0FBRyxJQUFJLHFDQUFxQyxTQUFTO0FBQzlGIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVuYnVua2VyL2NsaWVudHMvZ2VuZXJhbC1jb250cmFjdGluZy9ub2RlX21vZHVsZXMvLnBucG0vQHNtaXRoeSt1dGlsLWNvbmZpZy1wcm92aWRlckA0LjIuMi9ub2RlX21vZHVsZXMvQHNtaXRoeS91dGlsLWNvbmZpZy1wcm92aWRlci9kaXN0LWVzL2Jvb2xlYW5TZWxlY3Rvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgYm9vbGVhblNlbGVjdG9yID0gKG9iaiwga2V5LCB0eXBlKSA9PiB7XG4gICAgaWYgKCEoa2V5IGluIG9iaikpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgaWYgKG9ialtrZXldID09PSBcInRydWVcIilcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgaWYgKG9ialtrZXldID09PSBcImZhbHNlXCIpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBsb2FkICR7dHlwZX0gXCIke2tleX1cIi4gRXhwZWN0ZWQgXCJ0cnVlXCIgb3IgXCJmYWxzZVwiLCBnb3QgJHtvYmpba2V5XX0uYCk7XG59O1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/booleanSelector.js\n");

/***/ }),

/***/ "(rsc)/../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/index.js":
/*!***************************************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/index.js ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SelectorType: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.SelectorType),\n/* harmony export */   booleanSelector: () => (/* reexport safe */ _booleanSelector__WEBPACK_IMPORTED_MODULE_0__.booleanSelector),\n/* harmony export */   numberSelector: () => (/* reexport safe */ _numberSelector__WEBPACK_IMPORTED_MODULE_1__.numberSelector)\n/* harmony export */ });\n/* harmony import */ var _booleanSelector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./booleanSelector */ \"(rsc)/../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/booleanSelector.js\");\n/* harmony import */ var _numberSelector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./numberSelector */ \"(rsc)/../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/numberSelector.js\");\n/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types */ \"(rsc)/../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/types.js\");\n\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrdXRpbC1jb25maWctcHJvdmlkZXJANC4yLjIvbm9kZV9tb2R1bGVzL0BzbWl0aHkvdXRpbC1jb25maWctcHJvdmlkZXIvZGlzdC1lcy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBa0M7QUFDRDtBQUNUIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVuYnVua2VyL2NsaWVudHMvZ2VuZXJhbC1jb250cmFjdGluZy9ub2RlX21vZHVsZXMvLnBucG0vQHNtaXRoeSt1dGlsLWNvbmZpZy1wcm92aWRlckA0LjIuMi9ub2RlX21vZHVsZXMvQHNtaXRoeS91dGlsLWNvbmZpZy1wcm92aWRlci9kaXN0LWVzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCAqIGZyb20gXCIuL2Jvb2xlYW5TZWxlY3RvclwiO1xuZXhwb3J0ICogZnJvbSBcIi4vbnVtYmVyU2VsZWN0b3JcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3R5cGVzXCI7XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/index.js\n");

/***/ }),

/***/ "(rsc)/../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/numberSelector.js":
/*!************************************************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/numberSelector.js ***!
  \************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   numberSelector: () => (/* binding */ numberSelector)\n/* harmony export */ });\nconst numberSelector = (obj, key, type) => {\n    if (!(key in obj))\n        return undefined;\n    const numberValue = parseInt(obj[key], 10);\n    if (Number.isNaN(numberValue)) {\n        throw new TypeError(`Cannot load ${type} '${key}'. Expected number, got '${obj[key]}'.`);\n    }\n    return numberValue;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrdXRpbC1jb25maWctcHJvdmlkZXJANC4yLjIvbm9kZV9tb2R1bGVzL0BzbWl0aHkvdXRpbC1jb25maWctcHJvdmlkZXIvZGlzdC1lcy9udW1iZXJTZWxlY3Rvci5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxNQUFNLEdBQUcsSUFBSSwyQkFBMkIsU0FBUztBQUM1RjtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGV2ZW5idW5rZXIvY2xpZW50cy9nZW5lcmFsLWNvbnRyYWN0aW5nL25vZGVfbW9kdWxlcy8ucG5wbS9Ac21pdGh5K3V0aWwtY29uZmlnLXByb3ZpZGVyQDQuMi4yL25vZGVfbW9kdWxlcy9Ac21pdGh5L3V0aWwtY29uZmlnLXByb3ZpZGVyL2Rpc3QtZXMvbnVtYmVyU2VsZWN0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IG51bWJlclNlbGVjdG9yID0gKG9iaiwga2V5LCB0eXBlKSA9PiB7XG4gICAgaWYgKCEoa2V5IGluIG9iaikpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgbnVtYmVyVmFsdWUgPSBwYXJzZUludChvYmpba2V5XSwgMTApO1xuICAgIGlmIChOdW1iZXIuaXNOYU4obnVtYmVyVmFsdWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYENhbm5vdCBsb2FkICR7dHlwZX0gJyR7a2V5fScuIEV4cGVjdGVkIG51bWJlciwgZ290ICcke29ialtrZXldfScuYCk7XG4gICAgfVxuICAgIHJldHVybiBudW1iZXJWYWx1ZTtcbn07XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/numberSelector.js\n");

/***/ }),

/***/ "(rsc)/../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/types.js":
/*!***************************************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/types.js ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SelectorType: () => (/* binding */ SelectorType)\n/* harmony export */ });\nvar SelectorType;\n(function (SelectorType) {\n    SelectorType[\"ENV\"] = \"env\";\n    SelectorType[\"CONFIG\"] = \"shared config entry\";\n})(SelectorType || (SelectorType = {}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrdXRpbC1jb25maWctcHJvdmlkZXJANC4yLjIvbm9kZV9tb2R1bGVzL0BzbWl0aHkvdXRpbC1jb25maWctcHJvdmlkZXIvZGlzdC1lcy90eXBlcy5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxDQUFDLG9DQUFvQyIsInNvdXJjZXMiOlsiL1VzZXJzL3N0ZXZlbmJ1bmtlci9jbGllbnRzL2dlbmVyYWwtY29udHJhY3Rpbmcvbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrdXRpbC1jb25maWctcHJvdmlkZXJANC4yLjIvbm9kZV9tb2R1bGVzL0BzbWl0aHkvdXRpbC1jb25maWctcHJvdmlkZXIvZGlzdC1lcy90eXBlcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdmFyIFNlbGVjdG9yVHlwZTtcbihmdW5jdGlvbiAoU2VsZWN0b3JUeXBlKSB7XG4gICAgU2VsZWN0b3JUeXBlW1wiRU5WXCJdID0gXCJlbnZcIjtcbiAgICBTZWxlY3RvclR5cGVbXCJDT05GSUdcIl0gPSBcInNoYXJlZCBjb25maWcgZW50cnlcIjtcbn0pKFNlbGVjdG9yVHlwZSB8fCAoU2VsZWN0b3JUeXBlID0ge30pKTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/@smithy+util-config-provider@4.2.2/node_modules/@smithy/util-config-provider/dist-es/types.js\n");

/***/ })

};
;