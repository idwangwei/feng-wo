<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">
        添加矿池
      </el-button>

    </div> -->

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;">
      <el-table-column prop="name" label="矿池名称" width="200"></el-table-column>
      <el-table-column prop="wwt" label="FMC数量" align="center" width="120"></el-table-column>
      <el-table-column prop="rate" label="执行率" align="center" width="100" :formatter="formatterRate"></el-table-column>
      <el-table-column prop="period" label="执行周期" align="center" width="100"></el-table-column>
      <el-table-column prop="earnings" label="预计收益" align="center" width="100"></el-table-column>
      <el-table-column prop="buyMax" label="最大购买数量" align="center" width="120"></el-table-column>
      <el-table-column label="上架状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.enable | statusFilter">
            {{ row.enable ? '是':'否' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="auto" class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <el-button v-if="row.enable" v-loading="downHandleLoading(row)" :disabled="downHandleLoading(row)" type="primary" size="mini" @click="downHandle(row)">
            下架
          </el-button>
          <el-button v-else v-loading="upHandleLoading(row)" :disabled="upHandleLoading(row)" size="mini" type="success" @click="upHandle(row)">
            上架
          </el-button>

          <el-button type="primary" size="mini" @click="editItem(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑矿池" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false">
      <el-form ref="editPoolForm" :model="ruleForm" :rules="rules" label-width="7rem">
        <el-form-item label="矿池名称">
          <el-input v-model="ruleForm.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="预计收益">
          <el-input :value="editEarnings" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="最大购买数量" prop="buyMax">
          <el-input v-model.number="ruleForm.buyMax"></el-input>
        </el-form-item>
        <el-form-item label="执行率" prop="rate">
          <el-input v-model.number="ruleForm.rate"></el-input>
        </el-form-item>
        <el-form-item label="FMC投入数量" prop="wwt">
          <el-input v-model.number="ruleForm.wwt"></el-input>
        </el-form-item>
        <el-form-item label="执行周期" prop="period">
          <el-input v-model.number="ruleForm.period"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-loading="editLoading" type="primary" :disabled="editLoading" @click="submitForm('editPoolForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { getPoolList, switchPoolEnableStatus, updatePoolInfo } from "@/api/table";

export default {
  name: "PoolManagement",
  components: { },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "true": "success",
        "false": "info"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      upExchangeList: [],
      downExchangeList: [],
      dialogVisible: false,
      editLoading: false,
      listQuery: {
        isUser: false,
        language: ""
      },

      ruleForm: {
        buyMax: 0,
        earnings: 0,
        id: 0,
        language: "",
        name: "",
        period: 0,
        rate: 0,
        wwt: 0
      },
      rules: {
        buyMax: [
          { required: true, message: '最大购买数量不能为空' },
          { type: 'number', message: '最大购买数量必须为数字值' }
        ],
        rate: [
          { required: true, message: '执行率不能为空' },
          { type: 'number', message: '执行率必须为数字值' }
        ],
        wwt: [
          { required: true, message: 'FMC投入数量不能为空' },
          { type: 'number', message: 'FMC投入数量必须为数字值' }
        ],
        period: [
          { required: true, message: '执行周期不能为空' },
          { type: 'number', message: '执行周期必须为数字值' }
        ]
      }
    };
  },
  computed: {
    editEarnings: {
      // getter
      get: function() {
        return this.ruleForm.wwt * this.ruleForm.rate / 100;
      },
      // setter
      set: function(newValue) {
        console.log('set editEarnings');
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    formatterRate(row, column, cellValue, index) {
      return cellValue + '%';
    },

    getList() {
      this.listLoading = true;
      getPoolList(this.listQuery)
        .then((response) => {
          this.list = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    upHandleLoading(row) {
      return this.upExchangeList.includes(row.miningId);
    },
    downHandleLoading(row) {
      return this.downExchangeList.includes(row.miningId);
    },
    upHandle(row) {
      this.upExchangeList.push(row.miningId);
      switchPoolEnableStatus({ id: row.miningId, language: '' })
      .then(res => {
        row.enable = true;
        this.$message({
          message: `矿池【${row.name}】上架成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.upExchangeList.splice(this.upExchangeList.indexOf(row.miningId), 1);
      });
    },
    downHandle(row) {
      this.downExchangeList.push(row.miningId);
      switchPoolEnableStatus({ id: row.miningId, language: '' })
      .then(res => {
        row.enable = false;
        this.$message({
          message: `矿池【${row.name}】下架成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.downExchangeList.splice(this.downExchangeList.indexOf(row.miningId), 1);
      });
    },
    editItem(row) {
      this.dialogVisible = true;
      this.ruleForm.buyMax = row.buyMax;
      this.ruleForm.earnings = row.earnings;
      this.ruleForm.id = row.miningId;
      this.ruleForm.name = row.name;
      this.ruleForm.period = row.period;
      this.ruleForm.rate = row.rate;
      this.ruleForm.wwt = row.wwt;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editLoading = true;
          updatePoolInfo({ ...this.ruleForm, earnings: this.editEarnings })
          .then(res => {
            this.dialogVisible = false;
            const row = this.list.find(v => v.miningId === this.ruleForm.id);
            row.period = this.ruleForm.period;
            row.rate = this.ruleForm.rate;
            row.wwt = this.ruleForm.wwt;
            row.buyMax = this.ruleForm.buyMax;
            row.earnings = this.ruleForm.earnings;
          })
          .catch(() => {})
          .finally(() => {
            this.editLoading = false;
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.filter-container{
  .filter-item{
    margin-right: 1rem;
  }

}
/deep/ .el-dialog__body{
  padding-right: 7rem;
}
/deep/ .el-loading-spinner{
  svg{
    width: 1rem;
  }
}
</style>
