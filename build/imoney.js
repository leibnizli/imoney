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
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Name: iMoney.js v0.0.1
 * Author: Thunk
 * Url: https://github.com/stormtea123/iMoney
 * Time: 2015-06-03 4:09:00 PM 
 */
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("iMoney requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }

    // Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    var rootiMoney, classList,
        _$ = window.$,
        classCache = {},
        class2type = {},
        emptyArray = [],
        core_version = "1.1.0",
        core_filter = emptyArray.filter,
        core_concat = emptyArray.concat,
        core_push = emptyArray.push,
        core_slice = emptyArray.slice,
        core_indexOf = emptyArray.indexOf,
        core_some = emptyArray.some,
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty,
        core_trim = core_version.trim,
        core_forEach = emptyArray.forEach,
        core_reduce = emptyArray.reduce,
        core_push = emptyArray.push,
        core_sort = emptyArray.sort,
        core_splice = emptyArray.splice,
        core_indexOf = emptyArray.indexOf,
        //用来排除空白字符
        core_rnotwhite = /\S+/g,
        rquickExpr = /#([\w-]*)$/;
    var iMoney = function(selector, context) {
        return new iMoney.fn.init(selector, context, rootiMoney);
    };
    iMoney.fn = iMoney.prototype = {
        constructor: iMoney,
        imoney: core_version,
        init: function(selector, context, rootiMoney) {
            var match, elem;
            if (!selector) {
                return this;
            }
            if (typeof selector === "string") {
                match = rquickExpr.exec(selector);
                //如果参数是HTML片段或者是#id字符
                if (match && !context) {
                    elem = document.getElementById(match[1]);
                    if (elem && elem.parentNode) {
                        this.length = 1;
                        this[0] = elem;
                    }
                    this.context = document;
                    this.selector = selector;
                    return this;
                    //如果没有指定上下文，或上下文是iMoney对象
                } else if (!context || context.imoney) {
                    return (context || rootiMoney).find(selector);
                } else {
                    return iMoney(context).find(selector);
                }
                //DOM对象
            } else if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
                //selector是函数
            } else if (iMoney.isFunction(selector)) {
                return rootiMoney.ready(selector);
            }

            if (selector.selector !== undefined) {
                this.selector = selector.selector;
                this.context = selector.context;
            }
            return iMoney.makeArray(selector, this);
        },
        //初始化一个空选择器
        selector: "",
        //iMoney集合DOM对象为0
        length: 0,
        toArray: function() {
            return core_slice.call(this);
        },
        get: function(num) {
            return num == null ? this.toArray() : (num < 0 ? this[this.length + num] : this[num]);
        },
        //返回一个iMoney封装过的DOM结果集，prevObject会在调用end方法的时候用到
        pushStack: function(elems) {
            var ret = iMoney.merge(this.constructor(), elems);
            ret.prevObject = this;
            ret.context = this.context;
            return ret;
        },
        each: function(callback, args) {
            return iMoney.each(this, callback, args);
        },
        ready: function(fn) {
            iMoney.ready(fn);
            return this;
        },
        slice: function() {
            return this.pushStack(core_slice.apply(this, arguments));
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        eq: function(i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        map: function(callback) {
            return this.pushStack(iMoney.map(this, function(elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        end: function() {
            return this.prevObject || this.constructor(null);
        },
        forEach: core_forEach,
        reduce: core_reduce,
        push: core_push,
        sort: core_sort,
        splice: core_splice,
        indexOf: core_indexOf,
    }
    iMoney.fn.init.prototype = iMoney.fn;
    rootiMoney = iMoney(document);
    iMoney.extend = iMoney.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            //跳过boolean和target
            i = 2;
        }
        if (typeof target !== "object" && !iMoney.isFunction(target)) {
            target = {};
        }
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (iMoney.isPlainObject(copy) || (copyIsArray = iMoney.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && iMoney.isArray(src) ? src : [];

                        } else {
                            clone = src && iMoney.isPlainObject(src) ? src : {};
                        }
                        target[name] = iMoney.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        //返回修改的对象
        return target;
    };
    //扩展iMoney方法
    iMoney.extend({
        noConflict: function(deep) {
            if (window.$ === iMoney) {
                window.$ = _$;
            }
            return iMoney;
        },
        ready: function(callback) {
            if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
                callback();
            } else {
                document.addEventListener('DOMContentLoaded', function() {
                    callback();
                }, false)
            }
            return this
        },
        isFunction: function(obj) {
            return iMoney.type(obj) === "function";
        },
        isArray: Array.isArray || function(obj) {
            return iMoney.type(obj) === "array";
        },
        isInArray: function(el, arr) {
            var i = arr.length
            while (i--) {
                if (arr[i] === el) return true
            }
            return false
        },
        isWindow: function(obj) {
            return obj != null && obj == obj.window;
        },
        isDocument: function(obj) {
            return obj != null && obj.nodeType == obj.DOCUMENT_NODE
        },
        isNumeric: function(obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },
        type: function(obj) {
            if (obj == null) {
                return String(obj);
            }
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[core_toString.call(obj)] || "object" :
                typeof obj;
        },
        //是否普通的对象
        isPlainObject: function(obj) {
            if (!obj || iMoney.type(obj) !== "object" || obj.nodeType || iMoney.isWindow(obj)) {
                return false;
            }
            var key;
            for (key in obj) {}
            return key === undefined || iMoney.hasProp(obj, key);
        },
        //是否空对象
        isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        error: function(msg) {
            throw new Error(msg);
        },
        //一个空对象
        noop: function() {},
        //转化驼峰的字符串
        camelCase: function(string) {
            return string.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(all, letter) {
                return (letter + "").toUpperCase();
            });
        },
        //节点名称
        nodeName: function(elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },
        //遍历对象或数组
        each: function(obj, callback, args) {
            var name,
                i = 0,
                length = obj.length,
                isObj = length === undefined || iMoney.isFunction(obj);
            if (args) {
                if (isObj) {
                    for (name in obj) {
                        if (callback.apply(obj[name], args) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.apply(obj[i++], args) === false) {
                            break;
                        }
                    }
                }

            } else {
                if (isObj) {
                    for (name in obj) {
                        if (callback.call(obj[name], name, obj[name]) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.call(obj[i], i, obj[i++]) === false) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },
        //去空格
        trim: function(text) {
            return text == null ? "" : core_trim.call(text);
        },
        //转换一个类似数组的对象成为真正的JavaScript数组
        makeArray: function(arr, results) {
            var type,
                ret = results || [];
            if (arr != null) {
                type = iMoney.type(arr);
                if (arr.length == null || type === "string" || type === "function" || type === "regexp" || iMoney.isWindow(arr)) {
                    core_push.call(ret, arr);
                } else {
                    iMoney.merge(ret, arr);
                }
            }

            return ret;
        },
        //在数组中查找指定值并返回它的索引
        inArray: function(elem, arr, i) {
            var len;

            if (arr) {
                if (core_indexOf) {
                    return core_indexOf.call(arr, elem, i);
                }

                len = arr.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

                for (; i < len; i++) {
                    if (i in arr && arr[i] === elem) {
                        return i;
                    }
                }
            }

            return -1;
        },
        //合并第二个数组到第一个数组中，不覆盖
        merge: function(first, second) {
            var l = second.length,
                i = first.length,
                j = 0;
            if (typeof l === "number") {
                for (; j < l; j++) {
                    first[i++] = second[j];
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }
            first.length = i;
            return first;
        },
        //查找满足过滤函数的数组元素，原始数组不受影响
        grep: function(elems, callback, inv) {
            var retVal,
                ret = [],
                i = 0,
                length = elems.length;
            inv = !!inv;
            //保存数组中通过callback验证的元素
            for (; i < length; i++) {
                retVal = !!callback(elems[i], i);
                if (inv !== retVal) {
                    ret.push(elems[i]);
                }
            }
            return ret;
        },
        //操作数组或对象里的所有元素
        map: function(elems, callback, arg) {
            var value, key,
                ret = [],
                i = 0,
                length = elems.length,
                isArray = elems instanceof iMoney || length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || iMoney.isArray(elems));
            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }
            } else {
                for (key in elems) {
                    value = callback(elems[key], key, arg);

                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }
            }
            return ret.concat.apply([], ret);
        },
        //检测obj中是否有prop属性
        hasProp: function(obj, prop) {
            return core_hasOwn.call(obj, prop);
        },
        getOwn: function(obj, prop) {
            return iMoney.hasProp(obj, prop) && obj[prop];
        },
        nextTick: function(fn) {
            setTimeout(fn, 4);
        },
        now: Date.now
    });
    iMoney.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    var insertHTML = function(position, args) {
        var argsLen = args.length
        var contents = args
        if (argsLen > 1 && position.indexOf("after") > -1) {
            contents = []
            var i = argsLen
            while (i--) {
                contents.push(args[i])
            }
        }
        for (var i = 0; i < argsLen; i++) {
            var content = contents[i]
            if (typeof content == "string" || typeof content == "number") {
                this.each(function() {
                    this.insertAdjacentHTML(position, content)
                })
            }
        }
    };
    var classRE = function(name) {
        return name in classCache ?
            classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
    };
    var matches = (function() {
        var names = [
            "mozMatchesSelector",
            "webkitMatchesSelector",
            "msMatchesSelector",
            "matches"
        ]
        var i = names.length
        while (i--) {
            var name = names[i]
            if (!Element.prototype[name]) continue
            return name
        }
    }());
    //扩展iMoney原型方法
    iMoney.fn.extend({
        //iMoney.find(selector, self[i], ret)
        find: function(selector) {
            var result = [];
            if (!selector) result = iMoney()
            if (this.length == 1) {
                result = this.pushStack(this[0].querySelectorAll(selector));
            } else if (this.length > 1) {
                result = this.map(function() {
                    return core_slice.call(this.querySelectorAll(selector))
                })
            }
            result.selector = this.selector ? this.selector + " " + selector : selector;
            return result;
        },
        hasClass: function(name) {
            if (!name) return false
            return emptyArray.some.call(this, function(el) {
                return this.test(el.className)
            }, classRE(name))
        },
        addClass: function(name) {
            if (!name) return this
            return this.each(function(i) {
                if (!('className' in this)) return;
                var oldClass = this.className;
                classList = [];
                name.split(/\s+/g).forEach(function(kclass) {
                    if (!iMoney(this).hasClass(kclass)) classList.push(kclass);
                }, this);
                if (classList.length) {
                    this.className = oldClass + (oldClass ? " " : "") + classList.join(" ")
                }
            })
        },
        removeClass: function(name) {
            return this.each(function(i) {
                if (!('className' in this)) return;
                if (name === undefined) return this.className = "";
                classList = this.className;
                name.split(/\s+/g).forEach(function(klass) {
                    classList = classList.replace(classRE(klass), " ");
                });
                this.className = classList.trim();
            })
        },
        css: function(property, value) {
            var valueType = typeof value
            var isString = valueType == "string"
            if (isString || valueType == "number") {
                return this.each(function() {
                    if (this.nodeType > 1) return
                    this.style[property] = value;
                })
            }
            if (valueType == "function") {
                return this.each(function(index) {
                    if (this.nodeType > 1) return
                    var oldValue = getComputedStyle(this).getPropertyValue(property)
                    this.style[property] = value.call(this, index, oldValue)
                })
            }
            if (typeof property == "string") {
                var el = this.get(0)
                if (!el || el.nodeType > 1) return
                return getComputedStyle(el).getPropertyValue(property)
            }
            if (iMoney.isArray(property)) {
                var el = this.get(0)
                if (!el || el.nodeType > 1) return
                var o = {}
                var styles = getComputedStyle(el)
                var propertyLen = property.length
                for (var i = 0; i < propertyLen; i++) {
                    var prop = property[i]
                    o[prop] = styles.getPropertyValue(prop)
                }
                return o
            }
            return this.each(function() {
                if (this.nodeType > 1) return
                for (key in property) {
                    this.style[key] = property[key]
                }
            })
        },
        attr: function(name, value) {
            var isFunc = typeof value == "function"
            if (typeof value == "string" || typeof value == "number" || isFunc) {
                return this.each(function(i) {
                    if (this.nodeType > 1) return
                    this.setAttribute(
                        name, isFunc ? value.call(this, i, this.getAttribute(name)) : value
                    )
                })
            }
            if (typeof name == "object") {
                return this.each(function() {
                    for (key in name) this.setAttribute(key, name[key])
                })
            }
            var el = this.get(0)
            if (!el || el.nodeType > 1) return
            var attrValue = el.getAttribute(name)
            if (attrValue == null) {
                return undefined
            }
            if (!attrValue) {
                return name
            }
            return attrValue
        },
        removeAttr: function(name) {
            return this.each(function() {
                this.nodeType === 1 && name.split(' ').forEach(function(attribute) {
                    this.removeAttribute(attribute);
                }, this)
            })
        },
        data: function(name, value) {
            var attrName = 'data-' + name.replace(/([A-Z])/g, '-$1').toLowerCase()
            var data = (1 in arguments) ?
                this.attr(attrName, value) :
                this.attr(attrName);
            return data !== null ? data : undefined
        },
        html: function(htmlString) {
            if (htmlString == null) {
                var el = this.get(0)
                if (!el) return
                return el.innerHTML
            }
            return this.each(function() {
                this.innerHTML = htmlString
            })
        },
        before: function() {
            insertHTML.call(this, "beforebegin", arguments)
            return this;
        },
        prepend: function() {
            insertHTML.call(this, "afterbegin", arguments)
            return this;
        },
        append: function() {
            insertHTML.call(this, "beforeend", arguments)
            return this;
        },
        after: function() {
            insertHTML.call(this, "afterend", arguments)
            return this;
        },
        is: function(selector, element) {
            var set = element ? [element] : this.get()
            var setLen = set.length
            if (typeof selector == "string") {
                for (var i = 0; i < setLen; i++) {
                    var el = set[i]
                    if (el.nodeType > 1) continue
                    if (el[matches](selector)) {
                        return true
                    }
                }
                return false
            }
        },
        children: function(selector) {
            var dom = []
            var self = this
            this.each(function() {
                if (this.nodeType > 1) return
                var nodes = this.children
                var nodesLen = nodes.length
                for (var i = 0; i < nodesLen; i++) {
                    var node = nodes[i]
                    if (!selector || self.is(selector, node)) {
                        dom.push(node)
                    }
                }
            })
            return this.pushStack(dom)
        },
        empty: function() {
            return this.each(function() {
                this.innerHTML = ''
            })
        },
        remove: function() {
            return this.each(function() {
                if (this.parentNode != null)
                    this.parentNode.removeChild(this)
            })
        }
    });
    if (!noGlobal) {
        window.iMoney = window.$ = iMoney;
    }
    return iMoney;
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_event_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_ajax_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_cookie_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_imoney_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_imoney_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__src_imoney_js__);



// import "./src/form.js";
// import "./src/support.js";


/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_3__src_imoney_js___default.a);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__imoney__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__imoney___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__imoney__);


var getEvents = function (element) {
    return element.eventListeners
};
var isNamespaced = function(event) {
    return /\./.test(event)
};
var splitNamespaces = function(event) {
    return event.split(".");
};
var getEventFromNamespace = function(event) {
    return splitNamespaces(event)[0]
};
var removeEvent = (function() {
    var isHandlerShared = function(el, event, registeredHandler) {
        var similarEventsHandlers = Object.keys(getEvents(el)).filter(function(prop) {
            return getEventFromNamespace(event) === getEventFromNamespace(prop)
        }).map(function(ev) {
            return getEvents(el)[ev]
        }).reduce(function(a, b) {
            return a.concat(b)
        }).filter(function(handler) {
            return handler === registeredHandler
        })
        if (similarEventsHandlers.length < 2) return false
        return true
    }
    var removeListener = function(el, event, namedHandler) {
        return function(registeredHandler) {
            if (namedHandler && namedHandler !== registeredHandler) return
            el.removeEventListener(event, registeredHandler)
            if (!isNamespaced(event) || isHandlerShared(el, event, registeredHandler)) return
            el.removeEventListener(getEventFromNamespace(event), registeredHandler)
        }
    }
    var clearRegisteredHandlers = function(registeredHandlers, namedHandler) {
        return registeredHandlers.filter(function(handler) {
            return namedHandler && namedHandler !== handler
        })
    }
    return function(el, namedHandler) {
        return function(event) {
            getEvents(el)[event].forEach(removeListener(el, event, namedHandler))
            getEvents(el)[event] = clearRegisteredHandlers(getEvents(el)[event], namedHandler)
        }
    }
}());
var getEventsToRemove = function(domElement, event) {
    return Object.keys(getEvents(domElement)).filter(function(prop) {
        return splitNamespaces(event).every(function(name) {
            return __WEBPACK_IMPORTED_MODULE_0__imoney___default.a.isInArray(name, splitNamespaces(prop))
        })
    })
}
var removeMatchedEvents = function(el, namedHandler) {
    return function(event) {
        getEventsToRemove(el, event).forEach(removeEvent(el, namedHandler))
    }
}
__WEBPACK_IMPORTED_MODULE_0__imoney___default.a.fn.extend({
    on: function (events, handler) {
        if (handler) {
            var eventsArr = events.trim().split(" ");
            return this.each(function () {
                if (!getEvents(this)) {
                    this.eventListeners = {}
                }
                eventsArr.forEach(function (event) {
                    if (!getEvents(this)[event]) {
                        getEvents(this)[event] = []
                    }
                    getEvents(this)[event].push(handler);
                    this.addEventListener(event, handler);
                    if (!isNamespaced(event)) return
                    this.addEventListener(getEventFromNamespace(event), handler)
                }, this)
            })
        }
    },
    off: function (events, handler) {
        if (typeof events == "object") {
            Object.keys(events).forEach(function (event) {
                this.off(event, events[event])
            }, this)
            return this
        }
        if (events) {
            events = events.trim().split(" ");
        }
        return this.each(function () {
            if (!getEvents(this)) return
            if (events) {
                events.forEach(removeMatchedEvents(this, handler))
                return
            }
            Object.keys(getEvents(this)).forEach(removeEvent(this))
        })
    }
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__imoney__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__imoney___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__imoney__);


var jsonpID = 0;
var defaults = {
    type: 'GET',
    dataType: 'json',
    success: empty,
    error: empty,
    complete: empty,
    context: null,
    global: true,
    accepts: {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json: 'application/json',
        xml: 'application/xml, text/xml',
        html: 'text/html',
        text: 'text/plain'
    },
    data:{},
    crossDomain: false,
    timeout: 0,
    processData: true,
    cache: true
}
function empty() {}
function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
}
function ajaxSuccess(data, xhr, settings) {
    var context = settings.context,
        status = 'success'
    settings.success.call(context, data, status, xhr);
}
function ajaxError(error, type, xhr, settings) {
    var context = settings.context
    settings.error.call(context, xhr, type, error);
}
__WEBPACK_IMPORTED_MODULE_0__imoney___default.a.extend({
    //jsonp
    ajaxJSONP: function(options) {
        var _callbackName = options.jsonpCallback,
            callbackName = _callbackName || ('jsonp' + (++jsonpID)),
            script = document.createElement('script'),
            originalCallback = window[callbackName],
            responseData,
            abortTimeout;
        script.addEventListener("error", function() {
            clearTimeout(abortTimeout);
            ajaxError(null, 'error', null, options)
        });
        script.addEventListener("load", function() {
            clearTimeout(abortTimeout);
            __WEBPACK_IMPORTED_MODULE_0__imoney___default()(script).remove();
            ajaxSuccess(responseData[0], null, options)
            window[callbackName] = originalCallback
            if (responseData && __WEBPACK_IMPORTED_MODULE_0__imoney___default.a.isFunction(originalCallback))
                originalCallback(responseData[0])

            originalCallback = responseData = undefined
        });
        //传入的参数作为返回的数据
        window[callbackName] = function() {
            responseData = arguments
        }
        script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
        document.head.appendChild(script)
        if (options.timeout > 0) abortTimeout = setTimeout(function() {
            throw new Error("timeout");
        }, options.timeout)
    },
    ajax: function(options) {
        var settings = $.extend(defaults, options || {}),
            xhr = new XMLHttpRequest(),
            hashIndex, params = [];
        if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex);
        if (typeof settings.data === "object") {
            for (key in settings.data) {
                params.push(key + '=' + settings.data[key])
            }
            settings.data = params.join("&");
            if (settings.type.toUpperCase() == 'GET') {
                settings.url = appendQuery(settings.url, settings.data);
                settings.data = undefined;
            }
        }
        var dataType = settings.dataType,
            hasPlaceholder = /\?.+=\?/.test(settings.url)
        if (hasPlaceholder) dataType = 'jsonp';
        if ('jsonp' == dataType) {
            if (!hasPlaceholder)
                settings.url = appendQuery(settings.url, settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
            return __WEBPACK_IMPORTED_MODULE_0__imoney___default.a.ajaxJSONP(settings)
        }
        var headers = {},
            setHeader = function(name, value) {
                headers[name.toLowerCase()] = [name, value]
            };
        setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded; charset=UTF-8');
        if (settings.headers) {
            for (name in settings.headers) {
                setHeader(name, settings.headers[name])
            }
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var result, error = false;
                xhr.onreadystatechange = empty;
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    result = xhr.responseText;
                    try {
                        if (dataType == 'json') {
                            result = /^\s*$/.test(result) ? null : JSON.parse(result)
                        }
                    } catch (e) {
                        error = e;
                    }
                    if (error) {
                        xhr.abort();
                        ajaxError(null, 'abort', xhr, settings)
                    } else {
                        ajaxSuccess(result, xhr, settings)
                    }
                }
            }
        }
        var async = 'async' in settings ? settings.async : true;
        xhr.open(settings.type, settings.url, async, settings.username, settings.password);
        for (name in headers) xhr.setRequestHeader.apply(xhr, headers[name]);
        xhr.send(settings.data ? settings.data : null)
        return xhr
    }
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__imoney__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__imoney___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__imoney__);


__WEBPACK_IMPORTED_MODULE_0__imoney___default.a.extend({
    cookie: function(key, value, options) {
        if (1 in arguments) {
            options = __WEBPACK_IMPORTED_MODULE_0__imoney___default.a.extend({}, options || {});
            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
            }
            return (document.cookie = [
                encodeURIComponent(key), '=', encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }
        var result = key ? undefined : {},
            cookies = document.cookie ? document.cookie.split('; ') : [],
            i = 0,
            l = cookies.length;
        for (; i < l; i++) {
            var parts = cookies[i].split('='),
                name = decodeURIComponent(parts.shift()),
                cookie = parts;
            if (key === name) {
                result = decodeURIComponent(cookie);
                break;
            }
            if (!key && cookie !== undefined) {
                result[name] = decodeURIComponent(cookie);
            }
        }
        return result;
    },
    removeCookie: function(key, options) {
        __WEBPACK_IMPORTED_MODULE_0__imoney___default.a.cookie(key, '', __WEBPACK_IMPORTED_MODULE_0__imoney___default.a.extend({}, options, {
            expires: -1
        }));
    }
});

/***/ })
/******/ ]);