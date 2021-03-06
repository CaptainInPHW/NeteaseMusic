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
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ({

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * song-upload.js
 * Copyright (C) 2018 daijt <daijt@david.local>
 *
 * Distributed under terms of the MIT license.
 */
(function () {
    'use strict';

    var view = {
        el: $('.upload-page'),
        render: function render(data) {
            this.el.append(data);
        },
        uploading: function uploading() {
            this.el.find('#upload-area').addClass('uploading');
        },
        uploaded: function uploaded() {
            this.el.find('#upload-area').removeClass('uploading');
        }
    };

    var model = {
        data: {
            song: '',
            singer: '',
            lyric: '',
            url: ''
        },
        status: true,
        template: ' \n            <div id="upload-area">\n                <div id="upload-button">\u9009\u62E9\u6587\u4EF6</div>\n            </div> \n        ',
        refreshData: function refreshData(up, info) {
            var resdata = this.splitSongInfo(JSON.parse(info.response), up.getOption('domain'));
            this.data = JSON.parse(JSON.stringify(resdata));
        },
        splitSongInfo: function splitSongInfo(_ref, domain) {
            var key = _ref.key;

            var rmSuffix = key.replace(/.mp3|.mp4|.flac/, '');
            var splitSongName = rmSuffix ? rmSuffix.split('-') : key.split('-');
            if (splitSongName.length === 2) {
                return {
                    song: splitSongName[0].trim(),
                    singer: splitSongName[1].trim(),
                    url: domain + '/' + key,
                    lyric: '',
                    cover: ''
                };
            } else {
                return {
                    song: key,
                    singer: '',
                    url: domain + '/' + key,
                    lyric: '',
                    cover: ''
                };
            }
        }
    };

    var controller = {
        init: function init() {
            view.render(model.template);
            this.initQiniu();
            this.bindEvents();
        },
        initQiniu: function initQiniu() {
            var uploader = Qiniu.uploader({
                runtimes: 'html5',
                browse_button: 'upload-button',
                uptoken_url: 'http://207.148.65.58:1234/uptoken',
                domain: 'p3zj54rve.bkt.clouddn.com',
                container: 'upload-area',
                max_file_size: '100MB',
                dragdrop: true,
                drop_element: 'upload-area',
                chunk_size: '10MB',
                auto_start: true,
                init: {
                    BeforeUpload: function BeforeUpload() {
                        if (model.status) {
                            model.status = !model.status;
                        } else {
                            return false;
                        }
                    },
                    UploadProgress: function UploadProgress() {
                        view.uploading();
                    },
                    FileUploaded: function FileUploaded(up, file, info) {
                        model.refreshData(up, info);
                        view.uploaded();
                        EventsHub.publish('uploaded', model.data);
                        model.status = !model.status;
                    }
                }
            });
        },
        bindEvents: function bindEvents() {
            EventsHub.subscribe('new', function () {
                view.el.removeClass('hide');
                EventsHub.publish('uploading', '用户需要上传歌曲，侧边栏歌曲激活状态请取消！');
            });
            EventsHub.subscribe('editing', function () {
                view.el.addClass('hide');
            });
            EventsHub.subscribe('modify', function () {
                view.el.addClass('hide');
            });
        }
    };

    controller.init();
})();

/***/ })

/******/ });