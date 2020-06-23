var fs = require('fs')
var UglifyJS = require('uglify-js')
var gzipSize = require('gzip-size')
// be uber-cool and use anylogger to print the logging in the build of anylogger :)
var log = function(l,m){console[l](m)} 

var [ processName, script, command, ...args ] = process.argv
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
var v = pkg.version

;(function(){
  var data

  if (!command || command == 'minify') {
    data = fs.readFileSync(pkg.iife, 'utf8')
    data = UglifyJS.minify(data);
    if (data.error) {
      return log('error', data.error)
    }
    data = data.code;
    fs.writeFileSync(pkg.min, data, 'utf8')
  }
  else {
    data = fs.readFileSync(pkg.min, 'utf8')
  }

  var min = data.length
  var gzip = gzipSize.sync(data)

  if (!command || command == 'minify') {
    log('info', 'created ' + pkg.min + ' (' + min + 'B, gzipped ~' + gzip + 'B)')
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
