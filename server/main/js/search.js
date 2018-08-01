(function(window,document){
	var doc = document;
	function Search(){
		this.init();
		// 获取header模块方法
		this.getHeaderModule();
		// 获取ajax模块
		this.getAjaxModule();
		// 获取add-store模块方法
		this.getAddStoreModule();
		// 多功能搜索
		this.searchPulsBook();
	}
	Object.defineProperty(Search.prototype,'constructor',{
		enumerable: false,
		value: Search
	})
	Search.prototype = {
		getHeaderModule: function(){
			seajs.use('header.js',function(HEADER){
				console.log(HEADER);
				// header部分的事件委托
		        // 登录注册部分的事件委托
		        HEADER.regitLogin();
		        // 滚动操作header阴影
		        HEADER.scrollHeader();
		        // header方法
		        headerEvent();
		        // searchBox
		        console.log(HEADER.getStyle(doc.getElementById("searchBox"),"height"));
		        function headerEvent(){
		        	var oHeader = doc.getElementById('header'),
			        oNav = doc.getElementById('nav'),
			        oSearchBox = doc.getElementById("searchBox"),
			        oSearchInput = oSearchBox.getElementsByTagName('input')[0],
			        oAddStore = doc.getElementById("add-store"),
	          		oMenu = doc.getElementById("menu"),
	          		oKeySearch = doc.getElementById("keyword-search");
			        var count = 0;
			        HEADER.DoEvent.addEvent(oHeader,'click',function(e){
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
				        		oSearchBox.style.height = "138px";
							    if(HEADER.getStyle(oNav,'right')=="0px") 	{
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
					           	if(Search.prototype.getStyle(oMenu,"display")=="none"){
						            count++;
					           	}
					        break;
						}
					})
					HEADER.DoEvent.addEvent(oKeySearch,'click',function(){
						oSearchBox.style.height = "138px";
					    if(HEADER.getStyle(oNav,'right')=="0px") 	{
					  	    oNav.style.transform = 'translateX(100%)';
					  	    count++;
					    }
					    oSearchInput.focus();
					    doc.getElementById("menu").className = "iconfont icon-menu";
							})
		        }
		    })
		},
		init: function(){
			var sentData = decodeURI(window.location.search).split('?')[1].split('=')[1];
			console.log(sentData);
			this.getAjaxModule(function(ajax){
				ajax({
					url:'/',
					data: {act:'searchBook',bookName: sentData},
					method: 'get',
					error: function(status){
						alert('error:'+status);
					},
					success: function(res){
						var data = JSON.parse(res);
						console.log(data);
					}
				})
			})
		},
		getAddStoreModule: function(){
			seajs.use('addStore.js',function(ADDSTORE){
				console.log(ADDSTORE);
			})
		},
		// 多元素搜索功能
		searchPulsBook: function(){
			var searchEle = {
					oBookName: doc.getElementsByName("bookName")[0],
					oPublic: doc.getElementsByName("public")[0],
					oCollege: doc.getElementsByName("college")[0]
			};
			console.log(searchEle);
			for(var key in searchEle) {
				console.log(searchEle[key]);
				(function(key){
						searchEle[key].onchange = function(){
							if(searchEle.oBookName.value!=""||searchEle.oPublic.value!=""||searchEle.oCollege.value!=""){
								Search.prototype.getAjaxModule(function(ajax){
									ajax({
										url: '/',
										data: {
											act: 'searchBook',
											bookName: searchEle.oBookName.value,
											bookPublic: searchEle.oPublic.value,
											bookCollege: searchEle.oCollege.value
										},
										method: 'get',
										error: function(status){
											alert('err:'+status);
										},
										success: function(res){
											var data = JSON.parse(res);
											console.log(data);
										}
									})
								})
							}
						}
				})(key)
			}
		},
		getAjaxModule: function(callback){
			seajs.use('ajax.js',function(ajax){
				callback&&callback(ajax);
			})
		},
		getStyle: function(obj,attr){
			return getComputedStyle?getComputedStyle(obj)[attr]:obj.currentStyle[attr];
		}
	};
	var search = new Search();
})(window,document)
