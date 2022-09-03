<template>
  <!-- 卡片视图 -->
  <el-card class="cardView">
    <!-- 添加角色按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" size="large" @click="AddRole"
          >添加角色</el-button
        >
      </el-col>
    </el-row>

    <el-scrollbar>
      <!-- 角色列表区域 -->
      <div class="roleListTable MedusaTable">
        <el-table
          :data="roleList"
          :expand-row-keys="expandRowArr"
          row-key="name"
        >
          <el-table-column type="expand">
            <template #header></template>
            <template #default="scope">
              <el-row class="roleRowCenter">
                <!-- 一级权限 -->
                <el-col :span="8" class="verticalCenter">
                  <el-row
                    v-for="(item, index) in scope.row.permissionListOne"
                    :key="index"
                  >
                    <el-col>
                      <el-tag
                        v-if="item.level === 0"
                        class="permissionTag"
                        size="large"
                        type="success"
                        closable
                        @close="RemovePermission(item, scope.row)"
                        >{{ item.name }}</el-tag
                      ></el-col
                    >
                  </el-row>
                </el-col>
                <!-- 二级权限 -->
                <el-col :span="8" class="verticalCenter">
                  <el-row
                    v-for="(item, index) in scope.row.permissionListTwo"
                    :key="index"
                  >
                    <el-col>
                      <el-tag
                        v-if="item.level === 1"
                        class="permissionTag"
                        size="large"
                        type="warning"
                        closable
                        @close="RemovePermission(item, scope.row)"
                      >
                        {{ item.name }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="8" class="verticalCenter">
                  <el-row
                    v-for="(item, index) in scope.row.permissionListThree"
                    :key="index"
                  >
                    <el-col>
                      <el-tag
                        v-if="item.level === 2"
                        class="permissionTag"
                        size="large"
                        type="danger"
                        closable
                        @close="RemovePermission(item, scope.row)"
                        >{{ item.name }}</el-tag
                      ></el-col
                    >
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50px"></el-table-column>
          <el-table-column label="角色名称" prop="name"></el-table-column>
          <el-table-column label="角色描述" prop="describe"></el-table-column>
          <el-table-column width="300px">
            <template #header> 操作 </template>
            <template #default="scope">
              <el-button type="primary" icon="Edit" @click="RoleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="Delete"
                @click="DeleteRole(scope.row)"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="Setting"
                @click="AssignRolePermissions(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-scrollbar>
  </el-card>

  <!-- 添加角色对话框 -->
  <el-dialog
    v-model="showAddRoleDialog"
    title="添加"
    @close="AddRoleDialogCancel"
  >
    <el-form
      :model="addRoleForm"
      ref="addRoleFormRef"
      :rules="addRoleListFormRules"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="addRoleForm.name" />
      </el-form-item>
      <el-form-item label="角色描述" prop="describe">
        <el-input v-model="addRoleForm.describe" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"
          ><el-button @click="AddRoleDialogCancel">取消</el-button></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="AddRoleDialogSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>

  <!-- 修改角色对话框 -->
  <el-dialog
    v-model="showEditRoleDialog"
    title="修改"
    @close="EditRoleDialogCancel"
  >
    <el-form
      :model="editRoleForm"
      ref="editRoleFormRef"
      :rules="editRoleListFormRules"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="editRoleForm.name" />
      </el-form-item>
      <el-form-item label="角色描述" prop="describe">
        <el-input v-model="editRoleForm.describe" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"
          ><el-button @click="EditRoleDialogCancel">取消</el-button></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="EditRoleDialogSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>

  <!-- 删除角色对话框 -->
  <el-dialog
    v-model="showDeleteRoleDialog"
    title="提示"
    @close="DeleteRoleCancel"
  >
    <el-icon color="#E59661" size="large" class="warningIcon"
      ><WarningFilled
    /></el-icon>
    <span> 此操作将永久删除该角色，是否继续？</span>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"
          ><el-button @click="DeleteRoleCancel">取消</el-button></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="DeleteRoleSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>

  <!-- 分配角色权限对话框 -->
  <el-dialog
    v-model="showAssignRolePermissionsDialog"
    @close="AssignRolePermissionsDialogCancel"
  >
    <el-transfer
      v-model="assignedPermissions"
      filterable
      filter-placeholder="搜索"
      :titles="['未分配', '已分配']"
      :data="permissionListArr"
    />
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"
          ><el-button @click="AssignRolePermissionsDialogCancel"
            >取消</el-button
          ></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="AssignRolePermissionsDialogSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "../plugnis/axios";
import { IsEdit } from "../plugnis/function";
import { Reqs, ReqRoleList } from "../request/Req";

// 数据
const assignedPermissions = ref([]); // 已分配权限
const currentUsername = window.localStorage.getItem("currentUsername"); //当前账号名
const expandRowArr = ref([]); //展开的行
const onOff = ref(true); // 开关
const permissionList = ref([]); //权限列表
const permissionListArr = ref([]); // 权限列表穿梭框版
const roleList = ref([]); // 角色列表
const showAddRoleDialog = ref(false); //删除角色对话框开关
const showAssignRolePermissionsDialog = ref(false); //分配角色权限对话框开关
const showDeleteRoleDialog = ref(false); //删除角色对话框开关
const showEditRoleDialog = ref(false); //修改角色对话框开关
// 添加角色对话框表单
const addRoleFormRef = ref(null);
const addRoleForm = reactive({
  name: "",
  describe: "",
});
// 已分配权限对象
const assignedPermissionsObj = reactive({
  index: "",
  permissionListOne: "",
  permissionListTwo: "",
  permissionListThree: "",
});
// 克隆体
const cloneArr = ref([]);
const cloneObj = reactive({});
// 删除角色表单
const deleteRoleForm = reactive({
  index: "",
});
// 修改角色对话框表单
const editRoleFormRef = ref(null);
const editRoleForm = reactive({
  name: "",
  describe: "",
});

// 添加角色列表表单校验规则
const validateRoleName = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("名称不能为空"));
  }
  for (let i of roleList.value) {
    if (value === i.name && value !== cloneObj.name) {
      callback(new Error("角色名称重复"));
    }
  }
  callback();
};
const addRoleListFormRules = reactive({
  name: [{ required: true, validator: validateRoleName, trigger: "blur" }],
  describe: [{ required: true, message: "写点啥儿吧...", trigger: "blur" }],
});
// 修改角色列表表单校验规则
const editRoleListFormRules = reactive({
  name: [{ required: true, validator: validateRoleName, trigger: "blur" }],
  describe: [{ required: true, message: "写点啥儿吧...", trigger: "blur" }],
});

