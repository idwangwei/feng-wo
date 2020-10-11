<template>
  <div class="dashboard-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData.newVisitis" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData.purchases" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData.shoppings" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
import LineChart from "@/components/lineChart";
import PanelGroup from "./PanelGroup";

const lineChartData = {
  newVisitis: {
    legend: '总用户数量',
    edgeColor: '#40c9c6',
    dateArr: ['2020/10/01', '2020/10/02', '2020/10/03', '2020/10/04', '2020/10/05', '2020/10/06', '2020/10/07'],
    valueArr: [120, 82, 91, 154, 162, 140, 145]
  },
  purchases: {
    legend: '总交易数量',
    edgeColor: '#f4516c',
    dateArr: ['2020/10/01', '2020/10/02', '2020/10/03', '2020/10/04', '2020/10/05', '2020/10/06', '2020/10/07'],
    valueArr: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    legend: '矿池转入量',
    edgeColor: '#34bfa3',
    dateArr: ['2020/10/01', '2020/10/02', '2020/10/03', '2020/10/04', '2020/10/05', '2020/10/06', '2020/10/07'],
    valueArr: [120, 82, 91, 154, 162, 140, 130]
  }
};
export default {
  name: "Dashboard",
  components: {
    LineChart,
    PanelGroup
  },
  data() {
    return {
      lineChartData: lineChartData
    };
  },
  computed: {},
  mounted() {},
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
