<template>
  <div class="register-container">
    <div class="register-header">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="16" class="header-left">
          <img src="@/assets/logo.jpg" alt style="width:178.75px; height:100%" />
          <span style="font-size:2rem">蜂窝后台</span>
        </el-col>
        <el-col :span="6" class="header-right">
          <span>
            已有账号
            <i class="el-icon-question"></i>
          </span>
          <el-link type="primary" @click="goLogin">
            去登录
            <i class="el-icon-arrow-right"></i>
          </el-link>
        </el-col>
      </el-row>
    </div>
    <el-form
      ref="registerForm"
      label-width="106px"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      auto-complete="on"
      label-position="right"
      name="registerForm"
    >
      <el-form-item prop="name" label="商户名称">
        <el-input ref="name" v-model="registerForm.name" name="name" type="text"></el-input>
      </el-form-item>

      <el-form-item prop="password" label="密码">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
        ></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"></svg-icon>
        </span>
      </el-form-item>
      <el-form-item prop="checkPass" label="确认密码">
        <el-input
          :key="checkPassType"
          ref="checkPass"
          v-model="registerForm.checkPass"
          :type="checkPassType"
          name="checkPass"
        ></el-input>
        <span class="show-pwd" @click="showCheckPassPwd">
          <svg-icon :icon-class="checkPassType === 'password' ? 'eye' : 'eye-open'"></svg-icon>
        </span>
      </el-form-item>

      <el-form-item prop="linkName" label="联系人名称">
        <el-input
          ref="linkName"
          v-model="registerForm.linkName"
          name="linkName"
          type="text"
          auto-complete="on"
        ></el-input>
      </el-form-item>

      <el-form-item prop="telephone" label="手机号码">
        <el-input
          ref="telephone"
          v-model="registerForm.telephone"
          placeholder="请输入常用手机号"
          name="telephone"
          type="text"
          auto-complete="on"
        ></el-input>
      </el-form-item>

      <el-form-item prop="verification" label="图形验证码" class="verify-input">
        <el-input
          ref="verification"
          v-model="registerForm.verification"
          placeholder="图形验证码"
          name="verification"
          type="text"
          auto-complete="on"
        >
          <template slot="append">
            <img :src="picVerifyUri" alt style="height:34px" @load="picVerifyLoadHandle" />
          </template>
        </el-input>
        <el-button @click.prevent="refreshPicVerify()">
          <i :class="picVerifyUriLoading?'el-icon-loading':'el-icon-refresh'"></i>刷新图片
        </el-button>
      </el-form-item>

      <el-form-item prop="smsCode" label="短信验证码">
        <el-input
          ref="smsCode"
          v-model="registerForm.smsCode"
          placeholder="请输入六位短信验证码"
          name="smsCode"
          type="text"
          auto-complete="on"
        >
          <template slot="append">
            <el-button
              type="primary"
              :disabled="countDown > 1"
              style="width:140px"
              @click="getSysCode"
            >
              <span v-if="countDown < 1">获取短信验证码</span>
              <span v-else>{{ countDown }}秒后重试</span>
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="licenseCode" label="营业执照号码">
        <el-input
          ref="licenseCode"
          v-model="registerForm.licenseCode"
          name="licenseCode"
          type="text"
          auto-complete="on"
        ></el-input>
      </el-form-item>
      <el-form-item prop="corporate" label="法人名字">
        <el-input
          ref="corporate"
          v-model="registerForm.corporate"
          name="corporate"
          type="text"
          auto-complete="on"
        ></el-input>
      </el-form-item>

      <el-form-item prop="corporateIdCard" label="法人证件号">
        <el-input
          ref="corporateIdCard"
          v-model="registerForm.corporateIdCard"
          name="corporateIdCard"
          type="text"
          auto-complete="on"
        ></el-input>
      </el-form-item>

      <el-form-item prop="address" label="商家地址">
        <el-input
          ref="address"
          v-model="registerForm.address"
          name="address"
          type="text"
          auto-complete="on"
        ></el-input>
      </el-form-item>
      <el-form-item prop="licenseUrl" label="营业执照上传">
        <el-input
          ref="licenseUrl"
          v-model="registerForm.licenseUrl"
          name="licenseUrl"
          type="text"
          style="display:none"
        ></el-input>
        <el-upload
          :action="updateImgUri"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-success="handlePictureCardSuccess"
          :on-remove="handleRemove"
          :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="previewUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        class="register-btn"
        @click.native.prevent="handleRegister"
      >注册</el-button>
    </el-form>
  </div>
</template>

<script>
import {
  validateName,
  validateLinkName,
  validateTelephone,
  validateVerfication,
  validateSysCode,
  validateLicenseCode,
  validateLicenseUrl,
  validateCorporate,
  validateCorporateIdCard,
  validateAddress
} from "@/utils/validate";
import { getSysCode, register } from "@/api/user";

