(function(window,document){
	var doc = document;
	function Them1(){
		this.controlHeaderShadow();
		this.logo();
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
		// logo
		logo: function(){
			var oLogo = doc.getElementById('logo');
			// console.log(oLogo);
			oLogo.onclick = function(){
				console.log(1);
				window.location.href = 'index.html';
			}
		}
	};
	var them1 = new Them1();
})(window,document);
