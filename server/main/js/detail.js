(function(window,document){
	var doc = document;
	var user;
	function Detail(){
		this.init();
		// 获取header模块方法并执行
		this.getHeaderModule();
		// 获取DoEventModule模块方法并执行
		this.getDoEventModule();
		// 获取add-store模块方法
		this.getAddStore();
	}
	Object.defineProperty(Detail.prototype,'constructor',{
		enumerable: false,
		value: Detail
	});
	Detail.prototype = {
		init: function(){
			var bookInfo = {
				img: doc.querySelector('.bookins .bookimg img'),
				name: doc.querySelector('.bookins h3'),
				price: doc.querySelector('.bookins .price span'),
				bookNum: doc.querySelector('.bookins .book-num span'),
				bookPublic: doc.querySelector('.bookins .book-public span'),
				bookTel: doc.querySelector('.bookins .book-tel span'),
				bookDescribe: doc.querySelector('.bookins .book-describe span')
			};
			// 收藏按钮
			var collectBtn= doc.getElementById('collect');
			var count = 0;
			// 相关书籍的ul
			var relaBookUl = doc.querySelector('#relaBooks-box ul'),
					relaBookLi = relaBookUl.querySelectorAll('li');
			var sentData = window.location.search.split('?')[1].split('=')[1];
			this.getCookieModule(function(cookie){
				if(cookie.get('user')){
					user = JSON.parse(cookie.get('user'));
				}
			})
			//获取书籍基本信息
			this.getAjaxModule(function(ajax){
				ajax({
					url: '/',
					data: {act:'getBookDetail',bookId: sentData},
					method: 'get',
					error: function(status){
						console.log('error:'+status);
					},
					success: function(res){
						var res = JSON.parse(res);
						// 渲染数据
						console.log(res);
						if(res.status=='success'){
							// 渲染书籍信息
							// bookInfo.img.src = data.bookDetail.bookSrc;
							bookInfo.name.innerHTML = res.bookDetail.bookName;
							bookInfo.price.innerHTML = res.bookDetail.bookPrice;
							bookInfo.bookNum.innerHTML = res.bookDetail.bookAllNum;
							bookInfo.bookPublic.innerHTML = res.bookDetail.bookPublic;
							bookInfo.bookTel.innerHTML = res.bookDetail.tel;
							bookInfo.bookDescribe.innerHTML = res.bookDetail.bookDescribe;
							// 渲染相关书籍信息
							if(relaBookLi.length>res.anotherBook.length){
								for(var i=res.anotherBook.length,len=relaBookLi.length;i<len;i++) {
									relaBookUl.removeChild(relaBookLi[i]);
								}
							}else if(relaBookLi.length<res.anotherBook.length){
								var frag = doc.createDocumentFragment();
								for(var i=relaBookLi.length,len2=res.anotherBook.length;i<len2;i++) {
									var item = doc.createElement('li');
									item.innerHTML = '<a href="detail.html?bookId="><img src="" alt="otherbook"></a><p></p>';
									frag.appenChild(item);
								}
								relaBookUl.appendChild(frag);
							}
							// 点击收藏
							collectBtn.onclick = function() {
								count++;
								// 登录了
								if(user) {
									if(count%2==1){
										collectBtn.style.color = '#900';
										Detail.prototype.getAjaxModule(function(ajax){
											ajax({
												url: '/',
												data: {
													act: 'collectBook',
													userId: user.userId,
													bookId: sentData,
												},
												method: 'get',
												error: function(err){
													console.log('err:'+err);
												},
												success: function(res){
													res = JSON.parse(res);
													console.log(res);
												}
											})
										})
									}else {
										collectBtn.style.color = '#000';
									}
								}else {
									// 没有登录
									var con = confirm('登录后收藏才能保存，登录吗?');
									if(con) {
										// 打开登录框
										doc.getElementById("regitLog").style.display = 'block';
										doc.getElementsByClassName('login')[0].style.display = 'block';
									}
								}
							};
						}
					}
				})
			})
			// 获取书籍评论
			// this.getAjaxModule(function(ajax) {
			// 	ajax({
			// 		url: '/',
			// 		data: {act: 'getBookComment',bookId:'4'},
			// 		method: 'get',
			// 		error: function(status){
			// 			console.log('error：'+status);
			// 		},
			// 		success: function(res){
			// 			var data = JSON.parse(res);
			// 			// console.log(data);
			//
			// 		}
			// 	})
			// })
			// 获取其他书籍信息
		},
		getHeaderModule: function(){
			seajs.use('header.js',function(header){
				console.log(header);
				// header部分的事件委托
		        header.headerEvent();
		        // 登录注册部分的事件委托
		        header.regitLogin();
		        // 滚动操作header阴影
		        header.scrollHeader();
			})
		},
		getDoEventModule: function(){
			seajs.use('doEvent.js',function(doEvent){
				console.log(doEvent);
			})
		},
		getAddStore: function(){
			seajs.use('addStore.js',function(ADDSTORE){
				console.log(ADDSTORE);
			})
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
		}
	}
	var detail = new Detail();
})(window,document)
