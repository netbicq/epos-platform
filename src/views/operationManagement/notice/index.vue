<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="门店名称" prop="dictName">
        <el-input
          v-model="queryParams.dictName"
          placeholder="请输入门店名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['system:dict:add']"
        >新增</el-button>
      </el-col>

     
    </el-row>

    <el-table :data="tableData" @selection-change="handleSelectionChange" height="600">
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="显示开始时间" align="center" prop="stime" :show-overflow-tooltip="true" />
      <el-table-column label="显示结束时间" align="center" prop="etime" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" prop="status"/> 
      <el-table-column label="创建人" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="date" width="180"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']"
          >修改</el-button>
           
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
          >删除</el-button>
          <el-dropdown size="mini">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  icon="el-icon-circle-check" >显示</el-dropdown-item>
              <el-dropdown-item icon="el-icon-user">不显示</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
         
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="1"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" height="540px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-row>
          <el-col :span="20" >
            <el-form-item label="标题" prop="parentId" >
              <el-input  placeholder="请输入标题" v-model="form.title" />
            </el-form-item>
          </el-col>
        </el-row>        
        <el-row>
            <el-col :span="20">
          <el-form-item label="显示开始日期">
            <el-date-picker  format="yyyy-MM-dd" v-model="form.StartDate" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择开始日期" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        </el-row>
         <el-row>
            <el-col :span="20">
          <el-form-item label="显示结束日期">
            <el-date-picker  format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.endDate"
              :style="{width: '100%'}" placeholder="请选结束日期" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        </el-row>
         <el-row>
            <el-col :span="20">
          <el-form-item label="状态">
            <el-radio-group  size="medium" v-model="form.state">
              	<el-radio  label="sta1">显示</el-radio>
                <el-radio  label="sta2">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        </el-row>
       
      </el-form>
      <div style="height:240px"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <!-- <el-button @click="cancel">取 消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listType, getType, delType, addType, updateType, refreshCache } from "@/api/system/dict/type";

export default {
  name: "Dict",
  dicts: ['sys_normal_disable'],
  data() {
      
    return {
        total:1,

          tableData: [{
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, 
          {
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },{
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },],
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
      total: 0,
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
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单参数
      form: {
          title:'',
          StartDate:'',
          state:'',
          endDate:'',
      },
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        StartDate: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ]
      }
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
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "门店维护";
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
       this.reset();
      this.open = true;
      this.title = "门店维护";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictId != undefined) {
            updateType(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids;
      this.$modal.confirm('是否确认删除字典编号为"' + dictIds + '"的数据项？').then(function() {
        return delType(dictIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$modal.msgSuccess("刷新成功");
      });
    }
  }
};
</script>