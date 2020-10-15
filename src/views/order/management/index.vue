<template>
  <div class="app-container">
    <div class="filter-container">
      订单号：<el-input v-model="listQuery.name" placeholder="" size="small" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      买家手机号：<el-input v-model="listQuery.phone" placeholder="" size="small" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      卖家手机号：<el-input v-model="listQuery.phone" placeholder="" size="small" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      订单状态：<el-select v-model="listQuery.realName" placeholder="" size="small" clearable class="filter-item" style="width: 100px">
        <el-option label="是" value="1" />
        <el-option label="否" value="0" />
      </el-select>
      订单类型：<el-select v-model="listQuery.realName" placeholder="" size="small" clearable class="filter-item" style="width: 100px">
        <el-option label="是" value="1" />
        <el-option label="否" value="0" />
      </el-select>

      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;" @sort-change="sortChange">
      <el-table-column prop="orderId" label="订单号" min-width="5%"></el-table-column>
      <el-table-column prop="buyPhone" label="买家手机号" align="center" min-width="8%"></el-table-column>
      <el-table-column prop="sellerPhone" label="卖家手机号" align="center" min-width="8%"></el-table-column>
      <el-table-column prop="number" label="数量" align="center" min-width="4%"></el-table-column>
      <el-table-column prop="cny" label="CNY" align="center" min-width="4%"></el-table-column>
      <el-table-column prop="price" label="价格" align="center" min-width="4%"></el-table-column>
      <el-table-column label="订单状态" align="center" min-width="6%">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status == 1 ? '是':'否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="订单类型" align="center" min-width="6%"></el-table-column>
      <el-table-column prop="time" label="时间" align="center" min-width="6%"></el-table-column>
      <el-table-column prop="serviceCharge" label="手续费" align="center" min-width="5%"></el-table-column>

      <el-table-column label="操作" min-width="8%" class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <el-button type="primary" size="mini" @click="exchangeState(row)">
            更改状态
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { getOrderList } from "@/api/table";
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
        limit: 20
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getOrderList(this.listQuery)
        .then((response) => {
          this.list = response.data;
          this.total = response.data.length;
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

    exchangeState(row) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = 'disable';
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
