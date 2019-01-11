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
				img: doc.querySelector('#bookinfo .bookimg img'),
				name: doc.querySelector('.bookins h3'),
				price: doc.querySelector('.bookins .price span'),
				bookNum: doc.querySelector('.bookins .book-num span'),
				bookPublic: doc.querySelector('.bookins .book-public span'),
				bookTel: doc.querySelector('.bookins .book-tel span'),
				bookAddr: doc.querySelector('.bookins .book-addr span'),
				bookDescribe: doc.querySelector('.bookins .book-describe span')
			};
			// 收藏按钮
			var collectBtn= doc.getElementById('collect');
			var count = 0;
			// 相关书籍的ul
			var relaBookUl = doc.querySelector('#relaBooks-box ul'),
					relaBookLi = relaBookUl.querySelectorAll('li');
			var sentData = window.location.search.split('?')[1].split('=')[1];

			// 获取用户详情
			Detail.prototype.getCookieModule(function(cookie){
				if(cookie.get('user')){
					user = JSON.parse(cookie.get('user'));
				}
			});
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
							bookInfo.img.src = 'imgs/storeImg/'+res.bookDetail.bookSrc;
							bookInfo.name.innerHTML = res.bookDetail.bookName;
							bookInfo.price.innerHTML = res.bookDetail.bookPrice;
							bookInfo.bookNum.innerHTML = res.bookDetail.bookAllNum;
							bookInfo.bookPublic.innerHTML = res.bookDetail.bookPublic;
							bookInfo.bookTel.innerHTML = res.bookDetail.tel;
							bookInfo.bookAddr.innerHTML = res.bookDetail.schoolName;
							bookInfo.bookDescribe.innerHTML = res.bookDetail.bookDescribe;
							// 渲染相关书籍
							if(res.anotherBook.length>0) {
								var frag = doc.createDocumentFragment();
								for(var i=0,len = res.anotherBook.length;i<len;i++) {
								var item = doc.createElement('li');
								item.innerHTML = '<li><a href="detail.html?bookId='+res.anotherBook[i].bookId+'" target="blank"><img src="imgs/storeImg/'+res.anotherBook[i].bookSrc+'" alt="otherbook"></a><p>'+res.anotherBook[i].bookName+'</p></li>';
								frag.appendChild(item);
								}
								relaBookUl.appendChild(frag);
							}
							// 点击收藏
							collectBtn.onclick = function() {
								Detail.prototype.getCookieModule(function(cookie){
									if(cookie.get('user')){
										user = JSON.parse(cookie.get('user'));
										count++;
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
														if(res.status=='success'){
															// 绑定收藏方法
															Detail.prototype.getLikeInfo('收藏成功');
														}else {
															Detail.prototype.getLikeInfo('收藏失败');
														}
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
								})
							};
							// 获取书籍评论
							Detail.prototype.getComment(sentData,res.bookDetail);
						}
					}
				})
			})
		},
		// 获取书籍评论
		getComment: function(bookId,data){
			var oCommentUl = doc.querySelector('#comments ul');
			var oCommentNum = doc.getElementById('comments-n');
			// 获取书籍评论
			this.getAjaxModule(function(ajax) {
				ajax({
					url: '/',
					data: {
						act: 'getBookComment',
						bookId: bookId
					},
					method: 'get',
					error: function(status){
						console.log('error：'+status);
					},
					success: function(res){
						var res = JSON.parse(res);
						console.log(res);
						if(res.status=='success'){
							var data = res.data;
							// 渲染数据
							oCommentNum.innerHTML = data.length;
							Detail.prototype.renderBookComment(data,oCommentUl);
							// 执行书籍评论
							Detail.prototype.replyComment();
							// 添加评论方法
							Detail.prototype.addComment(bookId,oCommentUl,oCommentNum);
							// 添加删除函数
							Detail.prototype.delReply(oCommentNum);
						}else {
							console.log('书籍评论获取失败');
						}
					}
				})
			})
		},
		// 评论
		addComment: function(bookId,oUl,oCommentN){
			var commentContent = doc.getElementsByName('add-comment-content')[0],
					oSub = doc.querySelector('#add-comment button');
			oSub.onclick = function(){
				if(commentContent.value!='') {
					Detail.prototype.getCookieModule(function(cookie){
						if(cookie.get('user')){
							user = JSON.parse(cookie.get('user'));
							// 发送请求
							Detail.prototype.getAjaxModule(function(ajax){
								ajax({
									url: '/',
									data: {
										act: 'addBookComment',
										bookId: bookId,
										askUserId: user.userId,
										askUserName: user.userName,
										askContent: commentContent.value
									},
									method: 'post',
									error: function(err){
										console.log('err:'+err);
									},
									success: function(res){
										res = JSON.parse(res);
										console.log(res);
										if(res.status = 'success'){
											// 评论成功
											Detail.prototype.getLikeInfo('评论成功');
											oCommentN.innerHTML=parseInt(oCommentN.innerHTML)+1;
											// 添加节点
											var item = doc.createElement('li');
											item.innerHTML = '<h3>'+user.userName+'</h3>'+commentContent.value+'<p>'+Detail.prototype.getNowTime()+'</p><em class="delComment">删除</em>';
											item.setAttribute('data-askId',res.askId);
											item.setAttribute('data-userId',user.userId);
											oUl.appendChild(item);
											commentContent.value = '';
											// 添加删除函数
											Detail.prototype.delReply();
										}else {
											// 评论失败
											Detail.prototype.getLikeInfo('评论失败');
										}
									}
								})
							})
						}else {
							var con = confirm('您还没登陆，登录即可发表评论，登录吗?');
							if(con) {
								// 打开登录框
								doc.getElementById("regitLog").style.display = 'block';
								doc.getElementsByClassName('login')[0].style.display = 'block';
							}
						}
					})
				}
			};
		},
		// 回复
		replyComment: function(){
			var aReplyBtn = doc.getElementsByClassName('reply');
					aReplyLi = doc.querySelectorAll('#comments ul li'),
					aCommentName = doc.querySelectorAll('#comments ul li h3'),
					commentContent = doc.getElementsByName('add-comment-content')[0],
					oSub = doc.querySelector('#add-comment button');
			for(var i=0,len=aReplyBtn.length;i<len;i++) {
				(function(i){
					aReplyBtn[i].onclick = function(){
						commentContent.focus();
						commentContent.value = '@'+aCommentName[i].innerHTML+'\n';
					};
				})(i)
			}
		},
		// 删除回复
		delReply: function(oCommentNum){
			var oCommentUl = doc.querySelector('#comments ul');
			var aDelBtn = doc.querySelectorAll('.delComment');
			for(var i=0,len=aDelBtn.length;i<len;i++){
				(function(i){
					var askId = aDelBtn[i].parentNode.getAttribute('data-askId');
					aDelBtn[i].onclick = function(){
						var con = confirm('确定删除该评论吗');
						if(con){
							Detail.prototype.getAjaxModule(function(ajax){
								ajax({
									url: '/',
									data: {
										act: 'delBookComment',
										askId: askId
									},
									method: 'get',
									error: function(err){
										alert('删除失败，请稍候重试');
									},
									success: function(res){
										res = JSON.parse(res);
										console.log(res);
										if(res.status=='success'){
											// 删除成功
											Detail.prototype.getLikeInfo('删除成功');
											oCommentNum.innerHTML = parseInt(oCommentNum.innerHTML)-1;
										}else {
											// 删除失败
											Detail.prototype.getLikeInfo('删除失败');
										}
									}
								})
							})
							oCommentUl.removeChild(aDelBtn[i].parentNode);
						}
					};
				})(i)
			}
		},
		// 渲染书籍评论
		renderBookComment: function(data,oUl){
			var frag = doc.createDocumentFragment();
      console.log('user:'+user);
			for(var i=0,len=data.length;i<len;i++) {
				var item = doc.createElement('li');
				var commentName = '';
				if(data[i].toWhoName){
					commentName = data[i].askUserName+'@'+data[i].toWhoName;
				}else {
					commentName = data[i].askUserName;
				}
				if(user&&data[i].askUserId==user.userId){
					item.innerHTML = '<h3>'+data[i].askUserName+'</h3>'+data[i].askContent+'<p>'+data[i].askTime+'</p><em class="delComment">删除</em>';
				}else {
					item.innerHTML = '<h3>'+data[i].askUserName+'</h3>'+data[i].askContent+'<p>'+data[i].askTime+'</p><em class="reply">回复</em>';
				}
				item.setAttribute('data-askId',data[i].askId);
				item.setAttribute('data-userId',data[i].askUserId);
				frag.appendChild(item);
				oUl.appendChild(frag);
			}
		},
		// 提示信息
		getLikeInfo: function(msg){
			var likeInfo = doc.getElementById('likeInfo');
			likeInfo.innerHTML = msg;
			likeInfo.style.opacity = '1';
			var timer = setTimeout(function(){
				likeInfo.style.opacity = '0';
			},1000)
		},
    // 获取header模块
		getHeaderModule: function(){
			seajs.use('header.js',function(header){
				// header部分的事件委托
		        header.headerEvent();
		        // 登录注册部分的事件委托
		        header.regitLogin();
		        // 滚动操作header阴影
		        header.scrollHeader();
			})
		},
    // 获取当前时间
		getNowTime: function(){
			var TIME = '';
		  var date = new Date(),
		      year = date.getFullYear(),
		      month = (date.getMonth()+1).toString().length<2?"0"+(date.getMonth()+1).toString():date.getMonth()+1,
		      day = date.getDate().toString().length<2?"0"+date.getDate().toString():date.getDate(),
					hours = date.getHours().toString().length<2?"0"+date.getHours().toString():date.getHours(),
					minutes = date.getMinutes().toString().length<2?"0"+date.getMinutes().toString():date.getMinutes(),
					seconds = date.getSeconds().toString().length<2?"0"+date.getSeconds().toString():date.getSeconds();
		  TIME = year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
		  return TIME;
		},
    // 获取时间绑定模块
		getDoEventModule: function(){
			seajs.use('doEvent.js',function(doEvent){
				console.log(doEvent);
			})
		},
    // 获取添加书籍模块
		getAddStore: function(){
			seajs.use('addStore.js',function(ADDSTORE){
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
