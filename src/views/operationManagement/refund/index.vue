<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item>
        <el-date-picker v-model="queryParams.date" style="width: 280px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item prop="crux">
        <el-input v-model="queryParams.crux" placeholder="请输入门店/事由/收款方式" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item prop="amount">
        <el-input v-model="queryParams.amount" placeholder="请输入交易金额" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="warning" plain  icon="el-icon-download" size="mini" @click="outExcel">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
    </el-row>

    <el-table :data="tableData" height="600" id="tabkeins">
      <el-table-column label="原收款订单号" align="center" prop="collectionOrder" width="150" />
      <el-table-column label="退款订单号" align="center" prop="refundOrder" width="150" />
      <el-table-column label="对方账号" align="center" prop="accountNumber" width="150" />
      <el-table-column label="对方户名" align="center" prop="name" />
      <el-table-column label="交易金额" align="center" prop="money" />
      <el-table-column label="退款金额" align="center" prop="monrefundAmountey" />
      <el-table-column label="门店名称" align="center" prop="store" />
      <el-table-column label="退款原因" align="center" prop="reason">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="reimburse(scope.row.reason)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="退款方式" align="center" prop="refundMethod" />
      <el-table-column label="退款时间" align="center" prop="refundDate" />
      <el-table-column label="申请人" align="center" prop="applicant" />
      <el-table-column label="审核人" align="center" prop="reviewer" />
      <el-table-column label="审批备注" align="center" prop="remarks">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="remarks(scope.row.remarks)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="退款人" align="center" prop="refunder" />
      <el-table-column label="状态" align="center" prop="status" width="80" />
      <el-table-column width="200" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="details(scope.row)">查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-finished" @click="examine(scope.row)">审核</el-button>
          <el-button size="mini" type="text" @click="handleUpdate(scope.row)">
            <svg-icon icon-class="tuikuannew" class-name="custom-class" />退款
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="1" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 审批备注 -->
    <el-dialog :title="title" :visible.sync="checksOpen" width="600px" append-to-body>
      <div>
        {{ account }}
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 退款详情 -->
    <el-dialog :title="title" :visible.sync="refundOpen" width="600px" height="540px" append-to-body>
      <el-form ref="refundForm" :model="refundForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="订单号 : " prop="OrderId">
              <span>{{ refundForm.OrderId }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="交易金额 : " prop="transaction">
              <span>{{ refundForm.transaction }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="退款金额 : " prop="refund">
              <span>{{ refundForm.refund }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="实际退款 : " prop="effective">
              <span>{{ refundForm.effective }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="状态 : " prop="state">
              <span>{{ refundForm.state }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="退款原因 : " prop="reason">
              <div class="Reason">
                {{ refundForm.reason }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="附件 : " prop="enclosure">
              <viewer :images="refundForm.fileList">
                <img v-for="(k, i) in refundForm.fileList" :src="k.url" :key="i" height="100px" width="100px"
                  style="margin-left: 10px" />
              </viewer>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 退款审核 -->
    <el-dialog :title="title" :visible.sync="examineOpen" @close="handleClose" width="700px" height="540px"
      append-to-body>
      <el-form ref="examineForm" :model="examineForm" :rules="rules" label-width="60px" label-position="left"
        style="margin-left: 50px">
        <el-row>
          <el-col :span="22">
            <el-form-item prop="remarks" label="备注 :">
              <el-input type="textarea" v-model="examineForm.remarks" placeholder="审批备注"
                :autosize="{ minRows: 4, maxRows: 4 }" :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="22">
          <el-form-item label="审核 :" prop="state">
            <el-radio-group size="medium" v-model="examineForm.state">
              <el-radio v-for="(item, index) in fielptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>
      <div style="height: 10px"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 退款操作 -->
    <el-dialog :title="title" :visible.sync="open" width="550px" height="540px" append-to-body>
      <div class="refund-div">
        正在退款给：xxxxxx门店，退款金额为：123.45元<br />
        收款账号：XXXXXXXXXXXX<br />
        户名：xxxx<br /><br />
        将按照原路退回申请的款项，你确定要退此笔款项吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="agree">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { xlsx } from '@/utils/xlsx'
export default {
  name: "Dict",
  dicts: ["sys_normal_disable"],

  data() {
    return {
      showImg: false,
      imgSrc: "",
      account: "",
      fielptions: [
        {
          label: "同意",
          value: 1,
        },
        {
          label: "拒绝",
          value: 2,
        },
      ],
      tableData: [
        {
          collectionOrder: "15645154856156456415642",
          refundOrder: "1564515485615645641564",
          accountNumber: "1564515485615645641564",
          name: "王小虎1",
          money: "48564",
          monrefundAmountey: "4564",
          store: "今日说法456456465",
          refundMethod: "支付宝",
          reason: "这是为嘛呢",
          remarks: "fcejhwoiufgewuifbvbhuwjgvbchjsbvjhsbvhjsvbhsdvbchjsdvb",
          refundDate: "2023-15-26",
          applicant: "涛哥",
          reviewer: "涛哥",
          refunder: "涛哥",
          status: "1",
        },
        {
          collectionOrder: "15645154856156456415642",
          refundOrder: "1564515485615645641564",
          accountNumber: "1564515485615645641564",
          name: "王小虎2",
          money: "48564",
          monrefundAmountey: "4564",
          store: "今日说法456456465",
          refundMethod: "支付宝",
          reason: "这是为嘛呢",
          remarks: "fcejhwoiufgewuifbvbhuwjgvbchjsbvjhsbvhjsvbhsdvbchjsdvb",
          refundDate: "2023-15-26",
          applicant: "涛哥",
          reviewer: "涛哥",
          refunder: "涛哥",
          status: "1",
        },
        {
          collectionOrder: "15645154856156456415642",
          refundOrder: "1564515485615645641564",
          accountNumber: "1564515485615645641564",
          name: "王小虎3",
          money: "48564",
          monrefundAmountey: "4564",
          store: "今日说法456456465",
          refundMethod: "支付宝",
          reason: "这是为嘛呢",
          remarks: "fcejhwoiufgewuifbvbhuwjgvbchjsbvjhsbvhjsvbhsdvbchjsdvb",
          refundDate: "2023-15-26",
          applicant: "涛哥",
          reviewer: "涛哥",
          refunder: "涛哥",
          status: "1",
        },
        {
          collectionOrder: "15645154856156456415642",
          refundOrder: "1564515485615645641564",
          accountNumber: "1564515485615645641564",
          name: "王小虎4",
          money: "48564",
          monrefundAmountey: "4564",
          store: "今日说法456456465",
          refundMethod: "支付宝",
          reason: "这是为嘛呢",
          remarks: "fcejhwoiufgewuifbvbhuwjgvbchjsbvjhsbvhjsvbhsdvbchjsdvb",
          refundDate: "2023-15-26",
          applicant: "涛哥",
          reviewer: "涛哥",
          refunder: "涛哥",
          status: "1",
        },
        {
          collectionOrder: "15645154856156456415642",
          refundOrder: "1564515485615645641564",
          accountNumber: "1564515485615645641564",
          name: "王小虎5",
          money: "48564",
          monrefundAmountey: "4564",
          store: "今日说法456456465",
          refundMethod: "支付宝",
          reason: "这是为嘛呢",
          remarks: "fcejhwoiufgewuifbvbhuwjgvbchjsbvjhsbvhjsvbhsdvbchjsdvb",
          refundDate: "2023-15-26",
          applicant: "涛哥",
          reviewer: "涛哥",
          refunder: "涛哥",
          status: "1",
        },
      ],
      listHander: {
        reason: '退款原因',
        status: '状态',
        remarks: '备注',
        refundMethod: '付款方式'
      },
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
      //审批备注弹层
      checksOpen: false,

      //退款详情弹层
      refundOpen: false,
      //退款审核弹层
      examineOpen: false,

      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        crux: "",
        amount: "",
        date: "",
      },
      // 退款表单参数
      refundForm: {
        OrderId: "12312311231321",
        transaction: "545646",
        refund: "15412",
        effective: "35",
        state: "已退款",
        reason:
          "太帅了太帅了太帅了太帅了太帅了太帅了太帅了太帅了太帅了太帅了太帅了太帅了太帅了太帅了太帅",
        fileList: [
          {
            name: "food.jpeg",
            url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          }, {
            name: "food.jpeg",
            url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          }, {
            name: "food.jpeg",
            url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          }, {
            name: "food.jpeg",
            url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          },
          {
            name: "food2.jpeg",
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.netyitong.com%2Fimgup%2F2020%2F02%2F05%2Fe49f-intiarp6229797.jpg&refer=http%3A%2F%2Fwww.netyitong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1650165906&t=f63f3118725a6a5a8eb9dffa36ce00cd",
          },
        ],
      },
      //审核表单参数
      examineForm: {
        remarks: "",
        state: "",
      },
      // 表单校验
      rules: {
        remarks: [{ required: true, message: "备注不能为空", trigger: "blur" }],
        state: [{ required: true, message: "意见不能为空", trigger: "blur" }],
      },
    };
  },

  methods: {
    //导出EXCLE
    outExcel() {
      // this.jsonData是要导出的数据内容（表格里的内容），
      // this.listHander对应要导出内容的表头
      // 学生：指向的是excel文件名
      xlsx(this.tableData, this.listHander, '学生')
    },
    //上传附件
    handlePreview(file) {
      console.log(file);
    },
    //查看审批备注
    remarks(row) {
      console.log(row);
      this.account = row;
      this.title = "审批备注";
      this.checksOpen = true;
    },
    //查看退款原因
    reimburse(row) {
      this.account = row;
      this.title = "退款原因";
      this.checksOpen = true;
    },
    //查看退款详情
    details() {
      this.title = "退款详情";
      this.refundOpen = true;
    },
    //
    // 取消按钮
    cancel() {
      this.open = false;
      this.checksOpen = false;
      this.refundOpen = false;
      this.examineOpen = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      console.log(this.queryParams);
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.handleQuery();
    },
    /** 退款按钮操作 */
    handleUpdate(row) {
      this.open = true;
      this.title = "退款申请";
    },
    //确认退款
    agree() {
      console.log("同意");
      this.open = false;
    },
    //退款审核
    examine(row) {
      this.title = "退款审核";
      this.examineOpen = true;
    },
    /** 审批提交 */
    submitForm() {
      this.examineOpen = false;
      this.$message({
        type: "success",
        message: "审批成功!",
      });
      console.log(this.examineForm);
      this.examineForm = {}
    },
    // 关闭按钮
    handleClose() {
      this.examineForm = {};
    },
  },
};
</script>
<style scoped>
.refund-div {
  width: 450px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 30px;
}

.Reason {
  max-height: 150px;
  overflow: auto;
}
</style>