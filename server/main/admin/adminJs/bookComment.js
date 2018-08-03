(function(window,document){
  var doc = document;
  var bookComment = {
    // 打开评论详情
    openCommentDetail: function(){
      var aCommentLi = doc.querySelectorAll('.bookCommentInfo>li:not(:nth-child(1))>ul li:last-child'),
          oCommentDetailBox = doc.getElementById('commentDetail'),
          oCloseComment = doc.querySelector('#commentDetail .close');
      for(var i=0,len=aCommentLi.length;i<len;i++) {
        (function(i){
          aCommentLi[i].onclick = function(){
            oCommentDetailBox.style.display = 'block';
          };
        })(i)
      }
      oCloseComment.onclick = function() {
        oCommentDetailBox.style.display = 'none';
      }
    }
  };
  bookComment.openCommentDetail();
})(window,document)
