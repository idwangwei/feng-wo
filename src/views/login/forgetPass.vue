<template>
  <div class="update-pass-container">
    <el-form ref="formData" :model="formData" :rules="formRules" class="update-pass-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h1 class="display-4">忘记密码</h1>
      </div>
      <el-form-item prop="pass">
        <el-input v-model="formData.pass" type="password" placeholder="新密码(密码8-18位有效字符)" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input v-model="formData.checkPass" type="password" placeholder="确认密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入完整的手机号">
          <template slot="append">
            <el-button type="text" style="min-width:5rem" :disabled="disableCodeBtn" @click="getSmsCodeHandle">{{ verifyStr }}</el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="smsCode">
        <el-input ref="smsCode" v-model="formData.smsCode" type="text" placeholder="输入验证码" name="smsCode" tabindex="2" @keyup.enter.native="handleLogin" />
      </el-form-item>
      <el-button :loading="updateLoading" :disabled="updateLoading" type="primary" style="width:100%;margin-bottom:30px;margin-top:80px" @click.native.prevent="confirmHandle">修 改</el-button>
    </el-form>
  </div>
</template>

<script>
import { validateTelephone, validateSmsCode } from "@/utils/validate";
import { getSmsCode, updatePass } from "@/api/user";
export default {
  name: "ForgetPass",
  data() {
     const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!(/^.{8,18}$/.test(value))) {
          callback(new Error('密码为8-18位有效字符'));
        } else {
          if (this.formData.checkPass !== '') {
            this.$refs.formData.validateField('checkPass');
          }
          callback();
        }
      };
      const validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formData.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      formData: {
        pass: "",
        checkPass: "",
        phone: "",
        smsCode: ""
      },
      formRules: {
        pass: [{ required: true, trigger: "blur", validator: validatePass }],
        checkPass: [{ required: true, trigger: "blur", validator: validateCheckPass }],
        phone: [{ required: true, trigger: "blur", validator: validateTelephone }],
        smsCode: [
          { required: true, trigger: "blur", validator: validateSmsCode }
        ]
      },
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
  beforeDestroy() {
    if (this.countDownTimer) {
      clearInterval(this.countDownTimer);
    }
  },
  methods: {
    getSmsCodeHandle() {
      this.$refs.formData.validateField('phone');
      const phoneRe = new RegExp(/^1\d{10}$/);
      if (!phoneRe.test(this.formData.phone)) {
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

      getSmsCode({ "language": "", "phone": this.formData.phone }).then(res => {
        this.$message({
          message: '短信验证码已发送',
          type: 'success'
        });
      })
      .catch(() => {})
      .finally(() => {});
    },
    confirmHandle() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.updateLoading = true;
          updatePass({
            code: this.formData.smsCode,
            newPassword: this.formData.pass,
            phone: this.formData.phone
          })
          .then(res => {
            this.$message({
              message: '密码修改成功',
              type: 'success'
            });
            this.$router.push({ path: '/login' });
          })
          .catch(() => {})
          .finally(() => {
            this.updateLoading = false;
          });
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
  .login-container .el-input input {
    color: $cursor;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.title-container{
  color: $light_gray;
}
.update-pass-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .update-pass-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
}
</style>
