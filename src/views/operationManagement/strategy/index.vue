<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item  prop="dictName">
        <el-select
          v-model="edition"
          placeholder="请选择版本"
          clearable
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="(item, index) in fieldptions"
            :key="index"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          ></el-option>
        </el-select>
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
          v-hasPermi="['system:dict:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      height="600"
    >
      <el-table-column label="策略名称" align="center" prop="titstrategyle" />
      <el-table-column label="开始日期" align="center" prop="stime" />
      <el-table-column label="结束日期" align="center" prop="etime" />
      <el-table-column label="是否促销" align="center" prop="promotion" />
      <el-table-column label="应用版本" align="center" prop="edition" />
      <el-table-column label="价格类别" align="center" prop="category" />
      <el-table-column label="经销商价格" align="center" prop="distributor" />
      <el-table-column label="零售价格" align="center" prop="retail" />
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
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']"
            >修改</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
            >删除</el-button
          >
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      height="540px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="padding-left:29px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="策略名称:" prop="titstrategyle">
              <el-input placeholder="请输入标题" v-model="form.titstrategyle" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="显示开始日期:" prop="stime">
              <el-date-picker
                format="yyyy-MM-dd"
                v-model="form.stime"
                value-format="yyyy-MM-dd"
                :style="{ width: '100%' }"
                placeholder="请选择开始日期"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="显示结束日期:" prop="etime">
              <el-date-picker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="form.etime"
                :style="{ width: '100%' }"
                placeholder="请选结束日期"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-form-item label="是否促销:" prop="promotion">
              <el-radio-group size="medium" v-model="form.promotion">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="应用版本:" prop="edition">
              <el-select
                v-model="form.edition"
                placeholder="请选择版本"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in fieldptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-form-item label="价格类别:" prop="category">
              <el-radio-group size="medium" v-model="form.category"  placeholder="请选择价格类别">
                <el-radio label="sta1">开户</el-radio>
                <el-radio label="sta2">年度</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="经销商价格:" prop="distributor">
              <el-input placeholder="请输入经销商价格" v-model="form.distributor" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="零售价格:" prop="retail">
              <el-input placeholder="请输入零售价格" v-model="form.retail" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="height: 20px"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <!-- <el-button @click="cancel">取 消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listType,
  getType,
  delType,
  addType,
  updateType,
  refreshCache,
} from "@/api/system/dict/type";

export default {
  name: "Dict",
  dicts: ["sys_normal_disable"],
  data() {
    return {
      total: 1,
      edition: "专业版",
      fieldptions: [
        {
          label: "专业版",
          value: 1,
        },
        {
          label: "企业版",
          value: 2,
        },
        {
          label: "旗舰版",
          value: 3,
        },
      ],

      tableData: [
        {
          titstrategyle: "策略",
          stime: "2021-11-12",
          etime: "2022-05-12",
          promotion: "1",
          edition: "专业版",
          category: "开户",
          distributor: "1564",
          retail: "1666",
        },
        {
          titstrategyle: "策略",
          stime: "2021-11-12",
          etime: "2022-05-12",
          promotion: "1",
          edition: "专业版",
          category: "开户",
          distributor: "1564",
          retail: "1666",
        },
        {
          titstrategyle: "策略",
          stime: "2021-11-12",
          etime: "2022-05-12",
          promotion: "1",
          edition: "专业版",
          category: "开户",
          distributor: "1564",
          retail: "1666",
        },
        {
          titstrategyle: "策略",
          stime: "2021-11-12",
          etime: "2022-05-12",
          promotion: "1",
          edition: "专业版",
          category: "开户",
          distributor: "1564",
          retail: "1666",
        },
        {
          titstrategyle: "策略",
          stime: "2021-11-12",
          etime: "2022-05-12",
          promotion: "1",
          edition: "专业版",
          category: "开户",
          distributor: "1564",
          retail: "1666",
        },
        {
          titstrategyle: "策略",
          stime: "2021-11-12",
          etime: "2022-05-12",
          promotion: "1",
          edition: "专业版",
          category: "开户",
          distributor: "1564",
          retail: "1666",
        },
        {
          titstrategyle: "策略",
          stime: "2021-11-12",
          etime: "2022-05-12",
          promotion: "1",
          edition: "专业版",
          category: "开户",
          distributor: "1564",
          retail: "1666",
        },
        {
          titstrategyle: "策略",
          stime: "2021-11-12",
          etime: "2022-05-12",
          promotion: "1",
          edition: "专业版",
          category: "开户",
          distributor: "1564",
          retail: "1666",
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
        status: undefined,
      },
      // 表单参数
      form: {
        titstrategyle: "",
        stime: "",
        etime: "",
        promotion: "",
        edition: "",
        category: "",
        distributor: "",
        retail: "",
      },
      // 表单校验
      rules: {
        titstrategyle: [{ required: true, message: "策略名称不能为空", trigger: "blur" }],
        stime: [ { required: true, message: "开始时间不能为空", trigger: "blur" },],
        etime: [{ required: true, message: "结束时间不能为空", trigger: "blur" },],
        promotion: [{ required: true, message: "请选择是否促销", trigger: "blur" }],
        edition: [{ required: true, message: "请选择应用版本", trigger: "blur" }],
        category: [{ required: true, message: "请选择价格类别", trigger: "blur" }],
        distributor: [{ required: true, message: "经销商不能为空", trigger: "blur" }],
        retail: [{ required: true, message: "零售不能为空", trigger: "blur" }],
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
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
       titstrategyle: "",
        stime: "",
        etime: "",
        promotion: "",
        edition: "",
        category: "",
        distributor: "",
        retail: "",
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
    submitForm: function () {
        console.log(this.form)
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.dictId != undefined) {
            updateType(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除字典编号为"' + dictIds + '"的数据项？')
        .then(function () {
          return delType(dictIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$modal.msgSuccess("刷新成功");
      });
    },
  },
};
</script>