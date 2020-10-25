<template>
  <div class="app-container" style="height:calc(100vh - 50px)">

    <div class="role-container">
      <el-button type="primary" size="mini" style="margin-bottom:1rem" @click="showRoleDialog()">
        添加角色
      </el-button>

      <el-table v-loading="roleListLoading" :data="roleList" border fit highlight-current-row style="width: 100%;" height="calc(100% - 4rem)">
        <el-table-column prop="name" label="角色名称" width="150"></el-table-column>
        <!-- <el-table-column prop="id" label="角色ID" width="100"></el-table-column> -->
        <el-table-column label="权限" align="center" width="auto">
          <template slot-scope="{row}">
            <el-tag v-for="(item, index) in row.auth" :key="index" type="success" size="mini">
              {{ item | authMap }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button v-if="row.role !== 'ALL'" type="primary" size="mini" @click="showRoleDialog(row)">
              编辑
            </el-button>
            <el-button v-if="row.role !== 'ALL'" v-loading="showDeleteRoleLoading(row)" :disabled="showDeleteRoleLoading(row)" size="mini" type="warning" @click="deleteRoleHandle(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="mangement-container">
      <el-row type="flex" justify="space-between" style="margin-bottom:1rem">
        <el-col>
          <el-button type="primary" size="mini" @click="showManegementDialog()">
            添加管理员
          </el-button>
        </el-col>
        <el-col>
          <el-row type="flex" justify="end">
            <el-select v-model="query.type" style="width:5.5rem" size="mini">
              <el-option label="电话" value="phone" />
              <el-option label="角色ID" value="roleId" />
              <el-option label="昵称" value="username" />
            </el-select>
            <el-input v-model="query.input" size="mini" style="width:8rem;margin-right:1rem" @keyup.enter.native="queryManegementByParam"></el-input>
            <el-button v-loading="queryLoading" :disabled="queryLoading" type="primary" size="mini" @click="queryManegementByParam()">
              查询
            </el-button>
            <el-button v-loading="manegementListLoading" :disabled="manegementListLoading" type="primary" size="mini" @click="getManegementList()">
              查询全部
            </el-button>
          </el-row>
        </el-col>
      </el-row>

      <el-table v-loading="manegementListLoading" :data="manegementList" border fit highlight-current-row style="width: 100%;" height="calc(100% - 4rem)">
        <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
        <el-table-column prop="username" label="昵称" width="150"></el-table-column>
        <el-table-column label="角色" align="center" width="auto">
          <template slot-scope="{row}">
            <el-tag v-for="(item, index) in row.roles" :key="index" type="success" size="mini">
              {{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.enable | statusFilter" size="mini">
              {{ row.enable ? '正常':'禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <transition v-if="row.username !== 'admin'" name="el-fade-in">
              <el-button v-if="row.enable" v-loading="showDisableManegementLoading(row)" :disabled="showDisableManegementLoading(row)" type="primary" size="mini" @click="disableAccount(row)">
                禁用
              </el-button>
              <el-button v-else v-loading="showEnableManegementLoading(row)" :disabled="showEnableManegementLoading(row)" size="mini" type="success" @click="enableAccount(row)">
                激活
              </el-button>
            </transition>
            <el-button v-if="row.username !== 'admin'" size="mini" type="primary" @click="showManegementDialog(row)">
              编辑
            </el-button>
            <el-button v-if="row.username !== 'admin'" v-loading="showDeleteManegementLoading(row)" size="mini" type="warning" :disabled="showDeleteManegementLoading(row)" @click="deleteAccountHandle(row)">
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
        <el-form-item label="权限" prop="auth">
          <el-select v-model="roleTemp.auth" multiple class="filter-item" placeholder="请选择角色权限" style="width:300px" @change="roleRuleChange($event)">
            <el-option v-for="item in authOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="roleDialogVisible = false">取 消</el-button>
        <el-button v-loading="addRoleLoading" :disabled="addRoleLoading" size="mini" type="primary" @click="confirmRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="manegementDialogTitle" :visible.sync="manegementDialogVisible" width="50%">
      <el-form ref="manegementForm" :rules="manegementRules" :model="manegementTemp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="manegementTemp.phone" style="width:300px" :disabled="!!manegementDialog" />
        </el-form-item>
        <el-form-item label="名称" prop="username">
          <el-input v-model="manegementTemp.username" :disabled="!!manegementDialog" style="width:300px" />
        </el-form-item>
        <el-form-item v-if="!manegementDialog" label="密码" prop="password">
          <el-input v-model="manegementTemp.password" style="width:300px" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="manegementTemp.roleId" class="filter-item" placeholder="请选择" style="width:300px">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="manegementDialogVisible = false">取 消</el-button>
        <el-button v-loading="addManegementLoading" :disabled="addManegementLoading" size="mini" type="primary" @click="confirmMangement">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoles,
  getAdminuser,
  deleteAdminuserRole,
  deleteAdminuser,
  addRole,
  addAdminuser,
  updateRole,
  updateAdminuserRole,
  updateAdminuserEnable,
  getAdminuserByName,
  getAdminuserByPhone,
  getAdminuserByRoleId
} from "@/api/table";
import { validateTelephone } from "@/utils/validate";

const roleAuthLabelValue = [
  { value: 'ALL', label: '所有权限' },
  { value: 'MINING_MANAGER', label: '矿池管理' },
  { value: 'MARKET_MANAGER', label: '市场管理' },
  { value: 'ORDER_MANAGER', label: '订单管理' },
  { value: 'ANN_MANAGER', label: '公告管理' },
  { value: 'FEEDBACK_MANAGER', label: '用户反馈管理' },
  { value: 'USER_MANAGER', label: '用户管理' },
  { value: 'ROLE_MANAGER', label: '角色管理' }
];
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        'true': "success",
        'false': "info"
      };
      return statusMap[status];
    },
    authMap(auth) {
      return roleAuthLabelValue.find(v => v.value === auth).label;
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!(/^.{8,18}$/.test(value))) {
        callback(new Error('密码为8-18位有效字符'));
      } else {
        callback();
      }
    };
    return {
      roleList: [],
      manegementList: [],
      roleListLoading: true,
      manegementListLoading: true,
      roleDialog: null,
      roleDialogTitle: '',
      roleDialogVisible: false,
      addRoleLoading: false,
      deleteRoleLoadingList: [],
      manegementDialog: null,
      manegementDialogTitle: '',
      manegementDialogVisible: false,
      addManegementLoading: false,
      deleteManegementLoadingList: [],
      authOptions: roleAuthLabelValue,
      enableManegementLoadingList: [],
      disableManegementLoadingList: [],
      roleTemp: {
        name: null,
        auth: null
      },
      roleRules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        auth: [{ required: true, message: 'rule is required', trigger: 'blur' }]
      },
      manegementTemp: {
        password: "",
        phone: "",
        roleId: "",
        username: ""
      },
      manegementRules: {
        phone: [{ required: true, message: '请输入管理员手机号', trigger: 'blur', validator: validateTelephone }],
        password: [{ required: true, message: '请输入管理员密码', trigger: 'blur', validator: validatePass }],
        roleId: [{ required: true, message: '请选择管理员角色', trigger: 'blur' }],
        username: [{ required: true, message: '请输入管理员名称', trigger: 'blur' }]
      },
      query: {
        type: 'phone',
        input: ''
      },
      queryLoading: false
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
    getRoleList(hideLoading = false) {
      this.roleListLoading = !hideLoading;
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
    showDeleteRoleLoading(row) {
      return this.deleteRoleLoadingList.includes(row.id);
    },
    showDeleteManegementLoading(row) {
      return this.deleteManegementLoadingList.includes(row.id);
    },
    deleteRoleHandle(row) {
      this.deleteRoleLoadingList.push(row.id);
      deleteAdminuserRole(row.id)
      .then(res => {
        this.roleList.splice(this.roleList.findIndex(v => v.id === row.id), 1);
      })
      .catch(() => {})
      .finally(() => {
        this.deleteRoleLoadingList.splice(this.deleteRoleLoadingList.indexOf(row.id), 1);
      });
    },
    deleteAccountHandle(row) {
      this.deleteManegementLoadingList.push(row.id);
      deleteAdminuser({ id: row.id })
      .then(res => {
        this.manegementList.splice(this.manegementList.findIndex(v => v.id === row.id), 1);
      })
      .catch(() => {})
      .finally(() => {
        this.deleteManegementLoadingList.splice(this.deleteManegementLoadingList.indexOf(row.id), 1);
      });
    },
    showEnableManegementLoading(row) {
      return this.enableManegementLoadingList.includes(row.id);
    },
    showDisableManegementLoading(row) {
      return this.disableManegementLoadingList.includes(row.id);
    },
    enableAccount(row) {
      this.enableManegementLoadingList.push(row.id);
      updateAdminuserEnable({ id: row.id, enable: true })
      .then(res => {
        row.enable = true;
      })
      .catch(() => {})
      .finally(() => {
        this.enableManegementLoadingList.splice(this.enableManegementLoadingList.indexOf(row.id), 1);
      });
    },
    disableAccount(row) {
      this.disableManegementLoadingList.push(row.id);
      updateAdminuserEnable({ id: row.id, enable: false })
      .then(res => {
        row.enable = false;
      })
      .catch(() => {})
      .finally(() => {
        this.disableManegementLoadingList.splice(this.disableManegementLoadingList.indexOf(row.id), 1);
      });
    },

    showRoleDialog(role) {
      this.roleDialogVisible = true;
      this.roleTemp.name = null;
      this.roleTemp.auth = null;
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate();
      });
      this.roleDialog = role;
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
      if (lastVal === 'ALL') {
        this.roleTemp.auth = ['ALL'];
      } else {
        const idx = this.roleTemp.auth.findIndex(v => v === 'ALL');
        if (idx !== -1) {
          this.roleTemp.auth.splice(idx, 1);
        }
      }
    },
    confirmRole() {
      this.$refs['roleForm'].validate((valid) => {
        if (!valid) { return; }
        if (!this.roleDialog) {
          this.addRoleLoading = true;
          addRole({ name: this.roleTemp.name, role: this.roleTemp.auth.join(',') })
          .then(res => {
            this.roleDialogVisible = false;
            this.getRoleList(true);
          })
          .catch(() => {})
          .finally(() => {
            this.addRoleLoading = false;
          });
        } else {
          this.addRoleLoading = true;
          updateRole({ id: this.roleDialog.id, name: this.roleTemp, role: this.roleTemp.auth.join(',') })
          .then(res => {
            this.roleDialogVisible = false;
            this.getRoleList(true);
          })
          .catch(() => {})
          .finally(() => {
            this.addRoleLoading = false;
          });
        }
      });
    },
    showManegementDialog(mangement) {
      this.manegementDialogVisible = true;
      this.manegementDialog = mangement;
      this.manegementTemp.phone = null;
      this.manegementTemp.password = null;
      this.manegementTemp.roleId = null;
      this.manegementTemp.username = null;
      this.$nextTick(() => {
        this.$refs['manegementForm'].clearValidate();
      });
      if (mangement) {
        this.manegementTemp.phone = mangement.phone;
        this.manegementTemp.username = mangement.username;
        this.manegementTemp.roleId = this.roleList.find(v => v.name === mangement.roleName).id;
        this.manegementDialogTitle = '修改管理员';
      } else {
        this.manegementDialogTitle = '创建管理员';
      }
    },
    confirmMangement() {
      this.$refs['manegementForm'].validate((valid) => {
        if (!valid) { return; }

        if (this.manegementDialog) {
          const roleName = this.roleList.find(v => v.id === this.manegementTemp.roleId).name;
          this.addManegementLoading = true;
          updateAdminuserRole({ id: this.manegementDialog.id, roleName })
          .then(res => {
            this.manegementDialogVisible = false;
            this.getManegementList(true);
          })
          .catch(() => {})
          .finally(() => {
            this.addManegementLoading = false;
          });
        } else {
          this.addManegementLoading = true;
           addAdminuser(this.manegementTemp)
          .then(res => {
            this.manegementDialogVisible = false;
            this.getManegementList(true);
          })
          .catch(() => {})
          .finally(() => {
            this.addManegementLoading = false;
          });
        }
      });
    },
    queryManegementByParam() {
      if (!this.query.input) {
        return;
      }

      this.queryLoading = true;
      let queryPromise = null;
      switch (this.query.type) {
        case 'phone':
          queryPromise = getAdminuserByPhone({ phone: this.query.input });
          break;
        case 'roleId':
          queryPromise = getAdminuserByRoleId({ roleId: this.query.input });
          break;
        case 'username':
        default:
          queryPromise = getAdminuserByName({ username: this.query.input });
          break;
      }
      queryPromise.then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          data = [data];
        }
        this.manegementList = data.map(v => ({ ...v, roles: v.roleName.split(',') }));
      })
      .finally(() => {
        this.queryLoading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.role-container, .mangement-container{
  height: 50%;

}
/deep/ .el-loading-spinner{
  svg{
    width: 1rem;
  }
}
</style>
