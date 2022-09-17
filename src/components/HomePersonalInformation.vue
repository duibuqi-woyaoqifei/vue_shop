<template>
  <img class="doughnut" src="img/doughnut.png" width="280" />
  <div class="hello">
    <h1>你好 {{ current_username }} ，愿你每天都开心！</h1>
    <p>“海上有冰天雪地，有晴空万里，有狂风骤雨，有电闪雷鸣，</p>
    <p>&nbsp;&nbsp;&nbsp;而海底除了寂静，什么也没了。”</p>
  </div>
  <div class="today">
    <!-- 今日订单 -->
    <div class="order">
      <p>今日新增订单</p>
      <!-- 时间线 -->
      <el-timeline class="timeline"> </el-timeline>
    </div>
    <div class="todayFoot">
      <!-- 今日收入 -->
      <div class="income">
        <h2>今日总收入：</h2>
        <h1>$0.00</h1>
      </div>
      <!-- 今日新增库存 -->
      <div class="newInventory">
        <h2>今日新增库存：</h2>
        <h1>0</h1>
      </div>
      <!-- 今日新增浏览量 -->
      <div class="view">
        <h2>今日新增浏览量：</h2>
        <h1>1</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    // 数据
    const current_username = ref(null);

    // 路由对象
    const router = useRouter();

    // 生命周期
    onMounted(() => {
      setTimeout(() => {
        current_username.value = window.localStorage.getItem("currentUsername");
      }, 1);
    });

    return {
      current_username,
    };
  },
};
</script>

<style lang="scss" scoped>
@import url("../static/css/home/personal-information/personal-information.css");
@import url("../static/css/home/personal-information/personal-information.scss");
</style>