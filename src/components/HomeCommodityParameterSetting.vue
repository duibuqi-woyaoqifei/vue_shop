<template>
  <!-- 商品分类级联选择器 -->
  <div class="commodityClassificationCascadeSelector">
    <span class="introductionCommodityClassificationCascadeSelector"
      >请选择商品分类：</span
    >
    <el-cascader
      v-model="selectClassificationName"
      :options="commodityClassificationList"
      clearable
      :props="commodityClassificationCascadeSelectorProps"
      @change="ClassificationChange"
    >
      <template #default="{ node, data }">
        <div>
          <span>{{ data.name }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </div>
      </template>
    </el-cascader>
  </div>
  <!-- 标签页导航 -->
  <el-tabs
    v-model="currentTab"
    @tab-change="CommodityParameterSettingTabsChange"
    class="commodityParameterSettingTabs"
  >
    <el-tab-pane label="动态参数" name="parameter" :disabled="IsBanTabs()">
      <el-button type="primary" size="large" @click="AddParameter"
        >添加参数</el-button
      >
      <el-scrollbar class="MedusaTable commodityParameterSettingTables">
        <el-table :data="currentTableData">
          <el-table-column type="expand">
            <template #default="scope">
              <DynamicallyEditTags
                :form="tagsList"
                :request="tagsReq"
                :scope="scope"
              ></DynamicallyEditTags>
            </template>
          </el-table-column>
          <el-table-column type="index" />
          <el-table-column prop="name" label="参数名称" />
          <el-table-column>
            <template #header> 操作</template>
            <template #default="scope">
              <el-button
                type="primary"
                icon="Edit"
                @click="EditParameter(scope)"
                >修改</el-button
              >
              <el-button
                type="danger"
                icon="Delete"
                @click="DeleteParameter(scope)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="properties" :disabled="IsBanTabs()"
      ><el-button type="primary" size="large" @click="AddParameter"
        >添加属性</el-button
      >
      <div class="MedusaTable commodityParameterSettingTables">
        <el-table :data="currentTableData">
          <el-table-column type="expand">
            <template #default="scope">
              <DynamicallyEditTags
                :form="tagsList"
                :request="tagsReq"
                :scope="scope"
              ></DynamicallyEditTags>
            </template>
          </el-table-column>
          <el-table-column type="index" />
          <el-table-column prop="name" label="属性名称" />
          <el-table-column>
            <template #header> 操作</template>
            <template #default="scope">
              <el-button
                type="primary"
                icon="Edit"
                @click="EditParameter(scope)"
                >修改</el-button
              >
              <el-button
                type="danger"
                icon="Delete"
                @click="DeleteParameter(scope)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>

  <!-- 添加参数/属性对话框 -->
  <el-dialog
    :title="'添加' + DialogTitle()"
    v-model="showAddParameterDialog"
    @close="AddParameterDialogCancel"
  >
    <el-form
      ref="parameterFormRef"
      :model="parameterForm"
      :rules="parameterFormRules"
    >
      <el-form-item :label="DialogTitle()" prop="name">
        <el-input v-model="parameterForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"
          ><el-button @click="AddParameterDialogCancel">取消</el-button></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="AddParameterDialogSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>

  <!-- 修改参数/属性对话框 -->
  <el-dialog
    :title="'修改' + DialogTitle()"
    v-model="showEditParameterDialog"
    @close="EditParameterDialogCancel"
  >
    <el-form
      ref="parameterFormRef"
      :model="parameterForm"
      :rules="parameterFormRules"
    >
      <el-form-item :label="DialogTitle()" prop="name">
        <el-input v-model="parameterForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"
          ><el-button @click="EditParameterDialogCancel"
            >取消</el-button
          ></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="EditParameterDialogSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>
  <DeleteDialog
    ref="deleteDialogRef"
    :form="parameterForm"
    :request="deleteReq"
    :name="currentTab"
  ></DeleteDialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Reqs, Sets } from "../request/Req";
import { DialogCancel, DialogSubmit } from "../plugnis/dom";
import axios from "../plugnis/axios";
import DeleteDialog from "../components/DeleteDialog.vue";
import DynamicallyEditTags from "../components/element/DynamicallyEditTags.vue";
import { RepeatValidate } from "../plugnis/ValidateRules";

const currentUsername = window.localStorage.getItem("currentUsername"); // 当前用户

// 商品分类级联选择器
const selectClassificationName = ref(""); // 选择的商品分类
const commodityClassificationList = ref([]);
const commodityClassificationListOptions = ref([]);
const commodityClassificationCascadeSelectorProps = {
  expandTrigger: "hover",
  label: "name",
  value: "name",
};
const commodityParameterSettingQueryInfo = reactive({
  content: "",
  type: "",
  pageNum: 1,
  pageSize: 5,
  currentUsername,
});

