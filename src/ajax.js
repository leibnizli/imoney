$.define(function(){
    iMoney.extend({
        ajax:function(options){
            var settings = $.extend({}, options || {}),
                xhr = new XMLHttpRequest();
            xhr.open(settings.type, settings.url, async, settings.username, settings.password);
            xhr.send(settings.data ? settings.data : null)
            return xhr
        }
    })
    return iMoney;
});