(function(document,window){
  var doc = document;
  var like_n=0;
  window.sessionStorage.setItem('likes','');
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
    this.controLike();
    // 获取add-store处的方法并执行
    this.getAddStoreModule();
    // 获取cookie模块
    // this.getCookieModule();
  }
  var obj = doc.querySelector('#canvas p');
  Index.prototype = {
    init: function(){
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
          }
        })
      })
      // 处理收藏量
      // Index.prototype.getCookieModule(function(cookieModule){
      //   if(cookieModule.get('likes')) {
      //     doc.querySelector('#collects .num').innerHTML = cookieModule.get('likes');
      //   }
      // })
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
          oLogin = doc.getElementsByClassName('login')[0];
      for(var i=0,len=aLis.length;i<len;i++) {
        (function(i){
          var oLike = aCovers[i];
          var oLikeI = aCovers[i].getElementsByTagName('i')[0];
          Index.prototype.DoEvent.addEvent(oLike,'click',function(e){
            if(oRigistBtn.innerHTML == 'SIGN OUT') {
              e=e||window.e;
              Index.prototype.DoEvent.stop(e);
              console.log(Index.prototype.getStyle(oLike,"color"));
              if(Index.prototype.getStyle(oLikeI,"color")=="rgb(0, 0, 0)") {
                oLike.style.opacity = '1';
                oLikeI.style.color = "#900";
                like_n++;
                oLikeN.innerHTML = like_n;
                Index.prototype.getCookieModule(function(cookieModule){
                  cookieModule.set('likes',like_n,'2018,9,1');
                })
              }else {
                oLikeI.style.color = "#000";
                like_n--;
                oLikeN.innerHTML = like_n;
                Index.prototype.getCookieModule(function(cookieModule){
                  cookieModule.set('likes',like_n,'2018,9,1');
                })
              }
            }else if(oRigistBtn.innerHTML == 'LOGIN'){
              var con = confirm('登录后收藏才能保存哦，登录吗?');
              if(con) {
                // 登录
                oRigistBox.style.display = 'block';
    						oLogin.style.display = 'block';
              }else {
                // 不做什么

              }
            }

          })
        })(i)
      }
    },
    getStyle: function(obj,attr){
      return getComputedStyle?getComputedStyle(obj)[attr]:obj.currentStyle[attr];
    }
  };
  var index = new Index();
})(document,window)
