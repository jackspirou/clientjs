var gulp = require("gulp"),
    eslint = require("gulp-eslint"),
    rename = require("gulp-rename"),
    minify = require("gulp-minify"),
    concat = require('gulp-concat'),
    closureCompiler = require('gulp-closure-compiler');


gulp.task("lint", function() {
  return gulp
    .src("src/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('compress', function() {
  gulp.src("src/**/*.js")
    .pipe(closureCompiler({
      // compilerPath is optional, since google-closure-compiler is a dependency
      // compilerPath: 'bower_components/closure-compiler/lib/vendor/compiler.jar',
      fileName: 'client.min.js',
      compilerFlags: {compilation_level: 'SIMPLE_OPTIMIZATIONS'}
    }))
    .pipe(gulp.dest('dist'));
});


gulp.task("default", ["compress"], function() {});

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
