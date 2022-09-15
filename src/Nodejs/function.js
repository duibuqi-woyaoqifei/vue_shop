// IsEdit比较两个对象数据是否一样,一样返回false,不一样返回true
const IsEdit = (oldObj, newObj) => {
    for (let i in oldObj) {
        if (oldObj[i] !== newObj[i]) return true
    }
    for (let i in newObj) {
        if (oldObj[i] !== newObj[i]) return true
    }
    return false
}


// 节流 , const ? = Throttle(fn,delay) ,使用函数 ?(...arg) , fn 在 delay 毫秒内只能被调用一次
const Throttle = (fn, delay) => {
    let timer = null;
    return function (...arg) {
        if (timer) return
        fn(...arg)
        timer = setTimeout(() => {
            timer = null
        }, delay)
    }
}

// 首字母转换成小写或大写
const InitialConvertCase = (str, upperLower) => {
    if (typeof str !== "string") {
        throw new TypeError("Not string")
    }
    let initial = str.charAt(0)
    const upperArr = ["upper", "Upper", "大写", "首字母大写"]
    const lowerArr = ["lower", "Lower", "小写", "首字母小写"]
    if (upperArr.indexOf(upperLower) !== -1) {
        return str = initial.toUpperCase() + str.slice(1)
    }
    if (lowerArr.indexOf(upperLower) !== -1) {
        return str = initial.toLowerCase() + str.slice(1)
    }
    if (initial === initial.toUpperCase()) {
        return str = initial.toLowerCase() + str.slice(1)
    }
    if (initial === initial.toLowerCase()) {
        return str = initial.toUpperCase() + str.slice(1)
    }
}

// 驼峰转下划线,拆分单词
const SplitWord = (str) => {
    let newStr = ""
    for (let i in str) {
        if (i == 0) {
            newStr += str[i].toLowerCase()
            continue
        }
        if (str[i] === str[i].toUpperCase()) {
            newStr += "_" + str[i].toLowerCase()
        } else {
            newStr += str[i]
        }
    }
    return newStr
}

// 获取当前时间
const GetNow = () => {
    const YY = new Date().getFullYear();
    const MM = new Date().getUTCMonth() + 1;
    const DD = new Date().getDate();
    const HH =
        new Date().getHours() < 10
            ? "0" + new Date().getHours()
            : new Date().getHours();
    const mm =
        new Date().getMinutes() < 10
            ? "0" + new Date().getMinutes()
            : new Date().getMinutes();
    const ss =
        new Date().getSeconds() < 10
            ? "0" + new Date().getSeconds()
            : new Date().getSeconds();
    const currentTime = HH + ":" + mm + ":" + ss;
    const currentDay = YY + "年" + MM + "月" + DD + "日";

    const weeks = ["日", "一", "二", "三", "四", "五", "六"];
    const week = weeks[new Date().getDay()];

    return currentDay + " " + currentTime
}


module.exports = {
    IsEdit,
    Throttle,
    InitialConvertCase,
    SplitWord
}