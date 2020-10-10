<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" highlight-current-row border>
      <el-table-column type="index" width="50" :index="indexMethod"></el-table-column>
      <el-table-column label="需求详情" prop="content"></el-table-column>
      <el-table-column label="联系地址" prop="address"></el-table-column>
      <el-table-column label="联系电话" prop="phoneNum" width="150"></el-table-column>
      <el-table-column label="创建日期" prop="createTime" width="160"></el-table-column>
      <el-table-column label="状态" prop="status" width="100"></el-table-column>
    </el-table>
    <div class="block">
      <el-pagination :current-page="page.current" :page-sizes="page.sizeList" :page-size="page.size" :layout="layout" :total="page.total" :hide-on-single-page="true" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getDemandList
} from "@/api/operatorCommodity";
import { Page } from "@/utils/page";

export default {
  name: "UserDemandTabel",
  components: {},
  filters: {},
  data() {
    return {
      list: [],
      listLoading: true,
      page: new Page(),
      layout: "total, sizes, prev, pager, next, jumper, slot"
    };
  },
  computed: {},
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
    //   this.page.unset();
      this.listLoading = true;
      getDemandList({ ...this.page.getQueryParam() })
        .then(resp => {
          this.list = resp.data.list;
          this.page.setTotal(resp.data.total);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    handleSizeChange(val) {
      this.page.setSize(val);
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page.setCurrent(val);
      this.fetchData();
    },
    indexMethod(index) {
        return this.page.getSize() * (this.page.getCurrent() - 1) + index + 1;
    }
  }
};
</script>
