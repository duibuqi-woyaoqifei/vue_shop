<template>
  <!-- 用户搜索和添加 -->
  <el-row :gutter="20" class="userSearchAdd">
    <el-col :span="7">
      <el-input
        placeholder="请输入用户名称"
        v-model="userListReqInfo.userListSearchContent"
      >
        <template #append>
          <el-button icon="Search" @click="reqUserList" />
        </template>
      </el-input>
    </el-col>
    <el-col :span="4">
      <el-button color="#715B8B" @click="showAddUserDialog = true"
        >添加用户</el-button
      >
    </el-col>
  </el-row>
  <!-- 添加用户对话框 -->
  <el-dialog v-model="showAddUserDialog" title="添加用户">
    <el-form
      :model="addUserForm"
      ref="addUserFormRef"
      :rules="addUserFormRules"
      label-width="auto"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="addUserForm.name" maxlength="26" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="addUserForm.password"
          type="password"
          maxlength="18"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addUserForm.email" maxlength="320" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="addUserForm.phone" maxlength="16" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="addUserForm.role" placeholder="请选择角色类别">
          <el-option label="管理员" value="管理员" />
          <el-option label="超级管理员" value="超级管理员" />
          <el-option label="主管" value="主管" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="22"
          ><el-button @click="AddUserFormCancel">取消</el-button></el-col
        >
        <el-col :span="2"
          ><el-button type="primary" @click="AddUserFormSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>

  <!-- 修改用户信息对话框 -->
  <el-dialog v-model="showEditUserDialog" title="修改用户信息">
    <el-form
      :model="editUserForm"
      ref="editUserFormRef"
      :rules="editUserFormRules"
      label-width="auto"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="editUserForm.name" maxlength="26" disabled />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editUserForm.email" maxlength="320" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="editUserForm.phone" maxlength="16" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="22"
          ><el-button @click="EditUserFormCancel">取消</el-button></el-col
        >
        <el-col :span="2"
          ><el-button type="primary" @click="EditUserFormSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>

  <!-- 删除用户对话框 -->
  <el-dialog v-model="showDeleteUserDialog" title="提示">
    <el-icon color="#E59661" size="large" class="warningIcon"
      ><WarningFilled
    /></el-icon>
    <span> 此操作将永久删除该用户，是否继续？</span>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="22"
          ><el-button @click="DeleteUserCancel">取消</el-button></el-col
        >
        <el-col :span="2"
          ><el-button type="primary" @click="DeleteUserSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>

  <!-- 用户列表表格 -->
  <div class="userListTable">
    <el-table :data="userList">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="phone"></el-table-column>
      <el-table-column label="角色" prop="role"></el-table-column>
      <el-table-column>
        <template #header> 状态 </template>
        <template #default="scope">
          <el-switch
            v-model="scope.row.state"
            @change="UserStateChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column width="170px">
        <template #header> 操作 </template>
        <template #default="scope">
          <el-button-group>
            <el-button
              type="primary"
              icon="Edit"
              @click="EditUserInfo(scope.row)"
            />
            <el-button
              type="danger"
              icon="Delete"
              @click="DeleteUser(scope.row)"
            />
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="Setting" />
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="userListPagination">
      <el-pagination
        :page-sizes="[5, 8, 10, 12]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userListTotal"
        :current-page="userListReqInfo.pageNum"
        :page-size="userListReqInfo.pageSize"
        @size-change="EachPageSizeChange"
        @current-change="CurrentPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "../plugnis/axios";
import {
  validatePassword,
  validateEmail,
  validatePhone,
} from "../plugnis/ValidateRules";
import IsEdit from "../plugnis/isEdit";

// 数据
const addUserFormRef = ref(null);
const currentUsername = window.localStorage.getItem("currentUsername"); //当前账号名
const editUserFormRef = ref(null);
const showAddUserDialog = ref(false); //添加用户对话框
const showDeleteUserDialog = ref(false); //删除用户对话框
const showEditUserDialog = ref(false); //修改用户信息对话框
const userListTotal = ref(0); //用户总数
const userList = ref([]); //用户列表渲染
// 添加用户表单信息
const addUserForm = reactive({
  name: "",
  password: "",
  email: "",
  phone: "",
  role: "",
});
// 克隆体
const clone = reactive({});
// 删除用户表单
const deleteUserForm = reactive({
  index: 0,
});
// 修改用户表单
const editUserForm = reactive({
  name: "",
  email: "",
  phone: "",
  index: 0,
});
// 用户列表请求信息
const userListReqInfo = reactive({
  userListSearchContent: "",
  pageNum: 1,
  pageSize: 5,
  currentUsername,
});

