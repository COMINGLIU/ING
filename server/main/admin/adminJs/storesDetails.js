(function(window,document){
  var doc = document;
  var storesDetail = {
    // 拉数据
    init: function(){
      console.log()
      storesDetail.getAjaxModule(function(ajax){
        ajax({
          url: '/',
          data: {
            act: 'getStoresInfo',
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
        storesDetail.getAjaxModule(function(ajax){
          ajax({
            url: '/',
            data: {
              act: 'serchStoreInfo',
              searchKey: oSearchKey.value,
              searchValue: oSearchValue.value
            },
            method: 'get',
            error: function(err) {
              console.log('err:'+err);
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
      var aStoreId = doc.querySelectorAll('.storeInfo>li:not(:nth-child(1))>ul li:nth-child(1)');
      for(var i=0,len=aDelBtn.length;i<len;i++) {
        (function(i){
          aDelBtn[i].onclick = function(){
            var con = confirm('确认删除该书店吗?');
            if(con) {
              // 删除书店操作
              storesDetail.getAjaxModule(function(ajax){
                ajax({
                  url: '/',
                  data: {
                    act: 'delStore',
                    storeId: aStoreId[i].innerHTML
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
          }
        })(i)
      }
    },
    getAjaxModule: function(cb){
      seajs.use('ajax.js',function(ajax){
        console.log(ajax);
        cb&&cb(ajax);
      })
    }
  };
  storesDetail.init();
  storesDetail.openSearch();
  storesDetail.openSlogan();
  storesDetail.delStore();
  storesDetail.getAjaxModule();
})(window,document);
