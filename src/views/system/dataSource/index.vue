<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="数据源策略" name="first">
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
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="modifyBtn(true)"
              v-hasPermi="['system:dept:add']">新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
          <!-- @queryTable="getList" -->
        </el-row>

        <el-table height="600" v-if="refreshTable" v-loading="loading" :data="deptList" row-key="deptId"
          :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <el-table-column prop="a" width="260" label="名称"></el-table-column>
          <el-table-column prop="b" width="300" label="写库"  align="center"></el-table-column>
          <el-table-column prop="c" width="300" label="读库"  align="center">
          </el-table-column>
          <el-table-column label="备注" prop="d"> </el-table-column>
          <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="modifyBtn">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" />
      </el-tab-pane>


      <el-tab-pane label="数据源管理" name="second">
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
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addManagementForm(true)"
              v-hasPermi="['system:dept:add']">新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
          <!-- @queryTable="getList" -->
        </el-row>

        <el-table height="600" v-if="refreshTable" v-loading="loading" :data="managementList" row-key="deptId"
          :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <el-table-column prop="a" width="260" label="名称"></el-table-column>
          <el-table-column prop="b" width="300" label="数据驱动名"  align="center"></el-table-column>
          <el-table-column prop="c" width="300" label="连接地址"  align="center">
          </el-table-column>
          <el-table-column label="连接参数" prop="d"> </el-table-column>
          <el-table-column label="用户名" prop="e"> </el-table-column>
          <el-table-column label="密码" prop="f"> </el-table-column>
          <el-table-column label="备注" prop="g"> </el-table-column>
          <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="addManagementForm">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" />
      </el-tab-pane>

    </el-tabs>

    <!-- 维护数据源策略 -->
    <el-dialog :title="dataTitle" @close="handleClose" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="110px" style="padding-left:29px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="名称">
              <el-input v-model="dataForm.a" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="写库">
              <el-select v-model="dataForm.b" placeholder="阿里云库" style="width: 100%">
                <el-option label="阿里云库" value="阿里云库"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="读库">
              <el-select v-model="dataForm.c" placeholder="阿里云库" style="width: 100%">
                <el-option label="阿里云库" value="阿里云库"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="dataForm.d" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 维护数据源管理 -->
    <el-dialog :title="managementTitle" @close="handleClose" :visible.sync="managementOpen" width="600px" append-to-body>
      <el-form ref="dataForm" :model="managementForm" :rules="rules" label-width="110px" style="padding-left:29px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="名称">
              <el-input v-model="managementForm.a" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="数据驱动名">
              <el-input v-model="managementForm.b" placeholder="请输入数据驱动名" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="连接地址">
              <el-input v-model="managementForm.c" placeholder="请输入连接地址" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="连接参数">
              <el-input v-model="managementForm.d" placeholder="请输入连接参数" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="银行开户名">
              <el-input v-model="managementForm.e" placeholder="请输入银行开户名" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="用户名">
              <el-input v-model="managementForm.f" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="密码">
              <el-input v-model="managementForm.g" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="managementForm.h" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitManagementForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listDept,
  getDept,
  delDept,
  addDept,
  updateDept,
  listDeptExcludeChild,
} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import moment from "moment";
export default {
  name: "Dept",
  dicts: ["sys_normal_disable"],
  components: { Treeselect },
  data() {
    return {
      activeName: 'first',
      dataTitle: "",
      managementTitle: "",
      disabled: true,
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 数据源策略
      deptList: [
        {
          a: "库克科技",
          b: "阿里云库",
          c: "阿里云库",
          d: "经销商在创建门店时，是否系统自动审核生效",
        },
        {
          a: "库克科技",
          b: "阿里云库",
          c: "阿里云库",
          d: "经销商在创建门店时，是否系统自动审核生效",
        },
        {
          a: "库克科技",
          b: "阿里云库",
          c: "阿里云库",
          d: "经销商在创建门店时，是否系统自动审核生效",
        },
      ],
      managementList: [
        {
          a: "库克科技",
          b: "阿里云库",
          c: "192.168.123.70",
          d: "111",
          e: "fafafdfs",
          f: '123456',
          g: '备注备注备注'
        },
        {
          a: "库克科技",
          b: "阿里云库",
          c: "192.168.123.70",
          d: "111",
          e: "dsdagada",
          f: '123456',
          g: '备注备注备注'
        },
      ],
      dataForm: {},
      managementForm: {},
      // 总条数
      total: 100,
      managementOpen:false,
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
        Filter: "",
      },
      // 表单校验
      rules: {
        /* phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ], */
      },
    };
  },
  methods: {
    // 提交数据源策略按钮
    submitForm() {
      console.log(this.dataForm);
      this.open = false;
      this.dataForm = {};
    },
    // 提交数据源
    submitManagementForm() {
      console.log(this.managementForm);
      this.managementOpen = false;
      this.managementForm = {};
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.Filter = "";
    },
    /** 搜索按钮操作 */
    handleQuery() {
      console.log(this.queryParams);
    },
    /** 修改按钮操作 */
    modifyBtn(x) {
      if (x === true) {
        this.dataTitle = "新增数据源策略"
      } else {
        this.dataTitle = "维护数据源策略"
      }
      this.open = true;
    },
    addManagementForm(x) {
      if (x === true) {
        this.managementTitle = "新增数据源"
      } else {
        this.managementTitle = "维护数据源"
      }
      this.managementOpen = true;
    },
    // 关闭按钮
    handleClose() {
      this.dataForm = {};
    },
    /** 删除按钮操作 */
    handleDelete(index,row) {
      console.log(index,row)
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  /* created() {
    this.getList();
  }, */
  // methods: {
  //   /** 查询部门列表 */
  //   getList() {
  //     this.loading = true;
  //     listDept(this.queryParams).then(response => {
  //       this.deptList = this.handleTree(response.data, "deptId");
  //       this.loading = false;
  //     });
  //   },
  //   /** 转换部门数据结构 */
  //   normalizer(node) {
  //     if (node.children && !node.children.length) {
  //       delete node.children;
  //     }
  //     return {
  //       id: node.deptId,
  //       label: node.deptName,
  //       children: node.children
  //     };
  //   },
  //   // 表单重置
  //   reset() {
  //     this.form = {
  //       deptId: undefined,
  //       parentId: undefined,
  //       deptName: undefined,
  //       orderNum: undefined,
  //       leader: undefined,
  //       phone: undefined,
  //       email: undefined,
  //       status: "0"
  //     };
  //     this.resetForm("form");
  //   },
  //   /** 搜索按钮操作 */
  //   handleQuery() {
  //     this.getList();
  //   },
  //   /** 重置按钮操作 */
  //   resetQuery() {
  //     this.resetForm("queryForm");
  //     this.handleQuery();
  //   },
  //   /** 新增按钮操作 */
  //   handleAdd(row) {
  //     this.reset();
  //     if (row != undefined) {
  //       this.form.parentId = row.deptId;
  //     }
  //     this.open = true;
  //     this.title = "添加部门";
  //     listDept().then(response => {
  //       this.deptOptions = this.handleTree(response.data, "deptId");
  //     });
  //   },
  //   /** 展开/折叠操作 */
  //   toggleExpandAll() {
  //     this.refreshTable = false;
  //     this.isExpandAll = !this.isExpandAll;
  //     this.$nextTick(() => {
  //       this.refreshTable = true;
  //     });
  //   },
  //   /** 修改按钮操作 */
  //   handleUpdate(row) {
  //     this.reset();
  //     getDept(row.deptId).then(response => {
  //       this.form = response.data;
  //       this.open = true;
  //       this.title = "修改部门";
  //     });
  //     listDeptExcludeChild(row.deptId).then(response => {
  //       this.deptOptions = this.handleTree(response.data, "deptId");
  //     });
  //   },
  //   /** 提交按钮 */
  //   submitForm: function() {
  //     this.$refs["form"].validate(valid => {
  //       if (valid) {
  //         if (this.form.deptId != undefined) {
  //           updateDept(this.form).then(response => {
  //             this.$modal.msgSuccess("修改成功");
  //             this.open = false;
  //             this.getList();
  //           });
  //         } else {
  //           addDept(this.form).then(response => {
  //             this.$modal.msgSuccess("新增成功");
  //             this.open = false;
  //             this.getList();
  //           });
  //         }
  //       }
  //     });
  //   },
    
  // }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.pagination-container {
  ::v-deep .el-pagination {
    top: 0
  }

}
</style>
