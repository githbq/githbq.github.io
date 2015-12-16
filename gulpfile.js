var gulp = require('gulp');
var ts = require('gulp-typescript');
var gutil = require('gulp-util');
var less = require('gulp-less');
var merge = require('merge2');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var colors = require('colors/safe');
var jade = require('gulp-jade');
var html2jade = require('gulp-html2jade');
var through = require('through2');
var util=require('util');
//默认任务入口
gulp.task("default", ["clean"], function () {
    console.log('gulp default');
    gulp.start('typescript', 'less', 'jade', 'html2jade');
});
//清理废弃文件
gulp.task("clean", [], function () {
    //return gulp.src(['public/css/*.css', 'public/js/*.js', 'public/html/*.html'], {read: false})
    //    .pipe(clean({force: true}));
});
//编译typescript TS文件
gulp.task("typescript", [], function () {
    gutil.log(colors.red('开始编译typescript...'));
    var tsResult = gulp.src(['client/ts/*.ts'])
        .pipe(ts({
            declaration: true,
            noExternalResolve: true
        }));
    return merge([
        tsResult.dts.pipe(gulp.dest('client/ts-release-definitions')),
        tsResult.js.pipe(gulp.dest('public/js'))
    ]);
});

//编译less文件
gulp.task('less', function () {
    gutil.log(colors.red('开始编译less...'));
    return gulp.src('client/less/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'public', 'css')]
        }))
        //   .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'));
});

//jade编译
gulp.task("jade", [], function () {
    return gulp.src('client/jade/*.jade')
        .pipe(jade({
            client: false,
            pretty: true
        }))
        .pipe(gulp.dest('public/html'));
});
//将标准HTML转译成JADE格式文件   中文乱码问题
gulp.task('html2jade', function () {
    var options = {'nspaces': 2, encoding: 'UTF-8'};
    return gulp.src(['views/*.html', 'views/**/*.html'])
        .pipe(through.obj(function (obj, enc, cb) {
            obj.base = path.join(__dirname, 'views'); // keep dir structure
            this.push(obj);
            cb();
        }))
        .pipe(html2jade(options))
        .pipe(dest('views'));
});
//封装dest
function dest() {
    return gulp.dest(path.join.apply(path, [__dirname].concat([].slice.call(arguments))));
}
//封装src
function src(glob, opts) {
    var xopts = {cwd: __dirname}
    opts = opts ? _.extend(xopts, opts) : xopts;
    return gulp.src.call(gulp, glob, opts);
}
//文件监听 第二个参数为触发后会执行的任务
gulp.task('watch', function () {
    gulp.watch('client/less/*.less', ['less']);
    gulp.watch('client/ts/*.ts', ['typescript']);
    gulp.watch('client/jade/*.jade', ['jade']);
    //gulp.watch('views/*.jade',['templates']);
});