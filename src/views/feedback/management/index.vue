<template>
  <div class="app-container">
    <el-row>
      联系电话：<el-input v-model="searchParam.phone" placeholder="" size="mini" clearable style="width: 150px;;margin-right:1rem;margin-top: 0.5rem;" class="filter-item"></el-input>
      状态：<el-select v-model="searchParam.readType" placeholder="" size="mini" clearable class="filter-item" style="width: 100px;margin-right:1rem;margin-top: 0.5rem;">
        <el-option label="已读" :value="true" />
        <el-option label="未读" :value="false" />
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" style="margin-top: 0.5rem;" :disabled="listLoading" @click="handleFilter">
        查询
      </el-button>
    </el-row>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;" @row-click="clickRow">
      <!-- <el-table-column prop="id" label="用户ID" min-width="10%"></el-table-column> -->
      <el-table-column prop="user" label="用户账号" align="center" min-width="10%"></el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center" min-width="10%"></el-table-column>
      <el-table-column prop="content" label="反馈内容" align="left" min-width="40%"></el-table-column>
      <el-table-column label="图片" align="center" width="120px">
        <template slot-scope="{row}">
          <div @click.stop>
            <el-image v-if="row.url" style="width: 100px; height: 100px" :src="row.url" :preview-src-list="row.imageList"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" min-width="10%" class-name="badge-overflow-display">
        <template slot-scope="{row}">
          <el-badge is-dot class="item" :hidden="row.haveRead">{{ row.commitTime | DateFilter }}</el-badge>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-popconfirm title="确认删除？" @confirm="deleteItem(row)">
            <el-button slot="reference" v-loading="showDeleteLoading(row)" :disabled="showDeleteLoading(row)" type="primary" size="mini" @click.stop="">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="反馈回复" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false" top="5vh">
      <div>
        <div style="min-height:50vh; max-height:50vh; overflow-y:auto">
          <el-row :gutter="20" style="margin:0 0 1rem 0.3rem;">
            <el-col :span="20" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); padding:1rem;">
              <el-row style="margin-bottom: 1rem;">
                <el-col :span="12">用户 反馈</el-col>
                <el-col :span="12" style="text-align:end">{{ replyRow.commitTime | DateFilter }}</el-col>
              </el-row>
              <el-row>
                <div style="margin-left:1rem">{{ replyRow.content }}</div>
              </el-row>
            </el-col>
            <el-col :span="4"></el-col>
          </el-row>

          <template v-for="(item, index) in replyList">
            <el-row :key="index" :gutter="20" style="margin:0 0 1rem 0.3rem;">
              <el-col :span="20" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); padding:1rem;">
                <el-row style="margin-bottom: 1rem;">
                  <el-col :span="12">{{ item.replyObj === 'ADMIN' ? '客服':'用户' }} 反馈</el-col>
                  <el-col :span="12" style="text-align:end">{{ item.commitTime | DateFilter }}</el-col>
                </el-row>
                <el-row>
                  <div style="margin-left:1rem">{{ item.content }}</div>
                </el-row>
              </el-col>
              <el-col :span="4"></el-col>
            </el-row>
          </template>
        </div>
        <el-row :gutter="20" style="margin-top:2rem">
          <el-col :span="20">
            <el-input v-model="replyContent" type="textarea" :autosize="{ minRows: 4, maxRows: 10}" placeholder="回复内容"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button v-loading="replyLoading" type="primary" :disabled="!replyContent || replyLoading" @click="replyBtnCommit">回 复</el-button>
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
import { getFeedbackList, getFeedbackReplyList, replyFeedback, deleteFeedback } from "@/api/table";
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
      list: null,
      replyList: null,
      total: 0,
      listLoading: true,
      replyListLoading: true,
      replyLoading: false,
      dialogVisible: false,
      replyRow: {},
      replyContent: '',
      searchParam: {
        phone: '',
        readType: null
      },
      listQuery: {
        language: '',
        page: 1,
        pageSize: 10
      },
      deleteLoadingList: []

    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(param) {
      this.listLoading = true;
      getFeedbackList(param || this.listQuery)
        .then((response) => {
          this.list = response.data.contents.map(v => {
            let imageList = [];
            try {
                imageList = v.images.replace(/\[|\]/g, '').split(',').map(img => `${process.env.VUE_APP_BASE_API}/bms/common/images/FEEDBACK/${img.trim()}`);
            } catch (err) {
                return { ...v, url: null, imageList: null };
            }
            return { ...v, url: imageList[0], imageList: imageList };
          });
          this.total = response.data.total;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },

    handleFilter() {
      this.listQuery.page = 1;
      const param = { ...this.listQuery };
      if (this.searchParam.phone) {
        param.phone = this.searchParam.phone;
      }
      if (this.searchParam.readType === true || this.searchParam.readType === false) {
        param.readType = this.searchParam.readType;
      }
      this.getList(param);
    },

    clickRow(row, column, event) {
      this.replyListLoading = true;
      this.dialogVisible = true;
      this.replyRow = row;
      this.replyContent = null;
      this.replyList = [];
      getFeedbackReplyList({ feedbackId: row.id, language: '', replyObj: 'ADMIN' })
      .then(response => {
        this.replyList = response.data;
        this.replyRow.haveRead = true;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.replyListLoading = false;
      });
    },

    replyBtnCommit() {
      this.replyLoading = true;
      replyFeedback({ content: this.replyContent, language: '', feedbackId: this.replyRow.id, replyObj: 'ADMIN' })
      .then(res => {
        this.replyContent = null;
        getFeedbackReplyList({ feedbackId: this.replyRow.id, language: '', replyObj: 'ADMIN' })
          .then(response => {
              this.replyList = response.data;
          });
      })
      .finally(() => {
        this.replyLoading = false;
      });
    },
    showDeleteLoading(row) {
      return this.deleteLoadingList.includes(row.id);
    },
    deleteItem(row) {
      this.deleteLoadingList.push(row.id);
      deleteFeedback({ delId: row.id })
      .then(res => {
        this.$message({
          message: `反馈删除成功`,
          type: 'success'
        });
        this.handleFilter();
      })
      .catch(() => {})
      .finally(() => {
        this.deleteLoadingList.splice(this.deleteLoadingList.indexOf(row.id), 1);
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
/deep/ .el-loading-spinner{
  svg{
    width: 1rem;
  }
}
</style>
