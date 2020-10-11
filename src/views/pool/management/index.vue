<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      昵称：<el-input v-model="listQuery.name" placeholder="" size="small" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      手机号：<el-input v-model="listQuery.phone" placeholder="" size="small" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      实名：<el-select v-model="listQuery.realName" placeholder="" size="small" clearable class="filter-item" style="width: 100px">
        <el-option label="是" value="1" />
        <el-option label="否" value="0" />
      </el-select>

      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>

    </div> -->

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;" @sort-change="sortChange">
      <el-table-column prop="type" label="类型名称" width="100"></el-table-column>
      <el-table-column prop="wwt" label="WWT数量" align="center" width="180" sortable></el-table-column>
      <el-table-column prop="rate" label="执行率" align="center" width="100" sortable></el-table-column>
      <el-table-column prop="cycle" label="周期" align="center" width="180"></el-table-column>
      <el-table-column prop="profit" label="预计收益" align="center" width="200"></el-table-column>

      <el-table-column label="操作" width="auto" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="editItem(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { getPoolList } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        type: "",
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
      getPoolList(this.listQuery)
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

    editItem(row) {
      this.$notify({
        title: "INFO",
        message: "稍后",
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
