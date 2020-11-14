<template>
  <div class="app-container">
    <el-button type="primary" size="mini" style="margin-bottom:1rem" @click="showVoteDialog()">
      添加自制投票
    </el-button>

    <el-table v-loading="VoteListLoading" :data="VoteList" border fit highlight-current-row style="width: 100%;">
      <el-table-column prop="voteId" label="投票ID" width="150"></el-table-column>
      <el-table-column prop="content" label="投票内容" min-width="150"></el-table-column>
      <el-table-column prop="runing" label="是否进行中" width="250">
        <template slot-scope="{row}">
          <el-tag :type="row.runing | statusFilter" size="mini">
            {{ row.runing ? '是':'否' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-popconfirm title="确认删除投票" @confirm="deleteVoteHandle(row)">
            <el-button slot="reference" v-loading="showDeleteVoteLoading(row)" :disabled="showDeleteVoteLoading(row)" size="mini" type="warning">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="totalDataList>0" :total="totalDataList" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" style="padding:6px" @pagination="getList" />

    <el-dialog title="创建自制投票" :visible.sync="voteDialogVisible" width="50%" :close-on-click-modal="false">
      <el-form ref="voteForm" label-position="right" :rules="voteRules" :model="voteTemp" label-width="100px" style="width:100%;max-width: 600px;padding-left:50px;max-height:60vh;overflow: auto;">
        <el-form-item label="投票内容" prop="content">
          <el-input v-model="voteTemp.content" style="width:100%; max-width:300px" />
          <el-upload
            :action="fileAction"
            :data="fileParam"
            :headers="{Authorization:token}"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
            :on-success="fileSuccess"
            :on-error="fileError"
            style="display:inline-block"
          >
            <el-button size="small" type="primary">添加照片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="投票选项" prop="options">
          <div v-for="(op,index) in voteTemp.options" :key="index" style="margin-bottom:0.5rem">
            <el-input v-model="op.value" style="width:100%; max-width:300px" />
            <el-button v-if="index !== 0" size="mini" @click.prevent="removeOption(index)">删除</el-button>
          </div>
          <div><el-button size="mini" icon="el-icon-plus" @click.prevent="addOptions()">添加选项</el-button></div>
        </el-form-item>

        <el-form-item label="选择模式">
          <el-radio-group v-model="voteTemp.type">
            <el-radio :label="false">单选</el-radio>
            <el-radio :label="true">
              多选
              <el-input-number v-model="voteTemp.optionNumber" size="mini" controls-position="right" :min="1" :max="voteTemp.options.length" style="width:5rem"></el-input-number>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="倒计时">
          <el-radio-group v-model="voteTemp.expiresType">
            <el-radio :label="0">24H</el-radio>
            <el-radio :label="1">48H</el-radio>
            <el-radio :label="2">72H</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="voteDialogVisible = false">取 消</el-button>
        <el-button v-loading="addVoteLoading" :disabled="addVoteLoading" size="mini" type="primary" @click="confirmVote">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getVoteList, deleteVote, addVote } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from 'vuex';

export default {
  name: "VoteManagement",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'true': "success",
        'false': "info"
      };
      return statusMap[status];
    }
  },

  data() {
    const optionsValidator = (rule, value, callback) => {
      if (value.some(v => !v.value)) {
        callback(new Error('选项不能为空'));
      } else {
        callback();
      }
    };
    return {
      VoteList: null,
      totalDataList: 0,
      VoteListLoading: false,
      addVoteLoading: false,
      voteDialogVisible: false,
      deleteVoteLoadingList: [],
      fileAction: `${process.env.VUE_APP_BASE_API.replace('8080', '8001')}/fs/upload/image`,
      fileParam: { imageType: 'VOTE' },
      voteTemp: {
        content: "", // 投票主题
        expiresType: 0, // 倒计时选项0->24 1->48 2->72
        images: [], // 图片
        optionNumber: 0, // 多选个数
        options: [{ value: '' }], // 选项内容
        type: false // 投票类型：false->单选， true->多选
      },
      voteRules: {
        content: [{ required: true, message: '投票主题不能为空', trigger: 'blur' }],
        options: [{ required: true, message: '选项不能为空', trigger: 'blur', validator: optionsValidator }]
      },
      listQuery: {
        page: 1,
        pageSize: 20
      }
    };
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  created() {
    this.getList();
  },
  methods: {

    showVoteDialog() {
      this.voteDialogVisible = true;
      this.voteTemp = {
        content: "",
        expiresType: 0,
        images: [],
        optionNumber: 0,
        options: [{ value: '' }],
        type: false
      };
      this.$nextTick(() => {
        this.$refs['voteForm'].clearValidate();
      });
    },
    getList(hideLoading) {
      this.VoteListLoading = !hideLoading;
      getVoteList(this.listQuery)
        .then((response) => {
          this.VoteList = response.data.contents;
          this.totalDataList = response.data.total;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.VoteListLoading = false;
        });
    },

    showDeleteVoteLoading(row) {
      return this.deleteVoteLoadingList.includes(row.voteId);
    },
    deleteVoteHandle(row) {
      this.deleteVoteLoadingList.push(row.voteId);
      deleteVote({ voteId: row.voteId })
      .then(res => {
        this.VoteList.splice(this.VoteList.findIndex(v => v.voteId === row.voteId), 1);
      })
      .catch(() => {})
      .finally(() => {
        this.deleteVoteLoadingList.splice(this.deleteVoteLoadingList.indexOf(row.voteId), 1);
      });
    },
    confirmVote() {
      this.$refs['voteForm'].validate((valid) => {
        if (!valid) { return; }
        this.addVoteLoading = true;
        addVote({
          content: this.voteTemp.content,
          expiresType: this.voteTemp.expiresType,
          images: this.voteTemp.images,
          optionNumber: this.voteTemp.optionNumber,
          options: this.voteTemp.options.map(v => v.value),
          type: this.voteTemp.type
        })
        .then(res => {
          this.voteDialogVisible = false;
          this.getList(true);
        })
        .catch(() => {})
        .finally(() => {
          this.addVoteLoading = false;
        });
      });
    },
    addOptions() {
      this.voteTemp.options.push({ value: '' });
    },
    removeOption(idx) {
      this.voteTemp.options.splice(idx, 1);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    fileSuccess(response, file, fileList) {
      debugger;
      if (response.errorCode === 10000) {
        this.$message.success(`文件${file.name}上传成功`);
        this.voteTemp.images.push(response.data);
      } else {
        this.$message.warning(`文件${file.name}上传失败：${response.errorMsg}`);
      }
    },
    fileError(err, file, fileList) {
      debugger;
      try {
        this.$message.warning(JSON.parse(err.message).error);
      } catch (error) {
        this.$message.warning(`文件${file.name}上传失败`);
      }
      this.$message.warning(err);
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
