/**
 *  A  N  Y  L  O  G  G  E  R
 *  Get a logger. Any logger.
 *
 *  © 2024 by Stijn de Witt, some rights reserved
 *  Licensed under the MIT Open Source license
 *  https://opensource.org/licenses/MIT
 */

/**
 * Gets or creates a logger by name
 */
export type AnyLogger = ((name: LoggerName) => Logger) & {

  /**
   * Stores all loggers created so far
   */
  all: AllLoggers;

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
  levels: { [level: string]: number; };

  /**
   * Called when a new logger needs to be created.
   *
   * The default implementation creates a log function that
   * allows for an optional first argument, preceding the
   * message argument(s), to specify the level to call.
   *
   *
   * @param name The name for the new logger
   * @returns The newly created logger
   */
  new: (name: LoggerName) => LogFunction

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
   * log('message')          // calls log.log('message')
   * log('error')            // calls log.log('error')
   * log('info', 'message')  // calls log.info('message')
   * log('error', 'message') // calls log.error('message')
   * log('Hello', 'World!')  // calls log.log('Hello', 'World!')
   * ```
   *
   * Having this code in anylogger makes writing adapters easier, because
   * they only have to override `anylogger.ext` and add the logging methods
   * to the new logger.
   *
   * @param name The name of the logger
   * @param args The arguments for the logger
   */
  log: (name: LoggerName, ...args: any) => void

  /**
   * Called when a log function needs to be extended, either because it was
   * newly created, or because it's configuration or settings changed.
   *
   * This function implements `enabledFor` and a log method for
   * each level in `anylogger.levels` on the given `logfn`.
   *
   * This function can safely be called multiple times on the same `logfn`.
   *
   * The default adapter provided here is essentially a no-op adapter.
   * Adapters for common logging frameworks such as the
   * [console](https://npmjs.com/package/anylogger-console),
   * [debug](https://npmjs.com/package/anylogger-debug),
   * [loglevel](https://npmjs.com/package/anylogger-loglevel),
   * [ulog](https://npmjs.com/package/ulog) and
   * [log4js](https://npmjs.com/package/log4js) override
   * this default adapter.
   *
   * @param logfn The log function to be extended
   *
   * @return The log function that was given, extended to a Logger
   */
  ext: Adapter
}

/**
 * A log function is a function that takes a variable amount of
 * arguments and returns void.
 */
export type LogFunction = (...args: any) => void

/**
 * An adapter accepts a LogFunction and returns a Logger
 */
export type Adapter = (logfn: LogFunction) => Logger

/**
 * A logger is a log function that has a `name` that corresponds to the logger
 * name, a method `enabledFor(level: LogLevel)` to check whether the logger is
 * enabled for a certain log level, and log methods for each of the log levels
 * supported by AnyLogger: `error`, `warn`, `info`, `log`, `debug` and `trace`.
 */
export type Logger = LogFunction & {
  readonly name: LoggerName;
  enabledFor: (level?: LogLevel) => boolean | void;
} & {
  [P in keyof LogLevels as `${P}`]: LogFunction;
}

export type LogLevels = { error:1, warn:2, info:3, log:4, debug:5, trace:6 }

/**
 * A log level is a string that is a key of `LogLevels`
 */
export type LogLevel = keyof LogLevels

/**
 * All loggers, keyed by name
 */
export type AllLoggers = {
  [name: string]: Logger
}

/**
 * An alias for the much used concept of a LoggerName
 */
export type LoggerName = string

// the main `anylogger` function
const anylogger: AnyLogger = (name) => (
  // return the existing logger, or
  anylogger.all[name] ||
  // create and store a new logger with that name
  (anylogger.all[name] = anylogger.ext(anylogger.new(name)))
)

// all loggers created so far
anylogger.all = Object.create(null) as AllLoggers;

// the supported levels
anylogger.levels = { error: 1, warn: 2, info: 3, log: 4, debug: 5, trace: 6 }

// creates a new named log function
anylogger.new = (name: LoggerName): LogFunction => ({
  // to assign the function `name`, set it to a named key in an object.
  // the default implementation calls `anylogger.log`, which should be a
  // good choice in many cases.
  [name]: (...args: any) => anylogger.log(name, ...args)
}[name]) // return only the function, not the encapsulating object

// logs with the logger with the given `name`
anylogger.log = (name: LoggerName, ...args: any) => {
  // select the logger to use
  anylogger.all[name][
    // select the level to use
    // if multiple args and first matches a level name
    (((args.length > 1) && anylogger.levels[args[0] as LogLevel])
      ? args.shift() // use the level from the args
      : 'log'   // else use default level `'log'`
    ) as LogLevel
  ](...args) // call method matching level with remaining args
}

// extends the given `logger` function
// the implementation here only adds no-ops
// adapters should change this behavior
anylogger.ext = (logger: LogFunction): Logger => {
  (logger as Logger).enabledFor = ()=>{}
  for (const method in anylogger.levels) {
    (logger as Logger)[method as LogLevel] = ()=>{}
  }
  return logger as Logger
}

// this is a real ESM module
// we transpile the compiled Javascript back to commonjs with rollup
export default anylogger
