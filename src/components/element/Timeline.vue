<template>
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :icon="activity.icon"
      :type="activity.type"
      :color="activity.color"
      :size="activity.size"
      :hollow="activity.hollow"
    >
      {{ activity.content }}
      <p class="timestampFont">{{ activity.timestamp }}</p>
    </el-timeline-item>
  </el-timeline>
</template>

<script setup>
import { MoreFilled } from "@element-plus/icons-vue";

const activities = [
  {
    content: "快件已签收 签收人：齐泽克 感谢使用拉康速递，期待再次为您服务",
    timestamp: "2018-04-12 20:46",
    size: "large",
    type: "success",
    icon: MoreFilled,
  },
  {
    content:
      "Marché Bistro Barje II, A2 73 Direction Novo Mesto 1000 Ljubljana SI, Cesta dveh cesarjev, 1000 Ljubljana 公司派件人：黑格尔(17775201314) 正在派件",
    timestamp: "2018-04-03 20:46",
  },
  {
    content: "快递已到达 Cesta dveh cesarjev, 1000 Ljubljana",
    timestamp: "2018-04-03 20:46",
    color: "#0bbd87",
  },
  {
    content: "快递已发往 Cesta dveh cesarjev, 1000 Ljubljana",
    timestamp: "2018-04-03 20:46",
  },
  {
    content: "快递已到达 Alba Julia 6 | Sector 3, Bucharest 031104, Romania",
    timestamp: "2018-04-03 20:46",
    size: "large",
    type: "primary",
  },
  {
    content: "快递已发往 Alba Julia 6 | Sector 3, Bucharest 031104, Romania",
    timestamp: "2018-04-03 20:46",
  },
  {
    content: "快递已到达 Pizza Hut, Baghdad,Irak",
    timestamp: "2018-04-03 20:46",
    type: "primary",
    hollow: true,
  },
  {
    content: "快递已发往 Pizza Hut, Baghdad, Irak",
    timestamp: "2018-04-03 20:46",
  },
  {
    content:
      "Yazd Province, Yazd, Meysam, Parsian Hotel, Iran 公司取件人：张三(888888888) 已收件",
    timestamp: "2018-04-03 20:46",
  },
];
</script>

<style scoped>
.timestampFont {
  color: #9c9496;
  font-size: 14px;
}
</style>