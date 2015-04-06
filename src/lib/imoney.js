/**
 * Name: iMoney.js
 * Author: 坦克
 * Url: http://www.w3cmm.com/
 * Time: 2014-04-04 4:09:00 PM 
*/
(function () {
    if (!window.iMoney) {
        window["iMoney"] = {}
    }

    //能力检测
    function isCompatible(other) {
        // 使用能力检测来检查必要的条件
        if (other === false || !Array.prototype.push || !Object.hasOwnProperty || !document.createElement || !document.getElementsByTagName) {
            alert('isCompatible 检测失败或不正常！');
            return false;
        }
        return true;
    }
    window["iMoney"]['isCompatible'] = isCompatible;

    //选择器
    function $() {
        var elements = new Array();
        for (var i = 0; i < arguments.length; i++) {
            var element = arguments[i];
            if (typeof element == "string") {
                element = document.getElementById(element);
            }
            //如果只提供了一个参数，则立即返回这个元素
            if (arguments.length == 1) {
                return element;
            }
            elements.push(element);
        }
        return elements;
    };
    window["iMoney"]["$"] = $;

    //选择类
    function getElementsByClassName(className, tag, parent) {
        parent = parent || document;
        if (!(parent = $(parent))) {
            return false;
        }
        //查找所有匹配的标签
        var allTags = (tag == "*" && parent.all) ? parent.all : parent.getElementsByTagName(tag);
        var matchingElements = new Array();
        //创建正则表达式，来判断className是否正确
        className = className.replace(/\-/g, "\\-");
        var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
        var element;
        //检查每个元素
        for (var i = 0; i < allTags.length; i++) {
            element = allTags[i];
            if (regex.test(element.className)) {
                matchingElements.push(element);
            }
        }
        //返回任何匹配的元素
        return matchingElements;
    };
    window["iMoney"]["getElementsByClassName"] = getElementsByClassName;

    //通过ID修改单个元素的样式
    function setStyleById(element, styles) {
        if (!(element = $(element))) {
            return false;
        }
        for (property in styles) {
            if (!styles.hasOwnProperty(property)) continue;
            if (element.style.setProperty) {
                element.style.setProperty(uncamelize(property, "-"), styles[property], null);
            } else {
                //备用方法
                element.style[camelize(property)] = styles[property];
            }
        }
        return true;
    }
    window["iMoney"]["setStyle"] = setStyleById;
    window["iMoney"]["setStyleById"] = setStyleById;


    //通过类名修改多个元素的样式
    function setStylesByClassName(parent, tag, className, styles) {
        if (!(parent = $(parent))) {
            return false;
        }
        var elements = getElementsByClassName(className, tag, parent);
        for (var e = 0; e < elements.length; e++) {
            setStyleById(elements[e], styles);
        }
        return true;
    }
    window["iMoney"]["setStylesByClassName"] = setStylesByClassName;

    //通过标签名修改元素的样式
    function setStylesByTagName(tagname, styles, parent) {
        parent = $(parent) || document;
        var elements = parent.getElementsByTagName(tagname);
        for (var e = 0; e < elements.length; e++) {
            setStyleById(elements[e], styles);
        }
    }
    window["iMoney"]["setStylesByTagName"] = setStylesByTagName;

    //在指定样式表指定位置插入规则
    function insertRule(sheet, selectorText, cssText, position) {
        if (sheet.insertRule) {
            sheet.insertRule(selectorText + "{" + cssText + "}", position);
        } else if (sheet.addRule) {
            sheet.addRule(selectorText, cssText, position);
        }
    }

    //在指定样式表指定位置删除规则
    function deleteRule(sheet, index) {
        if (sheet.deleteRule) {
            sheet.deleteRule(index);
        } else if (sheet.removeRule) {
            sheet.removeRule(index);
        }
    }

    //取得包含元素类名的数组
    function getClass(element) {
        if (!(element = $(element))) return false;
        return element.className.replace(/\s+/, " ").split(" ");
    }
    window["iMoney"]["getClass"] = getClass;

    //检查元素中是否存在某个类
    function hasClass(element, className) {
        if (!(element = $(element))) return false;
        var classes = getClass(element);
        for (var i = 0; i < classes.length; i++) {
            if (classs[i] == className) {
                return true;
            }
        }
        return false;
    }
    window["iMoney"]["hasClass"] = hasClass;

    //为元素添加类
    function addClass(element, className) {
        if (!(element = $(element))) return false;
        element.className += (element.className ? " " : "") + className;
        return true;
    }
    window["iMoney"]["addClass"] = addClass;

    //从元素删除类
    function removeClass(element, className) {
        if (!(element = $(element))) return false;
        var classes = getClass(element);
        var length = classes.length;
        for (var i = length - 1; i >= 0; i--) {
            if (classes[i] === className) {
                delete(classes[i]);
            }
        }
        element.className = classes.join(" ");
        alert(classes.length)
        return(length == classes.length ? false : true);
    }
    window["iMoney"]["removeClass"] = removeClass;

    //添加样式表
    function addStylesSheet(url, media) {
        media = media || "screen";
        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", url);
        link.setAttribute("media", media);
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    window["iMoney"]["addStylesSheet"] = addStylesSheet;

    //移除样式表
    function removeStyleSheet(url, media) {
        var styles = getStyleSheets(url, media);
        alert(styles.length)
        for (var i = 0; i < styles.length; i++) {
            var node = styles[i].ownerNode || styles[i].owningElement;
            //禁用样式表
            styles[i].disabled = true;
            node.parentNode.removeChild(node);
        }
    }
    window["iMoney"]["removeStyleSheet"] = removeStyleSheet;

    //载入JavaScript文件
    function loadScript(url) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = url;
        document.body.appendChild(script)
    }
    window["iMoney"]["loadScript"] = loadScript;

    //执行JavaScript代码
    function loadScriptString(code) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        try {
            script.appendChild(document.createTextNode(code));
        } catch (ex) {
            script.text = code;
        }
        document.body.appendChild(script);
    }
    window["iMoney"]["loadScriptString"] = loadScriptString;

    //载入样式表
    function loadStyle(url) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "tet/css";
        link.href = url;
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(link);
    }
    window["iMoney"]["loadStyle"] = loadStyle;

    //向页面添加样式
    function loadStyleString(css) {
        var style = document.createElement("style");
        style.type = "text/css";
        try {
            style.appendChild(document.createTextNode(css));
        } catch (ex) {
            style.styleSheet.cssText = css;
        }
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    }
    window["iMoney"]["loadStyleString"] = loadStyleString;

    //通过URL取得包含所有样式的数组
    function getStyleSheets(url, media) {
        var sheets = [];
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (url && document.styleSheets[i].href.indexOf(url) == -1) {
                continue;
            }
            if (media) {
                media = media.replace(/,\s*/, ",");
                var sheetMedia;
                if (document.styleSheets[i].media.mediaText) {

                    //DOM方法
                    sheetMedia = document.styleSheets[i].media.mediaText.replace(/,\s*/, ",");
                    //Safari会添加额外的逗号和空格
                    sheetMedia = sheetMedia.replace(/,\s*/, ",");
                } else {
                    //MSIE方法
                    sheetMedia = document.styleSheets[i].media.replace(/,\s*/, ",");
                }
                if (media != sheetMedia) {
                    continue;
                }
            }
            sheets.push(document.styleSheets[i]);
        }
        return sheets;
    }
    window["iMoney"]["getStyleSheets"] = getStyleSheets;

    //把word-word转换成wordWord
    function camelize(s) {
        return s.replace(/-(\w)/g, function (strMatch, p1) {
            return p1.toUpperCase();
        });
    }
    window["iMoney"]['camelize'] = camelize;

    //把wordWord转换成word-word
    function uncamelize(s, sep) {
        sep = sep || "-";
        return s.replace(/([a-z])([A-Z])/g, function (strMatch, p1, p2) {
            return p1 + sep + p2.toLowerCase();
        })
    }
    window["iMoney"]["uncamelize"] = uncamelize;

    //获取元素的样式
    function getStyle(element, property) {
        if (!(element = $(element)) && !property) {
            return false
        }
        var value = element.style[camelize(property)];
        if (!value) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                var css = document.defaultView.getComputedStyle(element, null);
                value = css ? css.getPropertyValue(property) : null;
            } else if (element.currentStyle) {
                value = element.currentStyle[camelize(property)];
            }
        }
        return value == "auto" ? " " : value;
    }
    window["iMoney"]["getStyle"] = getStyle;
    window["iMoney"]["getStyleById"] = getStyle;

    //切换显示
    function toggleDisplay(node, value) {
        if (!(node = $(node))) {
            return false;
        }
        if (node.style.display != "none") {
            node.style.display = "none";
        } else {
            node.style.display = value || " ";
        }
        return true;
    }
    window["iMoney"]["toggleDisplay"] = toggleDisplay;

    //检测otherNode是否refNode的子节点
    function contains(refNode, otherNode) {
        if (typeof refNode.contains == "function" &&
            (!client.engine.webkit || client.engine.webkit >= 522)) {
            return refNode.contains(otherNode);
        } else if (typeof refNode.compareDocumentPosition == "function") {
            return !!(refNode.compareDocumentPosition(otherNode) & 16);
        } else {
            var node = otherNode.parentNode;
            do {
                if (node === refNode) {
                    return true;
                } else {
                    node = node.parentNode;
                }
            } while (node !== null);
            return false;
        }
    }
    window["iMoney"]["contains"] = contains;

    //在后面插入节点
    function insertAfter(node, referenceNode) {
        if (!(node = $(node))) {
            return false;
        }
        if (!(referenceNode = $(referenceNode))) {
            return false;
        }
        return referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
    }
    window["iMoney"]["insertAfter"] = insertAfter;

    //移除节点
    function removeChildren(parent) {
        if (!(parent = $(parent))) {
            return false;
        }
        //当存在子节点时删除该子节点
        while (parent.firstChild) {
            parent.firstChild.parentNode.removeChild(parent.children);
        }
        return parent;
    }
    window["iMoney"]["removeChildren"] = removeChildren;

    //在前面插入节点
    function prependChild(parent, newChild) {
        if (!(parent = $(parent))) {
            return false;
        }
        if (!(newChild = $(newChild))) {
            return false;
        }
        if (parent.firstChild) {
            //如果存在子节点，则在这个节点之前插入
            parent.insertBefore(newChild, parent.firstChild);
        } else {
            //如果没有子节点则直接添加
            parent.appendChild(newChild);
        }
        //再返回父元素
        return parent;
    }
    window["iMoney"]["prependChild"] = prependChild;

    //重复一个字符串
    if (!String.repeat) {
        String.prototype.repeat = function (l) {
            return new Array(l + 1).join(this);
        }
    }
    //清除结尾和开头处的空白符
    if (!String.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, "")
        }
    }

    //获取元素的左偏移
    function getElementLeft(element) {
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;

        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }

        return actualLeft;
    }
    window["iMoney"]["getElementLeft"] = getElementLeft;

    //获取元素的上 偏移
    function getElementTop(element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;

        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }

        return actualTop;
    }
    window["iMoney"]["getElementTop"] = getElementTop;

    //获取视口大小
    function getViewport() {
        if (document.compatMode == "BackCompat") {
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            };
        } else {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
        }
    }
    window["iMoney"]["getViewport"] = getViewport;

    //获取浏览器窗口大小
    function getBrowserWindowSize() {
        var de = document.documentElement;
        return {
            'width': (window.innerWidth || (de && de.clientWidth) || document.body.clientWidth),
            'height': (window.innerHeight || (de && de.clientHeight) || document.body.clientHeight)
        }
    }
    window["iMoney"]["getBrowserWindowSize"] = getBrowserWindowSize;

    //获取文档尺寸
    function getDocSize() {
        return {
            "width": Math.max(document.documentElement.scrollHeight, document.documentElement)
        }
    }

    //获取鼠标的位置坐标
    function getPointerPositionInDocument(event) {
        event = event || getEvent(event);
        var x = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
        var y = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
        return {
            "x": x,
            "y": y
        };
    }
    window["iMoney"]["getPointerPositionInDocument"] = getPointerPositionInDocument;

    //获取元素上、下、左、右的距离
    function getBoundingClientRect(element) {

        var scrollTop = document.documentElement.scrollTop;
        var scrollLeft = document.documentElement.scrollLeft;

        if (element.getBoundingClientRect) {
            if (typeof arguments.callee.offset != "number") {
                var temp = document.createElement("div");
                temp.style.cssText = "position:absolute;left:0;top:0;";
                document.body.appendChild(temp);
                arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
                document.body.removeChild(temp);
                temp = null;
            }

            var rect = element.getBoundingClientRect();
            var offset = arguments.callee.offset;

            return {
                left: rect.left + offset,
                right: rect.right + offset,
                top: rect.top + offset,
                bottom: rect.bottom + offset

            };
        } else {

            var actualLeft = getElementLeft(element);
            var actualTop = getElementTop(element);

            return {
                left: actualLeft - scrollLeft,
                right: actualLeft + element.offsetWidth - scrollLeft,
                top: actualTop - scrollTop,
                bottom: actualTop + element.offsetHeight - scrollTop
            }
        }
    }
    window["iMoney"]["getBoundingClientRect"] = getBoundingClientRect;

    //绑定事件
    function addHandler(element, type, Handler) {
        if (element.addEventListener) {
            element.addEventListener(type, Handler, false);
        } else if (element.attachEvent) {
            element['e' + type + Handler] = Handler;
            element[type + Handler] = function () {
                element['e' + type + Handler](window.event);
            }
            element.attachEvent('on' + type, element[type + Handler]);
        }
        //return false;
    }
    window["iMoney"]["addHandler"] = addHandler;

    //移除事件
    function removeHandler(node, type, listener) {
        if (node.removeEventListener) {
            node.removeEventListener(type, listener, false);
            return true;
        } else if (node.detachEvent) {
            // MSIE method
            node.detachEvent('on' + type, node[type + listener]);
            node[type + listener] = null;
            return true;
        }
        // Didn't have either so return false
        return false;
    }
    window["iMoney"]["removeHandler"] = removeHandler;

    //获取事件
    function getEvent(event) {
        return event ? event : window.event;
    }
    window["iMoney"]["getEvent"] = getEvent;

    //获取事件对象
    function getTarget() {
        return event.target || event.srcElement;
    }
    window["iMoney"]["getTarget"] = getTarget;

    //阻止默认事件
    function preventDefault(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
    window["iMoney"]["preventDefault"] = preventDefault;

    //阻止冒泡
    function stopPropagation(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
    window["iMoney"]["stopPropagation"] = stopPropagation;

    //load事件
    function addLoadEvent(loadEvent, waitForImages) {
        //如果需要等待图片载入则使用常规的添加事件方法
        if (waitForImages) {
            return addEvent(window, "load", loadEvent);
        }
        var init = function () {
            //如果这个函数已经被调用过了则返回
            if (arguments.callee.done) return;
            //标记这个函数以便检验它是否运行过
            arguments.callee.done = true;
            //在document的环境中运行载入事件
            loadEvent.apply(document, arguments);
        };
        //DOMContLoaded事件会在文档标记被载入完成时被调用
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", init, false);
        }
        //对于Safari使用setInterval()函数检测document的readyState属性，监控文档是否完成
        if (/Webkit/i.test(navigator.userAgent)) {
            var _timer = setInterval(function () {
                if (/loaded|complete/.test(document.readyState)) {
                    clearInterval(_timer);
                    init();
                }
            }, 10);
        }
        //写入script标签，该标签会延迟到文档的最后载入
        //然后，使用script对象的onreadystatechange方法进行类似的readyState检查后载入事件
        /*@if (@_win32)
         document.write("<script id=_ie_onload defer src=javascript:void(0)></script>");
         var script = document.getElementById("_ie_onload");
         script.onreadystatechange = function() {
         if(this.readyState == "complete") {
         init();
         }
         };
         /*@end @*/
        return true;
    }
    window["iMoney"]["addLoadEvent"] = addLoadEvent;

    //相关元素
    function getRelatedTarget(event) {
        if (event.relatedTarget) {
            return event.relatedTarget;
        } else if (event.toElement) {
            return event.toElement;
        } else if (event.fromElement) {
            return event.fromElement;
        } else {
            return null;
        }

    }
    window["iMoney"]["getRelatedTarget"] = getRelatedTarget;

    //获取鼠标按键
    function getButton(event) {
        if (document.implementation.hasFeature("MouseEvents", "2.0")) {
            return event.button;
        } else {
            switch (event.button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    }
    window["iMoney"]["getButton"] = getButton;

    //键盘编码
    function getCharCode(event) {
        if (typeof event.charCode == "number") {
            return event.charCode;
        } else {
            return event.keyCode;
        }
    }
    window["iMoney"]["getCharCode"] = getCharCode;

    //鼠标滚轮事件
    function getWheelDelta(event) {
        if (event.wheelDelta) {
            return event.wheelDelta;
        } else {
            return -event.detail * 40;
        }
    }
    window["iMoney"]["getRelatedTarget"] = getRelatedTarget;


    //键盘命令
    function getKeyPressed(event) {
        event = event || getEvent(event);
        var code = event.keyCode;
        var value = String.fromCharCode(code);
        return {
            "code": code,
            "value": value
        };
    }
    window["iMoney"]["getKeyPressed"] = getKeyPressed;

    //获取剪贴板内容
    function getClipboardText(event) {
        var clipboardData = (event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    }
    window["iMoney"]["getClipboardText"] = getClipboardText;

    //设置剪贴板内容
    function setClipboardText(event, value) {
        if (event.clipboardData) {
            event.clipboardData.setData("text/plain", value);
        } else if (window.clipboardData) {
            window.clipboardData.setData("text", value);
        }
    }
    window["iMoney"]["setClipboardText"] = setClipboardText;

    //序列化表单
    function serialize(form) {
        var parts = [],
            field = null,
            i,
            len,
            j,
            optLen,
            option,
            optValue;

        for (i = 0, len = form.elements.length; i < len; i++) {
            field = form.elements[i];

            switch (field.type) {
                case "select-one":
                case "select-multiple":

                    if (field.name.length) {
                        for (j = 0, optLen = field.options.length; j < optLen; j++) {
                            option = field.options[j];
                            if (option.selected) {
                                optValue = "";
                                if (option.hasAttribute) {
                                    optValue = (option.hasAttribute("value") ? option.value : option.text);
                                } else {
                                    optValue = (option.attributes["value"].specified ? option.value : option.text);
                                }
                                parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
                            }
                        }
                    }
                    break;

                case undefined:     //字段级
                case "file":        //文件输入
                case "subiMoneyt":      //提交按钮
                case "reset":       //重置按钮
                case "button":      //自定义按钮
                    break;

                case "radio":       //单选按钮
                case "checkbox":    //复选框
                    if (!field.checked) {
                        break;
                    }
                /* 执行默认操作 */

                default:
                    //不包含没有名字的表单字段
                    if (field.name.length) {
                        parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                    }
            }
        }
        return parts.join("&");
    }
    window["iMoney"]["serialize"] = serialize;

    //解析XML
    function parseXml(xml) {
        var xmldom = null;

        if (typeof DOMParser != "undefined") {
            xmldom = (new DOMParser()).parseFromString(xml, "text/xml");
            var errors = xmldom.getElementsByTagName("parsererror");
            if (errors.length) {
                throw new Error("XML 解析错误:" + errors[0].textContent);
            }
        } else if (typeof ActiveXObject != "undefined") {

            //创建XML文档实例
            function createDocument() {
                if (typeof arguments.callee.activeXString != "string") {
                    var versions = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0",
                        "MSXML2.DOMDocument"];

                    for (var i = 0, len = versions.length; i < len; i++) {
                        try {
                            var xmldom = new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            return xmldom;
                        } catch (ex) {
                            //skip
                        }
                    }
                }

                return new ActiveXObject(arguments.callee.activeXString);
            }

            xmldom = createDocument();
            xmldom.loadXML(xml);
            if (xmldom.parseError != 0) {
                throw new Error("XML 解析错误: " + xmldom.parseError.reason);
            }
        } else {
            throw new Error("不支持XML 解析！");
        }

        return xmldom;
    }
    window["iMoney"]["parseXml"] = parseXml;

    //XPath用来在DOM文档中查找节点
    //XPath，找到匹配的节点时返回第一个
    function selectSingleNode(context, expression, namespaces) {
        var doc = (context.nodeType != 9 ? context.ownerDocument : context);

        if (typeof doc.evaluate != "undefined") {
            var nsresolver = null;
            if (namespaces instanceof Object) {
                nsresolver = function (prefix) {
                    return namespaces[prefix];
                };
            }

            var result = doc.evaluate(expression, context, nsresolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            return (result !== null ? result.singleNodeValue : null);

        } else if (typeof context.selectSingleNode != "undefined") {

            //创建命名空间字符串
            if (namespaces instanceof Object) {
                var ns = "";
                for (var prefix in namespaces) {
                    if (namespaces.hasOwnProperty(prefix)) {
                        ns += "xmlns:" + prefix + "='" + namespaces[prefix] + "' ";
                    }
                }
                doc.setProperty("SelectionNamespaces", ns);
            }
            return context.selectSingleNode(expression);
        } else {
            throw new Error("No XPath engine found.");
        }
    }
    window["iMoney"]["selectSingleNode"] = selectSingleNode;

    //XPath，返回与模式匹配的所有节点
    function selectNodes(context, expression, namespaces) {
        var doc = (context.nodeType != 9 ? context.ownerDocument : context);

        if (typeof doc.evaluate != "undefined") {
            var nsresolver = null;
            if (namespaces instanceof Object) {
                nsresolver = function (prefix) {
                    return namespaces[prefix];
                };
            }

            var result = doc.evaluate(expression, context, nsresolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var nodes = new Array();

            if (result !== null) {
                for (var i = 0, len = result.snapshotLength; i < len; i++) {
                    nodes.push(result.snapshotItem(i));
                }
            }

            return nodes;
        } else if (typeof context.selectNodes != "undefined") {

            //创建命名空间字符串
            if (namespaces instanceof Object) {
                var ns = "";
                for (var prefix in namespaces) {
                    if (namespaces.hasOwnProperty(prefix)) {
                        ns += "xmlns:" + prefix + "='" + namespaces[prefix] + "' ";
                    }
                }
                doc.setProperty("SelectionNamespaces", ns);
            }
            var result = context.selectNodes(expression);
            var nodes = new Array();

            for (var i = 0, len = result.length; i < len; i++) {
                nodes.push(result[i]);
            }

            return nodes;
        } else {
            throw new Error("No XPath engine found.");
        }
    }
    window["iMoney"]["selectNodes"] = selectNodes;

    //序列化XML
    function serializeXml(xmldom) {

        if (typeof XMLSerializer != "undefined") {
            return (new XMLSerializer()).serializeToString(xmldom);
        } else if (typeof xmldom.xml != "undefined") {
            return xmldom.xml;
        } else {
            throw new Error("Could not serialize XML DOM.");
        }
    }
    window["iMoney"]["serializeXml"] = serializeXml;

    //XSLT文档形式转换
    function transform(context, xslt) {
        if (typeof XSLTProcessor != "undefined") {
            var processor = new XSLTProcessor();
            processor.importStylesheet(xslt);

            var result = processor.transformToDocument(context);
            return (new XMLSerializer()).serializeToString(result);

        } else if (typeof context.transformNode != "undefined") {
            return context.transformNode(xslt);
        } else {
            throw new Error("No XSLT processor available.");
        }
    }
    window["iMoney"]["transform"] = transform;

    //创建XHR
    function createXHR() {
        if (typeof XMLHttpRequest != "undefined") {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != "undefined") {
            if (typeof arguments.callee.activeXString != "string") {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                        "MSXML2.XMLHttp"],
                    i, len;

                for (i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        break;
                    } catch (ex) {
                        //跳过
                    }
                }
            }

            return new ActiveXObject(arguments.callee.activeXString);
        } else {
            throw new Error("No XHR object available.");
        }
    }
    window["iMoney"]["createXHR"] = createXHR;

    //解析JSON
    function parseJSON(s, filter) {
        var j;

        function walk(k, v) {
            var i;
            if (v && typeof v === 'object') {
                for (i in v) {
                    if (v.hasOwnProperty(i)) {
                        v[i] = walk(i, v[i]);
                    }
                }
            }
            return filter(k, v);
        }

        //通过正则表达式检测JSON文本，查找非JSON字符。其中，特别关注"()
        //"和"new"，因为它们会引起语句的调用，还有“=”，因为它会导致变量的值发生改变
        //不过，为安全起见这里会拒绝所有不希望出现的字符
        if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(s)) {

            try {
                j = eval('(' + s + ')');
            } catch (e) {
                throw new SyntaxError("parseJSON");
            }
        } else {
            throw new SyntaxError("parseJSON");
        }

        if (typeof filter === 'function') {
            j = walk('', j);
        }
        return j;
    }

    //CORS跨资源共享
    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        return xhr;
    }
    window["iMoney"]["createCORSRequest"] = createCORSRequest;

    //获取cookie
    function getCookie(name) {
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null,
            cookieEnd;

        if (cookieStart > -1) {
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }

        return cookieValue;
    }
    window["iMoney"]["getCookie"] = getCookie;

    //设置cookie
    function setCookie(name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        if (expires instanceof Date) {
            cookieText += "; expires=" + expires.toGMTString();
        }

        if (path) {
            cookieText += "; path=" + path;
        }

        if (domain) {
            cookieText += "; domain=" + domain;
        }

        if (secure) {
            cookieText += "; secure";
        }

        document.cookie = cookieText;
    }
    window["iMoney"]["setCookie"] = setCookie;

    //删除cookie
    function unsetCookie(name, path, domain, secure) {
        this.set(name, "", new Date(0), path, domain, secure);
    }
    window["iMoney"]["unsetCookie"] = unsetCookie;

    //获取单个子cookie
    function getSubCookie(name, subName) {
        var subCookies = this.getAll(name);
        if (subCookies) {
            return subCookies[subName];
        } else {
            return null;
        }
    }
    window["iMoney"]["getSubCookie"] = getSubCookie;

    //获取所有子cookie
    function getAllSubCookie(name) {
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null,
            cookieEnd, subCookies, i, parts, result = {};

        if (cookieStart > -1) {
            cookieEnd = document.cookie.indexOf(";", cookieStart)
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = document.cookie.substring(cookieStart + cookieName.length, cookieEnd);

            if (cookieValue.length > 0) {
                subCookies = cookieValue.split("&");

                for (i = 0, len = subCookies.length; i < len; i++) {
                    parts = subCookies[i].split("=");
                    result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
                }

                return result;
            }
        }

        return null;
    }
    window["iMoney"]["getAllSubCookie"] = getAllSubCookie;

    //设置单个子cookie
    function setSubCookie(name, subName, value, expires, path, domain, secure) {

        var subcookies = this.getAll(name) || {};
        subcookies[subName] = value;
        this.setAll(name, subcookies, expires, path, domain, secure);

    }
    window["iMoney"]["setSubCookie"] = setSubCookie;

    //设置所有子cookie
    function setAllSubCookie(name, subcookies, expires, path, domain, secure) {

        var cookieText = encodeURIComponent(name) + "=",
            subcookieParts = new Array(),
            subName;

        for (subName in subcookies) {
            if (subName.length > 0 && subcookies.hasOwnProperty(subName)) {
                subcookieParts.push(encodeURIComponent(subName) + "=" + encodeURIComponent(subcookies[subName]));
            }
        }

        if (subcookieParts.length > 0) {
            cookieText += subcookieParts.join("&");

            if (expires instanceof Date) {
                cookieText += "; expires=" + expires.toGMTString();
            }

            if (path) {
                cookieText += "; path=" + path;
            }

            if (domain) {
                cookieText += "; domain=" + domain;
            }

            if (secure) {
                cookieText += "; secure";
            }
        } else {
            cookieText += "; expires=" + (new Date(0)).toGMTString();
        }

        document.cookie = cookieText;

    }
    window["iMoney"]["setAllSubCookie"] = setAllSubCookie;

    //删除单个子cookie
    function unsetSubCookie(name, subName, path, domain, secure) {
        var subcookies = this.getAll(name);
        if (subcookies) {
            delete subcookies[subName];
            this.setAll(name, subcookies, null, path, domain, secure);
        }
    }
    window["iMoney"]["unsetSubCookie"] = unsetSubCookie;

    //删除所有子cookie
    function unsetAllSubCookie(name, path, domain, secure) {
        this.setAll(name, null, new Date(0), path, domain, secure);
    }
    window["iMoney"]["unsetAllSubCookie"] = unsetAllSubCookie;


    //在控制台显示错误日志
    function log(message) {
        var console = document.getElementById("debuginfo");
        if (console === null) {
            console = document.createElement("div");
            console.id = "debuginfo";
            console.style.background = "#dedede";
            console.style.border = "1px solid silver";
            console.style.padding = "5px";
            console.style.width = "400px";
            console.style.position = "absolute";
            console.style.right = "0px";
            console.style.top = "0px";
            document.body.appendChild(console);
        }
        console.innerHTML += "<p>" + message + "</p>";
    }
    window["iMoney"]["log"] = log;
})();
