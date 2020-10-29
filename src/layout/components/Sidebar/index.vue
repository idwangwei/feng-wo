<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/styles/variables.scss';

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'auth'
    ]),
    routes() {
      const authMap = {
        ALL: '',
        MINING_MANAGER: '/manager/pool',
        MARKET_MANAGER: '/manager/wwt',
        ORDER_MANAGER: '/manager/order',
        ANN_MANAGER: '/manager/notify',
        FEEDBACK_MANAGER: '/manager/feedback',
        USER_MANAGER: '/manager/user',
        ROLE_MANAGER: '/manager/role'
      };
      const routes = this.$router.options.routes;
      if (this.auth.includes('ALL')) {
        return routes.filter(v => v.sidebarShow);
      } else {
        return routes.filter(v => {
          return v.sidebarShow && (v.path === '/manager' || this.auth.find(au => authMap[au] === v.path));
        });
      }
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
