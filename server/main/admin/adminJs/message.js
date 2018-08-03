(function(window,document){
  var doc = document;
  var message = {
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
    }
  };
  message.openMsgDetail();
})(window,document)
