<template>
  <div class="app-container">
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;" @row-click="clickRow">
      <el-table-column prop="id" label="用户ID" min-width="10%"></el-table-column>
      <el-table-column prop="phoneNumber" label="电话号码" align="center" min-width="10%"></el-table-column>
      <el-table-column prop="content" label="反馈内容" align="left" min-width="40%"></el-table-column>
      <el-table-column label="图片" align="left" min-width="30%">
        <template slot-scope="{row}">
          <el-image style="width: 100px; height: 100px" :src="row.iamges" :preview-src-list="row.iamges"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" min-width="10%" class-name="badge-overflow-display">
        <template slot-scope="{row}">
          <el-badge is-dot class="item" :hidden="row.haveRead">{{ row.commitTime }}</el-badge>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="反馈回复" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false" style="min-height:60vh">
      <div style="min-height:50vh">
        <el-row :gutter="20">
          <el-col :span="20" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); padding:1rem;">
            <el-row style="margin-bottom: 1rem;">
              <el-col :span="12">用户 反馈</el-col>
              <el-col :span="12" style="text-align:end">{{ replyRow.commitTime }}</el-col>
            </el-row>
            <el-row>
              <div style="margin-left:1rem">{{ replyRow.content }}</div>
            </el-row>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:2rem">
          <el-col :span="20">
            <el-input v-model="replyContent" type="textarea" :autosize="{ minRows: 4, maxRows: 10}" placeholder="回复内容"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="replyBtnCommit('addNotifyForm')">回 复</el-button>
          </el-col>
        </el-row>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFeedbackList, getFeedbackReplyList } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: { Pagination },
  filters: {

  },
  data() {
    return {
      tableKey: 0,
      list: null,
      replyList: null,
      total: 0,
      listLoading: true,
      replyListLoading: true,
      dialogVisible: false,
      replyRow: {},
      replyContent: '',
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
      getFeedbackList(this.listQuery)
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

    deleteItem(row) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = 'disable';
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    clickRow(row, column, cell, event) {
      this.replyListLoading = true;
      this.dialogVisible = true;
      this.replyRow = row;
      getFeedbackReplyList(row.id)
      .then(response => {
        this.replyList = response.data;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.replyListLoading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .badge-overflow-display{
  .cell{
    overflow:initial;
  }
}
</style>
