(function(window,document){
	var doc = document;
	function Detail(){
		this.init();
		// 获取header模块方法并执行
		this.getHeaderModule();
		// 获取DoEventModule模块方法并执行
		this.getDoEventModule();
		// 获取add-store模块方法
		this.getAddStore();
	}
	Object.defineProperty(Detail.prototype,'constructor',{
		enumerable: false,
		value: Detail
	});
	Detail.prototype = {
		init: function(){
			// var sentData = window.location.search.split('?')[1].split('=')[1];
			//获取书籍基本信息
			this.getAjaxModule(function(ajax){
				ajax({
					url: '/',
					data: {act:'getBookDetail',bookId:'4'},
					method: 'get',
					error: function(status){
						alert('error:'+status);
					},
					success: function(res){
						var data = JSON.parse(res);
						console.log(data);
					}
				})
			})
			// 获取书籍评论
			this.getAjaxModule(function(ajax) {
				ajax({
					url: '/',
					data: {act: 'getBookComment',bookId:'4'},
					method: 'get',
					error: function(status){
						alert('error：'+status);
					},
					success: function(res){
						var data = JSON.parse(res);
						console.log(data);
					}
				})
			})
			// 获取其他书籍信息
			
		},
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
		getAddStore: function(){
			seajs.use('addStore.js',function(ADDSTORE){
				console.log(ADDSTORE);
			})
		},
		getAjaxModule: function(callback){
			seajs.use('ajax.js',function(ajax){
				callback&&callback(ajax);
			})
		}
	}
	var detail = new Detail();
})(window,document)
