<template>
  <div class="app-container">
    <div class="filter-container">
      昵称：<el-input v-model="listQuery.name" placeholder="" size="mini" clearable style="width: 150px;margin-right:1rem;margin-top: 0.5rem;" class="filter-item" @keyup.enter.native="handleFilter" />
      手机号：<el-input v-model="listQuery.phone" placeholder="" size="mini" clearable style="width: 150px;;margin-right:1rem;margin-top: 0.5rem;" class="filter-item" @keyup.enter.native="handleFilter" />
      实名：<el-select v-model="listQuery.active" placeholder="" size="mini" clearable class="filter-item" style="width: 100px;margin-right:1rem;margin-top: 0.5rem;">
        <el-option label="全部" :value="null" />
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
      账号状态：<el-select v-model="listQuery.enable" placeholder="" size="mini" clearable class="filter-item" style="width: 100px;margin-right:1rem;margin-top: 0.5rem;">
        <el-option label="全部" :value="null" />
        <el-option label="正常" :value="true" />
        <el-option label="冻结" :value="false" />
      </el-select>
      交易权限：<el-select v-model="listQuery.alipayEnable" placeholder="" size="mini" clearable class="filter-item" style="width: 100px;margin-right:1rem;margin-top: 0.5rem;">
        <el-option label="全部" :value="null" />
        <el-option label="正常" :value="true" />
        <el-option label="冻结" :value="false" />
      </el-select>

      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" style="margin-top: 0.5rem;margin-right:1rem" :disabled="listLoading" @click="handleFilter">
        查询
      </el-button>

      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" style="margin-top: 0.5rem;" :disabled="listLoading" @click="handlePopularizeFilter">
        直推查询
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;" @sort-change="sortChange">
      <el-table-column prop="name" label="昵称" width="180"></el-table-column>
      <el-table-column prop="phone" label="电话号码" align="center" width="120"></el-table-column>
      <el-table-column label="是否实名" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.active | statusFilter" size="mini">
            {{ row.active ? '是':'否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="账户状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.enable | statusFilter" size="mini">
            {{ row.enable ? '正常':'已冻结' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="交易权限" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.alipayEnable | statusFilter" size="mini">
            {{ row.alipayEnable ? '正常':'已冻结' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="unusedWwt" label="FMC数量" align="center" width="120" sortable></el-table-column>
      <el-table-column prop="usedWwt" label="矿池投入数量" align="center" width="150" sortable></el-table-column>
      <el-table-column label="上级" align="center" width="150">
        <template slot-scope="{row}">
          <transition name="fade" mode="out-in">
            <template v-if="row.edit">
              <el-input v-model="row.editParentPhone" class="edit-input" size="mini" style="width:120px" />
            </template>
            <span v-else>{{ row.parentPhone }}</span>
          </transition>
        </template>
      </el-table-column>
      <el-table-column prop="lastAlive" label="最后活跃时间" align="center" width="200"></el-table-column>

      <el-table-column label="操作" min-width="600px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="showUserInfo(row)">
            查看资料
          </el-button>
          <el-button v-if="row.enable" v-loading="showFreezeLoading(row)" type="primary" size="mini" :disabled="showFreezeLoading(row)" @click="freezeAccount(row)">
            冻结账户
          </el-button>
          <el-button v-else v-loading="showUnFreezeLoading(row)" size="mini" type="success" :disabled="showUnFreezeLoading(row)" @click="unfreezeAccount(row)">
            解冻账户
          </el-button>
          <el-button v-if="row.alipayEnable" v-loading="showFreezeTradLoading(row)" type="primary" size="mini" :disabled="showFreezeTradLoading(row)" @click="freezeAccountTrad(row)">
            冻结交易权限
          </el-button>
          <el-button v-else v-loading="showUnFreezeTradLoading(row)" size="mini" type="success" :disabled="showUnFreezeTradLoading(row)" @click="unfreezeAccountTrad(row)">
            解冻交易权限
          </el-button>
          <template v-if="!row.parentPhone">
            <template v-if="row.edit">
              <el-button v-loading="showBindLoading(row)" type="success" size="mini" :disabled="showBindLoading(row)" @click="bindSuperior(row)">
                确认
              </el-button>
              <el-button class="cancel-btn" size="mini" type="warning" @click="cancelEdit(row)">
                取消
              </el-button>
            </template>
            <template v-else>
              <el-button type="primary" size="mini" @click="row.edit=!row.edit">
                分配上级
              </el-button>
            </template>
          </template>

          <el-button v-if="!row.active" v-loading="showActiveLoading(row)" size="mini" type="danger" :disabled="showActiveLoading(row)" @click="activeUser(row)">
            激活
          </el-button>

          <el-button size="mini" type="danger" @click="rechargeHandle(row)">
            发币
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog title="加币操作" :visible.sync="rechargeDiaglog" width="50%">
      <el-form ref="rechargeTemp" :rules="rules" :model="rechargeTemp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户昵称" prop="name">
          <el-input v-model="rechargeTemp.name" style="width:300px" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户手机号码" prop="userPhone">
          <el-input v-model="rechargeTemp.userPhone" style="width:300px" :disabled="true" />
        </el-form-item>
        <el-form-item label="币数量" prop="wwt">
          <el-input v-model="rechargeTemp.wwt" type="number" style="width:300px" />
        </el-form-item>
        <el-form-item label="短信验证码" prop="code">
          <el-input v-model="rechargeTemp.code" style="width:300px">
            <template slot="append">
              <el-button type="text" style="min-width:5rem" :disabled="disableCodeBtn" @click="getSmsCode">{{ verifyStr }}</el-button>
            </template>
          </el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="rechargeDiaglog = false">取 消</el-button>
        <el-button v-loading="rechargeLoading" :disabled="rechargeLoading" size="mini" type="primary" @click="confirmRecharge">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="用户信息" :visible.sync="userInfoDialog" width="50%">
      <el-form ref="userInfoTemp" v-loading="getUserInfoLoading" :rules="rules" :model="userInfoTemp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">

        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfoTemp.name" placeholder="无" style="width:300px" :disabled="true" />
        </el-form-item>
        <el-form-item label="身份证号" prop="number">
          <el-input v-model="userInfoTemp.number" placeholder="无" style="width:300px" :disabled="true" />
        </el-form-item><el-form-item label="支付宝账号" prop="alipayAccount">
          <el-input v-model="userInfoTemp.alipayAccount" placeholder="无" style="width:300px" :disabled="true" />
        </el-form-item>
        <el-form-item label="开户支行" prop="bankBranch">
          <el-input v-model="userInfoTemp.bankBranch" placeholder="无" style="width:300px" :disabled="true" />
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCard">
          <el-input v-model="userInfoTemp.bankCard" placeholder="无" style="width:300px" :disabled="true" />
        </el-form-item>
        <el-form-item label="开户行" prop="bankDeposit">
          <el-input v-model="userInfoTemp.bankDeposit" placeholder="无" style="width:300px" :disabled="true" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="userInfoDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, modifyUserInfo, addUserWwt, getWwtSmsCode, getUserInfo } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { validateSmsCode, validateIntNum } from "@/utils/validate";

export default {
  name: "UserManagement",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "true": "success",
        "false": "info"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      freezeExchangeList: [],
      unfreezeExchangeList: [],
      freezeTradExchangeList: [],
      unfreezeTradExchangeList: [],
      bindExchangeList: [],
      activeExchangeList: [],
      rechargeDiaglog: false,
      rechargeLoading: false,
      userInfoDialog: false,
      rechargeRow: null,
      rechargeTemp: {
        name: '',
        code: '',
        language: '',
        userPhone: '',
        wwt: 0
      },
      userInfoTemp: {
          name: '',
          number: '',
          alipayAccount: '',
          bankBranch: '',
          bankCard: '',
          bankDeposit: ''
      },
      getUserInfoLoading: false,
      rules: {
        code: [{ required: true, message: '请输入短信验证码', trigger: 'blur', validator: validateSmsCode }],
        wwt: [{ required: true, message: '请输入整数', trigger: 'blur', validator: validateIntNum }]
      },
      countDownNum: 60,
      countDownTimer: null,
      listQuery: {
        page: 1,
        pageSize: 10,
        language: "",
        asc: false,
        orderValue: "",
        name: "",
        phone: "",
        active: null,
        enable: null,
        alipayEnable: null,
        queryTeam: false
      }
    };
  },
  computed: {
    verifyStr: function() {
      return this.countDownNum === 60 ? '获取验证码' : `${this.countDownNum}S 后再试`;
    },
    disableCodeBtn: function() {
      return this.countDownNum !== 60;
    }
  },
  created() {
    this.getList();
  },
  beforeDestroy() {
    if (this.countDownTimer) {
      clearInterval(this.countDownTimer);
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      const params = { ...this.listQuery };
      getUserList(params)
        .then((response) => {
          this.list = response.data.contents.map(v => ({ ...v, edit: false, editParentPhone: null }));
          this.total = response.data.total;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.listQuery.queryTeam = false;
      this.getList();
    },

    sortChange(data) {
      const { prop, order } = data;
      if (prop === "usedWwt") {
        this.listQuery.orderValue = "used_wwt";
      }
      if (prop === "unusedWwt") {
        this.listQuery.orderValue = "unused_wwt";
      }

      if (order === "ascending") {
        this.listQuery.asc = false;
      } else {
        this.listQuery.asc = true;
      }
      this.listQuery.page = 1;
      this.getList();
    },

    showFreezeLoading(row) {
      return this.freezeExchangeList.includes(row.phone);
    },
    showUnFreezeLoading(row) {
      return this.unfreezeExchangeList.includes(row.phone);
    },
    showFreezeTradLoading(row) {
      return this.freezeTradExchangeList.includes(row.phone);
    },
    showUnFreezeTradLoading(row) {
      return this.unfreezeTradExchangeList.includes(row.phone);
    },
    showBindLoading(row) {
      return this.bindExchangeList.includes(row.phone);
    },
    showActiveLoading(row) {
      return this.activeExchangeList.includes(row.phone);
    },
    unfreezeAccount(row) {
      this.unfreezeExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, enable: true })
      .then(res => {
        row.enable = true;

        this.$message({
          message: `用户【${row.name}】解冻成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.unfreezeExchangeList.splice(this.unfreezeExchangeList.indexOf(row.phone), 1);
      });
    },
    freezeAccount(row) {
      this.freezeExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, enable: false })
      .then(res => {
        row.enable = false;

        this.$message({
          message: `用户【${row.name}】冻结成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.freezeExchangeList.splice(this.freezeExchangeList.indexOf(row.phone), 1);
      });
    },
    unfreezeAccountTrad(row) {
      this.unfreezeTradExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, alipayEnable: true })
      .then(res => {
        row.alipayEnable = true;
        this.$message({
          message: `用户【${row.name}】交易权限解冻成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.unfreezeTradExchangeList.splice(this.unfreezeTradExchangeList.indexOf(row.phone), 1);
      });
    },
    freezeAccountTrad(row) {
      this.freezeTradExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, alipayEnable: false })
      .then(res => {
        row.alipayEnable = false;
        this.$message({
          message: `用户【${row.name}】交易权限冻结成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.freezeTradExchangeList.splice(this.freezeTradExchangeList.indexOf(row.phone), 1);
      });
    },
    bindSuperior(row) {
      this.bindExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, parentPhone: row.editParentPhone })
      .then(res => {
        row.edit = false;
        this.$message({
          message: `用户【${row.name}】绑定上级成功`,
          type: 'success'
        });
        row.parentPhone = row.editParentPhone;
        row.editParentPhone = null;
      }).catch(() => {
        row.editParentPhone = null;
      }).finally(() => {
        this.bindExchangeList.splice(this.bindExchangeList.indexOf(row.phone), 1);
      });
    },
    activeUser(row) {
      this.activeExchangeList.push(row.phone);
      modifyUserInfo({ userPhone: row.phone, active: true })
      .then(res => {
        row.active = true;
        this.$message({
          message: `用户【${row.name}】激活成功`,
          type: 'success'
        });
      }).catch(() => {
      }).finally(() => {
        this.activeExchangeList.splice(this.activeExchangeList.indexOf(row.phone), 1);
      });
    },

    cancelEdit(row) {
      row.editParentPhone = '';
      row.edit = false;
    },

    rechargeHandle(row) {
      this.rechargeDiaglog = true;
      this.rechageRow = row;
      this.rechargeTemp.userPhone = row.phone;
      this.rechargeTemp.name = row.name;
    },

    getSmsCode() {
      this.countDownNum--;
      this.countDownTimer = setInterval(() => {
        this.countDownNum--;
        if (this.countDownNum <= 0) {
          clearInterval(this.countDownTimer);
          this.countDownNum = 60;
        }
      }, 1000);

      getWwtSmsCode().then(res => {
        this.$message({
          message: `短信验证码已发送`,
          type: "success"
        });
      });
    },

    confirmRecharge() {
      this.$refs['rechargeTemp'].validate(valid => {
        if (!valid) {
          return;
        }
        this.rechargeLoading = true;
        addUserWwt(this.rechargeTemp)
        .then(res => {
          this.$message({
            message: `加币成功`,
            type: "success"
          });
          this.rechargeDiaglog = false;
          this.getList();
        })
        .finally(() => {
          this.rechargeLoading = false;
        });
      });
    },
    showUserInfo(row) {
        this.userInfoDialog = true;
        this.getUserInfoLoading = true;
        getUserInfo({ userPhone: row.phone })
        .then(res => {
          const data = res.data || {};
          const { account = {}, identity = {}} = data;
          this.userInfoTemp.name = identity.name;
          this.userInfoTemp.number = identity.number;
          this.userInfoTemp.alipayAccount = account.alipayAccount;
          this.userInfoTemp.bankBranch = account.bankBranch;
          this.userInfoTemp.bankCard = account.bankCard;
          this.userInfoTemp.bankDeposit = account.bankDeposit;
        })
        .finally(() => {
          this.getUserInfoLoading = false;
        });
    },
    handlePopularizeFilter() {
      this.listQuery.page = 1;
      this.listQuery.queryTeam = true;
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-loading-spinner{
  svg{
    width: 1rem;
  }
}
</style>
