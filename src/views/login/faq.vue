<template>
  <div class="container">
    <!-- <h1 style="text-align:center">新人FAQ</h1> -->

    <el-collapse v-model="activeNames">
      <template v-for="(item, index) in items">
        <el-collapse-item :key="index" :title="item.title" :name="index">
          <template v-for="(subItem, subIdx) in item.content">
            <h4 :key="''+index+subIdx">{{ subItem.subTitle }}</h4>
            <template v-for="(p, pIdx) in subItem.content">

              <p v-if="p.type === 'text'" :key="''+index+subIdx+pIdx">{{ p.text }}</p>
              <el-image v-else-if="p.type === 'image'" :key="pIdx" :src="p.src" fit="fill"></el-image>
            </template>
          </template>
        </el-collapse-item>
      </template>
    </el-collapse>

  </div>
</template>

<script>
import axios from 'axios';
// import * as config from '@/assets/json/faq.json';
export default {
  name: "FAQ",
  data() {
    return {
      items: null,
      activeNames: ['0'],
      imgUrl: require('@/assets/faq.png')
    };
  },
  watch: {

  },
  created() {
    axios.get('/json/faq.json',).then(res => {
        this.items = res.data;
    });
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.container{
    // background: #283443;
    // color: white;
    padding: 1rem;
    p{
        line-height: 1.5rem;
    }
}
.el-collapse-item__header{
  font-size: 1rem;
}
</style>
