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
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const moment = require('moment');

const storeInfoMulter = multer({dest: './main/imgs/storeImg'});
const server = express();
const conn  = mysql.createConnection({
  hostname: 'localhost',
  user: 'root',
  password: 'kkxxdgmyt67LIUQIONG',
  database: 'bookstore'
});
// 获取当前时间的函数
let TIME=require('./module/getTime.js');
// 执行sql语句的函数
let HANDLESQL = require('./module/handleSql');
let sessionArr = [];
for(var i=0;i<100000;i++){
  sessionArr.push('sig_'+Math.random());
}
server.use(cookieSession({
  keys: sessionArr,
  name: 'session_id',
  maxAge: 20*3600*1000
}))
const preventSqlWords = /select|update|delete|insert|exec|count|'|"|=|<|>|%/i;
// 接收任何文件
server.use(storeInfoMulter.any());
server.get('/',function(req,res){
  console.log('url'+req.url);
  let reqUrl = req.query;
  let sql = "";
  console.log(reqUrl);
  switch(reqUrl.act){
    // 获取主页的书籍
    case 'indexBook':
    // 挑选最新10本
      sql = 'SELECT bookId,bookSrc,bookName,bookPrice,shopperId,shopperName,schoolName FROM bookinfo,user,shopper where bookinfo.shopperId=user.userId and bookinfo.shopperId=shopper.userId order by bookinfo.bookId DESC LIMIT 20;';
      console.log(sql);
      HANDLESQL(conn,sql,function(data){
        console.log('成功');
        res.send(data);
      })
      break;
    // 收藏书籍
    case 'collectBook':
      let collectBook_sql0 = 'SELECT bookId FROM booklike where userId="'+reqUrl.userId+'" and bookId="'+reqUrl.bookId+'" and likeType="书籍";',
          collectBook_sql1 = 'INSERT INTO booklike(userId,likeType,bookId) VALUES("'+reqUrl.userId+'","书籍","'+reqUrl.bookId+'");';
      new Promise((resolve,reject) => {
        HANDLESQL(conn,collectBook_sql0,function(data){
          if(data.toString() == ''){
            console.log('还没收藏过');
            resolve();
          }else {
            console.log('收藏过了');
            res.send({status: 'success',msg: '收藏过了'});
          }
        })
      })
      .then(data=> {
        HANDLESQL(conn,collectBook_sql1,function(data){
          console.log('收藏成功');
          res.send({status: 'success',msg: '收藏成功'});
        })
      })
      .catch(err => {
        console.log(err);
      })
      break;
    // 取消收藏书籍
    case 'cancelCollectBook':
      sql = 'delete from booklike where userId="'+reqUrl.userId+'" and bookId="'+reqUrl.bookId+'" and likeType="书籍";';
      HANDLESQL(conn,sql,function(data){
        console.log('取消成功');
        res.send({status: 'success',msg: '已取消收藏该书籍'});
      })
      break;
    // 收藏店铺
    case 'collectStore':
      let collectStore_sql0 = 'SELECT * from booklike where userId="'+reqUrl.userId+'" and likeType="店铺" and storeId="'+reqUrl.storeId+'";';
          collectStore_sql1 = 'INSERT INTO booklike(userId,likeType,storeId) VALUES("'+reqUrl.userId+'","店铺","'+reqUrl.storeId+'");';
      new Promise((resolve,reject) => {
        HANDLESQL(conn,collectStore_sql0,function(data){
          if(data.toString() == '') {
            resolve();
          }else {
            res.send({status: 'success',msg: '该店铺已经被收藏过了，请在个人中心查看'});
          }
        })
      })
      .then( data => {
        HANDLESQL(conn,collectStore_sql1,function(data){
          res.send({status: 'success',msg:'店铺收藏成功，请在个人中心查看'});
        })
      })
      .catch(err => {
        console.log(err);
      })
      break;
    // 取消收藏书店
    case 'cancelCollectStore':
      sql = 'delete from booklike where userId="'+reqUrl.userId+'" and storeId="'+reqUrl.storeId+'" and likeType="店铺";';
      HANDLESQL(conn,sql,function(data){
        console.log('取消成功');
        res.send({status: 'success',msg: '已取消收藏该书店'});
      })
      break;
    // 获取收藏的书籍（客户端）
    case 'getColllectBooks':
      sql = 'SELECT booklike.bookId,bookinfo.bookName,bookinfo.bookPrice,user.schoolName FROM booklike,bookinfo,user where booklike.userId="'+reqUrl.userId+'" and booklike.likeType="书籍" and booklike.bookId=bookinfo.bookId and booklike.userId=user.userId';
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        res.send({status:'success',data: data});
      })
      break;
    // 搜索书籍
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
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        res.send({status:'success',data:data});
      })
      break;
    // 获取书籍详情
    case 'getBookDetail':
      sql = 'SELECT bookSrc,bookName,bookPrice,bookAllNum,bookPublic,bookDescribe,tel FROM bookinfo,user where bookinfo.shopperId=user.userId and bookId="'+reqUrl.bookId+'";';
      new Promise((resolve,reject) => {
        HANDLESQL(conn,sql,function(data){
          resolve(data);
        })
      })
      .then(data => {
        let bookName = data[0].bookName;
        let anotherBookSql = 'SELECT bookId,bookSrc,bookName from bookinfo where bookName like "%'+bookName+'%" and bookId!="'+reqUrl.bookId+'";';
        HANDLESQL(conn,anotherBookSql,function(data2){
          console.log('书籍获取成功');
          res.send({status: 'success',bookDetail: data[0],anotherBook: data2});
        })
      })
      .catch(err => {
        console.log(err);
      })
      break;
    // 获取某本书籍评论
    case 'getBookComment':
      sql = 'SELECT * FROM ask where bookId="'+reqUrl.bookId+'"';
      HANDLESQL(conn,sql,function(data){
        console.log('书籍评论返回成功');
        if(data.length>0){
          for(var i=0,len=data.length;i<len;i++){
            data[i].askTime = moment(data[i].askTime).format('YYYY-MM-DD HH:mm:ss');
          }
        }
        res.send({status:'success',data:data});
      })
      break;
    // 删除个人的书籍评论
    case 'delBookComment':
      sql = 'DELETE FROM ask where askId="'+reqUrl.askId+'";';
      HANDLESQL(conn,sql,function(data){
        console.log('评论删除成功');
        res.send({status: 'success',msg: '书籍评论删除成功'});
      })
      break;
    // 获取所有的店铺
    case 'getAllStores':
      sql = 'SELECT * FROM shopper';
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        if(data.length>0){
          for(var i=0,len=data.length;i<len;i++) {
            data[i].shopperTime = moment(data.shopperTime).format('YYYY-MM-DD HH-mm-ss');
          }
        }
        res.send({status: 'success',data:data});
      })
      break;
    // 获取某个店铺的所有书籍详情（游客）
    case 'getOneAllStoreBooks':
      sql = 'SELECT bookId,bookSrc,bookName,bookPublic,bookAllNum,bookPrice,bookDescribe FROM bookinfo where shopperId="'+reqUrl.shopperId+'";';
      new Promise((resolve,reject) => {
        HANDLESQL(conn,sql,function(data){
          if(data.toString()==''){
            res.send({status:'fail',msg: '该小店还没有书籍'});
          }else {
            resolve(data);
          }
        })
      })
      .then(data => {
        let sql2 = 'SELECT shopperName,schoolName from shopper,user where shopper.userId="'+reqUrl.shopperId+'" and shopper.userId=user.userId;';
        HANDLESQL(conn,sql2,function(data2){
          console.log(data2[0]);
          res.send({status:'success',data:data,shopperInfo:data2[0]});
        })
      })
      .catch(err => {
        console.log(err);
      })
      break;
    // 获取某个店铺的所有书籍详情（店长）
    case 'getOneAllStoreBooksForShopper':
      let getOneAllStoreBooksForShopper_sql0 = 'SELECT bookId,bookSrc,bookName,bookAllNum,bookPublic,bookType,bookPrice,bookTime,bookDescribe FROM bookinfo where shopperId="'+reqUrl.shopperId+'";';
          getOneAllStoreBooksForShopper_sql1 = 'SELECT shopperName FROM shopper WHERE userId="'+reqUrl.shopperId+'";';
       new Promise((resolve,reject) => {
         HANDLESQL(conn,getOneAllStoreBooksForShopper_sql0,function(data){
            resolve(data);
         })
       })
       .then(data => {
         HANDLESQL(conn,getOneAllStoreBooksForShopper_sql1,function(data2){
           res.send({status:'success',data:data,shopperName:data2[0].shopperName});
         })
       })
       .catch(err => {
         console.log(err);
       })
      break;
    //删除某本书籍
    case 'delShopperBook':
      let delShopperBook_slq0 = 'delete from ask where bookId="'+reqUrl.bookId+'";';
          delShopperBook_slq1 = 'delete from booklike where bookId="'+reqUrl.bookId+'";';
          delShopperBook_slq2 = 'delete from bookscore where bookId="'+reqUrl.bookId+'";';
          delShopperBook_slq3 = 'delete from bookinfo where bookId="'+reqUrl.bookId+'";';
          delShopperBook_slq4 = 'UPDATE shopper SET booksNum=booksNum-1 where userId in (select shopperId from bookinfo where bookId="'+reqUrl.bookId+'");';
      Promise.all([
        HANDLESQL(conn,delShopperBook_slq0,function(){
          console.log('书籍评论删了');
        }),
        HANDLESQL(conn,delShopperBook_slq1,function(){
          console.log('书籍收藏消息删了');
        }),
        HANDLESQL(conn,delShopperBook_slq2,function(){
          console.log('书籍成就删了');
        }),
        HANDLESQL(conn,delShopperBook_slq3,function(){
          console.log('书籍删除完毕');
        }),
        HANDLESQL(conn,delShopperBook_slq4,function(){
          console.log('shopper重置完成,书籍删除成功');
          res.send({status:'success',msg: '书籍删除成功'});
        })
      ])
      .then(() => {
        console.log('删除成功');
      })
      .catch(err => {
        console.log(err);
      })
      break;
    // 个人中心
    case 'getUserCenterInfo':
      sql = 'SELECT * FROM shopper where userId="'+reqUrl.userId+'";';
      // let getUserCenterInfo_sql0 = 'SELECT * FROM shopper where userId="'+reqUrl.userId+'";',
      //     getUserCenterInfo_sql1 = 'SELECT booklike.*,bookinfo.bookId,bookinfo.bookSrc,bookinfo.bookName FROM booklike,bookinfo where userId="'+reqUrl.userId+'" and likeType="书籍" and booklike.bookId=bookinfo.bookId;',
      //     getUserCenterInfo_sql2 = 'SELECT shopper.userId,shopper.shopperImg,shopper.shopperName FROM shopper where userId in (SELECT storeId FROM booklike where userId="'+reqUrl.userId+'" and likeType="店铺");';
      // new Promise((resolve,reject) => {
      //   let myShopper,like_books,like_stores;
      //   HANDLESQL(conn,getUserCenterInfo_sql0,function(data1){
      //     if(data1.toString()==""){
      //       myShopper = {
      //         userId: userId,
      //         shopperImg: '暂无',
      //         shopperName: '还未开启店铺哦',
      //         shopperDescribe: '还未开启店铺哦',
      //         shopperTime: '0'
      //       };
      //     }else {
      //       myShopper = data1[0];
      //     }
      //     resolve(myShopper);
      //   })
      // })
      // .then((data) => {
      //   console.log(data);
      //   HANDLESQL(conn,getUserCenterInfo_sql1,function(data2){
      //     like_books = data2;
      //     return like_books;
      //   })
      // })
      // .then((data) => {
      //   console.log(data);
      //   HANDLESQL(conn,getUserCenterInfo_sql2,function(data3){
      //     like_stores = data3;
      //     // res.send({status: 'success',myShopper,like_books,like_stores});
      //     // console.log("data");
      //     // console.log(data);
      //     // res.send({status: 'success',data[0],data[1],like_stores});
      //   })
      // })
      // .catch(err => {
      //   console.log(err);
      // })

      conn.query(sql,function(err,data1){
        if(err){
          console.log(err.code);
        }else {
          console.log(data1);
          if(data1.toString()==""){
            myShopper = {
              userId: userId,
              shopperImg: '暂无',
              shopperName: '还未开启店铺哦',
              shopperDescribe: '还未开启店铺哦',
              shopperTime: '0'
            };
          }else {
            myShopper = data1[0];
          }
          let sql2 = 'SELECT booklike.*,bookinfo.bookId,bookinfo.bookSrc,bookinfo.bookName FROM booklike,bookinfo where userId="'+reqUrl.userId+'" and likeType="书籍" and booklike.bookId=bookinfo.bookId;';
          conn.query(sql2,function(err,data2){
            if(err){
              console.log(err.code);
            }else {
              console.log(data2);
              like_books = data2;
              // let sql3 = 'SELECT booklike.*,shopper.shopperImg,shopper.shopperName FROM booklike,shopper where booklike.userId="'+userId+'" and likeType="店铺" and booklike.userId=shopper.userId';
              let sql3 = 'SELECT shopper.userId,shopper.shopperImg,shopper.shopperName FROM shopper where userId in (SELECT storeId FROM booklike where userId="'+reqUrl.userId+'" and likeType="店铺");';
              conn.query(sql3,function(err,data3){
                console.log(sql3);
                if(err){
                  console.log(err.sqlMessage);
                }else {
                  console.log(data3);
                  like_stores = data3;
                  res.send({status: 'success',myShopper,like_books,like_stores});
                }
              })
            }
          })
        }
      })
      break;
    case 'getVisitDetails':
      let getVisitDetails_time = '';
      if(reqUrl.dayTime){
        getVisitDetails_time = reqUrl.dayTime;
      }else {
        getVisitDetails_time = TIME();
      }
      sql = 'select DISTINCT(loginlog.userId),user.userName,COUNT(loginlog.userId) from loginlog,user where loginTime>"'+getVisitDetails_time+'" and loginlog.userId=user.userId;';
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        res.send({status:'success',data:data});
      })
      break;
    // 用户详情接口
    case 'getUserDetailData':
      if(req.session['adminAcount']) {
        if(reqUrl.adminAcount==req.session['adminAcount']){
          console.log(req.session['adminAcount']);
          var adminA = req.session['adminAcount'];
          console.log(adminA.split('_')[1]);
          if(adminA.split('_')[1]=="super") {
            // 超级管理员
            sql = 'select user.*,logintimes.loginTimes,logintimes.userScore from user,logintimes where user.userId=logintimes.userId;';
            HANDLESQL(conn,sql,function(data){
              console.log('成功');
              console.log(data);
              if(data.length>0){
                for(var i=0,len=data.length;i<len;i++) {
                  data[i].registTime = moment(data[i].registTime).format('YYYY-MM-DD HH:mm:ss');
                }
              }
              res.send({status: 'success',data: data});
            })
          }else {
            // 普通管理员
            res.send({status: 'fail',msg: '您没有查看用户详情的权限，详情请查看:权限须知'});
          }
        }else {
          // 账号不对的情况
          res.send({status:'fail',msg: '您登录的账号有变，请立刻确认是否有被盗号。如非盗号，请确保不要同时登录多个账号'});
        }
      }else {
        // 没有登录或登录过期的情况
        res.send({status: 'fail',msg: '还没有登录哦，请刷新登录'});
      }
      break;
    // 搜索用户信息
    case 'searchUserInfo':
      let user_key = reqUrl.searchKey,
          user_value = reqUrl.searchValue,
          user_sqlKey;
      switch(user_key) {
        case '用户ID':
          user_sqlKey='user.userId';
          break;
        case '昵称':
          user_sqlKey = 'user.userName';
          break;
        case '电话':
          user_sqlKey = 'user.tel';
          break;
        case '邮箱':
          user_sqlKey = 'user.email';
          break;
        case '学校':
          user_sqlKey = 'user.schoolName';
          break;
      }
      sql = 'select user.*,logintimes.loginTimes,logintimes.userScore from user,logintimes where user.userId=logintimes.userId and '+user_sqlKey+'="'+user_value+'";'
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        if(data.length>0){
          for(var i=0,len=data.length;i<len;i++) {
            data[i].registTime = moment(data[i].registTime).format('YYYY-MM-DD HH:mm:ss');
          }
        }
        res.send({status:'success',data:data});
      })
      break;
    // 用户收藏的书籍（管理员端）
    case 'getBookLikes':
      sql = 'select bookId,bookName,bookPublic,bookType,bookPrice,bookAllNum,bookTime from bookinfo where bookId in(select bookId from booklike where userId = "'+reqUrl.userId+'" and likeType="书籍");'
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        if(data.length>0) {
          for(var i=0,len=data.length;i<len;i++) {
            data[i].bookTime = moment(data[i].bookTime).format('YYYY-MM-DD HH:mm:ss');
          }
        }
        res.send({status:'success',data:data});
      })
      break;
    // 用户收藏的店铺（管理员端）
    case 'getStoreLikes':
      sql = 'select shopperName,shopperDescribe,booksNum,shopperTime from shopper where userId in(select storeId from booklike where userId = "'+reqUrl.userId+'" and likeType="店铺");'
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        if(data.length>0) {
          for(var i=0,len=data.length;i<len;i++) {
            data[i].shopperTime = moment(data[i].shopperTime).format('YYYY-MM-DD HH-mm-ss');
          }
        }
        res.send({status:'success',data:data});
      })
      break;
    // 获取店铺详情
    case 'getStoresInfo':
      if(req.session['adminAcount']) {
        if(reqUrl.adminAcount==req.session['adminAcount']){
          console.log(req.session['adminAcount']);
          var adminA = req.session['adminAcount'];
          console.log(adminA.split('_')[1]);
          if(adminA.split('_')[1]=="super") {
            // 超级管理员
            sql = 'select shopper.userId,shopper.shopperName,shopper.booksNum,user.userName,user.tel,user.email,shopper.shopperTime,shopper.shopperDescribe from user,shopper where user.userId=shopper.userId;';
             HANDLESQL(conn,sql,function(data){
               console.log(data);
               if(data.length>0){
                 for(var i=0,len=data.length;i<len;i++){
                   data[i].shopperTime = moment(data[i].shopperTime).format('YYYY-MM-DD HH:mm:ss');
                 }
               }
               res.send({status: 'success',data: data});
             })
          }else {
            // 普通管理员
            res.send({status: 'fail',msg: '您没有查看用户详情的权限，详情请查看:权限须知'});
          }
        }else {
          // 账号不对的情况
          res.send({status:'fail',msg: '您登录的账号有变，请立刻确认是否有被盗号。如非盗号，请确保不要同时登录多个账号'});
        }
      }else {
        // 没有登录或登录过期的情况
        res.send({status: 'fail',msg: '还没有登录哦，请刷新登录'});
      }
      break;
    // 搜索指定店铺基本信息
    case 'serchStoreInfo':
      let store_key = reqUrl.searchKey,
          store_value = reqUrl.searchValue,
          store_sqlKey;
      console.log(store_key);
      switch(store_key) {
        case '用户ID':
          store_sqlKey='shopper.userId';
          break;
        case '店名':
          store_sqlKey = 'shopper.shopperName';
          break;
        case '店长昵称':
          store_sqlKey = 'user.userName';
          break;
        case '电话':
          store_sqlKey = 'user.tel';
          break;
        case '邮箱':
          store_sqlKey = 'user.email';
          break;
      }
      console.log(store_sqlKey);
      sql = 'select shopper.userId,shopper.shopperName,shopper.booksNum,user.userName,user.tel,user.email,shopper.shopperTime,shopper.shopperDescribe from user,shopper where user.userId=shopper.userId and '+store_sqlKey+'="'+store_value+'";';
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        if(data.length>0){
          for(var i=0,len=data.length;i<len;i++){
            data[i].shopperTime = moment(data[i].shopperTime).format('YYYY-MM-DD HH:mm:ss');
          }
        }
        res.send({status: 'success',data: data});
      })
      break;
    // 删除某个书店
    case 'delStore':
      // let delStore_sql0 = '';
      // conn.query(delStore_sql0,function(err,data){
      //   if(err){
      //     console.log(err.sqlMessage);
      //   }else {
      //
      //   }
      // })
      break;
    // 获取书籍信息
    case 'getBookInfo':
      sql = 'select bookId,bookName,bookPublic,bookType,bookPrice,bookAllNum,bookTime,shopperName,bookDescribe from bookinfo,shopper where bookinfo.shopperId=shopper.userId;';
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        if(data.length>0) {
          for(var i=0,len=data.length;i<len;i++) {
            data[i].bookTime = moment(data[i].bookTime).format('YYYY-MM-DD HH-mm-ss');
          }
        }
        res.send({status:'success',data:data});
      })
      break;
    //搜索书籍信息
    case 'searchBookInfo':
      let book_key = reqUrl.searchKey,
          book_value = reqUrl.searchValue,
          book_keySql;
      switch(book_key) {
        case '书籍ID':
          book_keySql = 'bookinfo.bookId';
          break;
        case '书名':
          book_keySql = 'bookinfo.bookName';
          break;
        case '出版社':
          book_keySql = 'bookinfo.bookPublic';
          break;
        case '分类':
          book_keySql = 'bookinfo.bookType';
          break;
        case '店名':
          book_keySql = 'shopper.shopperName';
          break;
      }
      sql = 'select bookId,bookName,bookPublic,bookType,bookPrice,bookAllNum,bookTime,shopperName,bookDescribe from bookinfo,shopper where bookinfo.shopperId=shopper.userId and '+book_keySql+'="'+book_value+'";';
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        if(data.length>0) {
          for(var i=0,len=data.length;i<len;i++) {
            data[i].bookTime = moment(data[i].bookTime).format('YYYY-MM-DD HH-mm-ss');
          }
        }
        res.send({status: 'success',data: data});
      })
      break;
    // 获取所有的书籍评论
    case 'getAllBookComment':
      sql = 'SELECT ask.bookId,bookinfo.bookName,ask.shopperId,askUserId,askUserName,askTime,askContent FROM ask,bookinfo where ask.bookId=bookinfo.bookId';
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        if(data.length>0) {
          for(var i=0,len=data.length;i<len;i++) {
            data[i].askTime = moment(data[i].askTime).format('YYYY-MM-DD HH:mm:ss');
          }
        }
        res.send({status:'success',data: data});
      })
      break;
    // 获取留言条
    case 'getMessageNote':
      sql = 'select message.*,user.userName from message,user where message.userId=user.userId;';
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        if(data.length>0) {
          for(var i=0,len=data.length;i<len;i++) {
            data[i].msgTime = moment(data[i].msgTime).format('YYYY-MM-DD HH-mm-ss');
          }
        }
        res.send({status:'success',data: data});
      })
      break;
    // 获取公屏语录
    case 'getScreenMsg':
      sql = 'select * from screenmsg;'
      HANDLESQL(conn,sql,function(data){
        console.log(data);
        if(data.length>0) {
          for(var i=0,len=data.length;i<len;i++) {
            data[i].msgTime = moment(data[i].msgTime).format('YYYY-MM-DD HH-mm-ss');
          }
        }
        res.send({status:'success',data: data});
      })
      break;
    // 删除公屏语录
    case 'delScreenMsg':
      if(req.session['adminAcount']) {
        if(reqUrl.adminAcount==req.session['adminAcount']){
          console.log(req.session['adminAcount']);
          var adminA = req.session['adminAcount'];
          console.log(adminA.split('_')[1]);
          if(adminA.split('_')[1]=="super") {
            // 超级管理员
            sql = 'DELETE FROM screenmsg WHERE msgId="'+reqUrl.msgId+'";';
            HANDLESQL(conn,sql,function(data){
              console.log('删除成功');
              res.send({status:'success',msg:'删除成功'});
            })
          }else {
            // 普通管理员
            res.send({status: 'fail',msg: '您没有删除语录的权限，详情请查看:权限须知'});
          }
        }else {
          // 账号不对的情况
          res.send({status:'fail',msg: '您登录的账号有变，请立刻确认是否有被盗号。如非盗号，请确保不要同时登录多个账号'});
        }
      }else {
        // 没有登录或登录过期的情况
        res.send({status: 'fail',msg: '还没有登录哦，请刷新登录'});
      }
      break;
  }
})
server.post(bodyParser.urlencoded({extended: true}));
server.post('/',function(req,res){
  //设置response编码为utf-8
  // res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  let str = '';
  let sql;
  console.log(req.body);
  if(req.body){
    console.log('body');
    const comingData = req.body;
    switch(comingData.act) {
      case 'storeInfo':
        // 将店存进去
        let file = req.files[0];
        let store_sql_name = file.filename + pathLib.parse(file.originalname).ext;
        let newName = file.path + pathLib.parse(file.originalname).ext;
        fs.rename(file.path,newName,function(err){
          if(err){
            console.log('图片上传失败');
            res.send('图片上传失败');
          }else {
            sql = 'INSERT INTO shopper(userId,shopperName,shopperDescribe,shopperImg,booksNum) VALUES("'+comingData.userId+'","'+comingData.storeName+'","'+comingData.storeDescribe+'","'+store_sql_name+'","0");';
            let sql2 = "UPDATE user SET user.isSeller='1' where user.userId='"+comingData.userId+"';";
            new Promise((resolve,reject) => {
              HANDLESQL(conn,sql,function(data){
                console.log('上传成功');
                resolve();
              })
            })
            .then(() => {
              HANDLESQL(conn,sql2,function() {
                console.log('上传成功');
                res.send({status:'success'});
              })
            })
            .catch(err => {
              console.log(err);
            })
          }
        });
        break;
      case 'addBook':
        let add_Book_file = req.files[0];
        console.log(add_Book_file);
        let addBook_sqlName = add_Book_file.filename + pathLib.parse(add_Book_file.originalname).ext;
        let addBook_newName = add_Book_file.path + pathLib.parse(add_Book_file.originalname).ext;
        fs.rename(add_Book_file.path,addBook_newName,function(err){
          if(err){
            console.log('图片上传失败');
          }else {
            console.log('图片上传成功');
            // 先传入出版社和类型
            console.log('看有没有类型');
            let sql0 = 'SELECT bookType from booktype where bookType="'+comingData.bookClass+'";',
                sql1 = 'INSERT INTO bookType(bookType) VALUES("'+comingData.bookClass+'");',
                sql2 = 'SELECT publish from bookpublic where publish="'+comingData.bookPublic+'";',
                sql3 = 'INSERT INTO bookpublic(publish) VALUES("'+comingData.bookPublic+'");',
                sql4 = 'INSERT INTO bookinfo(bookName,bookSrc,bookType,bookAllNum,bookPublic,bookPrice,bookDescribe,shopperId) VALUES("'+comingData.bookName+'","'+addBook_sqlName+'","'+comingData.bookClass+'","'+comingData.bookAllNum+'","'+comingData.bookPublic+'","'+comingData.bookPrice+'","'+comingData.bookDes+'","'+comingData.shopperId+'");',
                sql5 = 'UPDATE shopper SET booksNum=booksNum+1 where shopper.userId="'+comingData.shopperId+'";';

            Promise.all([
              HANDLESQL(conn,sql0,function(data0){
                if(data0.toString()==""){
                  console.log('没有对应的书籍类型');
                  HANDLESQL(conn,sql1,function(){
                    console.log('已经插入对应的书籍类型');
                  })
                }
              }),
              HANDLESQL(conn,sql2,function(data2){
                console.log('看有没有出版社');
                if(data2.toString()==''){
                  console.log('没有对应的出版社');
                  let sql3 = 'INSERT INTO bookpublic(publish) VALUES("'+comingData.bookPublic+'");';
                  HANDLESQL(conn,sql3,function(data3){
                    console.log('已经插入对应的出版社');
                  })
                }
              }),
              HANDLESQL(conn,sql4,function(data4){
                console.log('书籍插入成功');
              }),
              HANDLESQL(conn,sql5,function(data5){
                console.log('shopper更新成功');
                res.send({status:'success',msg:'书籍插入成功'});
              })
            ])
            .then(() => {
              console.log('插入成功');
            })
            .catch(err => {
              console.log(err);
            })
          }
        })
        break;
      case 'editBookInfo':
        console.log(req.files[0]);
        console.log(comingData);
        let editBookInfo_str="";
        let editBookInfo_file;
        let editBookInfo_sqlimgName = '';
        let editBookInfo_imgNewName = '';
        for(let key in comingData) {
          if(key!='act'){
            editBookInfo_str +=key+'="'+comingData[key]+'",';
          }
        }
        if(req.files[0]){
          editBookInfo_file = req.files[0];
          editBookInfo_sqlimgName = editBookInfo_file.filename+pathLib.parse(editBookInfo_file.originalname).ext;
          editBookInfo_imgNewName = editBookInfo_file.path+pathLib.parse(editBookInfo_file.originalname).ext;
          fs.rename(editBookInfo_file.path,editBookInfo_imgNewName,function(err){
            if(err){
              console.log('图片修改失败');
            }else {
              console.log('图片修改成功');
              editBookInfo_str+='bookSrc="'+editBookInfo_sqlimgName+'"';
              console.log(editBookInfo_str);
              sql = "update bookinfo set "+editBookInfo_str+' where bookId="'+comingData.bookId+'";';
              console.log(sql);
              HANDLESQL(conn,sql,function(data){
                console.log('修改成功啦');
                res.send({status:'success',msg:'修改成功'});
              })
            }
          })
        }else {
          editBookInfo_str = editBookInfo_str.substr(0,editBookInfo_str.length-1);
          sql = "update bookinfo set "+editBookInfo_str+' where bookId="'+comingData.bookId+'";';
          console.log('无file：'+sql);
          HANDLESQL(conn,sql,function(data){
            console.log('修改成功啦');
            res.send({status:'success',msg:'修改成功'});
          })
        }
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
            let sql0 = 'select userName from user where tel = "'+tel+'" OR email="'+email+'";';
            conn.query(sql0,function(err,data0){
              console.log(sql0);
              if(err){
                res.send({status:'fail',msg: err.code});
              }else {
                if(data0.toString()== ""){
                  // 如果没有学校先加入学校
                  let sql1 = 'SELECT schoolName from school where schoolName="'+college+'"';
                  conn.query(sql1,function(err,data1){
                    if(err){
                      // 程序失败
                      console.log(err.sqlMessage);
                    }else {
                      if(data1.toString()==''){
                        // 没有该学校添加
                        let sql2 = 'INSERT INTO school(schoolName) VALUES("'+college+'")';
                        conn.query(sql2,function(err,data2){
                          if(err){
                            console.log('插入学校失败');
                          }else {
                            let sql3 = 'INSERT INTO user(userName,tel,email,schoolName,pass) VALUES("'+userName+'","'+tel+'","'+email+'","'+college+'","'+pass+'");'
                            conn.query(sql3,function(err,data3){
                              if(err){
                                res.send({status:'fail',msg: '注册失败'});
                                console.log(err.code);
                              }else {
                                console.log(data3.insertId);
                                let sql4 = 'INSERT INTO logintimes(userId) VALUES("'+data3.insertId+'");';
                                conn.query(sql4,function(err,data4){
                                  if(err) {
                                    console.log('err:'+err.code);
                                  }else {
                                    console.log('注册成功');
                                    res.send({status: 'success',msg: '注册成功'});
                                  }
                                })
                              }
                            })
                          }
                        })
                      }else {
                        // 有该学校
                        let sql3 = 'INSERT INTO user(userName,tel,email,schoolName,pass) VALUES("'+userName+'","'+tel+'","'+email+'","'+college+'","'+pass+'");'
                        conn.query(sql3,function(err,data3){
                          if(err){
                            res.send({status:'fail',msg: '注册失败'});
                            console.log(err.code);
                          }else {
                            console.log(data3.insertId);
                            let sql4 = 'INSERT INTO logintimes(userId) VALUES("'+data3.insertId+'");';
                            conn.query(sql4,function(err,data4){
                              if(err) {
                                console.log('err:'+err.code);
                              }else {
                                console.log('注册成功');
                                res.send({status: 'success',msg: '注册成功'});
                              }
                            })
                          }
                        })
                      }
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
                  let sql2 = 'INSERT INTO loginlog(userId) VALUES("'+userInfo.userId+'");';
                  conn.query(sql2,function(err,data2){
                    if(err){
                      console.log("err:"+err.code);
                    }else {
                      console.log('插入loginlog成功');
                      let sql3 = 'UPDATE logintimes SET loginTimes=loginTimes+1 where userId="'+userInfo.userId+'";';
                      conn.query(sql3,function(err,data3){
                        if(err){
                          console.log("err:"+err.code);
                        }else {
                          console.log('插入logintimes成功');
                          res.send({status: 'success',msg: '登录成功',user: userInfo});
                        }
                      })
                    }
                  })
                }
              }
            }
          })
          break;
        // 添加书籍评论
        case 'addBookComment':
          let addBookComment_sql0 = 'SELECT shopperId from bookinfo where bookId="'+POST.bookId+'";';
          new Promise((resolve,reject) => {
            HANDLESQL(conn,addBookComment_sql0,function(data){
              if(!data){
                reject();
              }else {
                resolve(data);
              }
            })
          })
          .then(data => {
            let shopperId = data[0].shopperId;
            sql = 'INSERT INTO ask(bookId,shopperId,askUserId,askUserName,askContent) VALUES("'+POST.bookId+'","'+shopperId+'","'+POST.askUserId+'","'+POST.askUserName+'","'+POST.askContent+'");';
            HANDLESQL(conn,sql,function(data2){
              console.log(data2);
              console.log('评论成功');
              res.send({status: 'success',msg: '评论成功',askId:data2.insertId});
            })
          })
          .catch(err => {
            console.log(err);
          })
          break;
        case 'replyBookComment':
          let replyBookComment_sql0 = 'SELECT shopperId from bookinfo where bookId="'+POST.bookId+'";';
          new Promise((resolve,reject) => {
            HANDLESQL(conn,replyBookComment_sql0,function(data){
              if(data) {
                resolve(data);
              }else {
                reject();
              }
            })
          })
          .then(data => {
            let shopperId = data[0].shopperId;
            sql = 'INSERT INTO ask(bookId,shopperId,askUserId,askUserName,askContent,toWhoId,toWhoName) VALUES("'+POST.bookId+'","'+shopperId+'","'+POST.replyId+'","'+POST.replyName+'","'+POST.replyContent+'","'+POST.toWhoId+'","'+POST.toWhoName+'");';
            HANDLESQL(conn,sql,function(data2){
              console.log('评论成功');
              res.send({status: 'success',msg: '评论成功'});
            })
          })
          .catch(err => {
            console.log(err);
          })
          break;
        case 'modifyUserInfo':
          console.log(POST);
          let modifyUserInfo_sql0 = 'UPDATE user SET userName="'+POST.nickName+'",schoolName="'+POST.college+'" where userId="'+POST.userId+'";';
              modifyUserInfo_sql2 = 'UPDATE shopper SET shopperName="'+POST.storeName+'",shopperDescribe="'+POST.storeSlogan+'" where userId="'+POST.userId+'";';
          Promise.all([
            HANDLESQL(conn,modifyUserInfo_sql0),
            HANDLESQL(conn,modifyUserInfo_sql2)
          ])
          .then(() => {
            res.send({status: 'success'});
          })
          .catch(err => {
            console.log(err);
            res.send({status:'fail',msg:'500'});
          })
          break;
        case 'sendMsg':
          let userId = POST.userId,
              msg = POST.msg;
          if(userId){
            sql = 'INSERT INTO message(userId,msg) VALUES("'+userId+'","'+msg+'");';
          }else {
            sql = 'INSERT INTO message(msg) VALUES("'+msg+'");';
          }
          HANDLESQL(conn,sql,function(){
            res.send({status:'success',msg:'感谢您的留言，小编已收到'});
          })
          break;
        case 'adminLogin':
          let adminAcount = POST.userAcount,
              adminPass = POST.userPass;
          sql = 'SELECT * FROM admin where adminAcount="'+adminAcount+'"';
          conn.query(sql,function(err,data){
            console.log(sql);
            if(err){
              console.log(err.sqlMessage);
            }else {
              let admin = data[0];
              console.log(admin);
              if(adminAcount!=admin.adminAcount) {
                let sql2 = 'INSERT INTO erroradmin(errorAcount,errorPass) VALUES("'+adminAcount+'","'+adminPass+'");';
                conn.query(sql2,function(err,data) {
                  console.log(sql2);
                  if(err) {
                    console.log('错误账号插入失败');
                    console.log(err.code);
                  }else {
                    console.log('错误账号插入成功');
                  }
                })
                res.send({status: 'fail',msg:'此管理员账号不存在'});
              }else if(adminPass!=admin.adminPass) {
                res.send({status: 'fail',msg:'密码错误'});
              }else if(adminAcount==admin.adminAcount&&adminPass==admin.adminPass){
                if(req.session['adminAcount']==null||adminAcount!=req.session['adminAcount'].substr(0,11)) {
                  console.log('还没登陆过管理员账号');
                  let newAcountNum;
                  if(admin.signal == 'superAdmin') {
                    newAcountNum = encodeURI(adminAcount+Math.floor(Math.random()*100000)+"_super");
                  }else {
                    newAcountNum = encodeURI(adminAcount+Math.floor(Math.random()*100000)+"_normal");
                  }
                  req.session['adminAcount'] = newAcountNum;
                  console.log(req.session['adminAcount']);
                }
                console.log(req.session['adminAcount']);
                res.send({status: 'success',msg:'登录成功',user: req.session['adminAcount']});
              }
            }
          })
          break;
        case 'addScreenMsg':
          if(req.session['adminAcount']) {
            console.log(req.session['adminAcount']);
            if(POST.adminAcount==req.session['adminAcount']){
              var adminA = req.session['adminAcount'];
              console.log(adminA.split('_')[1]);
              if(adminA.split('_')[1]=="super") {
                // 超级管理员
                sql = 'INSERT INTO screenmsg(msg) VALUES("'+POST.msg+'");';
                HANDLESQL(conn,sql,function(){
                  console.log('添加成功');
                  res.send({status:'success',msg: '添加成功'});
                })
              }else {
                // 普通管理员
                res.send({status: 'fail',msg: '您没有添加语录的权限，详情请查看:权限须知'});
              }
            }else {
              // 账号不对的情况
              res.send({status:'fail',msg: '您登录的账号有变，请立刻确认是否有被盗号。如非盗号，请确保不要同时登录多个账号'});
            }
          }else {
            // 没有登录或登录过期的情况
            res.send({status: 'fail',msg: '还没有登录哦，请刷新登录'});
          }
          break;
      }
    });
  }
})
server.use(expressStatic('./main'));
server.listen(8000);
