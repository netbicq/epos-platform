<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item prop="deptName">
        <el-input v-model="queryParams.Filter" placeholder="请输入名称 负责人 联系电话等" style="width: 225px" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:dept:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table height="575" size="medium" v-if="refreshTable" :default-expand-all="isExpandAll" v-loading="loading"
      :data="deptList" row-key="deptId">
      <el-table-column prop="name" label="门店名称" width="180"></el-table-column>
      <el-table-column prop="contactTel" label="门店用户名" width="140"></el-table-column>
      <el-table-column prop="contactName" label="门店联系人" width="90" align="center"></el-table-column>
      <el-table-column prop="contactTel" label="门店电话" width="140" />
      <el-table-column prop="address" label="门店地址" width="220"> </el-table-column>
      <el-table-column prop="agencyName" label="经销商名称" width="100"></el-table-column>
      <el-table-column prop="agencyTel" label="经销商电话" width="110"></el-table-column>
      <el-table-column prop="agencyContactName" label="经销商联系人" width="120" align="center" />
      <el-table-column prop="editionTypeStr" label="应用版本" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="editionTypeStrBgc" :class="scope.row.editionType">
            {{ scope.row.editionTypeStr }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" align="center" :formatter="carTimeFilter" label="开通时间" width="120">
      </el-table-column>
      <el-table-column prop="validDate" :formatter="carTimeFilter" label="到期时间" width="120" align="center">
      </el-table-column>
      <el-table-column prop="l" label="用户数量" width="120" align="center"></el-table-column>
      <el-table-column prop="statusStr" label="状态">
        <template slot-scope="scope">
          <div slot="reference">
            <div class="statusBtn" style="margin-right: 10px;" :class="scope.row.status"></div>{{ scope.row.statusStr }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text">
            <el-dropdown trigger="click" size="mini" @command="(command) => lockStatus(command, scope.row)">
              <span class="el-dropdown-link">
                <i class="el-icon-lock"></i>锁定
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(val, key, index) in  lockStatusObj" :command="key" :key="index">
                  <div class="statusBtn" :class="key"></div> {{ val }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="checkBtn">审核</el-dropdown-item>
              <el-dropdown-item command="deleteRow">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 门店修改 -->
    <el-dialog :title="title" @close="handleClose" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px" style="padding-left: 29px">
        <el-row>
          <el-col :span="22" v-if="isAgencyId">
            <el-form-item label="经销商 :" prop="agencyId">
              <el-input v-model="dataForm.agencyId" disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店名称 :" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入门店名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店联系人 :" prop="contactName">
              <el-input v-model="dataForm.contactName" placeholder="请输入门店联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店电话 :" prop="contactTel">
              <el-input v-model="dataForm.contactTel" placeholder="请输入门店电话" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="邮箱 :" prop="email">
              <el-input v-model="dataForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店地址 :" prop="address">
              <el-input v-model="dataForm.address" placeholder="请输入门店地址" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店用户名 :" prop="contactTel">
              <el-input v-model="dataForm.contactTel" placeholder="请输入门店用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-col :span="12">
              <el-form-item label="应用版本 :" prop="editionType">
                <el-select placeholder="应用版本" v-model="dataForm.editionType">
                  <el-option label="专业版" value="Basic"></el-option>
                  <el-option label="企业版" value="Professional"></el-option>
                  <el-option label="旗舰版" value="Enterprise "></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态 :" prop="status">
                <el-select placeholder="请选择状态" v-model="dataForm.status">
                  <el-option v-for="(val, key, index) in  lockStatusObj" :label="val" :value="key" :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="11">
            <el-form-item label="开通时间 :" prop="startDate">
              <el-date-picker v-model="dataForm.startDate" style="width:100%;" type="date" placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="到期时间 :" prop="validDate">
              <el-date-picker v-model="dataForm.validDate" style="width:100%;" type="date" placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  addTenant, getTenant, deleteTenant, editTenant, setStatues
} from "@/api/dealersMgt/storeMgt";
import moment from "moment";
export default {
  name: "StoreMgt",
  data() {
    return {
      lockStatusObj: {
        "NORMAL": '正常',
        "CLOSED": '已关闭',
        "OVERDUE": '已过期',
        "DEMO": '演示中',
        "DISPOSED": '已释放',
      },
      isAgencyId: false,
      rowAgencyId:'',
      isAddData: '',
      disabled: true,
      title: "",
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 总条数
      total: 0,
      // 是否显示新建/修改门店
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        Filter: undefined,
      },
      // 表单参数
      dataForm: {
        agencyId: JSON.parse(sessionStorage.getItem('userInfoData')).id,
      },
      userType: JSON.parse(sessionStorage.getItem('userInfoData')).userType,
      // 表单校验
      rules: {
        /* name: [{ required: true, message: "名称不能为空", trigger: "blur" },],
        contactName: [{ required: true, message: "联系人不能为空", trigger: "blur" }],
        contactTel: [{
          required: true,
          pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
          message: "请输入正确的手机号码",
          trigger: "blur"
        }],
        email: [{
          required: false,
          type: "email",
          message: "请输入正确的邮箱地址",
          trigger: "blur"
        }],
        address: [{ required: true, message: "门店地址不能为空", trigger: "blur" },],
        editionType: [{ required: true, message: "请选择应用版本", trigger: "blur" },],
        status: [{ required: true, message: "请选择状态", trigger: "blur" },],
        startDate: [{ required: true, message: "请选择启用时间", trigger: "blur" },],
        validDate: [{ required: true, message: "请选择到期时间", trigger: "blur" },], */
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询门店账号列表 */
    getList() {
      this.loading = true;
      var indexPage = 0
      if (this.queryParams.Filter == undefined) {
        indexPage = this.queryParams.pageNum - 1
      }
      const queryParams = {
        pageIndex: indexPage,
        size: this.queryParams.pageSize,
        parameter: {
          filter: this.queryParams.Filter,
          agencyId: null
        }
      }
      getTenant(queryParams).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.deptList = res.result.data
          this.total = parseInt(res.result.items)
          this.loading = false;
        }
      })
    },
    // 处理时间显示
    carTimeFilter(row, column, cellValue, index) {
      return moment(cellValue).format("YYYY-MM-DD");
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.Filter = "";
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.title = "新增门店";
      this.dataForm.agencyId = JSON.parse(sessionStorage.getItem('AgencyInfoData')).name
      if (this.userType == 'AGENCY') {
        this.isAgencyId = true
      }
      this.isAddData = true,
        this.open = true;
    },
    // 修改按钮
    handleUpdate(row) {
      console.log(row)
      this.title = "门店修改";
      if (row.agencyId=='0') {
        this.isAgencyId = false
      } else {
        this.isAgencyId = true
      }
      this.dataForm = JSON.parse(JSON.stringify(row));
      this.rowAgencyId=row.agencyId
      this.dataForm.agencyId = row.agencyName
      this.isAddData = false,
        this.open = true;
    },

    // 提交按钮
    submitForm() {
      console.log(this.userType)
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.isAddData == true) {
            if (this.userType == 'AGENCY') {
              this.dataForm.agencyId = JSON.parse(sessionStorage.getItem('AgencyInfoData')).id
            } else {
              this.dataForm.agencyId = 0
            }
            addTenant(this.dataForm).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('新增成功');
                this.open = false;
                this.getList()
                this.dataForm = {};
              }
            });
          } else {
            this.dataForm.agencyId = this.rowAgencyId
            delete this.dataForm.createTime;
            this.dataForm.validDate = new Date(this.dataForm.validDate).toISOString()
            this.dataForm.startDate = new Date(this.dataForm.startDate).toISOString()
            editTenant(this.dataForm).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('修改成功');
                this.open = false;
                this.getList()
                this.dataForm = {};
              }
            });
          }

        }
      })

    },
    // 审核按钮
    checkBtn(row) {
      console.log(row);
      this.$message({
        type: "success",
        message: "审核成功!",
      });
    },
    // 锁定按钮
    lockStatus(command, row) {
      console.log(row, command)
      const parameters = {
        tenantStatus: command,
        tenantId: row.id
      }
      console.log(parameters)
      this.$confirm("是否确认将状态锁定为 “" + this.lockStatusObj[command] + " ”", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          setStatues(parameters).then(res => {
            if (res.type == "success" && res.code == 200) {
              this.$message.success('锁定成功');
              this.getList()
            }
          });
        });

    },

    // 删除按钮
    deleteRow(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTenant(row.id).then(res => {
            if (res.type == 'success' && res.code == 200) {
              this.$message.success('删除成功');
              this.getList();
            } else {
              this.$message.warning('删除失败,请重试');
            }
          }).catch((err) => {
            this.$notify.error({
              title: err
            });
          })
        }).catch(() => {
          /* this.$message.info({
            type: "info",
            message: "已取消删除",
          }); */
        });

    },
    // 关闭按钮
    handleClose() {
      this.dataForm = {};
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "checkBtn":
          this.checkBtn(row);
          break;
        case "resetPassword":
          this.resetPassword(row);
          break;
        case "deleteRow":
          this.deleteRow(row);
          break;
        default:
          break;
      }
    },

  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  border-top: 1px solid rgb(223, 228, 237);
  border-bottom: 1px solid rgb(223, 228, 237);
}

.statusBtn {
  width: 7px;
  height: 7px;
  margin-right: 3px;
  border-radius: 50%;
  display: inline-block;
}

.NORMAL {
  background-color: #67C23A;
}

.CLOSED {
  background-color: #909399;
}

.OVERDUE {
  background-color: #E6A23C;
}

.DEMO {
  background-color: #409EFF;
}

.DISPOSED {
  background-color: #F56C6C;
}

.editionTypeStrBgc {
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
}

.Enterprise {
  background-color: #e8f4ff;
  border-color: #d1e9ff;
  color: #1890ff;
}

.Basic {
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
}

.Professional {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}
</style>