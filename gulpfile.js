"use strict";

const gulp = require('gulp')
const minifyCSS = require('gulp-minify-css')
const gulpif = require('gulp-if')
const prefix = require('gulp-autoprefixer')
const connect = require('gulp-connect')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const fonts = require('gulp-fontmin')
const del = require('del')
const runSequence = require('run-sequence')
const notify = require('gulp-notify')

const env = {
  prod: process.env.NODE_ENV === 'production',
  dev: process.env.NODE_ENV === 'development',
};

gulp.task('connect', function () {
  connect.server({
    root: 'build',
    livereload: true
  })
});

gulp.task('scss', function() {
    gulp.src('src/styles.scss')
        .pipe(sass())
        .on('error', notify.onError(function(error) {
            return {
                title: 'scss',
                message:  error.message
            };
        }))
        .pipe(prefix({
            browsers: ['last 2 versions'],
        }))
        .pipe(gulpif(env.prod, minifyCSS()))
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload())
});

gulp.task('pug', function () {
  gulp.src('src/index.pug')
      .pipe(pug({ pretty: true }))
      .on('error', notify.onError(function(error) {
          return {
              title: 'pug',
              message:  error.message
          };
      }))
      .pipe(gulp.dest('build/'))
      .pipe(connect.reload())
});

gulp.task('images', function() {
  gulp.src('static/images/*.+(png|jpg|gif|jpeg)')
    .pipe(gulp.dest('build/static/images'))
});

gulp.task('fonts', function () {
  gulp.src('static/fonts/*')
    .pipe(fonts())
    .pipe(gulp.dest('build/static/fonts/'));
});

gulp.task('static', function () {
  gulp.src('static/**')
    .pipe(gulp.dest('build/static/'));
});

gulp.task('clean', function(cb) {
  return del('./build', cb);
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.scss', ['scss']);
  gulp.watch('src/**/*.pug', ['pug']);
  gulp.watch('static/images/*', ['images']);
  gulp.watch('static/**', ['static']);
  gulp.watch('static/fonts/*', ['fonts']);
});

gulp.task('default', function (cb) {
  if (env.dev) {
      runSequence('clean', ['scss', 'pug', 'images', 'static', 'fonts'], ['connect', 'watch'], cb)
  } else {
      runSequence('clean', ['scss', 'pug', 'images', 'static', 'fonts'], cb)
  }
});
