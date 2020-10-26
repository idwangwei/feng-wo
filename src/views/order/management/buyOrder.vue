<template>
  <div class="app-container">
    <div class="filter-container">
      订单号：
      <el-input v-model="listQuery.name" placeholder="" size="mini" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      手机号：
      <el-input v-model="listQuery.phone" placeholder="" size="mini" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      订单类型：<el-select v-model="listQuery.realName" placeholder="" size="mini" clearable class="filter-item" style="width: 100px">
        <el-option label="普通" :value="false" />
        <el-option label="大宗" :value="true" />
      </el-select>

      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:1rem;">
      <el-table-column prop="orderId" label="订单号" min-width="150px"></el-table-column>
      <el-table-column prop="userPhone" label="买家手机号" align="center" min-width="120px"></el-table-column>
      <el-table-column prop="number" label="数量" align="center" min-width="100px"></el-table-column>
      <el-table-column prop="price" label="价格" align="center" min-width="100px"></el-table-column>
      <el-table-column label="订单类型" align="center" min-width="100px">
        <template slot-scope="{row}">
          {{ row.type | typeFilter }}
        </template>
      </el-table-column>

      <!-- <el-table-column label="时间" align="center" min-width="8%">
        <template slot-scope="{row}">
          {{ row.time | DateFilter }}
        </template>
      </el-table-column> -->
      <el-table-column label="订单状态" align="center" min-width="100px">
        <template slot-scope="{row}">
          <transition name="fade" mode="out-in">
            <template v-if="row.edit">
              <el-select v-model="row.editStatus" placeholder="" size="mini" clearable class="filter-item" style="width: 4rem">
                <el-option label="取消" value="cancel" />
                <el-option v-if="row.status === 'TRANSACTION'" label="匹配中" value="matching" />
              </el-select>
            </template>
            <template v-else>
              <el-tag :color="row.status | colorFilter" size="mini">{{ row.status | statusFilter }}</el-tag>
            </template>
          </transition>
        </template>

      </el-table-column>

      <el-table-column label="操作" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <transition name="fade" mode="out-in">
            <div v-if="row.edit">
              <el-button v-loading="updateLoading(row)" type="success" size="mini" :disabled="updateLoading(row)" @click="updateStatus(row)">
                确认
              </el-button>
              <el-button class="cancel-btn" size="mini" type="warning" @click="cancelEdit(row)">
                取消
              </el-button>
            </div>
            <template v-else>
              <el-button type="primary" size="mini" @click="row.edit=!row.edit">
                更改状态
              </el-button>
            </template>
          </transition>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { getBuyOrderList, cancelBuyOrder, matchBuyOrder } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils/index";
export default {
  name: "BuyOrderList",
  components: { Pagination },
  filters: {
    typeFilter(data) {
      return data ? '大宗' : '普通';
    },
    statusFilter(status) {
      const statusMap = {
        MATCHING: "匹配中",
        TRANSACTION: "交易中",
        CANCELED: "已取消",
        COMPLETED: "已完成",
        OBLIGATION: "待付款",
        UNCONFIRMED: "待确认",
        COMPLAINT: "申诉中"
      };
      return statusMap[status];
    },
    colorFilter(status) {
      const statusMap = {
        MATCHING: "#73C6B647",
        TRANSACTION: "#85C1E947",
        CANCELED: "#C0C4CC47",
        COMPLETED: "#67C23A47",
        OBLIGATION: "#82E0AA47",
        UNCONFIRMED: "#67C23A47",
        COMPLAINT: "#e2aa5647"
      };
      return statusMap[status];
    },
    DateFilter(time) {
      return parseTime(time);
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        language: "",
        page: 1,
        pageSize: 10,
        orderId: null,
        phone: null,
        orderType: null
      },
      updateLoadingList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleFilter() {
      this.getList();
    },

    getList(hideLoading = true) {
      this.listLoading = hideLoading;
      getBuyOrderList(this.listQuery)
        .then((response) => {
          this.list = response.data.contents.map((v) => ({
            ...v,
            edit: false,
            editStatus: null
          }));
          this.total = response.data.total;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },

    updateLoading(row) {
      return this.updateLoadingList.includes(row.orderId);
    },

    updateStatus(row) {
      this.updateLoadingList.push(row.phone);
      let updateFn = null;
      if (row.editStatus === "cancel") {
        updateFn = cancelBuyOrder;
      } else if (row.editStatus === "matching") {
        updateFn = matchBuyOrder;
      } else {
        return;
      }
      updateFn({ orderId: row.orderId })
        .then((res) => {
          row.edit = false;
          this.$message({
            message: `订单【${row.orderId}】状态更改成功`,
            type: "success"
          });
          row.editStatus = null;
          this.getList(false);
        })
        .catch(() => {
          row.editStatus = null;
        })
        .finally(() => {
          this.updateLoadingList.splice(
            this.updateLoadingList.indexOf(row.phone),
            1
          );
        });
    },

    cancelEdit(row) {
      row.editStatus = null;
      row.edit = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.filter-container {
  .filter-item {
    margin-right: 1rem;
  }
}
</style>
