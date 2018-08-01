const http = require('http');
const express = require('express');
const expressStatic = require('express-static');
const fs = require('fs');
const bodyParser = require('body-parser');
const urlLib = require('url');
const queryString = require('querystring');
const mysql = require('mysql');
const multer = require('multer');
const pathLib = require('path');

const storeInfoMulter = multer({dest: './main/imgs/storeImg'});
const server = express();
const conn  = mysql.createConnection({
  hostname: 'localhost',
  user: 'root',
  password: 'kkxxdgmyt67LIUQIONG',
  database: 'bookstore'
});
const preventSqlWords = /select|update|delete|insert|exec|count|'|"|=|<|>|%/i;
// 接收任何文件
server.use(storeInfoMulter.any());
server.get('/',function(req,res){
  console.log('url'+req.url);
  let reqUrl = req.query;
  let sql="";
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
      let bookName,bookPublic,bookCollege;
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
      let bookId = reqUrl.bookId;
      sql = 'SELECT bookId,bookSrc,bookName,bookPrice,bookAllNum,bookPublic,bookDescribe,tel FROM bookinfo,user where bookinfo.shopperId=user.userId and bookId="'+bookId+'";'
      conn.query(sql,function(err,bookDetail){
        console.log(sql);
        if(err){
          res.send(err.code);
        }else {
          console.log(bookDetail);
          let bookName = bookDetail[0].bookName;
          //以下处理anotherbook
          let anotherBookSql = 'SELECT bookId,bookSrc,bookName from bookinfo where bookName like "%+bookName+%"';
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
      let _bookId = reqUrl.bookId;
      sql = 'SELECT * FROM bookcomment where bookId="'+_bookId+'"';
      conn.query(sql,function(err,data){
        if(err){
          console.log(err.code);
        }else {
          res.send(data);
        }
      })
      break;
    case 'getUserCenterInfo':
      let userId = reqUrl.userId;
      let myShopper,like_books,like_stores;
      sql = 'SELECT * FROM shopper where userId="'+userId+'";';
      conn.query(sql,function(err,data1){
        if(err){
          console.log(err.code);
          console.log('data1错了');
        }else {
          console.log('data1');
          console.log(data1);
          myShopper = data1[0];
          let sql2 = 'SELECT booklike.*,bookinfo.bookId,bookinfo.bookSrc,bookinfo.bookName FROM booklike,bookinfo where userId="'+data1[0].userId+'" and likeType="书籍" and booklike.bookId=bookinfo.bookId;';
          conn.query(sql2,function(err,data2){
            if(err){
              console.log(err.code);
              console.log('data2错了');
            }else {
              console.log('data2')
              console.log(data2);
              like_books = data2;
              let sql3 = 'SELECT booklike.*,shopper.shopperImg,shopper.shopperName FROM booklike,shopper where booklike.userId="'+data1[0].userId+'" and likeType="店铺" and booklike.userId=shopper.userId';
              conn.query(sql3,function(err,data3){
                if(err){
                  console.log(err.code);
                  console.log('data3错了');
                }else {
                  console.log("data3");
                  console.log(data3);
                  like_stores = data3;
                  res.send({myShopper,like_books,like_stores});
                }
              })
            }
          })
        }
      })
  }
})
server.post(bodyParser.urlencoded({extended: true}));
server.post('/',function(req,res){
  let str = '';
  let sql;
  if(req.body){
    console.log('body');
    const comingData = req.body;
    switch(comingData.act) {
      case 'storeInfo':
        // 将店存进去
        let file = req.files[0];
        // console.log(pathLib.parse(req.files[0].originalname).ext);
        let newName = file.path + pathLib.parse(file.originalname).ext;
        fs.rename(file.path,newName,function(err){
          if(err){
            console.log('上传失败');
            res.send('上传失败');
          }else {
            console.log('上传成功');
            sql = 'INSERT INTO shopper(userId,shopperName,shopperDescribe,shopperImg) VALUES("'+comingData.userId+'","'+comingData.storeName+'","'+comingData.storeDescribe+'","'+newName+'");';
            conn.query(sql,function(err,data){
              if(err){
                console.log('上传失败:'+err);
                res.send({status:'fail',msg:err});
              }else{
                console.log('上传成功');
                res.send({status:'success'});
              }
            })
          }
        });
        break;
    }
  }else {
    console.log('on');
    req.on('data',function(data){
      str+=data;
    });
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
          if(preventSqlWords.test(userName)||preventSqlWords.test(tel)||preventSqlWords.test(email)||preventSqlWords.test(college)||preventSqlWords.test(pass)){
            res.send({status: 'fail',msg: '请不要尝试输入sql特殊字符，没戏'});
          }else {
            let openSql = 'select userName from user where tel = "'+tel+'" OR email="'+email+'";';
            conn.query(openSql,function(err,data){
              console.log(openSql);
              if(err){
                res.send({status:'fail',msg: err.code});
              }else {
                if(data.toString()== ""){
                  // 先加入学校
                  let sql0 = 'INSERT INTO school(schoolName) VALUES("'+college+'")';
                  conn.query(sql0,function(err,data){
                    if(err){
                      // 程序失败
                      console.log(err.code);
                    }else {
                      sql = 'INSERT INTO user(userName,tel,email,schoolName,pass) VALUES("'+userName+'","'+tel+'","'+email+'","'+college+'","'+pass+'");'
                      conn.query(sql,function(err,data){
                        if(err){
                          res.send({status:'fail',msg: '注册失败'});
                          console.log(err.code);
                        }else {
                          res.send({status: 'success',msg: '注册成功'});
                        }
                      })
                    }
                  })
                }else {
                  res.send({status: 'fail',msg: '已注册过该帐号'});
                }
              }
            })
          }
          break;
        case 'login':
          let telEmail = POST.telEmail,
              password = POST.pass;
          sql = 'SELECT * FROM user where tel="'+telEmail+'" or email="'+telEmail+'";';
          conn.query(sql,function(err,data){
            console.log(data);
            if(err){
              console.log(err);
            }else {
              if(data.toString()==""){
                console.log('没有');
                res.send({status: 'fail',msg:'您登录的账号不存在'});
              }else {
                let result = data[0];
                if(result.pass!=password){
                  res.send({status: 'fail',msg: '密码错误'});
                }else {
                  let userInfo = data[0];
                  console.log(userInfo);
                  delete userInfo.pass;
                  res.send({status: 'success',msg: '登录成功',user: userInfo});
                }
              }
            }
          })
          break;
        case 'modifyUserInfo':
          console.log(POST);
          sql = 'UPDATE user SET userName="'+POST.nickName+'",schoolName="'+POST.college+'" where userId="'+POST.userId+'";';
          conn.query(sql,function(err,data1){
            if(err){
              console.log(err.code);
            }else {
              console.log(data1);
              let sql2 = 'UPDATE shopper SET shopperName="'+POST.storeName+'",shopperDescribe="'+POST.storeSlogan+'" where userId="'+POST.userId+'";';
              conn.query(sql2,function(err,data2){
                if(err){
                  console.log(err.code);
                  res.send({status:'fail',msg:'500'});
                }else {
                  console.log(data2);
                  res.send({status: 'success'});
                }
              })
            }
          })
          break;
      }
    });
  }
})
server.use(expressStatic('./main'));
server.listen(8080);
