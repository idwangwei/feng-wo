<template>
  <div class="new-commodity-components">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="new-form">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="适用车型" prop="carType">
            <el-select v-model="form.carType" placeholder="请选择">
              <el-option v-for="item in carTypeList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="form.brandId" placeholder="请选择">
              <el-option v-for="item in commodityBrandList" :key="item.brandId" :label="item.brandName" :value="item.brandId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- <el-form-item label="花纹" prop="decorativeId">
            <el-select v-model="form.decorativeId" placeholder="根据品牌选择">
              <el-option v-for="item in decorativeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item> -->
           <el-form-item label="花纹" prop="decorative">
            <el-input v-model="form.decorative"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="花纹深度" prop="decorativeDeep">
            <el-input v-model="form.decorativeDeep"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- <el-form-item label="尺码规格" prop="specificationId">
            <el-select v-model="form.specificationId" placeholder="根据品牌选择">
              <el-option v-for="item in specificationList" :key="item.id" :label="item.specification" :value="item.id"></el-option>
            </el-select>
          </el-form-item> -->
           <el-form-item label="尺码规格" prop="specification">
            <el-input v-model="form.specification"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="使用时长" prop="usedTime">
            <el-select v-model="form.usedTime" placeholder="请选择">
              <el-option v-for="item in usedTimeList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存" prop="stock">
            <el-input v-model="form.stock"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="速度级别" prop="speedRank">
            <el-input v-model="form.speedRank"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否三包" prop="warrantyCascader">
            <el-cascader v-model="form.warrantyCascader" :options="warrantyTimeOptions" :props="{ expandTrigger: 'hover' }" placeholder="请选择"></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="额外营销信息" prop="extraDesc">
        <el-input v-model="form.extraDesc" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item prop="homePicUrl" label="图片">
        <el-input ref="homePicUrl" v-model="form.homePicUrl" name="homePicUrl" type="text" style="display:none"></el-input>
        <el-upload :action="updateImgUri" list-type="picture-card" :file-list="updateFileList" :on-preview="handlePictureCardPreview" :on-success="handlePictureCardSuccess" :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="previewUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-row>
        <el-col :span="12" :offset="6">
          <el-button :loading="loading" style="width:100%" type="primary" class="register-btn" @click.native.prevent="submit">创建</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { add } from "@/api/merchantCommodity";
import { checkPermission, showPermissionMessage } from "@/utils/auth.js";
export default {
  name: "MerchantCommodityNew",
  props: {},
  data() {
    const validateWarranty = (rule, value, callback) => {
      debugger;
      if (value === "") {
        callback(new Error("请选择是否三包"));
      } else {
        this.form.warranty = value[0];
        this.form.warranty = value[0];
        this.form.warrantyTime = value[1];
        callback();
      }
    };
    return {
      dialogVisible: false,
      // speedRankList:['A1'],
      form: {
        brandId: "", // 品牌
        carType: "", // 适用车型
        decorativeDeep: "", // 条纹深度
        decorative: "", // 条纹
        extraDesc: "", // 额外营销信息
        homePicUrl: "", // 首页展示图片
        imageUrlList: [], // 更多图片
        mediaUrl: "", // 视频地址
        price: "", // 价格
        specification: "", // 尺码规格
        speedRank: "", //
        stock: "", // 库存
        title: "", // 标题
        usedTime: "", // 使用时长
        warranty: "", // 是否三包'Y'/'N'
        warrantyCascader: "", // 是否三包级联选择modal
        warrantyTime: "" // 三包时长
      },
      rules: {
        brandId: [
          { required: true, message: "请选择品牌", trigger: "change" }
        ],
        carType: [
          {
            required: true,
            message: "请选择适用车型",
            trigger: "change"
          }
        ],
        // decorativeDeep: [{ required: true, message: "请输入条纹深度", trigger: "blur" }],
        decorative: [
          { required: true, message: "请填写花纹", trigger: "blur" }
        ],
        // extraDesc: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        homePicUrl: [
          {
            required: true,
            message: "请至少上传一张首页图片",
            trigger: "blur"
          }
        ],
        // mediaUrl: [{ required: false, message: "请输入活动名称", trigger: "blur" }],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" }
        ],
        specification: [
          {
            required: true,
            message: "请填写尺码规格",
            trigger: "blur"
          }
        ],
        // speedRank: [{ required: true, message: "请输入速度级别", trigger: "blur" }],
        stock: [
          {
            required: true,
            message: "请输入库存数量",
            trigger: "blur"
          }
        ],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ],
        usedTime: [
          {
            required: true,
            message: "请选择使用时长",
            trigger: "blur"
          }
        ],

        warrantyCascader: [
          {
            required: true, trigger: "change", validator: validateWarranty
          }
        ]
      },
      previewUrl: "",
      loading: false,
      specificationList: [],
      usedTimeList: ["一年", "二年", "三年", "四年", "五年及以上"],
      warrantyTimeOptions: [
        { value: 'Y', label: '是', children: [{ value: '一个月', label: '一个月' }, { value: '三个月', label: '三个月' }, { value: '六个月', label: '六个月' }, { value: '一年', label: '一年' }] },
        { value: 'N', label: '否' }
      ],
      decorativeList: [],
      updateFileList: []
    };
  },
  computed: {
    ...mapGetters(["carTypeList", "commodityBrandList"]),
    updateImgUri() {
      return `${process.env.VUE_APP_BASE_API}/open/file/upload`;
    }
  },
  watch: {
    // "form.brandId": function(val, oldVal) {
    //   const selectBrand = this.commodityBrandList.find(v => v.brandId === val);
    //   if (selectBrand) {
    //     this.specificationList = selectBrand.specificationList;
    //     this.decorativeList = selectBrand.decorativeList;
    //   } else {
    //     this.specificationList = [];
    //     this.decorativeList = [];
    //   }
    // }
  },

  created() {

  },
  methods: {
    submit() {
      if (checkPermission()) {
        showPermissionMessage();
        return;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.handleNew();
        }
      });
    },

    handleNew() {
      this.loading = true;
      add({ ...this.form, price: this.form.price * 100 }).then(resp => {
        this.loading = false;
        this.$refs.form.resetFields();
        this.$message({
          message: "创建成功",
          type: "success"
        });
      });
    },

    handleRemove(file, fileList) {
      const idx = this.form.imageUrlList.findIndex(
        v => v.indexOf(file.data.filePath) !== -1
      );
      this.form.imageUrlList.splice(idx, 1);
      this.form.homePicUrl = this.form.imageUrlList[0];
      this.$refs.homePicUrl.blur();
    },

    handlePictureCardSuccess(file, fileList) {
      this.form.imageUrlList.push(file.data.filePath);
      this.form.homePicUrl = this.form.imageUrlList[0];
      this.$refs.homePicUrl.blur();
    },
    handlePictureCardPreview(file) {
      this.previewUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.new-commodity-components {
  .new-form {
    position: relative;
    width: 800px;
    max-width: 100%;
    padding: 54px 35px 0;
    margin: auto;
    overflow: hidden;
    /deep/ .el-select {
      width: 100%;
    }
  }

  padding-bottom: 2rem;
}
</style>>

