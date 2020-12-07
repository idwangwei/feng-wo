<template>
  <div class="introduce-container">
    <div>
      <el-image v-for="url in urls" :key="url" :src="url" style="width:100%"></el-image>
    </div>
  </div>
</template>

<script>
export default {
  name: "Introduce",
  data() {
    return {
        urls: [
            require('@/assets/introduce/intro1.png'),
            require('@/assets/introduce/intro2.png'),
            require('@/assets/introduce/intro3.png'),
            require('@/assets/introduce/intro4.png'),
            require('@/assets/introduce/intro5.png'),
            require('@/assets/introduce/intro6.png'),
            require('@/assets/introduce/intro7.png'),
            require('@/assets/introduce/intro8.png'),
            require('@/assets/introduce/intro9.png'),
            require('@/assets/introduce/intro10.png'),
            require('@/assets/introduce/intro11.png'),
            require('@/assets/introduce/intro12.png'),
            require('@/assets/introduce/intro13.png'),
            require('@/assets/introduce/intro14.png'),
            require('@/assets/introduce/intro15.png'),
            require('@/assets/introduce/intro16.png'),
            require('@/assets/introduce/intro17.png'),
            require('@/assets/introduce/intro18.png'),
            require('@/assets/introduce/intro19.png'),
            require('@/assets/introduce/intro20.png')
        ]
    };
  },
  computed: {

  },
  watch: {

  },
  created() {
      // console.log(this.urls);
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>

</style>
