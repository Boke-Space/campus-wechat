import dayjs from "dayjs"

export function dateToSecond(dataTime: any) {
    return dayjs(dataTime).format('YYYY-MM-DD HH:mm:ss')
}

// 中国格式化时间转时间
export function dateToTime(time: any) {
    let date = new Date(time)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
}

// 获取当前一周的时间
export function getWeekTime() {
    var currentFirstDate;
    var formatDate = function(date) {
      var year = date.getFullYear() + "-";
      var month = date.getMonth() + 1 + "/";
      var day = date.getDate() + "";

      return year + month + day;
    };

    var addDate = function(date, n) {
      date.setDate(date.getDate() + n);
      return date;
    };

    var setDate = function(date) {
      var week = date.getDay() - 1;
      date = addDate(date, week * -1);
      currentFirstDate = new Date(date);

      var arr: any[] = [];
      for (var i = 0; i < 7; i++) {
        var a = formatDate(i == 0 ? date : addDate(date, 1)); //星期一开始
        arr.push(a);
      }
      return arr;
    };
    setDate(new Date());
    var num = 0; //num为0时表示当前周，递增或递减时周数也递增或递减
    let setWeek = setDate(addDate(currentFirstDate, 7 * num));
    const weekList = setWeek.map(item => item.substring(5, 10))
    return weekList
}

// 判断当前时间是否大于目标时间
export function timeCompare(time: string) {
  let currentTime = Date.parse(dateToTime((new Date())))
  let targetTIme = Date.parse(time)
  return currentTime > targetTIme
}
