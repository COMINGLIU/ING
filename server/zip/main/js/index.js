!function(e,i){var u,d=e;function g(){this.init(),this.getHeaderModule(),this.getFooterModule(),this.getAddStoreModule(),this.controlCollectBox()}Object.defineProperty(g.prototype,"constructor",{enumerable:!1,value:g});d.querySelector("#canvas p");g.prototype={init:function(){var e=d.getElementById("content-center"),n={aBookList:e.getElementsByTagName("li"),aBookImg:e.getElementsByTagName("img"),aBookhref:e.querySelectorAll("#content-center li>a"),aBookName:e.querySelectorAll("h3"),aStoreHref:e.querySelectorAll(".storeName a"),aBookAddr:e.querySelectorAll(".addr span"),aBookPrice:e.querySelectorAll(".price span")};this.getAjaxModule(function(e){e({url:"/",method:"get",data:{act:"indexBook"},error:function(e){console.log("error:"+e)},success:function(e){data=JSON.parse(e),console.log(data);for(var t=0,o=n.aBookList.length;t<o;t++)n.aBookImg[t].src="imgs/storeImg/"+data[t].bookSrc,n.aBookhref[t].href+=data[t].bookId,n.aStoreHref[t].innerHTML=data[t].shopperName,n.aBookName[t].innerHTML=data[t].bookName,n.aBookAddr[t].innerHTML=data[t].schoolName,n.aStoreHref[t].href+=data[t].shopperId,n.aBookPrice[t].innerHTML=data[t].bookPrice;g.prototype.controLike()}})})},getHeaderModule:function(){seajs.use("header.js",function(e){e.headerEvent(),e.regitLogin(),e.scrollHeader()})},getFooterModule:function(){seajs.use("footer.js",function(e){})},getAddStoreModule:function(){seajs.use("addStore.js",function(e){console.log(e)})},aboutCanvas:function(){var e=d.getElementById("canvas"),t=d.getElementById("bubble");this.DoEvent.addEvent(e,"mousemove",function(e){e=e||i.e,g.prototype.DoEvent.stop(e),console.log(e.clientX),console.log(e.clientY),t.style.left=e.clientX-40+"px",t.style.top=e.clientY-110+"px"})},controLike:function(){var e=d.getElementById("content-center").getElementsByTagName("li"),r=d.getElementsByClassName("cover"),l=(d.querySelector("#collects .num"),d.getElementById("regitBtn")),c=d.getElementById("regitLog"),a=d.getElementsByClassName("login")[0],s=d.querySelectorAll("#content-center li>a");d.querySelectorAll("#content-center .storeName a");g.prototype.getCookieModule(function(e){u=JSON.parse(e.get("user")),console.log(u)});for(var t=0,o=e.length;t<o;t++)!function(e){var t=r[e],o=r[e].getElementsByTagName("i")[0],n=s[e].href.split("?")[1].split("=")[1];g.prototype.DoEvent.addEvent(t,"click",function(e){if("SIGN OUT"==l.innerHTML)e=e||i.e,g.prototype.DoEvent.stop(e),console.log(g.prototype.getStyle(t,"color")),t.style.opacity="1",o.style.color="#900",console.log(u),g.prototype.getAjaxModule(function(e){e({url:"/",data:{act:"collectBook",userId:u.userId,bookId:n},method:"get",error:function(e){console.log("err:"+e)},success:function(e){e=JSON.parse(e),console.log(e),"success"==e.status&&g.prototype.getLikeInfo("已收藏")}})});else if("LOGIN"==l.innerHTML){confirm("登录后收藏才能保存哦，登录吗?")&&(c.style.display="block",a.style.display="block")}})}(t)},controlCollectBox:function(){seajs.use("collects.js",function(e){e()})},getLikeInfo:function(e){var t=d.getElementById("likeInfo");t.innerHTML=e,t.style.opacity="1";var o=setTimeout(function(){t.style.opacity="0",clearTimeout(o)},1e3)},clickAddMore:function(){var e=d.getElementById("addMore"),t=(d.getElementById("content-center"),d.querySelector("content-center li:first-child"));console.log(t),e.onclick=function(){}},getAjaxModule:function(t){seajs.use("ajax.js",function(e){t&&t(e)})},getCookieModule:function(t){seajs.use("cookie.js",function(e){t&&t(e)})},getStyle:function(e,t){return getComputedStyle?getComputedStyle(e)[t]:e.currentStyle[t]},DoEvent:{addEvent:function(e,t,o){e.addEventListener?e.addEventListener(t,o):ele.attachEvent?e.attachEvent("on"+t,o):e["on"+t]=o},delEvent:function(e,t,o){e.removeEventListener?e.removeEventListener(t,o):ele.dettachEvent?e.dettachEvent("on"+t,o):e["on"+t]=null},stop:function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0}}};new g}(document,window);