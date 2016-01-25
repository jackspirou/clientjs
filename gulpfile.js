var gulp = require("gulp"),
    eslint = require("gulp-eslint"),
    rename = require("gulp-rename"),
    minify = require("gulp-minify"),
    concat = require('gulp-concat');

gulp.task("lint", function() {
  return gulp
    .src("src/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('compress', function() {
  gulp.src("src/**/*.js")
    .pipe(concat('client.js'))
    .pipe(minify({ext:{min:'.min.js'}}))
    .pipe(gulp.dest('dist'))
});

gulp.task("default", ["lint", "compress"], function() {});

/*
gulp.task("minify", function() {
  return gulp
      .src("src*.js")
      .pipe(rename({suffix: ".min"}))
      .pipe(uglify({
          compress: {
            global_defs: {
              NODEBUG: true
            }
          }
      }))
      .pipe(gulp.dest("dist/"));
});
*/
