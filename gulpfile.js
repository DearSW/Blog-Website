/**
 * Created by dearsw on 16/9/17.
 */



"use strict";


// 引入模块

const gulp = require('gulp'); // 引入gulp自动化构建工具
// const sass = require('gulp-sass'); // 编译Sass
const rename = require('gulp-rename'); //  重命名插件
const uglify = require('gulp-uglify'); // gulp的JS压缩插件,为混淆压缩
// const babel = require('gulp-babel'); // gulp的ES6的编译插件

const cssmin = require('gulp-cssmin'); // 压缩CSS文件

const less = require('gulp-less'); // 编译less
const path = require('path'); // 系统路径

//var htmlmin = require('gulp-htmlmin');

const imagemin = require('gulp-imagemin'); // 压缩图片
//var pngquant = require('imagemin-pngquant');

//var less = require('gulp-less');
//var livereload = require('gulp-livereload');



// 定义任务

// 编译sass 监听
gulp.task('sass', function () {
    return gulp.src('public/src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});


// 编译less
gulp.task('less', function () {
    return gulp.src('public/src/**/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./public/css'));
});

/*// 压缩图片
gulp.task('default', function() {
    gulp.src('public/src/imgs/!*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/dist/imgs'))
});*/


// 压缩和重命名JS文件
gulp.task('script1', function() {
    gulp.src('public/js/*js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/js'));
});

gulp.task('script2', function() {
    gulp.src('public/js/components/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/js/components'));
});


// 压缩和重命名CSS文件
gulp.task('css1', function() {
    gulp.src('public/css/components/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/css/components'));
});

gulp.task('css2', function() {
    gulp.src('public/css/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/css/'));
});

// 组合任务
gulp.task('default', ['script1','script2','css1','css2']);






