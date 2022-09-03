<template>
  <el-tag
    v-for="(tag, index) in dynamicTags.tags"
    class="tags"
    :key="index"
    :type="types[index % 5]"
    closable
    :disable-transitions="false"
    @close="handleClose(tag)"
  >
    {{ tag }}
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    class="addTagInput tags"
    v-model="inputValue"
    size="small"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
  />
  <el-button v-else class="tags" size="small" @click="showInput">
    + 新的标签
  </el-button>
</template>

<script setup>
import { nextTick, ref, reactive, onMounted } from "vue";
import { Reqs, Sets } from "../../request/Req";

// 接收父组件标签属性参数
const props = defineProps({
  scope: Object,
  form: Object,
  request: Object,
});

const types = ref(["", "success", "info", "warning", "danger"]);
const inputValue = ref("");
const dynamicTags = ref(props.form[props.scope.$index]);
const inputVisible = ref(false);
const InputRef = ref();
const parent = props.request.parent + "," + props.scope.row.name;

const handleClose = (tag) => {
  dynamicTags.value.tags.splice(dynamicTags.value.tags.indexOf(tag), 1);
  const requestContent = {
    pendingUpdateData: {
      operation: "delete",
      parent,
      name: tag,
      currentUsername: props.request.currentUsername,
    },
  };
  props.request.Sets(requestContent);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value.input.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    const req = {
      list: props.form,
      Reqs: props.request.Reqs,
      Sets: props.request.Sets,
      queryInfo: {
        parent: props.request.parent,
        currentUsername: props.request.currentUsername,
        total: props.request.total,
      },
    };
    const requestContent = {
      pendingUpdateData: {
        operation: "add",
        parent,
        name: inputValue.value,
        currentUsername: req.queryInfo.currentUsername,
      },
      req,
    };
    props.request.Sets(requestContent);
    dynamicTags.value.tags.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};
</script>

<style scoped>
.tags {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.addTagInput {
  width: 100px;
}
</style>