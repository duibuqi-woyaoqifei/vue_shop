<template>
  <div class="MedusaTable">
    <el-table :data="list">
      <el-table-column type="index">
        <template #header> # </template>
      </el-table-column>
      <template v-if="props.request.name === '商品表格'">
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
      </template>
      <template v-else>
        <el-table-column prop="number" label="订单编号" width="315" />
        <el-table-column prop="price" label="订单价格" width="120" />
        <el-table-column width="100">
          <template #header> 是否付款</template>
          <template #default="scope">
            <el-switch
              v-model="scope.row.isPay"
              inline-prompt
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #b9b9b9;
              "
              active-text="是"
              inactive-text="否"
              size="large"
              @click="ChangePay(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column width="100"
          ><template #header> 是否发货</template>
          <template #default="scope">
            <el-switch
              v-model="scope.row.isConsign"
              inline-prompt
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #b9b9b9;
              "
              active-text="是"
              inactive-text="否"
              size="large"
              @click="ChangeConsign(scope.row)"
            /> </template
        ></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" />
        <el-table-column width="120">
          <template #header> 操作</template>
          <template #default="scope">
            <el-button
              type="primary"
              icon="EditPen"
              class="btn"
              @click="EditAddress(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="Location"
              @click="Location"
              style="margin-left: 4px"
            ></el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
  <div class="pageManage">
    <el-pagination
      v-model:currentPage="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="list.length ? list[0].total : 0"
      @current-change="handleCurrentChange"
    />
  </div>
  <Dialog
    ref="editDialogRef"
    title="修改"
    :request="editRequest"
    :formItem="formItem"
  ></Dialog>

  <DeleteDialog
    ref="deleteDialogRef"
    :request="deleteRequest"
    :form="deleteItem"
  ></DeleteDialog>
  <el-dialog
    title="物流进度"
    v-model="showLocationDialog"
    @close="LocationCancel"
  >
    <Timeline></Timeline>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, toRef } from "vue";
import Dialog from "./Dialog.vue";
import DeleteDialog from "../DeleteDialog.vue";
import { DialogCancel, DialogSubmit } from "../../plugnis/dom";
import Timeline from "./Timeline.vue";

const props = defineProps({
  request: Object,
});

const currentUsername = window.localStorage.getItem("currentUsername"); // 当前账号名
const currentPage = ref(1);
const { list } = toRefs(props.request);
const { formItem, pageSize } = props.request;

// 对话框
const editDialogRef = ref();
const deleteDialogRef = ref();
const showLocationDialog = ref(false);

const editRequest = reactive({
  ...props.request,
  list,
  operation: "edit",
  clone: {},
  currentUsername,
  currentPage,
  content: "",
  index: 0,
});
const deleteRequest = reactive({
  ...props.request,
  operation: "delete",
  currentUsername,
  list,
  currentPage,
  content: "",
});

const deleteItem = reactive({});

const handleCurrentChange = () => {
  props.request.Reqs(list, {
    currentUsername,
    content: props.request.content,
    currentPage: currentPage.value,
    pageSize,
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
const EditAddress = (item) => {
  let p = "";
  let c = "";
  let a = "";
  for (let i in item) {
    if (i === "detailAddress") {
      editDialogRef.value.formData.详细地址 = item[i];
      editDialogRef.value.formData.旧详细地址 = item[i];
    }
    if (i === "province") {
      p = item[i];
    }
    if (i === "city") {
      c = item[i];
    }
    if (i === "area") {
      a = item[i];
    }
  }
  const pca = p + "," + c + "," + a;
  editDialogRef.value.formData["省市区/县"] = pca.split(",");
  editDialogRef.value.formData["旧省市区/县"] = pca.split(",");
  editRequest.content = props.request.content;
  editRequest.index = item.index;
  editDialogRef.value.showDialog = true;
};
const Location = () => {
  showLocationDialog.value = true;
};

const LocationCancel = () => {
  DialogCancel(showLocationDialog);
};

const ChangePay = (data) => {
  props.request.Sets({
    pendingUpdateData: {
      isPay: data.isPay,
      operation: "change",
      currentUsername,
      index: data.index,
    },
  });
};
const ChangeConsign = (data) => {
  props.request.Sets({
    pendingUpdateData: {
      isConsign: data.isConsign,
      operation: "change",
      currentUsername,
      index: data.index,
    },
  });
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