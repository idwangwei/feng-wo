<template>
  <el-popover v-model="visible" placement="left" width="200">

    <template v-if="mapData.key === 'NEW'">
      <div>
        <p>新建商品申请上架</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible=false">取消</el-button>
          <el-button type="primary" size="mini" @click="putAway">申请</el-button>
        </div>
      </div>
    </template>
    <template v-else-if="mapData.key === 'SELLING'">
      <div>
        <p>下架正在售卖中的商品</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible=false">取消</el-button>
          <el-button type="primary" size="mini" @click="soldOut">下架</el-button>
        </div>
      </div>
    </template>
    <template v-else-if="mapData.key === 'AUDIT_REFUSED'||mapData.key === 'MERCHANT_SOLD_OUT' ||mapData.key === 'MANAGER_SOLD_OUT' ">
      <div>
        <p>重新申请上架商品</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible=false">取消</el-button>
          <el-button type="primary" size="mini" @click="putAway">申请</el-button>
        </div>
      </div>
    </template>
    <el-button slot="reference" :type="mapData.type" :disabled="disabled">{{ mapData.label }}</el-button>
  </el-popover>
</template>

<script>
import { mapGetters } from 'vuex';
import { putAway, soldOut } from '@/api/merchantCommodity';
import { checkPermission, showPermissionMessage } from "@/utils/auth.js";
export default {
  name: 'MerchantCommodityStatus',
  props: {
    status: {
      type: String,
      required: true
    },
    commodityId: {
      type: Number || String,
      required: true
    }
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    ...mapGetters([
      'commodityStatusList'
    ]),
    mapData() {
      const findtype = this.commodityStatusList.find(v => v.key === this.status);
      return findtype || {};
    },
    disabled() {
      const disabledStatus = ['WAIT_AUDIT'];
      return disabledStatus.indexOf(this.status) !== -1;
    }
  },
  methods: {
    putAway() {
      if (checkPermission()) {
        showPermissionMessage();
        return;
      }
      this.visible = false;
      putAway({ commodityId: this.commodityId }).then(resp => {
        console.log('pass');
        this.$emit('commodity-status-change', { id: this.commodityId, status: 'WAIT_AUDIT' });
      });
    },
    soldOut() {
      if (checkPermission()) {
        showPermissionMessage();
        return;
      }
      this.visible = false;
      soldOut({
        commodityId: this.commodityId
      }).then(resp => {
        console.log('refuse');
        this.$emit('commodity-status-change', { id: this.commodityId, status: 'MERCHANT_SOLD_OUT' });
      });
    }
  }
};
</script>

<style>
</style>
