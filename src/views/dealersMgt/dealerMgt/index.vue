<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item prop="deptName">
        <el-input v-model="queryParams.parameter" placeholder="请输入名称 负责人 联系电话等" style="width: 225px" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd(true)"
          v-hasPermi="['system:dept:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="575"  size="medium" v-if="refreshTable" v-loading="loading" :data="deptList" row-key="deptId"
      :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="name" width="180" fixed label="经销商名称"></el-table-column>
      <el-table-column prop="contactName" label="联系人" fixed width="100" align="center"></el-table-column>
      <el-table-column prop="contactTel" label="联系电话" fixed width="140">
      </el-table-column>
      <el-table-column label="银行账号" prop="bankAccount" width="200"> </el-table-column>
      <el-table-column prop="bankAccountName" label="银行开户名" width="100"></el-table-column>
      <el-table-column prop="bankName" label="开户银行"></el-table-column>
      <el-table-column prop="g" label="云通道" width="100" align="center"></el-table-column>
      <el-table-column prop="strategyId" label="经销商账号" width="150"></el-table-column>
      <el-table-column label="门店剩余数量" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="dealerBalance(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="k" label="状态" align="center" width="80"></el-table-column>
      <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="maintainBtn(false, scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-lock" @click="lockBtn(scope.row)">锁定</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="resetPassword">重置密码</el-dropdown-item>
              <el-dropdown-item command="setChannel">设置通道</el-dropdown-item>
              <el-dropdown-item command="deleteRow">删除数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageIndex" :limit.sync="queryParams.size"
      @pagination="getList" />

    <!-- 添加修改经销商 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" @close="handleClose" append-to-body>
      <el-form ref="openForm" :model="openForm" :rules="rules" label-width="100px" style="padding-left: 29px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="经销商名称 :" prop="name">
              <el-input v-model="openForm.name" placeholder="请输入经销商名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="联系人 :" prop="contactName">
              <el-input v-model="openForm.contactName" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="联系电话 :" prop="contactTel">
              <el-input v-model="openForm.contactTel" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="银行账号 :" prop="bankAccount">
              <el-input v-model="openForm.bankAccount" placeholder="请输入银行账号" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="银行开户名 :" prop="bankAccountName">
              <el-input v-model="openForm.bankAccountName" placeholder="请输入银行开户名" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="开户银行 :" prop="bankName">
              <el-input v-model="openForm.bankName" placeholder="请输入开户银行" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="经销商账号 :" prop="strategyId">
              <el-input v-model="openForm.strategyId" placeholder="请输入经销商账号" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店数量 :" prop="quantity">
              <el-input v-model="openForm.quantity" placeholder="请输入门店数量" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注 :" prop="remark">
              <el-input type="textarea" v-model="openForm.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加设置通道 -->
    <el-dialog title="设置通道" :visible.sync="openPassage" width="600px" @close="handleClose" append-to-body>
      <el-form  :model="passageForm" style="padding-left: 29px" label-width="100px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="经销商名称 :">
              <el-input v-model="passageForm.name" disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="云通道 :">
              <el-select placeholder="请选择云通道" v-model="passageForm.b" style="width: 100%">
                <el-option label="华东" value="华东"></el-option>
                <el-option label="华南" value="华南"></el-option>
                <el-option label="华北" value="华北"></el-option>
                <el-option label="西南" value="西南"></el-option>
                <el-option label="西北" value="西北"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="passageSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看经销商余额 -->
    <el-dialog title="经销商余额" @close="handleClose" :visible.sync="openDealer" width="550px" append-to-body>
      <el-form  :model="dealerForm" label-width="100px" style="padding-left: 29px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="经销商名称">
              <el-input v-model="dealerForm.name" disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="22" align="center">
            <div>专业版：30</div>
            <div>企业版：50</div>
            <div>旗舰版：20</div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dealerSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  addAgency, editsAgency, deleteAgency, pageAgency,resetPassword,queryMargin
} from "@/api/dealersMgt/dealerMgt";
export default {
  name: "DealerMgt",
  data() {
    return {
      isAddData: '',
      disabled: "true",
      title: "",
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 总条数
      total: 0,
      // 是否显示新建经销商
      open: false,
      // 是否显示设备通道
      openPassage: false,
      // 是否显示查看经销商余额
      openDealer: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        size: 10,
        parameter: undefined,
      },
      // 修改经销商表单参数
      openForm: {},
      // 设备通道表单参数
      passageForm: {},
      // 经销商余额表单参数
      dealerForm: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" },],
        contactName: [{ required: true, message: "联系人不能为空", trigger: "blur" },],
        contactTel: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        bankAccount: [{ required: true, message: "请输入正确的银行账户", trigger: "blur" },],
        bankAccountName: [{ required: true, message: "开户名不能为空", trigger: "blur" },],
        bankName: [{ required: true, message: "开户银行不能为空", trigger: "blur" },],
        strategyId: [{ required: true, message: "名称不能为空", trigger: "blur" },],
        quantity: [{ required: false, message: "经销商账号不能为空", trigger: "blur" },],
        remark: [{ required: false },],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询经销商列表 */
    getList() {
      this.loading = true;
      var indexPage = 0
      if (this.queryParams.parameter == undefined) {
        indexPage = this.queryParams.pageIndex - 1
      }
      const queryParams = {
        pageIndex: indexPage,
        size: this.queryParams.size,
        parameter: this.queryParams.parameter,
      }
      pageAgency(queryParams).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.deptList = res.result.data
          this.total = parseInt(res.result.items)
          this.loading = false;
        }
      })
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.parameter = "";
    },

    /** 新增按钮操作 */
    handleAdd(flag) {
      this.title = "新增经销商";
      this.open = true;
      this.isAddData = true
    },

    // 关闭叉叉
    handleClose() {
      this.openForm = {};
      this.passageForm = {};
      this.dealerForm = {};
    },
    // 查看经销商余额
    dealerBalance(row) {
      this.dealerForm.name = row.name
      queryMargin(row.id).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.openDealer = true;
        }
      })
    },
    // 修改按钮
    maintainBtn(flag, row) {
      this.title = "修改经销商";
      this.open = true;
      this.openForm = JSON.parse(JSON.stringify(row))
      this.isAddData = flag
    },
    // 提交新增修改经销商按钮
    submitForm() {
      this.$refs["openForm"].validate(valid => {
        if (valid) {
          if (this.isAddData) {
            this.openForm.userName = "13310249009"
            addAgency(this.openForm).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('新增成功');
                this.open = false;
                this.getList();
                this.openForm = {};
              }
            })
          } else {
            this.openForm.userName = "13310249009"
            editsAgency(this.openForm).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('修改成功');
                this.getList();
              }
            })
          }
        }
      })
    },
    // 提交设备通道按钮
    passageSubmit() {
      this.passageForm = {};
      this.openPassage = false;
      console.log(this.passageForm);
    },
    // 提交经销商余额查询按钮
    dealerSubmit() {
      this.dealerForm = {};
      this.openDealer = false;
      console.log(this.dealerForm);
    },
    // 设置通道
    setChannel(row) {
      this.passageForm = JSON.parse(JSON.stringify(row))
      this.openPassage = true;
    },
    // 重置密码
    resetPassword(row) {
      const params = {
        tenantId : row.id,
        userId : JSON.parse(sessionStorage.getItem('userInfoData')).id
      }
      this.$confirm("是否确认重置密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          resetPassword(params).then(res => {
            if (res.type == 'success' && res.code == 200) {
              this.$message.success('重置成功');
              this.getList();
            } 
          })
        })
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "resetPassword":
          this.resetPassword(row);
          break;
        case "setChannel":
          this.setChannel(row);
          break;
        case "deleteRow":
          this.deleteRow(row);
          break;
        default:
          break;
      }
    },
    // 删除按钮
    deleteRow(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteAgency(row.id).then(res => {
            if (res.type == 'success' && res.code == 200) {
              this.$message.success('删除成功');
              this.getList();
            }
          })
        })
    },

    // 锁定按钮
    lockBtn(row) {
      console.log(row)
      this.$message({
        message: '已成功锁定',
        type: 'success'
      });
    }
  },
};
</script>
