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
			var oHeadName = doc.querySelector('#header h1');
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
							var data = res.data;
							// 填入店名
							oHeadName.innerHTML = res.shopperInfo.shopperName+' ('+res.shopperInfo.schoolName+')';
							// 渲染节点
              if(data.length>0){
                var frag = doc.createDocumentFragment();
                for(var i=0,len=data.length;i<len;i++) {
                  var item = doc.createElement('li');
                  item.className = 'transfrom-speedup';
                  item.innerHTML = '<a href="detail.html?bookId='+data[i].bookId+'" target="blank"><div class="img"><img src="imgs/storeImg/'+data[i].bookSrc+'"></div></a><i class="iconfont icon-heart-fill"></i><h3 class="book-name">'+data[i].bookName+'</h3><p class="book-describe">'+data[i].bookDescribe+'</p><p class="book-public">'+data[i].bookPublic+'</p><p>库存：<span class="book-allNum">'+data[i].bookAllNum+'</span>本</p><p>单价：￥<span class="book-price">'+data[i].bookPrice+'</span></p>';
                  frag.appendChild(item);
                }
                oBookUl.appendChild(frag);
              }
							// 点击收藏书籍
							Them1.prototype.ClickcollectBook();
						}else {
							// alert(res.msg);
              Them1.prototype.getNoBooksInfo();
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
    // 没有书籍反馈
    getNoBooksInfo: function(){
      var oInfo = doc.getElementById('noBooksInfo');
      oInfo.style.opacity = '1';
      var timer = setTimeout(function(){
        oInfo.style.opacity = '0';
        clearTimeout(timer);
      },1500)
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
