(function(window,document){
  var doc = document;
  var message = {
    // 拉数据
    init: function(){
      var messageUl = doc.querySelector('#content .messageInfo');
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
            if(res.status=='success'){
              var data = res.data;
              if(data.length>0) {
                // 渲染数据
                message.renderData(data,messageUl);
                message.openMsgDetail();
              }
            }
          }
        })
      })
    },
    // 渲染数据
    renderData: function(data,oUl){
      var frag = doc.createDocumentFragment();
      for(var i=0,len=data.length;i<len;i++) {
        var item = doc.createElement('li');
        item.innerHTML = '<ul><li>'+data[i].userId+'</li><li>'+data[i].userName+'</li><li>'+data[i].msgTime+'</li><li>'+data[i].msg+'</li><li><i class="iconfont icon-wodefankui"></i></li></ul>';
        frag.appendChild(item);
      }
      oUl.appendChild(frag);
    },
    // 打开留言详情
    openMsgDetail: function(){
      var aMsgLi = doc.querySelectorAll('.messageInfo>li:not(:nth-child(1))>ul li:nth-last-child(2)'),
          oMessageDetailBox = doc.getElementById('msgDetail'),
          oMessageDetailContent = doc.querySelector('#msgDetail p'),
          oCloseMessage = doc.querySelector('#msgDetail .close');
      for(var i=0,len=aMsgLi.length;i<len;i++) {
        (function(i){
          aMsgLi[i].onclick = function(){
            oMessageDetailBox.style.display = 'block';
            oMessageDetailContent.innerHTML = aMsgLi[i].innerHTML;
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
  // message.openMsgDetail();
  message.init();
})(window,document)
