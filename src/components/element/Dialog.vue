<template>
  <el-dialog :title="title" v-model="showDialog" @close="Cancel">
    <el-form ref="formRef" :model="formData" :rules="formRules">
      <el-form-item
        :label="item"
        v-for="(item, index) in formItem"
        :key="index"
        :prop="item"
      >
        <el-cascader
          v-if="item === '分类'"
          v-model="formData[item]"
          :options="commodityClassificationList"
          clearable
          :props="commodityClassificationCascadeSelectorProps"
          @change="GetPPData"
        >
          <template #default="{ node, data }">
            <div>
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </div>
          </template>
        </el-cascader>
        <el-cascader
          v-else-if="item === '参数'"
          :disabled="isDisableCas"
          v-model="formData[item]"
          :options="parameterList"
          clearable
          :props="commodityClassificationCascadeSelectorProps"
        >
        </el-cascader>
        <el-cascader
          v-else-if="item === '属性'"
          :disabled="isDisableCas"
          v-model="formData[item]"
          :options="propertiesList"
          clearable
          :props="commodityClassificationCascadeSelectorProps"
        >
        </el-cascader>
        <el-cascader
          v-else-if="item === '省市区/县'"
          v-model="formData[item]"
          :options="regionData"
          clearable
        >
        </el-cascader>
        <el-input v-else v-model="formData[item]" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"><el-button @click="Cancel">取消</el-button></el-col>
        <el-col :span="3"
          ><el-button type="primary" @click="Submit">确认</el-button></el-col
        >
      </el-row>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick, toRef, toRefs, toRaw, onMounted } from "vue";
import { DialogCancel, DialogSubmit } from "../../plugnis/dom";
import { GetNow, IsEdit } from "../../plugnis/function";
import { Reqs } from "../../request/Req";
import { regionData } from "element-china-area-data";

const props = defineProps({
  title: String,
  formItem: String,
  request: Object,
});

// 级联
const commodityClassificationList = ref([]);
const commodityClassificationListOptions = ref([]);
const commodityClassificationCascadeSelectorProps = {
  expandTrigger: "hover",
  label: "name",
  value: "name",
};
const parameterList = ref([]);
const propertiesList = ref([]);

// 对话框
const showDialog = ref(false);
const title = props.title ? props.title : "";
const formRef = ref();
const formItem = props.formItem.split(",");
const formData = reactive({
  createTime: "",
  index: 0,
});
const formRules = reactive({
  商品名称: [{ required: true, message: "名称不能为空", trigger: "blur" }],
});

// 解构
const { list } = toRefs(props.request);
const { request } = toRaw(props);

// 定义表单对象
for (let i of formItem) {
  formData[i] = "";
  formData["旧" + i] = "";
}

// 级联
const isDisableCas = ref(true);
const GetPPData = () => {
  if (formData["分类"]) {
    isDisableCas.value = false;
    const content = formData["分类"].join(",");
    Reqs.ReqCommodityParameterSetting(parameterList, {
      currentUsername: request.currentUsername,
      content,
      type: "parameter",
    });
    Reqs.ReqCommodityParameterSetting(propertiesList, {
      currentUsername: request.currentUsername,
      content,
      type: "properties",
    });
  } else {
    isDisableCas.value = true;
  }
};

// 对话框
const Cancel = () => {
  DialogCancel(showDialog, formRef);
};
const Submit = () => {
  if (request.operation === "add") {
    formData.createTime = GetNow();
  }
  if (request.operation === "edit") {
    if (!IsEdit(request.clone, formData)) {
      return DialogCancel(showDialog, formRef);
    }
  }
  const req = {
    ...request,
    list,
    dialogSwitch: showDialog,
    queryInfo: {
      content: request.content,
      pageSize: request.pageSize,
      currentPage: request.currentPage,
      currentUsername: request.currentUsername,
    },
  };
  for (let i in formData) {
    if (typeof formData[i] === "object") {
      try {
        formData[i] = formData[i].join(",");
      } catch (error) {
        formData[i] = "";
      }
    }
  }
  if (request.index) {
    formData.index = request.index;
  }

  new Promise((resolve, reject) => {
    DialogSubmit(formData, request.operation, req, formRef, resolve);
  }).then(() => {
    DialogCancel(showDialog, formRef);
  });
};

onMounted(() => {
  Reqs.ReqCommodityClassification(
    {
      list: commodityClassificationList,
      list2: commodityClassificationListOptions,
    },
    {
      currentUsername: request.currentUsername,
    }
  );
});

defineExpose({
  showDialog,
  formData,
  isDisableCas,
  GetPPData,
});
</script>

<style scoped>
.propertyCascader {
  opacity: 0;
}
</style>