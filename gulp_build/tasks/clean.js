var gulp = require('gulp');
var paths = require('../paths');
var del = require('del');
var vinylPaths = require('vinyl-paths');

// deletes all files in the output path
gulp.task('clean', function() {
  return gulp.src([paths.serverOutputRoot])
    .pipe(vinylPaths(del));
});

gulp.task('clean-client', function () {
    return del(paths.clientOutputRoot + '**/*');
});

gulp.task('clean-server', function () {
    return del([
        paths.serverOutputRoot + '**/*',
        // Delete everything except public directory
        '!' + paths.clientOutputRoot + '**'
    ]);
});