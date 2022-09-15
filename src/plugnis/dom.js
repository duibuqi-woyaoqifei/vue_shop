import { Throttle } from "./function";
import { isRef, ref } from "vue";

// 对话框
// 对话框取消操作 DialogCancel(对话框开关,表单ref对象)
const DialogCancel = (dialogSwitch, formRef) => {
    if (isRef(dialogSwitch)) {
        dialogSwitch.value = false;
    } else {
        ref(dialogSwitch).value = false
    }
    if (formRef === undefined) return;
    setTimeout(() => {
        formRef.value.resetFields();
    }, 300);
};
// 对话框确认操作 DialogSubmit(表单信息,操作名称,表单ref对象)
const DialogSubmit = Throttle((info, operation, req, formRef, resolve) => {
    if (formRef === undefined) {
        const requestContent = {
            pendingUpdateData: {
                operation,
                ...info,
                currentUsername: req.queryInfo.currentUsername
            },
            req
        };
        return req.Sets(requestContent, resolve);
    }
    formRef.value.validate(async (isValid) => {
        if (!isValid) {
            return ElMessage({
                message: "信息填写错误！",
                type: "error",
                showClose: true,
            });
        }
        const requestContent = {
            pendingUpdateData: {
                operation,
                ...info,
                currentUsername: req.queryInfo.currentUsername
            },
            req
        };
        await req.Sets(requestContent, resolve);
    });
}, 300)


export { DialogCancel, DialogSubmit }