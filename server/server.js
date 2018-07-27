const express = require('express');
const expressStatic = require('express-static');
const fs = require('fs');
const bodyParser = require('body-parser');
const urlLib = require('url');
const queryString = require('querystring');
const mysql = require('mysql');

var server = express();
const conn  = mysql.createConnection({
  hostname: 'localhost',
  user: 'root',
  password: 'kkxxdgmyt67LIUQIONG',
  database: 'bookstore'
});
server.get('/',function(req,res){
  console.log('url'+req.url);
  var reqUrl = req.query;
  var sql="";
  console.log(reqUrl);
  switch(reqUrl.act){
    case 'indexBook':
      sql = 'SELECT bookId,bookSrc,bookName,bookPrice,schoolName FROM bookinfo,user where bookinfo.shopperId=user.userId;';
      conn.query(sql,function(err,data){
        if(err){
          console.log(err);
          res.send(err);
        }else {
          console.log(data);
          res.send(data);
        }
      })
      break;
    case 'searchBook':
      var bookName,bookPublic,bookCollege;
      bookName = reqUrl.bookName;
      sql = 'SELECT bookId,bookSrc,bookName,bookPublic,bookPrice,schoolName FROM bookinfo,user where bookinfo.shopperId=user.userId and bookName like "%'+bookName+'%"';
      if(reqUrl.bookPublic) {
        console.log('有public');
        bookPublic = reqUrl.bookPublic;
        sql+='and bookPublic like "%'+bookPublic+'%"';
      }
      if(reqUrl.bookCollege){
        console.log('有大学');
        bookCollege = reqUrl.bookCollege;
        sql+='and schoolName like "%'+bookCollege+'%"';
      }
      conn.query(sql,function(err,data){
        console.log(sql);
        if(err){
          console.log(err.code);
          res.send(err.code);
        }else {
          console.log(data);
          res.send(data);
        }
      })
      break;
    case 'getBookDetail':
      var bookId = reqUrl.bookId;
      sql = 'SELECT bookId,bookSrc,bookName,bookPrice,bookAllNum,bookPublic,bookDescribe,tel FROM bookinfo,user where bookinfo.shopperId=user.userId and bookId="'+bookId+'";'
      conn.query(sql,function(err,bookDetail){
        console.log(sql);
        if(err){
          res.send(err.code);
        }else {
          console.log(bookDetail);
          var bookName = bookDetail[0].bookName;
          //以下处理anotherbook
          var anotherBookSql = 'SELECT bookId,bookSrc,bookName from bookinfo where bookName like "%+bookName+%"';
          conn.query(anotherBookSql,function(err,anotherBook){
            console.log(anotherBookSql);
            if(err){
              res.send(err.code);
            }else{
              res.send({bookDetail: bookDetail,anotherBook: anotherBook});
            }
          })
        }
      })
      break;
    case 'getBookComment':
      var bookId = reqUrl.bookId;
      sql = 'SELECT * FROM bookcomment where bookId="'+bookId+'"';
      conn.query(sql,function(err,data){
        if(err){
          res.send(err.code);
        }else {
          res.send(data);
        }
      })
      break;
  }
})
server.post('/',function(req,res){
  var str = '';
  var sql;
  req.on('data',function(data){
    str+=data;
  })
  req.on('end',function(){
    const POST = queryString.parse(str);
    console.log(POST);
    switch(POST.act){
      case 'regist':
        let userName = POST.username,
            tel = POST.tel,
            email = POST.email,
            college = POST.college,
            pass = POST.pass;
        let openSql = 'select userName from user where tel = "'+tel+'" OR email="'+email+'";';
        conn.query(openSql,function(err,data){
          console.log(openSql);
          if(err){
            res.send('error'+err);
          }else {
            console.log(data);
            if(data.toString()== ""){
              sql = 'INSERT INTO user(userName,tel,email,schoolName,pass) VALUES("'+userName+'","'+tel+'","'+email+'","'+college+'","'+pass+'");'
              conn.query(sql,function(err,data){
                if(err){
                  res.send('注册失败');
                }else {
                  res.send('注册成功');
                }
              })
            }else {
              res.send('账号重复');
            }
          }
        })
        break;
      case 'login':

        break;
    }
  })
})
server.use(expressStatic('./main'));
server.listen(8080);
