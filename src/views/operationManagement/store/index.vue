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
       <el-table-column
        prop="title"
        label="门店名称"
         fixed
       width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="门店联系人"
         fixed
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="门店电话"
         fixed
        width="100">
      </el-table-column>
      <el-table-column
        prop="address"
        label="门店地址"
        width="200">
      </el-table-column>
      <el-table-column
        prop="title"
        label="门店用户名"
        width="120">
      </el-table-column>

      <el-table-column
        prop="title"
        label="门店来源"
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="付款金额"
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="应用版本"
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="开通时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="有效期"
       width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="用户数量"
        width="80">
      </el-table-column>
      <el-table-column
        prop="title"
        label="状态"
        width="80">
      </el-table-column>
   

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="168">
        <template slot-scope="scope">
           <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-check"
          >审核</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-close"
          >锁定</el-button>

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
    <el-dialog :title="title" :visible.sync="open" width="600px" height="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-row>
          <el-col :span="20" >
            <el-form-item label="门店名称" prop="parentId" >
              <el-input v-model="form.store" placeholder="门店名称" />
            </el-form-item>
          </el-col>
        </el-row>   
        <el-row>
          <el-col :span="20" >
            <el-form-item label="门店联系人" prop="parentId" >
              <el-input  v-model="form.contacts" placeholder="彭于晏" />
            </el-form-item>
          </el-col>
        </el-row>      
        <el-row>
          <el-col :span="20" >
            <el-form-item label="门店电话" prop="parentId" >
              <el-input  v-model="form.phone" placeholder="136xxxxxxxxxxx" />
            </el-form-item>
          </el-col>
        </el-row> 
        <el-row>
          <el-col :span="20" >
            <el-form-item label="门店地址" prop="parentId" >
              <el-input  v-model="form.address" placeholder="北京市天安门大街" />
            </el-form-item>
          </el-col>
        </el-row> 
        <el-row>
          <el-col :span="20" >
            <el-form-item label="门店用户名" prop="parentId" >
              <el-input   v-model="form.userName" placeholder="门店用户名" />
            </el-form-item>
          </el-col>
        </el-row> 
        <el-row>
            <el-col :span="20">
          <el-form-item label="有效期限">
            <el-date-picker  format="yyyy-MM-dd" v-model="form.period" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择有效" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" >
            <el-form-item label="用户数量" prop="parentId" >
              <el-input v-model="form.quantity" placeholder="门店名称" />
            </el-form-item>
          </el-col>
        </el-row> 
   
         <el-row>
            <el-col :span="20">
          <el-form-item label="应用版本">
             <el-select v-model="form.edition" placeholder="请选择下拉选择" clearable :style="{width: '100%'}">
                 <el-option v-for="(item, index) in Options" :key="index" :label="item.label"
                  :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        </el-row>
       
      </el-form>
      <div style="height:60px"></div>


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
        Options: [{
        "label": "专业版",
        "value": 1
      }, {
        "label": "旗舰版",
        "value": 2
      }, {
        "label": "企业版",
        "value": 3
      }],
        total:1,
        banben:'',
         sta:'',
           tableData: [{
            title:'今日说法',
            stime:'2021-11-12',
            etime:'2022-05-12',
            status:'1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
  
          }, {
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
          store:'',
          period:'',
          contacts:'',
          phone:'',
          address:'',
          userName:'',
          quantity:'',
          edition:''
      },
      // 表单校验
      rules: {
        store: [
          { required: true, message: "门店名称不能为空", trigger: "blur" }
        ],
        period: [
          { required: true, message: "有效期限不能为空", trigger: "blur" }
        ],
        contacts: [
          { required: true, message: "门店联系人能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "门店电话不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "门店地址不能为空", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "门店用户名不能为空", trigger: "blur" }
        ],
        quantity: [
          { required: true, message: "用户数量不能为空", trigger: "blur" }
        ],
        edition: [
          { required: true, message: "应用版本不能为空", trigger: "blur" }
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