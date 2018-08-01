define(function(require,exports,module){
  function preventSql(value){
    var str = /select|update|delete|exec|count|'|"|=|<|>|%/i;
    if(str.test(value)==true){
      return true;
    }else {
      return false;
    }
  }
  module.exports = preventSql;
})
