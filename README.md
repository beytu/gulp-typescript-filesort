Gulp TypeScript Filesort
========================

This is a simple gulp plugin which sort TS files using the Typescript compiler API. Don't use it in production environment since it has not been battle tested and only respond to a simple use case.



# Installing

npm install gulp-typescript-filesort

# Usage

Use with gulp-filelist, you can produce a file containing a list of ordered TS files :

```
var gulp = require('gulp');

var filesort = require('gulp-typescript-filesort');
var filelist = require('gulp-filelist');


gulp.task('ts-filelist', function() {
	return gulp.src("src/**/*.ts")
	.pipe(filesort())
	.pipe(filelist('filelist.json'))
	.pipe(gulp.dest("tmp/"));
});

```
