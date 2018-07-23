(function(window,document){
	var doc = document;
	function Detail(){
		// 获取header模块方法并执行
		this.getHeaderModule();
		// 获取DoEventModule模块方法并执行
		this.getDoEventModule();
		// 获取ajax模块方法
		// this.getAjaxModule();
	}
	Object.defineProperty(Detail.prototype,'constructor',{
		enumerable: false,
		value: Detail 
	});
	Detail.prototype = {
		getHeaderModule: function(){
			seajs.use('header.js',function(header){
				console.log(header);
				// header部分的事件委托
		        header.headerEvent();
		        // 登录注册部分的事件委托 
		        header.regitLogin();
		        // 滚动操作header阴影
		        header.scrollHeader();
			})
		},
		getDoEventModule: function(){
			seajs.use('doEvent.js',function(doEvent){
				console.log(doEvent);
			})
		},
		getAjaxModule: function(){
			seajs.use('ajax.js',function(ajax){
				console.log(ajax);
			})
		}
	}
	var detail = new Detail();
})(window,document)