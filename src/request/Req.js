import axios from "../plugnis/axios"
import { InitialConvertCase } from "../plugnis/function";
import { isRef, ref } from "vue";

// 访问角色列表
const ReqRoleList = (roleList, queryInfo) => {
    axios
        .get(axios.baseURL + "/roleList", JSON.stringify(queryInfo))
        .then((data) => {
            // 角色随机分配15个权限;
            // for (let i of data) {
            //   const permissionListLenth = permissionList.value.length;
            //   let permissionArr = [];
            //   let permissionOneArr = [];
            //   let permissionTwoArr = [];
            //   let permissionThreeArr = [];
            //   let numArr = [];
            //   for (let x = 0; x < 15; x++) {
            //     let num = Math.floor(Math.random() * permissionListLenth);
            //     while (numArr.indexOf(num) !== -1) {
            //       num = Math.floor(Math.random() * permissionListLenth);
            //     }
            //     permissionArr.push(permissionList.value[num]);
            //     numArr.push(num);
            //   }
            //   for (let y of permissionArr) {
            //     if (y.level === 0) {
            //       permissionOneArr.push(y);
            //     } else if (y.level === 1) {
            //       permissionTwoArr.push(y);
            //     } else {
            //       permissionThreeArr.push(y);
            //     }
            //   }
            //   i.permissionListOne = permissionOneArr;
            //   i.permissionListTwo = permissionTwoArr;
            //   i.permissionListThree = permissionThreeArr;
            // }

            for (let i of data) {
                if (i.permissionListOne) {
                    let arr = [];
                    for (let item of i.permissionListOne.split(",")) {
                        arr.push({
                            name: item,
                            level: 0,
                        });
                    }

                    i.permissionListOne = arr;
                }
                if (i.permissionListTwo) {
                    let arr = [];
                    for (let item of i.permissionListTwo.split(",")) {
                        arr.push({
                            name: item,
                            level: 1,
                        });
                    }

                    i.permissionListTwo = arr;
                }
                if (i.permissionListThree) {
                    let arr = [];
                    for (let item of i.permissionListThree.split(",")) {
                        arr.push({
                            name: item,
                            level: 2,
                        });
                    }

                    i.permissionListThree = arr;
                }
            }

            roleList.value = data

        })
        .catch((err) => {
            ElMessage({
                message: "请求超时！",
                type: "error",
                showClose: true,
            });
        });
};


// 相同请求
const reqList = ["PermissionList", "CommodityClassification", "CommodityParameterSetting", "Tags", "ProductList", "OrderList"];
let Reqs = {}
for (let item of reqList) {
    let reqName = "Req" + item;
    let lower = InitialConvertCase(item);
    Reqs[reqName] = (list, queryInfo, resolve) => {
        axios
            .get(axios.baseURL + "/" + lower, JSON.stringify(queryInfo))
            .then((data) => {
                if (item === "CommodityClassification") {
                    list.list2.value = (JSON.parse(JSON.stringify(data)))
                    const DeepForEach = (obj) => {
                        for (let i in obj) {
                            if (i === "level") {
                                if (obj[i] === 1) {
                                    delete obj.children
                                }
                            }
                            if (typeof obj[i] === "object") {
                                DeepForEach(obj[i]);
                            }
                        }
                    };
                    DeepForEach(list.list2.value)

                    list.list.value = data
                    return
                }
                if (list.list) {
                    if (isRef(list.list)) {
                        list.list.value = data
                    } else {
                        list.list = data
                    }
                } else if (isRef(list)) {
                    list.value = data
                } else {
                    list = ref(data)
                }


                if (resolve) {
                    resolve()
                }
            })
            .catch((err) => {
                ElMessage({
                    message: "请求超时！",
                    type: "error",
                    showClose: true,
                });
            });
    };
}

let Sets = {}
for (let item of reqList) {
    let reqName = "Set" + item;
    let lower = InitialConvertCase(item);
    Sets[reqName] = (requestContent, resolve) => {
        axios
            .post(axios.baseURL + "/" + lower + "/set", JSON.stringify(requestContent.pendingUpdateData))
            .then((data) => {
                if (data === "Added successfully") {
                    ElMessage({
                        message: "添加成功！",
                        type: "success",
                        showClose: true,
                    });
                }
                if (data === "Modified successfully") {
                    ElMessage({
                        message: "修改成功！",
                        type: "success",
                        showClose: true,
                    });
                }
                if (data === "Deleted successfully") {
                    ElMessage({
                        message: "删除成功！",
                        type: "success",
                        showClose: true,
                    });
                }
                if (requestContent.req) {
                    requestContent.req.Reqs({ list: requestContent.req.list, list2: requestContent.req.list2 }, requestContent.req.queryInfo, resolve)
                    if (requestContent.req.dialogSwitch) {
                        if (isRef(requestContent.req.dialogSwitch)) {
                            requestContent.req.dialogSwitch.value = false
                        } else {
                            requestContent.req.dialogSwitch = false
                        }
                    }
                }

            })
            .catch((err) => {
                console.log(err);
                ElMessage({
                    message: "请求超时！",
                    type: "error",
                    showClose: true,
                });
            });
    }
}


export { ReqRoleList, Reqs, Sets }


