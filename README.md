# anylogger <sub><sup>v0.2.0</sup></sub>
### Get a logger. Any logger.

[![npm](https://img.shields.io/npm/v/anylogger.svg)](https://npmjs.com/package/anylogger)
[![license](https://img.shields.io/npm/l/anylogger.svg)](https://opensource.org/licenses/MIT)
[![travis](https://img.shields.io/travis/Download/anylogger.svg)](https://travis-ci.org/Download/anylogger)
[![greenkeeper](https://img.shields.io/david/Download/anylogger.svg)](https://greenkeeper.io/)
![mind BLOWN](https://img.shields.io/badge/mind-BLOWN-ff69b4.svg)

<sup><sub><sup><sub>.</sub></sup></sub></sup>

Get whatever logging framework is present in the host project, or a wrapper 
around the console, or a dummy. Anything really, that will let your library 
do logging without you having to decide what logging framework the app using 
your library should use.

Anylogger will let the user of your library pick the logger for his app, and 
will let your library pick up on whatever choice he made and run with it.


## What is this?

A logging facade.

We, the Javascript community, really need a logging facade. The Java community created their own loggers because the JVM did not include a good logger initially. Eventually multiple popular logging frameworks were around, which made for tough decisions for library authors. Which one to choose? What if the app is using the other library? Make it configurable somehow? So they came up with SLF4J, a facade that you could code against and that allowed the app developer to pick whichever logger he liked and still have it integrate with the library nicely.

We have the same issues here in the Javascript eco system. Initially, the native console object was not always available and it's API varied from implementation to implementation. The community responded by creating logging frameworks to deal with the complexity. Unfortunately now there are dozens of logging libraries around and we library authors face the same, if not worse, dilemma as Java library authors did.

Hence anylogger. A tiny (507 bytes minified and gzipped) logging facade that you can include in your library to have logging 'just work', while at the same time allowing application developers to plug in any full-fledged logging framework they choose. Instead of building in your own, library specific configuration mechanism, or forcing the choice for a certain logging framework on your users, or just abandoning logging alltogether, choose anylogger and at the combined cost of 507 bytes for all libraries doing this, we can plug in any framework of our choice and all libraries will automatically start to use that framework. Wouldn't it be much better and easier?

At the application level, the app developer chooses their logging framework of choice and installs the anylogger-to-their-framework adapter. They make sure to require the adapter in the application entry point and from that point on, any library using anylogger will automatically start using the selected logging framework.


## Install

Depending on your project type, install either just anylogger, or anylogger + 
your logging framework of choice + an anylogger adapter.

### Install in a library project
If you are building a library, just install anylogger:

```sh
npm install --save anylogger
```

Done.

### Install in an application project
If you are building an application project and have selected a logging 
framework, in addition to installing anylogger itself, install the selected 
logging framework and the anylogger adapter for that logging framework.

For example for [debug](https://npmjs.com/package/debug):

```sh
npm install --save anylogger debug anylogger-debug
```

or, for [ulog](https://npmjs.com/package/ulog):

```sh
npm install --save anylogger ulog anylogger-ulog
```

Check out all [available adapters](https://www.npmjs.com/search?q=keywords:anylogger).


## Include

Again, depending on your project type, either just use anylogger, or also include
the adapter.

### Include in a library
In your libraries, only use anylogger, to stay framework-independent:

### require
*my-library.js*
```js
var log = require('anylogger)('my-library');
```

### import
*my-library.js*
```js
import anylogger from 'anylogger';
const log = anylogger('my-library');
```

### Include in an application project

In your main entry point, include your adapter so it extends anylogger:

### require
*main.js*
```js
require('anylogger-debug')
```

### import
*main.js*
```js
import 'anylogger-debug'
```

In your modules, use only anylogger to stay framework-independant:

### require
*my-module.js*
```js
var log = require('anylogger)('my-module');
```

### import
*my-module.js*
```js
import anylogger from 'anylogger';
const log = anylogger('my-module');
```

## Using anylogger

Anylogger is very natural to use:

```js
var log = require('anylogger')('my-module');

log('A debug message');
log('warn', 'A warning message');
log.info(log.name + ' starting...');
var error = new Error('Oh no!');
log.error('Something went wrong', error);
```

## Anylogger API

So what does this API look like?

### anylogger

```js
function anylogger(name, options)
```

The main function to call to get a logger.
Returns a logger based on two arguments, both of
which are optional.

#### name
String. Optional. Defaults to `undefined`.
The name of the logger. Used by frameworks that
support named loggers, such as `debug` and `ulog`.
The recommended format is `<package-name>[:<sub>[:<sub> [..]]]`,
as this is the [convention](https://www.npmjs.com/package/debug#conventions)
used by the highly popular `debug` module. But you
are free to pick any name you want, or none at all.

#### options
Object. Optional. Defaults to `undefined`.
An options object. The use of such options objects varies wildly
amongst implementations so it is recommended to avoid using it where
possible. However in case of implementations that require it, anylogger
passes any options object it is given around to allow the different
extensions to use it where needed. 

When no arguments are given, anylogger returns an object containing 
all loggers created so far, keyed by name.

When a name is given, anylogger returns the existing logger with that
name, or creates a new one by calling `anylogger.create`.

The returned logger adheres to the Anylogger [Logging API](#logging-api)
as described below.

### anylogger extension points
The documentation below is targeted at people trying to 
[write an anylogger adapter](#write-an-anylogger-adapter). Feel free to
skip to the [Logging API](#logging-api) instead.

The process of logger creation and invocation is split up in such a way
as to optimize possible extension points allowing extensions to re-use
anylogger functionality and avoid having to duplicate code. The extension
points are:

#### anylogger.levels
An object describing log levels, keyed by name.

#### anylogger.con
An object (defaults to the native `console`, or `undefined`) containing the
log methods to perform the actual log calls.

#### anylogger.create
A method that is called whenever a new logger is created. Just calls `anylogger.new`
and `anylogger.ext`.

#### anylogger.new
A method that is called to create the logger function.

#### anylogger.ext
A method that is called to extend the logger function. In case of frameworks supporting dynamic log levels, it is expected that anylogger.ext is called again whenever config changes that might influence the log level.

Please refer to the source code in *any.js* for details.


## Logging API

The logger returned by `anylogger` is a function that can do logging on it's own:

```js
log('message')          // logs a message at debug level
log('info', 'message')  // logs a message at info level
```

In addition, the logger looks like a simple console object:

```js
log.debug('message')
log.info('message')
```

The main API looks like this (in peseudo code):

```js
log: function(level='debug', ...args)
log.error: function(...args)
log.warn: function(...args)
log.info: function(...args)
log.log: function(...args)
log.debug: function(...args)
log.trace: function(...args)
```

And that's about it. However this covers the basic logging needs for most logging 
libraries, while at the same time leaving the details surrounding configuration
to be decided upon by specific implementations. 

In fact, you should be able to replace any library you are currently using with 
anylogger mostly painlessly without many changes to your code, if any. 

Note that all logging methods here are part of the default [console API](https://developer.mozilla.org/en-US/docs/Web/API/Console) as specified on MDN,
but not all platforms and frameworks support all of them. In particular the `debug`
method is not available everywhere and the `trace` method functions different on
different platforms. On Node JS it will print a stacktrace with each message.
Anylogger will make sure that the `debug` function is polyfilled if needed, but it
does not attempt to change the actual implementation of any method.


## Write an anylogger adapter

To write an anylogger adapter, you need to make a project that includes both anylogger 
and the logging framework the adapter is for as peer dependencies. It then needs to 
modify one or more of the [anylogger extension points](#anylogger-extension-points)
so the created loggers will be compliant with both the anylogger [Logging API](#logging-api)
as well as with the logging framework's own API.

It is recommended you call your library `anylogger-adapter`, where `adapter` 
should be replaced for the name of the logging framework the adapter is for. 
For example, the adapter for `debug` is called `anylogger-debug`.

In addition, it is recommended you add the keyword `"anylogger"` to the 
*package.json* file of your adapter project, so it will show up in the list of
[available adapters](https://www.npmjs.com/search?q=keywords:anylogger).


## Issues

Add an issue in this project's [issue tracker](https://github.com/download/anylogger/issues)
to let me know of any problems you find, or questions you may have.


## Copyright

Copyright 2019 by [Stijn de Witt](http://StijnDeWitt.com).


## License

Licensed under the MIT Open Source license.
