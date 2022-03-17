<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="收款时间" prop="date">
        <el-date-picker
        
          v-model="queryParams.date"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="门店 事由 收款方式"
          clearable
          style="width: 240px"
         
        />
      </el-form-item>
      <el-form-item label="交易金额" prop="amount">
        <el-input
          v-model="queryParams.amount"
          placeholder="交易金额"
          clearable
          style="width: 240px"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dict:add']"
        >新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <download-excel
          class="export-btn"
          :data="tableData"
          :fields="jsonFields"
          type="xls"
          header="收款一览表"
          name="收款一览表"
        >
          <el-button type="warning" plain icon="el-icon-plus" size="mini"
            >导出</el-button
          >
        </download-excel>
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      height="600"
    >
      <el-table-column label="收款时间" align="center" prop="date" />
      <el-table-column label="订单号" align="center" prop="OrderId" />
      <el-table-column label="对方账号" align="center" prop="accountNumber" />
      <el-table-column label="对方户名" align="center" prop="name" />
      <el-table-column label="交易金额" align="center" prop="money" />
      <el-table-column label="收款方式" align="center" prop="mode" />
      <el-table-column label="门店名称" align="center" prop="store" />
      <el-table-column label="收款事由" align="center" prop="matter" />
      <el-table-column label="状态" align="center" prop="status" width="180" />
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
            >退款</el-button
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
        label-width="100px"
        label-position="left"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item label="订单号:" prop="OrderId">
              <el-input readonly v-model="form.OrderId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="交易金额:" prop="money">
              <el-input readonly v-model="form.money" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="退款金额:" prop="refund">
              <el-input
                type="number"
                placeholder="请输入退款金额"
                v-model="form.refund"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="退款原因:" prop="reason">
              <el-input
                v-model="form.reason"
                type="textarea"
                placeholder="请输入退款原因"
                :autosize="{ minRows: 4, maxRows: 4 }"
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="附件:" prop="enclosure">
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :limit="2"
                :on-exceed="handleExceed"
                :on-preview="handlePreview"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :file-list="fileList"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

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
      //导出Excel表格的表头设置
      jsonFields: {
        收款时间: "date",
        订单号: "OrderId",
        对方账号: "accountNumber",
        对方户名: "name",
        交易金额: "money",
        收款方式: "mode",
        门店名称: "store",
        收款事由: "matter",
        状态: "status",
      },
      total: 1,
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://api.erptong.com/files/image/duoyun.png",
        },
      ],

      tableData: [
        {
          date: "2016-05-02",
          OrderId: "1564515485615645641564",
          accountNumber: "1564515485615645641564",
          name: "王小虎",
          money: "48564",
          mode: "支付宝",
          store: "今日说法",
          matter: "卖店",
          status: "1",
        },
        {
          date: "2016-05-02",
          OrderId: "1564515485615645641564",
          accountNumber: "1564515485615645641564",
          name: "王小虎",
          money: "48564",
          mode: "支付宝",
          store: "今日说法",
          matter: "卖店",

          status: "1",
        },
        {
          date: "2016-05-02",
          OrderId: "1564515485615645641564",
          accountNumber: "1564515485615645641564",
          name: "王小虎",
          money: "48564",
          mode: "支付宝",
          matter: "卖店",
          store: "今日说法",
          status: "1",
        },
        {
          date: "2016-05-02",
          OrderId: "1564515485615645641564",
          accountNumber: "1564515485615645641564",
          name: "王小虎",
          money: "48564",
          mode: "支付宝",
          store: "今日说法",
          matter: "卖店",
          status: "1",
        },
        {
          date: "2016-05-02",
          OrderId: "1564515485615645641564",
          accountNumber: "1564515485615645641564",
          name: "王小虎",
          money: "48564",
          mode: "支付宝",
          store: "今日说法",
          matter: "卖店",
          status: "1",
        },
        {
          date: "2016-05-02",
          OrderId: "1564515485615645641564",
          accountNumber: "1564515485615645641564",
          name: "王小虎",
          money: "48564",
          matter: "卖店",
          mode: "支付宝",
          store: "今日说法",
          status: "1",
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
        date: undefined,
        keyword: undefined,
        amount: undefined,
      },
      // 表单参数
      form: {
        OrderId: "",
        money: "",
        refund: "",
        reason: "",
        enclosure: "",
      },
      // 表单校验
      rules: {
        refund: [
          { required: true, message: "退款金额不能为空", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "退款原因不能为空", trigger: "blur" },
        ],
      },
    };
  },
  //   created() {
  //     this.getList();
  //   },
  methods: {
    // 限制图片上传数量
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 2 个文件`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    // 限制图片上传大小及格式
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/png" || file.type === "image/jpeg";
      const isLt2M = file.size /1024 < 500

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 500KB!");
       
      }
      return isJPG && isLt2M;
    },

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
        remark: undefined,
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
    /** 退款按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.title = "退款申请";
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
    //导出
    andleExport() {
      this.download(
        "system/role/export",
        {
          ...this.queryParams,
        },
        `role_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>