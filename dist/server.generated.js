module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/extracter.js":
/*!*****************************!*\
  !*** ./server/extracter.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fs = __webpack_require__(/*! fs */ \"fs\");\n\nconst xml2js = __webpack_require__(/*! xml2js */ \"xml2js\");\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst {\n  base64encode,\n  base64decode\n} = __webpack_require__(/*! nodejs-base64 */ \"nodejs-base64\");\n\nvar mjAPI = __webpack_require__(/*! mathjax-node-svg2png */ \"mathjax-node-svg2png\");\n\nmjAPI.config({\n  MathJax: {\n    SVG: {\n      scale: 100,\n      font: \"MyriadPro-Regular\"\n    } // MatchWebFonts: {\n    //     matchFor: {\n    //         \"HTML-CSS\": false,\n    //         NativeMML: false,\n    //         SVG: true\n    //     },\n    //     fontCheckDelay: 2000,\n    //     fontCheckTimeout: 30 * 1000\n    // }\n\n  }\n});\nmjAPI.start();\n\nasync function sleep(millis) {\n  return new Promise(resolve => setTimeout(resolve, millis));\n}\n\nvar result = MyFunction('./T_13570164641479204.xml');\n\nasync function MyFunction(theXmlFile) {\n  var parser = new xml2js.Parser();\n  fs.readFile(theXmlFile, async function (err, data) {\n    parser.parseString(data, async function (err, result) {\n      let data = JSON.stringify(result, null, 2);\n      fs.writeFileSync('xml.json', data);\n      var quest = result.questionSet;\n      var que = quest.question; // console.log(que)\n\n      que.forEach(async function (value) {\n        // console.log(value.media_set[0].internal_media)\n        if (typeof value.media_set !== 'undefined') {\n          var internalMedia = value.media_set[0].internal_media;\n\n          for (media of internalMedia) {\n            // var buff = new Buffer(media.mediaData[0].data, 'base64');\n            var decoded = base64decode(media.mediaData[0].data[0]);\n            var fileName = media.name[0];\n            var i = 0;\n\n            if (fileName.includes('mml')) {\n              console.log(\"start\", fileName);\n              mjAPI.typeset({\n                math: decoded,\n                format: \"MathML\",\n                // or \"inline-TeX\", \"MathML\"\n                // svg: true,\n                // css: true,\n                png: true,\n                // enable PNG generation\n                scale: 3,\n                speakText: true,\n                useFontCache: false,\n                useGlobalCache: false\n              }, async function (data) {\n                console.log(i);\n\n                if (!data.errors) {\n                  // var orignalSet[decoded] = data.svg;\n                  // console.log(data.png)\n                  var base64String = data.png;\n                  console.log(fileName);\n                  var base64Image = base64String.split(';base64,').pop();\n                  fs.writeFileSync(`./Output/${fileName}.png`, base64Image, {\n                    encoding: 'base64'\n                  }, function (err, data) {\n                    if (err) console.log(err);\n                    console.log(\"Successfully Written to File.\");\n                  });\n                }\n\n                i++;\n              });\n            }\n          }\n        }\n      }); // console.log(XLSX.utils.sheet_to_json(ws));\n\n      console.log('Done');\n    });\n  });\n  return 'true';\n}\n\n//# sourceURL=webpack:///./server/extracter.js?");

/***/ }),

/***/ 0:
/*!**************************************************!*\
  !*** multi babel-polyfill ./server/extracter.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! babel-polyfill */\"babel-polyfill\");\nmodule.exports = __webpack_require__(/*! D:\\Work\\GIT\\Javascript\\EZTExtract\\server\\extracter.js */\"./server/extracter.js\");\n\n\n//# sourceURL=webpack:///multi_babel-polyfill_./server/extracter.js?");

/***/ }),

/***/ "babel-polyfill":
/*!*********************************!*\
  !*** external "babel-polyfill" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"babel-polyfill\");\n\n//# sourceURL=webpack:///external_%22babel-polyfill%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "mathjax-node-svg2png":
/*!***************************************!*\
  !*** external "mathjax-node-svg2png" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mathjax-node-svg2png\");\n\n//# sourceURL=webpack:///external_%22mathjax-node-svg2png%22?");

/***/ }),

/***/ "nodejs-base64":
/*!********************************!*\
  !*** external "nodejs-base64" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"nodejs-base64\");\n\n//# sourceURL=webpack:///external_%22nodejs-base64%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "xml2js":
/*!*************************!*\
  !*** external "xml2js" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"xml2js\");\n\n//# sourceURL=webpack:///external_%22xml2js%22?");

/***/ })

/******/ });