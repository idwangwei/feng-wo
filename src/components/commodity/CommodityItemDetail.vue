<template>
  <div class="list-detail-componets">
    <el-button type="text" @click="showDetil">查看</el-button>

    <el-dialog title="商品详情" :visible.sync="dialogVisible" top="5vh" width="60%">
      <el-row v-for="(row, index) in items" :key="index" class="detail-row-item">
        <el-col v-for="(item, idx) in row" :key="idx" :span="12">
          <el-row>
            <el-col :span="6">
              <div class>{{ item.label }}：</div>
            </el-col>
            <el-col :span="18">
              <div v-if="item.prop === 'statusDesc'">
                <div v-if="itemData.status === 'AUDIT_REFUSED' || itemData.status === 'MANAGER_SOLD_OUT'">
                  <el-tooltip class="item" effect="dark" :content="itemData.reason" placement="top">
                    <el-badge :value="1" class="item" type="warning">
                      <el-button size="small">{{ itemData[item.prop] }}</el-button>
                    </el-badge>
                  </el-tooltip>
                </div>
                <div v-else>
                  {{ itemData[item.prop] }}
                </div>
              </div>
              <div v-else class>{{ itemData[item.prop] }}</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="detail-row-item">
        <el-col :span="24">
          <el-row>
            <el-col :span="3">
              <div class>额外营销信息：</div>
            </el-col>
            <el-col :span="21">
              <div class>{{ itemData.extraDesc }}</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class="detail-row-item">
        <el-col :span="24">
          <el-row>
            <el-col :span="3">
              <div class>商品图片：</div>
            </el-col>
            <el-col :span="21">
              <div v-if="itemData.homePicUrl">
                <el-image v-if="itemData.homePicUrl" style="width: 100px; height: 100px" :src="addImgPrefix(itemData.homePicUrl)" :preview-src-list="addImgPrefix(itemData.imageUrlList)"></el-image>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDetail } from "@/api/merchantCommodity";
import { getDetailByManager } from "@/api/operatorCommodity";
import { mapGetters } from "vuex";
import { addImgPrefix } from "@/utils/index";
export default {
  name: "CommodityItemDetail",
  props: {
    commodityId: {
      type: Number || String,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      itemData: {},
      items: [
        [
          { label: "商品标题", prop: "title" },
          { label: "商品名称", prop: "productName" }
        ],
        [
          { label: "品牌名称", prop: "brandName" },
          { label: "适用车型", prop: "carTypeName" }
        ],
        [
          { label: "收藏次数", prop: "collectTime" },
          { label: "联系次数", prop: "connectionTime" }
        ],
        [
          { label: "花纹深度", prop: "decorativeDeep" },
          { label: "宽度", prop: "section" }
        ],
        [
          { label: "花纹", prop: "decorativeName" },
          { label: "商品状态", prop: "statusDesc" }
        ],
        [
          { label: "轮廓直径", prop: "felloe" },
          { label: "扁平比", prop: "flat" }
        ],
        [
          { label: "审核上架时间", prop: "passTime" },
          { label: "申请上架时间", prop: "putWayTime" }
        ],
        [
          { label: "使用时间", prop: "usedTime" },
          { label: "创建时间", prop: "createTime" }
        ],
        [
          { label: "尺码规格", prop: "specification" },
          { label: "速度级别", prop: "speedRank" }
        ],
        [
          { label: "库存", prop: "stock" },
          { label: "价格", prop: "price" }
        ],
        [
          { label: "是否三包", prop: "warranty" },
          { label: "三包时长", prop: "warrantyTime" }
        ]
      ]
    };
  },
  computed: {
    ...mapGetters(["isOperator"])
  },
  created() { },
  methods: {
    addImgPrefix,
    showDetil() {
      let detailPromise;
      this.dialogVisible = true;
      if (this.isOperator) {
        detailPromise = getDetailByManager({
          commodityId: this.commodityId
        });
      } else {
        detailPromise = getDetail({ commodityId: this.commodityId });
      }
      detailPromise.then(resp => {
        resp.data.warranty = resp.data.warranty === "Y" ? "是" : "否";
        this.itemData = { ...resp.data };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list-detail-componets {
  .detail-row-item {
    margin: 1rem auto;
  }
}
</style>>

