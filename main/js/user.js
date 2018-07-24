(function(window,document){
	var doc = document;
	window.sessionStorage.setItem('userInfo','');
	function User() {
		// 点击欢迎界面消失
		this.welPage();
		// 控制导航
		this.controlNav();
		// 打开导航
		this.openNav();
		// 
		this.modEvent();
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
				oWelPage = doc.getElementById("welcome");
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
			// var key = Math.floor(Math.random()*oWelContent.length);
			// console.log(key);
			// oWelBtn.innerHTML = oWelContent[key];
			this.doEvent.addEvent(oWelBtn,'click',function(){
				oWelPage.style.height = '0';
			})
			this.doEvent.addEvent(oWelBtn,'mouseenter',function(){
				oWelBtn.style.transform = "translate(20px)";
			})
			this.doEvent.addEvent(oWelBtn,'mouseleave',function(){
				oWelBtn.style.transform = "translate(0)";
			})
		},
		// 控制导航
		controlNav: function(){
			var oModbtn = doc.querySelector("#userNav .mod"),
				oNav = doc.getElementById("userNav"),
				oCollectsBtn = doc.querySelector("#userNav .collects"),
				oUl = doc.querySelector("#content ul");
				// oModBox = doc.getElementById("infoModi"),
				// oCollectxBox = doc.getElementById("collectFold");
			this.doEvent.addEvent(oModbtn,'click',function(){
				oUl.style.transform = 'translate(0)';
				oNav.style.right = 'calc( -100% + 300px)';
				oNav.style.border = "0";
			})
			this.doEvent.addEvent(oCollectsBtn,'click',function(){
				oUl.style.transform = 'translate(-50%)';
				oNav.style.right = 'calc( 100% - 300px)';
				oNav.style.border = "0";
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
				}
			})
		},
		//左侧个人信息 
		modEvent: function(){
			var modBlock = doc.querySelector(".reset"),
				modBtn = doc.querySelector(".reset i"),
				modComfirm = doc.querySelector(".reset button.yes"),
				modCancel = doc.querySelector(".reset button.no"),
				modInput = doc.querySelectorAll("#infoModi input");
			/*==========存一下用户信息================*/ 
			var userInfo={};
			for(var i=0,len=modInput.length;i<len;i++) {
				userInfo[modInput[i].name] = modInput[i].value;
			}
			window.sessionStorage.setItem('userInfo',JSON.stringify(userInfo));
			/*======================================*/ 
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

								break;
							case 'no':
								var realUserInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
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
											modInput[j].value = realUserInfo["nickName"];
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
		}
	}
	var user = new User();
})(window,document);