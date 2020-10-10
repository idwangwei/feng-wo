<template>
  <div class="list-detail-componets">
    <el-popover v-if="itemData.status === 'WAIT_AUDIT' || itemData.status === 'SELLING'" placement="left" title="提示" width="300" trigger="click" content="审核中，销售中的商品无法修改">
      <el-button slot="reference" type="text">修改</el-button>
    </el-popover>

    <div v-else>
      <el-button type="text" @click="showModify">修改</el-button>
      <el-dialog title="商品修改" :visible.sync="dialogVisible" center>
        <el-form ref="form" label-position="left" label-width="100px" :model="form" :rules="rules">
          <el-form-item label="商品标题" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="10">
              <el-form-item label="价格" prop="price">
                <el-input v-model="form.price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="库存" prop="stock">
                <el-input v-model="form.stock"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="是否三包" prop="warranty">
                <el-select v-model="form.warranty" placeholder="请选择">
                  <el-option label="是" value="Y"></el-option>
                  <el-option label="否" value="N"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-form-item label="使用时长" prop="usedTime">
                <el-select v-model="form.usedTime" placeholder="请选择">
                  <el-option v-for="item in usedTimeList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="额外营销信息" prop="extraDesc">
            <el-input v-model="form.extraDesc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="submitForm()">立即修改</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDetail, modify } from "@/api/merchantCommodity";
import { checkPermission, showPermissionMessage } from "@/utils/auth.js";
export default {
  name: "MerchantCommodityModify",
  props: {
    itemData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        commodityId: '',
        extraDesc: '',
        price: '',
        stock: '',
        title: '',
        usedTime: '',
        warranty: '',
        warrantyTime: ''
      },
      loading: false,
      rules: {
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        stock: [{ required: true, message: "请输入库存", trigger: "blur" }],
        title: [{ required: true, message: "请输入商品标题", trigger: "blur" }],
        usedTime: [{ required: true, message: "请选择时长", trigger: "change" }],
        warranty: [{ required: true, message: "请选择三包", trigger: "change" }]
      },
      usedTimeList: ['一年', '二年', '三年', '四年', '五年及以上']
    };
  },
  computed: {

  },
  created() {
  },
  methods: {
    showModify() {
      this.dialogVisible = true;
      getDetail({ commodityId: this.itemData.id }).then(resp => {
        this.form.commodityId = resp.data.id;
        this.form.extraDesc = resp.data.extraDesc;
        this.form.price = resp.data.price;
        this.form.stock = resp.data.stock;
        this.form.title = resp.data.title;
        this.form.usedTime = resp.data.usedTime;
        this.form.warranty = resp.data.warranty;
        this.form.warrantyTime = resp.data.warrantyTime;
      });
    },
    submitForm() {
      if (checkPermission()) {
        showPermissionMessage();
        return;
      }
      this.loading = true;
      modify(this.form).then(resp => {
        this.dialogVisible = false;
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list-detail-componets {
  .detail-row-item {
    margin: 1rem auto;
  }
}
</style>>

