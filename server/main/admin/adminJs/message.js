(function(window,document){
  var doc = document;
  var message = {
    // 拉数据
    init: function(){
      this.getAjaxModule(function(ajax){
        ajax({
          url: '/',
          data: {
            act: 'getMessageNote',
            adminAcount: window.sessionStorage.getItem('adminUser')
          },
          method: 'get',
          error: function(err){
            console.log(err);
          },
          success: function(res){
            res = JSON.parse(res);
            console.log(res);
          }
        })
      })
    },
    // 打开评论详情
    openMsgDetail: function(){
      var aMsgLi = doc.querySelectorAll('.messageInfo>li:not(:nth-child(1))>ul li:nth-last-child(2)'),
          oMessageDetailBox = doc.getElementById('msgDetail'),
          oCloseMessage = doc.querySelector('#msgDetail .close');
      for(var i=0,len=aMsgLi.length;i<len;i++) {
        (function(i){
          aMsgLi[i].onclick = function(){
            oMessageDetailBox.style.display = 'block';
          };
        })(i)
      }
      oCloseMessage.onclick = function() {
        oMessageDetailBox.style.display = 'none';
      }
    },
    getAjaxModule: function(cb){
      seajs.use('ajax.js',function(ajax){
        cb&&cb(ajax);
      })
    }
  };
  message.openMsgDetail();
  message.init();
})(window,document)
