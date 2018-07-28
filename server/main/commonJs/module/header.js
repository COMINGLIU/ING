define(function(require,exports,module){
	var doc = document;
	var like_n=0;
	var preventSqlWords = /select|update|delete|exec|count|'|"|=|<|>|%/i;
	// 保存收藏的
	window.sessionStorage.setItem('likes','');
	// 保存用户信息
	window.sessionStorage.setItem('user');
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
	    	};
				var registArr = [];
	    	// login表单元素
	    	var loginForm = doc.getElementById("login-form");
	    	var loginEle = {
	    		oTelEmail: loginForm.querySelector("input[name='telEmail']"),
	    		oPass: loginForm.querySelector("input[name='pass']"),
	    	};
				// 表单输入完进行判断
				// preventSqlWords
				for(var key in registEle) {
					(function(key){
						registEle[key].onblur = function(){
							if(preventSqlWords.test(registEle[key].value)){
								// 在此处阻止
								// alert('请不要尝试输入sql特殊字符，没戏');
								console.log('错了');
								doc.getElementById(key).innerHTML = '请不要尝试输入sql特殊字符，没戏';
								registEle[key].style.borderColor = 'red';
								if(registArr.indexOf(key)==-1){
									registArr.push(key);
								}
							}else {
								doc.getElementById(key).innerHTML = "";
								registEle[key].style.borderColor = '#ccc';
							}
							if(key=='oTel'&&(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/).test(registEle[key].value)==false) {
								doc.getElementById(key).innerHTML = '手机号格式错误';
								registEle[key].style.borderColor = 'red';
								if(registArr.indexOf(key)==-1){
									registArr.push(key);
								}
							}
							if(key=='oEmail'&&(/^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/).test(registEle[key].value)==false){
								doc.getElementById(key).innerHTML = '邮箱格式错误';
								registEle[key].style.borderColor = 'red';
								if(registArr.indexOf(key)==-1){
									registArr.push(key);
								}
							}
						}
					})(key)
				}
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
							if(registArr.length==0) {
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
											res = JSON.parse(res);
											if(res.status=='success'){
												// 注册成功
												oRegit.style.display = 'none';
							    			oLogin.style.display = 'block';
											}else if(res.status=='fail') {
												// 注册失败
												doc.getElementById("registOk").innerHTML = res.msg;
											}
										}
									})
								})
							}
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
				    				res = JSON.parse(res);
										console.log(res);
										if(res.status == 'success'){
											// 登录成功
											oRegitLog.style.display = 'none';
										}else if(res.status == 'fail') {
											// 登录失败
											doc.getElementById('loginOk').innerHTML = res.msg;
										}
				    			}
				    		})
							})
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