export default {
  name: "Register",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.checkPass !== "") {
          this.$refs.registerForm.validateField("checkPass");
        }
        callback();
      }
    };
    const validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        name: "",
        password: "",
        checkPass: "",
        linkName: "",
        telephone: "",
        verification: "",
        smsCode: "",
        licenseCode: "",
        licenseUrl: "",
        corporate: "",
        corporateIdCard: "",
        address: ""
      },
      registerRules: {
        name: [
          {
            required: true,
            trigger: "blur",
            validator: validateName
          }
        ],

        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword
          }
        ],

        checkPass: [
          {
            required: true,
            trigger: "blur",
            validator: validateCheckPass
          }
        ],
        linkName: [
          {
            required: true,
            trigger: "blur",
            validator: validateLinkName
          }
        ],
        telephone: [
          {
            required: true,
            trigger: "blur",
            validator: validateTelephone
          }
        ],
        verification: [
          {
            required: true,
            trigger: "blur",
            validator: validateVerfication
          }
        ],
        smsCode: [
          {
            required: true,
            trigger: "blur",
            validator: validateSysCode
          }
        ],
        licenseCode: [
          {
            required: true,
            trigger: "blur",
            validator: validateLicenseCode
          }
        ],
        licenseUrl: [
          {
            required: true,
            trigger: "blur",
            validator: validateLicenseUrl
          }
        ],
        corporate: [
          {
            required: true,
            trigger: "blur",
            validator: validateCorporate
          }
        ],
        corporateIdCard: [
          {
            required: true,
            trigger: "blur",
            validator: validateCorporateIdCard
          }
        ],
        address: [
          {
            required: true,
            trigger: "blur",
            validator: validateAddress
          }
        ]
      },
      loading: false,
      passwordType: "password",
      checkPassType: "password",
      redirect: undefined,
      countDown: 0,
      picVerifyUriLoading: false,
      random: Math.ceil(Math.random() * 10000),
      countDownTimer: 0,
      previewUrl: "",
      dialogVisible: false
    };
  },
  computed: {
    picVerifyUri() {
      return `${process.env.VUE_APP_BASE_API}/open/verificationCode/${this.random}`;
    },
    updateImgUri() {
      return `${process.env.VUE_APP_BASE_API}/open/file/upload`;
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.refreshPicVerify();
  },
  methods: {
    handleRemove(file, fileList) {
      this.registerForm.licenseUrl = "";
      this.$refs.licenseUrl.blur();
    },
    handlePictureCardSuccess(file) {
      this.registerForm.licenseUrl = `${process.env.VUE_APP_BASE_API}${file.data.filePath}`;
      this.$refs.licenseUrl.blur();
    },
    handlePictureCardPreview(file) {
      this.previewUrl = file.url;
      this.dialogVisible = true;
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    showCheckPassPwd() {
      if (this.checkPassType === "password") {
        this.checkPassType = "";
      } else {
        this.checkPassType = "password";
      }
      this.$nextTick(() => {
        this.$refs.checkPass.focus();
      });
    },

    goLogin() {
      this.$router.push({ path: "/login" });
    },

    refreshPicVerify() {
      this.random = Math.ceil(Math.random() * 10000);
      this.picVerifyUriLoading = true;
    },
    picVerifyLoadHandle() {
      this.picVerifyUriLoading = false;
    },
    getSysCode() {
      this.$refs.registerForm.validate((result, valid) => {
        if (
          !valid.hasOwnProperty("telephone") &&
          !valid.hasOwnProperty("verification")
        ) {
          getSysCode({
            phoneNum: this.registerForm.telephone,
            verificationCode: this.registerForm.verification.toUpperCase()
          })
            .then(resp => {
              this.countDown = 60;
              this.countDownTimer = window.setInterval(() => {
                if (this.countDown > 0) {
                  this.countDown--;
                } else {
                  window.clearInterval(this.countDownTimer);
                }
              }, 1000);
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          register({
            address: this.registerForm.address,
            corporate: this.registerForm.corporate,
            corporateIdCard: this.registerForm.corporateIdCard,
            licenseCode: this.registerForm.licenseCode,
            licenseUrl: this.registerForm.licenseUrl,
            linkman: this.registerForm.linkName,
            name: this.registerForm.name,
            password: this.registerForm.password,
            phoneNum: this.registerForm.telephone,
            smsCode: this.registerForm.smsCode
          })
            .then(resp => {
              this.$alert("成功注册去登录", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.goLogin();
                }
              });
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    // display: inline-block;
    // height: 47px;
    // width: 85%;

    input {
      //   background: transparent;
      //   border: 0px;
      //   -webkit-appearance: none;
      //   border-radius: 0px;
      //   padding: 12px 5px 12px 15px;
      color: $bg;
      //   height: 47px;
      //   caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $cursor inset !important;
        -webkit-text-fill-color: $bg !important;
      }
    }
  }

  .el-form-item {
    // border: 1px solid rgba(41, 38, 207, 0.308);
    // background: rgba(0, 0, 0, 0.1);
    // border-radius: 5px;
    // color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  /deep/ .el-divider__text,
  .el-link {
    font-size: 1rem;
  }
  /deep/ .el-form-item__label {
    color: $light_gray;
  }
  .register-header {
    background-color: #f6f6f6;
    height: 80px;
    box-shadow: 0 0 0.5rem $dark_gray;
    .row-bg {
      height: 100%;
    }
    .header-left {
      height: 100%;
      display: flex;
      align-items: center;
      color: $dark_gray;
      justify-content: flex-start;
    }
    .header-right {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: $dark_gray;
    }
  }
  .register-steps {
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    margin-top: 5rem;
  }
  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 54px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  /deep/ .verify-input {
    .el-form-item__content {
      display: flex;
    }
    .el-input-group__append {
      padding: 0;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .register-btn {
    width: 344px;
    margin-bottom: 30px;
    margin-left: 106px;
  }
}
</style>
