<template>
  <div class="app-container">
    <div class="filter-container">
      昵称：<el-input v-model="listQuery.name" placeholder="" size="small" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      手机号：<el-input v-model="listQuery.phone" placeholder="" size="small" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      实名：<el-select v-model="listQuery.realName" placeholder="" size="small" clearable class="filter-item" style="width: 100px">
        <el-option label="是" value="1" />
        <el-option label="否" value="0" />
      </el-select>

      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;" @sort-change="sortChange">
      <el-table-column prop="name" label="昵称" width="100"></el-table-column>
      <el-table-column prop="phone" label="电话号码" align="center" width="200"></el-table-column>
      <el-table-column label="是否实名" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.realName | statusFilter">
            {{ row.realName == 1 ? '是':'否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="wwt" label="WWT数量" align="center" width="180" sortable></el-table-column>
      <el-table-column prop="poolNum" label="矿池投入数量" align="center" width="180" sortable></el-table-column>
      <el-table-column prop="superior" label="上级" align="center" width="200"></el-table-column>

      <el-table-column label="操作" width="auto" class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <el-button v-if="row.status == 'enable'" type="primary" size="mini" @click="freezeAccount(row)">
            冻结
          </el-button>
          <el-button v-else size="mini" type="success" @click="unfreezeAccount(row)">
            解冻
          </el-button>
          <el-button v-if="!row.superior" size="mini" type="danger" @click="bindSuperior(row)">
            分配上级
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { getUserList } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "success",
        0: "info"
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
      listQuery: {
        page: 1,
        limit: 20,
        phone: "",
        name: "",
        realName: "",
        sort: null
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
          this.list = response.data.items;
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
      if (prop === "wwt") {
        this.sortByWWT(order);
      }
    },
    sortByWWT(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+wwt";
      } else {
        this.listQuery.sort = "-wwt";
      }
      this.handleFilter();
    },
    unfreezeAccount(row) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = 'enable';
    },
    freezeAccount(row) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = 'disable';
    },
    bindSuperior(row) {
      this.$notify({
        title: "INFO",
        message: "稍后分配",
        type: "info",
        duration: 2000
      });
      // this.list.splice(index, 1);
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
</style>
