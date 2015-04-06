/**
 * Name: iMoney.js v1.1.0
 * Author: Thunk
 * Url: http://www.w3cmm.com/
 * Time: 2014-04-04 4:09:00 PM 
*/
(function(window, undefined) {
    var rootiMoney,
        _iMoney = window.iMoney,
        // $被覆盖的时候
        _$ = window.$,
        class2type = {},
        core_version = "1.1.0",
        emptyArray = [],
        core_filter = emptyArray.filter,
        core_concat = emptyArray.concat,
        core_push = emptyArray.push,
        core_slice = emptyArray.slice,
        core_indexOf = emptyArray.indexOf,
        core_some = emptyArray.some;
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty,
        core_trim = core_version.trim,
        //用来排除空白字符
        core_rnotwhite = /\S+/g,
        //匹配<tag>text, <tag>text</tag>text或#id文本, 也就是$("htmlText")和$("#id")用法
        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        //匹配标签<b></b>或<br />
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
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
                //如果是由"<"和">"包裹的HTML片段
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    match = [null, selector, null];
                } else {
                    match = rquickExpr.exec(selector);
                }
                //如果参数是HTML片段或者是#id字符
                if (match && (match[1] || !context)) {
                    if (match[1]) {
                        context = context instanceof iMoney ? context[0] : context;
                        //解析HTML片段为DOM对象，并返回包含这些DOM对象的iMoney集合
                        iMoney.merge(this, iMoney.parseHTML(
                            match[1],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            true
                        ));
                        // $('<ul>',{className:'dropDown',click:function(){}});
                        if (rsingleTag.test(match[1]) && iMoney.isPlainObject(context)) {
                            for (match in context) {
                                if (iMoney.isFunction(this[match])) {
                                    this[match](context[match]);
                                } else {
                                    this.attr(match, context[match]);
                                }
                            }
                        }
                        return this;
                    } else {
                        elem = document.getElementById(match[2]);
                        if (elem && elem.parentNode) {
                            this.length = 1;
                            this[0] = elem;
                        }

                        this.context = document;
                        this.selector = selector;
                        return this;
                    }

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
        filter: function(selector) {
            if (iMoney.isFunction(selector)) return this.not(this.not(selector))
            return $(core_filter.call(this, function(element) {
                return iMoney.matches(element, selector)
            }))
        },
        slice: function() {
            return this.pushStack(core_slice.apply(this, arguments));
        },
        map: function(callback) {
            return this.pushStack(iMoney.map(this, function(elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        end: function() {
            return this.prevObject || this.constructor(null);
        },
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        sort: emptyArray.sort,
        splice: emptyArray.splice,
        indexOf: emptyArray.indexOf,
    }
    iMoney.fn.init.prototype = iMoney.fn;
    //合并n个对象的属性到第一个对象中，扩展iMoney元素集合来提供新的方法/扩展jQuery对象本身
    iMoney.extend = iMoney.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        //深层拷贝
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            //跳过boolean和target
            i = 2;
        }

        //如果target不是对象，不是函数，比如是字符串
        if (typeof target !== "object" && !iMoney.isFunction(target)) {
            target = {};
        }

        //如果只有一个参数
        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            //只处理non-null/undefined值
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    //跳过循环
                    if (target === copy) {
                        continue;
                    }
                    //如果深层合并对象或数组需要递归
                    if (deep && copy && (iMoney.isPlainObject(copy) || (copyIsArray = iMoney.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && iMoney.isArray(src) ? src : [];

                        } else {
                            clone = src && iMoney.isPlainObject(src) ? src : {};
                        }

                        //复制而不移动原始对象
                        target[name] = iMoney.extend(deep, clone, copy);

                        //过滤undefined值
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        //返回修改的对象
        return target;
    };
    //选择符合条件的元素 find 此处有问题需要仔细研究
    iMoney.fn.extend({
        not: function(selector) {
            var nodes = []
            if (iMoney.isFunction(selector) && selector.call !== undefined)
                this.each(function(idx) {
                    if (!selector.call(this, idx)) nodes.push(this)
                })
            else {
                var excludes = typeof selector == 'string' ? this.filter(selector) :
                    (likeArray(selector) && iMoney.isFunction(selector.item)) ? core_slice.call(selector) : $(selector)
                this.forEach(function(el) {
                    if (excludes.indexOf(el) < 0) nodes.push(el)
                })
            }
            return $(nodes)
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
        //iMoney.find(selector, self[i], ret)
        find: function(selector) {
            var result = [] ;
            if (!selector) result = iMoney()
            if (this.length==1){
                result = this.pushStack(this[0].querySelectorAll(selector));
            } else if (this.length>1){
                result = this.map(function(){
                    return core_slice.call(this.querySelectorAll(selector))
                })
            }
            result.selector = this.selector ? this.selector + " " + selector : selector;
            console.log(result)
            return result;
        }
    });
    iMoney.fn.init.prototype = iMoney.fn;
    //iMoney方法
    iMoney.extend({
        noConflict: function(deep) {
            //交出$的控制权
            if (window.$ === iMoney) {
                window.$ = _$;
            }
            //交出iMoney的控制权
            if (deep && window.iMoney === iMoney) {
                window.iMoney = _iMoney;
            }
            return iMoney;
        },
        ready:function(callback) {
            if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
                callback($);
            } else {
                document.addEventListener('DOMContentLoaded', function() {
                    callback($);
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
        //判断对象否为纯粹的对象字面量，对于通过字面量定义的对象和new Object的对象返回true，new Object时传参数的返回false
        isPlainObject: function(obj) {
            //首先检查是否是一个对象
            if (!obj || iMoney.type(obj) !== "object" || obj.nodeType || iMoney.isWindow(obj)) {
                return false;
            }
            try {
                //如果对象具有构造函数，但却不是自身的属性，说明这个构造函数是通过prototye继承来的
                if (obj.constructor && !core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 将抛出异常
                return false;
            }

            //用于检查对象的属性是否都是自身的，因为遍历对象属性时，会先从自身的属性开始遍历，所以只需要检查最后的属性是否是自身的就可以了

            var key;
            for (key in obj) {}

            return key === undefined || core_hasOwn.call(obj, key);
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
        //把字符串解析成DOM
        parseHTML: function(data, context, keepScripts) {
            if (!data || typeof data !== "string") {
                return null;
            }
            if (typeof context === "boolean") {
                keepScripts = context;
                context = false;
            }
            context = context || document;
            //Single tag
            //rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            //匹配HTML标签
            var parsed = rsingleTag.exec(data),
                scripts = !keepScripts && [];
            // Single tag
            if (parsed) {
                return [context.createElement(parsed[1])];
            }
            parsed = iMoney.buildFragment([data], context, scripts);
            if (scripts) {
                iMoney(scripts).remove();
            }
            return iMoney.merge([], parsed.childNodes);
        },
        //一个空对象
        noop: function() {},
        //执行一些JavaScript全局对象
        globalEval: function(data) {
            if (data && core_rnotwhite.test(data)) {
                // We use execScript on Internet Explorer
                // We use an anonymous function so that context is window
                (window.execScript || function(data) {
                    window["eval"].call(window, data);
                })(data);
            }
        },
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
        //合并或推入数组
        makeArray: function(arr, results) {
            var type,
                ret = results || [];
            if (arr != null) {
                type = iMoney.type(arr);
                if (arr.length == null || type === "string" || type === "function" || type === "regexp" || iMoney.isWindow(arr)) {
                    Array.prototype.push.call(ret, arr);
                } else {
                    iMoney.merge(ret, arr);
                }
            }

            return ret;
        },
        inArray: function(elem, arr, i) {
            var len;

            if (arr) {
                if (core_indexOf) {
                    return core_indexOf.call(arr, elem, i);
                }

                len = arr.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

                for (; i < len; i++) {
                    // Skip accessing in sparse arrays
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
        //从数组里过滤满足条件的元素
        grep: function(elems, callback, inv) {
            var retVal,
                ret = [],
                i = 0,
                length = elems.length;
            inv = !! inv;
            //保存数组中通过callback验证的元素
            for (; i < length; i++) {
                retVal = !! callback(elems[i], i);
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
        now: function() {
            return (new Date()).getTime();
        }
    });
    //contains、fragment 
    iMoney.extend({
        //文档片段
        buildFragment: function(elems, context, scripts, selection) {
            var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
                rtagName = /<([\w:]+)/,
                rhtml = /<|&#?\w+;/;
            var wrapMap = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                thead: [1, "<table>", "</table>"],
                col: [2, "<table><colgroup>", "</colgroup></table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: [0, "", ""]
            };
            wrapMap.optgroup = wrapMap.option;
            wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
            wrapMap.th = wrapMap.td;
            var elem, tmp, tag, wrap, contains, j,
                i = 0,
                l = elems.length,
                fragment = context.createDocumentFragment(),
                nodes = [];
            for (; i < l; i++) {
                elem = elems[i];

                if (elem || elem === 0) {
                    if (iMoney.type(elem) === "object") {
                        iMoney.merge(nodes, elem.nodeType ? [elem] : elem);
                    } else if (!rhtml.test(elem)) {
                        nodes.push(context.createTextNode(elem));
                    } else {

                        tmp = tmp || fragment.appendChild(context.createElement("div"));
                        //$('<option value="1">1</option>')
                        tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                        wrap = wrapMap[tag] || wrapMap._default;
                        tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
                        j = wrap[0];
                        while (j--) {
                            tmp = tmp.lastChild;
                        }
                        iMoney.merge(nodes, tmp.childNodes);
                        tmp = fragment.firstChild;
                        tmp.textContent = "";
                    }
                }
            }
            fragment.textContent = "";
            i = 0;
            while ((elem = nodes[i++])) {
                if (selection && iMoney.inArray(elem, selection) !== -1) {
                    continue;
                }
                fragment.appendChild(elem)
            }   
            return fragment;
        }
    });
    //定义iMoney和$标识符
    if (typeof window === "object" && typeof window.document === "object") {
        window.iMoney = window.$ = iMoney;
    }
})(window);