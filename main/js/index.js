(function(document,window){
  var doc = document;
  var like_n=0;
  window.sessionStorage.setItem('likes','');
  Object.defineProperty(Index.prototype,'constructor',{
    enumerable: false,
    value: Index
  })
  function Index() {
    // 执行header模块里边的函数
    this.getHeaderModule();
    // 控制收藏处
    this.controLike();
  }
  var obj = doc.querySelector('#canvas p');
  Index.prototype = {
    // 获取header里边的方法
    getHeaderModule: function(){
      seajs.use('header.js',function(header){
          var header = header;
          // header部分的事件委托
          header.headerEvent();
          // 登录注册部分的事件委托 
          header.regitLogin();
          // 滚动操作header阴影
          header.scrollHeader();
      })
    },
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
          Index.prototype.DoEvent.addEvent(oLike,'click',function(e){
            e=e||window.e;
            Index.prototype.DoEvent.stop(e);
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
    getStyle: function(obj,attr){
      return getComputedStyle?getComputedStyle(obj)[attr]:obj.currentStyle[attr];
    }
  };
  var index = new Index();
})(document,window)
