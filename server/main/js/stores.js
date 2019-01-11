(function(window,document){
	var doc = document;
	var user;
	function Stores() {
		this.init();
		// 获取header部分方法并执行
		this.getHeaderModule();
		// 获取add-store部分方法并执行
		this.getAddStoreModule();
	}
	Object.defineProperty(Stores.prototype,'constructor',{
		enumerable: false,
		value: Stores
	})
	Stores.prototype = {
		// 拉数据
		init: function(){
			var storeUl = doc.getElementById('store-list');
			var storeInfo = {
					storeList: storeUl.getElementsByTagName('li'),
					atoreHref: storeUl.getElementsByTagName('a'),
					storeImg: storeUl.getElementsByTagName('img'),
					storeName: storeUl.getElementsByClassName('storeName'),
					storeDes: storeUl.getElementsByClassName('store-slogan'),
					storeTime: storeUl.getElementsByClassName('store-time')
			};
			this.getAjaxModule(function(ajax){
				ajax({
					url: '/',
					data: {
						act: 'getAllStores'
					},
					method: 'get',
					error: function(err){
						console.log('err:'+err);
					},
					success: function(res){
						res = JSON.parse(res);
						if(res.status=='success'){
							data = res.data;
							console.log(data);
						// 渲染数据
						if(data.length>0){
							var frag = doc.createDocumentFragment();
							for(var i=0,len=data.length;i<len;i++) {
								var item = doc.createElement('li');
								item.innerHTML = '<div class="store-info"><a target="_blank" href="them1.html?storeId='+data[i].userId+'"><div class="store-img"><img src="imgs/storeImg/'+data[i].shopperImg+'"></div></a><h3 class="store-name"><span class="storeName">'+data[i].shopperName+'</span></h3><p class="store-slogan"><i class="iconfont icon-detail"></i>'+data[i].shopperDescribe+'</p><p><i class="iconfont icon-liebiaoyedizhi"></i>'+data[i].schoolName+'</p><P><i class="iconfont icon-heart-fill"></i>收藏</P></div><p class="store-time">'+data[i].shopperTime+'</p>';
								frag.appendChild(item);
							}
							storeUl.appendChild(frag);
						}
						// 添加书籍收藏
							Stores.prototype.addStoreLike();
						}else {
							console.log('数据拉去失败');
						}
					}
				})
			})
		},
		// 添加书店收藏
		addStoreLike: function(){
			var aLikeBtn = doc.querySelectorAll('#store-list i.icon-heart-fill'),
			 		aStoreHref = doc.querySelectorAll('.store-info a');
			for(var i=0,len=aLikeBtn.length;i<len;i++) {
				(function(i){
					var storeId = aStoreHref[i].href.split('?')[1].split('=')[1];
					aLikeBtn[i].onclick = function(){
						Stores.prototype.getCookieModule(function(cookie){
							if(cookie.get('user')){
								user = JSON.parse(cookie.get('user'));
								aLikeBtn[i].style.color = '#900';
								Stores.prototype.getAjaxModule(function(ajax){
									ajax({
										url: '/',
										data: {
											act: 'collectStore',
											userId: user.userId,
											storeId: storeId
										},
										method:'get',
										error: function(err){
											console.log('err:'+err);
										},
										success: function(res){
											res = JSON.parse(res);
											console.log(res);
											if(res.status=='success'){
												Stores.prototype.getLikeInfo();
											}else {
												alert('收藏失败');
											}
										}
									})
								})
							}else {
								var con = confirm('登录才能保存您收藏的书店，登录吗?');
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
		// likeInfo
		getLikeInfo: function(){
			var likeInfo = doc.getElementById('likeInfo');
			likeInfo.style.opacity = '1';
			var timer = setTimeout(function(){
				likeInfo.style.opacity = '0';
			},1000)
		},
		// 获取header部分方法并执行
		getHeaderModule: function(){
			seajs.use('header.js',function(HEADER){
				// header部分的事件委托
				HEADER.headerEvent();
		        // 登录注册部分的事件委托
		        HEADER.regitLogin();
		        // 滚动操作header阴影
		        HEADER.scrollHeader();
			})
		},
		// 获取add-store部分方法并执行
		getAddStoreModule: function(){
			seajs.use('addStore.js',function(ADDSTORE){
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
	}
	var stores = new Stores();
})(window,document);
