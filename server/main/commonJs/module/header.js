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
	    	oSearchInput = oSearchBox.querySelector('input'),
	    	oAddStore = doc.getElementById("add-store"),
	    	oMenu = doc.getElementById("menu");
	    	var count = 0;
	    	this.DoEvent.addEvent(header,'click',function(e){
	    		e = e||window.e;
	    		e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
	    		var target = e.target||e.srcElement;
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
		    			oSearchInput.focus();
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
		    		case 'home':
		    			window.location.href = "index.html";
		    			break;
		    		case 'stores':
		    			window.location.href = 'stores.html';
		    			break;
		    		case 'userCenter':
		    			// window.location.href = 'user.html';
		    			break;
	    		}
	    	});
	    	this.DoEvent.addEvent(oSearchInput,'change',function(){
	    		window.location.href = 'search.html?bookName='+oSearchInput.value;
	    	})
	    },
	    // 注册登录
	    regitLogin: function() {
	    	// header头部的btn
	    	var oLogingBtn = doc.getElementById("regitBtn"),
		    	oRegitLog = doc.getElementById("regitLog"),
		    	oRegit = doc.getElementsByClassName('regit')[0],
		    	oLogin = doc.getElementsByClassName('login')[0];
		    // regist表单元素
		    var registForm = doc.getElementById("regist-form");
	    	var registEle = {
	    		oUserName: registForm.querySelector("input[name='username']"),
	    		oTel: registForm.querySelector("input[name='tel']"),
	    		oEmail: registForm.querySelector("input[name='email']"),
	    		oAddr: registForm.querySelector("input[name='addr']"),
	    		oPass: registForm.querySelector("input[name='pass']"),
	    		oSub: registForm.querySelector("input[name='sub']")
	    	};
	    	// login表单元素
	    	var loginForm = doc.getElementById("login-form");
	    	var loginEle = {
	    		oTelEmail: loginForm.querySelector("input[name='telEmail']"),
	    		oPass: loginForm.querySelector("input[name='pass']"),
	    		oSub: loginForm.querySelector("input[name='sub']")
	    	};
	    	// 阻止表单默认事件
	    	registForm.onsubmit = function(e){
	    		e = e||window.e;
	    		e.preventDefault?e.preventDefault():e.returnValue=false;
	    	};
	    	loginForm.onsubmit = function(e){
	    		e = e||window.e;
	    		e.preventDefault?e.preventDefault():e.returnValue = false;
	    	};
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
		    		case 'registSubBtn':
		    			// 发送数据
			    		Header.prototype.getAjaxModule(function(ajax){
								ajax({
				    			url: "/",
				    			data: {
										act: "regist",
				    				username: registEle.oUserName.value,
				    				tel:registEle.oTel.value,
				    				email:registEle.oEmail.value,
				    				college: registEle.oAddr.value,
				    				pass: registEle.oPass.value
				    			},
				    			method: 'post',
				    			error: function(status){
				    				alert('error:'+status);
				    			},
				    			success: function(res){
				    				console.log(res);
				    			}
				    		})
							})
			    		break;
			    	case 'loginSubBtn':
			    		console.log('login');
			    		// 发送数据
			    		Header.prototype.getAjaxModule(function(ajax){
								ajax({
				    			url: '/',
				    			data: {
										act: 'login',
				    				telEmail: loginEle.oTelEmail.value,
				    				pass: loginEle.oPass.value
				    			},
				    			method: 'post',
				    			error: function(status) {
				    				console.log('error'+status);
				    			},
				    			success: function(res){
				    				console.log(res);
				    			}
				    		})
							})
						// 	var xhr = new XMLHttpRequest();
						// 	xhr.onreadystatechange = function(){
						// 		console.log(xhr.readyState);
						// 		console.log(xhr.status);
						// 		if(xhr.readyState==4){
						// 			if(xhr.status==200||xhr.status==304){
						// 				var data = xhr.xhr.responseText();
						// 				console.log(data);
						// 			}
						// 		}
						// 	}
						// 	xhr.open('post','/',true);
						// 	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
						// 	xhr.send('act=login&username=qpq&tel=3028302&pass=222');
			    	break;
	    		}
	    	})
	    },
	    getAjaxModule: function(callback){
	    	seajs.use('ajax.js',function(ajax){
					callback&&callback(ajax);
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