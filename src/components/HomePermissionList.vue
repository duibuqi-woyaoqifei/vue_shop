<template>
  <el-scrollbar>
    <!-- 权限列表表格 -->
    <div class="permissionListTable">
      <el-table :data="permissionList" style="width: 100%" size="large">
        <el-table-column type="index" width="50px"></el-table-column>
        <el-table-column prop="name" label="权限名称" />
        <el-table-column>
          <template #header>权限等级 </template>
          <template #default="scope">
            <el-tag v-if="scope.row.level === 0">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level === 1" type="success"
              >二级权限</el-tag
            >
            <el-tag v-else type="warning">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "../plugnis/axios";

// 数据
const permissionList = ref([]);

// 请求方法
const reqPermissionList = () => {
  axios
    .get(axios.baseURL + "/permissionList")
    .then((data) => {
      permissionList.value = data;
    })
    .catch((err) => {
      ElMessage({
        message: "请求超时！",
        type: "error",
        showClose: true,
      });
    });
};

// 生命周期
onMounted(() => {
  reqPermissionList();
});
</script>

<style scoped>
@import url("../static/css/home/permission-list/permission-list.css");
</style>