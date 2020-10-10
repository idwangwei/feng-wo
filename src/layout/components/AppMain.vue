<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AppMain',
  computed: {
    ...mapGetters(["carTypeList", "commodityBrandList", "commodityStatusList"]),
    key() {
      return this.$route.path;
    }
  },
  created() {
    !this.commodityBrandList.lenght && this.$store.dispatch("commodity/getCommodityBrandList");
    !this.carTypeList.lenght && this.$store.dispatch("commodity/getCarTypeList");
    !this.commodityStatusList.lenght && this.$store.dispatch("commodity/getCommodityStatusList");
  }
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
