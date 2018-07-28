define(function(require,exports,module){
	var doc = document;
	function AddStore() {
		this.openAddStore();
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
			// var userId = JSON.parse(window.sessionStorage.getItem('user')).userId;
			var file,data;
			formEle.oImg.onchange = function(){
				console.log();
				file = this.files[0];
				// 将图片放在data里
				data = new FormData();
				// data.append('userId',userId);
				data.append('userId','3');
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
				data.append('storeName',formEle.oName.value);
				data.append('storeDescribe',formEle.oDescribe.value);
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function(){
					if(xhr.readyState==4){
						if(xhr.status==200||xhr.readyState==304){
							var data = JSON.parse(xhr.responseText);
							console.log(data);
							if(data.status == 'success'){
								// 成功
								formEle.oJump.style.display = 'inline-block';
								formEle.oJump.onclick = function(){
									// window.location.href = 'them1.html?userId='+userId;
									window.location.href = 'addBook.html?userId=3';
								}
							}else if(data.status == 'fail') {
								//失败
								alert('您已出册过该帐号');
							}
						}else {
							console.log('error:'+xhr.status);
						}
					}
				}
				xhr.open('post','/',true);
				xhr.send(data);
			}
		},
	};
	var addStore = new AddStore();
	module.exports = addStore;
})
