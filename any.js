(function(m,a){
  // stores log modules keyed by name
  m = Object.create(null)

  /**
   * anylogger([name] [, options]) => function logger([level='log'] [, ...args])
   * 
   * The main anylogger function creates a new or returns an existing logger 
   * with the given `name`. It maintains a registry of all created loggers, 
   * which it returns when called without a name, or with an empty name.
   * 
   * If anylogger needs to create a new logger, it invokes `anylogger.create`.
   */
  a = module.exports = function(n,o){
    // return the existing logger, or create a new one. if no name was given, return all loggers
    return n ? m[n] || (m[n] = a.create(n,o)) : m
  }

  /**
   * The supported log levels.
   * 
   * In anylogger, a higher level of logging means more verbose logging: more log messages.
   * 
   * The lowest level of logging (none at all) has value `0`, whereas the highest
   * level of logging is named `trace` and has value `60`. Default log levels
   * are spaced out by 10 units each so to make room for additional log levels
   * in between.
   */
  a.levels = {error:10, warn:20, info:30, log:40, debug:50, trace:60}

  /**
   * The anylogger console, defaults to the native console, or undefined.
   * 
   * This object is used to perform the actual logging. If it undefined, the log
   * methods on the logger will all be noop methods. No (level) filtering is expected 
   * to take place in the log methods on the anylogger console. It is expected that 
   * any filtering will take place in the methods on the logger itself. 
   * 
   * The anylogger console may be overridden by a different object to intercept 
   * individual logging calls. For example this property could be overridden with
   * an alternative console object that applies formatting.
   * 
   * When a method is not available on the anylogger console, but `anylogger.con.log` 
   * is defined, `anylogger.con.log` will be delegated to. So you can define a level 
   * `silly` and it will create a method `silly()` which will delegate to 
   * `anylogger.con.log` to do the actual logging.
   */
  a.con = (typeof console != 'undefined') && console


  /**
   * The default anylogger factory.
   * 
   * Returns the logger with the given name, or creates it by calling `anylogger.new`
   * and decorating the created log function by calling `anylogger.ext` on the result.
   * 
   * You can replace this method with a custom factory, or leave this one in place 
   * and instead override a.ext and/or a.new separately.
   */
  a.create = function(n,o) {
    return a.ext(a.new(n),n,o)
  }

  /** 
   * Called when a logger needs to be created.
   * 
   * `anylogger.new(name)`
   * 
   * Creates and returns a new named function that calls `anylogger.log` to 
   * perform the log call to the correct logger method based on the first 
   * argument given to it.
   *
   * @param n String The name of the logger to create
   * @return function log([level='log'], args...)
   */
  a.new = function(n,r) {
    // use eval to create a named function, this method has best cross-browser support
    // and allows us to create functions with names containing symbols such as ':', '-' etc
    // which otherwise are not legal in identifiers
    // the created function calls a.log to call the actual log method
    eval("r = {'" + n + "': function(){a.log(n, [].slice.call(arguments))}}[n]")
    // if you want to do extra stuff inside the logger function, consider
    // overriding a.invoke instead of this method.
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
   * Called when a logger needs to be extended, either because it was newly created, 
   * or because it's configuration or settings changed in some way. 
   * 
   * `anylogger.ext(logger, name, options) => logger`
   * 
   * This method must ensure that a log method is available on the logger for each method 
   * with a value above `0` in `anylogger.levels`.
   * 
   * When overriding `anylogger.ext`, please make sure the function may be called m
   * ultiple times on the same object without ill side-effects.
   */
  a.ext = function(l) {
    for (v in a.levels){
      l[v] = a.con[v] || a.con.log || function(){}
    }
    return l;
  }
})()