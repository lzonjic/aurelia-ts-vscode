var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var paths = require('../paths');
var assign = Object.assign || require('object.assign');
var typescript = require('gulp-typescript');
var tsc = require('typescript');
var babel = require('gulp-babel');
var compilerOptions = require('../babel-options');

var tsProject = typescript.createProject('./tsconfig.json', { typescript: tsc });

gulp.task('default', function(callback) {
  runSequence(
    [
      'build',
      'watch'
    ],
    callback);
});

// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function(callback) {
  return runSequence(
    //'clean',
    ['build-client-js', 'build-client-ts', 'build-html', 'build-css', 'build-server'],
    callback
  );
});

gulp.task('watch', function(callback) {
  return runSequence(
    [
      'html:watch',
      'build-client-js:watch', // currently only for config.js
      'build-client-ts:watch',
      'build-html:watch',
      'build-css:watch',
      'build-server:watch'
    ],
    callback);
});

gulp.task('build-client-js', function () {
  return gulp.src(paths.clientTsSource, {
      base: paths.clientSourceRoot
    })
    .pipe(gulp.dest(paths.clientOutputRoot));
});

// transpiles changed es6 files to SystemJS format
// the plumber() call prevents 'pipe breaking' caused
// by errors from other gulp plugins
// https://www.npmjs.com/package/gulp-plumber
gulp.task('build-client-ts', function() {
  return gulp.src(paths.dtsSource.concat(paths.clientTsSource))
    .pipe(plumber())
    .pipe(sourcemaps.init({loadMaps: true}))    
    .pipe(changed(paths.clientOutputRoot, {extension: '.js'}))
    .pipe(typescript(tsProject))
    .pipe(babel(assign({}, compilerOptions, {
      modules: 'amd'
    })))
    .pipe(sourcemaps.write({includeContent: true}))
    .pipe(gulp.dest(paths.clientOutputRoot));
});

// copies changed html files to the output directory
gulp.task('build-html', function() {
  return gulp.src(paths.htmlSource)
    .pipe(changed(paths.clientOutputRoot, {extension: '.html'}))
    .pipe(gulp.dest(paths.clientOutputRoot));
});

// copies changed css files to the output directory
gulp.task('build-css', function () {
  return gulp.src(paths.cssSource)
    .pipe(sourcemaps.init())
    .pipe(changed(paths.clientOutputRoot, {extension: '.css'}))
    .pipe(postcss([ require('autoprefixer'), require('precss') ]))
    .pipe(sourcemaps.write({includeContent: true}))
    .pipe(gulp.dest(paths.clientOutputRoot));
});

gulp.task('build-server', function() {
  return gulp.src([paths.node_modulesSource, paths.serverTsSource])
    .pipe(plumber())
    .pipe(sourcemaps.init({loadMaps: true}))    
    .pipe(changed(paths.serverOutputRoot, {extension: '.js'}))
    .pipe(typescript(tsProject))
    .pipe(babel(assign({}, compilerOptions, {
      modules: 'amd'
    })))
    .pipe(sourcemaps.write({includeContent: true}))
    .pipe(gulp.dest(paths.serverOutputRoot));
});

// WATCH SECTION
gulp.task('html:watch', function () {
  return gulp.watch(paths.htmlSource, ['html']);
});

gulp.task('build-client-js:watch', function () {
  return gulp.watch(paths.clientJsSource, ['build-client-js']);
});

gulp.task('build-client-ts:watch', function () {
  return gulp.watch(paths.clientTsSource, ['build-client-ts']);
});

gulp.task('build-html:watch', function () {
  return gulp.watch(paths.htmlSource, ['build-html']);
});

gulp.task('build-css:watch', function () {
  return gulp.watch(paths.cssSource, ['build-css']);
});

gulp.task('build-server:watch', function () {
  return gulp.watch(paths.serverTsSource, ['build-server']);
});
