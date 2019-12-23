var expect = require('chai').expect
var sinon = require('sinon')
var anylogger = require('./anylogger')

var sandbox = sinon.createSandbox();

describe('anylogger([name, [options]]) => log', function() {
  beforeEach(function(){
    // spy on the console methods
    /*
    console.trace && sandbox.spy(console, 'trace')
    console.debug && sandbox.spy(console, 'debug')
    console.log   && sandbox.spy(console, 'log')
    console.info  && sandbox.spy(console, 'info')
    console.warn  && sandbox.spy(console, 'warn')
    console.error && sandbox.spy(console, 'error')
    */
  })

  afterEach(function(){
    // clear any loggers that were created
    Object.keys(anylogger()).forEach(function(key){
      delete anylogger()[key]
    })
    // restore original console methods
    sandbox.restore()
  })


  it('is a function', function(){
    expect(anylogger).to.be.a('function')
  })

  it('returns an object mapping names to loggers when called without arguments', function(){
    var result = anylogger()
    expect(result).to.be.an('object')
    expect(Object.keys(result)).to.deep.eq([])
    anylogger('test')
    result = anylogger()
    expect(result).to.be.an('object')
    expect(Object.keys(result)).to.deep.eq(['test'])
  })

  it('returns a named logger when called with a name', function(){
    var name = 'test'
    var result = anylogger(name)
    expect(result).to.be.a('function')
    expect(result.name).to.equal(name)
  })

  it('returns the same logger when called multiple times with the same name', function(){
    var name = 'test'
    var expected = anylogger(name)
    var actual = anylogger(name)
    expect(actual).to.equal(expected)
  })

  it('calls anylogger.new when a new logger named "test" is created', function(){
    sandbox.spy(anylogger, 'new')
    expect(anylogger.new.callCount).to.equal(0)
    anylogger('test')
    expect(anylogger.new.callCount).to.equal(1)
  })

  it('Calls anylogger.ext when a new logger named "test" is created', function(){
    sandbox.spy(anylogger, 'ext')
    expect(anylogger.ext.callCount).to.equal(0)
    anylogger('test')
    expect(anylogger.ext.callCount).to.equal(1)
  })

  it('does not call anylogger.new on subsequent calls with the same name', function(){
    sandbox.spy(anylogger, 'new')
    expect(anylogger.new.callCount).to.equal(0)
    anylogger('test')
    expect(anylogger.new.callCount).to.equal(1)
    anylogger('test')
    expect(anylogger.new.callCount).to.equal(1)
  })

  it('calls anylogger.new when a new logger named "toString" is created', function(){
    sandbox.spy(anylogger, 'new')
    expect(anylogger.new.callCount).to.equal(0)
    anylogger('toString')
    expect(anylogger.new.callCount).to.equal(1)
  })

  it('does not call anylogger.new on subsequent calls with "toString" as argument', function(){
    sandbox.spy(anylogger, 'new')
    expect(anylogger.new.callCount).to.equal(0)
    anylogger('toString')
    expect(anylogger.new.callCount).to.equal(1)
    anylogger('toString')
    expect(anylogger.new.callCount).to.equal(1)
  })

  it('accepts an optional options argument', function(){
    var name = 'test'
    var options = { level: 'info' }
    var result = anylogger(name, options)
    expect(result).to.be.a('function')
  })

  describe('log', function(){
    it('is a function', function(){
      var name = 'test'
      var log = anylogger(name)
      expect(log).to.be.a('function')
    })

    it('has a name that matches the name given to anylogger', function(){
      var name = 'test'
      var log = anylogger(name)
      expect(log.name).to.equal(name)
    })

    it('has a method `trace`', function(){
      var log = anylogger('test')
      expect(log).to.have.property('trace')
      expect(log.trace).to.be.a('function')
    })

    it('has a method `debug`', function(){
      var log = anylogger('test')
      expect(log).to.have.property('debug')
      expect(log.debug).to.be.a('function')
    })

    it('has a method `log`', function(){
      var log = anylogger('test')
      expect(log).to.have.property('log')
      expect(log.log).to.be.a('function')
    })

    it('has a method `info`', function(){
      var log = anylogger('test')
      expect(log).to.have.property('info')
      expect(log.info).to.be.a('function')
    })

    it('has a method `warn`', function(){
      var log = anylogger('test')
      expect(log).to.have.property('warn')
      expect(log.warn).to.be.a('function')
    })

    it('has a method `error`', function(){
      var log = anylogger('test')
      expect(log).to.have.property('error')
      expect(log.error).to.be.a('function')
    })

    it('has a method `enabledFor`', function(){
      var log = anylogger('test')
      expect(log).to.have.property('enabledFor')
      expect(log.enabledFor).to.be.a('function')
      var log = anylogger('test')
      sandbox.spy(log, 'enabledFor')
      var actual = log.enabledFor('info')
      expect(!!actual).to.equal(true)
      expect(log.enabledFor.callCount).to.equal(1)
    })

    it('can be invoked to log a message', function(){
      var log = anylogger('test')
      sandbox.spy(log, 'log')
      log('message')
      expect(log.log.callCount).to.equal(1)
    })

    it('can be invoked with a level name as first argument to log a message at that level', function(){
      var log = anylogger('test')
      sandbox.spy(log, 'log')
      sandbox.spy(log, 'info')
      log('info', 'message')
      expect(log.log.callCount).to.equal(0)
      expect(log.info.callCount).to.equal(1)
    })
  })
})
