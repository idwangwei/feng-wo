<template>
  <div class="dashboard-container">
    <div class="dashboard-text" v-if="userInfo.name">名称: {{ userInfo.name }}</div>
    <el-alert v-if="userInfo.status==='AUDIT_REFUSED'" :title="userInfo.statusDesc" type="info" :description="userInfo.reason" show-icon>
    </el-alert>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
  computed: {
    userInfo() {
      debugger;
      return this.$store.state.user.info;
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
