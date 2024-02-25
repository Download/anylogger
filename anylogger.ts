/**
 *  A  N  Y  L  O  G  G  E  R
 *  Get a logger. Any logger.
 *
 *  © 2024 by Stijn de Witt, some rights reserved
 *  Licensed under the MIT Open Source license
 *  https://opensource.org/licenses/MIT
 */

/**
 * Gets or creates a logger by name.
 *
 * Acts as a store for all loggers created so far,
 * as a factory to create new loggers and as an
 * adapter (the no-op adapter) to extend the loggers.
 *
 * Anylogger has the concept of levels and it can be
 * used as a delegate to log with a certain logger.
 */
export type AnyLogger = GetLogger
    & HasStore & HasFactory & HasExtension
    & HasLevels & HasDelegate

/**
 * Gets a logger by `name`.
 */
export type GetLogger = (name: string) => Logger

/**
 * A logger is a log function that has a `name` that corresponds to the logger
 * name, a method `enabledFor(level: LogLevel)` to check whether the logger is
 * enabled for a certain log level, and log methods for each of the log levels
 * supported by AnyLogger: `error`, `warn`, `info`, `log`, `debug` and `trace`.
 */
export type Logger = LogFunction & LogObject & {
  readonly name: string
  enabledFor: (level?: LogLevel) => boolean | void
}

/**
 * A log function is a function that takes a variable amount of
 * arguments and returns void.
 */
export type LogFunction = (...args: any) => void

/**
 * A log object is an object that has methods corresponding to all
 * supported log levels, where each method is a log function.
 */
export type LogObject = {
  [P in keyof LogLevels as `${P}`]: LogFunction
}

// the main `anylogger` function
const anylogger: AnyLogger = (name) => (
  // return the existing logger, or
  anylogger.all[name] ||
  // create and store a new logger with that name
  (anylogger.all[name] = anylogger.ext(anylogger.new(name)))
)

/**
 * Stores all loggers created so far
 */
export type HasStore = {
  all: AllLoggers
}

/**
 * All loggers, keyed by name
 */
export type AllLoggers = {
  [name: string]: Logger
}

// anylogger.all stores all loggers created so far
anylogger.all = Object.create(null) as AllLoggers

/**
 * Anylogger creates new loggers when needed
 */
export type HasFactory = {
  /**
   * Called when a new logger needs to be created.
   *
   * The default implementation creates a log function that
   * allows for an optional first argument, preceding the
   * message argument(s), to specify the level to call.
   *
   * @param name The name for the new logger
   * @returns The newly created logger
   */
  new: FactoryFunction
}

/**
 * Returns a new log function for the given logger `name`
 */
export type FactoryFunction = (name: string) => LogFunction

// anylogger.new creates a new named log function
anylogger.new = (name) => (
  // to assign the function `name`, set it to a named key in an object.
  // the default implementation calls `anylogger.log`, which should be a
  // good choice in most cases.
  { [name]: (...args: any[]) => anylogger.log(name, ...args) }
  // return only the function, not the encapsulating object
  [name]
)

/**
 * Has a method `ext` which is an extension
 */
export type HasExtension = {
  /**
   * Called when a log function needs to be extended, either because it was
   * newly created, or because it's configuration or settings changed.
   *
   * This function implements `enabledFor` and a log method for
   * each level in `anylogger.levels` on the given `logfn`.
   *
   * This function can safely be called multiple times on the same `logfn`.
   *
   * The default extension provided here is essentially a no-op extension.
   *
   * Adapters for common logging frameworks such as the
   * [console](https://npmjs.com/package/anylogger-console),
   * [debug](https://npmjs.com/package/anylogger-debug),
   * [loglevel](https://npmjs.com/package/anylogger-loglevel),
   * [ulog](https://npmjs.com/package/ulog) and
   * [log4js](https://npmjs.com/package/log4js) override
   * this default extension.
   *
   * @param logfn The log function to be extended
   *
   * @return The log function that was given, extended to a Logger
   */
  ext: Extension
}

/**
 * An extension accepts a LogFunction and returns a Logger
 */
export type Extension = (logfn: LogFunction) => Logger

