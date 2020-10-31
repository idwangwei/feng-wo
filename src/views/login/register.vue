<template>
  <div class="register-container">
    <div class="title-container">
      <el-image style="width: 100%; height: 60px; background: none" :src="imgUrl" fit="scale-down">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </div>
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" label-position="left">

      <el-form-item prop="phone">
        <el-input ref="registerPhone" v-model="registerForm.phone" placeholder="请输入手机号" name="registerPhone" autocomplete="new-password" type="text" tabindex="1">
          <template slot="prepend">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input ref="rigsterCode" v-model="registerForm.code" placeholder="请输入验证码" name="rigsterCode" autocomplete="new-password" type="text" tabindex="1">
          <template slot="prepend">
            <span class="svg-container">
              <svg-icon icon-class="documentation" />
            </span>
          </template>
          <template slot="append">
            <el-button type="text" style="min-width:5rem" :disabled="disableCodeBtn" @click="getSmsCodeHandle">{{ verifyStr }}</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input ref="password" v-model="registerForm.password" placeholder="请输入登录密码" name="password" autocomplete="new-password" type="password" tabindex="1">
          <template slot="prepend">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input ref="checkPass" v-model="registerForm.checkPass" placeholder="请输入确认密码" name="checkPass" type="password" tabindex="1">
          <template slot="prepend">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="alipayPwd">
        <el-input ref="alipayPwd" v-model="registerForm.alipayPwd" placeholder="请输入支付密码" name="alipayPwd" type="password" tabindex="1">
          <template slot="prepend">
            <span class="svg-container">
              <svg-icon icon-class="money" />
            </span>
          </template>
        </el-input>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;margin-top:30px" @click.native.prevent="handleRegister">注 册</el-button>

    </el-form>
  </div>
</template>

<script>
import { validateTelephone, validateSmsCode } from "@/utils/validate";
import { registerAccount, getRegisterSmsCode } from "@/api/user";
import { MessageBox } from 'element-ui';

export default {
  name: "Register",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!(/^.{8,18}$/.test(value))) {
        callback(new Error('密码为8-18位有效字符'));
      } else {
        if (this.registerForm.checkPass !== '') {
          this.$refs.registerForm.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePay = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入支付密码'));
      } else if (!(/^.{6,8}$/.test(value))) {
        callback(new Error('密码为6-8位有效字符'));
      } else {
        callback();
      }
    };
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        phone: "",
        code: "",
        password: "",
        checkPass: "",
        alipayPwd: ""
      },
      invitationCode: "",
      registerRules: {
        phone: [{ required: true, trigger: "blur", validator: validateTelephone }],
        code: [{ required: true, trigger: "blur", validator: validateSmsCode }],
        password: [{ required: true, trigger: "blur", validator: validatePass }],
        checkPass: [{ required: true, trigger: "blur", validator: validateCheckPass }],
        alipayPwd: [{ required: true, trigger: "blur", validator: validatePay }]
      },
      loading: false,
      imgUrl: require('@/assets/logo@2x.png'),
      countDownNum: 60,
      countDownTimer: null
    };
  },
  computed: {
    verifyStr: function() {
      return this.countDownNum === 60 ? '获取验证码' : `${this.countDownNum}S 后再试`;
    },
    disableCodeBtn: function() {
      return this.countDownNum !== 60;
    }
  },
  watch: {
    $route: {
      handler: function(route) {
          console.log(route);
          if (route.query && route.query.invitationCode) {
            this.invitationCode = route.query.invitationCode;
          } else {
            this.invitationCode = null;
          }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.countDownTimer) {
      clearInterval(this.countDownTimer);
    }
  },
  methods: {
    getSmsCodeHandle() {
      this.$refs.registerForm.validateField('phone');
      const phoneRe = new RegExp(/^1\d{10}$/);
      if (!phoneRe.test(this.registerForm.phone)) {
        return;
      }

      this.countDownNum--;
      this.countDownTimer = setInterval(() => {
        this.countDownNum--;
        if (this.countDownNum <= 0) {
          clearInterval(this.countDownTimer);
          this.countDownNum = 60;
        }
      }, 1000);

      getRegisterSmsCode({ "language": "", "phone": this.registerForm.phone }).then(res => {
        this.$message({
          message: res.errorMsg,
          type: 'success'
        });
      })
      .catch(() => {})
      .finally(() => {});
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const paramData = {
            language: "",
            phoneMack: "",
            phone: this.registerForm.phone,
            code: this.registerForm.code,
            password: this.registerForm.password,
            alipayPwd: this.registerForm.alipayPwd
          };
          if (this.invitationCode) {
            paramData.invitationCode = this.invitationCode;
          }
          registerAccount(paramData)
            .then(() => {
              MessageBox.alert(
                '注册成功',
                '提示',
                {
                  confirmButtonText: '确定',
                  type: 'ifno'
                }
              ).then(() => {
                this.$router.push({ path: "/download" });
              });
            })
            .catch(() => {

            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">

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
    height: 47px;
    // width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
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

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 16px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  /deep/ .role-select .el-form-item__content {
    display: flex;
    .el-select {
      flex: 1;
      .el-input {
        width: 100%;
      }
    }
  }
  /deep/ .el-input-group__append{
    background-color: #283443;
    border-color:  #283443;
  }
  /deep/ .el-input-group__prepend{
    background-color: #283443;
    border-color:  #283443;
    padding: 0;
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
    // display: inline-block;
  }

  .title-container {
    position: relative;
    margin: 1rem 0;
    /deep/ .el-image__placeholder,.el-image__error{
      background-color: $bg;
    }
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
