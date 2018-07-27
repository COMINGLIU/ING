(function(window,document){
	var doc = document;
	function Stores() {
		// 获取header部分方法并执行
		this.getHeaderModule();
		// 获取add-store部分方法并执行
		this.getAddStoreModule();
	}
	Object.defineProperty(Stores.prototype,'constructor',{
		enumerable: false,
		value: Stores
	})
	Stores.prototype = {
		// 获取header部分方法并执行
		getHeaderModule: function(){
			seajs.use('header.js',function(HEADER){
				console.log(HEADER);
				// header部分的事件委托
				HEADER.headerEvent();
		        // 登录注册部分的事件委托 
		        HEADER.regitLogin();
		        // 滚动操作header阴影
		        HEADER.scrollHeader();
			})
		},
		// 获取add-store部分方法并执行
		getAddStoreModule: function(){
			seajs.use('addStore.js',function(ADDSTORE){
				console.log(ADDSTORE);
			})
		}
	}
	var stores = new Stores();
})(window,document);