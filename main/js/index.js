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
    // 获取add-store处的方法并执行
    this.getAddStoreModule();
  }
  var obj = doc.querySelector('#canvas p');
  Index.prototype = {
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
      var aLis = doc.getElementById("content-center").getElementsByTagName("li");
      var aCovers = doc.getElementsByClassName("cover");
      var oLikeN = doc.getElementById("collects");  
      for(var i=0,len=aLis.length;i<len;i++) {
        (function(i){
          var oLike = aCovers[i];
          var oLikeI = aCovers[i].getElementsByTagName('i')[0];
          Index.prototype.DoEvent.addEvent(oLike,'click',function(e){
            e=e||window.e;
            Index.prototype.DoEvent.stop(e);
            console.log(Index.prototype.getStyle(oLike,"color"));
            if(Index.prototype.getStyle(oLikeI,"color")=="rgb(0, 0, 0)") {
              oLike.style.opacity = '1';
              oLikeI.style.color = "#900";
              like_n++;
              window.sessionStorage.getItem('likes',like_n);
              oLikeN.innerHTML = like_n;
            }else {
              oLikeI.style.color = "#000";
              like_n--;
              window.sessionStorage.getItem('likes',like_n);
              oLikeN.innerHTML = like_n;
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
