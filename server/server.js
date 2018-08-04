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

const storeInfoMulter = multer({dest: './main/imgs/storeImg'});
const server = express();
const conn  = mysql.createConnection({
  hostname: 'localhost',
  user: 'root',
  password: 'kkxxdgmyt67LIUQIONG',
  database: 'bookstore'
});
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
  //设置response编码为utf-8
  // res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
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
          let sql2 = 'SELECT booklike.*,bookinfo.bookId,bookinfo.bookSrc,bookinfo.bookName FROM booklike,bookinfo where userId="'+userId+'" and likeType="书籍" and booklike.bookId=bookinfo.bookId;';
          conn.query(sql2,function(err,data2){
            if(err){
              console.log(err.code);
              console.log('data2错了');
            }else {
              console.log('data2')
              console.log(data2);
              like_books = data2;
              let sql3 = 'SELECT booklike.*,shopper.shopperImg,shopper.shopperName FROM booklike,shopper where booklike.userId="'+userId+'" and likeType="店铺" and booklike.userId=shopper.userId';
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
            conn.query(sql,function(err,data){
              if(err){
                console.log(err.sqlMessage);
              }else {
                console.log('成功');
                console.log(data);
                res.send({status: 'success',data: data});
              }
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
    // 用户收藏的书籍
    case 'getBookLikes':
      sql = 'select bookName,bookPublic,bookType,bookPrice,bookAllNum,bookTime from bookinfo where bookId in(select bookId from booklike where userId = "'+reqUrl.userId+'" and likeType="书籍");'
      conn.query(sql,function(err,data){
        if(err){
          console.log(err.sqlMessage);
        }else {
          console.log(data);
          res.send({status:'success',data:data});
        }
      })
      break;
    case 'getStoreLikes':
      sql = 'select shopperName,shopperDescribe,booksNum,shopperTime from shopper where userId in(select storeId from booklike where userId = "'+reqUrl.userId+'" and likeType="店铺");'
      conn.query(sql,function(err,data){
        if(err){
          console.log('error:'+err.sqlMessage);
        }else {
          console.log(data);
          res.send({status:'success',data:data});
        }
      })
      break;
    case 'searchUserInfo':
      let book_key = reqUrl.searchKey,
          book_value = reqUrl.searchValue,
          book_sqlKey;
      switch(book_key) {
        case '用户ID':
          book_sqlKey='shopper.userId';
          break;
        case '店名':
          book_sqlKey = 'shopper.shopperName';
          break;
        case '店长昵称':
          book_sqlKey = 'shopper.shopperDescribe';
          break;
        case '电话':
          book_sqlKey = 'user.tel';
          break;
        case '邮箱':
          book_sqlKey = 'user.email';
          break;
      }
      sql = 'select user.*,logintimes.loginTimes,logintimes.userScore from user,logintimes where user.userId=logintimes.userId and user.'+book_sqlKey+'="'+book_value+'";'
      conn.query(sql,function(err,data){
        console.log(sql);
        if(err){
          console.log("err:"+err);
        }else {
          console.log(data);
          res.send({status:'success',data:data});
        }
      })
      break;
    case 'getStoresInfo':
      if(req.session['adminAcount']) {
        if(reqUrl.adminAcount==req.session['adminAcount']){
          console.log(req.session['adminAcount']);
          var adminA = req.session['adminAcount'];
          console.log(adminA.split('_')[1]);
          if(adminA.split('_')[1]=="super") {
            // 超级管理员
            sql = 'select shopper.userId,shopper.shopperName,shopper.booksNum,user.userName,user.tel,user.email,shopper.shopperTime,shopper.shopperDescribe from user,shopper where user.userId=shopper.userId;';
            conn.query(sql,function(err,data){
              if(err){
                console.log('err:'+err.sqlMessage);
              }else {
                console.log(data);
                res.send({status: 'success',data: data});
              }
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
          store_sqlKey = 'shopper.shopperDescribe';
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
      conn.query(sql,function(err,data){
        console.log(sql);
        if(err){
          console.log(err.sqlMessage);
        }else {
          console.log(data);
          res.send({status: 'success',data: data});
        }
      })
      break;
    // 删除某个书店
    case 'delStore':
      sql = 'delete from shopper where userId="'+reqUrl.storeId+'";';
      conn.query(sql,function(err,data){
        if(err){
          console.log(err.sqlMessage);
        }else {
          console.log(data);
          res.send({status:'success',msg: '删除成功'});
        }
      })
      break;
  }
})
server.post(bodyParser.urlencoded({extended: true}));
server.post('/',function(req,res){
  //设置response编码为utf-8
  // res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
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
                let sql2 = "UPDATE user SET user.isSeller='1' where user.userId='"+comingData.userId+"';";
                conn.query(sql2,function(err,data2){
                  if(err){
                    console.log('更新店铺信息失败');
                  }else {
                    res.send({status:'success'});
                    console.log('上传成功');
                  }
                })
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
                  conn.query(sql0,function(err,data1){
                    if(err){
                      // 程序失败
                      console.log(err.code);
                    }else {
                      sql = 'INSERT INTO user(userName,tel,email,schoolName,pass) VALUES("'+userName+'","'+tel+'","'+email+'","'+college+'","'+pass+'");'
                      conn.query(sql,function(err,data2){
                        if(err){
                          res.send({status:'fail',msg: '注册失败'});
                          console.log(err.code);
                        }else {
                          console.log(data2.insertId);
                          let sql2 = 'INSERT INTO logintimes(userId) VALUES("'+data2.insertId+'");';
                          conn.query(sql2,function(err,data3){
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
                  conn.query(sql2,function(err,data){
                    if(err){
                      console.log("err:"+err.code);
                    }else {
                      console.log('插入loginlog成功');
                      let sql3 = 'UPDATE logintimes SET loginTimes=loginTimes+1 where userId="'+userInfo.userId+'";';
                      conn.query(sql3,function(err,data){
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
        case 'sendMsg':
          let userId = POST.userId,
              msg = POST.msg;
          sql = 'INSERT INTO message(userId,msg) VALUES("'+userId+'","'+msg+'");';
          conn.query(sql,function(err,data){
            if(err){
              console.log('err:'+err.code);
            }else {
              res.send({status:'success',msg:'感谢您的留言，小编已收到'});
            }
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
                }
                console.log(req.session['adminAcount']);
                res.send({status: 'success',msg:'登录成功',user: req.session['adminAcount']});
              }
            }
          })
          break;
      }
    });
  }
})
server.use(expressStatic('./main'));
server.listen(8080);
