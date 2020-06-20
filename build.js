var fs = require('fs')
var UglifyJS = require('uglify-js')
var gzipSize = require('gzip-size')
// be uber-cool and use anylogger to print the logging in the build of anylogger :)
var log = require('./anylogger')('anylogger')

var [ processName, script, command, ...args ] = process.argv
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
var v = pkg.version

;(function(){
  var data = fs.readFileSync('./anylogger.umd.js', 'utf8')

  if (!command || command == 'minify') {
    data = UglifyJS.minify(data);
    if (data.error) {
      return log('error', data)
    }
    data = data.code;
    fs.writeFileSync('anylogger.min.js', data, 'utf8')
  }
  else {
    data = fs.readFileSync('./anylogger.min.js', 'utf8')
  }

  var min = data.length, gzip = gzipSize.sync(data)

  if (!command || command == 'minify') {
    log('info', 'created anylogger.min.js (' + min + 'B, gzipped ~' + gzip + 'B)')
  }

  if (!command || command == 'docs') {
    var readme = fs.readFileSync('./README.md', 'utf-8')
    readme = readme.replace(/minified \d\d\d bytes/g, 'minified ' + min + ' bytes')
    readme = readme.replace(/\[\d\d\d\]\(#gzip-size\)/g, '[' + gzip + '](#gzip-size)')
    readme = readme.replace(/\<sub\>\<sup\>\d(\d)?\.\d(\d)?\.\d(\d)?\<\/sup\>\<\/sub\>/g, `<sub><sup>${v}</sup></sub>`)
    readme = readme.replace(/\@\d(\d)?\.\d(\d)?\.\d(\d)?\//g, `@${v}/`)
    readme = readme.replace(/\>\=\d(\d)?\.\d(\d)?\.\d(\d)?/g, `>=${v}`)
    fs.writeFileSync('README.md', readme, 'utf8')
    log('info', 'updated README.md')
  }
})()
