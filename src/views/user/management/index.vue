<template>
  <div class="app-container">
    <div class="filter-container">
      昵称：<el-input v-model="listQuery.name" placeholder="" size="mini" clearable style="width: 150px;margin-right:1rem;margin-top: 0.5rem;" class="filter-item" @keyup.enter.native="handleFilter" />
      手机号：<el-input v-model="listQuery.phone" placeholder="" size="mini" clearable style="width: 150px;;margin-right:1rem;margin-top: 0.5rem;" class="filter-item" @keyup.enter.native="handleFilter" />
      实名：<el-select v-model="listQuery.active" placeholder="" size="mini" clearable class="filter-item" style="width: 100px;margin-right:1rem;margin-top: 0.5rem;">
        <el-option label="全部" :value="null" />
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
      账号状态：<el-select v-model="listQuery.enable" placeholder="" size="mini" clearable class="filter-item" style="width: 100px;margin-right:1rem;margin-top: 0.5rem;">
        <el-option label="全部" :value="null" />
        <el-option label="正常" :value="true" />
        <el-option label="冻结" :value="false" />
      </el-select>
      交易权限：<el-select v-model="listQuery.alipayEnable" placeholder="" size="mini" clearable class="filter-item" style="width: 100px;margin-right:1rem;margin-top: 0.5rem;">
        <el-option label="全部" :value="null" />
        <el-option label="正常" :value="true" />
        <el-option label="冻结" :value="false" />
      </el-select>

      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" style="margin-top: 0.5rem;" :disabled="listLoading" @click="handleFilter">
        查询
      </el-button>

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;" @sort-change="sortChange">
      <el-table-column prop="name" label="昵称" width="180"></el-table-column>
      <el-table-column prop="phone" label="电话号码" align="center" width="120"></el-table-column>
      <el-table-column label="是否实名" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.active | statusFilter" size="mini">
            {{ row.active ? '是':'否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="账户状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.enable | statusFilter" size="mini">
            {{ row.enable ? '正常':'已冻结' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="交易权限" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.alipayEnable | statusFilter" size="mini">
            {{ row.alipayEnable ? '正常':'已冻结' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="unusedWwt" label="FMC数量" align="center" width="120" sortable></el-table-column>
      <el-table-column prop="usedWwt" label="矿池投入数量" align="center" width="150" sortable></el-table-column>
      <el-table-column label="上级" align="center" width="220">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.editParentPhone" class="edit-input" size="mini" style="width:120px" />
            <el-button class="cancel-btn" size="mini" type="warning" @click="cancelEdit(row)">
              取消
            </el-button>
          </template>
          <span v-else>{{ row.parentPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="320px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <el-button v-if="row.enable" v-loading="showFreezeLoading(row)" type="primary" size="mini" :disabled="showFreezeLoading(row)" @click="freezeAccount(row)">
            冻结账户
          </el-button>
          <el-button v-else v-loading="showUnFreezeLoading(row)" size="mini" type="success" :disabled="showUnFreezeLoading(row)" @click="unfreezeAccount(row)">
            解冻账户
          </el-button>
          <el-button v-if="row.alipayEnable" v-loading="showFreezeTradLoading(row)" type="primary" size="mini" :disabled="showFreezeTradLoading(row)" @click="freezeAccountTrad(row)">
            冻结交易权限
          </el-button>
          <el-button v-else v-loading="showUnFreezeTradLoading(row)" size="mini" type="success" :disabled="showUnFreezeTradLoading(row)" @click="unfreezeAccountTrad(row)">
            解冻交易权限
          </el-button>
          <template v-if="!row.parentPhone">
            <el-button v-if="row.edit" v-loading="showBindLoading(row)" type="success" size="mini" :disabled="showBindLoading(row)" @click="bindSuperior(row)">
              确认
            </el-button>
            <el-button v-else type="primary" size="mini" @click="row.edit=!row.edit">
              分配上级
            </el-button>
          </template>

          <el-button v-if="!row.active" v-loading="showActiveLoading(row)" size="mini" type="danger" :disabled="showActiveLoading(row)" @click="activeUser(row)">
            激活
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { getUserList, modifyUserInfo } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "UserManagement",
  components: { Pagination },
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
      total: 0,
      listLoading: true,
      freezeExchangeList: [],
      unfreezeExchangeList: [],
      freezeTradExchangeList: [],
      unfreezeTradExchangeList: [],
      bindExchangeList: [],
      activeExchangeList: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        language: "",
        asc: false,
        orderValue: "",
        name: "",
        phone: "",
        active: null,
        enable: null,
        alipayEnable: null

      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      const params = { ...this.listQuery };
      getUserList(params)
        .then((response) => {
          this.list = response.data.contents.map(v => ({ ...v, edit: false, editParentPhone: null }));
          this.total = response.data.total;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    sortChange(data) {
      const { prop, order } = data;
      if (prop === "usedWwt") {
        this.listQuery.orderValue = "used_wwt";
      }
      if (prop === "unusedWwt") {
        this.listQuery.orderValue = "unused_wwt";
      }

      if (order === "ascending") {
        this.listQuery.asc = false;
      } else {
        this.listQuery.asc = true;
      }
      this.handleFilter();
    },

    showFreezeLoading(row) {
      return this.freezeExchangeList.includes(row.phone);
    },
    showUnFreezeLoading(row) {
      return this.unfreezeExchangeList.includes(row.phone);
    },
    showFreezeTradLoading(row) {
      return this.freezeTradExchangeList.includes(row.phone);
    },
    showUnFreezeTradLoading(row) {
      return this.unfreezeTradExchangeList.includes(row.phone);
    },
    showBindLoading(row) {
      return this.bindExchangeList.includes(row.phone);
    },
    showActiveLoading(row) {
      return this.activeExchangeList.includes(row.phone);
    },
    unfreezeAccount(row) {
      this.unfreezeExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, enable: true })
      .then(res => {
        row.enable = true;

        this.$message({
          message: `用户【${row.name}】解冻成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.unfreezeExchangeList.splice(this.unfreezeExchangeList.indexOf(row.phone), 1);
      });
    },
    freezeAccount(row) {
      debugger;
      this.freezeExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, enable: false })
      .then(res => {
        row.enable = false;

        this.$message({
          message: `用户【${row.name}】冻结成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.freezeExchangeList.splice(this.freezeExchangeList.indexOf(row.phone), 1);
      });
    },
    unfreezeAccountTrad(row) {
      this.unfreezeTradExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, alipayEnable: true })
      .then(res => {
        row.alipayEnable = true;
        this.$message({
          message: `用户【${row.name}】交易权限解冻成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.unfreezeTradExchangeList.splice(this.unfreezeTradExchangeList.indexOf(row.phone), 1);
      });
    },
    freezeAccountTrad(row) {
      debugger;
      this.freezeTradExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, alipayEnable: false })
      .then(res => {
        row.alipayEnable = false;
        this.$message({
          message: `用户【${row.name}】交易权限冻结成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.freezeTradExchangeList.splice(this.freezeTradExchangeList.indexOf(row.phone), 1);
      });
    },
    bindSuperior(row) {
      this.bindExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, parentPhone: row.editParentPhone })
      .then(res => {
        row.edit = false;
        this.$message({
          message: `用户【${row.name}】绑定上级成功`,
          type: 'success'
        });
        row.parentPhone = row.editParentPhone;
        row.editParentPhone = null;
      }).catch(() => {
        row.editParentPhone = null;
      }).finally(() => {
        this.bindExchangeList.splice(this.bindExchangeList.indexOf(row.phone), 1);
      });
    },
    activeUser(row) {
      this.activeExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, active: true })
      .then(res => {
        row.active = true;
        this.$message({
          message: `用户【${row.name}】激活成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.activeExchangeList.splice(this.activeExchangeList.indexOf(row.phone), 1);
      });
    },

    cancelEdit(row) {
      row.editParentPhone = '';
      row.edit = false;
    }

  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-loading-spinner{
  svg{
    width: 1rem;
  }
}
</style>
