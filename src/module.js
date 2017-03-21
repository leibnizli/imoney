var iMoney = require("./imoney");
(function() {
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
        var inCheckLoaded, context, Module, checkLoadedTimeoutId,
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
                this.load();
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
                    var id, mod;
                    depMap = makeModuleMap(depMap);
                    this.depMaps[i] = depMap;
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
                    if (mod && !mod.enabled) {
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
                        if (typeof deps === "string") {
                            deps = [deps]
                        }
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
                mod = iMoney.getOwn(registry, moduleName);
                if (!found && !iMoney.hasProp(defined, moduleName) && mod && !mod.inited) {
                    callGetModule([moduleName, [], function() {}]);
                }
                checkLoaded();
            },
            nameToUrl: function(moduleName) {
                var paths, syms, url = '';
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
})();