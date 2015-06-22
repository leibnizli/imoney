/**
 * Name: iMoney.js v1.1.0
 * Author: Thunk
 * Url: http://imoney.w3cmm.com/
 * Time: 2015-06-03 4:09:00 PM 
 */
(function(window, undefined) {
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
        inArray: function(el, arr) {
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
        parseJSON: JSON.parse,
        stringifyJSON: JSON.stringify,
        now: function() {
            return (new Date()).getTime();
        }
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
        for (var i=0; i<argsLen; i++){
            var content = contents[i]
            if (typeof content == "string" || typeof content == "number") {
                this.each(function() {
                    this.insertAdjacentHTML(position, content)
                })
            }
        }

    };
    var classRE = function (name) {
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
                })
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
            console.log(data)
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
        before:function(){
            insertHTML.call(this,"beforebegin", arguments)
            return this;
        },
        prepend: function(){
            insertHTML.call(this,"afterbegin", arguments)
            return this;
        },
        append: function(){
            insertHTML.call(this, "beforeend", arguments)
            return this;
        },
        after: function(){
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
    rootiMoney = iMoney(document);
    (function(global) {
        var require, define, baseElement, currentlyAddingScript,
            globalDefQueue = [],
            contexts = {},
            defined = {},
            defContextName = '_',
            head = document.getElementsByTagName('head')[0];
        //循环数组，func返回true中断
        function each(ary, func) {
            if (ary) {
                var i;
                for (i = 0; i < ary.length; i += 1) {
                    if (ary[i] && func(ary[i], i, ary)) {
                        break;
                    }
                }
            }
        }
        function bind(obj, fn) {
            return function() {
                return fn.apply(obj, arguments);
            };
        }

        function scripts() {
            return document.getElementsByTagName('script');
        }

        function eachProp(obj, func) {
            var prop;
            for (prop in obj) {
                if (iMoney.hasProp(obj, prop)) {
                    if (func(obj[prop], prop)) {
                        break;
                    }
                }
            }
        }

        function newContext(contextName) {
            var inCheckLoaded, context, Module, handlers, checkLoadedTimeoutId,
                enabledRegistry = {},
                config = {
                    waitSeconds: 7,
                    baseUrl: './',
                    paths: {}
                },
                registry = {},
                defQueue = [],
                urlFetched = {},
                undefEvents = {},
                requireCounter = 1;

            function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
                var originalName = name,
                    isDefine = true;
                if (!name) {
                    isDefine = false;
                    name = '_@' + (requireCounter += 1);
                }
                return {
                    originalName: originalName,
                    isDefine: isDefine,
                    map: name,
                    id: name,
                    url: context.nameToUrl(name)
                };
            }

            function getModule(depMap) {
                var id = depMap.id,
                    mod = iMoney.getOwn(registry, id);

                if (!mod) {
                    mod = registry[id] = new Module(depMap);
                }
                return mod;
            }

            function on(depMap, name, fn) {
                var id = depMap.id,
                    mod = iMoney.getOwn(registry, id);
                //depMap
                if (iMoney.hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                    if (name === 'defined') {
                        fn(defined[id]);
                    }
                } else {
                    mod = getModule(depMap);
                    if (mod.error && name === 'error') {
                        fn(mod.error);
                    } else {
                        mod.on(name, fn);
                    }
                }
            }

            function getScriptData(e) {
                var node = e.currentTarget || e.srcElement;
                node.removeEventListener('load', context.onScriptLoad, false);
                node.removeEventListener('error', context.onScriptLoad, false);
                return {
                    node: node,
                    id: node && node.getAttribute('data-requiremodule')
                };
            }

            function takeGlobalQueue() {
                if (globalDefQueue.length) {
                    core_splice.apply(defQueue, [defQueue.length, 0].concat(globalDefQueue));
                    globalDefQueue = [];
                }
            }

            function intakeDefines() {
                var args;
                takeGlobalQueue();
                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        iMoney.error('不匹配的匿名 define() module: ' + args[args.length - 1]);
                    } else {
                        callGetModule(args);
                    }
                }
            }
            handlers = {};

            function removeScript(name) {
                each(scripts(), function(scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                        scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }

            function cleanRegistry(id) {
                delete registry[id];
                delete enabledRegistry[id];
            }

            function breakCycle(mod, traced, processed) {
                var id = mod.map.id;
                if (mod.error) {
                    mod.emit('error', mod.error);
                } else {
                    traced[id] = true;
                    each(mod.depMaps, function(depMap, i) {
                        var depId = depMap.id,
                            dep = iMoney.getOwn(registry, depId);
                        if (dep && !mod.depMatched[i] && !processed[depId]) {
                            if (iMoney.getOwn(traced, depId)) {
                                mod.defineDep(i, defined[depId]);
                                mod.check();
                            } else {
                                breakCycle(dep, traced, processed);
                            }
                        }
                    });
                    processed[id] = true;
                }
            }

            function checkLoaded() {
                var waitInterval = config.waitSeconds * 1000,
                    expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                    noLoads = [],
                    reqCalls = [],
                    needCycleCheck = true,
                    stillLoading = false;
                if (inCheckLoaded) {
                    return;
                }
                inCheckLoaded = true;
                eachProp(enabledRegistry, function(mod) {
                    var map = mod.map,
                        modId = map.id;
                    if (!mod.enabled) {
                        return;
                    }
                    if (!map.isDefine) {
                        reqCalls.push(mod);
                    }
                    if (!mod.error) {
                        if (!mod.inited && expired) {
                            noLoads.push(modId);
                            removeScript(modId);
                        } else if (!mod.inited && mod.fetched && map.isDefine) {
                            stillLoading = true;
                            if (!map.prefix) {
                                return (needCycleCheck = false);
                            }
                        }
                    }
                });
                //如果超过load指定时间,抛出错误
                if (expired && noLoads.length) {
                    iMoney.error('Load timeout for modules: ' + noLoads);
                }
                //如果需要循环检查，此时模块load失败
                if (needCycleCheck) {
                    each(reqCalls, function(mod) {
                        breakCycle(mod, {}, {});
                    });
                }
                if ((!expired) && stillLoading) {
                    if (!checkLoadedTimeoutId) {
                        checkLoadedTimeoutId = setTimeout(function() {
                            checkLoadedTimeoutId = 0;
                            checkLoaded();
                        }, 50);
                    }
                }
                inCheckLoaded = false;
            }

            function callGetModule(args) {
                if (!iMoney.hasProp(defined, args[0])) {
                    getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
                }
            }
            Module = function(map) {
                this.events = iMoney.getOwn(undefEvents, map.id) || {};
                this.map = map;
                this.depExports = [];
                this.depMatched = [];
                this.depCount = 0;
            }
            Module.prototype = {
                init: function(depMaps, factory, errback, options) {
                    options = options || {};
                    if (this.inited) {
                        return;
                    }
                    this.factory = factory;
                    //创建一个依赖副本，不影响原始depMaps
                    this.depMaps = depMaps && depMaps.slice(0);
                    this.errback = errback;
                    this.inited = true;
                    if (options.enabled || this.enabled) {
                        this.enable();
                    } else {
                        this.check();
                    }
                },
                defineDep: function(i, depExports) {
                    if (!this.depMatched[i]) {
                        this.depMatched[i] = true;
                        this.depCount -= 1;
                        this.depExports[i] = depExports;
                    }
                },
                fetch: function() {
                    if (this.fetched) {
                        return;
                    }
                    this.fetched = true;
                    context.startTime = (new Date()).getTime();
                    if (this.shim) {} else {
                        this.load();
                    }
                },
                load: function() {
                    var url = this.map.url;
                    if (!urlFetched[url]) {
                        urlFetched[url] = true;
                        context.load(this.map.id, url);
                    }
                },
                check: function() {
                    if (!this.enabled || this.enabling) {
                        return;
                    }
                    var id = this.map.id,
                        depExports = this.depExports,
                        exports = this.exports,
                        factory = this.factory;
                    if (!this.inited) {
                        this.fetch();
                    } else if (!this.defining) {
                        this.defining = true;
                        if (this.depCount < 1 && !this.defined) {
                            if (iMoney.isFunction(factory)) {
                                exports = context.execCb(id, factory, depExports, exports);
                            }
                            this.exports = exports;
                            cleanRegistry(id);
                            this.defined = true;
                        }
                        this.defining = false;
                        if (this.defined && !this.defineEmitted) {
                            this.defineEmitted = true;
                            this.emit('defined', this.exports);
                            this.defineEmitComplete = true;
                        }
                    }
                },
                enable: function() {
                    enabledRegistry[this.map.id] = this;
                    this.enabled = true;
                    this.enabling = true;
                    each(this.depMaps, bind(this, function(depMap, i) {
                        depMap = makeModuleMap(depMap);
                        this.depMaps[i] = depMap;
                        handler = iMoney.getOwn(handlers, depMap.id);
                        this.depCount += 1;
                        on(depMap, 'defined', bind(this, function(depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));
                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        } else if (this.events.error) {
                            on(depMap, 'error', bind(this, function(err) {
                                this.emit('error', err);
                            }));
                        }
                        id = depMap.id;
                        mod = registry[id];
                        if (!iMoney.hasProp(handlers, id) && mod && !mod.enabled) {
                            context.enable(depMap, this);
                        }
                    }));
                    this.enabling = false;
                    this.check();
                },
                //把cb推入this.events
                on: function(name, cb) {
                    var cbs = this.events[name];
                    if (!cbs) {
                        cbs = this.events[name] = [];
                    }
                    cbs.push(cb);
                },
                //执行this.events[name]
                emit: function(name, evt) {
                    each(this.events[name], function(cb) {
                        cb(evt);
                    });
                    if (name === "error") {
                        delete this.event[name];
                    }
                }
            }
            context = {
                contextName: contextName,
                configure: function(cfg) {
                    if (cfg.baseUrl) {
                        if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                            cfg.baseUrl += '/';
                        }
                    }
                    eachProp(cfg, function(value, prop) {
                        config[prop] = value;
                    });
                    eachProp(registry, function(mod, id) {
                        if (!mod.inited) {
                            mod.map = makeModuleMap(id);
                        }
                    });

                },
                load: function(id, url) {
                    require.load(context, id, url);
                },
                makeRequire: function(relMap, options) {
                    options = options || {};

                    function localRequire(deps, callback, errback) {
                        var requireMod;
                        intakeDefines();
                        iMoney.nextTick(function() {
                            intakeDefines();
                            requireMod = getModule(makeModuleMap(null, relMap));
                            requireMod.init(deps, callback, errback, {
                                enabled: true
                            });
                            checkLoaded();
                        })
                    }
                    return localRequire;
                },
                enable: function(depMap) {
                    var mod = iMoney.getOwn(registry, depMap.id);
                    if (mod) {
                        getModule(depMap).enable();
                    }
                },
                execCb: function(name, callback, args, exports) {
                    return callback.apply(exports, args);
                },
                //模块载入完成后
                completeLoad: function(moduleName) {
                    var found, mod;
                    takeGlobalQueue();
                    while (defQueue.length) {
                        args = defQueue.shift();
                        if (args[0] === null) {
                            args[0] = moduleName;
                            if (found) {
                                break;
                            }
                            found = true;
                        } else if (args[0] === moduleName) {
                            found = true;
                        }
                        callGetModule(args);
                    }
                    checkLoaded();
                },
                nameToUrl: function(moduleName) {
                    var paths, url = '';
                    paths = config.paths;
                    if (/^\/|:|\?|\.js$/.test(moduleName)) {
                        url = moduleName + '';
                    } else {
                        syms = moduleName.split("/");
                        for (i = syms.length; i > 0; i -= 1) {
                            parentModule = syms.slice(0, i).join('/');
                            parentPath = iMoney.getOwn(paths, parentModule);
                            if (parentPath) {
                                if (iMoney.isArray(parentPath)) {
                                    parentPath = parentPath[0];
                                }
                                syms.splice(0, i, parentPath);
                                break;
                            }
                        }
                        url = syms.join('/');
                        url += '.js';
                        url = (url.charAt(0) === '/' || url.match(/^[\w]+:/) ? '' : config.baseUrl) + url;
                    }
                    return config.urlArgs ? url + ((url.indexOf('?') === -1 ? '?' : '&') + config.urlArgs) : url;
                },
                onScriptLoad: function(e) {
                    if (e.type === 'load' ||
                        (/^(complete|loaded)$/.test((e.currentTarget).readyState))) {
                        interactiveScript = null;
                        var data = getScriptData(e);
                        context.completeLoad(data.id);
                    }
                },
                onScriptError: function(e) {
                    var data = getScriptData(e);
                    iMoney.error('Script error for: ' + data.id);
                }
            };
            context.require = context.makeRequire();
            return context;
        }
        define = function(name, deps, callback) {
            if (typeof name !== 'string') {
                callback = deps;
                deps = name;
                name = null;
            }
            if (!iMoney.isArray(deps)) {
                callback = deps;
                deps = null;
            }
            if (!deps && iMoney.isFunction(callback)) {
                deps = [];
            }
            globalDefQueue.push([name, deps, callback]);
        };
        require = function(deps, callback, errback, optional) {
            var context, config,
                contextName = defContextName;
            //deps是配置对象
            if (!iMoney.isArray(deps) && typeof deps !== 'string') {
                config = deps;
                if (iMoney.isArray(callback)) {
                    deps = callback;
                    callback = errback;
                    errback = optional;
                } else {
                    deps = [];
                }
            }
            if (config && config.context) {
                contextName = config.context;
            }
            context = iMoney.getOwn(contexts, contextName);
            if (!context) {
                context = contexts[contextName] = newContext(contextName);
            }
            if (config) {
                context.configure(config);
            }
            return context.require(deps, callback, errback);
        };
        require.createNode = function(config, moduleName, url) {
            var node = document.createElement('script');
            node.type = "text/javascript";
            node.charset = config.charset || 'utf-8';
            node.async = true;
            return node
        };
        require.load = function(context, moduleName, url) {
            var config = (context && context.config) || {},
                node;
            node = require.createNode(config, moduleName, url);
            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);
            node.addEventListener('load', context.onScriptLoad, false);
            node.addEventListener('error', context.onScriptError, false);
            node.src = url;
            currentlyAddingScript = node;
            head.appendChild(node);
            currentlyAddingScript = null;
            return node;
        };
        iMoney.config = function(config) {
            return require(config);
        }
        iMoney.define = define;
        iMoney.require = require;
    }(this));
    if (typeof window === "object" && typeof window.document === "object") {
        window.iMoney = window.$ = iMoney;
    }
})(window);