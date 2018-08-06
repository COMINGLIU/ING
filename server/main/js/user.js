(function(window,document){
	var doc = document;
	// 缓存用户基本信息
	window.sessionStorage.setItem('userInfo','');
	// 存储用户基本信息
	var user;
	function User() {
		// 点击欢迎界面消失
		this.welPage();
		// 登录
		this.login();
		// 控制导航
		this.controlNav();
		// 打开导航
		this.openNav();
		//左侧个人信息
		// this.modEvent();
		//logo跳转
		this.logo();

	}
	Object.defineProperty(User.prototype,'constructor',{
		enumerable: false,
		value: User
	})
	User.prototype = {
		doEvent: {
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
		// 点击欢迎界面消失
		welPage: function(){
			var oWelBtn = doc.querySelector("#welcome i"),
				oWelPage = doc.getElementById("welcome"),
				oUserName = doc.querySelector("#welcome .username"),
				oRegistLogin = doc.getElementById('regitLog'),
				oLogin = doc.getElementsByClassName('login')[0];
			var oWelContent = [
				"你来啦",
				"我等你好久了",
				"welcome to the page",
				"没有什么能够阻挡",
				"你对自由的向往",
				"天马行空的微笑",
				"你的笑了无牵挂",
				"欢迎欢迎，热烈欢迎",
				"就知道你会点进来",
				"想知道下一句吗",
				"哈哈，就不告诉你",
			];
			var personalInfo = {
				nickName: doc.getElementsByName('nickName')[0],
				tel: doc.getElementsByName('tel')[0],
				email: doc.getElementsByName('email')[0],
				college: doc.getElementsByName('college')[0],
				shopperName: doc.getElementsByName('storeName')[0],
				shopperSlogan: doc.getElementsByName('storeSlogan')[0]
			};
			this.getCookieModule(function(cookieModule){
				console.log(cookieModule);
				user = JSON.parse(cookieModule.get('user'));
				console.log(user);
				if(user) {
					console.log(personalInfo);
					oUserName.innerHTML = user.userName;
					personalInfo.nickName.value = user.userName;
					personalInfo.tel.value = user.tel;
					personalInfo.email.value = user.email;
					personalInfo.college.value = user.schoolName;
					User.prototype.getAjaxModule(function(ajax){
						ajax({
							url: '/',
							data: {
								act:'getUserCenterInfo',
								userId: user.userId
							},
							method: 'get',
							error: function(status){
								alert('error:'+status);
							},
							success: function(res){
								window.sessionStorage.setItem('userCenterInfo',res);
								res = JSON.parse(res);
								// 将信息用sessionStorage存起来
								console.log(res);
								// 填写
								personalInfo.shopperName.value = res.myShopper['shopperName'];
								personalInfo.shopperSlogan.value = res.myShopper['shopperDescribe'];
								User.prototype.modEvent();
							}
						})
					})
				}else {
					oUserName.innerHTML = 'hello';
				}
				User.prototype.doEvent.addEvent(oWelBtn,'click',function(){
					// 重新获取一下user，否则会被全局变量null覆盖
					user = JSON.parse(cookieModule.get('user'));
					console.log(user);
					if(user) {
						oWelPage.style.height = '0';
					}else {
						// 显示登录框
						oRegistLogin.style.display = 'block';
						oLogin.style.display = 'block';
					}
				})
			})
			User.prototype.doEvent.addEvent(oWelBtn,'mouseenter',function(){
				oWelBtn.style.transform = "translate(20px)";
			})
			User.prototype.doEvent.addEvent(oWelBtn,'mouseleave',function(){
				oWelBtn.style.transform = "translate(0)";
			})
		},
		// 登录
		login: function() {
			var oLogin = doc.getElementsByClassName('login')[0],
					oRegitLog = doc.getElementById("regitLog"),
					loginForm = doc.getElementById("login-form");
			var loginEle = {
				oTelEmail: loginForm.querySelector("input[name='telEmail']"),
				oLoginPass: loginForm.querySelector("input[name='pass']")
			};
			var loginArr = [];
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
			loginForm.onsubmit = function(e){
				e = e||window.e;
				e.preventDefault?e.preventDefault():e.returnValue = false;
			};
			console.log(oRegitLog);
			User.prototype.doEvent.addEvent(oRegitLog,'click',function(e){
				e = e||window.e;
				var target = e.target||e.srcElement;
				e.stopPropagation?e.stopPropagation():e.returnValue = false;
				switch(target.id){
					case 'loginSubBtn':
						// 发送数据
						console.log(loginArr);
						if(loginEle.oTelEmail.value!=''&&loginEle.oLoginPass.value!=''&&loginArr.length==0) {
							User.prototype.getAjaxModule(function(ajax){
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
											oLogin.style.display = 'none';
											User.prototype.getCookieModule(function(cookie){
												cookie.set('user',JSON.stringify(user));
												console.log(cookie.get('user'));
											})
											doc.querySelector('#welcome .username').innerHTML = user.userName;
										}else if(res.status == 'fail') {
											// 登录失败
											doc.getElementById('loginOk').innerHTML = res.msg;
										}
									}
								})
							})
						}
					break;
				case 'cancelBtn':
					oRegitLog.style.display = "none";
					oLogin.style.display = 'none';
					break;
				}
			})
		},
		// 控制导航
		controlNav: function(){
			var oModbtn = doc.querySelector("#userNav .mod"),
				oNav = doc.getElementById("userNav"),
				oCollectsBtn = doc.querySelector("#userNav .collects"),
				oOPenMyStoreBtn = doc.querySelector('#userNav .myStore'),
				oUl = doc.querySelector("#content ul");
			this.doEvent.addEvent(oNav,'click',function(e){
				e = e||window.e;
				e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
				var target = e.target||e.srcElement;
				switch(target.className) {
					case 'mod':
						oUl.style.transform = 'translate(0)';
						oNav.style.right = 'calc( -100% + 300px)';
						oNav.style.border = "0";
						break;
					case 'collects':
						oUl.style.transform = 'translate(-50%)';
						oNav.style.right = 'calc( 100% - 300px)';
						oNav.style.border = "0";
						break;
					case 'myStore':
						console.log(user);
						if(user.isSeller==null) {
							var con = confirm('您还没有注册书店，是否跳转到主页注册？');
							if(con) {
								window.location.href = 'index.html';
							}
						}else {
							window.location.href = 'them1.html?storeId='+user.userId;
						}
						break;
					case 'toMyStoreCenter':
						console.log(user);
						if(user.isSeller==null) {
							var con = confirm('您还没有注册书店，是否跳转到首页注册？');
							if(con) {
								window.location.href = 'index.html';
							}
						}else {
							window.location.href = 'addBook.html?uerId='+user.userId+'&userName='+user.userName;
						}
						break;
				}
			})
		},
		// 打开导航
		openNav: function(){
			var oHeader = doc.getElementById("header"),
				oNavBtn = doc.getElementById("user-menu"),
				oNavBtnI = doc.getElementById("user-menu"),
				oMenu = doc.getElementById("menuUl"),
				oUl = doc.querySelector("#content>ul"),
				count = 0;
			this.doEvent.addEvent(oHeader,'click',function(e){
				e = e||window.e;
				var target = e.target||e.srcElement;
				console.log(target);
				switch(target.id){
					case 'user-menu':
						count++;
						if(count%2==1){
							oNavBtnI.className = 'iconfont icon-guanbi';
							oMenu.style.transform = "translate(0)";
						}else {
							oNavBtnI.className = 'iconfont icon-menu';
							oMenu.style.transform = "translate(100%)";
						}
						break;
					case 'resetInfo-li':
						oUl.style.transform = 'translate(0)';
						oNavBtnI.className = 'iconfont icon-menu';
						oMenu.style.transform = "translate(100%)";
						count++;
						break;
					case 'collects-li':
						oUl.style.transform = 'translate(-50%)';
						oNavBtnI.className = 'iconfont icon-menu';
						oMenu.style.transform = "translate(100%)";
						count++;
						break;
					case 'openStore-li':
						window.location.href = 'them1.html';
						break;
					case 'openStoreCenter-li':
						window.location.href = 'addBook.html';
						break;
				}
			})
		},
		//左侧个人信息
		modEvent: function(){
			var modBlock = doc.querySelector(".reset"),
				modBtn = doc.querySelector(".reset i"),
				modComfirm = doc.querySelector(".reset button.yes"),
				modCancel = doc.querySelector(".reset button.no"),
				modInput = doc.getElementById('infoModi').getElementsByTagName("input"),
				infoForm = doc.querySelector('#infoModi form');
			/*==========存一下用户信息================*/
			var userInfo={};
			for(var i=0,len=modInput.length;i<len;i++) {
				userInfo[modInput[i].name] = modInput[i].value;
			}
			console.log(userInfo);
			window.sessionStorage.setItem('userInfo',JSON.stringify(userInfo));
			/*======================================*/
			/*阻止表单默认事件*/
			this.doEvent.addEvent(infoForm,'submit',function(e){
				e = e||window.e;
				e.perventDefault?e.preventDefault():e.returnValue=false;
			})
			this.doEvent.addEvent(modBlock,"click",function(e){
				e = e||window.e;
				var target = e.target||e.srcElement;
				var targetName = target.nodeName.toLowerCase();
				switch(targetName){
					case 'i':
						modComfirm.style.display = "inline";
						modCancel.style.display = 'inline';
						for(var i=0,len=modInput.length;i<len;i++) {
							if(modInput[i].name!='tel'&&modInput[i].name!='email'){
								modInput[i].readOnly = false;
							}
						}
						break;
					case 'button':
						switch(target.className) {
							case 'yes':
								User.prototype.getAjaxModule(function(ajax){
									ajax({
										url: '/',
										data:{
											act: 'modifyUserInfo',
											userId: user.userId,
											nickName: modInput[0].value,
											tel: modInput[1].value,
											email: modInput[2].value,
											college: modInput[3].value,
											storeName: modInput[4].value,
											storeSlogan: modInput[5].value
										},
										method: 'post',
										error: function(status){
											alert('error:'+status);
										},
										success: function(res){
											res = JSON.parse(res);
											if(res.status =='success') {
												alert('更新成功');
											}else{
												alert('更新失败'+res.msg);
											}
										}
									})
								})
								break;
							case 'no':
								var realUserInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
								console.log(realUserInfo);
								for(var j=0,len2=modInput.length;j<len2;j++) {
									modInput[j].readOnly = true;
									switch(modInput[j].name) {
										case 'nickName':
											modInput[j].value = realUserInfo["nickName"];
											break;
										case 'tel':
											modInput[j].value = realUserInfo["tel"];
											break;
										case 'email':
											modInput[j].value = realUserInfo["email"];
											break;
										case 'college':
											modInput[j].value = realUserInfo["college"];
											break;
										case 'storeName':
											modInput[j].value = realUserInfo["storeName"];
											break;
										case 'storeSlogan':
											modInput[j].value = realUserInfo["storeSlogan"];
											break;
									}
								}
								modComfirm.style.display = "none";
								modCancel.style.display = 'none';
							break;
						}
						break;
				}
			})
		},
		logo: function(){
			var oLogo = doc.getElementById('logo');
			oLogo.onclick = function(){
				window.location.href = 'index.html';
			}
		},
		getCookieModule: function(callback) {
			seajs.use('cookie.js',function(cookieModule){
				callback&&callback(cookieModule);
			})
		},
		getAjaxModule: function(callback) {
			seajs.use('ajax.js',function(ajax){
				callback&&callback(ajax);
			})
		},
	}
	var user = new User();
})(window,document);
