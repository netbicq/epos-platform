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
      <right-toolbar
        :showSearch.sync="showSearch"
      ></right-toolbar>
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
      <el-table-column prop="a" fixed label="经销商名称" width="150"></el-table-column>
      <el-table-column
        prop="b"
        label="经销商联系人"
        width="120"
        fixed
        align="center"
      ></el-table-column>
      <el-table-column prop="c" label="经销商联系电话" fixed width="140" align="center">
      </el-table-column>
      <el-table-column label="购买版本" width="100" prop="L" align="center">
      </el-table-column>
      <el-table-column label="购买数量" width="100" prop="d" align="center">
      </el-table-column>
      <el-table-column
        prop="e"
        width="120"
        label="购买金额"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="f"
        label="支付方式"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="g"
        label="购买时间"
        :formatter="carTimeFilter"
        width="140"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="h" label="合同号" width="180"></el-table-column></el-table-column>
      <el-table-column prop="j" label="备注"></el-table-column>
      <el-table-column
        prop="k"
        label="状态"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="modifyBtn">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete"  @click="deleteBtn">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-finished" @click="checkBtn">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    />

    <!-- 购买记录维护 -->
    <el-dialog
      :title="titlt"
      @close="handleClose"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="dataForm"
        :rules="rules"
        label-width="100px"
        style="padding-left: 29px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="经销商名称">
              <el-select
                placeholder="请选择经销商"
                filterable
                v-model="dataForm.a"
                style="width: 100%"
              >
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
                <el-option label="5" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="经销商联系人">
              <el-input v-model="dataForm.b" disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="dataForm.c" disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="购买版本">
              <el-select
                placeholder="专业版"
                v-model="dataForm.k"
                style="width: 100%"
              >
                <el-option label="专业版" value="专业版"></el-option>
                <el-option label="企业版" value="企业版"></el-option>
                <el-option label="旗舰版" value="旗舰版"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="购买数量">
              <el-input v-model="dataForm.d" placeholder="请输入购买数量" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="购买金额">
              <el-input v-model="dataForm.e" placeholder="请输入购买金额" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="支付方式">
              <el-select
                placeholder="请选择支付方式"
                v-model="dataForm.f"
                style="width: 100%"
              >
                <el-option label="微信" value="微信"></el-option>
                <el-option label="支付宝" value="支付宝"></el-option>
                <el-option label="个人银行" value="个人银行"></el-option>
                <el-option label="对公银行" value="对公银行"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="购买时间">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="dataForm.g"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="合同号">
              <el-input v-model="dataForm.h" placeholder="请输入合同号" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input
                v-model="dataForm.i"
                type="textarea"
                placeholder="请输入备注"
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
      titlt: "",
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
          d: "100",
          e: "3000",
          f: "银行卡",
          g: "Wed Mar 25 2020 10:39:52 GMT+0800 (GMT+08:00)",
          h: "6212262201023557228",
          j: "打钱",
          k: "激活",
          L:" 专业版"
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
      this.open = false;
      this.dataForm = {};
      console.log(this.dataForm);
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
      this.open = true;
    },
    // 关闭按钮
    handleClose() {
      this.dataForm = {};
    },
    // 修改按钮
    modifyBtn() {
      this.titlt = "购买记录维护";
      this.open = true;
    },
    // 审核按钮
    checkBtn() {},
    // 删除按钮
    deleteBtn() {},
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
