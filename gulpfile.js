var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var prefixer = require('gulp-autoprefixer');
var shell = require('gulp-shell');

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
};

gulp.task('webserver', function () {
  connect.server({
    fallback: 'index.html',
    host: 'localhost',
    port: 8080,
    autoreload: true
  });
  gulp.src('./**/*.html').pipe(connect.reload());
});

gulp.task('sass', function () {
  return gulp.src('./sass/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .on('error', handleError)
    .pipe(prefixer())
    .pipe(concat('index.css'))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass2', function () {
  return gulp.src('./sass/loading.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .on('error', handleError)
    .pipe(prefixer())
    .pipe(concat('loading.css'))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass-min', function () {
  return gulp.src('./sass/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(prefixer())
    .pipe(concat('index.min.css'))
    .on('error', handleError)
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass-min2', function () {
  return gulp.src('./sass/loading.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(prefixer())
    .pipe(concat('loading.min.css'))
    .on('error', handleError)
    .pipe(gulp.dest('./dist'));
});

gulp.task('js', function () {
  return gulp.src('scripts/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('js-min', function () {
  return gulp.src('scripts/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .on('error', handleError)
    .pipe(uglify({
        mangle: false
    })
    .on('error', handleError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch('scripts/**/*.js', ['js']);
  gulp.watch('sass/**/*.scss', ['sass', 'sass2']);
});

gulp.task('build-prod', ['sass', 'sass2', 'js', 'sass-min', 'sass-min2', 'js-min']);

gulp.task('docs', shell.task([
  'node_modules/jsdoc/jsdoc.js '+
    '-c node_modules/angular-jsdoc/common/conf.json '+   // config file
    '-t node_modules/angular-jsdoc/angular-template '+   // template file
    '-d dist/docs '+                           // output directory
    './README.md ' +                            // to include README.md as index contents
    '-r scripts'                              // source code directory
//    '-u tutorials'                              // tutorials directory
]));

gulp.task('default', ['sass', 'sass2', 'js', 'webserver', 'watch']);