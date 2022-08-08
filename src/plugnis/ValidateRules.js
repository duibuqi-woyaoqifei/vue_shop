// 表单校验规则
const validatePassword = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入密码"));
    } else if (value.match(/[^a-zA-Z0-9]/) !== null) {
        callback(new Error("密码不能包含非法字符"));
    } else if (value.length < 6 || value.length > 18) {
        callback(new Error("密码长度在6到18个字符之间"));
    }
    callback();
};
const validateEmail = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入邮箱地址"));
    } else if (
        value.match(
            /^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        ) === null
    ) {
        callback(new Error("无效的邮箱地址"));
    }
    callback();
};
const validatePhone = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入手机号"));
    } else if (
        !value.match(
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        )
    ) {
        callback(new Error("请输入正确的手机号"));
    }
    callback();
};


export { validatePassword, validateEmail, validatePhone }