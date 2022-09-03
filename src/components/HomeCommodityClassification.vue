<template>
  <!-- 添加分类按钮 -->
  <el-row class="addClassification">
    <el-col>
      <el-button type="primary" size="large" @click="AddClassification"
        >添加分类</el-button
      >
    </el-col>
  </el-row>

  <!-- 商品分类树形控件 -->
  <el-scrollbar class="commodityClassificationTree">
    <div>
      <h3>商品分类</h3>
      <el-tree
        :data="commodityClassificationList"
        :props="commodityClassificationProps"
        default-expand-all
        :indent="32"
      >
        <template #default="{ node, data }">
          <span class="treeRow">
            <span class="treeLeft"
              >{{ node.label
              }}<span v-if="!node.isLeaf">
                ({{ data.children.length }})
              </span></span
            >

            <span>
              <el-button
                type="danger"
                icon="Delete"
                circle
                size="small"
                @click="RemoveClassification(node, data)"
              />
            </span>
          </span>
        </template>
      </el-tree>
    </div>
  </el-scrollbar>

  <!-- 添加分类对话框 -->
  <el-dialog
    v-model="showAddClassificationDialog"
    title="添加"
    @close="AddClassificationDialogCancel"
  >
    <el-form
      :model="addClassificationForm"
      ref="addClassificationFormRef"
      :rules="addClassificationListFormRules"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="addClassificationForm.name" />
      </el-form-item>
      <el-form-item label="父级分类" prop="parentName">
        <el-cascader
          v-model="addClassificationForm.parentName"
          ref="commodityClassificationCascadeSelectorRef"
          :options="commodityClassificationListOptions"
          clearable
          :props="commodityClassificationCascadeSelectorProps"
        >
          <template #default="{ node, data }">
            <div @click="CascaderClick(node, data)">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </div>
          </template>
        </el-cascader>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row :gutter="10">
        <el-col :span="21"
          ><el-button @click="AddClassificationDialogCancel"
            >取消</el-button
          ></el-col
        >
        <el-col :span="3"
          ><el-button type="primary" @click="AddClassificationDialogSubmit"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Reqs, Sets } from "../request/Req";
import { Throttle, InitialConvertCase } from "../plugnis/function";
import { DialogCancel, DialogSubmit } from "../plugnis/dom";

// 数据
const currentUsername = window.localStorage.getItem("currentUsername"); //当前账号名
const commodityClassificationList = ref([]); // 商品分类列表
const commodityClassificationListOptions = ref([]); // 级联选择器数据
const commodityClassificationCascadeSelectorRef = ref(null); // 级联选择器ref
const showAddClassificationDialog = ref(false); // 添加分类对话框
// 添加商品分类表单
const addClassificationFormRef = ref(null);
const addClassificationForm = reactive({
  name: "",
  parentName: "",
});

// 商品分类各组件props
const commodityClassificationProps = {
  label: "name",
  children: "children",
};
const commodityClassificationCascadeSelectorProps = {
  label: "name",
  value: "name",
  expandTrigger: "hover",
};

//添加商品分类表单校验规则
const validateClassName = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("分类名称不能为空"));
  }
  let exists = [];
  for (let i in commodityClassificationList.value) {
    if (addClassificationForm.parentName[0] === undefined) {
      exists.push(commodityClassificationList.value[i].name);
    } else if (
      commodityClassificationList.value[i].name ===
      addClassificationForm.parentName[0]
    ) {
      for (let index in commodityClassificationList.value[i].children) {
        if (addClassificationForm.parentName[1] === undefined) {
          exists.push(
            commodityClassificationList.value[i].children[index].name
          );
        } else if (
          commodityClassificationList.value[i].children[index].name ===
          addClassificationForm.parentName[1]
        ) {
          for (let item of commodityClassificationList.value[i].children[index]
            .children) {
            exists.push(item.name);
          }
        }
      }
    }
  }
  if (exists.indexOf(value) !== -1) {
    callback(new Error("已存在此分类"));
  }
  callback();
};
const addClassificationListFormRules = reactive({
  name: [{ required: true, validator: validateClassName, trigger: "blur" }],
});

// 请求方法

// dom
// 删除某一分类及其所有子分类
const RemoveClassification = (node, data) => {
  let one = "";
  let two = "";
  if (data.level === 0) {
    one = data.name;
  }
  if (data.level === 1) {
    one = node.parent.label;
    two = data.name;
  }
  if (data.level === 2) {
    one = node.parent.parent.label;
    two = node.parent.label;
  }
  const requestContent = {
    req: {
      Reqs: Reqs.ReqCommodityClassification,
      list: commodityClassificationList,
      list2: commodityClassificationListOptions,
      queryInfo: { currentUsername },
    },
    pendingUpdateData: {
      name: data.name,
      one,
      two,
      level: data.level,
      operation: "deleteCommodityclassification",
      currentUsername,
    },
  };
  Sets.SetCommodityClassification(requestContent);
};
// 添加分类
const AddClassification = () => {
  showAddClassificationDialog.value = true;
};

// 级联选择器
const CascaderClick = (node, data) => {
  if (node.isLeaf === false) {
    setTimeout(() => {
      commodityClassificationCascadeSelectorRef.value.inputValue = node.label;
    }, 0);
  }
  commodityClassificationCascadeSelectorRef.value.togglePopperVisible(false);
  addClassificationForm.parentName = JSON.parse(
    JSON.stringify(node.pathValues)
  );
};

// 添加商品分类对话框取消
const AddClassificationDialogCancel = () => {
  DialogCancel(showAddClassificationDialog, addClassificationFormRef);
  setTimeout(() => {
    commodityClassificationCascadeSelectorRef.value.inputValue = "";
  }, 300);
};
// 提交
const AddClassificationDialogSubmit = () => {
  addClassificationFormRef.value.validate(async (isValid) => {
    if (!isValid) {
      return ElMessage({
        message: "信息填写错误！",
        type: "error",
        showClose: true,
      });
    }
    if (addClassificationForm.parentName) {
      addClassificationForm.parentName =
        addClassificationForm.parentName.join(",");
    }
    await DialogSubmit(addClassificationForm, "addCommodityclassification", {
      Reqs: Reqs.ReqCommodityClassification,
      Sets: Sets.SetCommodityClassification,
      list: commodityClassificationList,
      list2: commodityClassificationListOptions,
      queryInfo: { currentUsername },
    });
    setTimeout(() => {
      commodityClassificationCascadeSelectorRef.value.inputValue = "";
    }, 300);
    showAddClassificationDialog.value = false;
  });
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
@import url("../static/css/home/commodity-classification/commodity-classification.css");
</style>