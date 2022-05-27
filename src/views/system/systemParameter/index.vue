<template>
  <div class="app-container">
    <el-table
      height="600"
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="a" label="参数名"></el-table-column>
      <el-table-column prop="b" label="参数Key值"></el-table-column>
      <el-table-column prop="c" label="参数值"> </el-table-column>
      <el-table-column label="参数说明" prop="d"> </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="text"
            @click="modifyBtn"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    />

    <!-- 修改参数 -->
    <el-dialog
      title="修改参数"
      @close="handleClose"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="rules"
        label-width="110px"
        style="padding-left: 29px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="参数名 :">
              <el-input v-model="dataForm.a" placeholder="请输入参数名" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="参数Key值 :">
              <el-input disabled="disabled" v-model="dataForm.b" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="参数 :" prop="phone">
              <el-input v-model="dataForm.c" placeholder="请输入参数" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="参数说明 :">
              <el-input
                type="textarea"
                v-model="dataForm.d"
                placeholder="请输入参数说明"
              />
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
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Dept",
  dicts: ["sys_normal_disable"],
  components: { Treeselect },
  data() {
    return {
      disabled: true,
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [
        {
          a: "经销商创建门店自动审核",
          b: "AgentCreateAccountAutoVerify",
          c: "True",
          d: "经销商在创建门店时，是否系统自动审核生效",
        },
        {
          a: "经销商创建门店自动审核",
          b: "AgentCreateAccountAutoVerify",
          c: "True",
          d: "经销商在创建门店时，是否系统自动审核生效",
        },
        {
          a: "经销商创建门店自动审核",
          b: "AgentCreateAccountAutoVerify",
          c: "True",
          d: "经销商在创建门店时，是否系统自动审核生效",
        },
      ],
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
        Filter: "",
      },
      // 表单参数
      dataForm: {
        a: "经销商创建门店自动审核",
        b: "AgentCreateAccountAutoVerify",
        c: "True",
        d: "经销商在创建门店时，是否系统自动审核生效",
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
    // 提交按钮
    submitForm() {
      console.log(this.dataForm);
      this.open = false;
      this.dataForm = {};
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
    modifyBtn() {
      this.open = true;
    },
    // 关闭按钮
    handleClose() {
      this.dataForm = {};
    },
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
  //   /** 删除按钮操作 */
  //   handleDelete(row) {
  //     this.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的数据项？').then(function() {
  //       return delDept(row.deptId);
  //     }).then(() => {
  //       this.getList();
  //       this.$modal.msgSuccess("删除成功");
  //     }).catch(() => {});
  //   }
  // }
};
</script>
