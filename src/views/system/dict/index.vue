<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item prop="Filter" label="词典名称">
        <el-input v-model="queryParams.parameter.dictName" placeholder="请输入词典名称" clearable style="width: 240px"
          @keyup.enter.native="getList" />
      </el-form-item>

      <el-form-item label="词典类型" prop="status">
        <el-select v-model="queryParams.parameter.dictType" placeholder="用户状态" clearable style="width: 240px"
          @keyup.enter.native="getList">
          <el-option label="支付方式" value="payWay"></el-option>
        </el-select>
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
      <el-table-column label="词典类型" align="center" prop="dictType">
        <template slot-scope="scope">
          <div>
            {{ payWayObj[scope.row.dictType] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="词典名称" align="center" prop="name" />
      <el-table-column label="词典值" align="center" prop="value" :show-overflow-tooltip="true" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']">修改</el-button>

          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" @close="handleClose" width="600px" append-to-body>
      <el-form ref="formData" :model="formData" :rules="rules" label-width="120px" style="padding-left: 29px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="词典类型 :" prop="dictType">
              <el-select placeholder="请选择词典类型" v-model="formData.dictType" style="width: 100%">
                <el-option label="支付方式" value="payWay"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="拓展值 :" prop="expand">
              <el-input placeholder="请输入拓展值" v-model="formData.expand" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="词典名称 :" prop="name">
              <el-input placeholder="请输入词典名称" v-model="formData.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="词典值 :" prop="value">
              <el-input placeholder="请输入词典值" v-model="formData.value" />
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
  addDict, deleteDict, editDict, pageDictType
} from "@/api/system/dict";
export default {
  name: "Dict",
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
      payWayObj: {
        "payWay": '支付方式'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parameter: {
          dictName: null,
          dictType: null
        },
      },
      // 表单参数
      formData: {},
      // 表单校验
      rules: {
        dictType: [{ required: true, message: "请选择词典类型", trigger: "blur" }],
        expand: [
          { required: false},
        ],
        name: [
          { required: true, message: "请输入词典名称", trigger: "blur" },
        ],
        value: [{ required: true, message: "请输入词典值", trigger: "blur" }],
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
      if (this.queryParams.parameter.dictName == null && this.queryParams.parameter.dictType == null) {
        indexPage = this.queryParams.pageNum - 1
      }
      const queryParams = {
        pageIndex: indexPage,
        parameter: {
          dictName: this.queryParams.parameter.dictName,
          dictType: this.queryParams.parameter.dictType
        },
        size: this.queryParams.pageSize,
        sortField: null,
        sorting: null
      }
      pageDictType(queryParams).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.deptList = res.result.data
          this.total = parseInt(res.result.items)
          this.loading = false;
        }
      })
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.title = "新增词典";
      this.isAddData = true;
      this.open = true;

    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = "修改词典";
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
            addDict(this.formData).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('新增成功');
                this.open = false;
                this.getList()
                this.formData = {};
              }
            })
          } else {
            editDict(this.formData).then(res => {
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
          deleteDict(row.id).then(res => {
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
      this.queryParams.parameter = {
        dictName: null,
        dictType: null
      };
    },   // 关闭按钮
    handleClose() {
      this.formData = {};
    },
  },
};
</script>