var gulp = require('gulp')
const minify = require('gulp-minify')

gulp.task('compress', () => {
  return gulp
    .src(['lib/*.js', 'lib/*.mjs'])
    .pipe(
      minify({
        ext: {
          src: '.js',
          min: '.min.js'
        }
      })
    )
    .pipe(gulp.dest('dist'))
})

gulp.task('default', gulp.series('compress'), () => {})
