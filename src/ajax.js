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
iMoney.extend({
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
            iMoney(script).remove();
            ajaxSuccess(responseData[0], null, options)
            window[callbackName] = originalCallback
            if (responseData && iMoney.isFunction(originalCallback))
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
            return iMoney.ajaxJSONP(settings)
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