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
      <el-form-item prop="date">
        <el-date-picker
          v-model="queryParams.date"
          style="width: 280px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="请选择开始日期"
          end-placeholder="请选择结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="crux">
        <el-input
          v-model="queryParams.crux"
          type="daterange"
          placeholder="请输入门店/事由/收款方式"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item prop="amount">
        <el-input
          type="daterange"
          v-model="queryParams.amount"
          placeholder="请输入交易金额"
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导出</el-button
        >
      </el-col>
       <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
    </el-row>

    <el-table
      :data="tableData"
      height="600"
      id="table"
    >
      <el-table-column label="收款时间" align="center" prop="date" />
      <el-table-column label="订单号" align="center" prop="OrderId" />
      <el-table-column label="对方账号" align="center" prop="accountNumber" />
      <el-table-column label="对方户名" align="center" prop="name" />
      <el-table-column label="交易金额" align="center" prop="money" />
      <el-table-column label="收款方式" align="center" prop="mode" />
      <el-table-column label="门店名称" align="center" prop="store" />
      <el-table-column label="收款事由" align="center" prop="matter" />
      <el-table-column label="状态" align="center" prop="status" width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']"
            ><svg-icon icon-class="tuikuannew"  class-name='custom-class' />退款</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
    @close="handleClose"
      :title="title"
      :visible.sync="open"
      width="600px"
      height="540px"
      append-to-body
      style="padding-left: 29px"
    >
      <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="订单号 :">
              <el-input v-model="formData.OrderId" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="交易金额 :">
              <el-input v-model="formData.money" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="退款金额 :" prop="refund">
              <el-input
                placeholder="请输入退款金额"
                v-model="formData.refund"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="退款原因 :" prop="reason">
              <el-input
                v-model="formData.reason"
                type="textarea"
                placeholder="请输入退款原因"
                :autosize="{ minRows: 4, maxRows: 4 }"
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="附件 :" prop="enclosure">
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts"
                :limit="2"
                :on-exceed="handleExceed"
                :on-preview="handlePreview"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
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
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Dict",
  data() {
    return {
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
        date: undefined,
        crux: undefined,
        amount: undefined,
      },
      // 表单参数
      formData: {
        OrderId: "",
        money: "",
        refund: "",
        reason: "",
        enclosure: "",
        fileList: this.fileList,
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
    //导出excle
    handleExport() {
      var time = moment(new Date()).format("YYYYMMDDHHmm");
      var tables = document.getElementById("table");
      var table_book = this.$XLSX.utils.table_to_book(tables);
      var table_write = this.$XLSX.write(table_book, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        this.$FileSaver.saveAs(
          new Blob([table_write], { type: "application/octet-stream" }),
           "收款明细"+time +".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, table_write);
      }
      return table_write;
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      console.log(file);
      this.fileList.push({ name: file.name, url: file.url });

      console.log(this.fileList);
    },
    // 限制图片上传数量
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 2 个文件`);
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.fileList = fileList;
    },
    handlePreview(file) {
      console.log(file);
    },

    // 限制图片上传大小及格式
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/png" || file.type === "image/jpeg";
      const isLt2M = file.size / 1024 < 500;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 500KB!");
      }
      return isJPG && isLt2M;
    },

    /** 搜索按钮操作 */
    handleQuery() {
       console.log(this.queryParams);
      this.queryParams.pageNum = 1;
      this.getList();
    },
     // 关闭按钮
    handleClose() {
      this.formData = {};
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.handleQuery();
    },
    /** 退款按钮操作 */
    handleUpdate(row) {
      this.title = "退款申请";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      var data = {
        ...this.formData,
        fileList: this.fileList,
      };
      console.log(data);
    }
  },
};
</script>