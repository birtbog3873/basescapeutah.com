"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@smithy+abort-controller@4.2.12";
exports.ids = ["vendor-chunks/@smithy+abort-controller@4.2.12"];
exports.modules = {

/***/ "(rsc)/../node_modules/.pnpm/@smithy+abort-controller@4.2.12/node_modules/@smithy/abort-controller/dist-es/AbortController.js":
/*!******************************************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@smithy+abort-controller@4.2.12/node_modules/@smithy/abort-controller/dist-es/AbortController.js ***!
  \******************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AbortController: () => (/* binding */ AbortController)\n/* harmony export */ });\n/* harmony import */ var _AbortSignal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbortSignal */ \"(rsc)/../node_modules/.pnpm/@smithy+abort-controller@4.2.12/node_modules/@smithy/abort-controller/dist-es/AbortSignal.js\");\n\nclass AbortController {\n    signal = new _AbortSignal__WEBPACK_IMPORTED_MODULE_0__.AbortSignal();\n    abort() {\n        this.signal.abort();\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrYWJvcnQtY29udHJvbGxlckA0LjIuMTIvbm9kZV9tb2R1bGVzL0BzbWl0aHkvYWJvcnQtY29udHJvbGxlci9kaXN0LWVzL0Fib3J0Q29udHJvbGxlci5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUE0QztBQUNyQztBQUNQLGlCQUFpQixxREFBVztBQUM1QjtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiL1VzZXJzL3N0ZXZlbmJ1bmtlci9jbGllbnRzL2dlbmVyYWwtY29udHJhY3Rpbmcvbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrYWJvcnQtY29udHJvbGxlckA0LjIuMTIvbm9kZV9tb2R1bGVzL0BzbWl0aHkvYWJvcnQtY29udHJvbGxlci9kaXN0LWVzL0Fib3J0Q29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBYm9ydFNpZ25hbCB9IGZyb20gXCIuL0Fib3J0U2lnbmFsXCI7XG5leHBvcnQgY2xhc3MgQWJvcnRDb250cm9sbGVyIHtcbiAgICBzaWduYWwgPSBuZXcgQWJvcnRTaWduYWwoKTtcbiAgICBhYm9ydCgpIHtcbiAgICAgICAgdGhpcy5zaWduYWwuYWJvcnQoKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/@smithy+abort-controller@4.2.12/node_modules/@smithy/abort-controller/dist-es/AbortController.js\n");

/***/ }),

/***/ "(rsc)/../node_modules/.pnpm/@smithy+abort-controller@4.2.12/node_modules/@smithy/abort-controller/dist-es/AbortSignal.js":
/*!**************************************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@smithy+abort-controller@4.2.12/node_modules/@smithy/abort-controller/dist-es/AbortSignal.js ***!
  \**************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AbortSignal: () => (/* binding */ AbortSignal)\n/* harmony export */ });\nclass AbortSignal {\n    onabort = null;\n    _aborted = false;\n    constructor() {\n        Object.defineProperty(this, \"_aborted\", {\n            value: false,\n            writable: true,\n        });\n    }\n    get aborted() {\n        return this._aborted;\n    }\n    abort() {\n        this._aborted = true;\n        if (this.onabort) {\n            this.onabort(this);\n            this.onabort = null;\n        }\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrYWJvcnQtY29udHJvbGxlckA0LjIuMTIvbm9kZV9tb2R1bGVzL0BzbWl0aHkvYWJvcnQtY29udHJvbGxlci9kaXN0LWVzL0Fib3J0U2lnbmFsLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGV2ZW5idW5rZXIvY2xpZW50cy9nZW5lcmFsLWNvbnRyYWN0aW5nL25vZGVfbW9kdWxlcy8ucG5wbS9Ac21pdGh5K2Fib3J0LWNvbnRyb2xsZXJANC4yLjEyL25vZGVfbW9kdWxlcy9Ac21pdGh5L2Fib3J0LWNvbnRyb2xsZXIvZGlzdC1lcy9BYm9ydFNpZ25hbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQWJvcnRTaWduYWwge1xuICAgIG9uYWJvcnQgPSBudWxsO1xuICAgIF9hYm9ydGVkID0gZmFsc2U7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIl9hYm9ydGVkXCIsIHtcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IGFib3J0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hYm9ydGVkO1xuICAgIH1cbiAgICBhYm9ydCgpIHtcbiAgICAgICAgdGhpcy5fYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLm9uYWJvcnQpIHtcbiAgICAgICAgICAgIHRoaXMub25hYm9ydCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMub25hYm9ydCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/@smithy+abort-controller@4.2.12/node_modules/@smithy/abort-controller/dist-es/AbortSignal.js\n");

/***/ })

};
;