var iMoney = require("./imoney");
var support = (function() {
    var div = document.createElement('div'),
        vendors = 'Khtml Ms O Moz Webkit'.split(' '),
        len = vendors.length;
    return function(prop) {
        if (prop in div.style) return true;
        prop = prop.replace(/^[a-z]/, function(val) {
            return val.toUpperCase();
        });
        while (len--) {
            if (vendors[len] + prop in div.style) {
                return true;
            }
        }
        return false;
    };
})();
iMoney.extend({
    isSupport: function(prop) {
        return support(prop)
    }
});