<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item>
        <el-select
          v-model="queryParams.status"
          placeholder="正常"
          style="width: 80px"
        >
          <el-option label="正常" value="正常"></el-option>
          <el-option label="已分配" value="已分配"></el-option>
          <el-option label="维修" value="维修"></el-option>
          <el-option label="回收" value="回收"></el-option>
          <el-option label="报废" value="报废"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.type"
          placeholder="智能插座"
          style="width: 120px"
        >
          <el-option label="智能插座" value="智能插座"></el-option>
          <el-option label="控制箱" value="控制箱"></el-option>
          <el-option label="呼叫器" value="呼叫器"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="deptName">
        <el-input
          v-model="queryParams.Filter"
          placeholder="请输入设备ID"
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
      <el-table-column prop="a" label="设备ID"></el-table-column>
      <el-table-column prop="b" label="设备名称"></el-table-column>
      <el-table-column prop="c" label="设备类型"> </el-table-column>
      <el-table-column label="所属门店" prop="d"> </el-table-column>
      <el-table-column prop="e" label="状态"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="maintain()"
            >修改</el-button
          >
          <el-button size="mini" type="text" icon="el-icon-delete"
            >删除</el-button
          >
          <el-dropdown
            size="mini"
            @command="(command) => handleCommand(command, scope.row)"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="deviceSettings"
                >设置设备</el-dropdown-item
              >
              <el-dropdown-item command="deviceAllocation"
                >分配设备</el-dropdown-item
              >
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

    <!-- 设备设置 -->
    <el-dialog
      title="设备设置"
      :visible.sync="isDeviceSettings"
      width="600px"
      @close="handleClose"
      append-to-body
    >
      <el-form
        ref="setUpForm"
        :model="setUpForm"
        :rules="rules"
        label-width="100px"
        style="padding-left:29px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="设备ID">
              <el-input v-model="setUpForm.a" disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="设备名称">
              <el-input v-model="setUpForm.b" disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="设备类型">
              <el-select
                placeholder="智能插座"
                style="width: 100%"
                v-model="setUpForm.c"
                disabled="disabled"
              >
                <el-option label="智能插座" value="智能插座"></el-option>
                <el-option label="控制箱" value="控制箱"></el-option>
                <el-option label="呼叫器" value="呼叫器"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="所属门店">
              <el-input v-model="setUpForm.d" disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="状态">
              <el-select
                placeholder="正常"
                v-model="setUpForm.e"
                style="width: 100%"
              >
                <el-option label="正常" value="正常"></el-option>
                <el-option label="已分配" value="已分配"></el-option>
                <el-option label="维修" value="维修"></el-option>
                <el-option label="回收" value="回收"></el-option>
                <el-option label="报废" value="报废"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设备维护 -->
    <el-dialog
      :title="title"
      :visible.sync="isMaintain"
      width="600px"
      @close="handleClose"
      append-to-body
    >
      <el-form
        ref="maintainForm"
        :model="maintainForm"
        :rules="rules"
        label-width="100px"
        style="padding-left:29px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="设备ID">
              <el-input v-model="maintainForm.a" placeholder="请输入设备ID" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="设备名称">
              <el-input v-model="maintainForm.b" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="设备类型">
              <el-select
                v-model="maintainForm.c"
                placeholder="智能插座"
                style="width: 100%"
              >
                <el-option label="智能插座" value="智能插座"></el-option>
                <el-option label="控制箱" value="控制箱"></el-option>
                <el-option label="呼叫器" value="呼叫器"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="所属门店">
              <el-input v-model="maintainForm.d" placeholder="请输入门店" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="maintainSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设备分配 -->
    <el-dialog
      title="设备分配"
      @close="handleClose"
      :visible.sync="allocation"
      width="450px"      
      append-to-body
    >
      <el-form
        ref="allocationForm"
        :model="allocationForm"
        :rules="rules"
        label-width="100px"
        style="padding-left:29px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="设备ID">
              <el-input v-model="allocationForm.a" disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="设备名称">
              <el-input
                v-model="allocationForm.b"
                disabled="disabled"               
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="设备类型">
              <el-select
                v-model="allocationForm.c"
                placeholder="智能插座"
                style="width: 100%"
                disabled="disabled"
              >
                <el-option label="智能插座" value="智能插座"></el-option>
                <el-option label="控制箱" value="控制箱"></el-option>
                <el-option label="呼叫器" value="呼叫器"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="所属门店">
              <el-select
                v-model="allocationForm.d"
                filterable
                placeholder="请选择所属门店"
                style="width: 100%"
              >
                <el-option label="A店" value="A店"></el-option>
                <el-option label="B店" value="B店"></el-option>
                <el-option label="C店" value="C店"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="allocationSubmit">确 定</el-button>
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

export default {
  name: "Dept",
  dicts: ["sys_normal_disable"],
  components: { Treeselect },
  data() {
    return {
      disabled:true,
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [
        {
          a: "6212262201023557228",
          b: "智能插座",
          c: "智能插座",
          d: "A店",
          e: "正常",
        },
      ],
      title: "",
      // 总条数
      total: 100,
      // 是否设置设备
      isDeviceSettings: false,
      // 是否显示设备维护
      isMaintain: false,
      // 是否显示设备分配
      allocation: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        Filter: "",
        status:'',
        type:''
      },
      // 设置设备表单参数
      setUpForm: {},
      // 设备维护表单参数
      maintainForm: {},
      // 设备分配表单参数
      allocationForm: {},
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
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams=  {
        pageNum: 1,
        pageSize: 10,
        Filter: "",
        status:'',
        type:''
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      console.log(this.queryParams);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.isMaintain = true;
      this.title = "新增设备";
    },
    // 关闭叉叉
    handleClose() {
      this.setUpForm = {};
      this.maintainForm = {};
      this.allocationForm = {};
    },
    //打开设置通道
    deviceSettings() {
      this.isDeviceSettings = true;
    },
    // 打开设备维护
    maintain() {
      this.isMaintain = true;
      this.title = "设备维护";
    },
    // 打开设备分配
    deviceAllocation() {
      this.allocation = true;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "deviceSettings":
          this.deviceSettings(row);
          break;
        case "deviceAllocation":
          this.deviceAllocation(row);
          break;
        default:
          break;
      }
    },
    // 确认设置设备
    submitForm() {
      console.log(this.setUpForm);
      this.setUpForm = {};
      this.isDeviceSettings = false;
    },
    // 确认设备维护
    maintainSubmit() {
      console.log(this.maintainForm);
      this.isMaintain = false;
      this.maintainForm = {};
    },
    // 确认设备分配
    allocationSubmit() {
      console.log(this.allocationForm);
      this.allocation = false;
      this.allocationForm = {};
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
