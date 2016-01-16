var gulp = require('gulp');
var runSequence = require('run-sequence');
var paths = require('../paths');
var nodemon = require('nodemon');

gulp.task('nodemon', function (callback) {
    return nodemon('--watch dist --ignore dist\\public dist\\server.js');
});

gulp.task('watch', function (callback) {
    return runSequence(
        [
            'copy-jspm:watch', // currently only for config.js
            'build-client-ts:watch',
            'copy-html:watch',
            'build-css:watch',
            'build-server-ts:watch'
        ],
        callback);
});

// WATCH SECTION
gulp.task('copy-jspm:watch', function () {
    return gulp.watch(paths.clientJsSource, ['copy-jspm']);
});

gulp.task('build-client-ts:watch', function () {
    return gulp.watch(paths.clientTsSource, ['build-client-ts']);
});

gulp.task('copy-html:watch', function () {
    return gulp.watch(paths.htmlSource, ['copy-html']);
});

gulp.task('build-css:watch', function () {
    return gulp.watch(paths.cssSource, ['build-css']);
});

gulp.task('build-server-ts:watch', function () {
    return gulp.watch(paths.serverTsSource, ['build-server-ts']);
});
