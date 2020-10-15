<template>
  <div class="app-container">
    <el-form ref="addNotifyForm" :model="ruleForm" :rules="rules" label-width="100px" inline label-position="top">
      <el-form-item :label="dateArr[0]" prop="day1"><el-input v-model="ruleForm.day1" style="width:100px"></el-input></el-form-item>
      <el-form-item :label="dateArr[1]" prop="day2"><el-input v-model="ruleForm.day2" style="width:100px"></el-input></el-form-item>
      <el-form-item :label="dateArr[2]" prop="day3"><el-input v-model="ruleForm.day3" style="width:100px"></el-input></el-form-item>
      <el-form-item :label="dateArr[3]" prop="day4"><el-input v-model="ruleForm.day4" style="width:100px"></el-input></el-form-item>
      <el-form-item :label="dateArr[4]" prop="day5"><el-input v-model="ruleForm.day5" style="width:100px"></el-input></el-form-item>
      <el-form-item :label="dateArr[5]" prop="day6"><el-input v-model="ruleForm.day6" style="width:100px"></el-input></el-form-item>
      <el-form-item :label="dateArr[6]" prop="day7"><el-input v-model="ruleForm.day7" style="width:100px"></el-input></el-form-item>
      <el-form-item :label="btnLabel">
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="addNotify()">
          添加
        </el-button>

      </el-form-item>
    </el-form>

    
  </div>
</template>

<script>
import { getNotifyList } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils/index";
export default {
  name: "ComplexTable",
  components: { Pagination },
  filters: {

  },
  data() {
    return {
      btnLabel:'--',
      ruleForm: {
        day1: '',
        day2: '',
        day3: '',
        day4: '',
        day5: '',
        day6: '',
        day7: '',
      },
      dateArr:[],
      rules: {
        day1: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        day2: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        day3: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        day4: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        day5: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        day6: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        day7: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        
      },
    };
  },
  created() {
    for(let i = 0; i < 7;i++){
    this.dateArr.push(parseTime(new Date().getTime()+24*3600*1000, '{y}-{m}-{d}'));
    }

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
