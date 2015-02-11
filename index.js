var eventStream = require('event-stream');
var gutil = require('gulp-util');
var File = require('vinyl');
var path = require('path');
var toposort = require('toposort');

var PLUGIN_NAME = "gulp-typescript-filesort"


var gulpTypescriptFilesort = function() {

 
	//Storing files in this map. For each key (the file path), we store the file
	// /!\ if you have a lot of files, it can have a big impact on your memory usage
	var fileReferenceMap = {};


	var toposortEdges = [];


	var onFile = function(file) {

		//Extract all dependencies from the content
		var dependencies = file.contents.toString().match(/<reference path=.*\/>/g);
		if (dependencies) {
			dependencies.forEach(function(dependency) {
				var seperator = '"';
				if (dependency.indexOf('"')<0) {
					seperator = "'";
				}
				var cleanedDependency = dependency.substring(dependency.indexOf(seperator)+1,dependency.lastIndexOf(seperator));

				//rebuild the full path of the dep
				cleanedDependency = path.join(path.dirname(file.path),cleanedDependency);

				if (cleanedDependency.indexOf('.ts') < 0) {
					cleanedDependency = cleanedDependency + ".ts";
				}

				toposortEdges.push([file.path, cleanedDependency]);
			}.bind(this));
		}
		else {
			gutil.log("No dependency found for " + file.path);
		}
		fileReferenceMap[file.path] = file;

	}


	var onEnd = function() {
		var result = toposort(toposortEdges).reverse();
		result.forEach(function(filePath) {
			if (fileReferenceMap[filePath]) {
				gutil.log('emitting ' + filePath);
				this.emit('data',fileReferenceMap[filePath]);
			}
			else {
				gutil.log('no file found in the reference map for ' + filePath + ', skipping');
			}
		}.bind(this));
		this.emit('end');

	}

	return eventStream.through(onFile,onEnd);
}


module.exports = gulpTypescriptFilesort;
