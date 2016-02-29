
var gulp = require('gulp');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback');

var autoprefixer = require('gulp-autoprefixer');
var babelify = require('babelify');
var browserify = require('browserify');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var watchify = require('watchify');


/*
  Styles Task
*/
gulp.task('styles', function() {
  gulp.src('styles/main.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./build/'))
    .pipe(reload({ stream: true }))
});

/*
  Browser Sync
*/
gulp.task('browser-sync', function() {
  browserSync({
    server : {},
    middleware : [ historyApiFallback() ],
    ghostMode: false
  });
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  var props = {
    entries: ['./scripts/' + file],
    extensions: ['.js', '.jsx'],
    debug : true,
    cache: {},
    packageCache: {},
    transform: [babelify]
  };

  // watchify() if watch requested, otherwise run browserify() once 
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(rename('script.js'))
      .pipe(gulp.dest('./build/'))
      .pipe(reload({ stream: true }))
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('scripts', function() {
  return buildScript('main.jsx', false);
});

gulp.task('default', ['styles', 'scripts', 'browser-sync'], function() {
  gulp.watch('styles/**/*', ['styles']);
  return buildScript('main.jsx', true);
});
