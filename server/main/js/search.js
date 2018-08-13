(function(window,document){
	var doc = document;
	var user;
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
		// 控制收藏夹
    this.controlCollectBox();
	}
	Object.defineProperty(Search.prototype,'constructor',{
		enumerable: false,
		value: Search
	})
	Search.prototype = {
		getHeaderModule: function(){
			seajs.use('header.js',function(HEADER){
				// header部分的事件委托
		        // 登录注册部分的事件委托
		        HEADER.regitLogin();
		        // 滚动操作header阴影
		        HEADER.scrollHeader();
		        // header方法
		        headerEvent();
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
									case 'userCenter':
									case 'userCenterBtn':
										if(doc.getElementById('regitBtn').innerHTML=='LOGIN') {
											var con = confirm('登录后才能访问个人中心，登录吗?');
											if(con) {
												// 登录
												doc.getElementById('regitLog').style.display = 'block';
												doc.getElementsByClassName('login')[0].style.display = 'block';
											}
										}else {
											window.location.href = 'user.html';
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
										if(doc.getElementById('regitBtn').innerHTML == 'LOGIN') {
											var con = confirm('需要登录后才能添加属于您自己的书店，登录吗？');
											if(con) {
												doc.getElementById('regitLog').style.display = "block";
												doc.getElementsByClassName('login')[0].style.display = 'block';
											}
										}else if(JSON.parse(Search.prototype.getCookieModule().get('user')).isSeller!=null){
											var user = JSON.parse(Search.prototype.getCookieModule().get('user'));
											window.location.href = 'them1.html?storeId='+ user.userId;
										}else {
											var con = confirm('您还没有注册书店，是否注册?');
											if(con) {
												// 打开注册书店
												oAddStore.style.height = "100%";
												if(Search.prototype.getStyle(oMenu,"display")=="none"){
													count++;
												}
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
									}else if(JSON.parse(Search.prototype.getCookieModule().get('user')).isSeller!=null){
										var user = JSON.parse(Search.prototype.getCookieModule().get('user'));
										window.location.href = 'them1.html?storeId='+ user.userId;
									}else {
										var con = confirm('您还没有注册书店，是否注册?');
										if(con) {
											// 打开注册书店
											oAddStore.style.height = "100%";
											if(Search.prototype.getStyle(oMenu,"display")=="none"){
												count++;
											}
										}
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
			var aKeyWordLis = doc.querySelectorAll('#search-keywors li');
			var keyWord = {
				bookName: aKeyWordLis[0],
				bookPublic: aKeyWordLis[1],
				bookAddr: aKeyWordLis[2]
			};
			var searchValue = {
				bookName: '',
				bookPublic: '',
				bookAddr: ''
			};
			var searchData = decodeURI(window.location.search).split('?')[1].split('&');
			for(var i=0,len=searchData.length-1;i<len;i++) {
				searchValue[searchData[i].split('=')[0]] = searchData[i].split('=')[1];
				keyWord[searchData[i].split('=')[0]].innerHTML = searchData[i].split('=')[1];
			}
			this.getAjaxModule(function(ajax){
				ajax({
					url:'/',
					data: {
						act: 'searchBook',
						bookName: searchValue.bookName,
						bookPublic: searchValue.bookPublic,
						bookCollege: searchValue.bookAddr,
					},
					method: 'get',
					error: function(status){
						alert('error:'+status);
					},
					success: function(res){
						var res = JSON.parse(res);
						console.log(res);
						if(res.status=='success'){
							data = res.data;
							console.log(data);
							if(data.toString()=="") {
								Search.prototype.getNobookInfo();
							}else {
								Search.prototype.renderData(data);
							}
						}else {
							console.log('err:'+res.msg);
						}
					}
				})
			})
		},
		// 渲染数据
		renderData: function(data){
			var oBookUl = doc.getElementsByClassName('books')[0],
          aBookLi = oBookUl.getElementsByTagName('li');
          frag = doc.createDocumentFragment();
      if(aBookLi.length>0){
        console.log(aBookLi);
        var aBookLiTmp = doc.querySelectorAll('#content .books>li');
        console.log(aBookLiTmp);
        for(var j=0,len=aBookLiTmp.length;j<len;j++){
          oBookUl.removeChild(aBookLiTmp[j]);
        }
      }
      for(var i=0,len = data.length;i<len;i++){
        var item = doc.createElement('li');
        item.innerHTML = '<div><img src="imgs/storeImg/'+data[i].bookSrc+'" alt="book"></div><i class="iconfont icon-heart-fill"></i><a href="detail.html?bookId='+data[i].bookId+'" target="blank"><p class="price">￥<span>'+data[i].bookPrice+'</span></p><h3>'+data[i].bookName+'</h3><p class="public">'+data[i].bookPublic+'</p><p class="addr"><i class="iconfont icon-location"></i><span>'+data[i].schoolName+'</span></p></a>';
        frag.appendChild(item);
      }
      oBookUl.appendChild(frag);
      // 点击收藏
      Search.prototype.collectBook();
		},
    //
		getAddStoreModule: function(){
			seajs.use('addStore.js',function(ADDSTORE){
			})
		},
		// 多元素搜索功能
		searchPulsBook: function(){
			var searchEle = {
					oBookName: doc.getElementsByName("bookName")[0],
					oPublic: doc.getElementsByName("public")[0],
					oCollege: doc.getElementsByName("college")[0]
			};
			var aKeyWordLis = doc.querySelectorAll('#search-keywors li');
			var keyWord = {
				bookName: aKeyWordLis[0],
				bookPublic: aKeyWordLis[1],
				bookAddr: aKeyWordLis[2]
			};
			for(var key in searchEle) {
				(function(key){
						searchEle[key].onchange = function(){
							// 无刷新改变url
							var stackFresh = '?bookName='+searchEle.oBookName.value+'&bookPublic='+searchEle.oPublic.value+'&bookCollege='+searchEle.oCollege.value;
							history.replaceState(null,'修改',stackFresh);
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
											var res = JSON.parse(res);
											console.log(res);
											if(res.status=='success'){
												data = res.data;
												if(data.toString()=="") {
                          Search.prototype.getNobookInfo();
												}else {
													Search.prototype.renderData(data);
												}
											}else {
												console.log('err:'+res.msg);
											}
										}
									})
								})
							}
							keyWord.bookName.innerHTML = searchEle.oBookName.value;
							keyWord.bookPublic.innerHTML = searchEle.oPublic.value;
							keyWord.bookAddr.innerHTML = searchEle.oCollege.value;
						}
				})(key)
			}
		},
		// 收藏书籍
		collectBook: function(){
			var aCollectBtn = doc.getElementsByClassName('icon-heart-fill'),
					bookHref = doc.querySelectorAll('.books a');
			for(var i=0,len=aCollectBtn.length;i<len;i++) {
				(function(i){
					var bookId = bookHref[i].href.split('?')[1].split('=')[1];
					aCollectBtn[i].onclick = function(){
						Search.prototype.getCookieModule(function(cookie){
							if(cookie.get('user')){
								user = JSON.parse(cookie.get('user'));
								Search.prototype.getAjaxModule(function(ajax){
									ajax({
										url: '/',
										data: {
											act: 'collectBook',
											userId: user.userId,
											bookId: bookId,
										},
										method: 'get',
										error: function(err){
											console.log('err:'+err);
										},
										success: function(res){
											res = JSON.parse(res);
											console.log(res);
											if(res.status=='success'){
												aCollectBtn[i].style.color = '#900';
												Search.prototype.getLikeInfo();
											}else {
												alert('收藏失败');
											}
										}
									})
								})
							}else {
								var con = confirm('登录后才能保存收藏的书籍，登录吗？');
								if(con){
									//打开登录
									doc.getElementById('regitLog').style.display = "block";
									doc.getElementsByClassName('login')[0].style.display = 'block';
								}
							}
						});
					}
				})(i)
			}
		},
		// 收藏夹
    controlCollectBox: function(){
      seajs.use('collects.js',function(fn){
				fn();
			})
    },
		// 收藏信息
		getLikeInfo: function(item){
      var likeInfo = doc.getElementById('likeInfo');
      if(item=='yes'){
        likeInfo.innerHTML = '已收藏';
      }else if(item=='no'){
        likeInfo.innerHTML = '已取消收藏';
      }
			likeInfo.style.opacity = '1';
			var timer = setTimeout(function(){
				likeInfo.style.opacity = '0';
			},1000)
		},
    // 搜索不到书籍的信息提示
    getNobookInfo: function() {
      var oInfo = doc.getElementById('noBookInfo');
      oInfo.style.opacity = '1';
      var timer = setTimeout(function(){
        oInfo.style.opacity = '0';
      },1500)
    },
		getAjaxModule: function(callback){
			seajs.use('ajax.js',function(ajax){
				callback&&callback(ajax);
			})
		},
		getCookieModule: function(cb){
			seajs.use('cookie.js',function(cookie){
				cb&&cb(cookie);
			})
		},
		getStyle: function(obj,attr){
			return getComputedStyle?getComputedStyle(obj)[attr]:obj.currentStyle[attr];
		}
	};
	var search = new Search();
})(window,document)
