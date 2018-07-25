(function(window,document){
	var doc = document;
	function AddBook(){
		this.controlAddBook();
		this.aboutHeader();
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

		}
	};
	var addBook = new AddBook();
})(window,document);