// 请求方法
// 更新角色列表
const SetRoleList = (pendingUpdateData) => {
  axios
    .post(axios.baseURL + "/roleList/set", JSON.stringify(pendingUpdateData))
    .then((data) => {
      if (data === "Modify character information successfully") {
        ElMessage({
          message: "修改角色信息成功！",
          type: "success",
          showClose: true,
        });
        showEditRoleDialog.value = false;
      }
      if (data === "Delete character successfully") {
        ElMessage({
          message: "删除角色成功！",
          type: "success",
          showClose: true,
        });
        showDeleteRoleDialog.value = false;
      }
      if (data === "Add character successfully") {
        ElMessage({
          message: "添加角色成功！",
          type: "success",
          showClose: true,
        });
        showAddRoleDialog.value = false;
      }
      if (data === "Permission modified successfully") {
        ElMessage({
          message: "更新权限成功！",
          type: "success",
          showClose: true,
        });
        showAssignRolePermissionsDialog.value = false;
      }
      if (data === "Permission removed successfully") {
        return ElMessage({
          message: "移除权限成功！",
          type: "success",
          showClose: true,
        });
      }
      ReqRoleList(roleList, currentUsername);
    })
    .catch((err) => {
      ElMessage({
        message: "请求超时！",
        type: "error",
        showClose: true,
      });
    });
};

