const { src, dest, watch, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create();
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const gp_uglify = require("gulp-uglify");
const del = require("del");
const autoprefixer = require("gulp-autoprefixer");
const imageMin = require("gulp-imagemin");
const { notify } = require("browser-sync");
const concat = require("gulp-concat");

const clean = () => {
  return del("./dist");
};

const serv = () => {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    open: true,
  });
};

const html = () => {
  return src("src/html/index.html")
    .pipe(fileInclude())
    .pipe(dest("./"))
    .pipe(browserSync.stream());
};
const scripts = (done) => {
  src("./src/js/main.js")
    .pipe(gp_uglify())
    .pipe(concat("scripts.min.js"))
    .pipe(dest("./dist/js"))
    .pipe(browserSync.stream());
  done();
};

const styles = (done) => {
  src("./src/scss/style.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
      })
    )
    .pipe(concat("styles.min.css"))
    .pipe(dest("./dist/css"))
    .pipe(browserSync.stream());
  done();
};

const watcher = () => {
  watch("./src/html/**/*.html", html);
  watch("./src/js/*.js").on("change", series(scripts, browserSync.reload));
  watch("./src/scss/**/*.scss", styles);
  watch("./src/img/**/*.{jpg,jpeg,png,svg}").on(
    "change",
    series(images, browserSync.reload)
  );
};

const images = () => {
  return src("./src/img/**/*.{jpg,jpeg,png,svg}")
    .pipe(
      imageMin([
        imageMin.gifsicle({ interlaced: true }),
        imageMin.mozjpeg({ progressive: true }),
        imageMin.optipng({ optimizationLevel: 5 }),
        imageMin.svgo({ plugins: [{ removeViewBox: true }] }),
      ])
    )
    .pipe(dest("./dist/img"));
};

exports.del = clean;
exports.clean = clean;
exports.html = html;
exports.watch = watcher;
exports.dev = parallel(serv, watcher);
exports.build = series(clean, html, styles, scripts, images);
