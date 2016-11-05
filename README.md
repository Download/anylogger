# anylogger <sub><sup>v0.1.0</sup></sub>
### Get a logger. Any logger.

[![npm](https://img.shields.io/npm/v/anylogger.svg)](https://npmjs.com/package/anylogger)
[![license](https://img.shields.io/npm/l/anylogger.svg)](https://creativecommons.org/licenses/by/4.0/)
[![travis](https://img.shields.io/travis/Download/anylogger.svg)](https://travis-ci.org/Download/anylogger)
[![greenkeeper](https://img.shields.io/david/Download/anylogger.svg)](https://greenkeeper.io/)
![mind BLOWN](https://img.shields.io/badge/mind-BLOWN-ff69b4.svg)

<sup><sub><sup><sub>.</sub></sup></sub></sup>

![logo](https://cdn.rawgit.com/download/ulog/0.1.0/ulog.png)

Adapter that will get you whatever of the supported logging frameworks is present in the
host project, or a wrapper around the console, or a dummy logger. Anything really, that
will let your library do logging without you having to decide what logging framework the
app using your library should use.

**This project is still a pipe dream at the moment. Nothing to see here yet....**


## Download

Nothing here yet  :(


## Install

```sh
npm install --save anylogger
```

## Include in your app

### require
*my-module.js*
```js
var log = require('anylogger')('my-module')
```

### import
*my-module.js*
```sh
import anylogger from 'anylogger'
const log = anylogger('my-module')
```

## Logging API

Anylogger does not have a logging implementation. All it does is use whatever logger
framework that it knows about and is present in the project. If it is unable to find
any logger, it returns a dummy object that uses whatever native logging capability is
present on the platform, if any.

So what *does* anylogger do? Admittedly not much, but there is one thing. It defines
a common ground logging API and then adapts whichever of the known frameworks it has
found to adhere to this common API.

And in this case, not much is actually all we need, because a host of good loggers
already exists. Maybe even too many, because for library authors it's a tough choice
to make each time: which of the many loggers do you pick? And will the users of your
library agree with that choice? Or should you just not log at all? Or use the console?
What if that does not exist? Wouldn't you end up making yet another logging framework?

Here is your answer. Let the user of your library pick the logger for his app, and use
anylogger to pick up on whatever choice he made and run with it.

So what does this API look like?

### anylogger

```js
function anylogger(name, level)
```

The main function to call to get a logger.
Returns a logger based on two arguments, both of
which are optional.

#### name
String. Optional. Defaults to `''` (empty string).
The name of the logger. Used by frameworks that
support named loggers, such as `debug` and `ulog`.
The recommended format is `<package-name>[:<sub>[:<sub> [..]]]`,
as this is the [convention](https://www.npmjs.com/package/debug#conventions)
used by the highly popular `debug` module. But you
are free to pick any name you want, or none at all.

#### level
Number. Optional. Defaults to `undefined`.
The desired log level for the logger. As the anylogger
API does not allow for setting the level, only for
reading it, this is the only way to influence the log
level. This parameter will only allow you to **lower**
the log level, never increase it.


### The returned logger

The returned logger might be an object or it might be
a function. But you should use it as if it was an
object and never try to call it.

> `debug` in particular returns a functions. Anylogger
just adds the needed methods and attributes to make it
work as expected.

The logger object should look something like this in
pseudo code:

```js
{
  name: String, read-only
  level: Number, read-only

  error: Function
  warn: Function
  info: Function
  log: Function
  debug: Function
  trace: Function

  NONE: Number, read-only
  ERROR: Number, read-only
  WARN: Number, read-only
  INFO: Number, read-only
  LOG: Number, read-only
  DEBUG: Number, read-only
  TRACE: Number, read-only
}
```

A logger has a name. This name is the argument you passed to `anylogger`.

A logger has a level. This level determines whether messages logged with any
of the logging methods will actually be logged or will be just ignored.

A logger has logging methods, each corresponding to a higher logging level.
`error()` logs at level `ERROR`, `warn()` at `WARN` etc.

A logger has constants corresponding to log levels, and a constant `NONE` for
when logging is completely disabled (e.g. `silent` flag).
`NONE` should have a lower value than `ERROR`, `ERROR` a lower value than `WARN` etc.

A message will be logged only when `log.level >= lvl`, where `lvl` is the level
constant corresponding to the logging method being invoked.

There are no specific values set for the different levels. Anylogger will use the
underlying framework's levels if possible, or will re-arrange them as needed, to
ensure that the statements above will always be true.

Note that all logging methods here are part of the default [console API](https://developer.mozilla.org/en-US/docs/Web/API/Console) as specified on MDN,
but not all platforms and frameworks support all of them. In particular the `debug`
method is not available everywhere and the `trace` method functions different on
different platforms. On Node JS it will print a stacktrace with each message.
Anylogger will make sure that the `debug` function is polyfilled if needed, but it
does not attempt to change the actual implementation of any method.


## Example

```js
var log = require('anylogger')('my-module');

log.info(log.name + ' starting...');
if (log.level >= log.LOG) {
  log.log('You have the log level set higher or equal to LOG');
}
var error = new Error('Oh no!');
log.error('Something went wrong', error);
```

## Colors?

Anylogger does not directly support colors, but it does not prevent their use
either. All of the frameworks supported by anylogger support colors, but there
are (big) implementation differences and anylogger makes no attempt to normalize them.

However nothing is stopping you from using colors. On Node JS you could use the
popular `chalk` library for example. But be aware that the console API itself
is badly standardized and that only gets worse if you try to combine that with
colors. It works, but you need to take care of platform differences yourself
and you might loose some advantages of the anylogger abstraction.

The choice is yours.


## Issues

Add an issue in this project's [issue tracker](https://github.com/download/anylogger/issues)
to let me know of any problems you find, or questions you may have.


## Copyright

Copyright 2016 by [Stijn de Witt](http://StijnDeWitt.com).


## License

Licensed under the MIT Open Source license.
