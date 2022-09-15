<template>
  <el-upload
    v-model:file-list="fileList"
    ref="uploadRef"
    class="avatar-uploader"
    :http-request="uploadRequest"
    :on-remove="HandleRemove"
    :on-preview="HandlePreview"
    :on-change="ChangeImg"
    list-type="picture-card"
    :limit="1"
  >
    <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" />
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import axios from "../../plugnis/axios";

const uploadRef = ref();
const dialogVisible = ref(false);
const dialogImageUrl = ref("");
const fileList = ref([]);

const ReqHead = () => {
  axios
    .get(axios.baseURL + "/upload")
    .then((data) => {
      if (data) {
        fileList.value.push({ url: "/img/head/" + data });
      }
    })
    .catch((err) => {});
};

const ChangeImg = (file) => {
  const typeArr = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
  const isJPG = typeArr.indexOf(file.raw.type) !== -1;
  const isLt3M = file.size / 1024 / 1024 < 3;
  if (!isJPG) {
    ElMessage({
      message: "格式错误！",
      type: "error",
      showClose: true,
    });
    uploadRef.value.clearFiles();
    return;
  }
  if (!isLt3M) {
    ElMessage({
      message: "上传图片大小不能超过 3MB!",
      type: "error",
      showClose: true,
    });
    uploadRef.value.clearFiles();
    return;
  }

  const formData = new FormData();
  formData.append("file", file.raw);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://192.168.1.80:3001/upload", true);

  xhr.onload = function (data) {
    // 请求结束后，在此处写处理代码
    console.log(1);
  };
  xhr.send(formData);
  window.location.reload();
};
const HandlePreview = (file) => {
  dialogVisible.value = true;
  dialogImageUrl.value = file.url;
};
const HandleRemove = () => {
  axios
    .post(
      axios.baseURL + "/upload/set",
      JSON.stringify({ operation: "delete" })
    )
    .then((data) => {
      if (data === "Deleted successfully") {
        ElMessage({
          message: "删除成功！",
          type: "success",
          showClose: true,
        });
        uploadRef.value.clearFiles();
        window.location.reload();
      }
    })
    .catch((err) => {
      ElMessage({
        message: "请求超时！",
        type: "error",
        showClose: true,
      });
    });
};
const uploadRequest = () => {};

onMounted(() => {
  ReqHead();
});
</script>

<style>
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: rgba(255, 2552, 255, 0.8);
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>