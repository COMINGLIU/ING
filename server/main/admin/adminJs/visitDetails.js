(function(window,document){
  var doc = document;
  var visitDetails = {
    // 打开搜索
    openSearch: function(){
      var oSearchBtn = doc.getElementById('search'),
          oSearchBox = doc.getElementById('search-box'),
          oCloseSearch = doc.querySelector('#search-box .close');
      oSearchBtn.onclick = function(){
        oSearchBox.style.display = 'block';
      };
      oCloseSearch.onclick = function(){
        oSearchBox.style.display = 'none';
      }
    },
    init: function(){
      var visitUl = doc.querySelector('#content .visitInfo');
      this.getAjaxModule(function(ajax){
        ajax({
          url: '/',
          data: {
            act: 'getVisitDetails'
          },
          method: 'get',
          error: function(err){
            console.log('err:'+err);
          },
          success: function(res){
            res = JSON.parse(res);
            console.log(res);
            if(res.data.toString()==''){
              alert('暂时没有人访问');
            }else {
              // 渲染数据
              data = res.data;
              visitDetails.renderData(data,visitUl);
            }
          }
        })
      })
    },
    searchotherDay: function(){
      var oTime = doc.getElementsByName('date')[0],
          oSub = doc.getElementsByName('sub')[0];
      oSub.onclick = function(){
        var oSearchVisitUl = doc.querySelector('#search-box .bottom .visitInfo');
        aSearchVisitLi = oSearchVisitUl.querySelectorAll('#search-box .bottom .visitInfo>li');
        console.log(aSearchVisitLi);
        if(oTime) {
          if(aSearchVisitLi.length>1){
            for(var i=1,len=aSearchVisitLi.length;i<len;i++) {
              oSearchVisitUl.removeChild(aSearchVisitLi[i]);
            }
          }
          visitDetails.getAjaxModule(function(ajax){
            ajax({
              url: '/',
              data: {
                act: 'getVisitDetails',
                dayTime: oTime.value
              },
              method: 'get',
              error: function(err){
                console.log('err:'+err);
              },
              success: function(res){
                res = JSON.parse(res);
                console.log(res);
                if(res.status=='success'){
                  var data=res.data;
                  if(data.toString()==""){
                    alert('暂无人访问');
                  }else {
                    // 渲染数据
                    visitDetails.renderData(data,oSearchVisitUl);
                  }
                }
              }
            })
          })
        }
      }

    },
    renderData: function(data,visitUl){
      var frag = doc.createDocumentFragment();
      for(var i=0,len=data.length;i<len;i++) {
        var item = doc.createElement('li');
        item.innerHTML = "<ul><li>"+data[i].userId+"</li><li>"+data[i].userName+"</li><li>"+data[i]["COUNT(loginlog.userId)"]+"</li></ul>";
        frag.appendChild(item);
      }
      visitUl.appendChild(frag);
    },
    getAjaxModule: function(cb){
      seajs.use('ajax.js',function(ajax){
        cb&&cb(ajax);
      })
    }
  };
  visitDetails.init();
  visitDetails.openSearch();
  visitDetails.searchotherDay();
})(window,document)
