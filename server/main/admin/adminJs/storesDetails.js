(function(window,document){
  var doc = document;
  var storesDetail = {
    // 拉数据
    init: function(){
      var storeInfoUl = doc.querySelector('#content .storeInfo');
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
            // console.log(res);
            if(res.status=='success'){
              var data = res.data;
              storesDetail.readerData(data,storeInfoUl);
              storesDetail.openSlogan();
            }else {
              alert(res.msg);
            }
          }
        })
      })
    },
    // 渲染数据
    readerData: function(data,oUl){
      var frag = doc.createDocumentFragment();
      for(var i=0,len=data.length;i<len;i++) {
        var item = doc.createElement('li');
        item.innerHTML = '<ul><li>'+data[i].userId+'</li><li>'+data[i].shopperName+'</li><li>'+data[i].booksNum+'</li><li>'+data[i].userName+'</li><li>'+data[i].tel+'</li><li>'+data[i].email+'</li><li>'+data[i].shopperTime+'</li><li>'+data[i].shopperDescribe+'</li><li><i class="iconfont icon-lajixiang"></i></li></ul>';
        frag.appendChild(item);
      }
      oUl.appendChild(frag);
    },
    // 打开搜索书店
    openSearch: function(){
      var oSearchBtn = doc.getElementById('search'),
          oSearchBox = doc.getElementById('search-box'),
          oCloseSearch = doc.querySelector('#search-box .close'),
          oSearchKey = doc.getElementsByName('search-check')[0],
          oSearchValue = doc.getElementsByName('search-content')[0];
      var oSearchStoreInfoUl = doc.querySelector('#search-box .storeInfo');
      oSearchBtn.onclick = function(){
        oSearchBox.style.display = 'block';
      };
      oCloseSearch.onclick = function(){
        oSearchBox.style.display = 'none';
      };
      oSearchValue.onchange = function(){
        var aSearchStoreInfoLl = doc.querySelectorAll('#search-box .storeInfo>li');
        // 清除li
        if(aSearchStoreInfoLl.length>1) {
          for(var i=1,len=aSearchStoreInfoLl.length;i<len;i++){
            oSearchStoreInfoUl.removeChild(aSearchStoreInfoLl[i]);
          }
        }
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
              if(res.status=='success'){
                var data = res.data;
                if(data.length==0) {
                  alert('没有相应的数据');
                }
                // 渲染数据
                storesDetail.readerData(data,oSearchStoreInfoUl);
                storesDetail.openSlogan();
              }else {
                alert('err：'+res.msg);
              }
            }
          })
        })
      }
    },
    // 打开口号详情
    openSlogan: function(){
      var aLiSlogan = doc.querySelectorAll('.storeInfo>li:not(:nth-child(1))>ul li:nth-child(8)'),
          oSlogan = doc.getElementById('storeDetail'),
          oSloganContent = doc.querySelector('#storeDetail p')
          oCloseSlogan = doc.querySelector('#storeDetail .close');
      for(var i=0,len=aLiSlogan.length;i<len;i++) {
        (function(i){
          aLiSlogan[i].onclick = function(){
            oSlogan.style.display = 'block';
            oSloganContent.innerHTML = aLiSlogan[i].innerHTML;
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
        cb&&cb(ajax);
      })
    }
  };
  storesDetail.init();
  storesDetail.openSearch();
  // storesDetail.openSlogan();
  storesDetail.delStore();
  storesDetail.getAjaxModule();
})(window,document);