// 表单校验规则绑定
const addUserFormRules = reactive({
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  password: [{ required: true, validator: validatePassword, trigger: "blur" }],
  email: [{ required: true, validator: validateEmail, trigger: "blur" }],
  phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
  role: [{ required: true, message: "请选择角色", trigger: "blur" }],
});
const editUserFormRules = reactive({
  email: [{ required: true, validator: validateEmail, trigger: "blur" }],
  phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
});

// 请求方法
// 访问用户列表
const reqUserList = () => {
  axios
    .post("http://127.0.0.1:3000/userList", JSON.stringify(userListReqInfo))
    .then((data) => {
      userList.value = data;
    })
    .catch((err) => {
      ElMessage({
        message: "请求超时！",
        type: "error",
        showClose: true,
      });
    });
};
// 更新用户列表
const setUserList = (pendingUpdateData) => {
  axios
    .post(
      "http://127.0.0.1:3000/userList/set",
      JSON.stringify(pendingUpdateData)
    )
    .then((data) => {
      if (data === "Succeeded in modifying the status") {
        ElMessage({
          message: "修改状态成功！",
          type: "success",
          showClose: true,
        });
      }
      if (data === "Adding a user Succeeded") {
        ElMessage({
          message: "添加用户成功！",
          type: "success",
          showClose: true,
        });
        showAddUserDialog.value = false;
        reqUserList();
      }
      if (data === "Modify user information successfully") {
        ElMessage({
          message: "修改用户信息成功！",
          type: "success",
          showClose: true,
        });
        showEditUserDialog.value = false;
        reqUserList();
      }
      if (data === "Delete user successfully") {
        ElMessage({
          message: "删除用户成功！",
          type: "success",
          showClose: true,
        });
        showDeleteUserDialog.value = false;
        reqUserList();
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
  if (operation === "deleteUser") {
    const pendingDeleteData = {
      operation,
      ...formInfo,
      currentUsername,
    };
    return setUserList(pendingDeleteData);
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
    };
    await setUserList(pendingUpdateData);
  });
};
// 添加用户对话框
const AddUserFormCancel = () => {
  DialogCancel(showAddUserDialog, addUserFormRef);
};
const AddUserFormSubmit = () => {
  DialogSubmit(addUserForm, "addUser", addUserFormRef);
};
// 修改用户对话框
const EditUserFormCancel = () => {
  DialogCancel(showEditUserDialog, editUserFormRef);
};
const EditUserFormSubmit = () => {
  if (!IsEdit(clone, editUserForm))
    return DialogCancel(showEditUserDialog, editUserFormRef);
  DialogSubmit(editUserForm, "editUser", editUserFormRef);
};
//删除用户对话框
const DeleteUserCancel = () => {
  DialogCancel(showDeleteUserDialog);
};
const DeleteUserSubmit = () => {
  DialogSubmit(deleteUserForm, "deleteUser");
};

// 表格
const EditUserInfo = (data) => {
  for (let i in editUserForm) {
    editUserForm[i] = data[i];
    clone[i] = data[i];
  }
  showEditUserDialog.value = true;
};
const DeleteUser = (data) => {
  for (let i in deleteUserForm) {
    deleteUserForm[i] = data[i];
  }
  showDeleteUserDialog.value = true;
};
const UserStateChange = (changeObj) => {
  const pendingUpdateData = {
    operation: "changeState",
    index: changeObj.index,
    state: changeObj.state,
    currentUsername,
  };
  setUserList(pendingUpdateData);
};

// 分页
const CurrentPageChange = (newPage) => {
  userListReqInfo.pageNum = newPage;
  reqUserList();
};
const EachPageSizeChange = (newSize) => {
  userListReqInfo.pageSize = newSize;
  reqUserList();
};

// 生命周期
onMounted(() => {
  reqUserList();
});
</script>

<style scoped>
@import url("../static/css/home/user-list/user-list.css");
</style>