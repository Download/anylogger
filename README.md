# anylogger <sub><sup>1.0.1</sup></sub>
### Get a logger. Any logger.

[![npm](https://img.shields.io/npm/v/anylogger.svg)](https://npmjs.com/package/anylogger)
[![license](https://img.shields.io/npm/l/anylogger.svg)](https://opensource.org/licenses/MIT)
[![travis](https://img.shields.io/travis/Download/anylogger.svg)](https://travis-ci.org/Download/anylogger)
![mind BLOWN](https://img.shields.io/badge/mind-BLOWN-ff69b4.svg)


## The logger for libraries

When we want to do logging from a library, we don't want to force the choice of 
logging framework on the application developer. Instead, we want to use whatever 
logging framework the application developer selected. `anylogger` let's you do
just that.


## Quickstart

<table>
  <tr>
    <th><h3>Library</h3></th>   
    <th><h3>App with <a href="https://npmjs.com/package/anylogger-debug"><tt>debug</tt></a></h3></th>   
    <th><h3>App with <a href="https://npmjs.com/package/anylogger-loglevel"><tt>loglevel</tt></a></h3></th>  
    <th><h3>App with <a href="https://npmjs.com/package/anylogger-log4js"><tt>log4js</tt></a></h3></th>
    <th><h3>App with <a href="https://npmjs.com/package/ulog"><tt>ulog</tt></a></h3></th>
  </tr>
  <tr>
    <td><h5>Install</h5>
      <pre>npm i -S anylogger
      </pre>
      <h5>Use</h5>
      <pre>import anylogger from 'anylogger'
const log = anylogger('my-library')
log('Anylogger is easy!')</pre>
    </td>
    <td><h5>Install</h5>
      <pre>npm i -S anylogger
 debug anylogger-debug</pre>
      <h5>Add to entry point</h5>
      <i>index.js</i>
      <pre>import "anylogger-debug"</pre>
      <h5>Use</h5>
      <pre>import anylogger from 'anylogger'
const log = anylogger('my-app')
log('Anylogger is easy!')</pre>
    </td>
    <td><h5>Install</h5>
      <pre>npm i -S anylogger
 loglevel anylogger-loglevel</pre>
      <h5>Add to entry point</h5>
      <i>index.js</i>
      <pre>import "anylogger-loglevel"</pre>
      <h5>Use</h5>
      <pre>import anylogger from 'anylogger'
const log = anylogger('my-app')
log('Anylogger is easy!')</pre>
    </td>
    <td><h5>Install</h5>
      <pre>npm i -S anylogger
 log4js anylogger-log4js</pre>
      <h5>Add to entry point</h5>
      <i>index.js</i>
      <pre>import "anylogger-log4js"</pre>
      <h5>Use</h5>
      <pre>import anylogger from 'anylogger'
const log = anylogger('my-app')
log('Anylogger is easy!')</pre>
    </td>
    <td><h5>Install</h5>
      <pre>npm i -S anylogger
 ulog</pre>
      <h5>Add to entry point</h5>
      <i>index.js</i>
      <pre>import "ulog"</pre>
      <h5>Use</h5>
      <pre>import anylogger from 'anylogger'
const log = anylogger('my-app')
log('Anylogger is easy!')</pre>
    </td>
  </tr>
</table>


## What is this?

### A logging facade

We, the Javascript community, really need a logging facade. There are dozens 
of logging libraries around and we library authors face a dilemma. Which logger
do we pick? Should we make this configurable? Should we just not log? Use the
console directly? How do we deal with this complexity?

In software architecture, a 
[facade](https://en.wikipedia.org/wiki/Facade_pattern) hides a complex system
behind a simple interface. In the context of our logging problem, we can have
our library log to a simple facade object. In our application we back the 
facade object by the actual logging framework with an 
[adapter](https://en.wikipedia.org/wiki/Adapter_pattern). 

So what we need is a simple and small logging facade and a bunch of adapters 
for popular loggers.

### Introducing `anylogger`

A tiny ~[390](#gzip-size) bytes logging facade that you can include in your
library to have logging 'just work', while at the same time allowing
application developers to plug in any logging framework they choose.

Instead of building in your own library specific configuration mechanism,
or forcing the choice for a certain logging framework on your users,
or just abandoning logging altogether, choose `anylogger` and for just 
~[390](#gzip-size) bytes shared between all libraries doing this, we can
plug in any framework of our choice and all libraries will automatically 
start to use that framework. Wouldn't it be much better and easier?

At the application level, the app developers choose whatever logging framework 
they prefer and install the anylogger-to-their-framework adapter. They make
sure to require the adapter in the application entry point and from that point
on, any library using anylogger will automatically start using the selected 
logging framework.


## Download

* [anylogger.js](https://unpkg.com/anylogger@1.0.1/anylogger.js) 
  (fully commented source ~5kB)
* [anylogger.min.js](https://unpkg.com/anylogger@1.0.1/anylogger.min.js) 
  (minified 636 bytes, gzipped ~[390](#gzip-size) bytes)


## CDN

*index.html*
```html
<script src="https://unpkg.com/anylogger@1.0.1/anylogger.min.js"></script>
<script>(function(){ // IIFE
  var log = anylogger('index.html')
  log.info('Logging is simple!')
})()</script>
```


## Install

Depending on your project type, install just anylogger, or anylogger + 
your logging framework of choice + an anylogger adapter if needed.

### Install in a library project

If you are building a library, install just anylogger:

```sh
npm install --save anylogger
```

This will add `anylogger` as a dependency to your `package.json`.

### Install in an application project

If you are building an application project and have selected a logging 
framework, in addition to installing anylogger itself, install the selected 
logging framework and the anylogger adapter for that logging framework.

**For [debug](https://npmjs.com/package/debug)**:

```sh
npm install --save anylogger debug anylogger-debug
```

This installs [anylogger-debug](https://npmjs.com/package/anylogger-debug).

**For [loglevel](https://npmjs.com/package/loglevel)**:

```sh
npm install --save anylogger loglevel anylogger-loglevel
```

This installs [anylogger-loglevel](https://npmjs.com/package/anylogger-loglevel).


**For [log4js](https://npmjs.com/package/log4js)**:

```sh
npm install --save anylogger log4js anylogger-log4js
```

This installs [anylogger-log4js](https://npmjs.com/package/anylogger-log4js).


**For [ulog](https://npmjs.com/package/ulog)** which has native anylogger 
support since v2:

```sh
npm install --save anylogger ulog
```

> Because `ulog` supports `anylogger` natively, we don't need an adapter

Check out all 
[available adapters](https://www.npmjs.com/search?q=keywords:anylogger).


## Include

Depending on your project type, either just use anylogger, 
or also include the adapter.

### Include in a library

In your libraries, only use anylogger and restrict yourself to the 
[Anylogger API](#anylogger-api) to stay framework-independent:

#### require
*my-library.js*
```js
var log = require('anylogger')('my-library')
```

#### import
*my-library.js*
```js
import anylogger from 'anylogger'
const log = anylogger('my-library')
```

### Include in an application project

In your main entry point, include your adapter or library with native support 
so it extends anylogger:

#### require
*main.js*
```js
// e.g. for debug
require('anylogger-debug')
```

#### import
*main.js*
```js
// e.g. for debug
import 'anylogger-debug'
```

In your other modules, use only anylogger and restrict yourself to the 
[Anylogger API](#anylogger-api) to stay framework-independent:

#### require
*my-module.js*
```js
var log = require('anylogger')('my-module')
```

#### import
*my-module.js*
```js
import anylogger from 'anylogger'
const log = anylogger('my-module')
```


## Using anylogger

Anylogger is very natural to use:

```js
var log = require('anylogger')('my-module')

log('A log message')
log('debug', 'A debug message')
log('warn', 'A warning message')
log.info(log.name + ' starting...')
log.error('Something went wrong', new Error('Oh no!'))
if (log.enabledFor('warn')) {
  log.warn(expensiveArguments())
}
```

If you are able to restrict yourself to the [Anylogger API](#anylogger-api), 
your code will be framework independent and will work with any supported
logging library.

```js
log.info('Logging is easy!')
// Avoid using methods like log.silly() and log.time() etc which are only 
// supported in some frameworks and not in others and your code will work 
// with any supported logging framework without any changes
```


## Anylogger API

So what does this API look like?

### anylogger

```js
function anylogger(name, options) => logger
```

The main function to call to get a logger.
Accepts two arguments.

#### name
The name of the logger. String. Optional. Defaults to `undefined`.
The recommended format is `<package-name>[:<sub>[:<sub> [..]]]`,
as this is the [convention](https://www.npmjs.com/package/debug#conventions)
used by the highly popular `debug` module. But you are free to pick any name
you want. You only get a logger if you supply a name. If the name is
not given `anylogger()` will return an object containing all loggers,
keyed by name.

#### options
An optional options object. Object. Optional. Defaults to `undefined`.
The use of such options objects varies wildly amongst implementations so
it is recommended to avoid using it where possible. However in case of
implementations that require it, anylogger passes any options object it 
is given on to [`anylogger.new`](#anyloggernew) to allow it to be used 
where needed.

**When no arguments are given** anylogger returns an object containing
all loggers created so far, keyed by name.

**When a name is given** anylogger returns the existing logger with that
name, or creates a new one by calling [`anylogger.new`](#anyloggernew).

The returned logger adheres to the Logging API described below.


## Logging API

The logger returned by [`anylogger`](#anylogger) is a function that can 
do logging on it's own:

```js
log('message')          // logs a message at `log` level
log('info', 'message')  // logs a message at `info` level
```

In addition, the logger looks like a simple console object:

```js
log.debug('message')
log.info('message')
```

Because of this, the logger created by anylogger is compatible with most 
logging frameworks out there, which mostly use one or both of these approaches.

The main API looks like this (in pseudo code):

```js
log: function([level='log'], ...args)
log.error: function(...args)
log.warn: function(...args)
log.info: function(...args)
log.log: function(...args)
log.debug: function(...args)
log.trace: function(...args)
log.enabledFor: function(level) => truthy or falsey
```

And that's about it. However this covers the basic logging needs.

> Note that all logging methods here are part of the upcoming 
> [Console standard](https://console.spec.whatwg.org/), but not all platforms
> and frameworks support all of them. In particular the `debug` method is not
> available everywhere. Anylogger will make sure that the `debug` function is
> polyfilled if needed.

Is your logging framework not supported? No fear, just...


## Write an anylogger adapter

To write an anylogger adapter, you need to make a project that includes both
anylogger and the logging framework the adapter is for as peer dependencies. 

You then need to modify one or more of the 
[anylogger extension points](#anylogger-extension-points)
so the created loggers will be compliant with both the anylogger 
[Logging API](#logging-api) as well as with the logging framework's own API.

It is recommended you call your library `anylogger-[adapter]`, where 
`[adapter]` should be replaced with the name of the logging framework
the adapter is for. For example, the adapter for `debug` is called 
`anylogger-debug`.

In addition, it is recommended you add the keyword `"anylogger"` to the 
*package.json* file of your adapter project, so it will show up in the list of
[available adapters](https://www.npmjs.com/search?q=keywords:anylogger).

### anylogger extension points

The process of logger creation and invocation is split up in such a way
as to optimize possible extension points allowing extensions to re-use
anylogger functionality and avoid having to duplicate code. The extension
points are:

#### anylogger.levels
```js
anylogger.levels = {error:1, warn:2, info:3, log:4, debug:5, trace:6}
```
An object containing a mapping of level names to level values.

To be compliant with the anylogger API, loggers should support at least 
the log methods corresponding to the default levels, but they may define 
additional levels and they may choose to use different numeric values 
for all the levels.

The guarantees the Anylogger API makes are:
* there is a logging method corresponding to each level listed in `anylogger.levels`
* the levels `error`, `warn`, `info`, `log`, `debug` and `trace` are always there
* each level corresponds to a numeric value

Note that the Anylogger API explicitly does not guarantee that all levels 
have distinct values or that the numeric values will follow any pattern
or have any specific order. For this reason it is best to think of levels
as separate log channels, possibly going to different output locations.

You can replace or change this object to include levels corresponding with 
those available in the framework you are writing an adapter for. Please 
make sure to always include the default levels as well so all code can 
rely on the 6 console methods `error`, `warn`, `info`, `log`, `debug` and 
`trace` to always be there.

#### anylogger.new
```js
anylogger.new(name, options) => logger
```
Creates a new logger function that calls `anylogger.log` when invoked.
 
Uses `new Function(..)` to create a named function so that function.name
corresponds to the module name given. Polyfills function.name on platforms
where it is not natively available.

##### name
The name of the new logger. String. Required.

##### options
An optional options object. Object. Optional.

If the logging framework you are writing an adapter for uses an options
object, you should override `anylogger.new` and do something useful with
the options object here (set it as a property on the logger for example),
because the default implementation just ignores it.

Instead of completely trying to replace the original method, I recommend you 
chain it to include your one-time customizations like this:

```js
import anylogger from 'anylogger'

// save the original function
const make = anylogger.new

// override anylogger.new
anylogger.new = (name, options) => {
  // call the original function to chain it
  var logger = make(name, options)
  // do something useful with the options object
  logger.options = options
  // return the customized logger
  return logger
}
```

> All anylogger methods are independent of `this` so they can all be easily chained

If you need to re-apply customizations any time relevant config changes (such
as active log level changing), override `anylogger.ext`.

#### anylogger.ext
```js
anylogger.ext(logger) => logger
```

Called when a logger needs to be extended, either because it was newly
created, or because it's configuration or settings changed in some way.

This method must ensure that a log method is available on the logger for
each level in `anylogger.levels`.

When overriding `anylogger.ext`, please ensure the function can safely 
be called multiple times on the same object

##### logger
The logger that should be (re-)extended. Function. Required.

The default implementation loops over the 
[`anylogger.levels`](#anyloggerlevels) and creates log methods for each level.
You can override or chain this method to change the way the log methods are
(re-)created. By default, all log methods will delegate to the native console.
But in a library that supports log levels, all methods corresponding to log
levels lower than the currently active levels might be replaced with no-op
methods instead. Or maybe the destination of the log messages might change
dynamically based on configuration. Apply such changes in `anylogger.ext` as it
will be called again whenever relevant config changes. This allows adapters to
(re-)extend the logger so that the new configuration takes effect.

> You may need to ensure in your adapter that `anylogger.ext` is called
> whenever relevant config changes. By hooking into setters for example.

#### anylogger.log
```js
anylogger.log([level='log'], ...args)
```
The log function returned by anylogger calls `anylogger.log`, which determines
the log level and invokes the appropriate log method. 

Please have a look at the 
[source](https://unpkg.com/anylogger@1.0.1/anylogger.js)
it should make it more clear how to write an adapter. Also consider studying
the [available adapters](https://www.npmjs.com/search?q=keywords:anylogger)
and learn by example.


## Give something back

If you wrote an `anylogger` adapter, make sure to share it back with the 
community. Publish it to NPM for all to use!


## Credits

Credits go to these people, who helped with this project:

* [Jakub Jirutka](https://github.com/jirutka) who [contributed](https://github.com/Download/anylogger/pull/2) TypeScript type declarations.
* [TJ Holowaychuk](https://github.com/tj) for writing [debug](https://npmjs.com/package/debug)
* [Tim Perry](https://github.com/pimterry) for writing [loglevel](https://npmjs.com/package/loglevel)
* The authors of log4js, log4js-node, morgan, bunyan, pino and all other log libraries out there


## Issues

Add an issue in this project's 
[issue tracker](https://github.com/download/anylogger/issues) 
to let me know of any problems you find, or questions you may have.


## Copyright

© 2020 by [Stijn de Witt](https://stijndewitt.com). Some rights reserved.
Contributions by [Jakub Jirutka](https://github.com/jirutka).


## License

Licensed under the [MIT Open Source license](https://opensource.org/licenses/MIT).


## gzip-size

The GZIP algorithm is available in different flavours and with different 
possible compression settings. The sizes quoted in this README have been
measured using [gzip-size](https://npmjs.com/package/gzip-size) 
by [Sindre Sorhus](https://github.com/sindresorhus), your mileage may vary.
