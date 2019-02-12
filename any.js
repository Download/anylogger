/**
 *  A  N  Y  L  O  G  G  E  R
 *  Get a logger. Any logger.
 * 
 *  © 2019 by Stijn de Witt, some rights reserved
 *  Licensed under the MIT Open Source license
 *  https://opensource.org/licenses/MIT
 *  Removal of this message in production builds is permitted.
 */
(function(m,a){
  // stores log modules keyed by name
  m = Object.create(null)

  /**
   * anylogger([name] [, options]) => function logger([level='log'] [, ...args])
   * 
   * The main `anylogger` function creates a new or returns an existing logger 
   * with the given `name`. It maintains a registry of all created loggers, 
   * which it returns when called without a name, or with an empty name.
   * 
   * If anylogger needs to create a new logger, it invokes `anylogger.create`.
   */
  a = function(n,o){
    // return the existing logger, or create a new one. if no name was given, return all loggers
    return n ? m[n] || (m[n] = a.create(n,o)) : m
  }

  /**
   * `anylogger.levels`
   *
   * An object containing a mapping of level names to level values.
   * In anylogger, a higher level of logging means more verbose logging: more log messages.
   * The lowest level of logging (none at all) has value `0`. Higher levels have
   * higher values. To be compliant with the anylogger API, loggers should support
   * at least the default levels, but they may define additional levels.
   */
  a.levels = {error:1, warn:2, info:3, log:4, debug:5, trace:6}

  /**
   * `anylogger.out`
   * 
   * Defaults to the native console or false if no native console is available.
   * 
   * This object is used to perform the actual logging. If it is false, the 
   * log methods on the logger will all be noop methods. 
   *  
   * `anylogger.out` may be overridden by a different object to intercept 
   * individual logging calls. For example this property could be overridden 
   * with an alternative object that applies formatting.
   * 
   * When a method is not available on `anylogger.out`, but `anylogger.out.log`
   * is defined, `anylogger.out.log` will be used. So you can define a level
   * `silly` and it will create a method `silly()` which would just be an alias 
   * for `anylogger.out.log`.
   */
  a.out = typeof console != 'undefined' && console


  /**
   * `anylogger.create(name, options)`

   * Called when a logger needs to be created.   *
   * Creates a new logger by calling `anylogger.new`, then extends it by calling 
   * `anylogger.ext` on the result.
   *
   * You can replace this method with a custom factory, or leave this one in
   * place and instead override `anylogger.ext` and/or `anylogger.new` separately.
   *
   * @param name String, The name of the logger to create
   * @param options Object, An optional options object
   *
   * @returns A new logger with the given `name` and `options`.
   */
  a.create = function(n,o) {
    return a.ext(a.new(n,o))
  }

  /** 
   * 
   * `anylogger.new(name, options)`
   * 
   * Creates and returns a new named function that calls `anylogger.log` to 
   * perform the log call to the correct logger method based on the first 
   * argument given to it.
   *
   * @param name String The name of the logger to create
   * @param options Object An optional options object
   * 
   * @return function log([level='log'], args...)
   */
  a.new = function(n,o,r) {
    // use eval to create a named function, this method has best cross-browser
    // support and allows us to create functions with names containing symbols
    // such as ':', '-' etc which otherwise are not legal in identifiers.
    // the created function calls `anylogger.log` to call the actual log method
    eval("r = {'" + n + "': function(){a.log(n, [].slice.call(arguments))}}[n]")
    // if you want to do extra stuff inside the logger function, consider
    // overriding `anylogger.log` instead of this method.
    // IE support: if the function name is not set, add a property manually
    return r.name ? r : Object.defineProperty(r, 'name', {get:function(){return n}})
    // the logging methods will be added by anylogger.ext
  }

  /**
   * Called from the logger function created by `anylogger.new`.
   * 
   * `anylogger.log([level='log',] ...args)`
   * 
   * You can override this method to change invocation behavior.
   * This method inspects the first argument to determine the log level to
   * log at (defaults to 'log') and then calls the correct method on the 
   * logger function with the remaining arguments. 
   */
  a.log = function(n,x) {
    m[n][x.length > 1 && a.levels[x[0]] ? x.shift() : 'log'].apply(m[n], x)
  }

  /**
   * Called when a logger needs to be extended, either because it was newly
   * created, or because it's configuration or settings changed in some way.
   * 
   * `anylogger.ext(logger) => logger`
   * 
   * This method must ensure that a log method is available on the logger for
   * each level in `anylogger.levels`.
   * 
   * When overriding `anylogger.ext`, please make sure the function may be
   * called multiple times on the same object without ill side-effects.
   */
  a.ext = function(l) {
    for (v in a.levels)
      l[v] = a.out[v] || a.out.log || function(){}
    return l;
  }

  module.exports = a
})()