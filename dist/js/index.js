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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
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
/* 2 */
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
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(6);

__webpack_require__(8);

// http://music.163.com/api/song/media?id=424496753 歌词 API
// https://api.imjad.cn/cloudmusic/?type=search&search_type=1&s=xxxxx 歌曲 API
// https://api.imjad.cn/cloudmusic/?type=playlist&id=309390784 歌单 API

/*
 * index.js
 * Copyright (C) 2018 daijt
 *
 * Distributed under terms of the MIT license.
 */
(function () {
    'use strict';

    // set REM

    $('head').prepend('\n        <style>\n            html {\n                font-size: ' + window.innerWidth / 20 + 'px;\n            }\n        </style>\n    ');

    // initial LeanCloud
    var appId = '3lYwUmOrkdkkv4zmxHzDbp3w-gzGzoHsz';
    var appKey = '5KWyRdYSGUIjOYDMirAnfDJ4';
    AV.init({ appId: appId, appKey: appKey });
})();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(7);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js!./normalize.css", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js!./normalize.css");

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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n    line-height: 1.15; /* 1 */\n    -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n    margin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n    font-size: 2em;\n    margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n    box-sizing: content-box; /* 1 */\n    height: 0; /* 1 */\n    overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n    font-family: monospace, monospace; /* 1 */\n    font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n    background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n    border-bottom: none; /* 1 */\n    text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n    font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n    font-family: monospace, monospace; /* 1 */\n    font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n    font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n}\n\nsub {\n    bottom: -0.25em;\n}\n\nsup {\n    top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n    border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n    font-family: inherit; /* 1 */\n    font-size: 100%; /* 1 */\n    line-height: 1.15; /* 1 */\n    margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n    overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n    text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n    -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n    border-style: none;\n    padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n    outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n    padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n    box-sizing: border-box; /* 1 */\n    color: inherit; /* 2 */\n    display: table; /* 1 */\n    max-width: 100%; /* 1 */\n    padding: 0; /* 3 */\n    white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n    vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n    overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n    box-sizing: border-box; /* 1 */\n    padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n    height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n    -webkit-appearance: textfield; /* 1 */\n    outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n    -webkit-appearance: button; /* 1 */\n    font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n    display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n    display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n    display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n    display: none;\n}\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(9);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss");

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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n/*\n * index.scss\n * Copyright (C) 2018 daijt\n *\n * Distributed under terms of the MIT license.\n */\n/* global variable */\n/* px2rem */\n/* global style */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: content-box;\n  -webkit-tap-highlight-color: transparent; }\n\na {\n  color: inherit;\n  text-decoration: none; }\n\nli {\n  list-style: none; }\n\ninput:focus,\ninput:active {\n  outline: none; }\n\n.noscroll {\n  overflow: hidden; }\n  .noscroll body {\n    overflow: hidden; }\n\nbody {\n  position: relative;\n  color: #333;\n  font-size: 16px;\n  font-family: \"Tahoma\", sans-serif;\n  box-sizing: border-box;\n  background: #FCFCFD; }\n\n@keyframes swing {\n  from {\n    transform: translateX(-3px); }\n  to {\n    transform: translateX(3px); } }\n\n@keyframes jump {\n  0% {\n    transform: translateY(0); }\n  50% {\n    transform: translateY(-15px); }\n  100% {\n    transform: translateY(0); } }\n\n@keyframes rotate {\n  100% {\n    transform: rotate(360deg); } }\n\n/* 仿网易云音乐 Mac 客户端 */\n.netease-music {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n  /* 顶部 logo 区域以及 tab 导航 */\n  /* 页面主体部分 */\n  /* 音乐播放界面 */\n  /* 全局隐藏样式 */ }\n  .netease-music .page-navigation {\n    position: fixed;\n    top: 0;\n    width: 100%;\n    z-index: 2;\n    /* logo 展示区 */\n    /* tab 导航 */ }\n    .netease-music .page-navigation .logo {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      padding: 18px 10px;\n      background: #d43c33; }\n      .netease-music .page-navigation .logo svg {\n        height: 25px; }\n      .netease-music .page-navigation .logo .contact-me {\n        position: relative;\n        padding: 5px 10px;\n        color: #FFFFFF;\n        font-size: 15px;\n        box-shadow: 0 0 2px 0 white;\n        border-radius: 15px; }\n        .netease-music .page-navigation .logo .contact-me::before {\n          content: 'click';\n          display: block;\n          position: absolute;\n          top: calc(50% - 7.5px);\n          left: -60px;\n          height: 15px;\n          line-height: 15px;\n          font-size: 15px; }\n        .netease-music .page-navigation .logo .contact-me::after {\n          content: '\\2192';\n          display: block;\n          position: absolute;\n          top: calc(50% - 7.5px);\n          left: -26px;\n          height: 15px;\n          line-height: 15px;\n          font-size: 20px;\n          animation: swing .3s ease infinite alternate-reverse; }\n        .netease-music .page-navigation .logo .contact-me .iconfont {\n          font-size: 15px;\n          padding-right: 3px; }\n    .netease-music .page-navigation #nav-tab {\n      display: flex;\n      justify-content: space-around;\n      background: #FCFCFD;\n      box-shadow: 0 0 1px rgba(0, 0, 0, 0.3); }\n      .netease-music .page-navigation #nav-tab .item {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        width: 6.66667rem;\n        font-size: 15px;\n        text-align: center; }\n        .netease-music .page-navigation #nav-tab .item span {\n          position: relative;\n          padding: 12px; }\n          .netease-music .page-navigation #nav-tab .item span.active {\n            color: #d43c33; }\n          .netease-music .page-navigation #nav-tab .item span.active::after {\n            content: '';\n            display: block;\n            position: absolute;\n            bottom: 0;\n            left: calc(50% - 50%);\n            width: 100%;\n            height: 2px;\n            background: #d43c33; }\n  .netease-music .page-container {\n    margin-top: 102px;\n    /* 推荐音乐页面 */ }\n    .netease-music .page-container .item-common {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      padding: 5px 0;\n      border-bottom: 1px solid rgba(0, 0, 0, 0.1); }\n      .netease-music .page-container .item-common .song-info {\n        overflow: hidden; }\n        .netease-music .page-container .item-common .song-info .song {\n          line-height: 25.5px;\n          font-size: 17px;\n          overflow: hidden;\n          white-space: nowrap;\n          text-overflow: ellipsis; }\n        .netease-music .page-container .item-common .song-info .singer {\n          display: flex;\n          align-items: center;\n          line-height: 18px;\n          font-size: 12px;\n          color: #888888; }\n          .netease-music .page-container .item-common .song-info .singer .SQsvg {\n            padding-right: 5px;\n            width: 14px; }\n      .netease-music .page-container .item-common .playsvg {\n        padding: 0 10px; }\n        .netease-music .page-container .item-common .playsvg svg {\n          width: 22px;\n          height: 22px; }\n    .netease-music .page-container .page-remd .subpage-remd {\n      padding-bottom: 20px; }\n      .netease-music .page-container .page-remd .subpage-remd .swiper-container {\n        width: 20rem;\n        height: 10rem; }\n        .netease-music .page-container .page-remd .subpage-remd .swiper-container .swiper-slide img {\n          width: 100%;\n          height: 100%; }\n        .netease-music .page-container .page-remd .subpage-remd .swiper-container .swiper-pagination-bullet-active {\n          background: #d43c33; }\n    .netease-music .page-container .page-remd .subpage-latest .title-latest {\n      position: relative;\n      padding-left: 8px;\n      font-size: 17px; }\n      .netease-music .page-container .page-remd .subpage-latest .title-latest::after {\n        content: '';\n        display: block;\n        position: absolute;\n        top: calc(50% - 8px);\n        left: 0;\n        width: 2px;\n        height: 16px;\n        font-size: 17px;\n        background: #d43c33; }\n    .netease-music .page-container .page-remd .subpage-latest ul {\n      margin-top: 15px;\n      padding-left: 10px; }\n    .netease-music .page-container .page-remd .subpage-profile {\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: center;\n      padding-top: 50px;\n      width: 20rem;\n      height: 10.65971rem;\n      background-size: cover; }\n      .netease-music .page-container .page-remd .subpage-profile .logosvg {\n        height: 44px; }\n      .netease-music .page-container .page-remd .subpage-profile .self-info {\n        margin-top: 50px;\n        display: flex; }\n        .netease-music .page-container .page-remd .subpage-profile .self-info li {\n          margin: 0 3px;\n          padding: 8px 10px;\n          border: 2px solid #333; }\n          .netease-music .page-container .page-remd .subpage-profile .self-info li .iconfont {\n            font-size: 23px; }\n        .netease-music .page-container .page-remd .subpage-profile .self-info.jump li:nth-child(1) {\n          animation: jump .3s 0s ease-in-out; }\n        .netease-music .page-container .page-remd .subpage-profile .self-info.jump li:nth-child(2) {\n          animation: jump .3s .1s ease-in-out; }\n        .netease-music .page-container .page-remd .subpage-profile .self-info.jump li:nth-child(3) {\n          animation: jump .3s .2s ease-in-out; }\n        .netease-music .page-container .page-remd .subpage-profile .self-info.jump li:nth-child(4) {\n          animation: jump .3s .3s ease-in-out; }\n      .netease-music .page-container .page-remd .subpage-profile .copyright {\n        margin: 5px 0;\n        text-align: center;\n        font-size: 12px;\n        line-height: 20px; }\n        .netease-music .page-container .page-remd .subpage-profile .copyright span {\n          color: #888888; }\n        .netease-music .page-container .page-remd .subpage-profile .copyright a {\n          color: #d43c33;\n          text-decoration: underline; }\n    .netease-music .page-container .page-hottop .bg-hottop {\n      position: relative;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: flex-start;\n      height: 7.77928rem;\n      padding-left: 20px;\n      background-size: contain; }\n      .netease-music .page-container .page-hottop .bg-hottop::after {\n        content: '';\n        display: block;\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0, 0, 0, 0.2); }\n      .netease-music .page-container .page-hottop .bg-hottop .hoticon {\n        width: 142px;\n        height: 67px;\n        z-index: 1;\n        background-position: -24px -30px;\n        background-size: 166px 97px; }\n      .netease-music .page-container .page-hottop .bg-hottop .hottime {\n        margin-top: 10px;\n        font-size: 12px;\n        color: #fffc;\n        z-index: 1; }\n    .netease-music .page-container .page-hottop .song-list .item-common {\n      display: flex;\n      justify-content: flex-start;\n      align-items: center;\n      padding: 0;\n      border: none; }\n      .netease-music .page-container .page-hottop .song-list .item-common .order {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        width: 40px;\n        color: #999999;\n        font-size: 17px;\n        font-family: Helvetica, sans-serif; }\n      .netease-music .page-container .page-hottop .song-list .item-common:nth-child(1) .order,\n      .netease-music .page-container .page-hottop .song-list .item-common:nth-child(2) .order,\n      .netease-music .page-container .page-hottop .song-list .item-common:nth-child(3) .order {\n        color: #d43c33; }\n      .netease-music .page-container .page-hottop .song-list .item-common .song-wrapper {\n        flex-grow: 1;\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        padding: 5px 0;\n        border-bottom: 1px solid rgba(0, 0, 0, 0.1); }\n    .netease-music .page-container .page-hottop .tip {\n      padding: 20px 0;\n      color: #999999;\n      text-align: center;\n      font-size: 14px; }\n    .netease-music .page-container .page-search .title {\n      position: relative;\n      padding: 10px 0 10px 8px;\n      font-size: 17px; }\n      .netease-music .page-container .page-search .title::after {\n        content: '';\n        display: block;\n        position: absolute;\n        top: calc(50% - 8px);\n        left: 0;\n        width: 2px;\n        height: 16px;\n        font-size: 17px;\n        background: #d43c33; }\n    .netease-music .page-container .page-search .search-area {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      padding: 15px; }\n      .netease-music .page-container .page-search .search-area .search-icon {\n        box-sizing: border-box;\n        margin: 4px -26px 0 0;\n        z-index: 1; }\n      .netease-music .page-container .page-search .search-area label {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        width: 100%; }\n        .netease-music .page-container .page-search .search-area label input {\n          padding: 0 30px;\n          width: 100%;\n          height: 30px;\n          color: #333;\n          font-size: 14px;\n          background: #ebecec;\n          border: none;\n          border-radius: 15px; }\n      .netease-music .page-container .page-search .search-area .clear-button {\n        box-sizing: border-box;\n        margin: 1px 0 0 -23px; }\n    .netease-music .page-container .page-search .top-serach-sample {\n      display: flex;\n      flex-wrap: wrap;\n      align-items: center;\n      padding: 0 5px; }\n      .netease-music .page-container .page-search .top-serach-sample li {\n        margin: 5px;\n        padding: 8px 12px;\n        line-height: 14px;\n        font-size: 14px;\n        border: 1px solid rgba(0, 0, 0, 0.1);\n        border-radius: 16px; }\n    .netease-music .page-container .page-search .top-search-result ul {\n      padding-left: 10px; }\n      .netease-music .page-container .page-search .top-search-result ul .not-found {\n        text-align: center;\n        font-size: 14px;\n        color: #999999;\n        line-height: 16px; }\n  .netease-music .page-play {\n    position: fixed;\n    top: 0;\n    left: 0;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    width: 100%;\n    height: 100vh;\n    transform: translateX(-100%);\n    transition: all .5s ease;\n    z-index: 3; }\n    .netease-music .page-play.show {\n      transform: translateX(0); }\n    .netease-music .page-play.showPseudoElm::before {\n      content: '';\n      display: block;\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background: rgba(0, 0, 0, 0.6);\n      z-index: 1; }\n    .netease-music .page-play.playing .needle {\n      transform: rotate(-3deg); }\n    .netease-music .page-play.playing .controller .ctrl-bar .play-pause-btn svg:first-child {\n      display: none; }\n    .netease-music .page-play.pause .needle {\n      transform: rotate(-25deg); }\n    .netease-music .page-play.pause .controller .ctrl-bar .play-pause-btn svg:last-child {\n      display: none; }\n    .netease-music .page-play .needle {\n      position: absolute;\n      top: -5px;\n      left: 9.17874rem;\n      width: 4.83092rem;\n      height: 7.24638rem;\n      background-size: contain;\n      transform-origin: 11px 0;\n      transition: all .5s ease;\n      z-index: 2; }\n    .netease-music .page-play .svg-logo {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      width: 100%;\n      z-index: 1; }\n      .netease-music .page-play .svg-logo svg {\n        height: 0.82126rem;\n        padding: 15px; }\n    .netease-music .page-play .song-wrap {\n      position: relative;\n      display: flex;\n      flex-direction: column;\n      z-index: 1; }\n      .netease-music .page-play .song-wrap .song-disc {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        width: 16.52174rem;\n        height: 16.52174rem;\n        border-radius: 50%;\n        background-size: cover;\n        animation: rotate 13s linear infinite; }\n        .netease-music .page-play .song-wrap .song-disc::before {\n          content: '';\n          display: block;\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: 100%;\n          height: 100%;\n          background-size: cover; }\n        .netease-music .page-play .song-wrap .song-disc .cover {\n          width: 10.24155rem;\n          height: 10.24155rem;\n          border-radius: 50%; }\n    .netease-music .page-play .song-info {\n      padding: 20px 0;\n      width: 100%;\n      color: #CCCCCC;\n      text-align: center;\n      z-index: 1; }\n      .netease-music .page-play .song-info .song {\n        padding: 15px;\n        color: #fefefe;\n        white-space: nowrap;\n        text-overflow: ellipsis;\n        overflow: hidden; }\n      .netease-music .page-play .song-info .song-scroll {\n        height: 73px;\n        overflow: hidden; }\n        .netease-music .page-play .song-info .song-scroll .lyric {\n          transition: all .3s ease; }\n          .netease-music .page-play .song-info .song-scroll .lyric p {\n            position: relative;\n            padding: 5px;\n            line-height: 14px;\n            font-size: 14px;\n            white-space: nowrap;\n            text-overflow: ellipsis;\n            overflow: hidden;\n            transition: all 0.3s ease; }\n            .netease-music .page-play .song-info .song-scroll .lyric p.active {\n              color: #fefefe;\n              font-weight: bolder; }\n    .netease-music .page-play .controller {\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: center;\n      position: absolute;\n      bottom: 0;\n      width: 100%;\n      z-index: 1; }\n      .netease-music .page-play .controller .ctrl-bar {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        padding: 30px 0; }\n        .netease-music .page-play .controller .ctrl-bar .play-pause-btn {\n          margin: 0 50px; }\n  .netease-music .hide {\n    display: none; }\n  .netease-music .hide-btn {\n    visibility: hidden; }\n", ""]);

// exports


/***/ })
/******/ ]);