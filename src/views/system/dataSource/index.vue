<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="数据源策略" name="first">
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
        <!-- 新增数据源策略 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="modifyBtn(true)"
              v-hasPermi="['system:dept:add']"
              >新增</el-button
            >
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
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
          <el-table-column
            prop="name"
            width="260"
            label="名称"
          ></el-table-column>
          <el-table-column
            prop="writeSourceId"
            width="300"
            label="写库"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="readSourceId"
            width="300"
            label="读库"
            align="center"
          >
          </el-table-column>
          <el-table-column label="备注" prop="remark"> </el-table-column>
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
                @click="modifyBtn(scope.row, false)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row, true)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
        />
      </el-tab-pane>

      <el-tab-pane label="数据源管理" name="second">
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
        <!-- 新增数据源 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="addManagementForm('', true)"
              v-hasPermi="['system:dept:add']"
              >新增</el-button
            >
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>
        <el-table
          height="600"
          v-if="refreshTable"
          v-loading="loading"
          :data="managementList"
          row-key="deptId"
          :default-expand-all="isExpandAll"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            prop="name"
            width="120"
            label="名称"
          ></el-table-column>
          <el-table-column
            prop="driverClassName"
            width="230"
            label="数据驱动名"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="urlPrepend"
            width="300"
            label="连接地址"
            align="center"
          >
          </el-table-column>
          <el-table-column label="连接参数" width="350" prop="urlAppend">
          </el-table-column>
          <el-table-column label="用户名" prop="username"> </el-table-column>
          <el-table-column label="密码" prop="password"> </el-table-column>
          <el-table-column label="备注" prop="remark"> </el-table-column>
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
                @click="addManagementForm(scope.row, false)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row, false)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 维护数据源策略 -->
    <el-dialog
      :title="dataTitle"
      @close="handleClose"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="rules"
        label-width="110px"
        style="padding-left: 29px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="名称 :">
              <el-input v-model="dataForm.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="写库 :">
              <el-select
                v-model="dataForm.writeSourceId"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in managementList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="读库 :">
              <el-select
                v-model="dataForm.readSourceId"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in managementList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注 :">
              <el-input
                type="textarea"
                v-model="dataForm.remark"
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

    <!-- 维护数据源管理 -->
    <el-dialog
      :title="managementTitle"
      @close="handleClose"
      :visible.sync="managementOpen"
      width="600px"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :model="managementForm"
        :rules="rules"
        label-width="110px"
        style="padding-left: 29px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="名称 :">
              <el-input
                v-model="managementForm.name"
                placeholder="请输入名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="数据驱动名 :">
              <el-input
                v-model="managementForm.driverClassName"
                placeholder="请输入数据驱动名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="连接地址 :">
              <el-input
                v-model="managementForm.urlPrepend"
                placeholder="请输入连接地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="连接参数 :">
              <el-input
                v-model="managementForm.urlAppend"
                placeholder="请输入连接参数"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="22">
            <el-form-item label="银行开户名 :">
              <el-input
                v-model="managementForm.e"
                placeholder="请输入银行开户名"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="22">
            <el-form-item label="用户名 :">
              <el-input
                v-model="managementForm.username"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="密码 :">
              <el-input
                v-model="managementForm.password"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注 :">
              <el-input
                type="textarea"
                v-model="managementForm.remark"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitManagementForm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
 addDataSource,getStrategyData,getSourceData,addStrategyData,deleteDataSource,deleteStrategyData,editDataSource,editStrategyData
} from "@/api/system/dataSource";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Dept",
  dicts: ["sys_normal_disable"],
  components: { Treeselect },
  data() {
    return {
      isAddDataSource:'',
      activeName: "first",
      dataTitle: "",
      managementTitle: "",
      disabled: true,
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 数据源策略
      deptList: [],
      // 数据源数据
      managementList: [],
      dataForm: {},
      managementForm: {},
      editDataSourceID:'',
      // 总条数
      total: 100,
      managementOpen: false,
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
  created() {
    this.getList();
  },
  methods: {
    getList() {
      /* this.loading = true; */
      getStrategyData().then(res => {
        this.deptList=res.result
      });
      getSourceData().then(res => {
        this.managementList=res.result
      });
    },
    
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.Filter = "";
    },
    /** 搜索按钮操作 */
    handleQuery() {
      console.log(this.queryParams);
    },
    /** 新增/修改按钮操作 */
    modifyBtn(row,flag) {
      this.isAddDataSource=flag
      if (flag === true) {
        this.dataTitle = "新增数据源策略";
      } else {
        this.dataTitle = "维护数据源策略";
        this.dataForm = JSON.parse(JSON.stringify(row));   
      }
      this.open = true;
    },
    addManagementForm(row,flag) {      
      this.isAddDataSource=flag
      if (flag === true) {
        this.managementTitle = "新增数据源";
      } else {
        this.managementTitle = "维护数据源";
        this.managementForm = JSON.parse(JSON.stringify(row));        
      }
      this.managementOpen = true;
    },
    // 提交数据源管理
    submitManagementForm() {
      if(this.isAddDataSource===true){
      addDataSource(this.managementForm).then(res => {
      this.managementOpen = false;
      this.managementForm = {};
      this.getList();      
       }); 
      }else{          
      delete this.managementForm.createTime;  
      delete this.managementForm.sort;   
      delete this.managementForm.createBy;   
      delete this.managementForm.updateBy;   
      delete this.managementForm.updateTime;   
      editDataSource(this.managementForm).then(res => {
      this.managementOpen = false;  
      this.managementForm = {};
      this.getList();
       }); 
      }      
    },
    // 提交数据源策略
    submitForm() {
      if(this.isAddDataSource===true){
      addStrategyData(this.dataForm).then(res => {
        this.open = false;
        this.dataForm = {};
      });
      }else{   
        delete this.dataForm.sort;          
      editStrategyData(this.dataForm).then(res => {
      this.open = false;  
      this.dataForm = {};
      this.getList();
       }); 
      }      
    },
    /** 删除按钮操作 */
    handleDelete(row,flag) {      
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if(flag===true){
            deleteStrategyData(row.id).then(res => {
           this.$message({
            type: "success",
            message: "删除成功!",
          });
           this.getList();
         });
         }else{
           deleteDataSource(row.id).then(res => {
           this.$message({
            type: "success",
            message: "删除成功!",
          });
           this.getList();
         });
         }         
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 关闭按钮
    handleClose() {
      this.dataForm = {};
      this.managementForm={}
    },
  },
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.pagination-container {
  ::v-deep .el-pagination {
    top: 0;
  }
}
</style>
