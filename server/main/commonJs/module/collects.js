define(function(require,exports,module){
  function collectBook(){
    var oCollectBtn = document.getElementById('collects'),
        oCollectNum = oCollectBtn.getElementsByClassName('num')[0];
        oCollectBox = document.getElementById('collets-box'),
        oColletctLi = oCollectBox.getElementsByTagName('li'),
        aCollectHref = oCollectBox.getElementsByTagName('a'),
        aCollectDelBtn = oCollectBox.getElementsByClassName('icon-lajixiang'),
        count = 0;
    var likeInfo = document.getElementById('likeInfo');
    var ajax = require('ajax.js');
    var cookie = require('cookie.js');
    oCollectBtn.onclick = function(){
      count++;
      if(cookie.get('user')&&cookie.get('user')!=""){
        user = JSON.parse(cookie.get('user'))
        if(count%2==1){
          oCollectBox.style.width = '200px';
          ajax({
            url: '/',
            data: {
              act: 'getColllectBooks',
              userId: user.userId
            },
            method: 'get',
            error: function(err){
              console.log('err:'+err);
            },
            success: function(res){
              res = JSON.parse(res);
              console.log(res);
              if(res.status=='success'){
                var data = res.data;
                var frag = document.createDocumentFragment();
                oCollectNum.innerHTML = data.length;
                // 渲染节点
                if(oColletctLi.length>0) {
                  oColletctLiTmp = document.querySelectorAll('#collets-box li');
                  for(var i=0,len=oColletctLiTmp.length;i<len;i++) {
                    oCollectBox.removeChild(oColletctLiTmp[i]);
                  }
                }
                for(var i=0,len=data.length;i<len;i++) {
                  var item = document.createElement('li');
                  item.innerHTML = '<a target="blank" href="detail.html?bookId='+data[i].bookId+'"><h3>'+data[i].bookName+'</h3><p><i class="iconfont icon-liebiaoyedizhi"></i><span class="addr">'+data[i].schoolName+'</span></p><p>￥<span class="price">'+data[i].bookPrice+'</span></p></a><i class="iconfont icon-lajixiang"></i>';
                  frag.appendChild(item);
                }
                oCollectBox.appendChild(frag);
                // 删除收藏
                for(var k=0,len3=aCollectDelBtn.length;k<len3;k++) {
                  (function(k){
                    var bookId = aCollectHref[k].href.split('?')[1].split('=')[1];
                    aCollectDelBtn[k].onclick = function(e){
                      e = e||window.e;
                      e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
                      var con = confirm('确认取消收藏该书籍吗?');
                      if(con){
                        ajax({
                          url: '/',
                          data: {
                            act: 'cancelCollectBook',
                            userId: user.userId,
                            bookId: bookId
                          },
                          method: 'get',
                          error: function(err){
                            console.log('err:'+err);
                          },
                          success: function(res){
                            res = JSON.parse(res);
                            console.log(res);
                            if(res.status=='success'){
                              // 移除节点
                              oCollectBox.removeChild(aCollectDelBtn[k].parentNode);
                              // 数目减少
                              oCollectNum.innerHTML = oColletctLi.length;
                              // 提示信息
                              likeInfo.innerHTML = '已取消收藏';
                        			likeInfo.style.opacity = '1';
                        			var timer = setTimeout(function(){
                        				likeInfo.style.opacity = '0';
                                clearTimeout(timer);
                        			},1000)
                            }
                          }
                        })
                      }
                    }
                  })(k)
                }
              }else {
                confirm('获取信息失败，请稍候重试');
              }
            }
          })
        }else {
          oCollectBox.style.width = '0';
        }
      }else {
        var con = confirm('登录即可查看收藏的书籍，登录吗？');
        if(con) {
          console.log(1);
          document.getElementById('regitLog').style.display = "block";
          document.getElementsByClassName('login')[0].style.display = 'block';
        }
      }
    };
  }
  module.exports = collectBook;
})
