(function(window,document){
  var doc = document;
  var storesDetail = {
    // 打开搜索书店
    openSearch: function(){
      var oSearchBtn = doc.getElementById('search'),
          oSearchBox = doc.getElementById('search-box'),
          oCloseSearch = doc.querySelector('#search-box .close');
      oSearchBtn.onclick = function(){
        oSearchBox.style.display = 'block';
      };
      oCloseSearch.onclick = function(){
        oSearchBox.style.display = 'none';
      };
    },
    // 打开口号详情
    openSlogan: function(){
      var aLiSlogan = doc.querySelectorAll('.storeInfo>li:not(:nth-child(1))>ul li:nth-child(8)'),
          oSlogan = doc.getElementById('storeDetail'),
          oCloseSlogan = doc.querySelector('#storeDetail .close');
      console.log(aLiSlogan);
      for(var i=0,len=aLiSlogan.length;i<len;i++) {
        (function(i){
          aLiSlogan[i].onclick = function(){
            oSlogan.style.display = 'block';
          }
        })(i)
      }
      oCloseSlogan.onclick = function(){
        oSlogan.style.display = 'none';
      }
    },
    // 删除店铺
    delStore: function(){
      var aDelBtn = doc.querySelectorAll('.storeInfo>li:not(:nth-child(1))>ul li:nth-child(9)');
      for(var i=0,len=aDelBtn.length;i<len;i++) {
        (function(i){
          aDelBtn[i].onclick = function(){
            var con = confirm('确认删除该书店吗?');
            if(con) {
              // 删除书店操作
            }
          }
        })(i)
      }
    }
  };
  storesDetail.openSearch();
  storesDetail.openSlogan();
  storesDetail.delStore();
})(window,document);
