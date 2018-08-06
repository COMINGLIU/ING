(function(window,document){
	var doc = document;
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
					aBookImg = oBookUl.getElementsByTagName('img'),
					aBookName = oBookUl.getElementsByClassName('book-name'),
					aBookDes = oBookUl.getElementsByClassName('book-describe'),
					aBookPublic = oBookUl.getElementsByClassName('book-public'),
					aBookAllNum = oBookUl.getElementsByClassName('book-allNum'),
					aBookPrice = oBookUl.getElementsByClassName('book-price');
			console.log(aBookLi);
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
								if(data.length==0) {
									for(var i=1,len=aBookLi.length;i<len;i++) {
										oBookUl.removeChild(aBookLi[i]);
									}
								}else {
									for(var i=data.length,len=aBookLi.length;i<len;i++) {
										console.log(aBookLi[i]);
										oBookUl.removeChild(aBookLi[i]);
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
								aBookName[k].innerHTML = data[k].bookName;
								aBookDes[k].innerHTML = data[k].bookDescribe;
								aBookPublic[k].innerHTML = data[k].bookPublic;
								aBookAllNum[k].innerHTML = data[k].bookAllNum;
								aBookPrice[k].innerHTML = data[k].bookPrice;
							}
						}else {
							alert('获取数据失败，请稍候重试');
						}
					}
				})
			})
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
		}
	};
	var them1 = new Them1();
})(window,document);
