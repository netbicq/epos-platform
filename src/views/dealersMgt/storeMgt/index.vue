<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item prop="deptName">
        <el-input
          v-model="queryParams.Filter"
          placeholder="请输入名称 负责人 联系电话等"
          style="width: 225px"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dept:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
    </el-row>
    <el-table
      height="600"
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="a"
        label="门店名称"
        fixed
        width="180"
      ></el-table-column>
      <el-table-column
        prop="b"
        label="门店联系人"
        fixed
        width="90"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="c"
        label="门店电话"
        align="center"
        fixed
        width="110"
      >
      </el-table-column>
      <el-table-column prop="d" label="门店地址" width="200"> </el-table-column>
      <el-table-column
        prop="e"
        label="经销商名称"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="f"
        label="经销商电话"
        width="110"
        align="center"
      ></el-table-column>
      <el-table-column prop="g" label="经销商联系人" width="120" align="center">
      </el-table-column>
      <el-table-column
        prop="h"
        label="门店用户名"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="i"
        label="应用版本"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="j"
        align="center"
        :formatter="carTimeFilter"
        label="开通时间"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="k"
        :formatter="carTimeFilter"
        label="有效期"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="l"
        label="用户数量"
        align="center"
      ></el-table-column>
      <el-table-column prop="m" label="状态" align="center"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="text" @click="handleUpdate"
            >修改</el-button
          >
         
          <el-button size="mini" icon="el-icon-lock" type="text" @click="lockBtn(scope.row)"
            >锁定</el-button
          >
           <el-button size="mini" icon="el-icon-finished" type="text" @click="checkBtn(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    />

    <!-- 门店维护 -->
    <el-dialog
      :title="title"
      @close="handleClose"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="rules"
        label-width="100px"
        style="padding-left: 29px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="经销商 :">
              <el-input v-model="dataForm.a" disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店名称 :">
              <el-input v-model="dataForm.b" placeholder="请输入门店名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店联系人 :">
              <el-input v-model="dataForm.c" placeholder="请输入门店联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店电话 :" prop="phone">
              <el-input v-model="dataForm.d" placeholder="请输入门店电话" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店地址 :">
              <el-input v-model="dataForm.e" placeholder="请输入门店地址" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店用户名 :">
              <el-input v-model="dataForm.f" placeholder="请输入门店用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="应用版本 :">
              <el-select
                placeholder="专业版"
                v-model="dataForm.g"
                style="width: 100%"
              >
                <el-option label="专业版" value="专业版"></el-option>
                <el-option label="企业版" value="企业版"></el-option>
                <el-option label="旗舰版" value="旗舰版"></el-option>
              </el-select>
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
import moment from "moment";
export default {
  name: "StoreMgt",
  data() {
    return {
      disabled: true,
      title: "",
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [
        {
          a: "重庆库克科技有限公司",
          b: "黄瑶",
          c: "15213025532",
          d: "重庆江北区东原中心2号楼1303 ",
          e: "重庆库克科技有限公司",
          f: "15213025532",
          g: "张涛",
          h: "库克科技",
          i: "专业版",
          j: "Wed Mar 25 2020 10:39:52 GMT+0800 (GMT+08:00)",
          k: "Wed Mar 25 2020 10:39:52 GMT+0800 (GMT+08:00)",
          l: "852",
          m: "关闭",
        },
      ],
      // 总条数
      total: 100,
      // 是否显示新建/维护门店
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
  methods: {
    // 处理时间显示
    carTimeFilter(row, column, cellValue, index) {
      return moment(cellValue).format("YYYY-MM-DD");
    },
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
    /** 新增按钮操作 */
    handleAdd() {
      this.title = "新增门店";
      this.open = true;
    },
    // 维护按钮
    handleUpdate() {
      this.title = "门店维护";
      this.open = true;
    },
    // 关闭按钮
    handleClose() {
      this.dataForm = {};
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
    lockBtn(row) {
      console.log(row)
      this.$message({
          message: '已成功锁定',
          type: 'success'
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
<style lang="scss" scoped>
  ::v-deep .el-dialog__body{
  border-top: 1px solid rgb(223,228,237);
  border-bottom: 1px solid rgb(223,228,237);
}
</style>