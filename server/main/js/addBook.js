(function(window,document){
	var doc = document;
	function AddBook(){
		// 添加书籍
		this.addBook();
		// 打开添加书籍
		this.openAddBook();
		// 控制头部阴影
		this.aboutHeader();
		// 编辑书籍信息
		this.editBookInfo();
		// logo跳转
		this.logo();
	}
	Object.defineProperty(AddBook.prototype,'constructor',{
		enumerable: false,
		value: AddBook
	})
	AddBook.prototype = {
		// 添加书籍
		addBook: function(){
			var oForm = doc.querySelector("#add form");
			var formEle = {
				bookImg: doc.getElementsByName("add-bookImg")[0],
				bookName: doc.getElementsByName("add-bookName")[0],
				bookAllNum: doc.getElementsByName("add-bookNum")[0],
				bookPublic: doc.getElementsByName("add-bookPublish")[0],
				bookClass: doc.getElementsByName("add-bookClass")[0],
				bookPrice: doc.getElementsByName("add-bookPrice")[0]
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
				data.append('shopperId','shopperId');
				// 填写userName
				data.append('userName','QPQ');
				data.append('bookImg',file);
				// 以下代码是将图片放在网页框中
				var obj = new FileReader(file);
				obj.readAsDataURL(file);
				obj.onload = function(){
					book_img.src = this.result;
				}
			}
			oForm.onsubmit = function(e){
				e = e||window.e;
				e.preventDefault?e.preventDefault():e.returnValue = false;
			};
			subBtn.onclick = function(){
				data.append('bookName',formEle.bookName.value);
				data.append('bookAllNum',formEle.bookAllNum.value);
				data.append('bookPubic',formEle.bookPubic.value);
				data.append('bookClass',formEle.bookClass.value);
				data.append('bookPrice',formEle.bookPrice.value);
				var xhr = AddBook.prototype.createXHR();
				xhr.onreadystatechange = function() {
					if(xhr.readyState==4) {
						if((xhr.satus>=200&&xhr.status<300)||xhr.status==304) {
							var data = xhr.responseText;
							console.log(data);
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
			var oAddBtn = doc.getElementById("addBtn");
			var oAddBox = doc.getElementById("add");
			var count = 0;
			oAddBtn.onclick = function(){
				count++;
				if(count%2==1){
					oAddBox.style.height = "700px";
				}else {
					oAddBox.style.height = "0";
				}
			}
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
				aBookInfoLis = doc.getElementsByClassName("bookInfo");
			for(var i=0,len=aEditBtns.length;i<len;i++) {
				(function(i){
					var aBookInput = aBookInfoLis[i].getElementsByTagName("input"),
						aEditSubResetBtn = aBookInfoLis[i].getElementsByTagName("button");
					aEditBtns[i].onclick = function(){
						for(var j=0,len2 = aBookInput.length;j<len2;j++){
							aBookInput[j].readOnly = false;
							aBookInput[j].style.borderBottom = '1px solid #ccc';
							aEditSubResetBtn[0].style.width = 'auto';
							aEditSubResetBtn[1].style.width = 'auto';
						}
					};
					aEditSubResetBtn[0].onclick = function(){
						// 调用ajax发送请求
					};
					aEditSubResetBtn[1].onclick = function(){
						for(var j=0,len2 = aBookInput.length;j<len2;j++){
							aBookInput[j].readOnly = true;
							aBookInput[j].style.borderBottom = '0';
							aEditSubResetBtn[0].style.width = '0';
							aEditSubResetBtn[1].style.width = '0';
						}
					};
				})(i);
			}
		},
		// logo
		logo: function(){
			var oLogo = doc.getElementById('logo');
			oLogo.onclick = function(){
				window.location.href = 'index.html';
			}
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
		}
	};
	var addBook = new AddBook();
})(window,document);
