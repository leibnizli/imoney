var iMoney = require("./imoney");
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
            return iMoney.isInArray(name, splitNamespaces(prop))
        })
    })
}
var removeMatchedEvents = function(el, namedHandler) {
    return function(event) {
        getEventsToRemove(el, event).forEach(removeEvent(el, namedHandler))
    }
}
iMoney.fn.extend({
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