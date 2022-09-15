<template>
  <!-- 搜索和添加 -->
  <el-row class="searchProduct" :gutter="24">
    <el-col :span="15"
      ><SearchBox
        ref="searchBoxRef"
        :request="searchRequest"
        @change="TransVal"
      ></SearchBox
    ></el-col>
    <el-col :span="4"
      ><el-button type="primary" @click="AddProduct"
        >添加商品</el-button
      ></el-col
    >
  </el-row>

  <!-- 商品表格 -->
  <div class="productTable">
    <Table ref="productTableRef" :request="tableRequest"></Table>
  </div>

  <!-- 添加商品对话框 -->
  <Dialog
    ref="addDialogRef"
    title="添加"
    formItem="商品名称,价格,重量,分类,参数,属性"
    :request="addRequest"
  ></Dialog>
</template>

<script setup>
import SearchBox from "./element/SearchBox.vue";
import Table from "./element/Table.vue";
import Dialog from "./element/Dialog.vue";
import { ref, reactive, nextTick, onMounted, toRef } from "vue";
import { Reqs, Sets } from "../request/Req";

const currentUsername = window.localStorage.getItem("currentUsername"); //当前账号名

// 表格
const productTableRef = ref();
const productList = ref([]);
const tableRequest = reactive({
  Reqs: Reqs.ReqProductList,
  Sets: Sets.SetProductList,
  productList,
  content: "",
});
// 对话框
const addDialogRef = ref();
const addRequest = reactive({
  Reqs: Reqs.ReqProductList,
  Sets: Sets.SetProductList,
  currentUsername,
  list: productList,
  pageSize: 7,
  operation: "add",
  content: "",
});
// 搜索框
const searchBoxRef = ref();
const searchRequest = reactive({
  Reqs: Reqs.ReqProductList,
  list: productList,
  currentUsername,
  pageSize: 7,
  currentPage: 1,
});
const TransVal = () => {
  tableRequest.content = searchBoxRef.value.state;
};

// 添加商品对话框
const AddProduct = () => {
  addDialogRef.value.showDialog = true;
  tableRequest.dialogSwitch = addDialogRef.value.showDialog;
  addRequest.content = searchBoxRef.value.state;
};

onMounted(() => {
  Reqs.ReqProductList(productList, {
    currentUsername,
    currentPage: productTableRef.value.currentPage,
    pageSize: 7,
  });
});
nextTick(() => {
  addRequest.currentPage = productTableRef.value.currentPage;
  searchRequest.currentPage = productTableRef.value.currentPage;
});
</script>

<style scoped>
@import url("../static/css/home/product-list/product-list.css");
</style>