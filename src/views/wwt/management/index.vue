<template>
  <div class="app-container">
    <el-form ref="wwtPriceForm" :model="ruleForm" :rules="rules" label-width="100px" inline label-position="top">
      <el-form-item :label="label.price1" prop="price1">
        <el-input v-model="ruleForm.price1" style="width:100px" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="label.price2" prop="price2">
        <el-input v-model="ruleForm.price2" style="width:100px" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="label.price3" prop="price3">
        <el-input v-model="ruleForm.price3" style="width:100px" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="label.price4" prop="price4">
        <el-input v-model="ruleForm.price4" style="width:100px" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="label.price5" prop="price5">
        <el-input v-model="ruleForm.price5" style="width:100px" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="label.price6" prop="price6">
        <el-input v-model="ruleForm.price6" style="width:100px" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="label.price7" prop="price7">
        <el-input v-model="ruleForm.price7" style="width:100px" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="btnLabel">
        <el-button v-loading="updateLoading" class="filter-item" size="mini" type="primary" icon="el-icon-search" :disabled="updateLoading" @click="submitForm('wwtPriceForm')">
          修改
        </el-button>

      </el-form-item>
    </el-form>

    <el-row type="flex" align="middle">

      <span>全部市场：</span><el-switch v-model="priceStatus.allMarket" :active-value="true" :inactive-value="false" style="margin-right:2rem"></el-switch>
      <span>大宗市场：</span><el-switch v-model="priceStatus.bigMarket" :active-value="true" :inactive-value="false" style="margin-right:2rem"></el-switch>
      <span>普通市场：</span><el-switch v-model="priceStatus.commonMarket" :active-value="true" :inactive-value="false" style="margin-right:2rem"></el-switch>
      <el-popconfirm title="确定修改市场状态?" @onConfirm="updateStatus">
        <el-button slot="reference" v-loading="setStatusLoading" type="primary" size="mini" :disabled="setStatusLoading">更新</el-button>
      </el-popconfirm>
    </el-row>

    <el-row :gutter="32" style="margin-top:2rem;">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getWWTPrice, getPriceList, updateWWTPrice, getPriceStatus, setPriceStatus } from "@/api/table";
import LineChart from "@/components/lineChart";
import { validateFloatNum } from "@/utils/validate";
export default {
  name: "WwtPrice",
  components: { LineChart },
  filters: {},
  data() {
    return {
      btnLabel: "--",
      listQuery: {},
      ruleForm: {
        price1: "",
        price2: "",
        price3: "",
        price4: "",
        price5: "",
        price6: "",
        price7: ""
      },
      label: {
        price1: "--",
        price2: "--",
        price3: "--",
        price4: "--",
        price5: "--",
        price6: "--",
        price7: "--"
      },
      rules: {
        price1: [{ required: true, validator: validateFloatNum }],
        price2: [{ required: true, validator: validateFloatNum }],
        price3: [{ required: true, validator: validateFloatNum }],
        price4: [{ required: true, validator: validateFloatNum }],
        price5: [{ required: true, validator: validateFloatNum }],
        price6: [{ required: true, validator: validateFloatNum }],
        price7: [{ required: true, validator: validateFloatNum }]
      },
      priceData: {},
      lineChartData: {
        title: '价格趋势',
        edgeColor: '#40c9c6',
        data: []
      },
      priceStatus: {
        allMarket: true,
        bigMarket: false,
        commonMarket: false
      },
      updateLoading: false,
      setStatusLoading: false
    };
  },
  created() {
    this.getList();
    this.getPriceChartData();
    this.getStatus();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getWWTPrice(this.listQuery)
        .then((response) => {
          this.priceData = response.data;
          [this.label.price1, this.ruleForm.price1] = response.data.price1.split(':');
          [this.label.price2, this.ruleForm.price2] = response.data.price2.split(':');
          [this.label.price3, this.ruleForm.price3] = response.data.price3.split(':');
          [this.label.price4, this.ruleForm.price4] = response.data.price4.split(':');
          [this.label.price5, this.ruleForm.price5] = response.data.price5.split(':');
          [this.label.price6, this.ruleForm.price6] = response.data.price6.split(':');
          [this.label.price7, this.ruleForm.price7] = response.data.price7.split(':');
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },

    getPriceChartData() {
      getPriceList()
        .then(res => {
          try {
            const prices = res.data.prices;
            this.lineChartData.data = Object.keys(prices).sort((v1, v2) => new Date(v1).getTime() - new Date(v2).getTime()).map(v => {
              return {
                time: v,
                count: prices[v]
              };
            });
          } catch (error) {
            this.lineChartData.data = [];
          }
        })
        .catch(() => {})
        .finally(() => {});
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const param = {
            price1: `${this.label.price1}:${this.ruleForm.price1}`,
            price2: `${this.label.price2}:${this.ruleForm.price2}`,
            price3: `${this.label.price3}:${this.ruleForm.price3}`,
            price4: `${this.label.price4}:${this.ruleForm.price4}`,
            price5: `${this.label.price5}:${this.ruleForm.price5}`,
            price6: `${this.label.price6}:${this.ruleForm.price6}`,
            price7: `${this.label.price7}:${this.ruleForm.price7}`
          };
          for (const key in this.priceData) {
            if (this.priceData[key] === param[key]) {
              delete param[key];
            }
          }
          if (!Object.keys(param).length) {
            return;
          }
          this.updateLoading = true;
          updateWWTPrice(param)
            .then(res => {
              this.getPriceChartData();
              this.$message({
                message: `价格设置修改成功`,
                type: 'success'
              });
            })
            .catch(() => {})
            .finally(() => {
              this.updateLoading = false;
            });
        }
      });
    },

    getStatus() {
      getPriceStatus()
      .then(res => {
        this.priceStatus = res.data;
      });
    },
    updateStatus() {
      this.setStatusLoading = true;
      setPriceStatus(this.priceStatus).then(res => {
      }).finally(() => {
        this.setStatusLoading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.filter-container {
  .filter-item {
    margin-right: 1rem;
  }
}
/deep/ .el-loading-spinner{
  svg{
    width: 1rem;
  }
}
</style>
