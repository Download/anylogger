/**
 *  A  N  Y  L  O  G  G  E  R
 *  Get a logger. Any logger.
 * 
 *  © 2019 by Stijn de Witt, some rights reserved
 *  Licensed under the MIT Open Source license
 *  https://opensource.org/licenses/MIT
 */

 // stores loggers keyed by name
var loggers = Object.create(null)

/**
 * anylogger([name] [, options]) => function logger([level='log'] [, ...args])
 * 
 * The main `anylogger` function creates a new or returns an existing logger 
 * with the given `name`. It maintains a registry of all created loggers, 
 * which it returns when called without a name, or with an empty name.
 * 
 * If anylogger needs to create a new logger, it invokes 
 * [`anylogger.new`](#anyloggernew).
 * 
 * @param name {String} The name of the logger to create
 * @param options {Object} An optional options object
 * 
 * @returns A logger with the given `name` and `options`.
 */
var anylogger = module.exports = function(name, options){
  // return the existing logger, or create a new one. if no name was given, return all loggers
  return name ? loggers[name] || (loggers[name] = anylogger.ext(anylogger.new(name, options))) : loggers
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
anylogger.levels = { error: 1, warn: 2, info: 3, log: 4, debug: 5, trace: 6 }

/**
 * `anylogger.new(name, options)`
 *
 * Creates a new logger function that calls `anylogger.log` when invoked.
 * 
 * @param name {String} The name of the logger to create
 * @param options {Object} An optional options object
 *
 * @returns A new logger function with the given `name`.
 */
anylogger.new = function(name, options) {
  var result = new Function('a', 'n', "return {'" + name + "':function(){a.log(n,[].slice.call(arguments))}}[n]")(anylogger, name)
  try {Object.defineProperty(result, 'name', {get:function(){return name}})} catch(e) {}
  return result
}

/**
 * `anylogger.log(name, args)`
 * 
 * The log function used by the logger created by `anylogger.new`.
 * 
 * You can override this method to change invocation behavior.
 * 
 * @param name {String} The name of the logger to use. Required. Not empty.
 * @param args {Array} The log arguments. Required. May be empty.
 * 
 * If multiple arguments were given in `args` and the first argument is a 
 * log level name from anylogger.levels, this method will remove that argument
 * and call the corresponding log method with the remaining arguments. 
 * Otherwise it will call the `log` method with the arguments given.
 */
anylogger.log = function(name, args) {
  var level = args.length > 1 && anylogger.levels[args[0]] ? args.shift() : 'log'
  loggers[name][level].apply(loggers[name], args)
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
anylogger.ext = function(logger) {
  var out = typeof console != 'undefined' && console;
  logger.enabledFor = function(){return !0};
  for (var method in anylogger.levels) {
    logger[method] = out && (out[method] || out.log) || function(){}
  }
  return logger;
}
