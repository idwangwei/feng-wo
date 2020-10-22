<template>
  <div class="app-container" style="height:calc(100vh - 50px)">

    <div class="role-container">
      <el-button type="primary" size="mini" style="margin-bottom:1rem" @click="showRoleDialog()">
        添加角色
      </el-button>

      <el-table v-loading="roleListLoading" :data="roleList" border fit highlight-current-row style="width: 100%;" height="calc(100% - 4rem)">
        <el-table-column prop="name" label="角色名称" width="150"></el-table-column>
        <el-table-column label="权限" align="center" width="auto">
          <template slot-scope="{row}">
            <el-tag v-for="(item, index) in row.auth" :key="index" type="success" size="mini">
              {{ item | authMap }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="showRoleDialog(row)">
              编辑
            </el-button>
            <el-button size="mini" type="warning" @click="deleteRole(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="mangement-container">
      <el-button type="primary" size="mini" style="margin-bottom:1rem" @click="showManegementDialog()">
        添加管理员
      </el-button>
      <el-table v-loading="manegementListLoading" :data="manegementList" border fit highlight-current-row style="width: 100%;" height="calc(100% - 4rem)">
        <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
        <el-table-column label="角色" align="center" width="auto">
          <template slot-scope="{row}">
            <el-tag v-for="(item, index) in row.roles" :key="index" type="success" size="mini">
              {{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter" size="mini">
              {{ row.status == 'enable' ? '正常':'禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <transition name="el-fade-in">
              <el-button v-if="row.status == 'enable'" type="primary" size="mini" @click="disableAccount(row)">
                禁用
              </el-button>
              <el-button v-else size="mini" type="success" @click="enableAccount(row)">
                激活
              </el-button>
            </transition>
            <el-button size="mini" type="success" @click="showManegementDialog(row)">
              编辑
            </el-button>
            <el-button size="mini" type="warning" @click="deleteAccount(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="roleDialogTitle" :visible.sync="roleDialogVisible" width="50%">
      <el-form ref="roleForm" :rules="roleRules" :model="roleTemp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleTemp.name" style="width:300px" />
        </el-form-item>
        <el-form-item label="Type" prop="auth">
          <el-select v-model="roleTemp.auth" multiple class="filter-item" placeholder="Please select" style="width:300px" @change="roleRuleChange($event)">
            <el-option v-for="item in authOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="roleDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="manegementDialogTitle" :visible.sync="manegementDialogVisible" width="50%">
      <el-form ref="manegementForm" :rules="manegementRules" :model="manegementTemp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="manegementTemp.phone" style="width:300px" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="manegementTemp.roles" multiple class="filter-item" placeholder="Please select" style="width:300px">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="manegementDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmMangement">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, getAdminuser } from "@/api/table";
const roleAuthLabelValue = [
  { value: 'all', label: '所有权限' },
  { value: 'pool', label: '矿池管理' },
  { value: 'wwt', label: 'FMC价格管理' },
  { value: 'order', label: '订单管理' },
  { value: 'notity', label: '公告管理' },
  { value: 'feedback', label: '用户反馈管理' },
  { value: 'user', label: '用户管理' },
  { value: 'role', label: '角色管理' }
];
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        enable: "success",
        disable: "info"
      };
      return statusMap[status];
    },
    authMap(auth) {
      return roleAuthLabelValue.find(v => v.value === auth.toLowerCase()).label;
    }
  },
  data() {
    return {
      roleList: [],
      manegementList: [],
      roleListLoading: true,
      manegementListLoading: true,
      roleDialogType: 'add',
      roleDialogTitle: '',
      roleDialogVisible: false,
      manegementDialogType: 'add',
      manegementDialogTitle: '',
      manegementDialogVisible: false,
      authOptions: roleAuthLabelValue,
      roleTemp: {
        name: null,
        auth: null
      },
      roleRules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        auth: [{ required: true, message: 'rule is required', trigger: 'change' }]
      },
      manegementTemp: {
        phone: null,
        roles: null
      },
      manegementRules: {
        phone: [{ required: true, message: 'phone is required', trigger: 'change' }],
        roles: [{ required: true, message: 'roles is required', trigger: 'change' }]
      }
    };
  },
  created() {
    this.getManegementList();
    this.getRoleList();
  },
  methods: {
    getManegementList() {
      this.manegementListLoading = true;
      getAdminuser()
        .then((response) => {
          this.manegementList = response.data.map(v => ({ ...v, roles: v.roleName.split(',') }));
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.manegementListLoading = false;
        });
    },
    getRoleList() {
      this.roleListLoading = true;
      getRoles()
        .then((response) => {
          this.roleList = response.data.map(v => ({ ...v, auth: v.role.split(',') }));
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.roleListLoading = false;
        });
    },

    editRole(row) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
    },
    deleteRole(row) {
      this.$notify({
        title: "INFO",
        message: "稍后删除",
        type: "info",
        duration: 2000
      });
    },
    disableAccount(row) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = 'disable';
    },
    enableAccount(row) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = 'enable';
    },
    deleteAccount(row) {
      this.$notify({
        title: "INFO",
        message: "稍后删除",
        type: "info",
        duration: 2000
      });
      // this.list.splice(index, 1);
    },
    showRoleDialog(role) {
      this.roleDialogVisible = true;
      this.roleTemp.name = null;
      this.roleTemp.auth = null;
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate();
      });
      this.roleDialogType = role ? 'edit' : 'add';
      if (role) {
        this.roleTemp.name = role.name;
        this.roleTemp.auth = role.auth;
        this.roleDialogTitle = '修改角色';
      } else {
        this.roleDialogTitle = '创建角色';
      }
    },
    roleRuleChange(arr) {
      const lastVal = arr[arr.length - 1];
      if (lastVal === 'all') {
        this.roleTemp.auth = ['all'];
      } else {
        const idx = this.roleTemp.auth.findIndex(v => v === 'all');
        if (idx !== -1) {
          this.roleTemp.auth.splice(idx, 1);
        }
      }
    },
    confirmRole() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          this.roleDialogVisible = false;
          this.$notify({
            title: 'Success',
            message: 'Successfully',
            type: 'success',
            duration: 2000
          });
        }
      });
    },
    showManegementDialog(mangement) {
      this.manegementDialogVisible = true;
      this.manegementDialogType = mangement ? 'edit' : 'add';
      this.manegementTemp.phone = null;
      this.manegementTemp.roles = null;
      this.$nextTick(() => {
        this.$refs['manegementForm'].clearValidate();
      });
      if (mangement) {
        this.manegementTemp.phone = mangement.phone;
        this.manegementTemp.roles = mangement.roles;
        this.manegementDialogTitle = '修改管理员';
      } else {
        this.manegementDialogTitle = '创建管理员';
      }
    },
    confirmMangement() {
      this.$refs['manegementForm'].validate((valid) => {
        if (valid) {
          this.manegementDialogVisible = false;
          this.$notify({
            title: 'Success',
            message: 'Successfully',
            type: 'success',
            duration: 2000
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.role-container, .mangement-container{
  height: 50%;

}
</style>
