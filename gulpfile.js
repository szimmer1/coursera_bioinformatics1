/**
 * Created by mzimmerman on 7/3/15.
 */

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    watchify = require('watchify'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    _ = require('lodash');

var browserifyConfig = {
    entries: "./js/app.js",
    dest: "./js",
    outputName: "build.js"
};

var opts = _.assign({}, watchify.args, browserifyConfig);
var b = watchify(browserify(opts));

var bundle = function() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // Add transformation tasks to the pipeline here.
        .pipe(gulp.dest('./dist'));
}

gulp.task('js', bundle);
b.on('update', bundle);
b.on('log', gutil.log);



