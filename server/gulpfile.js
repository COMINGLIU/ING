const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cmdPack = require('gulp-cmd-pack');
const concat = require('gulp-concat');
const minifyCss = require('gulp-minify-css');
const minifyHtml = require('gulp-minify-html');

gulp.task('html',function(){
  gulp.src('./main/*.html').pipe(minifyHtml()).pipe(gulp.dest('./zip/main'));
});
gulp.task('css',function(){
  gulp.src('./main/css/*.css').pipe(minifyCss()).pipe(gulp.dest('./zip/main/css'));
});
gulp.task('commonCss',function(){
  gulp.src('./main/commonCss/*.css').pipe(minifyCss()).pipe(gulp.dest('./zip/main/commonCss'));
});
gulp.task('js',function(){
  gulp.src('./main/js/*.js').pipe(uglify()).pipe(gulp.dest('./zip/main/js'));
});
// gulp.task('commonJs',function(){
//   gulp.src('./main/commonJs/module/*.js').pipe(uglify()).pipe(gulp.dest('./zip/main/commonJs/module'));
// });
gulp.task('addBookMdule',function(){
  gulp.src('./main/commonJs/module/addBook.js')
  .pipe(cmdPack({
    mainId: 'zip/main/commonJs/module/addBook',
    base: 'server'
  }))
  .pipe(gulp.dest('./zip/main/commonJs/module/'))
})
// admin
gulp.task('adminHtml',function(){
  gulp.src('./main/admin/*.html').pipe(minifyHtml()).pipe(gulp.dest('./zip/main/admin'));
});
gulp.task('adminJs',function(){
  gulp.src('./main/admin/adminJs/*.js').pipe(uglify()).pipe(gulp.dest('./zip/main/admin/adminJs'));
});
// gulp.task('default',['html','css','commonCss','js','commonJs','adminHtml','adminJs']);
gulp.task('default',['addBookMdule']);
