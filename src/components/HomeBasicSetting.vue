<template>
  <el-scrollbar class="settingBox">
    <h3>基本设置</h3>
    <p>我的头像：</p>
    <Upload></Upload>
  </el-scrollbar>
</template>

<script setup>
import { ref } from "vue";
import Upload from "./element/Upload.vue";
</script>

<style scoped>
</style>