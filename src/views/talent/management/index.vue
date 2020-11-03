<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tag>达人今日分红概览</el-tag>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;" height="calc(50vh - 164px)">
      <el-table-column label="等级" align="center" min-width="20%">
        <template slot-scope="{row}">
          <span>{{ row.level | LVFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="人数" align="center" min-width="20%"></el-table-column>
      <el-table-column prop="avg" label="平均分红" align="center" min-width="20%"></el-table-column>
      <el-table-column prop="all" label="总分红" align="center" min-width="20%"></el-table-column>
      <el-table-column prop="servicecharge" label="分红手续费" align="center" min-width="20%"></el-table-column>
    </el-table>

    <el-divider></el-divider>
    <div class="filter-container">
      <el-tag style="margin-right:1rem">达人今日分红详情</el-tag>
      <el-select v-model="editQuery.lv" size="mini" style="width:8rem;margin-right:1rem" placeholder="达人等级">
        <el-option label="LV1" value="1"> </el-option>
        <el-option label="LV2" value="2"> </el-option>
        <el-option label="LV3" value="3"> </el-option>
        <el-option label="LV4" value="4"> </el-option>
      </el-select>
      <el-input v-model="editQuery.name" size="mini" style="width:8rem;margin-right:1rem" placeholder="达人姓名" @keyup.enter.native="queryDetailListByParam()"></el-input>
      <el-input v-model="editQuery.userPhone" size="mini" style="width:8rem;margin-right:1rem" placeholder="达人号码" @keyup.enter.native="queryDetailListByParam()"></el-input>
      <el-button v-loading="queryLoading" :disabled="queryLoading" type="primary" size="mini" @click="queryDetailListByParam()">
        查询
      </el-button>
      <el-button :disabled="listLoading" type="primary" size="mini" @click="queryDetailListByParam(true)">
        全部
      </el-button>

    </div>
    <el-table :key="DetailTableKey" v-loading="DetailListLoading" :data="DetailList" border fit highlight-current-row style="width: 100%; margin-top:1rem;" height="calc(50vh - 124px)">
      <el-table-column prop="userPhone" label="手机号码" align="center" min-width="20%"></el-table-column>
      <el-table-column prop="name" label="达人姓名" align="center" min-width="20%"></el-table-column>
      <el-table-column label="达人等级" align="center" min-width="20%">
        <template slot-scope="{row}">
          <span>{{ row.level | LVFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dividend" label="今日分红" align="center" min-width="20%"></el-table-column>
      <el-table-column prop="allDividend" label="总共分红" align="center" min-width="20%"></el-table-column>
    </el-table>

    <pagination v-show="totalDetailList>0" :total="totalDetailList" :page.sync="listQueryDetail.page" :limit.sync="listQueryDetail.limit" style="padding:6px" @pagination="getListDetail" />
  </div>
</template>

<script>
import { getTalentOverview, getTalentInfoList } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { Message } from 'element-ui';

export default {
  name: "TalentManagement",
  components: { Pagination },
  filters: {
    LVFilter(data) {
      return 'LV' + data;
    }
  },
  data() {
    return {
      tableKey: 0,
      DetailTableKey: 1,
      list: null,
      DetailList: null,
      totalDetailList: 0,
      listLoading: true,
      DetailListLoading: false,
      editQuery: {
        lv: null,
        name: null,
        userPhone: null
      },
      queryLoading: false,
      listQueryDetail: {
        page: 1,
        pageSize: 20,
        lv: null,
        name: null,
        userPhone: null,
        language: ""
      }
    };
  },
  created() {
    this.getOverview();
    this.getListDetail();
  },
  methods: {
    queryDetailListByParam(isAll) {
      if (isAll) {
        this.listQueryDetail.lv = this.editQuery.lv = null;
        this.listQueryDetail.name = this.editQuery.name = null;
        this.listQueryDetail.userPhone = this.editQuery.userPhone = null;
        this.listQueryDetail.page = 1;
        this.getListDetail();
        return;
      }
      const reg = /^\d+$/;
      debugger;
      if (this.editQuery.lv && !reg.test(this.editQuery.lv.trim())) {
        Message({
          dangerouslyUseHTMLString: true,
          message: `达人等级应该为正整数`,
          type: 'error',
          duration: 10 * 500
        });
        return;
      }
      if (!this.editQuery.lv && this.editQuery.name && this.editQuery.userPhone) { return; }
      this.listQueryDetail.lv = this.editQuery.lv && this.editQuery.lv.trim();
      this.listQueryDetail.name = this.editQuery.name && this.editQuery.name.trim();
      this.listQueryDetail.userPhone = this.editQuery.userPhone && this.editQuery.userPhone.trim();
      this.listQueryDetail.page = 1;
      this.queryLoading = true;
      this.getListDetail(true);
    },
    getOverview(hideLoading) {
      this.listLoading = !hideLoading;
      getTalentOverview()
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
    getListDetail(hideLoading) {
      this.DetailListLoading = !hideLoading;
      getTalentInfoList(this.listQueryDetail)
        .then((response) => {
          this.DetailList = response.data.contents;
          this.totalDetailList = response.data.total;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.DetailListLoading = false;
          this.queryLoading = false;
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
/deep/ .el-loading-spinner{
  svg{
    width: 1rem;
  }
}
</style>
