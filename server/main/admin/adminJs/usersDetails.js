(function(window,document){
  var doc = document;
  var UsersDetails = {
    // 请求数据
    init: function(){
      this.getAjaxModule(function(ajax){
        ajax({
          url: '/',
          data: {
            act: 'getUserDetailData',
            adminAcount: window.sessionStorage.getItem('adminUser')
          },
          method: 'get',
          error: function(err) {
            alert('error:'+err);
          },
          success: function(res){
            res = JSON.parse(res);
            console.log(res);
          }
        })
      })
    },
    // 打开搜索
    openSearch: function(){
      var oSearchBtn = doc.getElementById('search'),
          oSearchBox = doc.getElementById('search-box'),
          oCloseSearch = oSearchBox.getElementsByClassName('close')[0],
          oSelect = doc.getElementsByName('search-check')[0],
          oSearchContent = doc.getElementsByName('search-content')[0];
      oSearchBtn.onclick = function(){
        oSearchBox.style.display = 'block';
      };
      oCloseSearch.onclick = function(){
        oSearchBox.style.display = 'none';
      };
      oSearchContent.onchange = function(){
        UsersDetails.getAjaxModule(function(ajax){
          ajax({
            url: '/',
            data: {
              act: 'searchUserInfo',
              searchKey: oSelect.value,
              searchValue: oSearchContent.value
            },
            method: 'get',
            error: function(err){
              alert('error:'+err);
            },
            success: function(res){
              res = JSON.parse(res);
              console.log(res);
            }
          })
        })
      }
    },
    // 打开书籍收藏列表
    openBookList: function(){
      var aLiBtns = doc.querySelectorAll('.userInfo>li:not(:nth-child(1))'),
          aLiUserId = doc.querySelectorAll('.userInfo>li:not(:nth-child(1))>ul li:nth-child(1)'),
          oBookListBox = doc.getElementById('book-list'),
          oCloseBookList = doc.querySelector("#book-list .close");
      for(var i=0,len=aLiBtns.length;i<len;i++) {
        (function(i){
          aLiBtns[i].onclick = function(){
            oBookListBox.style.display = 'block';
            UsersDetails.getAjaxModule(function(ajax){
              ajax({
                url: '/',
                data: {
                  act: 'getBookLikes',
                  adminAcount: window.sessionStorage.getItem('adminUser'),
                  userId: aLiUserId[i].innerHTML
                },
                method: 'get',
                error: function(err){
                  alert('err:'+err);
                },
                success: function(res){
                  res = JSON.parse(res);
                  console.log(res);
                }
              })
            })
          };
        })(i);
      }
      oCloseBookList.onclick =function(){
        oBookListBox.style.display = 'none';
      };
    },
    // 打开书店收藏列表
    openStoreList: function(){
      var oStoreOpen = doc.querySelector('#book-list .head i'),
          oUserId = doc.querySelector('#book-list .userName .userId span'),
          oStoreListBox = doc.getElementById('stores-list'),
          oCloseStoreList = doc.querySelector('#stores-list .close');
      oStoreOpen.onclick = function(){
        oStoreListBox.style.display = 'block';
        UsersDetails.getAjaxModule(function(ajax){
          ajax({
            url: '/',
            data: {
              act: 'getStoreLikes',
              adminAcount: window.sessionStorage.getItem('adminUser'),
              userId: oUserId.innerHTML
            },
            method: 'get',
            error: function(error){
              alert('error:'+error);
            },
            success: function(res){
              res = JSON.parse(res);
              console.log(res);
            }
          })
        })
      }
      oCloseStoreList.onclick = function(){
        oStoreListBox.style.display = 'none';
      };
    },
    // 打开用户登录详情
    openLoginStatus: function(){
      var aLiBtn = doc.querySelectorAll('.userInfo>li:not(:nth-child(1))>ul li:nth-child(7)'),
          oLoginStatusBox = doc.getElementById('login-status'),
          oCloseLoginStatus =  doc.querySelector('#login-status .close');
      for(var i=0,len=aLiBtn.length;i<len;i++){
        (function(i){
          aLiBtn[i].onclick = function(e){
            e = e||window.e;
            e.stopPropagation?e.stopPropagation():e.cancelBubble = true;
            oLoginStatusBox.style.display = 'block';
          };
        })(i)
      }
      oCloseLoginStatus.onclick = function(){
        oLoginStatusBox.style.display = 'none';
      }
    },
    getAjaxModule: function(cb){
      seajs.use('ajax.js',function(ajax){
        cb&&cb(ajax);
      })
    }
  };
  UsersDetails.init();
  UsersDetails.openSearch();
  UsersDetails.openBookList();
  UsersDetails.openStoreList();
  UsersDetails.openLoginStatus();
})(window,document);
