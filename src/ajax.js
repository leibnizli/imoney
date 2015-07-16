$.define(function() {
    var jsonpID = 0;
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
    var defaults = {
        type: 'GET',
        beforeSend: empty,
        success: empty,
        error: empty,
        complete: empty,
        context: null,
        global: true,
        xhr: function() {
            return new window.XMLHttpRequest()
        },
        accepts: {
            script: 'text/javascript, application/javascript, application/x-javascript',
            json: 'application/json',
            xml: 'application/xml, text/xml',
            html: 'text/html',
            text: 'text/plain'
        },
        crossDomain: false,
        timeout: 0,
        processData: true,
        cache: true
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
                throw new Error("load error");
            });
            script.addEventListener("load", function() {
                clearTimeout(abortTimeout);
                ajaxSuccess(responseData[0], xhr, options)
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
            return xhr
        },
        ajax: function(options) {
            var settings = $.extend(defaults, options || {}),
                xhr = new XMLHttpRequest()
            hashIndex, params = [];
            if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex);
            if (typeof settings.data === "object") {
                for (key in settings.data) {
                    params.push(key + '=' + settings.data[key])
                }
                params.join("&");
                if (options.type.toUpperCase() == 'GET') {
                    appendQuery(settings.url, params);
                }
            }
            var dataType = settings.dataType,
                hasPlaceholder = /\?.+=\?/.test(settings.url)
            if (hasPlaceholder) dataType = 'jsonp'
            if ('jsonp' == dataType) {
                if (!hasPlaceholder)
                    settings.url = appendQuery(settings.url,
                        settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
                return iMoney.ajaxJSONP(settings)
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
                            throw new Error("parser error")
                        } else {
                            ajaxSuccess(result, xhr, settings)
                        }
                    }

                }
            }
            xhr.open(settings.type, settings.url, async, settings.username, settings.password);
            xhr.send(settings.data ? settings.data : null)
            return xhr

        }
    });
    return iMoney;
});