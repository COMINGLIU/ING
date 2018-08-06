define(function(require,exports,module){
  function collectBook(){
    var oCollectBtn = document.getElementById('collects'),
        oCollectBox = document.getElementById('collets-box'),
        aCollectLi = oCollectBox.getElementsByTagName('li'),
        aCollectHref = oCollectBox.getElementsByTagName('a'),
        aCollectName = oCollectBox.getElementsByTagName('h3'),
        aCollectAddr = oCollectBox.getElementsByClassName('addr'),
        aCollectPrice = oCollectBox.getElementsByClassName('price'),
        aCollectDelBtn = oCollectBox.getElementsByClassName('icon-lajixiang'),
        count = 0;
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
                data = res.data;
                console.log(data);
                // 渲染节点
                if(data.length<aCollectLi.length){
                  if(data.length==0) {
                    for(var i=1,len=aCollectLi.length;i<len;i++) {
                      oCollectBox.removeChild(aCollectLi[i]);
                    }
                  }else {
                    for(var i=data.length,len=aCollectLi.length;i<len;i++) {
                      oCollectBox.removeChild(aCollectLi[i]);
                    }
                  }
                }else if(data.length>aCollectLi.length) {
                  var frag = document.createDocumentFragment();
                  for(var i=aCollectLi.length,len=data.length;i<len;i++) {
                    var item= aCollectLi[0].cloneNode(true);
                    frag.appendChild(item);
                  }
                  oCollectBox.appendChild(frag);
                }
                // 渲染数据
                for(var j=0,len2 = aCollectLi.length;j<len2;j++) {
                  aCollectHref[j].href += data[j].bookId;
                  aCollectName[j].innerHTML = data[j].bookName;
                  aCollectAddr[j].innerHTML = data[j].schoolName;
                  aCollectPrice[j].innerHTML = data[j].bookPrice;
                }
                // 删除收藏
                for(var k=0,len3=aCollectDelBtn.length;k<len3;k++) {
                  (function(k){
                    var bookId = aCollectHref[k].href.split('?')[1].split('=')[1];
                    aCollectDelBtn[k].onclick = function(){
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
