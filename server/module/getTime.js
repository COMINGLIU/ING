function getNowTime() {
  var TIME = '';
  var date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth()+1,
      day = date.getDate();
  TIME = year+'-'+month+'-'+day;
  return TIME;
}
module.exports = getNowTime;
