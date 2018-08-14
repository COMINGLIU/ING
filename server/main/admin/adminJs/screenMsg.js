(function(window,document){
  var doc = document;
  var sreenMsg = {
    init: function(){
      var oMsgUl = doc.querySelector('#content ul');
      this.getAjaxModule(function(ajax){
        ajax({
          url: '/',
          data: {
            act: 'getScreenMsg',
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
                sreenMsg.renderData(data,oMsgUl);
                sreenMsg.openAdd(data);
                sreenMsg.delMsg(data);
              }
            }else {
              alert('err:'+res.msg);
            }
          }
        })
      })
    },
    renderData: function(data,oUl){
      var frag =  doc.createDocumentFragment();
      for(var i=0,len=data.length;i<len;i++){
        var item = doc.createElement('li');
        item.innerHTML = '<div class="msg">'+data[i].msg+'</div><div class="time">'+data[i].msgTime+'<i class="iconfont icon-lajixiang"></i></div>';
        frag.appendChild(item);
      }
      oUl.appendChild(frag);
    },
    // 打开add
    openAdd: function(data){
      var oAddBtn = doc.querySelector('#addMsg .top'),
          oAddBtnI = doc.querySelector('#addMsg .top i'),
          oAddBox = doc.querySelector('#addMsg .bottom'),
          oAddContent = doc.querySelector('#addMsg .bottom textarea'),
          oAddSub = doc.querySelector('#addMsg .bottom input');
      var oMsgUl = doc.querySelector('#content ul');
      var count1 = 0;
      var count2 = 0;
      oAddBtn.onclick = function(){
        count1++;
        if(count1%2==1) {
          oAddBox.style.height = '135px';
        }else {
          oAddBox.style.height = '0';
        }
      };
      oAddBtnI.onclick = function(){
        if(count2%2==1) {
          oAddBox.style.height = '135px';
        }else {
          oAddBox.style.height = '0';
        }
      };
      oAddSub.onclick = function(){
        if(oAddContent.value!="") {
          sreenMsg.getAjaxModule(function(ajax){
            ajax({
              url: '/',
              data: {
                act: 'addScreenMsg',
                msg: oAddContent.value,
                adminAcount: window.sessionStorage.getItem('adminUser')
              },
              method: 'post',
              error: function(err){
                console.log(err);
              },
              success: function(res) {
                res = JSON.parse(res);
                console.log(res);
                if(res.status=='success'){
                  sreenMsg.openHintInfo("添加成功");
                  var item = doc.createElement('li');
                  item.innerHTML = '<div class="msg">'+oAddContent.value+'</div><div class="time">'+sreenMsg.getNowTime()+'<i class="iconfont icon-lajixiang"></i></div>';
                  oMsgUl.appendChild(item);
                  oAddContent.value = '';
                  // 添加删除事件
                  sreenMsg.delMsg(data);
                }else {
                  alert(res.msg);
                }
              }
            })
          })
        }
      }
    },
    delMsg: function(data,oUl,oDelLi){
      var aDelBtn = doc.getElementsByClassName('icon-lajixiang');
      var oMsgUl = doc.querySelector('#content ul');
      var aMsgLi = oMsgUl.getElementsByTagName('li');
      for(var i=0,len=aDelBtn.length;i<len;i++) {
        (function(i){
          aDelBtn[i].onclick = function(){
            var con = confirm('确认删除吗');
            if(con) {
              // 执行删除
              sreenMsg.getAjaxModule(function(ajax){
                ajax({
                  url: '/',
                  data: {
                    act: 'delScreenMsg',
                    msgId: data[i].msgId,
                    adminAcount: window.sessionStorage.getItem('adminUser')
                  },
                  method: 'get',
                  error: function(err){
                    alert('err:'+err);
                  },
                  success: function(res){
                    res = JSON.parse(res);
                    console.log(res);
                    if(res.status=='success'){
                      sreenMsg.openHintInfo('删除成功');
                      oMsgUl.removeChild(aMsgLi[i]);
                    }else {
                      alert(res.msg);
                    }
                  }
                })
              })
            }
          }
        })(i)
      }
    },
    getAjaxModule: function(cb){
      seajs.use('ajax.js',function(ajax){
        cb&&cb(ajax);
      })
    },
    openHintInfo: function(item){
      var oHintInfo = doc.getElementById('hintInfo');
      oHintInfo.innerHTML = item;
      oHintInfo.style.opacity = 1;
      var timer = setTimeout(function(){
        oHintInfo.style.opacity = 0;
        clearTimeout(timer);
      },1500)
    },
    getNowTime: function(){
      var TIME = '';
      var date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth()+1,
          day = date.getDate(),
          hours = date.getHours(),
          minutes = date.getMinutes(),
          seconds = date.getSeconds();
      TIME = year+'-'+month+'-'+day+' '+hours+'-'+minutes+'-'+seconds;
      return TIME;
    }
  };
  sreenMsg.init();

})(window,document)