// anylogger.ext extends the given `logger` function
// the implementation here only adds no-ops
// adapters should change this behavior
anylogger.ext = (logfn) => {
  (logfn as Logger).enabledFor = ()=>{}
  for (const lvl in anylogger.levels) {
    (logfn as any)[lvl as LogLevel] = ()=>{}
  }
  return logfn as Logger
}

/**
 * An Adapter accepts the `anyLogger` function and optionally
 * some logging framework and adapts anylogger to that logging
 * framework by overriding the default extension
 */
export type Adapter = (anylogger: AnyLogger, framework?: any) => void

/**
 * Anylogger supports the concept of levels.
 */
export type HasLevels = {

  /**
   * An object containing a mapping of level names to level values.
   *
   * To be compliant with the anylogger API, loggers should support at least
   * the log methods corresponding to the default levels specified here, but
   * they may define additional levels and they may choose to use different
   * numeric values for all the levels.
   *
   * The guarantees the Anylogger API makes are:
   * - there is a log method for each level listed in anylogger.levels
   * - the levels error, warn, info, log, debug and trace are always there
   * - each level corresponds to a numeric value
   *
   * Note that the Anylogger API explicitly does not guarantee that all levels
   * have distinct values or that the numeric values will follow any pattern
   * or have any specific order. For this reason it is best to think of levels
   * as separate log channels, possibly going to different output locations,
   * instead of thinking of them as having a specific order.
   *
   * Adapters can modify this object to include levels corresponding with
   * those available in the logging library the adapter is for. Adapters will
   * ensure to always include the default levels and to have a log method for
   * each level, so all code can rely on that contract.
   */
  levels: LogLevels;
}

/**
 * A log level is a string that is a key of `LogLevels`
 */
export type LogLevel = string

/**
 * A mapping of level name `string` to level `number`
 */
export type LogLevels = typeof logLevels

/**
 * A default set of level name/value pairs that maps well to the console.
 */
const logLevels = { error: 1, warn: 2, info: 3, log: 4, debug: 5, trace: 6 }

// the minimal supported levels
anylogger.levels = logLevels

/**
 * You can call any logger via anylogger
 */
export type HasDelegate = {
  /**
   * Called by the log function that the default implementation of
   * `anylogger.new` creates.
   *
   * This log function calls the right log method on the right logger,
   * based on the `name` of the logger and the arguments given in `args`.
   *
   * if there is more than one argument given and the first argument is a
   * string that corresponds to a log level, that level will be called.
   * Otherwise it defaults to calling the `log` method.
   *
   * E.g.
   *
   * ```ts
   * import anylogger from 'anylogger'
   * // calls anylogger('my-log').log('message')
   * anylogger.log('my-log', 'message')
   * // calls anylogger('my-log').log('error')
   * anylogger.log('my-log', 'error')
   * // calls anylogger('my-log').info('message')
   * anylogger.log('my-log', 'info', 'message')
   * // calls anylogger('my-log').error('message')
   * anylogger.log('my-log', 'error', 'message')
   * // calls anylogger('my-log').log('Hello', 'World!')
   * anylogger.log('my-log', 'Hello', 'World!')
   * ```
   *
   * Having this code in anylogger makes writing adapters easier, because
   * they only have to override `anylogger.ext` and add the logging methods
   * to the new logger.
   *
   * @param name The name of the logger
   * @param args The arguments for the logger
   */
  log: Delegate
}

/**
 * Method that takes a logger name and arguments and calls the right log method
 * based on that information.
 *
 * This function inspects the given `args` to identify the log level and then
 * calls the log method corresponding to that level on the logger with `name`.
 */
export type Delegate = (name: string, ...args: any[]) => void

// logs with the logger with the given `name`
anylogger.log = (name, ...args) => (
  // select the logger to use
  (anylogger(name) as any)[
    // select the level to use
    // if multiple args and first arg matches a level name
    (((args.length > 1) && (anylogger as any).levels[args[0] as LogLevel])
      ? args.shift() // use the level from the args
      : 'log'   // else use default level `'log'`
    ) as LogLevel
  ](...args) // call method matching level with remaining args
)

// this is an esm module
// we transpile the compiled Javascript back to commonjs with rollup
export default anylogger
