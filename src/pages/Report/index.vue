<template>
  <div>
    <!-- 导航 -->
    <NavBar title1="数据统计" title2="数据报表" />

    <!-- 卡片视图 -->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 800px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar"
import * as echarts from "echarts"
import request from "@/utils/request.js"

export default {
  components: { NavBar },
  data() {
    return {
      // 需要合并的数据
      option: {
        title: {
          text: "用户来源"
        },
        tooltip: {},
        legend: {
          data: [""]
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
    }
  },
  mounted() {
    // 初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"))
    request.get(`reports/type/1`).then(data => {
      const res = data.data
      const result = {...res.data, ...this.option}
      myChart.setOption(result)
    })
  }
}
</script>

<style></style>
