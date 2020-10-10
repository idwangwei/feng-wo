<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="商家状态">
            <el-select v-model="formInline.status" placeholder="所有状态">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchData(true)">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-divider></el-divider>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" highlight-current-row border>
      <el-table-column type="index" width="50" :index="indexMethod"></el-table-column>
      <el-table-column label="商户名称" prop="name" width="180"></el-table-column>
      <el-table-column label="手机号码" prop="phoneNum" width="120"></el-table-column>
      <el-table-column label="联系人" prop="linkman" width="95"></el-table-column>
      <el-table-column label="法人" prop="corporate" width="95"></el-table-column>
      <el-table-column label="法人证件号" prop="corporateIdCard" width="200"></el-table-column>
      <el-table-column label="商户地址" prop="address"></el-table-column>
      <el-table-column label="商户状态" width="150">
        <template slot-scope="scope">
          <list-status :status="scope.row.status" :merchant-id="scope.row.id" @merchant-status-change="statusChange($event)"></list-status>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <list-detail :merchant-id="scope.row.id"></list-detail>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination :current-page="page.current" :page-sizes="page.sizeList" :page-size="page.size" :layout="layout" :total="page.total" :hide-on-single-page="true" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getList } from "@/api/merchantTable";
import { Page } from "@/utils/page";
import ListDetail from "./ListDetail";
import ListStatus from "./ListStatus";
import { mapGetters } from "vuex";
import { addImgPrefix } from "@/utils/index";

export default {
  name: "MerchantTabel",
  components: { ListDetail, ListStatus },
  filters: {
    // statusFilter(status) {
    //   const statusMap = {
    //     published: 'success',
    //     draft: 'gray',
    //     deleted: 'danger'
    //   };
    //   return statusMap[status];
    // }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      page: new Page(),
      formInline: {
        status: null
      },
      layout: "total, sizes, prev, pager, next, jumper, slot"
    };
  },
  computed: {
    ...mapGetters(["statusList"])
  },
  created() {
    !this.statusList || this.$store.dispatch("app/setStatusList");
    this.fetchData();
  },
  methods: {
    addImgPrefix,
    fetchData(onset) {
      if (onset) {
        this.page.unset();
      }
      this.listLoading = true;
      getList({ ...this.page.getQueryParam(), ...this.formInline })
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
    statusChange(data) {
      const item = this.list.find(v => v.id === data.id);
      item.status = data.status;
      item.statusDesc = this.statusList.find(
        v => v.key === data.status
      ).label;
    },
    indexMethod(index) {
      return (
        this.page.getSize() * (this.page.getCurrent() - 1) + index + 1
      );
    }
  }
};
</script>
