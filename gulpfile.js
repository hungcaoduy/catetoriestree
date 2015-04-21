//http://www.smashingmagazine.com/2014/06/11/building-with-gulp/
//*GULP-LOAD-PLUGINS
//require commands above for gulp plugins can be replaced by loadplugins plugin as below
/*
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
*/
// plugins all from package.json will be lazily loaded and available via plugins.[camel casing names], e.g. plugins.uglify, plugins.dest

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var streamify = require('gulp-streamify');
var sourcemaps = require('gulp-sourcemaps');
var jade = require('gulp-jade');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');

var es = require('event-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var assign = require('lodash.assign');
var browserSync = require('browser-sync');
var pathmodify = require('pathmodify');
// *Fast browserify builds with watchify
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md

var environment = 'development';
var paths = {
  base: './src/scripts/',
  src: './src/',
  dest: './public/',
  vendor: './vendor/',
  assets: './assets/',
  node: './node_modules/'
};

gulp.task('set-production', function() {
  environment = 'production';
});

// https://www.npmjs.com/package/pathmodify

var customOpts = {
    entries: [paths.src + 'scripts/main.js'],
    // basedir: paths.base,
    paths: [paths.node, paths.base, paths.src],
    debug: environment == 'development',
    transform: ['coffeeify', 'jadeify', 'stringify'],
    extensions: ['.coffee', '.jade', '.tpl']
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)
        .plugin(pathmodify(), {mods: [
        // Make code like `require('app/something')` act like
        // `require('/somedir/src/something')`
        pathmodify.mod.dir('scripts', paths.src + 'scripts')
        ]})
    );

gulp.task('watchifyjs', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
    return b.bundle()
        .on('error', gutil.log.bind(gutil,'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(paths.dest + 'js/'));
}

// /*Fast browserify builds with watchify

//Using of transform----------------------------
gulp.task('scripts', function() {
  stream = gulp.src(paths.src + 'scripts/index.coffee', { read: false })
    .pipe(plumber())
    .pipe(browserify({
      debug: environment == 'development',
      transform: ['coffeeify', 'jadeify', 'stringify'],
      extensions: ['.coffee', '.jade', '.tpl']
    }))
    .pipe(concat('index.js'));

  if (environment == 'production') {
    stream.pipe(uglify());
  }

  stream.pipe(gulp.dest(paths.dest + 'js/'));
});
// Using of transform----------------------------

//Custom markup and styles----------------------
gulp.task('markup', function() {
    gulp.src(paths.src + 'index.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: environment == 'development'
    }))
    .pipe(gulp.dest(paths.dest));

    gulp.src(paths.src + '*.html')
    .pipe(gulp.dest(paths.dest));
});

gulp.task('style', function () {
  // stream = gulp.src(paths.src + 'styles/**/*.styl')
  //   .pipe(plumber())
  //   .pipe(stylus({ use: ['nib']}));

  // if (environment == 'production') {
  //   stream.pipe(minify());
  // }

  // stream.pipe(gulp.dest(paths.dest + 'css/'));
});

gulp.task('sass', function () {
  stream = gulp.src(paths.src + 'styles/**/*.scss')
    .pipe(plumber())
    .pipe(sass());

  if (environment == 'production') {
    stream.pipe(minify());
  }

  stream.pipe(gulp.dest(paths.dest + 'css/'));
});

gulp.task('styles', ['style', 'sass'], function() {
    gulp.src(paths.src + 'styles/**/*.css')
    .pipe(gulp.dest(paths.dest + 'css/'));
});
// /Custom markup and styles----------------------

/*Vendors--------------------*/
gulp.task('assets', function() {
    gulp.src(paths.assets + "**")
        .pipe(plumber())
        .pipe(gulp.dest(paths.dest));

    gulp.src('./node_modules/font-awesome/fonts/*.*')
        .pipe(plumber())
        .pipe(gulp.dest(paths.dest + 'fonts'));
});

gulp.task('vendor-styles', function() {
  stream = gulp.src([
      paths.vendor + 'styles/jquery-ui.structure.css',
      paths.vendor + 'styles/jquery-ui.css',
      paths.vendor + 'styles/jquery-ui.theme.css',
      paths.vendor + 'backgrid/lib/backgrid.css',
      paths.vendor + 'backgrid-paginator/backgrid-paginator.css',
      paths.vendor + 'styles/bootstrap-theme.css.map',
      paths.vendor + 'styles/bootstrap-theme.css',
      paths.vendor + 'styles/bootstrap.css',
    ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat("vendor.css"));

  if (environment == 'production') {
    stream.pipe(minify());
  }
  stream.pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.dest + 'css/'));

  //vendor's style images
});

gulp.task('vendor-scripts', function() {
  stream = gulp.src([
//      'backbone', 'backbone.marionette',
        paths.vendor + 'scripts/jquery.js',
        paths.vendor + 'scripts/jquery-dateFormat.js',
        paths.vendor + 'scripts/jquery-ui.js',
        paths.vendor + 'scripts/underscore.js',
        paths.vendor + 'scripts/backbone.js',
        paths.vendor + 'scripts/backbone.paginator.js',
        paths.vendor + 'scripts/backbone.marionette.js',
        paths.vendor + 'scripts/bootstrap.js',
        paths.vendor + 'scripts/backbone.syphon.js',
        paths.vendor + 'scripts/backbone.picky.js',
        paths.vendor + 'scripts/backbone.localStorage.js',
        paths.vendor + 'backgrid/lib/backgrid.js',
        paths.vendor + 'backgrid-paginator/backgrid-paginator.js',
    ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat("vendor.js"));

  if (environment == 'production') {
    stream.pipe(uglify());
  }

  stream.pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.dest + 'js/'));
});
/*/Vendors--------------------*/
gulp.task('vendor', ['vendor-styles', 'vendor-scripts', 'assets']);
gulp.task('default', ['markup', 'styles']);


// Usage--------------------------------
//1. gulp vendor
//2. gulp
//3. gulp watchifyjs

// /Usage-------------------------------
