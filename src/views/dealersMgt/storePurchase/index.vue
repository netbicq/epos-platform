<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item prop="deptName">
        <el-input v-model="queryParams.Filter" placeholder="请输入名称 负责人 联系电话等" style="width: 225px" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:dept:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="Refresh"></right-toolbar>
    </el-row>
    <el-table height="575" size="medium" v-if="refreshTable" v-loading="loading" :data="deptList" row-key="deptId"
      :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="name" label="经销商名称" align="center" width="150"></el-table-column>
      <el-table-column prop="contactName" label="经销商联系人" width="130" align="center"></el-table-column>
      <el-table-column prop="contactTel" label="经销商联系电话" width="160" align="center">
      </el-table-column>
      <el-table-column label="购买数量" width="100" prop="amount" align="center">
      </el-table-column>
      <el-table-column prop="sumMoney" width="120" label="购买金额" align="center"></el-table-column>
      <el-table-column prop="dictType" label="支付方式" width="100" align="center"></el-table-column>
      <el-table-column label="购买版本" width="120" prop="editionType" align="center">
        <template slot-scope="scope">
          <div class="editionTypeStrBgc" :class="scope.row.editionType">
            {{ lockStatusObj[scope.row.editionType] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="orderTime" label="购买时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ carTimeFilter(scope.row.orderTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractCode" label="合同号" align="center" width="190"></el-table-column>
      <el-table-column prop="statusStr" label="状态" align="center" width="120">
        <template slot-scope="scope">
          <div class="statusBtn" style="margin-right: 10px;"
            :class="scope.row.status == 'NORMAL' ? 'CLOSED' : 'NORMAL'">
          </div>
          <span v-text="scope.row.status == 'NORMAL' ? '正常' : '已审核'"></span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-finished" @click="checkBtn(scope.row)"
            :disabled="scope.row.status == 'Audited'">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 购买记录维护 -->
    <el-dialog :title="titlt" @close="handleClose" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="106px" style="padding-left: 29px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="经销商名称 :">
              <el-select value-key="id" @change="agencyFormFun" placeholder="请选择经销商" filterable v-model="agencyId"
                style="width: 100%">
                <el-option v-for="item in allAgency" :key="item.id" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="经销商联系人 :">
              <el-input v-model="agencyForm.contactName" disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="联系电话 :" prop="phone">
              <el-input v-model="agencyForm.contactTel" disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="购买版本 :">
              <el-select placeholder="购买版本" v-model="dataForm.editionType" style="width: 100%">
                <el-option v-for="(val, key, index) in  lockStatusObj" :label="val" :value="key" :key="index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="购买数量 :">
              <el-input v-model="dataForm.amount" placeholder="请输入购买数量" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="购买金额 :">
              <el-input v-model="dataForm.sumMoney" placeholder="请输入购买金额" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="支付方式 :">
              <el-select value-key="id" placeholder="请选择支付方式" v-model="dataForm.payType" style="width: 100%">
                <el-option v-for="item in  payWayArr" :label="item.name" :value="item.id" :key="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="购买时间 :">
              <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.orderTime" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="合同号 :">
              <el-input v-model="dataForm.contractCode" placeholder="请输入合同号" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注 :">
              <el-input v-model="dataForm.remark" type="textarea" placeholder="请输入备注" />
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
import {
  editOrder, getAccount, checkAgencyOrder, addAccount, getAgencySelector, deleteAccount, dictTypeSelector
} from "@/api/dealersMgt/storePurchase";
export default {
  name: "StorePurchase",
  data() {
    return {
      lockStatusObj: {
        "Basic": '专业版',
        "Professional": '企业版',
        "Enterprise": '旗舰版',
      },
      isAddData: '',
      titlt: "",
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 总条数
      total: 100,
      // 是否显示新建经销商
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        Filter: null,
      },
      agencyId: '',
      agencyForm: {},
      payWayArr: [],
      allAgency: [],
      // 表单参数
      dataForm: {},
      // 表单校验
      rules: {
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getAllAgency();
    this.getAllPayWay();
  },
  methods: {
    agencyFormFun(e) {
      this.agencyForm = e
    },
    /** 查询门店账号列表 */
    getList() {
      this.loading = true;
      var indexPage = 0
      if (this.queryParams.Filter == null) {
        indexPage = this.queryParams.pageNum - 1
      }
      const queryParams = {
        pageIndex: indexPage,
        size: this.queryParams.pageSize,
        parameter: this.queryParams.Filter,
        sortField: "string",
        sorting: "string"
      }
      getAccount(queryParams).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.deptList = res.result.data
          this.total = parseInt(res.result.items)
          this.loading = false;
        }
      })
    },
    getAllAgency() {
      getAgencySelector().then(res => {
        if (res.type == "success" && res.code == 200) {
          this.allAgency = res.result
        }
      })
    },
    getAllPayWay() {
      dictTypeSelector().then(res => {
        if (res.type == "success" && res.code == 200) {
          this.payWayArr = res.result

        }
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.Filter = "";
    },
    /** 搜索按钮操作 */
    handleQuery() {
      console.log(this.queryParams);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.titlt = "新增门店账号";
      this.isAddData = true
      this.open = true;
    },
    // 关闭按钮
    handleClose() {
      this.dataForm = {};
    },
    // 修改按钮
    handleUpdate(row) {
      this.titlt = "购买记录维护";
      this.isAddData = false
      this.dataForm = JSON.parse(JSON.stringify(row))
      var rowAgency = this.allAgency.find((item) => { if (item.id == row.agencyId) { return item } })
      this.agencyId = rowAgency.name
      this.agencyForm = rowAgency
      this.open = true;
    },
    // 审核按钮
    checkBtn(row) {
      checkAgencyOrder(row.id).then(res => {
        if (res.type == 'success' && res.code == 200) {
          this.$message.success('审核成功');
          this.getList();
        }
      })
    },
    // 提交按钮
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.isAddData) {
            const Parameters = this.dataForm
            Parameters.agencyId = this.agencyForm.id
            addAccount(Parameters).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('新增成功');
                this.open = false;
                this.getList();
                this.dataForm = {};
              }
            })
          } else {
            this.dataForm.orderTime = new Date(this.dataForm.orderTime).toISOString()
            editOrder(this.dataForm).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('修改成功');
                this.getList();
                this.open = false;
                this.dataForm = {};
              }
            })
          }
        }
      })
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteAccount(row.id).then(res => {
            if (res.type == 'success' && res.code == 200) {
              this.$message.success('删除成功');
              this.getList();
            }
          })
        })
    },
    Refresh() {
      this.getList();
      this.getAllAgency();
      this.getAllPayWay();
    }
  },
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
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
</style>
