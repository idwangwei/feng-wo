<template>
  <div class="download-container">

    <el-row class="ma">
      <el-image style="width: 100%; height: 60px;" :src="imgUrl" fit="scale-down">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-row>
    <el-row>
      <el-button round @click="donwLoadAndroid()">ANDROID 下载</el-button>

    </el-row>
    <el-row>
      <el-button round @click="donwLoadIOS()">IOS 下载</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Download",
  data() {
    return {
      loading: false,
      imgUrl: require('@/assets/logo@2x.png')
    };
  },
  computed: {

  },
  watch: {

  },
  methods: {
    donwLoadAndroid() {},
    donwLoadIOS() {}
  }
};
</script>

<style lang="scss">

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .download-container{
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
  background-color: $bg;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-bottom: 5rem;
  .el-row{
    margin-bottom: 1.5rem;
    width: 60%;
    max-width: 22rem;
    button{
      width: 100%;
    }
  }
}
</style>
