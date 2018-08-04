(function(window,document){
  var doc = document;
  var bookManage = {
    // 拉数据
    init: function(){
      this.getAjaxModule(function(ajax){
        ajax({
          url: '/',
          data: {
            act: "getBookInfo",
            adminAcount: window.sessionStorage.getItem('adminUser')
          },
          method: 'get',
          error: function(err){
            console.log('err:'+err);
          },
          success: function(res){
            res = JSON.parse(res);
            console.log(res);
          }
        })
      })
    },
    // 打开搜索书店
    openSearch: function(){
      var oSearchBtn = doc.getElementById('search'),
          oSearchBox = doc.getElementById('search-box'),
          oCloseSearch = doc.querySelector('#search-box .close'),
          oSearchKey = doc.getElementsByName('search-check')[0],
          oSearchValue = doc.getElementsByName('search-content')[0];
      oSearchBtn.onclick = function(){
        oSearchBox.style.display = 'block';
      };
      oCloseSearch.onclick = function(){
        oSearchBox.style.display = 'none';
      };
      oSearchValue.onchange = function(){
        bookManage.getAjaxModule(function(ajax){
          ajax({
            url: '/',
            data: {
              act: 'searchBookInfo',
              searchKey: oSearchKey.value,
              searchValue: oSearchValue.value
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
      }
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
          aDelBookId = doc.querySelectorAll('.bookInfo>li:not(:nth-child(1))>ul li:nth-child(1)');
      for(var i=0,len=aDelBtn.length;i<len;i++) {
        (function(i){
          aDelBtn[i].onclick = function(){
            var con = confirm('确认删除该书籍吗?');
            if(con) {
              // 删除书店操作
              bookManage.getAjaxModule(function(ajax){
                ajax({
                  url: '/',
                  data: {
                    act: 'delSomeBook',
                    bookId: aDelBookId[i].innerHTML
                  },
                  method: 'get',
                  error: function(err){
                    console.log("err:"+err);
                  },
                  success: function(res){
                    res = JSON.parse(res);
                    console.log(res);
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
    }
  };
  bookManage.init();
  bookManage.openSearch();
  bookManage.openBookDetail();
  bookManage.delBook();
})(window,document);
