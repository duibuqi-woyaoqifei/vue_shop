<template>
  <div class="MedusaTable">
    <el-table :data="productList">
      <el-table-column type="index">
        <template #header> # </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="415" />
      <el-table-column prop="price" label="价格/元" width="120" />
      <el-table-column prop="weight" label="重量" width="100" />
      <el-table-column prop="create_time" label="创建时间" width="200" />
      <el-table-column width="120">
        <template #header> 操作</template>
        <template #default="scope">
          <el-button
            type="primary"
            icon="Edit"
            class="btn"
            @click="Edit(scope.row)"
            >修改</el-button
          >
          <el-button type="danger" icon="Delete" @click="Delete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="pageManage">
    <el-pagination
      v-model:currentPage="currentPage"
      :page-size="7"
      layout="total, prev, pager, next, jumper"
      :total="productList.length ? productList[0].total : 0"
      @current-change="handleCurrentChange"
    />
  </div>
  <Dialog
    ref="editDialogRef"
    title="修改"
    :request="editRequest"
    formItem="商品名称,价格,重量,分类,参数,属性"
  ></Dialog>
  <DeleteDialog
    ref="deleteDialogRef"
    :request="deleteRequest"
    :form="deleteItem"
  ></DeleteDialog>
</template>

<script setup>
import { ref, reactive, toRefs, toRef } from "vue";
import Dialog from "./Dialog.vue";
import DeleteDialog from "../DeleteDialog.vue";

const props = defineProps({
  request: Object,
});

const currentUsername = window.localStorage.getItem("currentUsername"); // 当前账号名
const currentPage = ref(1);
const { productList } = toRefs(props.request);

// 对话框
const editDialogRef = ref();
const deleteDialogRef = ref();

const editRequest = reactive({
  ...props.request,
  list: productList,
  operation: "edit",
  clone: {},
  currentUsername,
  currentPage,
  pageSize: 7,
  content: "",
});
const deleteRequest = reactive({
  ...props.request,
  operation: "delete",
  currentUsername,
  list: productList,
  currentPage,
  pageSize: 7,
  content: "",
});
const deleteItem = reactive({});

const handleCurrentChange = () => {
  props.request.Reqs(productList, {
    currentUsername,
    content: props.request.content,
    currentPage: currentPage.value,
    pageSize: 7,
  });
};

// 对话框
const Edit = (item) => {
  editRequest.content = props.request.content;
  for (let i in item) {
    if (i === "name") {
      editDialogRef.value.formData.商品名称 = item[i];
      editDialogRef.value.formData.旧商品名称 = item[i];
    }
    if (i === "price") {
      editDialogRef.value.formData.价格 = item[i];
      editDialogRef.value.formData.旧价格 = item[i];
    }
    if (i === "weight") {
      editDialogRef.value.formData.重量 = item[i];
      editDialogRef.value.formData.旧重量 = item[i];
    }
    if (i === "commodityClassification") {
      editDialogRef.value.formData.分类 = item[i]
        ? item[i].split(",")
        : item[i];
      editDialogRef.value.formData.旧分类 = item[i]
        ? item[i].split(",")
        : item[i];
    }
    if (i === "parameter") {
      editDialogRef.value.formData.参数 = item[i]
        ? item[i].split(",")
        : item[i];
      editDialogRef.value.formData.旧参数 = item[i]
        ? item[i].split(",")
        : item[i];
    }
    if (i === "properties") {
      editDialogRef.value.formData.属性 = item[i]
        ? item[i].split(",")
        : item[i];
      editDialogRef.value.formData.旧属性 = item[i]
        ? item[i].split(",")
        : item[i];
    }
    if (i === "index") {
      editDialogRef.value.formData.index = item[i];
    }
  }
  for (let i in editDialogRef.value.formData) {
    editRequest.clone[i] = editDialogRef.value.formData[i];
  }

  editDialogRef.value.GetPPData();

  editDialogRef.value.showDialog = true;
};

const Delete = (item) => {
  deleteRequest.content = props.request.content;
  for (let i in item) {
    deleteItem[i] = item[i];
  }
  deleteDialogRef.value.showDeleteDialog = true;
};

defineExpose({
  currentPage,
});
</script>

<style scoped>
.btn {
  margin-top: 10px;
  margin-bottom: 10px;
}

/* 分页样式 */
.pageManage {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%);
}
.pageManage .el-pagination {
  color: rgba(255, 255, 255, 1);
}
.pageManage {
  --el-text-color-regular: rgba(255, 255, 255, 0.8);
}
</style>