iMoney.extend({
    cookie: function(key, value, options) {
        if (1 in arguments) {
            options = iMoney.extend({}, options || {});
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
        iMoney.cookie(key, '', iMoney.extend({}, options, {
            expires: -1
        }));
    }
});