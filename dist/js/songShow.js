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
/******/ 	return __webpack_require__(__webpack_require__.s = 29);
/******/ })
/************************************************************************/
/******/ ({

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * song-show.js
 * Copyright (C) 2018 daijt
 *
 * Distributed under terms of the MIT license.
 */
(function () {
    'use strict';

    var view = {
        el: $('.info-page'),
        render: function render(data) {
            this.el.empty().append(data);
        },
        show: function show() {
            this.el.removeClass('hide');
        },
        hide: function hide() {
            this.el.addClass('hide');
        },
        confirm: function confirm(resolve) {
            alertify.confirm('确定删除吗？此操作不可恢复！', resolve);
        },
        decomposeDom: function decomposeDom() {
            return {
                $songDom: this.el.find('.song'),
                $singerDom: this.el.find('.singer'),
                $lyricDom: this.el.find('.lyric'),
                $coverDom: this.el.find('.cover')
            };
        }
    };

    var model = {
        data: {},
        template: '\n            <div class="show-area ">\n                <label>\u6B4C\u66F2\u540D\u79F0</label>\n                <input type="text" class="song" name="song" value="{{song}}">\n                <label>\u6B4C\u624B</label>\n                <input type="text" class="singer" name="singer" value="{{singer}}">\n                <label>\u6B4C\u8BCD</label>\n                <textarea class="lyric" name="lyric" cols="30" rows="8"">{{lyric}}</textarea>\n                <label>\u5C01\u9762\u94FE\u63A5</label>\n                <input type="text" class="cover" name="cover" value="{{cover}}">\n                <div class="button-wrapper">\n                    <div class="delete"><i class="iconfont icon-warning"></i>\u5220&nbsp;&nbsp;\u9664</div>\n                    <div class="confirm"><i class="iconfont icon-trues-active"></i>\u786E&nbsp;&nbsp;\u5B9A</div>\n                </div>\n            </div>\n        ',
        temporaryTemplate: '',
        refreshData: function refreshData(data) {
            this.data = JSON.parse(JSON.stringify(data));
        },
        generateTemporaryTemplate: function generateTemporaryTemplate(template, data) {
            for (var key in data) {
                template = template.replace('{{' + key + '}}', data[key]);
            }
            return template;
        },
        deleteData: function deleteData(confirm) {
            if (confirm) {
                var song = AV.Object.createWithoutData('SongList', model.data.id);
                song.destroy().then(function () {
                    // console.log('删除成功！')
                }, function (error) {
                    console.log(error);
                });
                return true;
            } else {
                return false;
            }
        },
        fetchModifiedData: function fetchModifiedData(view) {
            return {
                song: view.$songDom.val(),
                singer: view.$singerDom.val(),
                lyric: view.$lyricDom.val(),
                cover: view.$coverDom.val()
            };
        },
        updateData: function updateData(modifiedData) {
            var modified = {
                song: false,
                singer: false,
                lyric: false,
                cover: false
            };
            for (var key in modifiedData) {
                if (this.data[key] !== modifiedData[key]) {
                    this.data[key] = modifiedData[key];
                    modified[key] = true;
                }
            }
            if (modified.song || modified.singer || modified.lyric || modified.cover) {
                var song = AV.Object.createWithoutData('SongList', this.data.id);
                for (var _key in modified) {
                    if (modified[_key]) {
                        song.set(_key, this.data[_key]);
                    }
                }
                song.save();
            }
        }
    };

    var controller = {
        init: function init() {
            this.bindEvents();
        },
        bindEvents: function bindEvents() {
            EventsHub.subscribe('modify', function (data) {
                model.refreshData(data);
                view.show();
                view.render(model.generateTemporaryTemplate(model.template, model.data));
            });
            EventsHub.subscribe('new', function () {
                view.hide();
            });
            this.deleteSong();
            this.modifySong();
        },
        deleteSong: function deleteSong() {
            view.el.on('click', '.delete', function () {
                view.confirm(function () {
                    view.hide();
                    EventsHub.publish('delete', '用户歌曲已删除！');
                });
            });
        },
        modifySong: function modifySong() {
            view.el.on('click', '.confirm', function () {
                model.updateData(model.fetchModifiedData(view.decomposeDom()));
                EventsHub.publish('update', model.data);
            });
        }
    };

    controller.init();
})();

/***/ })

/******/ });