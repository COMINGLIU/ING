define(function(require,exports,module){
    var cookieUtil = {
      get: function(name) {
        var cookieName = encodeURIComponent(name)+'=',
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null;
        if(cookieStart>-1){
          var cookieEnd = document.cookie.indexOf(';',cookieStart);
          if(cookieEnd==-1){
            cookieEnd = document.cookie.length;
          }
          cookieValue = docodeComponent(document)
        }
      }
    }
})
