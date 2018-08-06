define(function(require,exporst,module){
  var doc = document;
  var footer = {
    sendMsg: function(){
      var textArea = doc.querySelector('#message textArea'),
          sendBtn = doc.querySelector('#message button');
      var user = JSON.parse(footer.getCookieModule().get('user'));
      var userId;
      var preventSqlWords = /select|insert|update|delete|exec|script|count|'|"|=|<|>|%/i;
      if(user){
        console.log(user);
        userId = user.userId;
      }else {
        userId= "";
      }
      sendBtn.onclick = function(){
        if(textArea.value!=="") {
          if(preventSqlWords.test(textArea.value)) {
            var con = confirm('小样，好好写！');
            if(con){
              textArea.value = '';
            }
          }else {
            footer.getAjaxModule(function(ajax){
              ajax({
                url: '/',
                data: {
                  act: 'sendMsg',
                  userId: userId,
                  msg: textArea.value
                },
                method: 'post',
                error: function(status){
                  confirm('小编没有收到您的留言，请稍候重试');
                },
                success: function(res){
                  res = JSON.parse(res);
                  if(res.status == 'success') {
                    alert(res.msg);
                    textArea.value = '';
                  }else {
                    confirm('小编没有收到您的留言，请稍候重试');
                  }
                }
              })
            })
          }
        }
      }
    },
    getAjaxModule: function(cb){
      var ajax = require('ajax.js');
      cb&&cb(ajax);
    },
    getCookieModule: function(){
      var cookie = require('cookie.js');
      return cookie;
    }
  }
  footer.sendMsg();
})
