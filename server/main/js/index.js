(function(document,window){
  var doc = document;
  var like_n=0;
  var likeBookList =[];
  var user;
  // prototype.getCookieModule().get('user'));

  // window.sessionStorage.setItem('likeBooks','');存放收藏的书籍id
  Object.defineProperty(Index.prototype,'constructor',{
    enumerable: false,
    value: Index
  })
  function Index() {
    this.init();
    // 执行header模块里边的函数
    this.getHeaderModule();
    // 执行footer模块里边的函数
    this.getFooterModule();
    // 控制收藏处
    // this.controLike();
    // 获取add-store处的方法并执行
    this.getAddStoreModule();
    // 获取cookie模块
    // this.getCookieModule();
    // 控制收藏夹
    this.controlCollectBox();
  }
  var obj = doc.querySelector('#canvas p');
  Index.prototype = {
    init: function(){
      var oBookUl = doc.getElementById('content-center');
      var bookInfo = {
        aBookList: oBookUl.getElementsByTagName('li'),
        aBookImg: oBookUl.getElementsByTagName('img'),
        aBookhref: oBookUl.querySelectorAll('#content-center li>a'),
        aBookName: oBookUl.querySelectorAll('h3'),
        aStoreHref: oBookUl.querySelectorAll('.storeName a'),
        aBookAddr: oBookUl.querySelectorAll('.addr span'),
        aBookPrice: oBookUl.querySelectorAll('.price span')
      };
      if(window.sessionStorage.getItem('likeBooks')) {
        console.log('有缓存');
        likeBookList  = JSON.parse(window.sessionStorage.getItem('likeBooks'));
        console.log('likeBookList:'+likeBookList);
        console.log(window.sessionStorage.getItem('likeBooks'));
        doc.querySelector("#collects .num").innerHTML = JSON.parse(window.sessionStorage.getItem('likeBooks')).length;
      }
      // 请求首页数据并渲染
      this.getAjaxModule(function(ajax){
        ajax({
          url:"/",
          method: 'get',
          data:{act:'indexBook'},
          error: function(status) {
            console.log('error:'+status);
          },
          success: function(res){
            data = JSON.parse(res);
            console.log(data);
            // 渲染数据
            // for(var i=0,len=bookInfo.aBookList.length;i<len;i++) {
            for(var i=0,len=data.length;i<len;i++) {
              // console.log(data[i].bookId);
              // bookInfo.aBookImg.src = data[i].bookSrc;
              bookInfo.aBookhref[i].href += data[i].bookId;
              console.log(bookInfo.aBookhref[i].href);
              bookInfo.aBookName[i].innerHTML = data[i].bookName;
              bookInfo.aBookAddr[i].innerHTML = data[i].schoolName;
              bookInfo.aStoreHref[i].href += data[i].shopperId;
              bookInfo.aBookPrice[i].innerHTML = data[i].bookPrice;
            }
            Index.prototype.controLike();
          }
        })
      });

    },
    // 获取header里边的方法
    getHeaderModule: function(){
      seajs.use('header.js',function(header){
        console.log(header);
          // header部分的事件委托
          header.headerEvent();
          // 登录注册部分的事件委托
          header.regitLogin();
          // 滚动操作header阴影
          header.scrollHeader();
        })
    },
    getFooterModule: function(){
      seajs.use('footer.js',function(footer){
        // console.log(footer);
      })
    },
    // 获取add-store方法并执行
    getAddStoreModule: function(){
      seajs.use('addStore.js',function(ADDSTORE){
        console.log(ADDSTORE);
      })
    },
    // 元素事件
    DoEvent: {
      addEvent: function(element,type,handle){
        if(element.addEventListener){
          element.addEventListener(type,handle);
        }else if(ele.attachEvent){
          element.attachEvent('on'+type,handle);
        }else {
          element['on'+type]=handle;
        }
      },
      delEvent: function(element,type,handle){
        if(element.removeEventListener){
          element.removeEventListener(type,handle);
        }else if(ele.dettachEvent){
          element.dettachEvent('on'+type,handle);
        }else {
          element['on'+type]=null;
        }
      },
      stop: function(e){
        if(e.stopPropagation){
          e.stopPropagation();
        }else {
          e.cancelBubble = true;
        }
      }
    },
    aboutCanvas: function(){
      var oCanvas = doc.getElementById('canvas'),
      oBubble = doc.getElementById('bubble');
      this.DoEvent.addEvent(oCanvas,'mousemove',function(e){
        e = e||window.e;
        Index.prototype.DoEvent.stop(e);
        console.log(e.clientX);
        console.log(e.clientY);
        oBubble.style.left = (e.clientX-40) + 'px';
        oBubble.style.top = (e.clientY-110) + 'px';
      })
    },
    // 控制收藏box
    controLike: function(){
      var aLis = doc.getElementById("content-center").getElementsByTagName("li"),
          aCovers = doc.getElementsByClassName("cover"),
          oLikeN = doc.querySelector("#collects .num"),
          oRigistBtn = doc.getElementById('regitBtn'),
          oRigistBox = doc.getElementById('regitLog'),
          oLogin = doc.getElementsByClassName('login')[0],
          aBookHref = doc.querySelectorAll('#content-center li>a'),
          aStoreHref = doc.querySelectorAll('#content-center .storeName a');
      Index.prototype.getCookieModule(function(cookie){
        user = JSON.parse(cookie.get('user'));
        console.log(user);
      })
      for(var i=0,len=aLis.length;i<len;i++) {
        (function(i){
          var oLike = aCovers[i];
          var oLikeI = aCovers[i].getElementsByTagName('i')[0];
          var bookId = aBookHref[i].href.split('?')[1].split('=')[1];
          console.log(bookId);
          Index.prototype.DoEvent.addEvent(oLike,'click',function(e){
            if(oRigistBtn.innerHTML == 'SIGN OUT') {
              e=e||window.e;
              Index.prototype.DoEvent.stop(e);
              console.log(Index.prototype.getStyle(oLike,"color"));
              // 点击收藏
              if(Index.prototype.getStyle(oLikeI,"color")=="rgb(0, 0, 0)") {
                oLike.style.opacity = '1';
                oLikeI.style.color = "#900";
                if(likeBookList.indexOf(bookId)==-1){
                  likeBookList.push(bookId);
                  console.log(user);
                  Index.prototype.getAjaxModule(function(ajax){
                    ajax({
                      url: '/',
                      data: {
                        act: 'collectBook',
                        userId: user.userId,
                        bookId: bookId,
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
                }
                oLikeN.innerHTML = likeBookList.length;
                window.sessionStorage.setItem('likeBooks',JSON.stringify(likeBookList));
                console.log(likeBookList);
                console.log(window.sessionStorage.getItem('likeBooks'));
              }else {
                // 取消收藏
                oLikeI.style.color = "#000";
                likeBookList.pop(bookId);
                oLikeN.innerHTML = likeBookList.length;
                Index.prototype.getAjaxModule(function(ajax){
                  ajax({
                    url: '/',
                    data: {
                      act: 'cancelCollectBook',
                      userId: user.userId,
                      bookId: bookId,
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
                window.sessionStorage.setItem('likeBooks',JSON.stringify(likeBookList));
                console.log(likeBookList);
                console.log(window.sessionStorage.getItem('likeBooks'));
              }
            }else if(oRigistBtn.innerHTML == 'LOGIN'){
              var con = confirm('登录后收藏才能保存哦，登录吗?');
              if(con) {
                // 登录
                oRigistBox.style.display = 'block';
    						oLogin.style.display = 'block';
              }
            }
          })
        })(i)
      }
    },
    // 收藏夹
    controlCollectBox: function(){
      seajs.use('collects.js',function(fn){
				fn();
			})
    },
    // 点击加载更多
    clickAddMore: function(){
      var addBtn = doc.getElementById('addMore'),
          obookUl = doc.getElementById('content-center'),
          oBookList = doc.querySelector('content-center li:first-child');
      console.log(oBookList);
      addBtn.onclick = function(){

      };
    },
    // 获取ajax模块
    getAjaxModule: function(callback){
      seajs.use('ajax.js',function(ajax){
        callback&&callback(ajax);
      })
    },
    getCookieModule: function(callback) {
      seajs.use('cookie.js',function(cookieModule){
        callback&&callback(cookieModule);
      })
    },
    getStyle: function(obj,attr){
      return getComputedStyle?getComputedStyle(obj)[attr]:obj.currentStyle[attr];
    }
  };
  // Index.prototype.getCookieModule(function(cookie){
  //   cookie.unset('user');
  // })
  var index = new Index();
})(document,window)
