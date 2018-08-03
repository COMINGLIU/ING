(function(window,document){
  var doc = document;
  var sreenMsg = {
    openAdd: function(){
      var oAddBtn = doc.querySelector('#addMsg .top'),
          oAddBtnI = doc.querySelector('#addMsg .top i'),
          oAddBox = doc.querySelector('#addMsg .bottom');
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
    }
  };
  sreenMsg.openAdd();
})(window,document)
