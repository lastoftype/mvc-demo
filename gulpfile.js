/*
 *    ___  _  _  __    ____ 
 *   / __)/ )( \(  )  (  _ \
 *  ( (_ \) \/ (/ (_/\ ) __/
 *   \___/\____/\____/(_
 *  
 *  Featuring this cool text
 *
 */

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var del = require('del');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var bowerPath = 'app/bower_components';

var paths = {
    js: {
        vendors: [
            'app/bower_components/js-signals/dist/signals.js',
            'app/bower_components/mustache/mustache.js',
            'app/bower_components/spine/lib/spine.js',
            'app/bower_components/spine/lib/local.js',
            'app/bower_components/hasher/dist/js/hasher.js'
        ],
        dist: 'dist/js'
    },
    files: ['*.html'],
    scss: ['app/assets/scss/*.scss', 'app/assets/scss/**/*.scss'],
    css: 'app/assets/css'
};

gulp.task('sass', function() {
    gulp.src(paths.scss)
        .pipe(plumber())
    	.pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['> 5% in US','Firefox >= 20'],
            cascade: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css));
});

gulp.task('scripts', function() {
    gulp.src(paths.js.vendors)
        .pipe(plumber())
        .pipe(concat('rif-apothecary.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dist));
});

gulp.task('sass:build', function() {
    gulp.src(paths.scss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['> 5% in US','Firefox >= 20'],
            cascade: true
        }))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scss, ['sass']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'sass']);

gulp.task('build', ['sass:build','scripts']);