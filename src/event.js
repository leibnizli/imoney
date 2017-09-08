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

// delegate

var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
        proto.mozMatchesSelector ||
        proto.msMatchesSelector ||
        proto.oMatchesSelector ||
        proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
            return element;
        }
        element = element.parentNode;
    }
}


/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, type, selector, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
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
    },
    /**
     * Delegates event to a selector.
     *
     * @param {Element} element
     * @param {String} selector
     * @param {String} type
     * @param {Function} callback
     * @param {Boolean} useCapture
     * @return {Object}
     */
    delegate:function delegate(type, selector, callback, useCapture) {
        var element = this[0];
        var listenerFn = listener.apply(this, [element,type, selector, callback, useCapture]);

        element.addEventListener(type, listenerFn, useCapture);

        return {
            destroy: function() {
                element.removeEventListener(type, listenerFn, useCapture);
            }
        }
    }
});