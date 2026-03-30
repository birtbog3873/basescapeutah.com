"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@smithy+url-parser@4.2.12";
exports.ids = ["vendor-chunks/@smithy+url-parser@4.2.12"];
exports.modules = {

/***/ "(rsc)/../node_modules/.pnpm/@smithy+url-parser@4.2.12/node_modules/@smithy/url-parser/dist-cjs/index.js":
/*!*********************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@smithy+url-parser@4.2.12/node_modules/@smithy/url-parser/dist-cjs/index.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nvar querystringParser = __webpack_require__(/*! @smithy/querystring-parser */ \"(rsc)/../node_modules/.pnpm/@smithy+querystring-parser@4.2.12/node_modules/@smithy/querystring-parser/dist-es/index.js\");\n\nconst parseUrl = (url) => {\n    if (typeof url === \"string\") {\n        return parseUrl(new URL(url));\n    }\n    const { hostname, pathname, port, protocol, search } = url;\n    let query;\n    if (search) {\n        query = querystringParser.parseQueryString(search);\n    }\n    return {\n        hostname,\n        port: port ? parseInt(port) : undefined,\n        protocol,\n        path: pathname,\n        query,\n    };\n};\n\nexports.parseUrl = parseUrl;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrdXJsLXBhcnNlckA0LjIuMTIvbm9kZV9tb2R1bGVzL0BzbWl0aHkvdXJsLXBhcnNlci9kaXN0LWNqcy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYix3QkFBd0IsbUJBQU8sQ0FBQywwSkFBNEI7O0FBRTVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSw2Q0FBNkM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQiIsInNvdXJjZXMiOlsiL1VzZXJzL3N0ZXZlbmJ1bmtlci9jbGllbnRzL2dlbmVyYWwtY29udHJhY3Rpbmcvbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrdXJsLXBhcnNlckA0LjIuMTIvbm9kZV9tb2R1bGVzL0BzbWl0aHkvdXJsLXBhcnNlci9kaXN0LWNqcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBxdWVyeXN0cmluZ1BhcnNlciA9IHJlcXVpcmUoJ0BzbWl0aHkvcXVlcnlzdHJpbmctcGFyc2VyJyk7XG5cbmNvbnN0IHBhcnNlVXJsID0gKHVybCkgPT4ge1xuICAgIGlmICh0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiBwYXJzZVVybChuZXcgVVJMKHVybCkpO1xuICAgIH1cbiAgICBjb25zdCB7IGhvc3RuYW1lLCBwYXRobmFtZSwgcG9ydCwgcHJvdG9jb2wsIHNlYXJjaCB9ID0gdXJsO1xuICAgIGxldCBxdWVyeTtcbiAgICBpZiAoc2VhcmNoKSB7XG4gICAgICAgIHF1ZXJ5ID0gcXVlcnlzdHJpbmdQYXJzZXIucGFyc2VRdWVyeVN0cmluZyhzZWFyY2gpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBob3N0bmFtZSxcbiAgICAgICAgcG9ydDogcG9ydCA/IHBhcnNlSW50KHBvcnQpIDogdW5kZWZpbmVkLFxuICAgICAgICBwcm90b2NvbCxcbiAgICAgICAgcGF0aDogcGF0aG5hbWUsXG4gICAgICAgIHF1ZXJ5LFxuICAgIH07XG59O1xuXG5leHBvcnRzLnBhcnNlVXJsID0gcGFyc2VVcmw7XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/@smithy+url-parser@4.2.12/node_modules/@smithy/url-parser/dist-cjs/index.js\n");

/***/ }),

/***/ "(rsc)/../node_modules/.pnpm/@smithy+url-parser@4.2.12/node_modules/@smithy/url-parser/dist-es/index.js":
/*!********************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@smithy+url-parser@4.2.12/node_modules/@smithy/url-parser/dist-es/index.js ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   parseUrl: () => (/* binding */ parseUrl)\n/* harmony export */ });\n/* harmony import */ var _smithy_querystring_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @smithy/querystring-parser */ \"(rsc)/../node_modules/.pnpm/@smithy+querystring-parser@4.2.12/node_modules/@smithy/querystring-parser/dist-es/index.js\");\n\nconst parseUrl = (url) => {\n    if (typeof url === \"string\") {\n        return parseUrl(new URL(url));\n    }\n    const { hostname, pathname, port, protocol, search } = url;\n    let query;\n    if (search) {\n        query = (0,_smithy_querystring_parser__WEBPACK_IMPORTED_MODULE_0__.parseQueryString)(search);\n    }\n    return {\n        hostname,\n        port: port ? parseInt(port) : undefined,\n        protocol,\n        path: pathname,\n        query,\n    };\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzbWl0aHkrdXJsLXBhcnNlckA0LjIuMTIvbm9kZV9tb2R1bGVzL0BzbWl0aHkvdXJsLXBhcnNlci9kaXN0LWVzL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQThEO0FBQ3ZEO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsWUFBWSw2Q0FBNkM7QUFDekQ7QUFDQTtBQUNBLGdCQUFnQiw0RUFBZ0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVuYnVua2VyL2NsaWVudHMvZ2VuZXJhbC1jb250cmFjdGluZy9ub2RlX21vZHVsZXMvLnBucG0vQHNtaXRoeSt1cmwtcGFyc2VyQDQuMi4xMi9ub2RlX21vZHVsZXMvQHNtaXRoeS91cmwtcGFyc2VyL2Rpc3QtZXMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcGFyc2VRdWVyeVN0cmluZyB9IGZyb20gXCJAc21pdGh5L3F1ZXJ5c3RyaW5nLXBhcnNlclwiO1xuZXhwb3J0IGNvbnN0IHBhcnNlVXJsID0gKHVybCkgPT4ge1xuICAgIGlmICh0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiBwYXJzZVVybChuZXcgVVJMKHVybCkpO1xuICAgIH1cbiAgICBjb25zdCB7IGhvc3RuYW1lLCBwYXRobmFtZSwgcG9ydCwgcHJvdG9jb2wsIHNlYXJjaCB9ID0gdXJsO1xuICAgIGxldCBxdWVyeTtcbiAgICBpZiAoc2VhcmNoKSB7XG4gICAgICAgIHF1ZXJ5ID0gcGFyc2VRdWVyeVN0cmluZyhzZWFyY2gpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBob3N0bmFtZSxcbiAgICAgICAgcG9ydDogcG9ydCA/IHBhcnNlSW50KHBvcnQpIDogdW5kZWZpbmVkLFxuICAgICAgICBwcm90b2NvbCxcbiAgICAgICAgcGF0aDogcGF0aG5hbWUsXG4gICAgICAgIHF1ZXJ5LFxuICAgIH07XG59O1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/@smithy+url-parser@4.2.12/node_modules/@smithy/url-parser/dist-es/index.js\n");

/***/ })

};
;