var eventStream = require('event-stream');
var gutil = require('gulp-util');
var path = require('path');
var typescript = require('typescript');

var PLUGIN_NAME = "gulp-typescript-filesort"

var defaultOptions = {
    verbose:false
};


var gulpTypescriptFilesort = function (givenOptions) {

  var options = givenOptions || defaultOptions;

  var filesToHandle = {};

  var tsOpts = {}


  var onFile = function (file) {
      var filePath = path.normalize(file.path);
      if (options.verbose) {
          gutil.log('pushing  ' + filePath + ' into the map');
      }
      filesToHandle[filePath] = file;

  };


  var onEnd = function () {
    var host = typescript.createCompilerHost(tsOpts);
    var program = typescript.createProgram(Object.keys(filesToHandle),tsOpts, host);

    program.getSourceFiles();

    var result = program.getSourceFiles();
    
    if (options.verbose) {
        gutil.log("retrieved " + result.length + " files");
    }
    
    result.forEach(function (sourceFile) {
        if (options.verbose) {
            gutil.log('emitting ' + path.normalize(sourceFile.filename));
      }
      if (filesToHandle[path.normalize(sourceFile.filename)]) {
        this.emit('data', filesToHandle[path.normalize(sourceFile.filename)]);
      }
      else if(options.verbose) {
        gutil.log("skipping, file not found in my file handler map");
      }

    }.bind(this));

    this.emit('end');
  };

  return eventStream.through(onFile, onEnd);
};


module.exports = gulpTypescriptFilesort;