(function(window,document){
	var doc = document;
	var user;
	function Them1(){
		// 拉数据
		this.init();
		// 控制头部阴影
		this.controlHeaderShadow();
		// logo跳转
		this.logo();
		// 收藏书籍
		this.collectBook();
	}
	Object.defineProperty(Them1.prototype,'constructor',{
		enumerable: false,
		value: Them1
	})
	Them1.prototype = {
		controlHeaderShadow: function(){
			var oHeader = doc.getElementById("header");
			window.onscroll = function(){
				if(document.documentElement.scrollTop>200) {
					oHeader.style.boxShadow = '0 0 10px #ccc';
				}else {
					oHeader.style.boxShadow = '0 0 0 transparent';
				}
			}
		},
		init: function(){
			var sendData = window.location.search.split('?')[1].split('=')[1];
			var oBookUl = doc.getElementsByClassName('bookUl')[0],
					aBookLi = oBookUl.getElementsByTagName('li'),
					aBookhref = oBookUl.getElementsByTagName('a'),
					aBookImg = oBookUl.getElementsByTagName('img'),
					aBookName = oBookUl.getElementsByClassName('book-name'),
					aBookDes = oBookUl.getElementsByClassName('book-describe'),
					aBookPublic = oBookUl.getElementsByClassName('book-public'),
					aBookAllNum = oBookUl.getElementsByClassName('book-allNum'),
					aBookPrice = oBookUl.getElementsByClassName('book-price');
			this.getAjaxModule(function(ajax){
				ajax({
					url: '/',
					data: {
						act: 'getOneAllStoreBooks',
						shopperId: sendData
					},
					method: 'get',
					error: function(err){
						console.log('err:'+err);
					},
					success: function(res){
						res = JSON.parse(res);
						console.log(res);
						if(res.status=='success'){
							data = res.data;
							// 渲染节点
							if(data.length<aBookLi.length){
								oTmpookLi = doc.querySelectorAll('.bookUl li');
								if(data.length==0) {
									for(var i=1,len=aBookLi.length;i<len;i++) {
										console.log(oTmpookLi[i]);
										oBookUl.removeChild(oTmpookLi[i]);
									}
								}else {
									for(var i=data.length,len=aBookLi.length;i<len;i++) {
										oBookUl.removeChild(oTmpookLi[i]);
									}
								}
							}else if(data.length>aBookLi.length){
								var frag = document.createDocumentFragment();
								for(var j=aBookLi.length,len2=data.length;j<len2;j++) {
									var item = aBookLi[0].cloneNode(true);
									frag.appendChild(item);
								}
								oBookUl.appendChild(frag);
							}
							// 渲染数据
							for(var k=0,len3=aBookLi.length;k<len3;k++) {
								// aBookImg[k].src = data[k].bookSrc;
								aBookhref[k].href += data[k].bookId;
								aBookName[k].innerHTML = data[k].bookName;
								aBookDes[k].innerHTML = data[k].bookDescribe;
								aBookPublic[k].innerHTML = data[k].bookPublic;
								aBookAllNum[k].innerHTML = data[k].bookAllNum;
								aBookPrice[k].innerHTML = data[k].bookPrice;
							}
							// 点击收藏书籍
							Them1.prototype.ClickcollectBook();
						}else {
							alert('获取数据失败，请稍候重试');
						}
					}
				})
			})
		},
		// 点击收藏书籍
		ClickcollectBook: function(){
			var aCollectBtn = doc.getElementsByClassName('icon-heart-fill'),
					aBookhref = doc.querySelectorAll('.bookUl a');
			for(var i=0,len=aCollectBtn.length;i<len;i++) {
				(function(i){
					var bookId = aBookhref[i].href.split('?')[1].split('=')[1];
					aCollectBtn[i].onclick = function(){
						Them1.prototype.getCookieModule(function(cookie){
							if(cookie.get('user')){
								user = JSON.parse(cookie.get('user'));
								aCollectBtn[i].style.color = '#900';
								Them1.prototype.getAjaxModule(function(ajax){
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
											Them1.prototype.getLikeInfo();
										}
									})
								})
							}else {
								var con = confirm('登陆后才能保存收藏，您还没登录，登录吗？');
								if(con) {
									doc.getElementById('regitLog').style.display = 'block';
	    						doc.getElementsByClassName('login')[0].style.display = 'block';
								}
							}
						})
					}
				})(i)
			}
		},
		// logo
		logo: function(){
			var oLogo = doc.getElementById('logo');
			// console.log(oLogo);
			oLogo.onclick = function(){
				console.log(1);
				window.location.href = 'index.html';
			};
		},
		// 收藏反馈
		getLikeInfo: function(){
			var likeInfo = doc.getElementById('likeInfo');
			likeInfo.style.opacity = '0.8';
			var timer = setTimeout(function(){
				likeInfo.style.opacity = '0';
			},1000)
		},
		// 收藏夹
		collectBook: function(){
			seajs.use('collects.js',function(fn){
				fn();
			})
		},
		getAjaxModule: function(cb){
			seajs.use('ajax.js',function(ajax){
				cb&&cb(ajax);
			})
		},
		getCookieModule: function(cb){
			seajs.use('cookie.js',function(cookie){
				cb&&cb(cookie);
			})
		}
	};
	var them1 = new Them1();
})(window,document);
