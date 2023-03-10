"use strict";

const {src, dest} = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require('gulp-sass')(require('sass'));
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const del = require("del");
const gulpLivereload = require('gulp-livereload');
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");

/* Paths */
var path = {
    build: {
        html: "dist/",
        js: "dist/assets/js/",
        css: "dist/assets/css/",
        images: "dist/assets/images/",
        fonts: "dist/assets/fonts/"
    },
    src: {
        html: "src/*.html",
        js: "src/assets/js/*.js",
        css: "src/assets/scss/style.scss",
        images: "src/assets/images/**/*",
        fonts: "src/assets/fonts/*"
    },
    watch: {
        html: "src/**/*.html",
        js: "src/assets/js/**/*.js",
        css: "src/assets/scss/**/*.scss",
        images: "src/assets/images/**/*"
    },
    clean: "./dist"
}

/* HTML */
function html() {
    return src(path.src.html, { base: "src/" })
        .pipe(plumber())
        .pipe(dest(path.build.html))
        .pipe(gulpLivereload());
}

/* CSS */
function css() {
    return src(path.src.css, { base: "src/assets/scss/" })
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: true
        }))
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(gulpLivereload());
}

/* JS */
function js() {
    return src(path.src.js, {base: "./src/assets/js/"})
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(dest(path.build.js))
        .pipe(gulpLivereload());
}

/* Images */
function images() {
    return src(path.src.images + '!(*.svg)')
        .pipe(imagemin())
        .pipe(src(path.src.images + '.svg'))
        .pipe(dest(path.build.images))
        .pipe(gulpLivereload());
}

/* Fonts */
function fonts() {
    return src(path.src.fonts)
        .pipe(fonter({
            formats: ["ttf", "eot", "woff"]
        }))
        .pipe(dest(path.build.fonts))
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
        .pipe(gulpLivereload());
}



/* Delete */
function clean() {
    return del(path.clean);
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);

    gulpLivereload.listen({quiet: true});
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, watchFiles);


/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
