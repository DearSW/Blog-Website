/**
 * Created by dearsw on 16/10/5.
 */

const gulp = require('gulp');
const less = require('gulp-less');

gulp.task('testless', function () {
    return gulp.src('./public/src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/dist/css'));
});

gulp.task('watchless', function () {
    gulp.watch('./public/src/less/*.less',['testless']);
});

gulp.task('less',['testless','watchless']);

