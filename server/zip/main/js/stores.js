!function(e,t){var a,r=document;function l(){this.init(),this.getHeaderModule(),this.getAddStoreModule()}Object.defineProperty(l.prototype,"constructor",{enumerable:!1,value:l}),l.prototype={init:function(){var n=r.getElementById("store-list");n.getElementsByTagName("li"),n.getElementsByTagName("a"),n.getElementsByTagName("img"),n.getElementsByClassName("storeName"),n.getElementsByClassName("store-slogan"),n.getElementsByClassName("store-time");this.getAjaxModule(function(e){e({url:"/",data:{act:"getAllStores"},method:"get",error:function(e){console.log("err:"+e)},success:function(e){if("success"==(e=JSON.parse(e)).status){if(data=e.data,console.log(data),0<data.length){for(var t=r.createDocumentFragment(),o=0,s=data.length;o<s;o++){var a=r.createElement("li");a.innerHTML='<div class="store-info"><a href="them1.html?storeId='+data[o].userId+'"><div class="store-img"><img src="imgs/storeImg/'+data[o].shopperImg+'"></div></a><h3 class="store-name"><span class="storeName">'+data[o].shopperName+'</span><i class="iconfont icon-heart-fill"></i></h3><p class="store-slogan">'+data[o].shopperDescribe+'</p></div><p class="store-time">'+data[o].shopperTime+"</p>",t.appendChild(a)}n.appendChild(t)}l.prototype.addStoreLike()}else console.log("数据拉去失败")}})})},addStoreLike:function(){for(var s=r.querySelectorAll("#store-list .store-name i"),e=r.querySelectorAll(".store-info a"),t=0,o=s.length;t<o;t++)!function(t){var o=e[t].href.split("?")[1].split("=")[1];s[t].onclick=function(){l.prototype.getCookieModule(function(e){e.get("user")?(a=JSON.parse(e.get("user")),s[t].style.color="#900",l.prototype.getAjaxModule(function(e){e({url:"/",data:{act:"collectStore",userId:a.userId,storeId:o},method:"get",error:function(e){console.log("err:"+e)},success:function(e){e=JSON.parse(e),console.log(e),"success"==e.status?l.prototype.getLikeInfo():alert("收藏失败")}})})):confirm("登录才能保存您收藏的书店，登录吗?")&&(r.getElementById("regitLog").style.display="block",r.getElementsByClassName("login")[0].style.display="block")})}}(t)},getLikeInfo:function(){var e=r.getElementById("likeInfo");e.style.opacity="1";setTimeout(function(){e.style.opacity="0"},1e3)},getHeaderModule:function(){seajs.use("header.js",function(e){e.headerEvent(),e.regitLogin(),e.scrollHeader()})},getAddStoreModule:function(){seajs.use("addStore.js",function(e){})},getAjaxModule:function(t){seajs.use("ajax.js",function(e){t&&t(e)})},getCookieModule:function(t){seajs.use("cookie.js",function(e){t&&t(e)})}};new l}(window);