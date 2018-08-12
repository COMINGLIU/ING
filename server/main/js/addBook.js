(function(window,document){
	var doc = document;
	var user;
	var SHOPPERID = window.location.search.split('?')[1].split('&')[0].split('=')[1];
	var bookUl = doc.getElementById('uped'),
			bookList = bookUl.getElementsByClassName('bookInfo');
	var booksInfo = {
		imgFile: doc.getElementsByName('bookImg'),
		href: bookUl.getElementsByTagName('a'),
		img: bookUl.getElementsByTagName('img'),
		name: doc.getElementsByName('bookName'),
		num: doc.getElementsByName('bookNum'),
		public: doc.getElementsByName('bookPublish'),
		class: doc.getElementsByName('bookClass'),
		price: doc.getElementsByName('bookPrice'),
		describe: doc.getElementsByName('bookDes'),
	};
	function AddBook(){
		// 拉数据
		this.init();
		// 打开添加书籍
		this.openAddBook();
		// 控制头部阴影
		this.aboutHeader();
		// 编辑书籍信息
		// this.editBookInfo();
		// logo跳转
		this.logo();
	}
	Object.defineProperty(AddBook.prototype,'constructor',{
		enumerable: false,
		value: AddBook
	})
	AddBook.prototype = {
		// 拉数据
		init: function(){
			var oSearch = window.location.search.split('?')[1],
					oUserId = oSearch.split('&')[0].split('=')[1],
					oUserName = oSearch.split('&')[1].split('=')[1];
			// console.log(booksInfo);
			this.getCookieModule(function(cookie){
				if(cookie.get('user')){
					user = cookie.get('user');
					AddBook.prototype.getAjaxModule(function(ajax){
						ajax({
							url: '/',
							data: {
								act: 'getOneAllStoreBooksForShopper',
								shopperId: oUserId
							},
							method: 'get',
							error: function(err){
								console.log('err:'+err);
							},
							success: function(res){
								res = JSON.parse(res);
								console.log(res);
								if(res.status =='success'){
									doc.getElementById('userName').innerHTML = res.shopperName+' ('+oUserName+')';
									var data = res.data;
									// 渲染数据
									AddBook.prototype.renderData(data);
									// 给每个li绑定删除书籍的操作
									AddBook.prototype.delBook();
									// 给每个li绑定修改书籍信息的操作
									AddBook.prototype.editBookInfo();
									// 添加书籍
									AddBook.prototype.addBook(data);
									//挑战到store
									AddBook.prototype.gotoStore(oUserId);
								}else {
									alert('您请求的信息不存在');
								}
							}
						})
					})
				}else {
					var con = confirm('您还没登陆，不能进行任何操作,点击确定前往首页登录');
					if(con) {
						window.location.href = 'index.html';
					}
				}
			})
		},
		// 渲染数据
		renderData: function(data){
			// 渲染节点
			if(data.length<bookList.length){
				var bookListTmp = doc.querySelectorAll('#uped .bookInfo');
				if(data.length==0) {
					for(var i=1,len=bookListTmp.length;i<len;i++) {
						bookUl.removeChild(bookListTmp[i]);
					}
				}else {
					for(var i=data.length,len=bookListTmp.length;i<len;i++) {
						bookUl.removeChild(bookListTmp[i]);
					}
				}
			}else if(data.length>bookList.length) {
				var frag = doc.createDocumentFragment();
				for(var i=bookList.length,len=data.length;i<len;i++) {
					var item = bookList[0].cloneNode(true);
					frag.appendChild(item);
				}
				bookUl.appendChild(frag);
			}
			// 渲染数据
			for(var i=0,len=bookList.length;i<len;i++) {
				booksInfo.href[i].href += data[i].bookId;
				booksInfo.img[i].src = 'imgs/storeImg/'+data[i].bookSrc;
				booksInfo.name[i].value = data[i].bookName;
				booksInfo.num[i].value = data[i].bookAllNum;
				booksInfo.public[i].value = data[i].bookPublic;
				booksInfo.class[i].value = data[i].bookType;
				booksInfo.price[i].value = data[i].bookPrice;
				booksInfo.describe[i].value = data[i].bookDescribe;
			}
		},
		// 删除书籍
		delBook: function(){
			var oBookUl = doc.getElementById('uped'),
          oBookList = doc.querySelectorAll('#uped>li'),
          bookDelBtn = oBookUl.getElementsByClassName('del');
			for(var j=0,len2=bookDelBtn.length;j<len2;j++) {
				(function(j){
					var bookId = booksInfo.href[j].href.split('?')[1].split('=')[1];
					bookDelBtn[j].onclick = function(){
						var con = confirm('确认下架该书籍吗?删除之后它将从您的书店移除');
						if(con) {
							// 删除书籍
							AddBook.prototype.getAjaxModule(function(ajax){
								ajax({
									url: '/',
									data: {
										act: 'delShopperBook',
										bookId: bookId
									},
									method: 'get',
									error: function(err){
										console.log('err:'+err);
									},
									success: function(res){
										res = JSON.parse(res);
										console.log(res);
                    if(res.status=='success'){
                      AddBook.prototype.editOkInfo('删除成功');
                      // 删除节点
                      oBookUl.removeChild(oBookList[j]);
                      // 给每个li绑定修改书籍信息的操作
    									AddBook.prototype.editBookInfo();
                    }
									}
								})
							})
						}
					}
				})(j)
			}
		},
		// 添加书籍
		addBook: function(){
			var oForm = doc.querySelector("#add form");
			var formEle = {
				bookImg: doc.getElementsByName("add-bookImg")[0],
				bookName: doc.getElementsByName("add-bookName")[0],
				bookAllNum: doc.getElementsByName("add-bookNum")[0],
				bookPublic: doc.getElementsByName("add-bookPublish")[0],
				bookClass: doc.getElementsByName("add-bookClass")[0],
				bookPrice: doc.getElementsByName("add-bookPrice")[0],
				bookDes: oForm.getElementsByTagName('textarea')[0]
			};
			var book_img = doc.querySelector("#add-img img");
			var subBtn = doc.getElementsByName("submit")[0],
					cancelBtn = doc.getElementsByName("cancel")[0];
			var file,data;
			formEle.bookImg.onchange = function(){
				console.log(this.files[0]);
				file = this.files[0];
				data = new FormData();
				data.append('act','addBook');
				// 填写shopperId
				data.append('shopperId',SHOPPERID);
				// 填写userName
				data.append('userName','QPQ');
				data.append('bookImg',file);
				// 以下代码是将图片放在网页框中
				var obj = new FileReader(file);
				obj.readAsDataURL(file);
				obj.onload = function(){
					book_img.src = this.result;
				};
			};
			oForm.onsubmit = function(e){
				e = e||window.e;
				e.preventDefault?e.preventDefault():e.returnValue = false;
			};
			subBtn.onclick = function(){
				data.append('bookName',formEle.bookName.value);
				data.append('bookAllNum',formEle.bookAllNum.value);
				data.append('bookPublic',formEle.bookPublic.value);
				data.append('bookClass',formEle.bookClass.value);
				data.append('bookPrice',formEle.bookPrice.value);
				data.append('bookDes',formEle.bookDes.value);
				var xhr = AddBook.prototype.createXHR();
				xhr.onreadystatechange = function() {
					if(xhr.readyState==4) {
						if((xhr.status>=200&&xhr.status<300)||xhr.status==304) {
							var res = JSON.parse(xhr.responseText);
							console.log(res);
							if(res.status=='success'){
								alert(res.msg);
								oForm.reset();
								book_img.src = '';
							}else {
								alert(res.msg);
							}
						}else {
							alert('error:'+xhr.status);
						}
					}
				};
				xhr.open('post','/',true);
				xhr.send(data);
			}
		},
		// 打开添加书籍
		openAddBook: function(){
			var oAddBtn = doc.getElementById("addBtn"),
					oDelBtn = doc.getElementById('delBtn'),
					oAddBox = doc.getElementById("add"),
					count = 0;
			oAddBtn.onclick = function(){
				oAddBox.style.height = "700px";
				oAddBtn.innerHTML = '-';
				oDelBtn.innerHTML = '-';
			};
			oDelBtn.onclick = function(){
				oAddBox.style.height = "0";
				oAddBtn.innerHTML = '+';
				oDelBtn.innerHTML = '+';
			};
		},
		aboutHeader: function(){
			var oHeader = doc.getElementById("header");
			window.onscroll = function(){
					if(document.documentElement.scrollTop>100){
					oHeader.style.boxShadow = '0 0 10px #ccc';
				}else {
					oHeader.style.boxShadow = '0 0 0 transparent';
				}
			}

		},
		// 更改书籍信息
		editBookInfo: function(){
			var aEditBtns = doc.getElementsByClassName("icon-edit-square"),
					aFormList = doc.querySelectorAll('.bookInfo form');
			for(var i=0,len=aEditBtns.length;i<len;i++) {
				(function(i){
					var aBookInput = bookList[i].getElementsByTagName("input"),
							oBookTextarea = bookList[i].getElementsByTagName("textarea")[0],
							aEditSubResetBtn = bookList[i].getElementsByTagName("button"),
							aBookImgLi = bookList[i].querySelector('li:first-child'),
							bookId = booksInfo.href[i].href.split('?')[1].split('=')[1],
							bookListInfo = {
								bookSrc: booksInfo.imgFile[i],
								bookName: booksInfo.name[i],
								bookAllNum: booksInfo.num[i],
								bookPublic: booksInfo.public[i],
								bookType: booksInfo.class[i],
								bookPrice: booksInfo.price[i],
								bookDescribe: booksInfo.describe[i]
							};
					// 修改书籍信息
					var newEditBookInfo,newImgFile;
					// 创建formdata
					newEditBookInfo = new FormData();
					// 取消表单默认行为
					aFormList[i].onsubmit = function(e){
						e = e||window.e;
						e.preventDefault?e.preventDefault():e.returnValue=false;
					};
					// 点击编辑按钮
					aEditBtns[i].onclick = function(){
						oBookTextarea.readOnly = false;
						for(var j=0,len2 = aBookInput.length;j<len2;j++){
							aBookInput[j].readOnly = false;
							aBookInput[j].style.borderBottom = '1px solid #ccc';
							aEditSubResetBtn[0].style.width = 'auto';
							aEditSubResetBtn[1].style.width = 'auto';
							aBookImgLi.style.visibility = 'visible';
						}
						for(var key in bookListInfo) {
							(function(key){
								bookListInfo[key].onchange = function(){
									if(newEditBookInfo.has(key)) {
										newEditBookInfo.set(key,bookListInfo[key].value);
									}else {
										newEditBookInfo.append(key,bookListInfo[key].value);
									}
								}
							})(key)
						}
						booksInfo.imgFile[i].onchange = function(){
							newImgFile = this.files[0];
							// 将图片文件展示在框内
							var obj = new FileReader(newImgFile);
							obj.readAsDataURL(newImgFile);
							obj.onload = function(){
								// console.log(this.result);
								booksInfo.img[i].src = this.result;
							};
							newEditBookInfo.append('bookNewImg',newImgFile);
						};
					};
					aEditSubResetBtn[0].onclick = function(){
						if(newEditBookInfo.has('act')){
							newEditBookInfo.set('act','editBookInfo');
						}else {
							newEditBookInfo.append('act','editBookInfo');
						}
						if(newEditBookInfo.has('bookId')){
							newEditBookInfo.set('bookId',bookId);
						}else {
							newEditBookInfo.append('bookId',bookId);
						}
						var xhr = AddBook.prototype.createXHR();
						xhr.onreadystatechange = function(){
							if(xhr.readyState==4){
								if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
									var res = JSON.parse(xhr.responseText);
									if(res.status=='success'){
										AddBook.prototype.editOkInfo('修改成功');
										oBookTextarea.readOnly = false;
										for(var j=0,len2 = aBookInput.length;j<len2;j++){
											aBookInput[j].readOnly = true;
											aBookInput[j].style.borderBottom = '0';
											aEditSubResetBtn[0].style.width = '0';
											aEditSubResetBtn[1].style.width = '0';
											aBookImgLi.style.visibility = 'hidden';
										}
									}else {
										alert('修改失败,请稍候重试');
									}
								}
							}
						}
						xhr.open('post','/',true);
						xhr.send(newEditBookInfo);
					};
					// 取消修改
					aEditSubResetBtn[1].onclick = function(){
						oBookTextarea.readOnly = true;
						for(var j=0,len2 = aBookInput.length;j<len2;j++){
							aBookInput[j].readOnly = true;
							aBookInput[j].style.borderBottom = '0';
							aEditSubResetBtn[0].style.width = '0';
							aEditSubResetBtn[1].style.width = '0';
              aBookImgLi.style.visibility = 'hidden';
							// 重新渲染数据
						}
					};
				})(i);
			}
		},
    // 提示信息
		editOkInfo: function(msg){
			var oInfo = doc.getElementById('editOkInfo');
      oInfo.innerHTML = msg;
			oInfo.style.opacity = '1';
			var timer = setTimeout(function(){
				oInfo.style.opacity = '0';
				clearTimeout(timer);
			},1500)
		},
		logo: function(){
			var oLogo = doc.getElementById('logo');
			oLogo.onclick = function(){
				window.location.href = 'index.html';
			}
		},
		// 点击前往小店中心 id:userName
		gotoStore: function(storeId){
			var oBtn = doc.getElementById('userName');
			oBtn.onclick = function(){
				window.location.href = 'them1.html?storeId='+storeId;
			};
		},
		// 创建ajax的对象实例
		createXHR: function(){
				if(typeof XMLHttpRequest!="undefined"){
						return new XMLHttpRequest();
				}else if(typeof ActiveXObject!="undefined"){
						if(typeof arguments.callee.activeXString!="string"){
								// 兼容到IE7之前的版本
								var versions=['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'];
								for(var i=0,len=versions.length;i<len;i++) {
										try{
												new ActiveXObject(versions[i]);
												arguments.callee.activeXString=versions[i];
												break;
										}catch(ex){
												throw new Error();
										}
								}
						}
						// 兼容IE
						return new ActiveXObject(arguments.callee.activeXString);
				}else {
						throw new Error("No XHR object available");
				}
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
	var addBook = new AddBook();
})(window,document);
