<template>
  <!-- 确认删除对话框 -->
  <el-dialog v-model="showDeleteDialog" title="提示" @close="DeleteCancel">
    <el-icon color="#E59661" size="large" class="warningIcon"
      ><WarningFilled
    /></el-icon>
    <span> 此操作将永久删除该项数据，是否继续？</span>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"
          ><el-button @click="DeleteCancel">取消</el-button></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="DeleteSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs } from "vue";
import { DialogCancel, DialogSubmit } from "../plugnis/dom";
import { InitialConvertCase } from "../plugnis/function";

// 接收父组件标签属性参数
const props = defineProps({
  form: Object,
  request: Object,
  name: String,
});

const showDeleteDialog = ref(false);
const { list } = toRefs(props.request);

const DeleteCancel = () => {
  DialogCancel(showDeleteDialog);
};
const DeleteSubmit = () => {
  const operation = props.name
    ? "delete" + InitialConvertCase(props.name, "upper")
    : "delete";

  const request = {
    ...props.request,
    list,
    dialogSwitch: showDeleteDialog,
    queryInfo: {
      ...props.request,
      list: undefined,
    },
  };

  new Promise((resolve, reject) => {
    DialogSubmit(props.form, operation, request, undefined, resolve);
  }).then((data) => {
    if (props.name) {
      props.request.method();
    }
  });
};

// 暴露开关，添加标签属性ref接收
defineExpose({
  showDeleteDialog,
});
</script>

<style>
</style>