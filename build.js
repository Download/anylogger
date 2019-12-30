var fs = require('fs')
var UglifyJS = require('uglify-js')
var gzipSize = require('gzip-size')
// be uber-cool and use anylogger to print the logging in the build of anylogger :)
var log = require('./anylogger')('anylogger')

var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
var v = pkg.version
var data = fs.readFileSync('./anylogger.js', 'utf8')
data = data.replace('module.exports', 'this.anylogger')
data = `(function(){${data}})()`

data = UglifyJS.minify(data).code
fs.writeFileSync('anylogger.min.js', data, 'utf8')

var min = data.length, gzip = gzipSize.sync(data)
log.info('Created anylogger.min.js (' + min + 'B, gzipped ~' + gzip + 'B)')

var readme = fs.readFileSync('./README.md', 'utf-8')
readme = readme.replace(/minified \d\d\d bytes/g, 'minified ' + min + ' bytes')
readme = readme.replace(/\[\d\d\d\]\(#gzip-size\)/g, '[' + gzip + '](#gzip-size)')
readme = readme.replace(/\<sub\>\<sup\>\d(\d)?\.\d(\d)?\.\d(\d)?\<\/sup\>\<\/sub\>/g, `<sub><sup>${v}</sup></sub>`)
readme = readme.replace(/\@\d(\d)?\.\d(\d)?\.\d(\d)?\//g, `@${v}/`)
readme = readme.replace(/\>\=\d(\d)?\.\d(\d)?\.\d(\d)?/g, `>=${v}`)
fs.writeFileSync('README.md', readme, 'utf8')
log.info('Updated README')
