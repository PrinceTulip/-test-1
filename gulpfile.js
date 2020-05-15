'use strict';

const gulp = require('gulp');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const cleanCSS = require('gulp-cleancss');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const babel = require("gulp-babel");
const babelify = require('babelify');

const rename = require('gulp-rename');
const del = require('del');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

const paths =  {
  src: './src/',              // paths.src
  build: './build/'           // paths.build
};

function styles() {
  return gulp.src(paths.src + 'scss/main.scss')
      .pipe(plumber())
      .pipe(sassGlob())
      .pipe(sass()) // { outputStyle: 'compressed' }
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest(paths.build + 'css/'))
}

function htmls() {
  return gulp.src(paths.src + '*.html')
      .pipe(plumber())
      .pipe(gulp.dest(paths.build));
}

function clean() {
  return del('build/')
}

function watch() {
  gulp.watch(paths.src + 'scss/**/*.scss', styles);
  gulp.watch(paths.src + '*.html', htmls);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: paths.build
    }
  });
  browserSync.watch(paths.build + '**/*.*', browserSync.reload);
}

exports.styles = styles;
exports.htmls = htmls;
exports.clean = clean;
exports.watch = watch;

gulp.task('build', gulp.series(
    clean,
    styles,
    htmls,
    gulp.parallel(styles, htmls)
));

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, htmls),
    gulp.parallel(watch, serve)
));
