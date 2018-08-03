(function(window,document){
  var doc = document;
  var UsersDetails = {
    // 打开搜索
    openSearch: function(){
      var oSearchBtn = doc.getElementById('search'),
          oSearchBox = doc.getElementById('search-box'),
          oCloseSearch = oSearchBox.getElementsByClassName('close')[0];
      oSearchBtn.onclick = function(){
        oSearchBox.style.display = 'block';
      };
      oCloseSearch.onclick = function(){
        oSearchBox.style.display = 'none';
      }
    },
    // 打开书籍收藏列表
    openBookList: function(){
      var aLiBtns = doc.querySelectorAll('#content .userInfo>li:not(:nth-child(1))>ul li:nth-child(7)'),
          oBookListBox = doc.getElementById('book-list'),
          oCloseBookList = doc.querySelector("#book-list .close"),
          aBookDelBtn = doc.querySelectorAll('#book-list .userInfo>li:not(:nth-child(1))>ul li:last-child');
      for(var i=0,len=aLiBtns.length;i<len;i++) {
        (function(i){
          aLiBtns[i].onclick = function(){
            oBookListBox.style.display = 'block';
          };
        })(i);
      }
      oCloseBookList.onclick =function(){
        oBookListBox.style.display = 'none';
      };
      for(var j=0,len2=aBookDelBtn.length;j<len2;j++) {
        (function(j){
          aBookDelBtn[j].onclick = function(){
            console.log(1);
            var con = confirm('确认删除吗');
            if(con) {

            }else {

            }
          }
        })(j)
      }
    },
    // 打开书店收藏列表
    openStoreList: function(){
      var oLiBtns = doc.querySelectorAll('#content .userInfo>li:not(:nth-child(1))>ul li:nth-child(8)'),
          oStoreListBox = doc.getElementById('stores-list'),
          oCloseBookList = doc.querySelector('#stores-list .close'),
          aStoreDelBtn = doc.querySelectorAll('#stores-list .userInfo>li:not(:nth-child(1))>ul li:last-child');
      for(var i=0,len=oLiBtns.length;i<len;i++) {
        (function(i){
          oLiBtns[i].onclick = function(){
            oStoreListBox.style.display = 'block';
          }
        })(i)
        oCloseBookList.onclick = function(){
          oStoreListBox.style.display = 'none';
        };
        for(var j=0,len2=aStoreDelBtn.length;j<len2;j++) {
          (function(j){
            aStoreDelBtn[j].onclick = function(){
              console.log(1);
              var con = confirm('确认删除吗');
              if(con) {

              }else {

              }
            }
          })(j)
        }
      }
    }
  };
  UsersDetails.openSearch();
  UsersDetails.openBookList();
  UsersDetails.openStoreList();
})(window,document);
