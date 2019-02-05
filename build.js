var fs = require('fs')
var UglifyJS = require('uglify-js')
// be uber-cool and use anylogger to print the logging in the build of anylogger :)
var log = require('./any')('anylogger')

var data = fs.readFileSync('./any.js', 'utf8')
data = data.replace('module.exports', 'window.anylogger')
data = UglifyJS.minify(data).code
fs.writeFileSync('any.min.js', data, 'utf8')
log.info('Created any.min.js')
