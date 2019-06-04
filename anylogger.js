/**
 *  A  N  Y  L  O  G  G  E  R
 *  Get a logger. Any logger.
 * 
 *  © 2019 by Stijn de Witt, some rights reserved
 *  Licensed under the MIT Open Source license
 *  https://opensource.org/licenses/MIT
 */

 // stores log modules keyed by name
var m = Object.create(null)

/**
 * anylogger([name] [, config]) => function logger([level='log'] [, ...args])
 * 
 * The main `anylogger` function creates a new or returns an existing logger 
 * with the given `name`. It maintains a registry of all created loggers, 
 * which it returns when called without a name, or with an empty name.
 * 
 * If anylogger needs to create a new logger, it invokes 
 * [`anylogger.create`](#anyloggercreate).
 * 
 * @param name {String} The name of the logger to create
 * @param config {Object} An optional config object
 * 
 * @returns A logger with the given `name` and `config`.
 */
var a = function(n,c){
  // return the existing logger, or create a new one. if no name was given, return all loggers
  return n ? m[n] || (m[n] = a.ext(a.new(n,c))) : m
}

/**
 * `anylogger.levels`
 *
 * An object containing a mapping of level names to level values.
 * 
 * To be compliant with the anylogger API, loggers should support at least 
 * the log methods corresponding to the default levels, but they may define 
 * additional levels and they may choose to use different numeric values 
 * for all the levels.
 * 
 * The guarantees the Anylogger API makes are:
 * - there is a logging method corresponding to each level listed in anylogger.levels
 * - the levels error, warn, info, log, debug and trace are always there
 * - each level corresponds to a numeric value
 * 
 * Note that the Anylogger API explicitly does not guarantee that all levels 
 * have distinct values or that the numeric values will follow any pattern
 * or have any specific order. For this reason it is best to think of levels
 * as separate log channels, possibly going to different output locations.
 * 
 * You can replace or change this object to include levels corresponding with
 * those available in the framework you are writing an adapter for. Please
 * make sure to always include the default levels as well so all code can
 * rely on the 6 console methods `error`, `warn`, `info`, `log`, `debug` and
 * `trace` to always be there.
 */
a.levels = {error:1, warn:2, info:3, log:4, debug:5, trace:6}

/**
 * `anylogger.new(name, config)`
 *
 * Creates a new logger function that calls `anylogger.log` when invoked.
 * 
 * Uses some evil eval trickery to create a named function so that function.name
 * corresponds to the module name given. Polyfills function.name on platforms
 * where it is not natively available.
 *
 * @param name {String} The name of the logger to create
 * @param config {Object} An optional config object
 *
 * @returns A new logger function with the given `name`.
 */
a.new = function(n,c,r) {
  // use eval to create a named function, this method has best cross-browser
  // support and allows us to create functions with names containing symbols
  // such as ':', '-' etc which otherwise are not legal in identifiers.
  // the created function calls `anylogger.log` to call the actual log method
  eval("r={'" + n + "':function(){a.log(n,[].slice.call(arguments))}}[n]")
  // IE support: if the function name is not set, add a property manually
  // the logging methods will be added by anylogger.ext
  return r.name ? r : Object.defineProperty(r, 'name', {get:function(){return n}})
}

/**
 * `anylogger.log(name, args)`
 * 
 * The log function used by `anylogger.new`.
 * 
 * You can override this method to change invocation behavior.
 * 
 * @param name {String} The name of the logger to use
 * @param args {Array} The log arguments
 * 
 * This method inspects the first argument in `args` to determine the log 
 * level to log at (defaults to 'log') and then calls the correct method 
 * on the logger function with the remaining arguments. 
 */
a.log = function(n,x) {
  m[n][x.length > 1 && a.levels[x[0]] ? x.shift() : 'log'].apply(m[n], x)
}

/**
 * `anylogger.ext(logger) => logger`
 * 
 * Called when a logger needs to be extended, either because it was newly
 * created, or because it's configuration or settings changed in some way.
 * 
 * This method must ensure that a log method is available on the logger for
 * each level in `anylogger.levels`.
 * 
 * When overriding `anylogger.ext`, please ensure the function can safely 
 * be called multiple times on the same object
 * 
 * @param logger Function The logger to be (re-)extended
 * 
 * @return The logger that was given, extended
 */
a.ext = function(l,o) {
  o = typeof console != 'undefined' && console
  for (v in a.levels)
    l[v] = o && (o[v] || o.log) || function(){}
  return l;
}

module.exports = a
