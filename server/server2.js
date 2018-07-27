const http = require('http');
const fs = require('fs');
const queryString = require('querystring');
const urlLib = require('url');

http.createServer(function(req,res){
  var str = '';
  req.on('data',function(data){
    str+=data;
  })
  req.on('end',function(){
    console.log(str);
    // 接收到post数据并解析为json格式
    const POST = queryString.parse(str);
    //
    var obj = urlLib.parse(req.url,true);
    console.log(obj);
    const url = obj.pathname;
    const GET = obj.query;
    console.log(GET,POST);
    // 无法读取所有文件
    fs.readFile('./main/index.html',function(err,data){
      if(err){
        res.writeHead(404,{'ContentType':'text/html'});
        console.log('404');
      }else {
        res.writeHead(200,{'Content-Type':'text/html'});
        // console.log(data.toString());
        res.write(data.toString());
      }
      res.end();
    })
  })
}).listen(8080);
