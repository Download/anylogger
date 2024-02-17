import { expect } from 'chai'
import anylogger from 'anylogger'

describe('anylogger([name, [options]]) => log', function() {
  afterEach(function(){
    // clear any loggers that were created
    Object.keys(anylogger()).forEach(function(key){
      delete anylogger()[key]
    })
  })

  it('is a function', function(){
    expect(anylogger).to.be.a('function')
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
      expect(log.enabledFor('info')).to.equal(undefined)
    })

    it('can be invoked to log a message', function(){
      var log = anylogger('test')
      expect(() => log('message')).not.to.throw()
    })

    it('can be invoked with a level name as first argument to log a message at that level', function(){
      var log = anylogger('test')
      const old = log.info
      let called = false
      log.info = (...args) => {
        called = true
        old(...args)
      }
      log('info', 'message')
      expect(called).to.equal(true)
    })
  })
})
