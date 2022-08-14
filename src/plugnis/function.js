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


// 深度遍历对象
const DepthForEach = (obj, content) => {

    for (let i in obj) {
        if (typeof obj[i] === "object") {
            DepthForEach(obj[i], content)
        } else {
            if (obj[i] === content) {

            }
        }

    }
}

export { IsEdit, DepthForEach }