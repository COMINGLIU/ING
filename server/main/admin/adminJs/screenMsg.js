(function(window,document){
  var doc = document;
  var sreenMsg = {
    init: function(){
      this.getAjaxModule(function(ajax){
        ajax({
          url: '/',
          data: {
            act: 'getScreenMsg',
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
    // 打开add
    openAdd: function(){
      var oAddBtn = doc.querySelector('#addMsg .top'),
          oAddBtnI = doc.querySelector('#addMsg .top i'),
          oAddBox = doc.querySelector('#addMsg .bottom'),
          oAddContent = doc.querySelector('#addMsg .bottom textarea'),
          oAddSub = doc.querySelector('#addMsg .bottom input');
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
                msg: oAddContent.value
              },
              method: 'post',
              error: function(err){
                console.log(err);
              },
              success: function(res) {
                res = JSON.parse(res);
                oAddContent.value = '';
                console.log(res);
              }
            })
          })
        }
      }
    },
    getAjaxModule: function(cb){
      seajs.use('ajax.js',function(ajax){
        cb&&cb(ajax);
      })
    }
  };
  sreenMsg.init();
  sreenMsg.openAdd();
})(window,document)
