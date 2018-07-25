define(function(require,exports,module){
	  var doc = document;
	  var like_n=0;
	  window.sessionStorage.setItem('likes','');
	  Object.defineProperty(Header.prototype,'constructor',{
	    enumerable: false,
	    value: Header
	  })
	  function Header() {
	    // 登录注册的事件委托
	    // this.regitLogin();
	    // header部分的事件委托
	    // this.headerEvent();
	    // 操作header的阴影
	    // this.scrollHeader();
	  }
	  var obj = doc.querySelector('#canvas p');
	  Header.prototype = {
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
	    // header
	    headerEvent: function() {
	      var header = doc.getElementById('header'),
	          oNav = doc.getElementById('nav'),
	          oSearchBox = doc.getElementById("searchBox"),
	          oAddStore = doc.getElementById("add-store"),
	          oMenu = doc.getElementById("menu");
	      var count = 0;
	      this.DoEvent.addEvent(header,'click',function(e){
	        e = e||window.e;
	        e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
	        var target = e.target||e.srcElement;
	        console.log(target);
	        switch(target.id) {
	          case 'menu':
	            count++;
	            if(count%2!=0) {
	              oNav.style.transform = 'translateX(0)';
	              target.className = "iconfont icon-pause";
	            }else {
	              oNav.style.transform = 'translateX(100%)';
	              target.className = "iconfont icon-menu";
	            }
	            break;
	          case 'searchBtnLi':
	          case 'searchBtn':
	            oSearchBox.style.height = "80px";
		        oSearchBox.style.boxShadow = "0 0 10px #000";
	            if(Header.prototype.getStyle(oNav,'right')=="0px") 	{
	              oNav.style.transform = 'translateX(100%)';	
	              count++;
	            }
	            doc.getElementById("menu").className = "iconfont icon-menu";
	            break;
	          case 'searchCloseBtn':
	            oSearchBox.style.height = "0";
	            break;
	          case 'addStoreBtn':
	           	oAddStore.style.height = "100%";
	           	if(Header.prototype.getStyle(oMenu,"display")=="none"){
		            count++;
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
	      this.DoEvent.addEvent(oLogingBtn,'click',function(e){
	        e = e||window.e;
	        var target = e.target||e.srcElement;
	        console.log(target);
	        Header.prototype.DoEvent.stop(e);
	        oRegitLog.style.display = "block";
	        oLogin.style.display = 'block';
	      })
	      this.DoEvent.addEvent(oRegitLog,'click',function(e){
	        e = e||window.e;
	        var target = e.target||e.srcElement;
	        console.log(target);
	        Header.prototype.DoEvent.stop(e);
	        switch(target.id){
	          case 'regitLog':
	            oRegitLog.style.display = "none";
	            oRegit.style.display = 'none';
	            oLogin.style.display = 'none';
	            break;
	          case 'loginChange':
	            oRegit.style.display = 'none';
	            oLogin.style.display = 'block';
	            break;
	          case 'regitChange':
	            oRegit.style.display = 'block';
	            oLogin.style.display = 'none';
	            break;
	        }
	      })
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
	    getStyle: function(obj,attr) {
	    	return getComputedStyle?getComputedStyle(obj)[attr]:obj.currentStyle[attr];
	    }
	  };
	  var index = new Header();
	  module.exports = index;
})