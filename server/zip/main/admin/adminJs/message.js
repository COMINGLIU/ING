!function(n,e){var a=document,i={init:function(){var t=a.querySelector("#content .messageInfo");this.getAjaxModule(function(e){e({url:"/",data:{act:"getMessageNote",adminAcount:n.sessionStorage.getItem("adminUser")},method:"get",error:function(e){console.log(e)},success:function(e){if(e=JSON.parse(e),console.log(e),"success"==e.status){var n=e.data;0<n.length&&(i.renderData(n,t),i.openMsgDetail())}}})})},renderData:function(e,n){for(var t=a.createDocumentFragment(),i=0,l=e.length;i<l;i++){var o=a.createElement("li");o.innerHTML="<ul><li>"+e[i].userId+"</li><li>"+e[i].userName+"</li><li>"+e[i].msgTime+"</li><li>"+e[i].msg+'</li><li><i class="iconfont icon-wodefankui"></i></li></ul>',t.appendChild(o)}n.appendChild(t)},openMsgDetail:function(){for(var n=a.querySelectorAll(".messageInfo>li:not(:nth-child(1))>ul li:nth-last-child(2)"),t=a.getElementById("msgDetail"),i=a.querySelector("#msgDetail p"),e=a.querySelector("#msgDetail .close"),l=0,o=n.length;l<o;l++)!function(e){n[e].onclick=function(){t.style.display="block",i.innerHTML=n[e].innerHTML}}(l);e.onclick=function(){t.style.display="none"}},getAjaxModule:function(n){seajs.use("ajax.js",function(e){n&&n(e)})}};i.init()}(window);