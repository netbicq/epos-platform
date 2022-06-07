<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入标题" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:dict:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
    </el-row>

    <el-table :data="tableData" height="600">
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="显示开始时间" align="center" prop="stime" :show-overflow-tooltip="true" />
      <el-table-column label="显示结束时间" align="center" prop="etime" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="创建人" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="date" width="180" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']">修改</el-button>

          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']">删除</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="display">显示</el-dropdown-item>
              <el-dropdown-item command="hide">不显示</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" @close="handleClose" width="600px" append-to-body>
      <el-form ref="form" :model="formData" :rules="rules" label-width="120px" style="padding-left: 29px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="标题 :" prop="title">
              <el-input placeholder="请输入标题" v-model="formData.title" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="显示开始日期 :" prop="StartDate">
              <el-date-picker format="yyyy-MM-dd" v-model="formData.StartDate" value-format="yyyy-MM-dd"
                :style="{ width: '100%' }" placeholder="请选择开始日期" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="显示结束日期 :" prop="endDate">
              <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="formData.endDate"
                :style="{ width: '100%' }" placeholder="请选结束日期" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="状态 :" prop="state">
              <el-radio-group size="medium" v-model="formData.state">
                <el-radio label="Y">显示</el-radio>
                <el-radio label="N">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="通知内容 :">
              <el-input :autosize="{ minRows: 3, maxRows: 8 }" v-model="formData.con" type="textarea"
                placeholder="请输入通知内容" />
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
export default {
  name: "Notice",
  dicts: ["sys_normal_disable"],
  data() {
    return {
      tableData: [
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          title: "今日说法",
          stime: "2021-11-12",
          etime: "2022-05-12",
          status: "1",
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 100,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: "",
      },
      // 表单参数
      formData: {
        title: "",
        StartDate: "",
        state: "",
        endDate: "",
        con: ''
      },
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        StartDate: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
        ],
        endDate: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
        state: [{ required: true, message: "状态不能为空", trigger: "blur" }],
      },
    };
  },
  //   created() {
  //     this.getList();
  //   },
  methods: {
    /** 查询字典类型列表 */

    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      console.log(this.queryParams);
      this.queryParams.pageNum = 1;

    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.title = "新增通知公告";
      this.open = true;

    },
    // 关闭按钮
    handleClose() {
      this.formData = {};
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = "修改通知公告";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.open = false;
      this.formData = {};
    },

    //更多按钮触发操作
    handleCommand(command, row) {
      switch (command) {
        case "display":
          this.display(row);
          break;
        case "hide":
          this.hide(row);
          break;
        default:
          break;
      }
    },
    //显示按钮
    display() {
      console.log("显示");
    },
    //隐藏按钮
    hide() {
      console.log("隐藏");
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids;
    },

    // 删除按钮
    handleDelete(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>