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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(2);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 2:
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(22);

(function () {
    'use strict';

    var appId = '3lYwUmOrkdkkv4zmxHzDbp3w-gzGzoHsz';
    var appKey = '5KWyRdYSGUIjOYDMirAnfDJ4';
    AV.init({ appId: appId, appKey: appKey });

    var mySwiper = new Swiper('.swiper-container', {
        autoplay: {
            delay: 5000
        },
        effect: 'fade'
    });
})(); /*
       * admin.js
       * Copyright (C) 2018 daijt
       *
       * Distributed under terms of the MIT license.
       */

/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(23);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./admin.scss", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./admin.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n/*\n * admin.css\n * Copyright (C) 2018 daijt\n *\n * Distributed under terms of the MIT license.\n */\n/* global variable */\n/* global style */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: content-box; }\n\na {\n  color: inherit;\n  text-decoration: none; }\n\nli {\n  list-style: none; }\n\ninput:focus {\n  outline: none; }\n\nbody {\n  height: 100vh;\n  display: flex;\n  font-family: \"Tahoma\", sans-serif;\n  box-sizing: border-box; }\n\n@keyframes fadein {\n  from {\n    opacity: 1;\n    transform: scale(0); }\n  to {\n    opacity: 0;\n    transform: scale(1); } }\n\n@keyframes blink {\n  from {\n    background: #efefef; }\n  to {\n    background: #c8c8c8; } }\n\n.blink {\n  animation: blink .5s 5 ease-in-out; }\n\n/* 滚动条 */\n::-webkit-scrollbar {\n  width: 5px; }\n\n/* 滚动条滑块 */\n::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  background: rgba(0, 0, 0, 0.1); }\n\n/* 仿网易云音乐 Mac 客户端 */\n.neteasemusic {\n  margin: auto;\n  width: 1000px;\n  height: 670px;\n  border-radius: 5px;\n  box-shadow: 0 0 10px rgba(64, 64, 64, 0.7);\n  transition: all ease .3s;\n  overflow: hidden; }\n  .neteasemusic:hover {\n    box-shadow: 0 0 15px rgba(64, 64, 64, 0.5); }\n\n/* 顶部导航及用户登录区 */\n.top-bar {\n  position: relative;\n  height: 60px;\n  background: #ba2502;\n  /* 个人信息 */ }\n  .top-bar .button {\n    position: absolute;\n    top: 5px;\n    left: 27px;\n    width: 12px;\n    height: 12px;\n    line-height: 10px;\n    text-align: center;\n    color: rgba(0, 0, 0, 0.4);\n    font-size: 12px;\n    border-radius: 50%;\n    background: #f6be4f; }\n    .top-bar .button::before {\n      content: '';\n      display: block;\n      position: absolute;\n      top: 0;\n      left: -20px;\n      width: 12px;\n      height: 12px;\n      border-radius: 50%;\n      background: #ed6b60; }\n    .top-bar .button::after {\n      content: '';\n      display: block;\n      position: absolute;\n      top: 0;\n      right: -20px;\n      width: 12px;\n      height: 12px;\n      border-radius: 50%;\n      background: #62c655; }\n  .top-bar .logo {\n    position: absolute;\n    bottom: 0;\n    left: 10px;\n    width: 160px;\n    height: 40px;\n    background-size: contain; }\n  .top-bar .profile {\n    position: absolute;\n    right: 20px;\n    bottom: 12px;\n    color: #eeeeee; }\n    .top-bar .profile li {\n      float: left;\n      padding: 0 8px;\n      line-height: 14px;\n      font-size: 14px; }\n      .top-bar .profile li .iconfont {\n        padding-right: 5px; }\n      .top-bar .profile li a {\n        text-decoration: underline; }\n\n/* 用户交互区 */\n.interaction {\n  display: flex;\n  /* 侧边栏 */\n  /* 右侧面板 */ }\n  .interaction .aside-bar {\n    position: relative;\n    width: 200px;\n    height: 610px;\n    background: #f6f6f6;\n    overflow: hidden;\n    /* 音乐列表 */\n    /* 添加歌曲 */ }\n    .interaction .aside-bar .song-list {\n      height: 549px;\n      font-size: 12px;\n      overflow: auto;\n      border-right: 1px solid #c8c8c8;\n      /* 歌曲选中样式 */ }\n      .interaction .aside-bar .song-list li {\n        /* 歌曲信息 */\n        /* 歌名 */\n        /* 歌手 */ }\n        .interaction .aside-bar .song-list li.active {\n          background: #c8c8c8; }\n        .interaction .aside-bar .song-list li.active::before {\n          position: absolute;\n          top: calc(50% - 20px);\n          left: 0;\n          content: '';\n          display: block;\n          width: 5px;\n          height: 40px;\n          background: #ba2502; }\n        .interaction .aside-bar .song-list li p {\n          overflow: hidden;\n          white-space: nowrap;\n          text-overflow: ellipsis; }\n        .interaction .aside-bar .song-list li p.song {\n          font-size: 13px; }\n        .interaction .aside-bar .song-list li p.singer {\n          color: #494949; }\n          .interaction .aside-bar .song-list li p.singer .iconfont {\n            padding-right: 3px;\n            font-weight: bolder;\n            font-size: 12px; }\n        .interaction .aside-bar .song-list li p.lyric {\n          display: none; }\n        .interaction .aside-bar .song-list li p.cover {\n          display: none; }\n    .interaction .aside-bar #add-song {\n      position: fixed;\n      padding: 19px 0;\n      width: 199px;\n      color: #333333;\n      text-align: center;\n      border-top: 1px solid #ddd;\n      border-radius: 0 0 0 5px;\n      cursor: pointer;\n      background: #ece9e6;\n      background: linear-gradient(to top, #e6e6e6, #ffffff);\n      transition: all ease .1s;\n      border-right: 1px solid #c8c8c8; }\n      .interaction .aside-bar #add-song:hover {\n        color: #ba2502; }\n      .interaction .aside-bar #add-song .iconfont {\n        padding-right: 5px; }\n  .interaction li {\n    position: relative;\n    padding: 5px 5px 5px 43px;\n    line-height: 20px;\n    cursor: pointer; }\n    .interaction li:nth-child(odd) {\n      background: #efefef; }\n    .interaction li:hover {\n      color: #ba2502; }\n    .interaction li::after {\n      position: absolute;\n      content: '';\n      top: calc(50% - 10px);\n      left: 10px;\n      width: 26px;\n      height: 26px;\n      display: block;\n      background-size: contain; }\n  .interaction .dashboard {\n    width: 800px;\n    background: #fafafa;\n    /* 欢迎页面 */\n    /* 查看音乐界面 */\n    /* 编辑歌曲页面 */\n    /* 新增歌曲页面 */ }\n    .interaction .dashboard .welcome-page {\n      margin: 70px auto;\n      width: 700px; }\n      .interaction .dashboard .welcome-page .swiper-container {\n        width: 100%;\n        height: 400px;\n        box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); }\n        .interaction .dashboard .welcome-page .swiper-container .swiper-slide {\n          background-position: center;\n          background-size: cover; }\n      .interaction .dashboard .welcome-page .welcome-info {\n        padding: 30px 0;\n        text-align: center;\n        font-size: 25px;\n        color: #ba2502; }\n        .interaction .dashboard .welcome-page .welcome-info .iconfont {\n          font-size: 25px;\n          padding-right: 10px; }\n    .interaction .dashboard .info-page {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      width: 100%;\n      height: 100%; }\n      .interaction .dashboard .info-page .show-area {\n        display: flex;\n        flex-direction: column;\n        padding: 10px 20px 20px;\n        width: 450px;\n        border-radius: 10px;\n        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2); }\n        .interaction .dashboard .info-page .show-area label {\n          padding: 17px 5px 3px;\n          text-align: left; }\n        .interaction .dashboard .info-page .show-area input {\n          padding: 0 10px;\n          height: 40px;\n          font-size: 16px;\n          color: #333333;\n          border: 1px solid #bbb;\n          box-sizing: border-box;\n          border-radius: 5px;\n          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.08); }\n          .interaction .dashboard .info-page .show-area input[name=\"url\"] {\n            cursor: text;\n            color: #999999; }\n        .interaction .dashboard .info-page .show-area .lyric {\n          padding: 10px;\n          font-size: 16px;\n          resize: none;\n          border: 1px solid #bbbbbb;\n          border-radius: 5px;\n          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.08); }\n          .interaction .dashboard .info-page .show-area .lyric:focus {\n            outline: none; }\n        .interaction .dashboard .info-page .show-area .button-wrapper {\n          display: flex;\n          justify-content: space-between;\n          padding: 30px 0 10px; }\n          .interaction .dashboard .info-page .show-area .button-wrapper .confirm,\n          .interaction .dashboard .info-page .show-area .button-wrapper .delete {\n            padding: 10px 0;\n            width: 200px;\n            line-height: 20px;\n            font-size: 18px;\n            text-align: center;\n            border: 1px solid #ba2502;\n            border-radius: 5px;\n            cursor: pointer; }\n            .interaction .dashboard .info-page .show-area .button-wrapper .confirm .iconfont,\n            .interaction .dashboard .info-page .show-area .button-wrapper .delete .iconfont {\n              padding-right: 10px; }\n          .interaction .dashboard .info-page .show-area .button-wrapper .delete {\n            color: #eeeeee;\n            background: #ba2502; }\n          .interaction .dashboard .info-page .show-area .button-wrapper .confirm {\n            color: #ba2502;\n            transition: all ease .3s; }\n            .interaction .dashboard .info-page .show-area .button-wrapper .confirm:hover {\n              color: #eeeeee;\n              background: #ba2502; }\n    .interaction .dashboard .edit-page {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      height: 100%; }\n      .interaction .dashboard .edit-page .edit-area {\n        display: flex;\n        flex-direction: column;\n        padding: 3px 20px 10px;\n        width: 500px;\n        border-radius: 10px;\n        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2); }\n        .interaction .dashboard .edit-page .edit-area label {\n          padding: 17px 5px 3px;\n          text-align: left; }\n        .interaction .dashboard .edit-page .edit-area input {\n          padding: 0 10px;\n          height: 40px;\n          font-size: 16px;\n          color: #333333;\n          border: 1px solid #bbb;\n          box-sizing: border-box;\n          border-radius: 5px;\n          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.08); }\n          .interaction .dashboard .edit-page .edit-area input[name=\"url\"] {\n            cursor: text;\n            color: #999999; }\n        .interaction .dashboard .edit-page .edit-area .lyric {\n          padding: 10px;\n          font-size: 16px;\n          resize: none;\n          border: 1px solid #bbbbbb;\n          border-radius: 5px;\n          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.08); }\n          .interaction .dashboard .edit-page .edit-area .lyric:focus {\n            outline: none; }\n        .interaction .dashboard .edit-page .edit-area .button-wrapper {\n          display: flex;\n          justify-content: center;\n          padding: 20px 0 10px; }\n          .interaction .dashboard .edit-page .edit-area .button-wrapper .confirm {\n            padding: 10px 0;\n            width: 200px;\n            line-height: 20px;\n            font-size: 18px;\n            text-align: center;\n            color: #ba2502;\n            border: 1px solid #ba2502;\n            border-radius: 5px;\n            cursor: pointer;\n            transition: all ease .3s; }\n            .interaction .dashboard .edit-page .edit-area .button-wrapper .confirm:hover {\n              color: #eeeeee;\n              background: #ba2502; }\n    .interaction .dashboard .upload-page {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      height: 100%; }\n      .interaction .dashboard .upload-page #upload-area {\n        position: relative;\n        margin-top: -55px;\n        width: 600px;\n        height: 400px;\n        border: 3px dashed #e3e3e3;\n        border-radius: 15px;\n        /* 文件上传动画 */\n        /* 上传文件按钮 */ }\n        .interaction .dashboard .upload-page #upload-area::before {\n          content: '\\8BF7\\9009\\62E9\\6587\\4EF6\\6216\\5C06\\6587\\4EF6\\62D6\\62FD\\81F3\\6B64\\8FDB\\884C\\4E0A\\4F20';\n          display: block;\n          position: absolute;\n          top: calc(50% - 10px);\n          left: calc(50% - 153px);\n          line-height: 20px;\n          font-size: 18px;\n          color: #d7d7d7; }\n        .interaction .dashboard .upload-page #upload-area.uploading::before {\n          opacity: 0;\n          content: '';\n          position: absolute;\n          top: calc(50% - 25px);\n          left: calc(50% - 25px);\n          width: 50px;\n          height: 50px;\n          background: #c8c8c8;\n          border-radius: 50%;\n          animation: fadein 2s linear infinite .8s; }\n        .interaction .dashboard .upload-page #upload-area.uploading::after {\n          opacity: 0;\n          content: '';\n          position: absolute;\n          top: calc(50% - 25px);\n          left: calc(50% - 25px);\n          width: 50px;\n          height: 50px;\n          background: #c8c8c8;\n          border-radius: 50%;\n          animation: fadein 2s linear infinite; }\n        .interaction .dashboard .upload-page #upload-area #upload-button {\n          position: absolute;\n          top: calc(100% + 20px);\n          padding: 10px;\n          width: 150px;\n          line-height: 20px;\n          font-size: 18px;\n          text-align: center;\n          color: #ba2502;\n          border-radius: 5px;\n          border: 1px solid #ba2502;\n          cursor: pointer;\n          transition: all ease .3s; }\n          .interaction .dashboard .upload-page #upload-area #upload-button:hover {\n            color: #eeeeee;\n            background: #ba2502; }\n          .interaction .dashboard .upload-page #upload-area #upload-button::after {\n            content: '\\4E0A\\4F20\\6587\\4EF6\\540D\\79F0\\8BF7\\6309\\7167   \\201C\\6B4C\\66F2\\540D   - \\6B4C\\624B\\201D   \\5F62\\5F0F\\89C4\\8303';\n            display: block;\n            position: absolute;\n            bottom: 0;\n            left: 110%;\n            white-space: nowrap;\n            overflow: hidden;\n            text-overflow: ellipsis;\n            color: #ba2502;\n            font-size: 12px; }\n    .interaction .dashboard .hide {\n      display: none; }\n", ""]);

// exports


/***/ })

/******/ });