<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" label-position="left">
      <div class="title-container">
        <el-image style="width: 100%; height: 100px; background: none" :src="imgUrl" fit="scale-down">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
      <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="phone" v-model="loginForm.phone" placeholder="输入账号" name="phone" type="text" tabindex="1" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>

        <el-input ref="password" v-model="loginForm.password" :type="passwordType" placeholder="输入密码" name="password" tabindex="2" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-link type="primary" @click="forgetLinkHandle">忘记密码</el-link>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;margin-top:80px" @click.native.prevent="handleLogin">登 录</el-button>

    </el-form>
  </div>
</template>

<script>
import { validName, validatePassword } from "@/utils/validate";
import { mapGetters } from 'vuex';

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        phone: "",
        password: ""
      },
      loginRules: {
        phone: [{ required: true, trigger: "blur", validator: validName }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: "password",
      imgUrl: require('@/assets/logo@2x.png'),
      // imgUrl: '',
      redirect: undefined
    };
  },
  computed: {
    ...mapGetters([
      'pubkey'
    ])
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
      debugger;
    if (!this.pubkey) {
    //   this.$store.dispatch('app/getKey');
    }
    window.loginC = this;
  },
  methods: {
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
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/manager/dashboard" });
            })
            .catch(() => {
              this.$refs.password.focus();
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    forgetLinkHandle() {
      this.$router.push({ path: "/manager/forgetPass" });
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
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

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

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
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

  .title-container {
    position: relative;
    margin-bottom: 2rem;
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

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
