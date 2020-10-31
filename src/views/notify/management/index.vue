<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tag>系统公告</el-tag>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="showDialog()">
        添加
      </el-button>

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;" height="calc(50vh - 164px)">
      <el-table-column prop="title" label="标题" min-width="20%"></el-table-column>
      <el-table-column prop="content" label="内容" align="left" min-width="60%"></el-table-column>
      <el-table-column label="时间" align="center" min-width="12%">
        <template slot-scope="{row}">
          <span>{{ row.commitTime | DateFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="10%" class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <el-button v-loading="showDeleteLoading(row)" :disabled="showDeleteLoading(row)" type="primary" size="mini" @click="deleteItem(row)">
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding:6px" @pagination="getList" />
    <el-divider></el-divider>
    <div class="filter-container">
      <el-tag>处罚公告</el-tag>
      <el-input v-model="filterUserPhone" size="mini" style="width:8rem;margin-right:1rem;margin-left:2rem" placeholder="用户电话" @keyup.enter.native="queryPunishListByParam()"></el-input>
      <el-button v-loading="queryLoading" :disabled="queryLoading" type="primary" size="mini" @click="queryPunishListByParam()">
        查询
      </el-button>
      <el-button :disabled="listLoading" type="primary" size="mini" @click="queryPunishListByParam(true)">
        全部
      </el-button>

    </div>
    <el-table :key="punishTableKey" v-loading="punishListLoading" :data="punishList" border fit highlight-current-row style="width: 100%; margin-top:1rem;" height="calc(50vh - 164px)">
      <el-table-column prop="userPhone" label="用户" align="center" width="120px"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="20%"></el-table-column>
      <el-table-column prop="content" label="内容" align="left" min-width="60%"></el-table-column>
      <el-table-column label="时间" align="center" min-width="12%">
        <template slot-scope="{row}">
          <span>{{ row.commitTime | DateFilter }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="totalPunish>0" :total="totalPunish" :page.sync="listQueryPunish.page" :limit.sync="listQueryPunish.limit" style="padding:6px" @pagination="getListPunish" />

    <el-dialog title="创建公告" :visible.sync="dialogVisible" width="50%">
      <el-form ref="addNotifyForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input v-model="ruleForm.content" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-loading="addLoading" type="primary" :disabled="addLoading" @click="submitForm('addNotifyForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getNotifyList, deleteNotify, addNotify } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils/index";

export default {
  name: "ComplexTable",
  components: { Pagination },
  filters: {
    DateFilter(time) {
      return parseTime(time);
    }
  },
  data() {
    return {
      tableKey: 0,
      punishTableKey: 1,
      list: null,
      punishList: null,
      total: 0,
      totalPunish: 0,
      listLoading: true,
      addLoading: false,
      dialogVisible: false,
      punishListLoading: false,
      ruleForm: {
        title: '',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写公告内容', trigger: 'blur' }
        ]
      },
      listQuery: {
        page: 1,
        pageSize: 20,
        announcementId: null,
        isAdmin: true,
        queryAnn: true,
        language: ""
      },
      filterUserPhone: '',
      queryLoading: false,
      listQueryPunish: {
        page: 1,
        pageSize: 20,
        announcementId: null,
        isAdmin: true,
        userPhone: "",
        language: ""
      },
      deleteLoadingList: []
    };
  },
  created() {
    this.getList();
    this.getListPunish();
  },
  methods: {
    queryPunishListByParam(isAll) {
      debugger;
      if (isAll) {
        this.filterUserPhone = "";
        this.listQueryPunish.userPhone = "";
        this.listQueryPunish.page = 1;
        this.getListPunish();
        return;
      }
      if (!this.filterUserPhone) { return; }
      this.listQueryPunish.userPhone = this.filterUserPhone;
      this.listQueryPunish.page = 1;
      this.queryLoading = true;
      this.getListPunish(true);
    },
    getList(hideLoading) {
      this.listLoading = !hideLoading;
      getNotifyList(this.listQuery)
        .then((response) => {
          this.list = response.data.contents;
          this.total = response.data.total;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    getListPunish(hideLoading) {
      this.punishListLoading = !hideLoading;
      getNotifyList(this.listQueryPunish)
        .then((response) => {
          this.punishList = response.data.contents;
          this.totalPunish = response.data.total;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.punishListLoading = false;
          this.queryLoading = false;
        });
    },
    showDialog() {
      this.dialogVisible = true;
      this.$refs.addNotifyForm && this.$refs.addNotifyForm.resetFields();
    },
    showDeleteLoading(row) {
      return this.deleteLoadingList.includes(row.id);
    },
    deleteItem(row) {
      this.deleteLoadingList.push(row.id);
      deleteNotify({ id: row.id })
      .then(res => {
        this.$message({
          message: `公告【${row.title}】删除成功`,
          type: 'success'
        });
        this.getList(true);
      })
      .catch(() => {})
      .finally(() => {
        this.deleteLoadingList.splice(this.deleteLoadingList.indexOf(row.id), 1);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addLoading = true;
          addNotify(this.ruleForm)
          .then(res => {
            this.dialogVisible = false;
            this.getList(true);
          })
          .catch(() => {})
          .finally(() => {
            this.addLoading = false;
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
/deep/ .el-loading-spinner{
  svg{
    width: 1rem;
  }
}
</style>
