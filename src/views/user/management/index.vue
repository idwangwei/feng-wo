<template>
  <div class="app-container">
    <div class="filter-container">
      昵称：<el-input v-model="listQuery.name" placeholder="" size="small" clearable style="width: 150px;margin-right:1rem" class="filter-item" @keyup.enter.native="handleFilter" />
      手机号：<el-input v-model="listQuery.phone" placeholder="" size="small" clearable style="width: 150px;;margin-right:1rem" class="filter-item" @keyup.enter.native="handleFilter" />
      实名：<el-select v-model="listQuery.active" placeholder="" size="small" clearable class="filter-item" style="width: 100px;margin-right:1rem">
        <el-option label="全部" :value="null" />
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
      账号状态：<el-select v-model="listQuery.enable" placeholder="" size="small" clearable class="filter-item" style="width: 100px;margin-right:1rem">
        <el-option label="全部" :value="null" />
        <el-option label="正常" :value="true" />
        <el-option label="冻结" :value="false" />
      </el-select>
      交易权限：<el-select v-model="listQuery.alipayEnable" placeholder="" size="small" clearable class="filter-item" style="width: 100px;margin-right:1rem">
        <el-option label="全部" :value="null" />
        <el-option label="正常" :value="true" />
        <el-option label="冻结" :value="false" />
      </el-select>

      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" :disabled="listLoading" @click="handleFilter">
        查询
      </el-button>

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;" @sort-change="sortChange">
      <el-table-column prop="name" label="昵称" width="180"></el-table-column>
      <el-table-column prop="phone" label="电话号码" align="center" width="120"></el-table-column>
      <el-table-column label="是否实名" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.active | statusFilter">
            {{ row.active ? '是':'否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="unusedWwt" label="FMC数量" align="center" width="180" sortable></el-table-column>
      <el-table-column prop="usedWwt" label="矿池投入数量" align="center" width="180" sortable></el-table-column>
      <el-table-column label="上级" align="center" width="220">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.editParentPhone" class="edit-input" size="small" style="width:120px" />
            <el-button class="cancel-btn" size="mini" type="warning" @click="cancelEdit(row)">
              取消
            </el-button>
          </template>
          <span v-else>{{ row.parentPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="auto" class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <el-button v-if="row.enable" v-loading="showFreezeLoading(row)" type="primary" size="mini" @click="freezeAccount(row)">
            冻结
          </el-button>
          <el-button v-else v-loading="showUnFreezeLoading(row)" size="mini" type="success" @click="unfreezeAccount(row)">
            解冻
          </el-button>
          <template v-if="!row.parentPhone">
            <el-button v-if="row.edit" v-loading="showBindLoading(row)" type="success" size="mini" @click="bindSuperior(row)">
              确认
            </el-button>
            <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="row.edit=!row.edit">
              分配上级
            </el-button>
          </template>

          <el-button v-if="!row.active" v-loading="showActiveLoading(row)" size="mini" type="danger" @click="activeUser(row)">
            激活
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { getUserList, modifyUserInfo } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
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
      bindExchangeList: [],
      activeExchangeList: [],
      listQuery: {
        page: 1,
        limit: 20,
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
      getUserList(this.listQuery)
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
    showBindLoading(row) {
      return this.bindExchangeList.includes(row.phone);
    },
    showActiveLoading(row) {
      return this.activeExchangeList.includes(row.phone);
    },
    unfreezeAccount(row) {
      this.unfreezeExchangeList.push(row.phone);
      modifyUserInfo({ phone: row.phone, enable: true })
      .then(res => {
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
      modifyUserInfo({ phone: row.phone, enable: false })
      .then(res => {
        this.$message({
          message: `用户【${row.name}】冻结成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.freezeExchangeList.splice(this.freezeExchangeList.indexOf(row.phone), 1);
      });
    },
    bindSuperior(row) {
      this.bindExchangeList.push(row.phone);
      modifyUserInfo({ phone: row.phone, parentPhone: row.editParentPhone })
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
      modifyUserInfo({ phone: row.phone, active: true })
      .then(res => {
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
