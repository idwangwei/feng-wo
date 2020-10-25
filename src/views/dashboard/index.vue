<template>
  <div class="dashboard-container">
    <panel-group
      :all-user-count="chartData.allUserCount"
      :all-trading="chartData.allTrading"
      :all-buy-mining="chartData.allBuyMining"
      :register-today="chartData.registerToday"
    />

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :chart-data="chartData.userData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :chart-data="chartData.orderData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :chart-data="chartData.miningData" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
import LineChart from "@/components/lineChart";
import PanelGroup from "./PanelGroup";

import { getHomeData } from "@/api/table";
export default {
  name: "Dashboard",
  components: {
    LineChart,
    PanelGroup
  },
  data() {
    return {
      chartData: {
        allUserCount: 0,
        allTrading: 0,
        allBuyMining: 0,
        registerToday: 0,
        userData: {
          title: '总用户数量',
          edgeColor: '#40c9c6',
          data: []
        },
        orderData: {
          title: '总交易数量',
          edgeColor: '#f4516c',
          data: []
        },
        miningData: {
          title: '矿池转入量',
          edgeColor: '#34bfa3',
          data: {}
        }
      }
    };
  },
  computed: {},
  mounted() {
    getHomeData().then(res => {
      this.chartData = {
        allUserCount: res.data.allUserCount,
        allTrading: res.data.allTrading,
        allBuyMining: res.data.allBuyMining,
        registerToday: res.data.registerToday,
        countDataStartTime: res.data.countDataStartTime,
        userData: {
          title: '用户',
          edgeColor: '#40c9c6',
          data: res.data.userData
        },
        orderData: {
          title: '交易',
          edgeColor: '#f4516c',
          data: res.data.orderData
        },
        miningData: {
          title: '矿池',
          edgeColor: '#34bfa3',
          data: res.data.miningData
        }
      };
    });
  },
  methods: {
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
