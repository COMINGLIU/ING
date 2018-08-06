define(function(require,exports,module){
	var doc = document;
	var preventSqlWords = /select|insert|update|delete|exec|count|'|"|=|<|>|%/i;
	function AddStore() {
		// 打开添加小店
		this.openAddStore();
		// 文件上传
		this.fileUpload();
	}
	Object.defineProperty(AddStore.prototype,'constructor',{
		enumerable: false,
		value: AddStore
	})
	AddStore.prototype = {
		// 打开开店表单
		openAddStore: function(){
			var oAddStoreBox = doc.getElementById("add-store");
			var oAddStoreCloseBtn = doc.getElementById("addStoreCloseBtn");
			oAddStoreCloseBtn.onclick = function(){
				console.log(1);
				oAddStoreBox.style.height = '0';
			}
		},
		// 提交表单
		fileUpload: function(){
			var oForm = doc.getElementById("add-store").getElementsByTagName('form')[0];
			var formEle = {
				oImg: oForm.querySelector('input[name="storeImg"]'),
				oName: oForm.querySelector('input[name="storeName"]'),
				oDescribe: oForm.querySelector('textarea'),
				oSubBtn: oForm.querySelector("button[type='submit']"),
				oJump: doc.getElementById("jump")
			};
			var oheaderImg = doc.getElementById("headerImg");
			var user;
			if(this.getCookieModule().get('user')) {
				user = JSON.parse(this.getCookieModule().get('user'));
			}
			var file,data;
			formEle.oImg.onchange = function(){
				file = this.files[0];
				// 将图片放在data里
				data = new FormData();
				console.log(user);
				data.append('userId',user.userId);
				data.append('act','storeInfo');
				data.append('img',file);
				// 将图片放在内容框里
				var obj = new FileReader(file);
				obj.readAsDataURL(file);
				obj.onload = function(){
					oheaderImg.src = this.result;
				}
			}
			oForm.onsubmit = function(e){
				e = e||window.e;
				e.preventDefault?e.preventDefault():e.returnValue = false;
			};
			formEle.oSubBtn.onclick = function(){
				console.log(formEle.oName.value);
				console.log(formEle.oDescribe.value);
				if(formEle.oImg.value==""||formEle.oName.value==""||formEle.oDescribe.value==""){
					alert('请将信息填写完整');
				}else {
					if(preventSqlWords.test(formEle.oName.value)==true||preventSqlWords.test(formEle.oDescribe.value)==true){
						alert('不要尝试输入sql特殊字符或脚本，没戏');
					}else {
						data.append('storeName',formEle.oName.value==undefined?"":formEle.oName.value);
						data.append('storeDescribe',formEle.oDescribe.value==undefined?"":formEle.oDescribe.value);
						console.log(data);
						var xhr = new XMLHttpRequest();
						xhr.onreadystatechange = function(){
							if(xhr.readyState==4){
								if(xhr.status==200||xhr.readyState==304){
									var data = JSON.parse(xhr.responseText);
									console.log(data);
									if(data.status == 'success'){
										var con = confirm('注册成功，跳转去看看');
										if(con) {
											window.location.href = 'addBook.html?userId='+user.userId+'&userName='+user.userName;
										}
										// 成功
										formEle.oJump.style.display = 'inline-block';
										formEle.oJump.onclick = function(){
											window.location.href = 'addBook.html?userId='+user.userId+'&userName='+user.userName;
										}
										// 重置用户信息isSeller=1
										user.isSeller = '1';
										AddStore.prototype.getCookieModule().set('user',JSON.stringify(user));
										console.log(AddStore.prototype.getCookieModule().get('user'));
									}else if(data.status == 'fail') {
										//失败
										alert('注册失败');
									}
								}else {
									console.log('error:'+xhr.status);
								}
							}
						}
						xhr.open('post','/',true);
						xhr.send(data);
					}
				}
			}
		},
		getCookieModule: function(){
			 var cookie = require('cookie.js');
			 return cookie;
		}
	};
	var addStore = new AddStore();
	module.exports = addStore;
})
