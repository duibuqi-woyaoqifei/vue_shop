export default (oldObj, newObj) => {
    for (let i in oldObj) {
        if (oldObj[i] !== newObj[i]) return true
    }
    for (let i in newObj) {
        if (oldObj[i] !== newObj[i]) return true
    }
    return false
}