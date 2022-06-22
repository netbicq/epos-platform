<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item prop="edition">
        <el-select v-model="queryParams.edition" placeholder="请选择版本" clearable :style="{ width: '100%' }">
          <el-option v-for="(val, key, index) in  fieldptions" :label="val" :value="key" :key="index">
          </el-option>
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

    <el-table :data="tableData" size="medium" v-loading="loading" height="537">
      <el-table-column label="策略名称" align="center" prop="name" />
      <el-table-column label="开始日期" :formatter="carTimeFilter" align="center" prop="startDate" />
      <el-table-column label="结束日期" :formatter="carTimeFilter" align="center" prop="validDate" />
      <el-table-column label="是否促销" align="center" prop="isHotsale">
        <template slot-scope="scope">
          <div v-text="isHotsale[scope.row.isHotsale]"></div>
        </template>
      </el-table-column>
      <el-table-column label="应用版本" align="center" prop="editionType">
        <template slot-scope="scope">
          <div v-text="fieldptions[scope.row.editionType]"
           slot="reference" class="editionTypeStrBgc" 
           :class="scope.row.editionType">
          </div>
        </template>
        
      </el-table-column>
      <el-table-column label="价格类别" align="center" prop="priceType">
        <template slot-scope="scope">
          <div v-text="priceType[scope.row.priceType]"></div>
        </template>
      </el-table-column>
      <el-table-column label="经销商价格" align="center" prop="agencyPrice" />
      <el-table-column label="零售价格" align="center" prop="tenantPrice" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']">修改</el-button>

          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="1" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" @close="handleClose" :visible.sync="open" width="600px" height="540px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="padding-left:29px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="策略名称 :" prop="name">
              <el-input placeholder="请输入标题" v-model="form.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="显示开始日期 :" prop="startDate">
              <el-date-picker  v-model="form.startDate" 
                :style="{ width: '100%' }" placeholder="请选择开始日期" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="显示结束日期 :" prop="validDate">
              <el-date-picker  v-model="form.validDate"
                :style="{ width: '100%' }" placeholder="请选结束日期" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-form-item label="是否促销 :" prop="isHotsale">
              <el-radio-group size="medium" v-model="form.isHotsale">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="应用版本 :" prop="editionType">
              <el-select v-model="form.editionType" placeholder="请选择版本" clearable :style="{ width: '100%' }">
                <el-option v-for="(val, key, index) in  fieldptions" :label="val" :value="key" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-form-item label="价格类别 :" prop="priceType">
              <el-radio-group size="medium" v-model="form.priceType" placeholder="请选择价格类别">
                <el-radio label="REGISTER">开户</el-radio>
                <el-radio label="YEAR">年度</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="经销商价格 :" prop="agencyPrice">
              <el-input placeholder="请输入经销商价格" v-model="form.agencyPrice" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="零售价格 :" prop="tenantPrice">
              <el-input placeholder="请输入零售价格" v-model="form.tenantPrice" />
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
  addPricePolicy, editPricePolicy, deletePricePolicy, getPagePricePolicy
} from "@/api/operationManagement/strategy";
import moment from "moment";
export default {
  name: "Strategy",
  data() {
    return {
      isAddData: '',
      total: 1,
      title: '',
      fieldptions: {
        "Basic": "专业版",
        "Professional": '企业版',
        "Enterprise": '旗舰版'
      },
      priceType: {
        "REGISTER": "开户",
        "YEAR": "年度"
      },
      isHotsale: {
        "true": "是",
        "false": "否",
      },
      tableData: [],
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
        edition: ''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "策略名称不能为空", trigger: "blur" }],
        startDate: [{ required: true, message: "开始时间不能为空", trigger: "blur" },],
        validDate: [{ required: true, message: "结束时间不能为空", trigger: "blur" },],
        isHotsale: [{ required: true, message: "请选择是否促销", trigger: "blur" }],
        editionType: [{ required: true, message: "请选择应用版本", trigger: "blur" }],
        priceType: [{ required: true, message: "请选择价格类别", trigger: "blur" }],
        agencyPrice: [{ required: true, message: "经销商不能为空", trigger: "blur" }],
        tenantPrice: [{ required: true, message: "零售不能为空", trigger: "blur" }],
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
      if (this.queryParams.edition == undefined) {
        indexPage = this.queryParams.pageNum - 1
      }
      const queryParams = {
        pageIndex: indexPage,
        size: this.queryParams.pageSize,
        parameter: this.queryParams.edition,
      }
      getPagePricePolicy(queryParams).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.tableData = res.result.data
          this.total = parseInt(res.result.items)
          this.loading = false;
        }
      })
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.title = "新增售价策略";
      this.isAddData = true;
      this.open = true;
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row)
      this.title = "修改售价策略";
      this.isAddData = false;
      this.form = JSON.parse(JSON.stringify(row));
      this.open = true;
    },
    // 提交按钮
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.isAddData == true) {
            addPricePolicy(this.form).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('新增成功');
                this.open = false;
                this.getList()
                this.form = {};
              }
            });
          } else {
            this.form.validDate = new Date(this.form.validDate).toISOString()
            this.form.startDate = new Date(this.form.startDate).toISOString()
            editPricePolicy(this.form).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('修改成功');
                this.open = false;
                this.getList()
                this.form = {};
              }
            });
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePricePolicy(row.id).then(res => {
            if (res.type == 'success' && res.code == 200) {
              this.$message.success('删除成功');
              this.getList();
            }
          })
        })
    },
    // 关闭按钮
    handleClose() {
      this.form = {};
    },
    // 处理时间显示
    carTimeFilter(row, column, cellValue, index) {
      return moment(cellValue).format("YYYY-MM-DD");
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.edition = ''
    },
  },
};
</script>
<style lang="scss" scoped>
.editionTypeStrBgc {
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
}
.Enterprise {
  background-color: #e8f4ff;
  border-color: #d1e9ff;
  color: #1890ff;
}

.Basic {
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
}

.Professional {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}
</style>