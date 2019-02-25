var fs = require('fs')
var UglifyJS = require('uglify-js')
var gzipSize = require('gzip-size')
// be uber-cool and use anylogger to print the logging in the build of anylogger :)
var log = require('./any')('anylogger')

var data = fs.readFileSync('./any.js', 'utf8')
data = data.replace('module.exports', 'window.anylogger')
data = UglifyJS.minify(data).code
fs.writeFileSync('any.min.js', data, 'utf8')
var min = data.length, gzip = gzipSize.sync(data)
log.info('Created any.min.js (' + min + 'B, gzipped ' + gzip + 'B)')

var readme = fs.readFileSync('./README.md', 'utf-8')
readme = readme.replace(/minified \d\d\dB/g, 'minified ' + min + 'B')
readme = readme.replace(/\[\d\d\d\]\(#gzip-size\)/g, '[' + gzip + '](#gzip-size)')
fs.writeFileSync('README.md', readme, 'utf8')
log.info('Updated README')
