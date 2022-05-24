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
      <!-- @queryTable="getList" -->
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
        width="200"
        fixed
        label="经销商名称"
      ></el-table-column>
      <el-table-column
        prop="b"
        label="联系人"
        fixed
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="c"
        label="联系电话"
        fixed
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column label="银行账号" prop="d" width="180"> </el-table-column>
      <el-table-column
        prop="e"
        label="银行开户名"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column prop="f" label="开户银行" width="180"></el-table-column>
      <el-table-column
        prop="g"
        label="云通道"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="h"
        label="经销商账号"
        width="120"
      ></el-table-column>
      <el-table-column
        label="门店剩余数量"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="dealerBalance()"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="j" label="备注"></el-table-column>
      <el-table-column
        prop="k"
        label="状态"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="200"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="maintainBtn"
            >修改</el-button
          >
          <el-button size="mini" type="text" icon="el-icon-lock"
            >锁定</el-button
          >
          <el-dropdown
            size="mini"
            @command="(command) => handleCommand(command, scope.row)"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>重置密码</el-dropdown-item>
              <el-dropdown-item command="addPassage">设置通道</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    />

    <!-- 添加维护经销商 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      @close="handleClose"
      append-to-body
    >
      <el-form
        ref="form"
        :model="openForm"
        :rules="rules"
        label-width="100px"
        style="padding-left: 29px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="经销商名称">
              <el-input v-model="openForm.a" placeholder="请输入经销商名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="联系人">
              <el-input v-model="openForm.b" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="openForm.c" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="银行账号">
              <el-input v-model="openForm.d" placeholder="请输入银行账号" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="银行开户名">
              <el-input v-model="openForm.e" placeholder="请输入银行开户名" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="开户银行">
              <el-input v-model="openForm.f" placeholder="请输入开户银行" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="经销商账号">
              <el-input v-model="openForm.g" placeholder="请输入经销商账号" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="门店数量">
              <el-input v-model="openForm.h" placeholder="请输入门店数量" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                v-model="openForm.j"
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
    <!-- 添加设置通道 -->
    <el-dialog
      title="设备通道"
      :visible.sync="openPassage"
      width="600px"
      @close="handleClose"
      append-to-body
    >
      <el-form
        ref="form"
        :model="passageForm"
        :rules="rules"
        style="padding-left: 29px"
        label-width="100px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="经销商名称">
              <el-input
                v-model="passageForm.a"
                disabled="disabled"                
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="云通道">
              <el-select
                placeholder="请选择云通道"
                v-model="passageForm.b"
                style="width: 100%"
              >
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
    <el-dialog
      title="经销商余额"
      @close="handleClose"
      :visible.sync="openDealer"
      width="550px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="dealerForm"
        :rules="rules"
        label-width="100px"
        style="padding-left: 29px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="经销商名称">
              <el-input
                v-model="dealerForm.a"
                disabled="disabled"                
              />
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
import {
  listDept,
  getDept,
  delDept,
  addDept,
  updateDept,
  listDeptExcludeChild,
} from "@/api/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "DealerMgt",
  data() {
    return {
      disabled: "true",
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
          d: "6212262201023557228",
          e: "黄瑶",
          f: "中国邮政储蓄银行重庆市渝中区中兴路营业所",
          g: "华东",
          h: "15213025532",
          i: "55",
          j: "打钱",
          k: "激活",
        },
      ],
      // 总条数
      total: 100,
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
        pageNum: 1,
        pageSize: 10,
        Filter: "",
      },
      // 维护经销商表单参数
      openForm: {},
      // 设备通道表单参数
      passageForm: {},
      // 经销商余额表单参数
      dealerForm: {},
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
      this.title = "新增经销商";
      this.open = true;
    },
    // 打开设置通道
    addPassage() {
      this.openPassage = true;
    },
    // 关闭叉叉
    handleClose() {
      this.openForm = {};
      this.passageForm = {};
      this.dealerForm = {};
    },
    // 查看经销商余额
    dealerBalance() {
      this.openDealer = true;
    },
    // 提交新增维护经销商按钮
    submitForm() {
      this.openForm = {};
      this.open = false;
      console.log(this.openForm);
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
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "addPassage":
          this.addPassage(row);
          break;
        case "handleAuthUser":
          this.handleAuthUser(row);
          break;
        default:
          break;
      }
    },
    // 修改按钮
    maintainBtn() {
      (this.title = "维护经销商"), (this.open = true);
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
