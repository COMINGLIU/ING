(function(window,document){
  var doc = document;
  var UsersDetails = {
    // 请求数据
    init: function(){
      var userInfoUl = doc.querySelector('#content .userInfo');

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
            if(res.status=='success'){
              // 渲染数据
              var data = res.data;
              if(data.length==0) {
                alert('没有对应的数据');
              }else {
                UsersDetails.readerUserData(data,userInfoUl);
                UsersDetails.openBookList();
              }
            }else{
              alert(res.msg);
            }
          }
        })
      })
    },
    //渲染数据
    readerUserData: function(data,userInfoUl){
      var frag = doc.createDocumentFragment();
      for(var i=0,len=data.length;i<len;i++) {
        var item = doc.createElement('li');
        item.innerHTML = "<ul><li>"+data[i].userId+"</li><li>"+data[i].userName+"</li><li>"+data[i].tel+"</li><li>"+data[i].email+"</li><li>"+data[i].schoolName+"</li><li>"+data[i].registTime+"</li><li>"+data[i].loginTimes+"</li><li>"+data[i].userScore+"</li></ul>";
        frag.appendChild(item);
      }
      userInfoUl.appendChild(frag);
    },
    readerBookLikeData: function(data,oUl,oNum){
      oNum.innerHTML = data.length;
      var frag = doc.createDocumentFragment();
      for(var i=0,len=data.length;i<len;i++) {
        var item = doc.createElement('li');
        item.innerHTML = '<ul><li>'+data[i].bookName+'</li><li>'+data[i].bookPublic+'</li><li>'+data[i].bookPublic+'</li><li>'+data[i].bookPrice+'</li><li>'+data[i].bookAllNum+'</li><li>'+data[i].bookTime+'</li></ul>';
        frag.appendChild(item);
      }
      oUl.appendChild(frag);
    },
    readerStoreLikeData: function(data,oUl,oNum){
      oNum.innerHTML = data.length;
      var frag = doc.createDocumentFragment();
      for(var i=0,len=data.length;i<len;i++) {
        var item = doc.createElement('li');
        item.innerHTML = '<ul><li>'+data[i].shopperName+'</li><li>'+data[i].shopperDescribe+'</li><li>'+data[i].booksNum+'</li><li>'+data[i].shopperTime+'</li></ul>';
        frag.appendChild(item);
      }
      oUl.appendChild(frag);
    },
    // 打开搜索
    openSearch: function(){
      var oSearchBtn = doc.getElementById('search'),
          oSearchBox = doc.getElementById('search-box'),
          oCloseSearch = oSearchBox.getElementsByClassName('close')[0],
          oSelect = doc.getElementsByName('search-check')[0],
          oSearchContent = doc.getElementsByName('search-content')[0];
      var oSearchUserUl = doc.querySelector('#search-box .userInfo');
      oSearchBtn.onclick = function(){
        oSearchBox.style.display = 'block';
      };
      oCloseSearch.onclick = function(){
        oSearchBox.style.display = 'none';
      };
      oSearchContent.onchange = function(){
        var aSearchUserLi = doc.querySelectorAll('#search-box .userInfo>li');
        if(aSearchUserLi.length>0){
          for(var i=1,len=aSearchUserLi.length;i<len;i++){
            oSearchUserUl.removeChild(aSearchUserLi[i]);
          }
        }
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
              if(res.status=='success'){
                var data= res.data;
                if(data.length==0){
                  UsersDetails.openHintInfo();
                }else{
                  // 渲染数据
                  UsersDetails.readerUserData(data,oSearchUserUl);
                  UsersDetails.openBookList();
                }
              }else {
                alert('err:'+res.msg);
              }
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
      var oBookLikeUl = doc.querySelector('#book-list .userInfo');
      var userInfoNum = doc.querySelector('#book-list .head span');
      for(var i=0,len=aLiBtns.length;i<len;i++) {
        (function(i){
          aLiBtns[i].onclick = function(){
            oBookListBox.style.display = 'block';
            var aBookLikeList = oBookLikeUl.querySelectorAll('#book-list .userInfo>li');
            if(aBookLikeList.length>0) {
              for(var i=1,len=aBookLikeList.length;i<len;i++) {
                oBookLikeUl.removeChild(aBookLikeList[i]);
              }
            }
            userInfoNum.innerHTML = '0';
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
                  if(res.status=='success'){
                    var data = res.data;
                    if(data.length==0) {
                      UsersDetails.openHintInfo();
                    }else {
                      // 渲染数据
                      UsersDetails.readerBookLikeData(data,oBookLikeUl,userInfoNum);
                    }
                  }else {
                    alert('err:'+err);
                  }
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
      var oStoreLikeUl = doc.querySelector('#stores-list .userInfo');
      var oStoreLikeNum = doc.querySelector('#stores-list .head span');
      oStoreOpen.onclick = function(){
        oStoreListBox.style.display = 'block';
        var aStoreList = oStoreLikeUl.getElementsByTagName('li');
        if(aStoreList.lenghth>1) {
          for(var i=1,len=aStoreList.length;i<len;i++) {
            oStoreLikeUl.removeChild(aStoreList[i]);
          }
        }
        oStoreLikeNum.innerHTML = '0';
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
              if(res.status=='success'){
                var data = res.data;
                if(data.length==0) {
                  UsersDetails.openHintInfo();
                }else {
                  // 渲染数据
                  UsersDetails.readerStoreLikeData(data,oStoreLikeUl,oStoreLikeNum);
                }
              }else {
                alert('err:'+res.msg);
              }
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
    },
    openHintInfo: function(){
      var oHintInfo = doc.getElementById('hintInfo');
      console.log(oHintInfo);
      oHintInfo.style.opacity = 1;
      var timer = setTimeout(function(){
        oHintInfo.style.opacity = 0;
        clearTimeout(timer);
      },1500)
    }
  };
  UsersDetails.init();
  UsersDetails.openSearch();
  // UsersDetails.openBookList();
  UsersDetails.openStoreList();
  UsersDetails.openLoginStatus();
})(window,document);
