<template>
  <el-row :gutter="24" class="orderRow">
    <el-col :span="12"
      ><SearchBox
        ref="searchBoxRef"
        placeholder="查询订单信息"
        :request="searchRequest"
        @change="ChangeContent"
      ></SearchBox
    ></el-col>
  </el-row>
  <div class="orderTable">
    <Table ref="orderTableRef" :request="tableRequest"></Table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import SearchBox from "./element/SearchBox.vue";
import Table from "./element/Table.vue";
import { Reqs, Sets } from "../request/Req";

const currentUsername = window.localStorage.getItem("currentUsername"); // 当前账号名
const orderList = ref([]);
const orderTableRef = ref();
const tableRequest = reactive({
  Reqs: Reqs.ReqOrderList,
  Sets: Sets.SetOrderList,
  list: orderList,
  content: "",
  formItem: "省市区/县,详细地址",
  pageSize: 10,
});

// 搜索框
const searchBoxRef = ref();
const searchRequest = reactive({
  Reqs: Reqs.ReqOrderList,
  list: orderList,
  currentUsername,
  pageSize: 10,
  currentPage: 1,
});
const ChangeContent = () => {
  tableRequest.content = searchBoxRef.value.state;
};

onMounted(() => {
  Reqs.ReqOrderList(orderList, {
    currentUsername,
    currentPage: orderTableRef.value.currentPage,
    pageSize: 10,
  });
});
</script>

<style scoped>
.orderRow {
  position: relative;
  top: 20px;
  height: 60px;
}
.orderTable {
  position: relative;
  top: 20px;
  height: 840px;
}
</style>