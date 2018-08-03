(function(window,document){
  var doc = document;
  var bookManage = {
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
    openBookDetail: function(){
      var aLiBookDes = doc.querySelectorAll('.bookInfo>li:not(:nth-child(1))>ul li:nth-child(8)'),
          oBookDetail = doc.getElementById('bookDetail'),
          oCloseBookDetail = doc.querySelector('#bookDetail .close');
      console.log(aLiBookDes);
      console.log(oBookDetail);
      console.log(oCloseBookDetail);
      for(var i=0,len=aLiBookDes.length;i<len;i++) {
        (function(i){
          aLiBookDes[i].onclick = function(){
            oBookDetail.style.display = 'block';
          }
        })(i)
      }
      oCloseBookDetail.onclick = function(){
        oBookDetail.style.display = 'none';
      }
    },
    // 删除店铺
    delBook: function(){
      var aDelBtn = doc.querySelectorAll('.bookInfo>li:not(:nth-child(1))>ul li:nth-child(9)');
      for(var i=0,len=aDelBtn.length;i<len;i++) {
        (function(i){
          aDelBtn[i].onclick = function(){
            var con = confirm('确认删除该书籍吗?');
            if(con) {
              // 删除书店操作
            }
          }
        })(i)
      }
    }
  };
  bookManage.openSearch();
  bookManage.openBookDetail();
  bookManage.delBook();
})(window,document);
