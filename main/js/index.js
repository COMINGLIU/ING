(function(document,window){
  var doc = document;
  var like_n=0;
  window.sessionStorage.setItem('likes','');
  Object.defineProperty(Index.prototype,'constructor',{
    enumerable: false,
    value: Index
  })
  function Index() {
    // 登录注册的事件委托
    this.regitLogin();
    // header部分的事件委托
    this.headerEvent();
    // 控制收藏处
    this.controLike();
    // 操作header的阴影
    this.scrollHeader();
  }
  var obj = doc.querySelector('#canvas p');
  Index.prototype = {
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
    // 抓数据
    init: function(){
      console.log('init');
    },
    // header
    headerEvent: function() {
      var header = doc.getElementById('header'),
          oNav = doc.getElementById('nav');
      var count = 0;
      this.DoEvent.addEvent(header,'click',function(e){
        e = e||window.e;
        var target = e.target||e.srcElement;
        switch(target.id) {
          case 'menu':
            count++;
            if(count%2!=0) {
              oNav.style.transform = 'translateX(0)';
            }else {
              oNav.style.transform = 'translateX(160px)';
            }
            break;
        }
      })
    },
    // 注册登录
    regitLogin: function() {
      var oLogingBtn = doc.getElementById("regitBtn"),
          oRegitLog = doc.getElementById("regitLog"),
          oRegit = doc.getElementsByClassName('regit')[0],
          oLogin = doc.getElementsByClassName('login')[0];
      console.log(oLogingBtn);
      this.DoEvent.addEvent(oLogingBtn,'click',function(e){
        e = e||window.e;
        Index.prototype.DoEvent.stop(e);
        oRegitLog.style.display = "block";
      })
      this.DoEvent.addEvent(oRegitLog,'click',function(e){
        e = e||window.e;
        var target = e.target||e.srcElement;
        Index.prototype.DoEvent.stop(e);
        switch(target.id){
          case 'regitLog':
            oRegitLog.style.display = "none";
            break;
          case 'loginBtn':
            oRegit.style.display = 'none';
            oLogin.style.display = 'block';
            break;
          case 'regitBtn':
            oRegit.style.display = 'block';
            oLogin.style.display = 'none';
            break;
        }
      })
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
    controLike: function(){
      var aLis = doc.getElementById("content-center").getElementsByTagName("li");
      var aCovers = doc.getElementsByClassName("cover");
      var oLikeN = doc.getElementById("collects");  
      for(var i=0,len=aLis.length;i<len;i++) {
        (function(i){
          Index.prototype.DoEvent.addEvent(aLis[i],'mouseenter',function(){
            aCovers[i].style.height = '210px';
          })
          var oLike = aCovers[i].getElementsByTagName('i')[0];
          Index.prototype.DoEvent.addEvent(aLis[i],'mouseleave',function(){
            if(Index.prototype.getStyle(oLike,'color')!="rgb(0, 0, 0)") {
              aCovers[i].style.height = '210px';
            }else {
              aCovers[i].style.height = '0';
            }
          })
          Index.prototype.DoEvent.addEvent(oLike,'click',function(){
            oLike.style.cssText = "color: #fff;text-shadow: 0 0 20px #000;";
            like_n++;
            window.sessionStorage.getItem('likes',like_n);
            oLikeN.innerHTML = like_n;
            oLike.onclick = null;
            Index.prototype.DoEvent.addEvent(aLis[i],'mouseleave',function(){
              if(Index.prototype.getStyle(oLike,'color')=="rgb(255, 255, 255)") {
                aCovers[i].style.height = '210px';
              }else {
                aCovers[i].style.height = '0';
              }
            })
          })
        })(i)
      }
    },
    // 滚动操作header
    scrollHeader: function(){
      var oHeader = doc.getElementById('header');
      this.DoEvent.addEvent(window,'scroll',function(e){
        e=e||window.e;
        var oTop = document.documentElement.scrollTop;
        if(oTop>200){
          oHeader.className = 'h-shadow';
        }else {
          oHeader.className ='';
        }
      })
    },
    getStyle: function(obj,attr){
      return getComputedStyle?getComputedStyle(obj)[attr]:obj.currentStyle[attr];
    }
  };
  var index = new Index();
})(document,window)
