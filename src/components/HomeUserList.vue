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
      <el-button color="#715B8B" @click="AddUser">添加用户</el-button>
    </el-col>
  </el-row>
  <!-- 添加用户对话框 -->
  <el-dialog
    v-model="showAddUserDialog"
    title="添加用户"
    @close="AddUserFormCancel"
  >
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
          <el-option
            v-for="(item, index) in roleList"
            :key="index"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"
          ><el-button @click="AddUserFormCancel">取消</el-button></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="AddUserFormSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>

  <!-- 修改用户信息对话框 -->
  <el-dialog
    v-model="showEditUserDialog"
    title="修改用户信息"
    @close="EditUserFormCancel"
  >
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
        <el-col :span="21"
          ><el-button @click="EditUserFormCancel">取消</el-button></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="EditUserFormSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>

  <!-- 删除用户对话框 -->
  <el-dialog
    v-model="showDeleteUserDialog"
    title="提示"
    @close="DeleteUserCancel"
  >
    <el-icon color="#E59661" size="large" class="warningIcon"
      ><WarningFilled
    /></el-icon>
    <span> 此操作将永久删除该用户，是否继续？</span>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"
          ><el-button @click="DeleteUserCancel">取消</el-button></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="DeleteUserSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>

  <!-- 分配角色对话框 -->
  <el-dialog
    v-model="showAssignRoleDialog"
    title="提示"
    @close="AssignRoleCancel"
  >
    <p>用户：{{ clone.name }}</p>
    <p>当前用户的角色：{{ clone.role }}</p>
    <p>
      分配新角色：
      <el-select v-model="editUserForm.role" placeholder="请选择角色类别">
        <el-option
          v-for="(item, index) in roleList"
          :key="index"
          :label="item.name"
          :value="item.name"
        ></el-option>
      </el-select>
    </p>

    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"
          ><el-button @click="AssignRoleCancel">取消</el-button></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="AssignRoleSubmit"
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
              <el-button
                type="warning"
                icon="Setting"
                @click="AssignRole(scope.row)"
              />
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
import { IsEdit } from "../plugnis/function";
import { ReqRoleList } from "../request/Req";

// 数据
const currentUsername = window.localStorage.getItem("currentUsername"); //当前账号名
const roleList = ref([]); // 角色列表
const showAddUserDialog = ref(false); //添加用户对话框
const showAssignRoleDialog = ref(false); // 分配角色对话框
const showDeleteUserDialog = ref(false); //删除用户对话框
const showEditUserDialog = ref(false); //修改用户信息对话框
const onOff = ref(true); // 开关
const userListTotal = ref(0); //用户总数
const userList = ref([]); //用户列表渲染
// 添加用户表单信息
const addUserFormRef = ref(null);
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
const editUserFormRef = ref(null);
const editUserForm = reactive({
  name: "",
  email: "",
  phone: "",
  role: "",
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
    .post(axios.baseURL + "/userList", JSON.stringify(userListReqInfo))
    .then((data) => {
      userList.value = data.userList;
      userListTotal.value = data.total;
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
    .post(axios.baseURL + "/userList/set", JSON.stringify(pendingUpdateData))
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
        showAssignRoleDialog.value = false;
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
  if (!onOff.value) return;
  onOff.value = false;
  setTimeout(() => {
    onOff.value = true;
  }, 300);
  if (formRef === undefined) {
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
// 分配角色对话框
const AssignRoleCancel = () => {
  DialogCancel(showAssignRoleDialog);
};
const AssignRoleSubmit = () => {
  DialogSubmit(editUserForm, "assignRole");
};

// 表格
const AddUser = () => {
  showAddUserDialog.value = true;
};
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
const AssignRole = (data) => {
  for (let i in editUserForm) {
    editUserForm[i] = data[i];
    clone[i] = data[i];
  }
  showAssignRoleDialog.value = true;
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
  ReqRoleList(roleList);
});
</script>

<style scoped>
@import url("../static/css/home/user-list/user-list.css");
</style>