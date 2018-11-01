(function() {
/*!
 * @overview  Ember - JavaScript Application Framework
 * @copyright Copyright 2011-2018 Tilde Inc. and contributors
 *            Portions Copyright 2006-2011 Strobe Inc.
 *            Portions Copyright 2008-2011 Apple Inc. All rights reserved.
 * @license   Licensed under MIT license
 *            See https://raw.github.com/emberjs/ember.js/master/LICENSE
 * @version   3.4.6-ember-native-class-polyfill-3-4+c124663c
 */

/*globals process */
var enifed, requireModule, Ember;

// Used in ember-environment/lib/global.js
mainContext = this; // eslint-disable-line no-undef

(function() {
  function missingModule(name, referrerName) {
    if (referrerName) {
      throw new Error('Could not find module ' + name + ' required by: ' + referrerName);
    } else {
      throw new Error('Could not find module ' + name);
    }
  }

  function internalRequire(_name, referrerName) {
    var name = _name;
    var mod = registry[name];

    if (!mod) {
      name = name + '/index';
      mod = registry[name];
    }

    var exports = seen[name];

    if (exports !== undefined) {
      return exports;
    }

    exports = seen[name] = {};

    if (!mod) {
      missingModule(_name, referrerName);
    }

    var deps = mod.deps;
    var callback = mod.callback;
    var reified = new Array(deps.length);

    for (var i = 0; i < deps.length; i++) {
      if (deps[i] === 'exports') {
        reified[i] = exports;
      } else if (deps[i] === 'require') {
        reified[i] = requireModule;
      } else {
        reified[i] = internalRequire(deps[i], name);
      }
    }

    callback.apply(this, reified);

    return exports;
  }

  var isNode =
    typeof window === 'undefined' &&
    typeof process !== 'undefined' &&
    {}.toString.call(process) === '[object process]';

  if (!isNode) {
    Ember = this.Ember = this.Ember || {};
  }

  if (typeof Ember === 'undefined') {
    Ember = {};
  }

  if (typeof Ember.__loader === 'undefined') {
    var registry = {};
    var seen = {};

    enifed = function(name, deps, callback) {
      var value = {};

      if (!callback) {
        value.deps = [];
        value.callback = deps;
      } else {
        value.deps = deps;
        value.callback = callback;
      }

      registry[name] = value;
    };

    requireModule = function(name) {
      return internalRequire(name, null);
    };

    // setup `require` module
    requireModule['default'] = requireModule;

    requireModule.has = function registryHas(moduleName) {
      return !!registry[moduleName] || !!registry[moduleName + '/index'];
    };

    requireModule._eak_seen = registry;

    Ember.__loader = {
      define: enifed,
      require: requireModule,
      registry: registry,
    };
  } else {
    enifed = Ember.__loader.define;
    requireModule = Ember.__loader.require;
  }
})();

enifed('@ember/debug/index', ['exports', '@ember/debug/lib/warn', '@ember/debug/lib/deprecate', '@ember/debug/lib/testing', '@ember/error', 'ember-browser-environment'], function (exports, _warn2, _deprecate2, _testing, _error, _emberBrowserEnvironment) {
    'use strict';

    exports._warnIfUsingStrippedFeatureFlags = exports.getDebugFunction = exports.setDebugFunction = exports.deprecateFunc = exports.runInDebug = exports.debugFreeze = exports.debugSeal = exports.deprecate = exports.debug = exports.warn = exports.info = exports.assert = exports.setTesting = exports.isTesting = exports.registerDeprecationHandler = exports.registerWarnHandler = undefined;
    Object.defineProperty(exports, 'registerWarnHandler', {
        enumerable: true,
        get: function () {
            return _warn2.registerHandler;
        }
    });
    Object.defineProperty(exports, 'registerDeprecationHandler', {
        enumerable: true,
        get: function () {
            return _deprecate2.registerHandler;
        }
    });
    Object.defineProperty(exports, 'isTesting', {
        enumerable: true,
        get: function () {
            return _testing.isTesting;
        }
    });
    Object.defineProperty(exports, 'setTesting', {
        enumerable: true,
        get: function () {
            return _testing.setTesting;
        }
    });

    // These are the default production build versions:
    var noop = function () {};
    var assert = noop;
    var info = noop;
    var warn = noop;
    var debug = noop;
    var deprecate = noop;
    var debugSeal = noop;
    var debugFreeze = noop;
    var runInDebug = noop;
    var setDebugFunction = noop;
    var getDebugFunction = noop;
    var deprecateFunc = function () {
        return arguments[arguments.length - 1];
    };
    if (true) {
        exports.setDebugFunction = setDebugFunction = function (type, callback) {
            switch (type) {
                case 'assert':
                    return exports.assert = assert = callback;
                case 'info':
                    return exports.info = info = callback;
                case 'warn':
                    return exports.warn = warn = callback;
                case 'debug':
                    return exports.debug = debug = callback;
                case 'deprecate':
                    return exports.deprecate = deprecate = callback;
                case 'debugSeal':
                    return exports.debugSeal = debugSeal = callback;
                case 'debugFreeze':
                    return exports.debugFreeze = debugFreeze = callback;
                case 'runInDebug':
                    return exports.runInDebug = runInDebug = callback;
                case 'deprecateFunc':
                    return exports.deprecateFunc = deprecateFunc = callback;
            }
        };
        exports.getDebugFunction = getDebugFunction = function (type) {
            switch (type) {
                case 'assert':
                    return assert;
                case 'info':
                    return info;
                case 'warn':
                    return warn;
                case 'debug':
                    return debug;
                case 'deprecate':
                    return deprecate;
                case 'debugSeal':
                    return debugSeal;
                case 'debugFreeze':
                    return debugFreeze;
                case 'runInDebug':
                    return runInDebug;
                case 'deprecateFunc':
                    return deprecateFunc;
            }
        };
    }
    /**
    @module @ember/debug
    */
    if (true) {
        /**
          Verify that a certain expectation is met, or throw a exception otherwise.
             This is useful for communicating assumptions in the code to other human
          readers as well as catching bugs that accidentally violates these
          expectations.
             Assertions are removed from production builds, so they can be freely added
          for documentation and debugging purposes without worries of incuring any
          performance penalty. However, because of that, they should not be used for
          checks that could reasonably fail during normal usage. Furthermore, care
          should be taken to avoid accidentally relying on side-effects produced from
          evaluating the condition itself, since the code will not run in production.
             ```javascript
          import { assert } from '@ember/debug';
             // Test for truthiness
          assert('Must pass a string', typeof str === 'string');
             // Fail unconditionally
          assert('This code path should never be run');
          ```
             @method assert
          @static
          @for @ember/debug
          @param {String} description Describes the expectation. This will become the
            text of the Error thrown if the assertion fails.
          @param {Boolean} condition Must be truthy for the assertion to pass. If
            falsy, an exception will be thrown.
          @public
          @since 1.0.0
        */
        setDebugFunction('assert', function assert(desc, test) {
            if (!test) {
                throw new _error.default('Assertion Failed: ' + desc);
            }
        });
        /**
          Display a debug notice.
             Calls to this function are removed from production builds, so they can be
          freely added for documentation and debugging purposes without worries of
          incuring any performance penalty.
             ```javascript
          import { debug } from '@ember/debug';
             debug('I\'m a debug notice!');
          ```
             @method debug
          @for @ember/debug
          @static
          @param {String} message A debug message to display.
          @public
        */
        setDebugFunction('debug', function debug(message) {
            /* eslint-disable no-console */
            if (console.debug) {
                console.debug('DEBUG: ' + message);
            } else {
                console.log('DEBUG: ' + message);
            }
            /* eslint-ensable no-console */
        });
        /**
          Display an info notice.
             Calls to this function are removed from production builds, so they can be
          freely added for documentation and debugging purposes without worries of
          incuring any performance penalty.
             @method info
          @private
        */
        setDebugFunction('info', function info() {
            var _console;

            (_console = console).info.apply(_console, arguments); /* eslint-disable-line no-console */
        });
        /**
         @module @ember/application
         @public
        */
        /**
          Alias an old, deprecated method with its new counterpart.
             Display a deprecation warning with the provided message and a stack trace
          (Chrome and Firefox only) when the assigned method is called.
             Calls to this function are removed from production builds, so they can be
          freely added for documentation and debugging purposes without worries of
          incuring any performance penalty.
             ```javascript
          import { deprecateFunc } from '@ember/application/deprecations';
             Ember.oldMethod = deprecateFunc('Please use the new, updated method', options, Ember.newMethod);
          ```
             @method deprecateFunc
          @static
          @for @ember/application/deprecations
          @param {String} message A description of the deprecation.
          @param {Object} [options] The options object for `deprecate`.
          @param {Function} func The new function called to replace its deprecated counterpart.
          @return {Function} A new function that wraps the original function with a deprecation warning
          @private
        */
        setDebugFunction('deprecateFunc', function deprecateFunc() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (args.length === 3) {
                var message = args[0],
                    options = args[1],
                    func = args[2];

                return function () {
                    deprecate(message, false, options);
                    return func.apply(this, arguments);
                };
            } else {
                var _message = args[0],
                    _func = args[1];

                return function () {
                    deprecate(_message);
                    return _func.apply(this, arguments);
                };
            }
        });
        /**
         @module @ember/debug
         @public
        */
        /**
          Run a function meant for debugging.
             Calls to this function are removed from production builds, so they can be
          freely added for documentation and debugging purposes without worries of
          incuring any performance penalty.
             ```javascript
          import Component from '@ember/component';
          import { runInDebug } from '@ember/debug';
             runInDebug(() => {
            Component.reopen({
              didInsertElement() {
                console.log("I'm happy");
              }
            });
          });
          ```
             @method runInDebug
          @for @ember/debug
          @static
          @param {Function} func The function to be executed.
          @since 1.5.0
          @public
        */
        setDebugFunction('runInDebug', function runInDebug(func) {
            func();
        });
        setDebugFunction('debugSeal', function debugSeal(obj) {
            Object.seal(obj);
        });
        setDebugFunction('debugFreeze', function debugFreeze(obj) {
            Object.freeze(obj);
        });
        setDebugFunction('deprecate', _deprecate2.default);
        setDebugFunction('warn', _warn2.default);
    }
    var _warnIfUsingStrippedFeatureFlags = void 0;
    if (true && !(0, _testing.isTesting)()) {
        if (typeof window !== 'undefined' && (_emberBrowserEnvironment.isFirefox || _emberBrowserEnvironment.isChrome) && window.addEventListener) {
            window.addEventListener('load', function () {
                if (document.documentElement && document.documentElement.dataset && !document.documentElement.dataset.emberExtension) {
                    var downloadURL = void 0;
                    if (_emberBrowserEnvironment.isChrome) {
                        downloadURL = 'https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi';
                    } else if (_emberBrowserEnvironment.isFirefox) {
                        downloadURL = 'https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/';
                    }
                    debug('For more advanced debugging, install the Ember Inspector from ' + downloadURL);
                }
            }, false);
        }
    }
    exports.assert = assert;
    exports.info = info;
    exports.warn = warn;
    exports.debug = debug;
    exports.deprecate = deprecate;
    exports.debugSeal = debugSeal;
    exports.debugFreeze = debugFreeze;
    exports.runInDebug = runInDebug;
    exports.deprecateFunc = deprecateFunc;
    exports.setDebugFunction = setDebugFunction;
    exports.getDebugFunction = getDebugFunction;
    exports._warnIfUsingStrippedFeatureFlags = _warnIfUsingStrippedFeatureFlags;
});
enifed('@ember/debug/lib/deprecate', ['exports', '@ember/deprecated-features', 'ember-environment', '@ember/debug/index', '@ember/debug/lib/handlers'], function (exports, _deprecatedFeatures, _emberEnvironment, _index, _handlers) {
    'use strict';

    exports.missingOptionsUntilDeprecation = exports.missingOptionsIdDeprecation = exports.missingOptionsDeprecation = exports.registerHandler = undefined;

    /**
     @module @ember/debug
     @public
    */
    /**
      Allows for runtime registration of handler functions that override the default deprecation behavior.
      Deprecations are invoked by calls to [@ember/application/deprecations/deprecate](https://emberjs.com/api/ember/release/classes/@ember%2Fapplication%2Fdeprecations/methods/deprecate?anchor=deprecate).
      The following example demonstrates its usage by registering a handler that throws an error if the
      message contains the word "should", otherwise defers to the default handler.
    
      ```javascript
      import { registerDeprecationHandler } from '@ember/debug';
    
      registerDeprecationHandler((message, options, next) => {
        if (message.indexOf('should') !== -1) {
          throw new Error(`Deprecation message with should: ${message}`);
        } else {
          // defer to whatever handler was registered before this one
          next(message, options);
        }
      });
      ```
    
      The handler function takes the following arguments:
    
      <ul>
        <li> <code>message</code> - The message received from the deprecation call.</li>
        <li> <code>options</code> - An object passed in with the deprecation call containing additional information including:</li>
          <ul>
            <li> <code>id</code> - An id of the deprecation in the form of <code>package-name.specific-deprecation</code>.</li>
            <li> <code>until</code> - The Ember version number the feature and deprecation will be removed in.</li>
          </ul>
        <li> <code>next</code> - A function that calls into the previously registered handler.</li>
      </ul>
    
      @public
      @static
      @method registerDeprecationHandler
      @for @ember/debug
      @param handler {Function} A function to handle deprecation calls.
      @since 2.1.0
    */
    var registerHandler = function () {};
    var missingOptionsDeprecation = void 0;
    var missingOptionsIdDeprecation = void 0;
    var missingOptionsUntilDeprecation = void 0;
    var deprecate = function () {};
    if (true) {
        exports.registerHandler = registerHandler = function registerHandler(handler) {
            (0, _handlers.registerHandler)('deprecate', handler);
        };
        var formatMessage = function formatMessage(_message, options) {
            var message = _message;
            if (options && options.id) {
                message = message + (' [deprecation id: ' + options.id + ']');
            }
            if (options && options.url) {
                message += ' See ' + options.url + ' for more details.';
            }
            return message;
        };
        registerHandler(function logDeprecationToConsole(message, options) {
            var updatedMessage = formatMessage(message, options);
            console.warn('DEPRECATION: ' + updatedMessage); // eslint-disable-line no-console
        });
        var captureErrorForStack = void 0;
        if (new Error().stack) {
            captureErrorForStack = function () {
                return new Error();
            };
        } else {
            captureErrorForStack = function () {
                try {
                    __fail__.fail();
                } catch (e) {
                    return e;
                }
            };
        }
        registerHandler(function logDeprecationStackTrace(message, options, next) {
            if (_emberEnvironment.ENV.LOG_STACKTRACE_ON_DEPRECATION) {
                var stackStr = '';
                var error = captureErrorForStack();
                var stack = void 0;
                if (error.stack) {
                    if (error['arguments']) {
                        // Chrome
                        stack = error.stack.replace(/^\s+at\s+/gm, '').replace(/^([^\(]+?)([\n$])/gm, '{anonymous}($1)$2').replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}($1)').split('\n');
                        stack.shift();
                    } else {
                        // Firefox
                        stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
                    }
                    stackStr = '\n    ' + stack.slice(2).join('\n    ');
                }
                var updatedMessage = formatMessage(message, options);
                console.warn('DEPRECATION: ' + updatedMessage + stackStr); // eslint-disable-line no-console
            } else {
                next(message, options);
            }
        });
        registerHandler(function raiseOnDeprecation(message, options, next) {
            if (_emberEnvironment.ENV.RAISE_ON_DEPRECATION) {
                var updatedMessage = formatMessage(message);
                throw new Error(updatedMessage);
            } else {
                next(message, options);
            }
        });
        exports.missingOptionsDeprecation = missingOptionsDeprecation = 'When calling `deprecate` you ' + 'must provide an `options` hash as the third parameter.  ' + '`options` should include `id` and `until` properties.';
        exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation = 'When calling `deprecate` you must provide `id` in options.';
        exports.missingOptionsUntilDeprecation = missingOptionsUntilDeprecation = 'When calling `deprecate` you must provide `until` in options.';
        /**
         @module @ember/application
         @public
         */
        /**
          Display a deprecation warning with the provided message and a stack trace
          (Chrome and Firefox only).
             * In a production build, this method is defined as an empty function (NOP).
          Uses of this method in Ember itself are stripped from the ember.prod.js build.
             @method deprecate
          @for @ember/application/deprecations
          @param {String} message A description of the deprecation.
          @param {Boolean} test A boolean. If falsy, the deprecation will be displayed.
          @param {Object} options
          @param {String} options.id A unique id for this deprecation. The id can be
            used by Ember debugging tools to change the behavior (raise, log or silence)
            for that specific deprecation. The id should be namespaced by dots, e.g.
            "view.helper.select".
          @param {string} options.until The version of Ember when this deprecation
            warning will be removed.
          @param {String} [options.url] An optional url to the transition guide on the
            emberjs.com website.
          @static
          @public
          @since 1.0.0
        */
        deprecate = function deprecate(message, test, options) {
            if (_emberEnvironment.ENV._ENABLE_DEPRECATION_OPTIONS_SUPPORT !== true) {
                (0, _index.assert)(missingOptionsDeprecation, !!(options && (options.id || options.until)));
                (0, _index.assert)(missingOptionsIdDeprecation, !!options.id);
                (0, _index.assert)(missingOptionsUntilDeprecation, !!options.until);
            }
            if (_deprecatedFeatures.DEPRECATE_OPTIONS_MISSING && (!options || !options.id && !options.until) && _emberEnvironment.ENV._ENABLE_DEPRECATION_OPTIONS_SUPPORT === true) {
                deprecate(missingOptionsDeprecation, false, {
                    id: 'ember-debug.deprecate-options-missing',
                    until: '3.0.0',
                    url: 'https://emberjs.com/deprecations/v2.x/#toc_ember-debug-function-options'
                });
            }
            if (_deprecatedFeatures.DEPRECATE_ID_MISSING && options && !options.id && _emberEnvironment.ENV._ENABLE_DEPRECATION_OPTIONS_SUPPORT === true) {
                deprecate(missingOptionsIdDeprecation, false, {
                    id: 'ember-debug.deprecate-id-missing',
                    until: '3.0.0',
                    url: 'https://emberjs.com/deprecations/v2.x/#toc_ember-debug-function-options'
                });
            }
            if (_deprecatedFeatures.DEPRECATE_UNTIL_MISSING && options && !options.until && _emberEnvironment.ENV._ENABLE_DEPRECATION_OPTIONS_SUPPORT === true) {
                deprecate(missingOptionsUntilDeprecation, !!(options && options.until), {
                    id: 'ember-debug.deprecate-until-missing',
                    until: '3.0.0',
                    url: 'https://emberjs.com/deprecations/v2.x/#toc_ember-debug-function-options'
                });
            }
            (0, _handlers.invoke)('deprecate', message, test, options);
        };
    }
    exports.default = deprecate;
    exports.registerHandler = registerHandler;
    exports.missingOptionsDeprecation = missingOptionsDeprecation;
    exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation;
    exports.missingOptionsUntilDeprecation = missingOptionsUntilDeprecation;
});
enifed('@ember/debug/lib/handlers', ['exports'], function (exports) {
    'use strict';

    var HANDLERS = exports.HANDLERS = {};
    var registerHandler = function () {};
    var invoke = function () {};
    if (true) {
        exports.registerHandler = registerHandler = function registerHandler(type, callback) {
            var nextHandler = HANDLERS[type] || function () {};
            HANDLERS[type] = function (message, options) {
                callback(message, options, nextHandler);
            };
        };
        exports.invoke = invoke = function invoke(type, message, test, options) {
            if (test) {
                return;
            }
            var handlerForType = HANDLERS[type];
            if (handlerForType) {
                handlerForType(message, options);
            }
        };
    }
    exports.registerHandler = registerHandler;
    exports.invoke = invoke;
});
enifed("@ember/debug/lib/testing", ["exports"], function (exports) {
    "use strict";

    exports.isTesting = isTesting;
    exports.setTesting = setTesting;
    var testing = false;
    function isTesting() {
        return testing;
    }
    function setTesting(value) {
        testing = !!value;
    }
});
enifed('@ember/debug/lib/warn', ['exports', 'ember-environment', '@ember/debug/index', '@ember/debug/lib/deprecate', '@ember/debug/lib/handlers'], function (exports, _emberEnvironment, _index, _deprecate, _handlers) {
    'use strict';

    exports.missingOptionsDeprecation = exports.missingOptionsIdDeprecation = exports.registerHandler = undefined;

    var registerHandler = function () {};
    var warn = function () {};
    var missingOptionsDeprecation = void 0;
    var missingOptionsIdDeprecation = void 0;
    /**
    @module @ember/debug
    */
    if (true) {
        /**
          Allows for runtime registration of handler functions that override the default warning behavior.
          Warnings are invoked by calls made to [@ember/debug/warn](https://emberjs.com/api/ember/release/classes/@ember%2Fdebug/methods/warn?anchor=warn).
          The following example demonstrates its usage by registering a handler that does nothing overriding Ember's
          default warning behavior.
             ```javascript
          import { registerWarnHandler } from '@ember/debug';
             // next is not called, so no warnings get the default behavior
          registerWarnHandler(() => {});
          ```
             The handler function takes the following arguments:
             <ul>
            <li> <code>message</code> - The message received from the warn call. </li>
            <li> <code>options</code> - An object passed in with the warn call containing additional information including:</li>
              <ul>
                <li> <code>id</code> - An id of the warning in the form of <code>package-name.specific-warning</code>.</li>
              </ul>
            <li> <code>next</code> - A function that calls into the previously registered handler.</li>
          </ul>
             @public
          @static
          @method registerWarnHandler
          @for @ember/debug
          @param handler {Function} A function to handle warnings.
          @since 2.1.0
        */
        exports.registerHandler = registerHandler = function registerHandler(handler) {
            (0, _handlers.registerHandler)('warn', handler);
        };
        registerHandler(function logWarning(message) {
            /* eslint-disable no-console */
            console.warn('WARNING: ' + message);
            if (console.trace) {
                console.trace();
            }
            /* eslint-enable no-console */
        });
        exports.missingOptionsDeprecation = missingOptionsDeprecation = 'When calling `warn` you ' + 'must provide an `options` hash as the third parameter.  ' + '`options` should include an `id` property.';
        exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation = 'When calling `warn` you must provide `id` in options.';
        /**
          Display a warning with the provided message.
             * In a production build, this method is defined as an empty function (NOP).
          Uses of this method in Ember itself are stripped from the ember.prod.js build.
             @method warn
          @for @ember/debug
          @static
          @param {String} message A warning to display.
          @param {Boolean} test An optional boolean. If falsy, the warning
            will be displayed.
          @param {Object} options An object that can be used to pass a unique
            `id` for this warning.  The `id` can be used by Ember debugging tools
            to change the behavior (raise, log, or silence) for that specific warning.
            The `id` should be namespaced by dots, e.g. "ember-debug.feature-flag-with-features-stripped"
          @public
          @since 1.0.0
        */
        warn = function warn(message, test, options) {
            if (arguments.length === 2 && typeof test === 'object') {
                options = test;
                test = false;
            }
            if (_emberEnvironment.ENV._ENABLE_WARN_OPTIONS_SUPPORT !== true) {
                (0, _index.assert)(missingOptionsDeprecation, !!options);
                (0, _index.assert)(missingOptionsIdDeprecation, !!(options && options.id));
            }
            if (!options && _emberEnvironment.ENV._ENABLE_WARN_OPTIONS_SUPPORT === true) {
                (0, _deprecate.default)(missingOptionsDeprecation, false, {
                    id: 'ember-debug.warn-options-missing',
                    until: '3.0.0',
                    url: 'https://emberjs.com/deprecations/v2.x/#toc_ember-debug-function-options'
                });
            }
            if (options && !options.id && _emberEnvironment.ENV._ENABLE_WARN_OPTIONS_SUPPORT === true) {
                (0, _deprecate.default)(missingOptionsIdDeprecation, false, {
                    id: 'ember-debug.warn-id-missing',
                    until: '3.0.0',
                    url: 'https://emberjs.com/deprecations/v2.x/#toc_ember-debug-function-options'
                });
            }
            (0, _handlers.invoke)('warn', message, test, options);
        };
    }
    exports.default = warn;
    exports.registerHandler = registerHandler;
    exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation;
    exports.missingOptionsDeprecation = missingOptionsDeprecation;
});
enifed('ember-babel', ['exports'], function (exports) {
  'use strict';

  exports.classCallCheck = classCallCheck;
  exports.inherits = inherits;
  exports.taggedTemplateLiteralLoose = taggedTemplateLiteralLoose;
  exports.createClass = createClass;
  var create = Object.create;
  var setPrototypeOf = Object.setPrototypeOf;
  var defineProperty = Object.defineProperty;

  function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  function inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = create(superClass === null ? null : superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass !== null) setPrototypeOf(subClass, superClass);
  }

  function taggedTemplateLiteralLoose(strings, raw) {
    strings.raw = raw;
    return strings;
  }

  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      defineProperty(target, descriptor.key, descriptor);
    }
  }

  function createClass(Constructor, protoProps, staticProps) {
    if (protoProps !== undefined) defineProperties(Constructor.prototype, protoProps);
    if (staticProps !== undefined) defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var possibleConstructorReturn = exports.possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError('this hasn\'t been initialized - super() hasn\'t been called');
    }
    return call !== null && typeof call === 'object' || typeof call === 'function' ? call : self;
  };
});
enifed('ember-testing/index', ['exports', 'ember-testing/lib/test', 'ember-testing/lib/adapters/adapter', 'ember-testing/lib/setup_for_testing', 'ember-testing/lib/adapters/qunit', 'ember-testing/lib/support', 'ember-testing/lib/ext/application', 'ember-testing/lib/ext/rsvp', 'ember-testing/lib/helpers', 'ember-testing/lib/initializers'], function (exports, _test, _adapter, _setup_for_testing, _qunit) {
  'use strict';

  exports.QUnitAdapter = exports.setupForTesting = exports.Adapter = exports.Test = undefined;
  Object.defineProperty(exports, 'Test', {
    enumerable: true,
    get: function () {
      return _test.default;
    }
  });
  Object.defineProperty(exports, 'Adapter', {
    enumerable: true,
    get: function () {
      return _adapter.default;
    }
  });
  Object.defineProperty(exports, 'setupForTesting', {
    enumerable: true,
    get: function () {
      return _setup_for_testing.default;
    }
  });
  Object.defineProperty(exports, 'QUnitAdapter', {
    enumerable: true,
    get: function () {
      return _qunit.default;
    }
  });
});
enifed('ember-testing/lib/adapters/adapter', ['exports', 'ember-runtime'], function (exports, _emberRuntime) {
  'use strict';

  function K() {
    return this;
  }

  /**
   @module @ember/test
  */

  /**
    The primary purpose of this class is to create hooks that can be implemented
    by an adapter for various test frameworks.
  
    @class TestAdapter
    @public
  */
  exports.default = _emberRuntime.Object.extend({
    /**
      This callback will be called whenever an async operation is about to start.
       Override this to call your framework's methods that handle async
      operations.
       @public
      @method asyncStart
    */
    asyncStart: K,

    /**
      This callback will be called whenever an async operation has completed.
       @public
      @method asyncEnd
    */
    asyncEnd: K,

    /**
      Override this method with your testing framework's false assertion.
      This function is called whenever an exception occurs causing the testing
      promise to fail.
       QUnit example:
       ```javascript
        exception: function(error) {
          ok(false, error);
        };
      ```
       @public
      @method exception
      @param {String} error The exception to be raised.
    */
    exception: function (error) {
      throw error;
    }
  });
});
enifed('ember-testing/lib/adapters/qunit', ['exports', 'ember-utils', 'ember-testing/lib/adapters/adapter'], function (exports, _emberUtils, _adapter) {
  'use strict';

  exports.default = _adapter.default.extend({
    init: function () {
      this.doneCallbacks = [];
    },
    asyncStart: function () {
      if (typeof QUnit.stop === 'function') {
        // very old QUnit version
        QUnit.stop();
      } else {
        this.doneCallbacks.push(QUnit.config.current ? QUnit.config.current.assert.async() : null);
      }
    },
    asyncEnd: function () {
      // checking for QUnit.stop here (even though we _need_ QUnit.start) because
      // QUnit.start() still exists in QUnit 2.x (it just throws an error when calling
      // inside a test context)
      if (typeof QUnit.stop === 'function') {
        QUnit.start();
      } else {
        var done = this.doneCallbacks.pop();
        // This can be null if asyncStart() was called outside of a test
        if (done) {
          done();
        }
      }
    },
    exception: function (error) {
      QUnit.config.current.assert.ok(false, (0, _emberUtils.inspect)(error));
    }
  });
});
enifed('ember-testing/lib/events', ['exports', '@ember/runloop', '@ember/polyfills', 'ember-testing/lib/helpers/-is-form-control'], function (exports, _runloop, _polyfills, _isFormControl) {
  'use strict';

  exports.focus = focus;
  exports.fireEvent = fireEvent;


  var DEFAULT_EVENT_OPTIONS = { canBubble: true, cancelable: true };
  var KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];
  var MOUSE_EVENT_TYPES = ['click', 'mousedown', 'mouseup', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover'];

  function focus(el) {
    if (!el) {
      return;
    }
    if (el.isContentEditable || (0, _isFormControl.default)(el)) {
      var type = el.getAttribute('type');
      if (type !== 'checkbox' && type !== 'radio' && type !== 'hidden') {
        (0, _runloop.run)(null, function () {
          var browserIsNotFocused = document.hasFocus && !document.hasFocus();

          // makes `document.activeElement` be `element`. If the browser is focused, it also fires a focus event
          el.focus();

          // Firefox does not trigger the `focusin` event if the window
          // does not have focus. If the document does not have focus then
          // fire `focusin` event as well.
          if (browserIsNotFocused) {
            // if the browser is not focused the previous `el.focus()` didn't fire an event, so we simulate it
            fireEvent(el, 'focus', {
              bubbles: false
            });

            fireEvent(el, 'focusin');
          }
        });
      }
    }
  }

  function fireEvent(element, type) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!element) {
      return;
    }
    var event = void 0;
    if (KEYBOARD_EVENT_TYPES.indexOf(type) > -1) {
      event = buildKeyboardEvent(type, options);
    } else if (MOUSE_EVENT_TYPES.indexOf(type) > -1) {
      var rect = element.getBoundingClientRect();
      var x = rect.left + 1;
      var y = rect.top + 1;
      var simulatedCoordinates = {
        screenX: x + 5,
        screenY: y + 95,
        clientX: x,
        clientY: y
      };
      event = buildMouseEvent(type, (0, _polyfills.assign)(simulatedCoordinates, options));
    } else {
      event = buildBasicEvent(type, options);
    }
    element.dispatchEvent(event);
  }

  function buildBasicEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var event = document.createEvent('Events');

    // Event.bubbles is read only
    var bubbles = options.bubbles !== undefined ? options.bubbles : true;
    var cancelable = options.cancelable !== undefined ? options.cancelable : true;

    delete options.bubbles;
    delete options.cancelable;

    event.initEvent(type, bubbles, cancelable);
    (0, _polyfills.assign)(event, options);
    return event;
  }

  function buildMouseEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var event = void 0;
    try {
      event = document.createEvent('MouseEvents');
      var eventOpts = (0, _polyfills.assign)({}, DEFAULT_EVENT_OPTIONS, options);
      event.initMouseEvent(type, eventOpts.canBubble, eventOpts.cancelable, window, eventOpts.detail, eventOpts.screenX, eventOpts.screenY, eventOpts.clientX, eventOpts.clientY, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.button, eventOpts.relatedTarget);
    } catch (e) {
      event = buildBasicEvent(type, options);
    }
    return event;
  }

  function buildKeyboardEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var event = void 0;
    try {
      event = document.createEvent('KeyEvents');
      var eventOpts = (0, _polyfills.assign)({}, DEFAULT_EVENT_OPTIONS, options);
      event.initKeyEvent(type, eventOpts.canBubble, eventOpts.cancelable, window, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.keyCode, eventOpts.charCode);
    } catch (e) {
      event = buildBasicEvent(type, options);
    }
    return event;
  }
});
enifed('ember-testing/lib/ext/application', ['@ember/application', 'ember-testing/lib/setup_for_testing', 'ember-testing/lib/test/helpers', 'ember-testing/lib/test/promise', 'ember-testing/lib/test/run', 'ember-testing/lib/test/on_inject_helpers', 'ember-testing/lib/test/adapter'], function (_application, _setup_for_testing, _helpers, _promise, _run, _on_inject_helpers, _adapter) {
  'use strict';

  _application.default.reopen({
    /**
     This property contains the testing helpers for the current application. These
     are created once you call `injectTestHelpers` on your `Application`
     instance. The included helpers are also available on the `window` object by
     default, but can be used from this object on the individual application also.
       @property testHelpers
      @type {Object}
      @default {}
      @public
    */
    testHelpers: {},

    /**
     This property will contain the original methods that were registered
     on the `helperContainer` before `injectTestHelpers` is called.
      When `removeTestHelpers` is called, these methods are restored to the
     `helperContainer`.
       @property originalMethods
      @type {Object}
      @default {}
      @private
      @since 1.3.0
    */
    originalMethods: {},

    /**
    This property indicates whether or not this application is currently in
    testing mode. This is set when `setupForTesting` is called on the current
    application.
     @property testing
    @type {Boolean}
    @default false
    @since 1.3.0
    @public
    */
    testing: false,

    setupForTesting: function () {
      (0, _setup_for_testing.default)();

      this.testing = true;

      this.resolveRegistration('router:main').reopen({
        location: 'none'
      });
    },


    /**
      This will be used as the container to inject the test helpers into. By
      default the helpers are injected into `window`.
       @property helperContainer
      @type {Object} The object to be used for test helpers.
      @default window
      @since 1.2.0
      @private
    */
    helperContainer: null,

    injectTestHelpers: function (helperContainer) {
      if (helperContainer) {
        this.helperContainer = helperContainer;
      } else {
        this.helperContainer = window;
      }

      this.reopen({
        willDestroy: function () {
          this._super.apply(this, arguments);
          this.removeTestHelpers();
        }
      });

      this.testHelpers = {};
      for (var name in _helpers.helpers) {
        this.originalMethods[name] = this.helperContainer[name];
        this.testHelpers[name] = this.helperContainer[name] = helper(this, name);
        protoWrap(_promise.default.prototype, name, helper(this, name), _helpers.helpers[name].meta.wait);
      }

      (0, _on_inject_helpers.invokeInjectHelpersCallbacks)(this);
    },
    removeTestHelpers: function () {
      if (!this.helperContainer) {
        return;
      }

      for (var name in _helpers.helpers) {
        this.helperContainer[name] = this.originalMethods[name];
        delete _promise.default.prototype[name];
        delete this.testHelpers[name];
        delete this.originalMethods[name];
      }
    }
  });

  // This method is no longer needed
  // But still here for backwards compatibility
  // of helper chaining
  function protoWrap(proto, name, callback, isAsync) {
    proto[name] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (isAsync) {
        return callback.apply(this, args);
      } else {
        return this.then(function () {
          return callback.apply(this, args);
        });
      }
    };
  }

  function helper(app, name) {
    var fn = _helpers.helpers[name].method;
    var meta = _helpers.helpers[name].meta;
    if (!meta.wait) {
      return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return fn.apply(app, [app].concat(args));
      };
    }

    return function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var lastPromise = (0, _run.default)(function () {
        return (0, _promise.resolve)((0, _promise.getLastPromise)());
      });

      // wait for last helper's promise to resolve and then
      // execute. To be safe, we need to tell the adapter we're going
      // asynchronous here, because fn may not be invoked before we
      // return.
      (0, _adapter.asyncStart)();
      return lastPromise.then(function () {
        return fn.apply(app, [app].concat(args));
      }).finally(_adapter.asyncEnd);
    };
  }
});
enifed('ember-testing/lib/ext/rsvp', ['exports', 'ember-runtime', '@ember/runloop', '@ember/debug', 'ember-testing/lib/test/adapter'], function (exports, _emberRuntime, _runloop, _debug, _adapter) {
  'use strict';

  _emberRuntime.RSVP.configure('async', function (callback, promise) {
    // if schedule will cause autorun, we need to inform adapter
    if ((0, _debug.isTesting)() && !_runloop.backburner.currentInstance) {
      (0, _adapter.asyncStart)();
      _runloop.backburner.schedule('actions', function () {
        (0, _adapter.asyncEnd)();
        callback(promise);
      });
    } else {
      _runloop.backburner.schedule('actions', function () {
        return callback(promise);
      });
    }
  });

  exports.default = _emberRuntime.RSVP;
});
enifed('ember-testing/lib/helpers', ['ember-testing/lib/test/helpers', 'ember-testing/lib/helpers/and_then', 'ember-testing/lib/helpers/click', 'ember-testing/lib/helpers/current_path', 'ember-testing/lib/helpers/current_route_name', 'ember-testing/lib/helpers/current_url', 'ember-testing/lib/helpers/fill_in', 'ember-testing/lib/helpers/find', 'ember-testing/lib/helpers/find_with_assert', 'ember-testing/lib/helpers/key_event', 'ember-testing/lib/helpers/pause_test', 'ember-testing/lib/helpers/trigger_event', 'ember-testing/lib/helpers/visit', 'ember-testing/lib/helpers/wait'], function (_helpers, _and_then, _click, _current_path, _current_route_name, _current_url, _fill_in, _find, _find_with_assert, _key_event, _pause_test, _trigger_event, _visit, _wait) {
  'use strict';

  (0, _helpers.registerAsyncHelper)('visit', _visit.default);
  (0, _helpers.registerAsyncHelper)('click', _click.default);
  (0, _helpers.registerAsyncHelper)('keyEvent', _key_event.default);
  (0, _helpers.registerAsyncHelper)('fillIn', _fill_in.default);
  (0, _helpers.registerAsyncHelper)('wait', _wait.default);
  (0, _helpers.registerAsyncHelper)('andThen', _and_then.default);
  (0, _helpers.registerAsyncHelper)('pauseTest', _pause_test.pauseTest);
  (0, _helpers.registerAsyncHelper)('triggerEvent', _trigger_event.default);

  (0, _helpers.registerHelper)('find', _find.default);
  (0, _helpers.registerHelper)('findWithAssert', _find_with_assert.default);
  (0, _helpers.registerHelper)('currentRouteName', _current_route_name.default);
  (0, _helpers.registerHelper)('currentPath', _current_path.default);
  (0, _helpers.registerHelper)('currentURL', _current_url.default);
  (0, _helpers.registerHelper)('resumeTest', _pause_test.resumeTest);
});
enifed('ember-testing/lib/helpers/-is-form-control', ['exports'], function (exports) {
  'use strict';

  exports.default = isFormControl;
  var FORM_CONTROL_TAGS = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];

  /**
    @private
    @param {Element} element the element to check
    @returns {boolean} `true` when the element is a form control, `false` otherwise
  */
  function isFormControl(element) {
    var tagName = element.tagName,
        type = element.type;


    if (type === 'hidden') {
      return false;
    }

    return FORM_CONTROL_TAGS.indexOf(tagName) > -1;
  }
});
enifed("ember-testing/lib/helpers/and_then", ["exports"], function (exports) {
  "use strict";

  exports.default = andThen;
  function andThen(app, callback) {
    return app.testHelpers.wait(callback(app));
  }
});
enifed('ember-testing/lib/helpers/click', ['exports', 'ember-testing/lib/events'], function (exports, _events) {
  'use strict';

  exports.default = click;


  /**
    Clicks an element and triggers any actions triggered by the element's `click`
    event.
  
    Example:
  
    ```javascript
    click('.some-jQuery-selector').then(function() {
      // assert something
    });
    ```
  
    @method click
    @param {String} selector jQuery selector for finding element on the DOM
    @param {Object} context A DOM Element, Document, or jQuery to use as context
    @return {RSVP.Promise<undefined>}
    @public
  */
  function click(app, selector, context) {
    var $el = app.testHelpers.findWithAssert(selector, context);
    var el = $el[0];

    (0, _events.fireEvent)(el, 'mousedown');

    (0, _events.focus)(el);

    (0, _events.fireEvent)(el, 'mouseup');
    (0, _events.fireEvent)(el, 'click');

    return app.testHelpers.wait();
  } /**
    @module ember
    */
});
enifed('ember-testing/lib/helpers/current_path', ['exports', 'ember-metal'], function (exports, _emberMetal) {
  'use strict';

  exports.default = currentPath;


  /**
    Returns the current path.
  
  Example:
  
  ```javascript
  function validateURL() {
    equal(currentPath(), 'some.path.index', "correct path was transitioned into.");
  }
  
  click('#some-link-id').then(validateURL);
  ```
  
  @method currentPath
  @return {Object} The currently active path.
  @since 1.5.0
  @public
  */
  function currentPath(app) {
    var routingService = app.__container__.lookup('service:-routing');
    return (0, _emberMetal.get)(routingService, 'currentPath');
  } /**
    @module ember
    */
});
enifed('ember-testing/lib/helpers/current_route_name', ['exports', 'ember-metal'], function (exports, _emberMetal) {
  'use strict';

  exports.default = currentRouteName;

  /**
    Returns the currently active route name.
  
  Example:
  
  ```javascript
  function validateRouteName() {
    equal(currentRouteName(), 'some.path', "correct route was transitioned into.");
  }
  visit('/some/path').then(validateRouteName)
  ```
  
  @method currentRouteName
  @return {Object} The name of the currently active route.
  @since 1.5.0
  @public
  */
  function currentRouteName(app) {
    var routingService = app.__container__.lookup('service:-routing');
    return (0, _emberMetal.get)(routingService, 'currentRouteName');
  } /**
    @module ember
    */
});
enifed('ember-testing/lib/helpers/current_url', ['exports', 'ember-metal'], function (exports, _emberMetal) {
  'use strict';

  exports.default = currentURL;


  /**
    Returns the current URL.
  
  Example:
  
  ```javascript
  function validateURL() {
    equal(currentURL(), '/some/path', "correct URL was transitioned into.");
  }
  
  click('#some-link-id').then(validateURL);
  ```
  
  @method currentURL
  @return {Object} The currently active URL.
  @since 1.5.0
  @public
  */
  function currentURL(app) {
    var router = app.__container__.lookup('router:main');
    return (0, _emberMetal.get)(router, 'location').getURL();
  } /**
    @module ember
    */
});
enifed('ember-testing/lib/helpers/fill_in', ['exports', 'ember-testing/lib/events', 'ember-testing/lib/helpers/-is-form-control'], function (exports, _events, _isFormControl) {
  'use strict';

  exports.default = fillIn;


  /**
    Fills in an input element with some text.
  
    Example:
  
    ```javascript
    fillIn('#email', 'you@example.com').then(function() {
      // assert something
    });
    ```
  
    @method fillIn
    @param {String} selector jQuery selector finding an input element on the DOM
    to fill text with
    @param {String} text text to place inside the input element
    @return {RSVP.Promise<undefined>}
    @public
  */
  /**
  @module ember
  */
  function fillIn(app, selector, contextOrText, text) {
    var $el = void 0,
        el = void 0,
        context = void 0;
    if (text === undefined) {
      text = contextOrText;
    } else {
      context = contextOrText;
    }
    $el = app.testHelpers.findWithAssert(selector, context);
    el = $el[0];
    (0, _events.focus)(el);

    if ((0, _isFormControl.default)(el)) {
      el.value = text;
    } else {
      el.innerHTML = text;
    }

    (0, _events.fireEvent)(el, 'input');
    (0, _events.fireEvent)(el, 'change');

    return app.testHelpers.wait();
  }
});
enifed('ember-testing/lib/helpers/find', ['exports', 'ember-metal', '@ember/debug', 'ember-views'], function (exports, _emberMetal, _debug, _emberViews) {
  'use strict';

  exports.default = find;


  /**
    Finds an element in the context of the app's container element. A simple alias
    for `app.$(selector)`.
  
    Example:
  
    ```javascript
    var $el = find('.my-selector');
    ```
  
    With the `context` param:
  
    ```javascript
    var $el = find('.my-selector', '.parent-element-class');
    ```
  
    @method find
    @param {String} selector jQuery selector for element lookup
    @param {String} [context] (optional) jQuery selector that will limit the selector
                              argument to find only within the context's children
    @return {Object} DOM element representing the results of the query
    @public
  */
  function find(app, selector, context) {
    if (_emberViews.jQueryDisabled) {
      (true && !(false) && (0, _debug.assert)('If jQuery is disabled, please import and use helpers from @ember/test-helpers [https://github.com/emberjs/ember-test-helpers]. Note: `find` is not an available helper.'));
    }
    var $el = void 0;
    context = context || (0, _emberMetal.get)(app, 'rootElement');
    $el = app.$(selector, context);
    return $el;
  } /**
    @module ember
    */
});
enifed('ember-testing/lib/helpers/find_with_assert', ['exports'], function (exports) {
  'use strict';

  exports.default = findWithAssert;
  /**
  @module ember
  */
  /**
    Like `find`, but throws an error if the element selector returns no results.
  
    Example:
  
    ```javascript
    var $el = findWithAssert('.doesnt-exist'); // throws error
    ```
  
    With the `context` param:
  
    ```javascript
    var $el = findWithAssert('.selector-id', '.parent-element-class'); // assert will pass
    ```
  
    @method findWithAssert
    @param {String} selector jQuery selector string for finding an element within
    the DOM
    @param {String} [context] (optional) jQuery selector that will limit the
    selector argument to find only within the context's children
    @return {Object} jQuery object representing the results of the query
    @throws {Error} throws error if object returned has a length of 0
    @public
  */
  function findWithAssert(app, selector, context) {
    var $el = app.testHelpers.find(selector, context);
    if ($el.length === 0) {
      throw new Error('Element ' + selector + ' not found.');
    }
    return $el;
  }
});
enifed("ember-testing/lib/helpers/key_event", ["exports"], function (exports) {
  "use strict";

  exports.default = keyEvent;
  /**
  @module ember
  */
  /**
    Simulates a key event, e.g. `keypress`, `keydown`, `keyup` with the desired keyCode
    Example:
    ```javascript
    keyEvent('.some-jQuery-selector', 'keypress', 13).then(function() {
     // assert something
    });
    ```
    @method keyEvent
    @param {String} selector jQuery selector for finding element on the DOM
    @param {String} type the type of key event, e.g. `keypress`, `keydown`, `keyup`
    @param {Number} keyCode the keyCode of the simulated key event
    @return {RSVP.Promise<undefined>}
    @since 1.5.0
    @public
  */
  function keyEvent(app, selector, contextOrType, typeOrKeyCode, keyCode) {
    var context = void 0,
        type = void 0;

    if (keyCode === undefined) {
      context = null;
      keyCode = typeOrKeyCode;
      type = contextOrType;
    } else {
      context = contextOrType;
      type = typeOrKeyCode;
    }

    return app.testHelpers.triggerEvent(selector, context, type, {
      keyCode: keyCode,
      which: keyCode
    });
  }
});
enifed('ember-testing/lib/helpers/pause_test', ['exports', 'ember-runtime', '@ember/debug'], function (exports, _emberRuntime, _debug) {
  'use strict';

  exports.resumeTest = resumeTest;
  exports.pauseTest = pauseTest;
  /**
  @module ember
  */
  var resume = void 0;

  /**
   Resumes a test paused by `pauseTest`.
  
   @method resumeTest
   @return {void}
   @public
  */
  function resumeTest() {
    (true && !(resume) && (0, _debug.assert)('Testing has not been paused. There is nothing to resume.', resume));

    resume();
    resume = undefined;
  }

  /**
   Pauses the current test - this is useful for debugging while testing or for test-driving.
   It allows you to inspect the state of your application at any point.
   Example (The test will pause before clicking the button):
  
   ```javascript
   visit('/')
   return pauseTest();
   click('.btn');
   ```
  
   You may want to turn off the timeout before pausing.
  
   qunit (as of 2.4.0):
  
   ```
   visit('/');
   assert.timeout(0);
   return pauseTest();
   click('.btn');
   ```
  
   mocha:
  
   ```
   visit('/');
   this.timeout(0);
   return pauseTest();
   click('.btn');
   ```
  
  
   @since 1.9.0
   @method pauseTest
   @return {Object} A promise that will never resolve
   @public
  */
  function pauseTest() {
    (0, _debug.info)('Testing paused. Use `resumeTest()` to continue.');

    return new _emberRuntime.RSVP.Promise(function (resolve) {
      resume = resolve;
    }, 'TestAdapter paused promise');
  }
});
enifed('ember-testing/lib/helpers/trigger_event', ['exports', 'ember-testing/lib/events'], function (exports, _events) {
  'use strict';

  exports.default = triggerEvent;

  /**
    Triggers the given DOM event on the element identified by the provided selector.
    Example:
    ```javascript
    triggerEvent('#some-elem-id', 'blur');
    ```
    This is actually used internally by the `keyEvent` helper like so:
    ```javascript
    triggerEvent('#some-elem-id', 'keypress', { keyCode: 13 });
    ```
   @method triggerEvent
   @param {String} selector jQuery selector for finding element on the DOM
   @param {String} [context] jQuery selector that will limit the selector
                             argument to find only within the context's children
   @param {String} type The event type to be triggered.
   @param {Object} [options] The options to be passed to jQuery.Event.
   @return {RSVP.Promise<undefined>}
   @since 1.5.0
   @public
  */
  function triggerEvent(app, selector, contextOrType, typeOrOptions, possibleOptions) {
    var arity = arguments.length;
    var context = void 0,
        type = void 0,
        options = void 0;

    if (arity === 3) {
      // context and options are optional, so this is
      // app, selector, type
      context = null;
      type = contextOrType;
      options = {};
    } else if (arity === 4) {
      // context and options are optional, so this is
      if (typeof typeOrOptions === 'object') {
        // either
        // app, selector, type, options
        context = null;
        type = contextOrType;
        options = typeOrOptions;
      } else {
        // or
        // app, selector, context, type
        context = contextOrType;
        type = typeOrOptions;
        options = {};
      }
    } else {
      context = contextOrType;
      type = typeOrOptions;
      options = possibleOptions;
    }

    var $el = app.testHelpers.findWithAssert(selector, context);
    var el = $el[0];

    (0, _events.fireEvent)(el, type, options);

    return app.testHelpers.wait();
  } /**
    @module ember
    */
});
enifed('ember-testing/lib/helpers/visit', ['exports', '@ember/runloop'], function (exports, _runloop) {
  'use strict';

  exports.default = visit;


  /**
    Loads a route, sets up any controllers, and renders any templates associated
    with the route as though a real user had triggered the route change while
    using your app.
  
    Example:
  
    ```javascript
    visit('posts/index').then(function() {
      // assert something
    });
    ```
  
    @method visit
    @param {String} url the name of the route
    @return {RSVP.Promise<undefined>}
    @public
  */
  function visit(app, url) {
    var router = app.__container__.lookup('router:main');
    var shouldHandleURL = false;

    app.boot().then(function () {
      router.location.setURL(url);

      if (shouldHandleURL) {
        (0, _runloop.run)(app.__deprecatedInstance__, 'handleURL', url);
      }
    });

    if (app._readinessDeferrals > 0) {
      router['initialURL'] = url;
      (0, _runloop.run)(app, 'advanceReadiness');
      delete router['initialURL'];
    } else {
      shouldHandleURL = true;
    }

    return app.testHelpers.wait();
  }
});
enifed('ember-testing/lib/helpers/wait', ['exports', 'ember-testing/lib/test/waiters', 'ember-runtime', '@ember/runloop', 'ember-testing/lib/test/pending_requests'], function (exports, _waiters, _emberRuntime, _runloop, _pending_requests) {
  'use strict';

  exports.default = wait;


  /**
    Causes the run loop to process any pending events. This is used to ensure that
    any async operations from other helpers (or your assertions) have been processed.
  
    This is most often used as the return value for the helper functions (see 'click',
    'fillIn','visit',etc). However, there is a method to register a test helper which
    utilizes this method without the need to actually call `wait()` in your helpers.
  
    The `wait` helper is built into `registerAsyncHelper` by default. You will not need
    to `return app.testHelpers.wait();` - the wait behavior is provided for you.
  
    Example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
  
    registerAsyncHelper('loginUser', function(app, username, password) {
      visit('secured/path/here')
        .fillIn('#username', username)
        .fillIn('#password', password)
        .click('.submit');
    });
    ```
  
    @method wait
    @param {Object} value The value to be returned.
    @return {RSVP.Promise<any>} Promise that resolves to the passed value.
    @public
    @since 1.0.0
  */
  /**
  @module ember
  */
  function wait(app, value) {
    return new _emberRuntime.RSVP.Promise(function (resolve) {
      var router = app.__container__.lookup('router:main');

      // Every 10ms, poll for the async thing to have finished
      var watcher = setInterval(function () {
        // 1. If the router is loading, keep polling
        var routerIsLoading = router._routerMicrolib && !!router._routerMicrolib.activeTransition;
        if (routerIsLoading) {
          return;
        }

        // 2. If there are pending Ajax requests, keep polling
        if ((0, _pending_requests.pendingRequests)()) {
          return;
        }

        // 3. If there are scheduled timers or we are inside of a run loop, keep polling
        if ((0, _runloop.hasScheduledTimers)() || (0, _runloop.getCurrentRunLoop)()) {
          return;
        }

        if ((0, _waiters.checkWaiters)()) {
          return;
        }

        // Stop polling
        clearInterval(watcher);

        // Synchronously resolve the promise
        (0, _runloop.run)(null, resolve, value);
      }, 10);
    });
  }
});
enifed('ember-testing/lib/initializers', ['@ember/application'], function (_application) {
  'use strict';

  var name = 'deferReadiness in `testing` mode';

  (0, _application.onLoad)('Ember.Application', function (Application) {
    if (!Application.initializers[name]) {
      Application.initializer({
        name: name,

        initialize: function (application) {
          if (application.testing) {
            application.deferReadiness();
          }
        }
      });
    }
  });
});
enifed('ember-testing/lib/setup_for_testing', ['exports', '@ember/debug', 'ember-views', 'ember-testing/lib/test/adapter', 'ember-testing/lib/test/pending_requests', 'ember-testing/lib/adapters/adapter', 'ember-testing/lib/adapters/qunit'], function (exports, _debug, _emberViews, _adapter, _pending_requests, _adapter2, _qunit) {
  'use strict';

  exports.default = setupForTesting;


  /**
    Sets Ember up for testing. This is useful to perform
    basic setup steps in order to unit test.
  
    Use `App.setupForTesting` to perform integration tests (full
    application testing).
  
    @method setupForTesting
    @namespace Ember
    @since 1.5.0
    @private
  */
  /* global self */

  function setupForTesting() {
    (0, _debug.setTesting)(true);

    var adapter = (0, _adapter.getAdapter)();
    // if adapter is not manually set default to QUnit
    if (!adapter) {
      (0, _adapter.setAdapter)(typeof self.QUnit === 'undefined' ? _adapter2.default.create() : _qunit.default.create());
    }

    if (!_emberViews.jQueryDisabled) {
      (0, _emberViews.jQuery)(document).off('ajaxSend', _pending_requests.incrementPendingRequests);
      (0, _emberViews.jQuery)(document).off('ajaxComplete', _pending_requests.decrementPendingRequests);

      (0, _pending_requests.clearPendingRequests)();

      (0, _emberViews.jQuery)(document).on('ajaxSend', _pending_requests.incrementPendingRequests);
      (0, _emberViews.jQuery)(document).on('ajaxComplete', _pending_requests.decrementPendingRequests);
    }
  }
});
enifed('ember-testing/lib/support', ['@ember/debug', 'ember-views', 'ember-browser-environment'], function (_debug, _emberViews, _emberBrowserEnvironment) {
  'use strict';

  /**
    @module ember
  */

  var $ = _emberViews.jQuery;

  /**
    This method creates a checkbox and triggers the click event to fire the
    passed in handler. It is used to correct for a bug in older versions
    of jQuery (e.g 1.8.3).
  
    @private
    @method testCheckboxClick
  */
  function testCheckboxClick(handler) {
    var input = document.createElement('input');
    $(input).attr('type', 'checkbox').css({ position: 'absolute', left: '-1000px', top: '-1000px' }).appendTo('body').on('click', handler).trigger('click').remove();
  }

  if (_emberBrowserEnvironment.hasDOM && !_emberViews.jQueryDisabled) {
    $(function () {
      /*
        Determine whether a checkbox checked using jQuery's "click" method will have
        the correct value for its checked property.
         If we determine that the current jQuery version exhibits this behavior,
        patch it to work correctly as in the commit for the actual fix:
        https://github.com/jquery/jquery/commit/1fb2f92.
      */
      testCheckboxClick(function () {
        if (!this.checked && !$.event.special.click) {
          $.event.special.click = {
            trigger: function () {
              if (this.nodeName === 'INPUT' && this.type === 'checkbox' && this.click) {
                this.click();
                return false;
              }
            }
          };
        }
      });

      // Try again to verify that the patch took effect or blow up.
      testCheckboxClick(function () {
        (true && (0, _debug.warn)("clicked checkboxes should be checked! the jQuery patch didn't work", this.checked, {
          id: 'ember-testing.test-checkbox-click'
        }));
      });
    });
  }
});
enifed('ember-testing/lib/test', ['exports', 'ember-testing/lib/test/helpers', 'ember-testing/lib/test/on_inject_helpers', 'ember-testing/lib/test/promise', 'ember-testing/lib/test/waiters', 'ember-testing/lib/test/adapter'], function (exports, _helpers, _on_inject_helpers, _promise, _waiters, _adapter) {
  'use strict';

  /**
    This is a container for an assortment of testing related functionality:
  
    * Choose your default test adapter (for your framework of choice).
    * Register/Unregister additional test helpers.
    * Setup callbacks to be fired when the test helpers are injected into
      your application.
  
    @class Test
    @namespace Ember
    @public
  */
  var Test = {
    /**
      Hash containing all known test helpers.
       @property _helpers
      @private
      @since 1.7.0
    */
    _helpers: _helpers.helpers,

    registerHelper: _helpers.registerHelper,
    registerAsyncHelper: _helpers.registerAsyncHelper,
    unregisterHelper: _helpers.unregisterHelper,
    onInjectHelpers: _on_inject_helpers.onInjectHelpers,
    Promise: _promise.default,
    promise: _promise.promise,
    resolve: _promise.resolve,
    registerWaiter: _waiters.registerWaiter,
    unregisterWaiter: _waiters.unregisterWaiter,
    checkWaiters: _waiters.checkWaiters
  };

  /**
   Used to allow ember-testing to communicate with a specific testing
   framework.
  
   You can manually set it before calling `App.setupForTesting()`.
  
   Example:
  
   ```javascript
   Ember.Test.adapter = MyCustomAdapter.create()
   ```
  
   If you do not set it, ember-testing will default to `Ember.Test.QUnitAdapter`.
  
   @public
   @for Ember.Test
   @property adapter
   @type {Class} The adapter to be used.
   @default Ember.Test.QUnitAdapter
  */
  /**
    @module ember
  */
  Object.defineProperty(Test, 'adapter', {
    get: _adapter.getAdapter,
    set: _adapter.setAdapter
  });

  exports.default = Test;
});
enifed('ember-testing/lib/test/adapter', ['exports', 'ember-error-handling'], function (exports, _emberErrorHandling) {
  'use strict';

  exports.getAdapter = getAdapter;
  exports.setAdapter = setAdapter;
  exports.asyncStart = asyncStart;
  exports.asyncEnd = asyncEnd;


  var adapter = void 0;
  function getAdapter() {
    return adapter;
  }

  function setAdapter(value) {
    adapter = value;
    if (value && typeof value.exception === 'function') {
      (0, _emberErrorHandling.setDispatchOverride)(adapterDispatch);
    } else {
      (0, _emberErrorHandling.setDispatchOverride)(null);
    }
  }

  function asyncStart() {
    if (adapter) {
      adapter.asyncStart();
    }
  }

  function asyncEnd() {
    if (adapter) {
      adapter.asyncEnd();
    }
  }

  function adapterDispatch(error) {
    adapter.exception(error);

    console.error(error.stack); // eslint-disable-line no-console
  }
});
enifed('ember-testing/lib/test/helpers', ['exports', 'ember-testing/lib/test/promise'], function (exports, _promise) {
  'use strict';

  exports.helpers = undefined;
  exports.registerHelper = registerHelper;
  exports.registerAsyncHelper = registerAsyncHelper;
  exports.unregisterHelper = unregisterHelper;
  var helpers = exports.helpers = {};
  /**
   @module @ember/test
  */

  /**
    `registerHelper` is used to register a test helper that will be injected
    when `App.injectTestHelpers` is called.
  
    The helper method will always be called with the current Application as
    the first parameter.
  
    For example:
  
    ```javascript
    import { registerHelper } from '@ember/test';
    import { run } from '@ember/runloop';
  
    registerHelper('boot', function(app) {
      run(app, app.advanceReadiness);
    });
    ```
  
    This helper can later be called without arguments because it will be
    called with `app` as the first parameter.
  
    ```javascript
    import Application from '@ember/application';
  
    App = Application.create();
    App.injectTestHelpers();
    boot();
    ```
  
    @public
    @for @ember/test
    @static
    @method registerHelper
    @param {String} name The name of the helper method to add.
    @param {Function} helperMethod
    @param options {Object}
  */
  function registerHelper(name, helperMethod) {
    helpers[name] = {
      method: helperMethod,
      meta: { wait: false }
    };
  }

  /**
    `registerAsyncHelper` is used to register an async test helper that will be injected
    when `App.injectTestHelpers` is called.
  
    The helper method will always be called with the current Application as
    the first parameter.
  
    For example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
    import { run } from '@ember/runloop';
  
    registerAsyncHelper('boot', function(app) {
      run(app, app.advanceReadiness);
    });
    ```
  
    The advantage of an async helper is that it will not run
    until the last async helper has completed.  All async helpers
    after it will wait for it complete before running.
  
  
    For example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
  
    registerAsyncHelper('deletePost', function(app, postId) {
      click('.delete-' + postId);
    });
  
    // ... in your test
    visit('/post/2');
    deletePost(2);
    visit('/post/3');
    deletePost(3);
    ```
  
    @public
    @for @ember/test
    @method registerAsyncHelper
    @param {String} name The name of the helper method to add.
    @param {Function} helperMethod
    @since 1.2.0
  */
  function registerAsyncHelper(name, helperMethod) {
    helpers[name] = {
      method: helperMethod,
      meta: { wait: true }
    };
  }

  /**
    Remove a previously added helper method.
  
    Example:
  
    ```javascript
    import { unregisterHelper } from '@ember/test';
  
    unregisterHelper('wait');
    ```
  
    @public
    @method unregisterHelper
    @static
    @for @ember/test
    @param {String} name The helper to remove.
  */
  function unregisterHelper(name) {
    delete helpers[name];
    delete _promise.default.prototype[name];
  }
});
enifed("ember-testing/lib/test/on_inject_helpers", ["exports"], function (exports) {
  "use strict";

  exports.onInjectHelpers = onInjectHelpers;
  exports.invokeInjectHelpersCallbacks = invokeInjectHelpersCallbacks;
  var callbacks = exports.callbacks = [];

  /**
    Used to register callbacks to be fired whenever `App.injectTestHelpers`
    is called.
  
    The callback will receive the current application as an argument.
  
    Example:
  
    ```javascript
    import $ from 'jquery';
  
    Ember.Test.onInjectHelpers(function() {
      $(document).ajaxSend(function() {
        Test.pendingRequests++;
      });
  
      $(document).ajaxComplete(function() {
        Test.pendingRequests--;
      });
    });
    ```
  
    @public
    @for Ember.Test
    @method onInjectHelpers
    @param {Function} callback The function to be called.
  */
  function onInjectHelpers(callback) {
    callbacks.push(callback);
  }

  function invokeInjectHelpersCallbacks(app) {
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i](app);
    }
  }
});
enifed("ember-testing/lib/test/pending_requests", ["exports"], function (exports) {
  "use strict";

  exports.pendingRequests = pendingRequests;
  exports.clearPendingRequests = clearPendingRequests;
  exports.incrementPendingRequests = incrementPendingRequests;
  exports.decrementPendingRequests = decrementPendingRequests;
  var requests = [];

  function pendingRequests() {
    return requests.length;
  }

  function clearPendingRequests() {
    requests.length = 0;
  }

  function incrementPendingRequests(_, xhr) {
    requests.push(xhr);
  }

  function decrementPendingRequests(_, xhr) {
    setTimeout(function () {
      for (var i = 0; i < requests.length; i++) {
        if (xhr === requests[i]) {
          requests.splice(i, 1);
          break;
        }
      }
    }, 0);
  }
});
enifed('ember-testing/lib/test/promise', ['exports', 'ember-runtime', 'ember-testing/lib/test/run'], function (exports, _emberRuntime, _run) {
  'use strict';

  exports.promise = promise;
  exports.resolve = resolve;
  exports.getLastPromise = getLastPromise;


  var lastPromise = void 0;

  class TestPromise extends _emberRuntime.RSVP.Promise {
    constructor() {
      super(...arguments);
      lastPromise = this;
    }

    then(_onFulfillment) {
      var onFulfillment = typeof _onFulfillment === 'function' ? function (result) {
        return isolate(_onFulfillment, result);
      } : undefined;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return super.then.apply(this, [onFulfillment].concat(args));
    }
  }

  exports.default = TestPromise;
  /**
    This returns a thenable tailored for testing.  It catches failed
    `onSuccess` callbacks and invokes the `Ember.Test.adapter.exception`
    callback in the last chained then.
  
    This method should be returned by async helpers such as `wait`.
  
    @public
    @for Ember.Test
    @method promise
    @param {Function} resolver The function used to resolve the promise.
    @param {String} label An optional string for identifying the promise.
  */
  function promise(resolver, label) {
    var fullLabel = 'Ember.Test.promise: ' + (label || '<Unknown Promise>');
    return new TestPromise(resolver, fullLabel);
  }

  /**
    Replacement for `Ember.RSVP.resolve`
    The only difference is this uses
    an instance of `Ember.Test.Promise`
  
    @public
    @for Ember.Test
    @method resolve
    @param {Mixed} The value to resolve
    @since 1.2.0
  */
  function resolve(result, label) {
    return TestPromise.resolve(result, label);
  }

  function getLastPromise() {
    return lastPromise;
  }

  // This method isolates nested async methods
  // so that they don't conflict with other last promises.
  //
  // 1. Set `Ember.Test.lastPromise` to null
  // 2. Invoke method
  // 3. Return the last promise created during method
  function isolate(onFulfillment, result) {
    // Reset lastPromise for nested helpers
    lastPromise = null;

    var value = onFulfillment(result);

    var promise = lastPromise;
    lastPromise = null;

    // If the method returned a promise
    // return that promise. If not,
    // return the last async helper's promise
    if (value && value instanceof TestPromise || !promise) {
      return value;
    } else {
      return (0, _run.default)(function () {
        return resolve(promise).then(function () {
          return value;
        });
      });
    }
  }
});
enifed('ember-testing/lib/test/run', ['exports', '@ember/runloop'], function (exports, _runloop) {
  'use strict';

  exports.default = run;
  function run(fn) {
    if (!(0, _runloop.getCurrentRunLoop)()) {
      return (0, _runloop.run)(fn);
    } else {
      return fn();
    }
  }
});
enifed("ember-testing/lib/test/waiters", ["exports"], function (exports) {
  "use strict";

  exports.registerWaiter = registerWaiter;
  exports.unregisterWaiter = unregisterWaiter;
  exports.checkWaiters = checkWaiters;
  /**
   @module @ember/test
  */
  var contexts = [];
  var callbacks = [];

  /**
     This allows ember-testing to play nicely with other asynchronous
     events, such as an application that is waiting for a CSS3
     transition or an IndexDB transaction. The waiter runs periodically
     after each async helper (i.e. `click`, `andThen`, `visit`, etc) has executed,
     until the returning result is truthy. After the waiters finish, the next async helper
     is executed and the process repeats.
  
     For example:
  
     ```javascript
     import { registerWaiter } from '@ember/test';
  
     registerWaiter(function() {
       return myPendingTransactions() === 0;
     });
     ```
     The `context` argument allows you to optionally specify the `this`
     with which your callback will be invoked.
  
     For example:
  
     ```javascript
     import { registerWaiter } from '@ember/test';
  
     registerWaiter(MyDB, MyDB.hasPendingTransactions);
     ```
  
     @public
     @for @ember/test
     @static
     @method registerWaiter
     @param {Object} context (optional)
     @param {Function} callback
     @since 1.2.0
  */
  function registerWaiter(context, callback) {
    if (arguments.length === 1) {
      callback = context;
      context = null;
    }
    if (indexOf(context, callback) > -1) {
      return;
    }
    contexts.push(context);
    callbacks.push(callback);
  }

  /**
     `unregisterWaiter` is used to unregister a callback that was
     registered with `registerWaiter`.
  
     @public
     @for @ember/test
     @static
     @method unregisterWaiter
     @param {Object} context (optional)
     @param {Function} callback
     @since 1.2.0
  */
  function unregisterWaiter(context, callback) {
    if (!callbacks.length) {
      return;
    }
    if (arguments.length === 1) {
      callback = context;
      context = null;
    }
    var i = indexOf(context, callback);
    if (i === -1) {
      return;
    }
    contexts.splice(i, 1);
    callbacks.splice(i, 1);
  }

  /**
    Iterates through each registered test waiter, and invokes
    its callback. If any waiter returns false, this method will return
    true indicating that the waiters have not settled yet.
  
    This is generally used internally from the acceptance/integration test
    infrastructure.
  
    @public
    @for @ember/test
    @static
    @method checkWaiters
  */
  function checkWaiters() {
    if (!callbacks.length) {
      return false;
    }
    for (var i = 0; i < callbacks.length; i++) {
      var context = contexts[i];
      var callback = callbacks[i];
      if (!callback.call(context)) {
        return true;
      }
    }
    return false;
  }

  function indexOf(context, callback) {
    for (var i = 0; i < callbacks.length; i++) {
      if (callbacks[i] === callback && contexts[i] === context) {
        return i;
      }
    }
    return -1;
  }
});
/*global enifed, module */
enifed('node-module', ['exports'], function(_exports) {
  var IS_NODE = typeof module === 'object' && typeof module.require === 'function';
  if (IS_NODE) {
    _exports.require = module.require;
    _exports.module = module;
    _exports.IS_NODE = IS_NODE;
  } else {
    _exports.require = null;
    _exports.module = null;
    _exports.IS_NODE = IS_NODE;
  }
});

var testing = requireModule('ember-testing');
Ember.Test = testing.Test;
Ember.Test.Adapter = testing.Adapter;
Ember.Test.QUnitAdapter = testing.QUnitAdapter;
Ember.setupForTesting = testing.setupForTesting;
}());
//# sourceMappingURL=ember-testing.map