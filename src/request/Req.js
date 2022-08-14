import axios from "../plugnis/axios"

// 访问角色列表
const ReqRoleList = (roleList) => {
    axios
        .get(axios.baseURL + "/roleList")
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

// 访问权限列表
const ReqPermissionList = (permissionList) => {
    axios
        .get(axios.baseURL + "/permissionList")
        .then((data) => {
            for (let i in data) {
                permissionList.value.push(data[i]);
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


export { ReqRoleList, ReqPermissionList }