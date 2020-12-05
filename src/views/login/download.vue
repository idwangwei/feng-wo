<template>
  <div class="download-container">

    <el-row class="ma">
      <el-image style="width: 100%; height: 120px;" :src="imgUrl" fit="scale-down">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-row>
    <el-row>

      <el-link :href="androidURL" target="_self" :underline="false" download="">
        <el-button round>
          Android 下载
        </el-button>
      </el-link>

    </el-row>
    <el-row>
      <el-link :href="iosURL" target="_self" :underline="false" download="">
        <el-button round>
          IOS 下载
        </el-button>
      </el-link>
    </el-row>
  </div>
</template>

<script>
import { getApkUrl } from "@/api/user";
export default {
  name: "Download",
  data() {
    return {
      loading: false,
      imgUrl: require("@/assets/download.png"),
      androidURL: "",
      iosURL: ""
    };
  },
  computed: {},
  watch: {},
  created() {
    getApkUrl().then((res) => {
      this.androidURL = res.data.androidUrl;
      this.iosURL = res.data.iosUrl;
    });
  },
  methods: {
    donwLoadIOS() {
      // console.log("");
    }
  }
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .download-container {
    color: $cursor;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.download-container {
  min-height: 100%;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-bottom: 5rem;
  .el-row {
    margin-bottom: 1.5rem;
    width: 60%;
    max-width: 22rem;
    .el-link {
      width: 100%;
      /deep/ .el-link--inner {
        width: 100%;
        display: block;
      }
      color: #fff;
    }
    button {
      width: 100%;
      border-color: #FE9440;
      color: #FE9440;
    }
  }
}
</style>
