<template>
  <div class="app-container">
    <!-- <i class="iconfont">&#xe60a;</i> -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="Filter">
        <el-input v-model="queryParams.Filter" placeholder="请输入菜单关键字" clearable style="width: 240px"
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
      <el-table-column label="名称" align="center" prop="name" width="130" />
      <el-table-column label="标题" align="center" prop="title" width="130" />
      <el-table-column label="路由组件" align="center" prop="component" width="200" />
      <el-table-column label="客户端拓展" align="center" prop="clientEx" width="150" />
      <el-table-column label="类型" align="center" prop="menuType" width="180">
        <template slot-scope="scope">
          <div class="editionTypeStrBgc" :class="scope.row.menuType">
            {{ menuType[scope.row.menuType] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="权限key" align="center" prop="perms" :show-overflow-tooltip="true" />
      <el-table-column label="模块" align="center" prop="module" width="180">
        <template slot-scope="scope">
          <div class="editionTypeStrBgc" :class="scope.row.module">
            {{ lockStatusObj[scope.row.module] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center" prop="icon" width="50">
        <template slot-scope="scope">
          <i slot="prefix" class="iconfont" :class="scope.row.icon" style="font-size: 20px;"></i>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" width="180" />
      <el-table-column label="备注" align="center" prop="remark" width="180" />
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-plus" @click="addChildMenu(scope.row)">新增</el-button>

          <el-popover placement="bottom" width="100" trigger="click">
            <div style="display: flex;align-items: center;">
              <el-input-number size="mini" v-model="num" @change="handleChange" :min="1" :max="10" label="描述文字">
              </el-input-number>

              <el-button type="text" size="mini" @click="confirmSorting(scope.row)" icon="el-icon-caret-right">确认
              </el-button>
            </div>
            <span class="el-dropdown-link" slot="reference">
              <i class="el-icon-s-data el-icon--right"></i>排序
            </span>
          </el-popover>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="checkBtn">修改</el-dropdown-item>
              <el-dropdown-item command="deleteRow">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" @close="handleClose" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="formData" :model="formData" :rules="rules" label-width="106px" style="padding-left: 29px">
        <el-row>
          <el-col :span="22" v-if="isAddChild">
            <el-form-item label="上级菜单 :">
              <el-input v-model="formData.parentName" disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="名称 :">
              <el-input v-model="formData.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="标题 :">
              <el-input v-model="formData.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="组件路由 :">
              <el-input v-model="formData.component" placeholder="组件路由" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="客户端拓展 :">
              <el-input v-model="formData.clientEx" placeholder="客户端拓展" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="权限key :" prop="phone">
              <el-input v-model="formData.perms" placeholder="请输入权限key" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="图标 :">
              <el-popover placement="bottom" width="400" trigger="click">
                <div class="iconForm">
                  <div class="iconFormItem" v-for="(item, index) in icon" :key="index" @click="selectIcon(index)">
                    <i slot="prefix" class="iconfont" :class="item" style="font-size: 20px;"></i>
                    <div>{{ item }}</div>
                  </div>
                </div>
                <el-input slot="reference" v-model="currentIcon" placeholder="请选择图标">
                  <i v-if="currentIcon != null" slot="prefix" class="iconfont" :class="currentIcon"></i>
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>

          <el-col :span="22">
            <el-form-item label="排序 :">
              <el-input v-model="formData.sort" placeholder="排序" />
            </el-form-item>
          </el-col>

          <el-col :span="22">
            <el-col :span="12">
              <el-form-item label="菜单类型 :">
                <el-select value-key="id" placeholder="菜单类型" v-model="formData.menuType" style="width: 100%">
                  <el-option v-for="(val, key, index) in  menuType" :label="val" :value="key" :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模块 :">
                <el-select value-key="id" placeholder="请选择模块" v-model="formData.module" style="width: 100%">
                  <el-option v-for="(val, key, index) in  lockStatusObj" :label="val" :value="key" :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注 :">
              <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
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
  addMenu, delMenu, getMenuList, editMenu, getMenuById
} from "@/api/system/menu";
import moment from "moment";
export default {
  name: "Notice",
  data() {
    return {
      isAddChild: false,
      num: 1,
      currentIcon: null,
      icon: ['icon-shaixuan', 'icon-sousuo', 'icon-laba', 'icon-tixing'],
      lockStatusObj: {
        "Basic": '专业版',
        "Professional": '企业版',
        "Enterprise": '旗舰版',
      },
      menuType: {
        "MODULE": "模块",
        "MENU": "菜单",
        "BUTTON": "按钮"
      },
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
    selectIcon(index) {
      this.currentIcon = this.icon[index]
      this.formData.icon = this.icon[index]
    },
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
      getMenuList(queryParams).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.deptList = res.result.data
          this.total = parseInt(res.result.items)
          this.loading = false;
        }
      })
    },

    /** 新增主菜单 */
    handleAdd() {
      this.title = "新增菜单";
      this.isAddData = true;
      this.isAddChild = false;
      this.open = true;
    },
    // 新增子菜单
    addChildMenu(row) {
      this.title = "新增子菜单";
      this.formData.parentName = row.parentName;
      this.formData.parentId = row.parentId;
      this.isAddChild = true;
      this.open = true;
    },
    confirmSorting(row) {
      console.log(row)
      getMenuById(row.id, this.num).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.$message.success('设置成功');
          this.getList()
        }
      })
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = "修改菜单";
      this.isAddData = false;
      this.formData = JSON.parse(JSON.stringify(row));
      this.currentIcon = row.icon;
      this.open = true;
    },
    // 提交按钮
    submitForm() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          if (this.isAddData == true) {
            this.formData.parentId = 0;
            this.formData.sort = 0;
            addMenu(this.formData).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('新增成功');
                this.open = false;
                this.getList()
                this.formData = {};
                this.currentIcon = null;
              }
            })
          } else {
            editMenu(this.formData).then(res => {
              if (res.type == "success" && res.code == 200) {
                this.$message.success('修改成功');
                this.open = false;
                this.getList()
                this.formData = {};
                this.currentIcon = null;
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
          delMenu(row.id).then(res => {
            if (res.type == 'success' && res.code == 200) {
              this.$message.success('删除成功');
              this.getList();
            }
          })
        })
    },
    handleChange(value) {
      console.log(value);
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
      this.currentIcon = null;
    },
    // 处理时间显示
    carTimeFilter(row, column, cellValue, index) {
      return moment(cellValue).format("YYYY-MM-DD");
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "checkBtn":
          this.handleUpdate(row);
          break;
        case "deleteRow":
          this.handleDelete(row);
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style  scoped rel="stylesheet/scss" lang="scss">
.iconForm {
  width: 400px;
  display: flex;
  flex-wrap: wrap
}

.iconFormItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 5px;
  cursor: pointer;
}

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

.Enterprise,
.MODULE {
  background-color: #e8f4ff;
  border-color: #d1e9ff;
  color: #1890ff;
}

.Basic,
.MENU {
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
}

.Professional,
.BUTTON {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}


::v-deep.el-input-number--medium {
  width: 120px !important;
}

.sort {
  width: 60px;
  height: 25px;
  margin-left: 5px;
  background-color: #e8f4ff;
  line-height: 25px;
  border-color: #d1e9ff;
  color: #000000;
  text-align: center;
  cursor: pointer;
}
</style>