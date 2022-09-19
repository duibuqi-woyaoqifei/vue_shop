<template>
  <div id="main">
    <div id="dataReport"></div>
  </div>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入图表类型，图表后缀都为 Chart
import { PieChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from "echarts/components";
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

onMounted(() => {
  let myReport = document.getElementById("dataReport");
  myReport.removeAttribute("_echarts_instance_");
  // 初始化echarts实例
  var myChart = echarts.init(myReport, null, {
    width: 800,
    height: 800,
  });
  // 绘制图表
  myChart.setOption({
    // 标题
    title: {
      text: "2020年服饰总销量统计图表(7月份)",
      textStyle: {
        color: "#000",
        fontSize: 20,
      },
      // 标题与容器左边的距离
      left: "center",
    },
    // 文字消息提示框
    tooltip: {
      triggerOn: "mousemove",
      formatter: "{b}：{c}件 ({d}%)",
    },
    series: [
      {
        // 图表类型
        type: "pie",
        // 饼状图表类型
        roseType: "area",
        // 标签
        label: {
          color: "#fff",
          fontSize: 15,
        },
        // 数据都为0时不显示饼状图
        stillShowZeroSum: false,
        data: [
          {
            value: 1232,
            name: "衬衫",
          },
          {
            value: 3213,
            name: "牛仔裤",
          },
          {
            value: 3123,
            name: "夹克",
          },
          {
            value: 2123,
            name: "羊绒外套",
          },
          {
            value: 3223,
            name: "棒球帽",
          },
          {
            value: 1123,
            name: "毛衣",
          },
          {
            value: 4123,
            name: "休闲裤",
          },
        ],
        // 图表(饼)占比大小
        radius: "60%",
        // 图表(最外层的圆)与标签的引导线
        labelLine: {
          length: 40,
          length2: 30,
          lineStyle: {
            color: "#fff",
          },
        },
      },
    ],
  });
});
</script>
 <style scoped>
#main {
  position: relative;
  top: 20px;
  height: 100%;
  width: 100%;
}
#dataReport {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
}
</style>