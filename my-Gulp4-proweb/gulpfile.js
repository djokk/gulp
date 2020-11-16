var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var rename = require("gulp-rename");
var watch = require('gulp-watch');
var gcmq = require('gulp-group-css-media-queries');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');

function style() {
    return gulp.src('./app/precss/style.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            cascade: false
        }))
        .pipe(gcmq())
        .pipe(gulp.dest('./app/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(csso())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./app/css'))
        .pipe(browserSync.stream())
}

gulp.task('watch', function () {
    watch('./app/precss/style.scss', style)
    watch('./app/js/*.js', browserSync.reload)
    watch('./app/*.html', browserSync.reload)
})

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "./app"
        }// index: "*.html" тут нужно удалить после проекта, поскольку он для многих html-файлов 
    });
});
function minimage() {
    return gulp.src('./app/sourceimages/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./app/img/'))
}
gulp.task('imagemin', function () {
    watch('./app/sourceimages/*', minimage)
    watch('./app/*.html', browserSync.reload)
})

gulp.task('style', style);
gulp.task('minimage', minimage);

gulp.task('default', gulp.parallel('watch', 'server', 'style', 'imagemin', 'minimage'));