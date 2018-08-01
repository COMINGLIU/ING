(function(window,document){
	var doc = document;
	function AddBook(){
		this.controlAddBook();
		this.aboutHeader();
		this.editBookInfo();
		this.logo();
	}
	Object.defineProperty(AddBook.prototype,'constructor',{
		enumerable: false,
		value: AddBook
	})
	AddBook.prototype = {
		controlAddBook: function(){
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
	};
	var addBook = new AddBook();
})(window,document);
