const gulp = require(`gulp`);
const cleanCSS = require(`gulp-clean-css`);
const uglify = require(`gulp-uglify`);
const concat = require(`gulp-concat`);
const sass = require(`gulp-sass`);
const pump = require(`pump`);

const paths = {
    styles: [
      `./client/resources/scss/**/*.scss`
    ],
    bootstrap_js: [
      `./node_modules/jquery/dist/jquery.min.js`,
      `./node_modules/bootstrap/dist/js/bootstrap.min.js`
    ]
};

gulp.task(`bootstrap_js`, cb => {
    const tasks = [
      gulp.src(paths.bootstrap_js),
      concat(`bootstrap.js`),
      uglify(),
      gulp.dest(`./public/js`)
    ];
  
    pump(tasks, cb);
});

gulp.task(`css`, cb => {
    const tasks = [
      gulp.src(paths.styles),
      sass().on(`error`, sass.logError),
      concat(`style.css`),
      cleanCSS({ compatibility: `*` }),
      gulp.dest(`./public/css`)
    ];
  
    pump(tasks, cb);
});

gulp.task(`watch`, () => {
    gulp.watch(paths.styles, gulp.series(`css`));
});

gulp.task(`default`, gulp.series(
    `css`,
    `bootstrap_js`,
));