// 标签页导航
const currentTab = ref(""); // 当前标签页
const currentTableData = ref([]); // 当前表格数据
// 动态标签
const tagsList = ref([{ tags: [] }]);
const tagsReq = reactive({
  Reqs: Reqs.ReqTags,
  Sets: Sets.SetTags,
  parent: "",
  currentUsername,
  total: currentTableData.value,
});
// 添加参数属性对话框
const showAddParameterDialog = ref(false); // 参数
const parameterFormRef = ref(null);
const parameterForm = reactive({
  name: "",
  currentClassification: "",
  oldName: "",
  index: 0,
});
const ValidateAddParameter = RepeatValidate(currentTableData, "name");
const parameterFormRules = reactive({
  name: [{ required: true, validator: ValidateAddParameter, trigger: "blur" }],
});
// 修改参数属性对话框
const showEditParameterDialog = ref(false);
// 删除参数属性对话框
const deleteDialogRef = ref(null);
const deleteReq = reactive({
  Reqs: Reqs.ReqCommodityParameterSetting,
  Sets: Sets.SetCommodityParameterSetting,
  list: currentTableData,
  queryInfo: commodityParameterSettingQueryInfo,
  currentUsername,
});

// 商品分类级联选择器
// 表单获得当前分类
const GetClassification = () => {
  return (
    selectClassificationName.value[0] +
    "," +
    selectClassificationName.value[1] +
    "," +
    selectClassificationName.value[2]
  );
};
const ClassificationChange = () => {
  if (!selectClassificationName.value) {
    currentTab.value = "";
    return;
  }
  if (selectClassificationName.value.length !== 3) {
    currentTab.value = "";
    return;
  }
  if (currentTab.value) {
    const content = GetClassification();
    commodityParameterSettingQueryInfo.content = content;
    commodityParameterSettingQueryInfo.type = currentTab.value;

    new Promise((resolve) => {
      Reqs.ReqCommodityParameterSetting(
        currentTableData,
        commodityParameterSettingQueryInfo,
        resolve
      );
    }).then(() => {
      tagsReq.parent = GetTagParent();
      tagsReq.total = currentTableData.value;

      Reqs.ReqTags(tagsList, {
        parent: tagsReq.parent,
        currentUsername,
        total: currentTableData.value,
      });
    });
  }
};

// 标签页导航
// 添加参数属性对话框
const AddParameter = () => {
  parameterForm.name = "";
  showAddParameterDialog.value = true;
};
const AddParameterDialogCancel = () => {
  DialogCancel(showAddParameterDialog, parameterFormRef);
};
const AddParameterDialogSubmit = () => {
  parameterForm.currentClassification = GetClassification();
  const operation =
    currentTab.value === "parameter" ? "addParameter" : "addProperties";

  new Promise((resolve, reject) => {
    DialogSubmit(
      parameterForm,
      operation,
      {
        Reqs: Reqs.ReqCommodityParameterSetting,
        Sets: Sets.SetCommodityParameterSetting,
        list: currentTableData,
        queryInfo: commodityParameterSettingQueryInfo,
        dialogSwitch: showAddParameterDialog,
      },
      parameterFormRef,
      resolve
    );
  }).then((data) => {
    tagsReq.parent = GetTagParent();
    tagsReq.total = currentTableData.value;

    Reqs.ReqTags(tagsList, {
      parent: tagsReq.parent,
      currentUsername,
      total: currentTableData.value,
    });
  });
};
const DialogTitle = () => {
  if (currentTab.value === "parameter") {
    return "动态参数";
  }
  return "静态属性";
};
// 修改参数属性对话框
const EditParameter = (data) => {
  parameterForm.name = data.row.name;
  parameterForm.oldName = data.row.name;
  parameterForm.index = data.$index;
  showEditParameterDialog.value = true;
};
const EditParameterDialogCancel = () => {
  DialogCancel(showEditParameterDialog, parameterFormRef);
};
const EditParameterDialogSubmit = () => {
  if (parameterForm.oldName === parameterForm.name) {
    return DialogCancel(showEditParameterDialog, parameterFormRef);
  }
  parameterForm.currentClassification = GetClassification();
  const operation =
    currentTab.value === "parameter" ? "editParameter" : "editProperties";

  DialogSubmit(
    parameterForm,
    operation,
    {
      Reqs: Reqs.ReqCommodityParameterSetting,
      Sets: Sets.SetCommodityParameterSetting,
      list: currentTableData,
      dialogSwitch: showEditParameterDialog,
      queryInfo: commodityParameterSettingQueryInfo,
    },
    parameterFormRef
  );
};
// 删除参数属性对话框
const DeleteParameter = (data) => {
  console.log(currentTableData);
  parameterForm.oldName = data.row.name;
  parameterForm.index = data.$index;
  parameterForm.currentClassification = GetClassification();
  deleteDialogRef.value.showDeleteDialog = true;
};
// 动态标签
const GetTagParent = () => {
  const classification = GetClassification();
  const pp = currentTab.value === "parameter" ? "参数" : "属性";
  return classification + "," + pp;
};
// 是否禁用标签页
const IsBanTabs = () => {
  if (selectClassificationName.value === null) return true;
  if (selectClassificationName.value.length !== 3) {
    return true;
  }
  return false;
};
// 标签切换
const CommodityParameterSettingTabsChange = () => {
  ClassificationChange();
};

// 生命周期
onMounted(() => {
  Reqs.ReqCommodityClassification(
    {
      list: commodityClassificationList,
      list2: commodityClassificationListOptions,
    },
    { currentUsername }
  );
});
</script>

<style>
@import url("../static/css/home/commodity-parameter-setting/commodity-parameter-setting.css");
</style>