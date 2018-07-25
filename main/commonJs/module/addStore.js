define(function(require,exports,module){
	var doc = document;
	function AddStore() {
		this.openAddStore();
	}
	Object.defineProperty(AddStore.prototype,'constructor',{
		enumerable: false,
		value: AddStore
	})
	AddStore.prototype = {
		openAddStore: function(){
			var oAddStoreBox = doc.getElementById("add-store");
			var oAddStoreCloseBtn = doc.getElementById("addStoreCloseBtn");
			oAddStoreCloseBtn.onclick = function(){
				console.log(1);
				oAddStoreBox.style.height = '0';	
			}	
		}
	};
	var addStore = new AddStore();
	module.exports = addStore;
})
