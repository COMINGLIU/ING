const mysql = require('mysql');
const conn  = mysql.createConnection({
  hostname: 'localhost',
  user: 'root',
  password: 'kkxxdgmyt67LIUQIONG',
  database: 'bookstore'
});
let Data = {
  index: function (sql,callback){
    conn.query(sql,function(err,data){
      console.log('sql语句'+sql);
      if(err){
        console.log('出错啦'+err);
      }else {
          callback&&callback(data);
      }
    })
  },
}
module.exports = Data;
