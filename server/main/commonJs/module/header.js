define(function(require,exports,module){
	var doc = document;
	var like_n=0;
	var user;
	var preventSqlWords = /select|insert|update|delete|exec|script|count|'|"|=|<|>|%/i;
	// 保存收藏的
	window.sessionStorage.setItem('likes','');
	Object.defineProperty(Header.prototype,'constructor',{
		enumerable: false,
		value: Header
	})
	function Header() {
			// 默认执行的logo点击
			this.logo();
			// 处理用户账户
			this.init();
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
		// logo
		logo: function(){
			var oLogo = doc.getElementById('logo');
			oLogo.onclick = function(){
				window.location.href = 'index.html';
			}
		},
		// 处理用户账号
		init: function(){
			if(this.getCookieModule().get('user')) {
				doc.getElementById('regitBtn').innerHTML = 'SIGN OUT';
				doc.getElementById('userCenter').innerHTML = JSON.parse(this.getCookieModule().get('user')).userName;
				doc.getElementById('userCenter').style.fontStyle = 'italic';
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
							if(doc.getElementById('regitBtn').innerHTML == 'SIGN OUT') {
								if(JSON.parse(Header.prototype.getCookieModule().get('user')).isSeller=='1'){
									var con = confirm('您已经注册过书店,不能重复注册，是否前往您的书店中心?');
									user = JSON.parse(Header.prototype.getCookieModule().get('user'));
									if(con) {
										// 打开书店
										window.location.href = 'addBook.html?userId='+user.userId+'&userName='+user.userName;
									}
								}else {
									oAddStore.style.height = "100%";
									if(Header.prototype.getStyle(oMenu,"display")=="none"){
										count++;
									}
								}
							}else if(doc.getElementById('regitBtn').innerHTML == 'LOGIN') {
								var con = confirm('需要登录后才能添加属于您自己的书店，登录吗？');
								if(con) {
									doc.getElementById('regitLog').style.display = "block";
									doc.getElementsByClassName('login')[0].style.display = 'block';
								}
							}
		    			break;
						case 'openStoreBtn':
							if(doc.getElementById('regitBtn').innerHTML == 'LOGIN') {
								var con = confirm('需要登录后才能进入您的书店中心，登录吗？');
								if(con) {
									doc.getElementById('regitLog').style.display = "block";
									doc.getElementsByClassName('login')[0].style.display = 'block';
								}
							}else if(JSON.parse(Header.prototype.getCookieModule().get('user')).isSeller!=null){
								user = JSON.parse(Header.prototype.getCookieModule().get('user'));
								window.location.href = 'them1.html?storeId='+ user.userId;
							}else {
								var con = confirm('您还没有注册书店，是否注册?');
								if(con) {
									// 打开注册书店
									oAddStore.style.height = "100%";
									if(Header.prototype.getStyle(oMenu,"display")=="none"){
										count++;
									}
								}
							}
							break;
		    		case 'home':
		    			window.location.href = "index.html";
		    			break;
		    		case 'stores':
		    			window.location.href = 'stores.html';
		    			break;
						case 'userCenterBtn':
		    		case 'userCenter':
							var oRigistBox = doc.getElementById('regitLog'),
									oLogin = doc.getElementsByClassName('login')[0];
		    			if(doc.getElementById('regitBtn').innerHTML=='LOGIN') {
								var con = confirm('登录后才能访问个人中心，登录吗?');
								if(con) {
									// 登录
	                oRigistBox.style.display = 'block';
	    						oLogin.style.display = 'block';
								}
							}else {
								window.location.href = 'user.html';
							}
		    			break;
	    		}
	    	});
	    	this.DoEvent.addEvent(oSearchInput,'change',function(){
	    		window.location.href = 'search.html?bookName='+oSearchInput.value+'&bookPublic=&bookCollege=';
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
				var loginArr = [];
	    	// login表单元素
	    	var loginForm = doc.getElementById("login-form");
	    	var loginEle = {
	    		oTelEmail: loginForm.querySelector("input[name='telEmail']"),
	    		oLoginPass: loginForm.querySelector("input[name='pass']"),
	    	};
				// 表单输入完进行判断
				// preventSqlWords
				for(var key in registEle) {
					(function(key){
						registEle[key].onchange = function(){
							if(preventSqlWords.test(registEle[key].value)){
								// 在此处阻止
								// alert('请不要尝试输入sql特殊字符，没戏');
								console.log('错了');
								doc.getElementById(key).innerHTML = '请不要尝试输入sql特殊字符或脚本，没戏';
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
				// 判断login
				for(var key2 in loginEle) {
					(function(key2){
						loginEle[key2].onchange = function(){
							if(key2=='oTelEmail'&&(/(^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$)|(^1[3|4|5|8]\d{9}$)/).test(loginEle[key2].value)==false) {
								doc.getElementById(key2).innerHTML = '格式错误';
								loginEle[key2].style.borderColor = 'red';
								if(loginArr.indexOf(key2)==-1){
									loginArr.push(key2);
								}
							}else {
								doc.getElementById(key2).innerHTML = "";
								loginEle[key2].style.borderColor = '#ccc';
							}
						}
					})(key2)
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
	    		if(oLogingBtn.innerHTML == 'LOGIN') {
						Header.prototype.DoEvent.stop(e);
						oRegitLog.style.display = "block";
						oLogin.style.display = 'block';
					}else if(oLogingBtn.innerHTML == 'SIGN OUT') {
						var con = confirm ('确认退出登录吗');
						if(con) {
							//退出
							oLogingBtn.innerHTML = 'LOGIN';
							doc.getElementById('userCenter').innerHTML = '<i class="iconfont icon-user"></i>';
							// 将用户信息从cookie中清除
							Header.prototype.getCookieModule().unset('user');
							console.log(Header.prototype.getCookieModule().get('user'));
						}else {
							// 不退出
						}
					}
	    	})
	    	this.DoEvent.addEvent(oRegitLog,'click',function(e){
	    		e = e||window.e;
	    		var target = e.target||e.srcElement;
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
							if((registEle.oUserName.value != ''&&registEle.oTel.value!= ''&&registEle.oEmail.value!=''&&registEle.oAddr.value!=''&&registEle.oPass.value!='')&&registArr.length==0){
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
			    		// console.log('login');
			    		// 发送数据
							console.log(loginArr);
							if(loginEle.oTelEmail.value!=''&&loginEle.oLoginPass.value!=''&&loginArr.length==0) {
								Header.prototype.getAjaxModule(function(ajax){
									ajax({
					    			url: '/',
					    			data: {
											act: 'login',
					    				telEmail: loginEle.oTelEmail.value,
					    				pass: loginEle.oLoginPass.value
					    			},
					    			method: 'post',
					    			error: function(status) {
					    				console.log('error'+status);
					    			},
					    			success: function(res){
					    				res = JSON.parse(res);
											console.log(res);
											var user = res.user;
											if(res.status == 'success'){
												// 登录成功
												oRegitLog.style.display = 'none';
												oLogingBtn.innerHTML = 'SIGN OUT';
												Header.prototype.getCookieModule().set('user',JSON.stringify(user),'2018.9.1');
												user = JSON.parse(Header.prototype.getCookieModule().get('user'));
												console.log(user);
												doc.getElementById('userCenter').innerHTML = res.user['userName'] ;
											}else if(res.status == 'fail') {
												// 登录失败
												doc.getElementById('loginOk').innerHTML = res.msg;
											}
					    			}
					    		})
								})
							}
			    	break;
	    		}
	    	})
	    },
	    getAjaxModule: function(callback){
	    	seajs.use('ajax.js',function(ajax){
					callback&&callback(ajax);
				})
	    },
			getCookieModule: function(){
				var cookieModule = require('cookie.js');
				return cookieModule;
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

/*cookie保存的东西
	'user': //用户信息
	'likes':收藏信息
*/
