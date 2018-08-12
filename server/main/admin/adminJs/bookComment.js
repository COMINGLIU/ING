(function(window,document){
  var doc = document;
  var bookComment = {
    init: function(){
      this.getAjaxModule(function(ajax){
        ajax({
          url:'/',
          data: {
            act: 'getAllBookComment'
          },
          method: 'get',
          error: function(err){
            alert('err:'+err);
          },
          success: function(res){
            res = JSON.parse(res);
            console.log(res);
            if(res.status=='success'){
              var data = res.data;
              // 渲染数据
              bookComment.renderData(data);
              // 打开评论详情
              bookComment.openCommentDetail();
            }else {
              alert('数据拉去失败，请稍候重试');
            }
          }
        })
      })
    },
    // 渲染数据
    renderData: function(data){
      var oUl = doc.querySelector('#content .bookCommentInfo');
      var frag = doc.createDocumentFragment();
      for(var i=0,len=data.length;i<len;i++) {
        var item = doc.createElement('li');
        item.innerHTML = '<ul><li>'+data[i].bookId+'</li><li>'+data[i].bookName+'</li><li>'+data[i].shopperId+'</li><li>'+data[i].askUserId+'</li><li>'+data[i].askUserName+'</li><li>'+data[i].askTime+'</li><li>'+data[i].askContent+'</li></ul>';
        frag.appendChild(item);
      }
      oUl.appendChild(frag);
    },
    // 打开评论详情
    openCommentDetail: function(){
      var aCommentLi = doc.querySelectorAll('.bookCommentInfo>li:not(:nth-child(1))>ul li:last-child'),
          oCommentDetailBox = doc.getElementById('commentDetail'),
          oCommentContent = doc.querySelector('#commentDetail p'),
          oCloseComment = doc.querySelector('#commentDetail .close');
      for(var i=0,len=aCommentLi.length;i<len;i++) {
        (function(i){
          aCommentLi[i].onclick = function(){
            oCommentDetailBox.style.display = 'block';
            oCommentContent.innerHTML = aCommentLi[i].innerHTML;
          };
        })(i)
      }
      oCloseComment.onclick = function() {
        oCommentDetailBox.style.display = 'none';
      }
    },
    getAjaxModule: function(cb){
      seajs.use('ajax.js',function(ajax){
        cb&&cb(ajax);
      })
    }
  };
  bookComment.init();
})(window,document)
