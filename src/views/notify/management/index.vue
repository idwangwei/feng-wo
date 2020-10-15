<template>
  <div class="app-container">
    <div class="filter-container">

      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="addNotify()">
        添加
      </el-button>

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;">
      <el-table-column prop="title" label="标题" min-width="20%"></el-table-column>
      <el-table-column prop="content" label="内容" align="center" min-width="60%"></el-table-column>
      <el-table-column prop="commitTime" label="时间" align="center" min-width="10%"></el-table-column>

      <el-table-column label="操作" min-width="10%" class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <el-button type="primary" size="mini" @click="deleteItem(row)">
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
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
        <el-button type="primary" @click="submitForm('addNotifyForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getNotifyList } from "@/api/table";
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
      total: 0,
      listLoading: true,
      dialogVisible: false,
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
      getNotifyList(this.listQuery)
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

    addNotify() {
      this.dialogVisible = true;
      this.$refs.addNotifyForm && this.$refs.addNotifyForm.resetFields();
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