// DOM操作
// 对话框
// 对话框取消操作 DialogCancel(对话框开关,表单ref对象)
const DialogCancel = (dialogSwitch, formRef) => {
  dialogSwitch.value = false;
  if (formRef === undefined) return;
  setTimeout(() => {
    formRef.value.resetFields();
  }, 300);
};
// 对话框确认操作 DialogSubmit(表单信息,操作名称,表单ref对象)
const DialogSubmit = (formInfo, operation, formRef) => {
  if (!onOff.value) return;
  onOff.value = false;
  setTimeout(() => {
    onOff.value = true;
  }, 300);
  if (operation === "deleteRole" || formRef === undefined) {
    const pendingDeleteData = {
      operation,
      ...formInfo,
      currentUsername,
    };
    return SetRoleList(pendingDeleteData);
  }
  formRef.value.validate(async (isValid) => {
    if (!isValid) {
      return ElMessage({
        message: "信息填写错误！",
        type: "error",
        showClose: true,
      });
    }
    const pendingUpdateData = {
      operation,
      ...formInfo,
      currentUsername,
      index: cloneObj.name,
    };
    await SetRoleList(pendingUpdateData);
  });
};
// 添加角色对话框
const AddRoleDialogCancel = () => {
  DialogCancel(showAddRoleDialog, addRoleFormRef);
};
const AddRoleDialogSubmit = () => {
  DialogSubmit(addRoleForm, "addRole", addRoleFormRef);
};
// 修改角色对话框
const EditRoleDialogCancel = () => {
  DialogCancel(showEditRoleDialog, editRoleFormRef);
};
const EditRoleDialogSubmit = () => {
  if (!IsEdit(cloneObj, editRoleForm))
    return DialogCancel(showEditRoleDialog, editRoleFormRef);
  DialogSubmit(editRoleForm, "editRole", editRoleFormRef);
};
//删除角色对话框
const DeleteRoleCancel = () => {
  DialogCancel(showDeleteRoleDialog);
};
const DeleteRoleSubmit = () => {
  DialogSubmit(deleteRoleForm, "deleteRole");
};
// 分配角色权限对话框
const AssignRolePermissionsDialogCancel = () => {
  DialogCancel(showAssignRolePermissionsDialog);
  setTimeout(() => {
    assignedPermissions.value = [];
    cloneArr.value = [];
  }, 300);
};
const AssignRolePermissionsDialogSubmit = () => {
  if (!IsEdit(cloneArr.value, assignedPermissions.value)) {
    return AssignRolePermissionsDialogCancel();
  }

  let one = [];
  let two = [];
  let three = [];
  for (let i of assignedPermissions.value) {
    for (let obj of permissionList.value) {
      if (i === obj.name) {
        if (obj.level === 0) {
          one.push(i);
        }
        if (obj.level === 1) {
          two.push(i);
        }
        if (obj.level === 2) {
          three.push(i);
        }
      }
    }
  }
  assignedPermissionsObj.permissionListOne = one.join(",");
  assignedPermissionsObj.permissionListTwo = two.join(",");
  assignedPermissionsObj.permissionListThree = three.join(",");
  DialogSubmit(assignedPermissionsObj, "editPermission");
};
const GeneratePermissionList = () => {
  const data = [];
  const states = [];
  for (let i of permissionList.value) {
    states.push(i.name);
  }
  states.forEach((permission, index) => {
    data.push({
      label: permission,
      key: permission,
    });
  });
  return data;
};

//表格
// 添加角色
const AddRole = () => {
  showAddRoleDialog.value = true;
};
// 修改角色
const RoleEdit = (data) => {
  for (let i in editRoleForm) {
    editRoleForm[i] = data[i];
    cloneObj[i] = data[i];
  }
  showEditRoleDialog.value = true;
};
// 删除角色
const DeleteRole = (data) => {
  deleteRoleForm.index = data.name;
  showDeleteRoleDialog.value = true;
};
// 分配角色权限
const AssignRolePermissions = (data) => {
  // 穿梭框绑定的数据列表
  if (data.permissionListOne) {
    for (let i of data.permissionListOne) {
      assignedPermissions.value.push(i.name);
    }
  }
  if (data.permissionListTwo) {
    for (let i of data.permissionListTwo) {
      assignedPermissions.value.push(i.name);
    }
  }
  if (data.permissionListThree) {
    for (let i of data.permissionListThree) {
      assignedPermissions.value.push(i.name);
    }
  }
  if (assignedPermissions.value) {
    for (let i of assignedPermissions.value) {
      cloneArr.value.push(i);
    }
  }
  assignedPermissionsObj.index = data.name;

  permissionListArr.value = GeneratePermissionList();
  showAssignRolePermissionsDialog.value = true;
};
// 删除角色权限
const RemovePermission = (tagInfo, allInfo) => {
  const HandleData = (data1, data2) => {
    let one = [];
    let two = [];
    let three = [];
    for (let i of data2.permissionListOne) {
      one.push(i.name);
    }
    for (let i of data2.permissionListTwo) {
      two.push(i.name);
    }
    for (let i of data2.permissionListThree) {
      three.push(i.name);
    }
    data1.permissionListOne = one.join(",");
    data1.permissionListTwo = two.join(",");
    data1.permissionListThree = three.join(",");
  };
  assignedPermissionsObj.index = allInfo.name;
  if (tagInfo.level === 0) {
    allInfo.permissionListOne.splice(
      allInfo.permissionListOne.indexOf(tagInfo),
      1
    );
    HandleData(assignedPermissionsObj, allInfo);
  }
  if (tagInfo.level === 1) {
    allInfo.permissionListTwo.splice(
      allInfo.permissionListTwo.indexOf(tagInfo),
      1
    );
    HandleData(assignedPermissionsObj, allInfo);
  }
  if (tagInfo.level === 2) {
    allInfo.permissionListThree.splice(
      allInfo.permissionListThree.indexOf(tagInfo),
      1
    );
    HandleData(assignedPermissionsObj, allInfo);
  }

  const pendingUpdateData = {
    operation: "removePermission",
    ...assignedPermissionsObj,
    currentUsername,
  };

  SetRoleList(pendingUpdateData);
};

// 生命周期
onMounted(() => {
  Reqs.ReqPermissionList(permissionList, currentUsername);
  ReqRoleList(roleList, currentUsername);
});
</script>



<style>
@import url("../static/css/home/role-list/role-list.css");
</style>