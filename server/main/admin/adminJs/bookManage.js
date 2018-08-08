(function(window,document){
  var doc = document;
  var bookManage = {
    // 拉数据
    init: function(){
      var oBookInfoUl = doc.querySelector('#content .bookInfo');
      this.getAjaxModule(function(ajax){
        ajax({
          url: '/',
          data: {
            act: "getBookInfo",
            adminAcount: window.sessionStorage.getItem('adminUser')
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
              if(res.data.length==0) {
                alert('没有对应的数据');
              }else {
                // 渲染数据
                // oBookInfoUl
                bookManage.readerData(data,oBookInfoUl);
                bookManage.openBookDetail();
              }
            }else {
              alert(res.msg);
            }
          }
        })
      })
    },
    // 打开搜索书店
    openSearch: function(){
      var oSearchBtn = doc.getElementById('search'),
          oSearchBox = doc.getElementById('search-box'),
          oCloseSearch = doc.querySelector('#search-box .close'),
          oSearchKey = doc.getElementsByName('search-check')[0],
          oSearchValue = doc.getElementsByName('search-content')[0];
      oSearchBookInfoUl = doc.querySelector('#search-box .bookInfo');
      oSearchBtn.onclick = function(){
        oSearchBox.style.display = 'block';
      };
      oCloseSearch.onclick = function(){
        oSearchBox.style.display = 'none';
      };
      oSearchValue.onchange = function(){
        var aSearchBookLi = oSearchBookInfoUl.querySelectorAll('#search-box .bookInfo>li');
        if(aSearchBookLi.length>1) {
          for(var i=1,len=aSearchBookLi.length;i<len;i++) {
            oSearchBookInfoUl.removeChild(aSearchBookLi[i]);
          }
        }
        bookManage.getAjaxModule(function(ajax){
          ajax({
            url: '/',
            data: {
              act: 'searchBookInfo',
              searchKey: oSearchKey.value,
              searchValue: oSearchValue.value
            },
            method: 'get',
            error: function(err){
              console.log(err);
            },
            success: function(res){
              res = JSON.parse(res);
              console.log(res);
              if(res.status=='success'){
                var data = res.data;
                if(data.length==0) {
                  alert('没有对应的数据');
                }else {
                  bookManage.readerData(data,oSearchBookInfoUl);
                  bookManage.openBookDetail();
                }
              }else {
                alert('err:'+res.msg);
              }
            }
          })
        })
      }
    },
    // 渲染数据
    readerData: function(data,bookManagerInfoUl){
      var frag = doc.createDocumentFragment();
      for(var i=0,len=data.length;i<len;i++) {
        var item = doc.createElement('li');
        item.innerHTML = '<ul><li>'+data[i].bookId+'</li><li>'+data[i].bookName+'</li><li>'+data[i].bookPulic+'</li><li>'+data[i].bookType+'</li><li>'+data[i].bookPrice+'</li><li>'+data[i].bookTime+'</li><li>'+data[i].shopperName+'</li><li>'+data[i].bookDescribe+'</li><li><i class="iconfont icon-lajixiang"></i></li></ul>';
        frag.appendChild(item);
      }
      bookManagerInfoUl.appendChild(frag);
    },
    // 打开口号详情
    openBookDetail: function(){
      var aLiBookDes = doc.querySelectorAll('.bookInfo>li:not(:nth-child(1))>ul li:nth-child(8)'),
          oBookDetail = doc.getElementById('bookDetail'),
          oSloganContent = doc.querySelector('#bookDetail p'),
          oCloseBookDetail = doc.querySelector('#bookDetail .close');
      for(var i=0,len=aLiBookDes.length;i<len;i++) {
        (function(i){
          aLiBookDes[i].onclick = function(){
            oBookDetail.style.display = 'block';
            oSloganContent.innerHTML = aLiBookDes[i].innerHTML;
          }
        })(i)
      }
      oCloseBookDetail.onclick = function(){
        oBookDetail.style.display = 'none';
      }
    },
    // 删除店铺
    delBook: function(){
      var aDelBtn = doc.querySelectorAll('.bookInfo>li:not(:nth-child(1))>ul li:nth-child(9)');
          aDelBookId = doc.querySelectorAll('.bookInfo>li:not(:nth-child(1))>ul li:nth-child(1)');
      for(var i=0,len=aDelBtn.length;i<len;i++) {
        (function(i){
          aDelBtn[i].onclick = function(){
            var con = confirm('确认删除该书籍吗?');
            if(con) {
              // 删除书店操作
              bookManage.getAjaxModule(function(ajax){
                ajax({
                  url: '/',
                  data: {
                    act: 'delSomeBook',
                    bookId: aDelBookId[i].innerHTML
                  },
                  method: 'get',
                  error: function(err){
                    console.log("err:"+err);
                  },
                  success: function(res){
                    res = JSON.parse(res);
                    console.log(res);
                  }
                })
              })
            }
          }
        })(i)
      }
    },
    getAjaxModule: function(cb){
      seajs.use('ajax.js',function(ajax){
        cb&&cb(ajax);
      })
    }
  };
  bookManage.init();
  bookManage.openSearch();
  bookManage.openBookDetail();
  bookManage.delBook();
})(window,document);
