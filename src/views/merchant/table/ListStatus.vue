<template>
  <el-popover v-model="visible" placement="left" :width="popoverWidth">
    <template v-if="mapData.key === 'WAIT_AUDIT'">
      <div>
        <el-row>
          <el-col :span="4">
            <p>操作：</p>
          </el-col>
          <el-col :span="20">
            <p>处理商户申请</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <p>备注：</p>
          </el-col>
          <el-col :span="20">
            <el-input
              v-model="refuseReason"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            ></el-input>
          </el-col>
        </el-row>
        <div style="text-align: right; margin: 10px 0;">
          <el-button size="mini" type="text" @click="refuse">拒绝</el-button>
          <el-button type="primary" size="mini" @click="pass">通过</el-button>
        </div>
      </div>
    </template>
    <template v-else-if="mapData.key === 'AUDIT_REFUSED'">
      <div>
        <p>通过商户申请</p>
        <div style="text-align: right; margin: 10px 0;">
          <el-button size="mini" type="text" @click="visible=false">取消</el-button>
          <el-button type="primary" size="mini" @click="pass">通过</el-button>
        </div>
      </div>
    </template>
    <template v-else-if="mapData.key === 'AUDIT_PASS'">
      <div>
        <el-row>
          <el-col :span="4">
            <p>操作：</p>
          </el-col>
          <el-col :span="20">
            <p>封禁商户</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <p>备注：</p>
          </el-col>
          <el-col :span="20">
            <el-input
              v-model="bannerReason"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            ></el-input>
          </el-col>
        </el-row>

        <div style="text-align: right; margin: 10px 0;">
          <el-button size="mini" type="text" @click="visible=false">取消</el-button>
          <el-button type="primary" size="mini" @click="banner">封禁</el-button>
        </div>
      </div>
    </template>
    <template v-else-if="mapData.key === 'BANNED'">
      <div>
        <p>允许商户运营</p>
        <div style="text-align: right; margin: 10px 0;">
          <el-button size="mini" type="text" @click="visible=false">取消</el-button>
          <el-button type="primary" size="mini" @click="pass">允许</el-button>
        </div>
      </div>
    </template>
    <el-button slot="reference" :type="mapData.type">{{ mapData.label }}</el-button>
  </el-popover>
</template>

<script>
import { mapGetters } from "vuex";
import { refuse, pass, banner } from "@/api/merchantTable";
export default {
    name: "ListStatus",
    props: {
        status: {
            type: String,
            required: true
        },
        merchantId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            visible: false,
            refuseReason: "",
            bannerReason: ""
        };
    },
    computed: {
        ...mapGetters(["statusList"]),
        mapData() {
            const findtype = this.statusList.find(v => v.key === this.status);
            return findtype || {};
        },
        popoverWidth() {
            let defaultWidth = 200;
            if (
                this.mapData.key === "WAIT_AUDIT" ||
                this.mapData.key === "AUDIT_PASS"
            ) {
                defaultWidth = 400;
            }
            return defaultWidth;
        }
    },
    methods: {
        pass() {
            this.visible = false;
            pass({ merchantId: this.merchantId }).then(resp => {
                console.log("pass");
                this.$emit("merchant-status-change", {
                    id: this.merchantId,
                    status: "AUDIT_PASS"
                });
            });
        },
        refuse() {
            this.visible = false;
            if (!this.refuseReason.trim()) {
                this.$alert("请填写拒绝原因", "提示", {
                    confirmButtonText: "确定"
                });
                return;
            }
            refuse({
                merchantId: this.merchantId,
                reason: this.refuseReason
            }).then(resp => {
                console.log("refuse");
                this.$emit("merchant-status-change", {
                    id: this.merchantId,
                    status: "AUDIT_REFUSED"
                });
            });
        },
        banner() {
             if (!this.refuseReason.trim()) {
                this.$alert("请填写封禁原因", "提示", {
                    confirmButtonText: "确定"
                });
                return;
            }
            this.visible = false;
            banner({
                merchantId: this.merchantId,
                reason: this.bannerReason
            }).then(resp => {
                console.log("refuse");
                this.$emit("merchant-status-change", {
                    id: this.merchantId,
                    status: "BANNED"
                });
            });
        }
    }
};
</script>

<style>
</style>
