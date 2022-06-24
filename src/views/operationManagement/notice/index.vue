<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="Filter">
        <el-input v-model="queryParams.Filter" placeholder="请输入标题" clearable style="width: 240px"
          @keyup.enter.native="getList" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:dict:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :data="deptList" height="537" v-loading="loading">
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="内容" align="center" prop="content" />
      <el-table-column label="显示开始时间" :formatter="carTimeFilter" align="center" prop="startDate" />
      <el-table-column label="显示结束时间" :formatter="carTimeFilter" align="center" prop="validDate" />
      <el-table-column label="状态" align="center" prop="isShow">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isShow" @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="nickName" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" :formatter="carTimeFilter" prop="createTime" width="180" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']">修改</el-button>

          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']">删除</el-button>
          <!-- <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="display">显示</el-dropdown-item>
              <el-dropdown-item command="hide">不显示</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" @close="handleClose" width="600px" append-to-body>
      <el-form ref="formData" :model="formData" :rules="rules" label-width="120px" style="padding-left: 29px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="标题 :" prop="title">
              <el-input placeholder="请输入标题" v-model="formData.title" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="显示开始日期 :" prop="startDate">
              <el-date-picker format="yyyy-MM-dd" v-model="formData.startDate" :style="{ width: '100%' }"
                placeholder="请选择开始日期" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="显示结束日期 :" prop="validDate">
              <el-date-picker format="yyyy-MM-dd" v-model="formData.validDate" :style="{ width: '100%' }"
                placeholder="请选结束日期" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="状态 :" prop="isShow">
              <el-radio-group size="medium" v-model="formData.isShow">
                <el-radio :label="true">显示</el-radio>
                <el-radio :label="false">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="通知内容 :">
              <el-input :autosize="{ minRows: 3, maxRows: 8 }" v-model="formData.content" type="textarea"
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
import {
  getPageNotice, addNotice, deleteNotice, editNotice, setIsShow
} from "@/api/operationManagement/notice";
import moment from "moment";
export default {
  name: "Notice",
  data() {
    return {
      isAddData: '',
      isShow: '',
      deptList: [],
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 是否显示弹出层
      open: false,
      title: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        Filter: "",
      },
      // 表单参数
      formData: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        startDate: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
        ],
        validDate: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
        isShow: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      var indexPage = 0
      if (this.queryParams.Filter == undefined) {
        indexPage = this.queryParams.pageNum - 1
      }
      const queryParams = {
        pageIndex: indexPage,
        size: this.queryParams.pageSize,
        parameter: this.queryParams.Filter,
      }
      getPageNotice(queryParams).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.deptList = res.result.data
          this.total = parseInt(res.result.items)
          this.loading = false;
        }
      })
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.title = "新增通知公告";
      this.isAddData = true;
      this.open = true;

    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = "修改通知公告";
      this.isAddData = false;
      this.formData = JSON.parse(JSON.stringify(row));
      this.open = true;
    },
    // 提交按钮
    submitForm() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          if (this.isAddData == true) {
            this.formData.sort = 0;
            this.formData.createBy = 0;
            this.formData.nickName = null;
            addNotice(this.formData).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('新增成功');
                this.open = false;
                this.getList()
                this.formData = {};
              }
            })
          } else {
            this.formData.validDate = new Date(this.formData.validDate).toISOString()
            this.formData.startDate = new Date(this.formData.startDate).toISOString()
            editNotice(this.formData).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('修改成功');
                this.open = false;
                this.getList()
                this.formData = {};
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
          deleteNotice(row.id).then(res => {
            if (res.type == 'success' && res.code == 200) {
              this.$message.success('删除成功');
              this.getList();
            }
          })
        })
    },
    // 隐藏/显示
    handleStatusChange(row) {
      const params = {
        teNotice: row.id,
        isShow: row.isShow
      }
      console.log(params)
      setIsShow(params).then(res => {
        if (res.type == 'success' && res.code == 200) {
          this.$message.success('设置成功');
          //this.getList();
        }
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.Filter = '';
    },   // 关闭按钮
    handleClose() {
      this.formData = {};
    },
    // 处理时间显示
    carTimeFilter(row, column, cellValue, index) {
      return moment(cellValue).format("YYYY-MM-DD");
    },
    //更多按钮触发操作
    /* handleCommand(command, row) {
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
    }, */
    //显示按钮
    /* display() {
      console.log("显示");
    },
    //隐藏按钮
    hide() {
      console.log("隐藏");
    }, */



  },
};
</script>