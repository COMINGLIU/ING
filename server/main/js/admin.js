(function(window,document){
  var doc = document;
  var preventSqlWords = /select|insert|update|delete|exec|script|count|'|"|=|<|>|%/i;
  var telReg = /(^1[3|4|5|8]\d{9}$)/;
  function Admin() {
    // 判断用户是否在登录状态
    this.init();
    this.login();
    // 打开响应式菜单
    this.openMenu();
    // 切换菜单
    this.checkMenu();
  }
  Object.defineProperty(Admin.prototype,'constructor',{
    enumerable: false,
    value: Admin
  })
  Admin.prototype = {
    // 判断用户是否在
    init: function(){
      var adminUser;
      if(window.sessionStorage.getItem('adminUser')) {
        adminUser = window.sessionStorage.getItem('adminUser');
        console.log(adminUser);
        doc.getElementById('loginBox').style.display = 'none';
      }
    },
    // 登录
    login: function(){
      var oForm = doc.getElementById("login-form");
      var formEle = {
        userAcount: doc.getElementsByName('acount')[0],
        userPass: doc.getElementsByName('pass')[0]
      };
      var oLoginBtn = doc.getElementsByName('sub')[0];
      var oLoginOkInfo = doc.getElementById('loginOk');
      oForm.onsubmit = function(e){
        e = e||window.e;
        e.preventDefault?e.preventDefault():e.returnValue=false;
      };
      var loginArr=[];
      // 判断输入是否合法
      for(var key in formEle) {
        (function(key){
          formEle[key].onchange = function(){
            if(preventSqlWords.test(formEle[key].value)) {
              console.log(doc.getElementById(key));
              doc.getElementById(key).innerHTML = '不要尝试输入sql等特殊字符，没戏';
              formEle[key].style.borderBottomColor = '#f00';
              if(loginArr.indexOf(key)==-1) {
                loginArr.push(key);
              }
            }else {
              doc.getElementById(key).innerHTML = '';
              formEle[key].style.borderBottomColor = '#ccc';
            }
            if(key == 'userAcount') {
              if(!telReg.test(formEle[key].value)) {
                doc.getElementById(key).innerHTML = '格式不对';
                formEle[key].style.borderBottomColor = '#f00';
                if(loginArr.indexOf(key)==-1) {
                  loginArr.push(key);
                }
              }else {
                doc.getElementById(key).innerHTML = '';
                formEle[key].style.borderBottomColor = '#ccc';
              }
            }

          }
        })(key)
      }
      // 点击提交登录
      oLoginBtn.onclick = function(){
        if(formEle.userAcount.value!=''&&formEle.userPass.value!=''&&loginArr.length==0) {
          Admin.prototype.getAjaxModule(function(ajax) {
            ajax({
              url: '/',
              data: {
                act: 'adminLogin',
                userAcount: formEle.userAcount.value,
                userPass: formEle.userPass.value
              },
              method: "post",
              error: function(status) {
                alert('error:'+status);
              },
              success: function(res) {
                res = JSON.parse(res);
                console.log(res);
                if(res.status=='success') {
                  // 登录成功
                  window.sessionStorage.setItem('adminUser',res.user);
                  console.log(window.sessionStorage.getItem('adminUser'));
                  doc.getElementById('loginBox').style.display = 'none';
                }else if(res.status=='fail') {
                  // 登录失败
                  oLoginOkInfo.innerHTML = res.msg;
                }
              }
            })
          })
        }
      };
    },
    // 打开响应后的菜单
    openMenu: function(){
      var oMenuBtn = doc.getElementById('menu'),
          oMenu = doc.getElementById('content-menu');
      var count = 0;
      oMenuBtn.onclick = function(){
        count++;
        if(count%2==1) {
          oMenu.style.display = 'block';
          oMenuBtn.style.color = '#900';
        }else {
          oMenu.style.display = 'none';
          oMenuBtn.style.color = '#000';
        }
      }
    },
    // 切换菜单选项
    checkMenu: function(){
      var oMenu = doc.getElementById('content-menu'),
          aMenuLi = oMenu.getElementsByTagName('li'),
          oFrame = doc.querySelector('#content-center iframe');
      var oCloseUserAuth = doc.querySelector('#authNode .close');
      oCloseUserAuth.onclick = function(){
        doc.getElementById('authNode').style.display = 'none';
      };
      oMenu.onclick = function(e){
        e = e||window.e;
        var target = e.target||e.srcElement;
        for(var i=0,len=aMenuLi.length;i<len;i++) {
          aMenuLi[i].classList.remove('menuChange');
        }
        if(target.nodeName!='UL'){
          target.classList.add('menuChange');
        }
        switch(target.id) {
          case 'usersDetails':
            oFrame.src = 'admin/usersDetails.html';
            break;
          case 'storesDetails':
            oFrame.src = 'admin/storesDetails.html';
            break;
          case 'visitDetails':
            oFrame.src = 'admin/visitDetails.html';
            break;
          case 'bookManage':
            oFrame.src = 'admin/bookManage.html';
            break;
          case 'bookComment':
            oFrame.src = 'admin/bookComment.html';
            break;
          case 'message':
            oFrame.src = 'admin/message.html';
            break;
          case 'screen-talk':
            oFrame.src = 'admin/screenMsg.html';
            break;
          case 'authority-node':
            doc.getElementById('authNode').style.display = 'block';
            break;
        }
      }

    },
    getAjaxModule: function(cb){
      seajs.use('ajax.js',function(ajax){
        cb&&cb(ajax);
      })
    },
    getCookieModule: function(cb){
      seajs.use('cookie.js',function(cookie){
        cb&&cb(cookie);
      })
    }
  };
  var admin = new Admin();
})(window,document)
