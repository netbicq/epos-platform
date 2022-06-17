<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      

      <el-tab-pane label="数据源" name="first">
        <el-form :model="queryParams" size="small" :inline="true" v-show="showSearch">
          <el-form-item prop="deptName">
            <el-input v-model="queryParams.Filter" placeholder="请输入名称 负责人 联系电话等" style="width: 225px" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="getSourceData">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 新增数据源 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addManagementForm('', true)">新增
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getSourceData"></right-toolbar>
        </el-row>
        <el-table height="600" size="medium" v-if="refreshTable" v-loading="loading" :data="managementList"
          row-key="deptId" :default-expand-all="isExpandAll"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <el-table-column prop="name" width="120" label="名称"></el-table-column>
          <el-table-column prop="driverClassName" width="230" label="数据驱动名" align="center"></el-table-column>
          <el-table-column prop="urlPrepend" width="300" label="连接地址" align="center"></el-table-column>
          <el-table-column label="连接参数" width="350" prop="urlAppend"></el-table-column>
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="密码" prop="password"></el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="addManagementForm(scope.row, false)">修改
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row, false)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getSourceData" />
      </el-tab-pane>
      <el-tab-pane label="数据源策略" name="second">
        <el-form :model="strategyParams" size="small" :inline="true" v-show="showSearch">
          <el-form-item prop="deptName">
            <el-input v-model="strategyParams.Filter" placeholder="请输入名称 负责人 联系电话等" style="width: 225px" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="getStrategyData">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 新增数据源策略 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="modifyBtn('', true)">新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getStrategyData"></right-toolbar>
        </el-row>
        <el-table height="575" size="medium" v-if="refreshTable" v-loading="loading" :data="deptList" row-key="deptId"
          :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <el-table-column prop="name" width="260" label="名称"></el-table-column>
          <el-table-column prop="writeSourceId" width="300" label="写库" align="center"></el-table-column>
          <el-table-column prop="readSourceId" width="300" label="读库" align="center"></el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="modifyBtn(scope.row, false)">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row, true)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 策略分页 -->
        <pagination v-show="totalStrategy > 0" :total="totalStrategy" :page.sync="strategyParams.pageNum"
          :limit.sync="strategyParams.pageSize" @pagination="getStrategyData" />
      </el-tab-pane>
    </el-tabs>

    

    <!-- 修改数据源 -->
    <el-dialog :title="managementTitle" @close="handleClose" :visible.sync="managementOpen" width="600px"
      append-to-body>
      <el-form ref="managementForm" :rules="dataRules" :model="managementForm" label-width="110px"
        style="padding-left: 29px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="名称 :" prop="name">
              <el-input v-model="managementForm.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="数据驱动名 :" prop="driverClassName">
              <el-input v-model="managementForm.driverClassName" placeholder="请输入数据驱动名" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="连接地址 :" prop="urlPrepend">
              <el-input v-model="managementForm.urlPrepend" placeholder="请输入连接地址" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="连接参数 :" prop="urlAppend">
              <el-input v-model="managementForm.urlAppend" placeholder="请输入连接参数" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="用户名 :" prop="username">
              <el-input v-model="managementForm.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="密码 :" prop="password">
              <el-input v-model="managementForm.password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注 :" prop="remark">
              <el-input type="textarea" v-model="managementForm.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitManagementForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改数据源策略 -->
    <el-dialog :title="dataTitle" @close="handleClose" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="110px" style="padding-left: 29px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="名称 :" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="写库 :" prop="writeSourceId">
              <el-select v-model="dataForm.writeSourceId" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in managementList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="读库 :" prop="readSourceId">
              <el-select v-model="dataForm.readSourceId" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in managementList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注 :" prop="remark">
              <el-input type="textarea" v-model="dataForm.remark" placeholder="请输入备注" />
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
  addDataSource, getStrategyData, getSourceData, addStrategyData, deleteDataSource, deleteStrategyData, editDataSource, editStrategyData
} from "@/api/system/dataSource";
export default {
  name: "DataSource",
  data() {
    return {
      isAddDataSource: '',
      activeName: "first",
      dataTitle: "",
      managementTitle: "",
      disabled: true,
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 数据源策略
      deptList: [],
      // 数据源数据
      managementList: [],
      dataForm: {},
      managementForm: {},
      editDataSourceID: '',
      // 数据源总条数
      total: 0,
      totalStrategy: 0,
      managementOpen: false,
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
        Filter: undefined,
      },
      // 策略查询参数
      strategyParams: {
        pageNum: 1,
        pageSize: 10,
        Filter: undefined,
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" },],
        writeSourceId: [{ required: true, message: "请选择", trigger: "blur" }],
        readSourceId: [{ required: true, message: "请选择", trigger: "blur" },],
        remark: [{ required: false },],
      },
      dataRules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" },],
        driverClassName: [{ required: true, message: "数据驱动名不能为空", trigger: "blur" }],
        urlPrepend: [{ required: true, message: "连接地址不能为空", trigger: "blur" },],
        urlAppend: [{ required: false },],
        username: [{ required: true, message: "用户名不能为空", trigger: "blur" },],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" },],
        remark: [{ required: false },],
      },
    };
  },
  created() {
    this.getSourceData();
    this.getStrategyData();
  },
  methods: {
    // 获取数据源
    getSourceData() {
      this.loading = true;
      var indexPages = 0
      if (this.queryParams.parameter == undefined) {
        indexPages = this.queryParams.pageNum - 1
      }
      const queryParams = {
        pageIndex: indexPages,
        size: this.queryParams.pageSize,
        parameter: this.queryParams.Filter,
      }
      getSourceData(queryParams).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.managementList = res.result.data
          this.total = parseInt(res.result.items)
          this.loading = false;
        } 
      })
    },
    // 获取策略
    getStrategyData() {
      this.loading = true;
      var indexPage = 0
      if (this.queryParams.parameter == undefined) {
        indexPage = this.strategyParams.pageNum - 1
      }
      const queryParams = {
        pageIndex: indexPage,
        size: this.strategyParams.pageSize,
        parameter: this.strategyParams.Filter,
      }
      getStrategyData(queryParams).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.deptList = res.result.data
          this.totalStrategy = parseInt(res.result.items)
          this.loading = false;
        } 
      })
    },
    /* handleClick(tab) {
      if (tab.index == 0) {
        this.getStrategyData();
      } else if (tab.index == 1) {
        this.getSourceData();
      }
    }, */
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.Filter = "";
      this.strategyParams.Filter = "";
    },
    /** 新增/修改按钮操作 */
    modifyBtn(row, flag) {
      this.isAddDataSource = flag
      if (flag === true) {
        this.dataTitle = "新增数据源策略";
      } else {
        this.dataTitle = "修改数据源策略";
        this.dataForm = JSON.parse(JSON.stringify(row));
      }
      this.open = true;
    },
    addManagementForm(row, flag) {
      this.isAddDataSource = flag
      if (flag === true) {
        this.managementTitle = "新增数据源";
      } else {
        this.managementTitle = "修改数据源";
        this.managementForm = JSON.parse(JSON.stringify(row));
      }
      this.managementOpen = true;
    },
    // 提交数据源管理
    submitManagementForm() {
      this.$refs["managementForm"].validate(valid => {
        if (valid) {
          if (this.isAddDataSource === true) {
            addDataSource(this.managementForm).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('新增成功');
                this.managementOpen = false;
                this.getSourceData();
                this.managementForm = {};
              } 
            })
          } else {
            delete this.managementForm.createTime;
            delete this.managementForm.sort;
            delete this.managementForm.createBy;
            delete this.managementForm.updateBy;
            delete this.managementForm.updateTime;
            editDataSource(this.managementForm).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('修改成功');
                this.managementOpen = false;
                this.getSourceData();
                this.managementForm = {};
              } 
            })
          }
        }
      })

    },
    // 提交数据源策略
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.isAddDataSource === true) {
            addStrategyData(this.dataForm).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('新增成功');
                this.open = false;
                this.dataForm = {};
                this.getStrategyData();
              } 
            })
          } else {
            delete this.dataForm.sort;
            editStrategyData(this.dataForm).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('修改成功');
                this.open = false;
                this.dataForm = {};
                this.getStrategyData();
              } 
            })
          }
        }
      })

    },
    /** 删除按钮操作 */
    handleDelete(row, flag) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (flag === true) {
            deleteStrategyData(row.id).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('删除成功');
                this.getStrategyData();
              } 
            })
          } else {
            deleteDataSource(row.id).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('删除成功');
                this.getSourceData();
              }
            })
          }
        })
    },
    // 关闭按钮
    handleClose() {
      this.dataForm = {};
      this.managementForm = {}
    },
  },
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.pagination-container {
  ::v-deep .el-pagination {
    top: 0;
  }
}
</style>
