<template>
  <div class="configure-Form">
    <el-row :gutter="15" class="configure-row">
      <el-form ref="elForm" :model="appletForm" size="medium" label-width="100px">
        <el-col :span="8" style="padding: 10px 30px 10px 20px">
          <div class="form-style" @click="obtainapplet">
            <div style="margin: 10px 0 10px 15px">{{ appletForm.text }}:</div>
            <el-form-item label="Id" prop="appletId">
              <el-input v-model="appletForm.appletId" clearable disabled :style="{ width: '90%' }"></el-input>
            </el-form-item>
            <el-form-item label="SecretKey" prop="appletSecretKey">
              <el-input v-model="appletForm.appletSecretKey" clearable disabled :style="{ width: '90%' }"></el-input>
            </el-form-item>
            <el-form-item label="AccessKey" prop="appletAccessKey">
              <el-input v-model="appletForm.appletAccessKey" clearable disabled :style="{ width: '90%' }"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8" style="padding: 10px 30px 10px 20px">
          <div class="form-style" @click="obtainpayment">
            <div style="margin: 10px 0 10px 15px">{{ paymentForm.text }}:</div>
            <el-form-item label="Id" prop="paymentId">
              <el-input v-model="paymentForm.paymentId" clearable disabled :style="{ width: '90%' }"></el-input>
            </el-form-item>
            <el-form-item label="SecretKey" prop="paymentSecretKey">
              <el-input v-model="paymentForm.paymentSecretKey" clearable disabled :style="{ width: '90%' }"></el-input>
            </el-form-item>
            <el-form-item label="AccessKey" prop="paymentAccessKey">
              <el-input v-model="paymentForm.paymentAccessKey" clearable disabled :style="{ width: '90%' }"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-form>
    </el-row>

    <!-- 修改小程序配置 -->
    <el-dialog :close-on-click-modal="true" :title="title[0]" :visible.sync="open" width="600px" height="540px"
      append-to-body>
      <el-form ref="elForm" :model="dialogData" size="medium" label-width="150px">
        <el-form-item v-for="(k, i) in field" :key="i" :label="k + ':'">
          <el-input v-model="dialogData[k]" clearable :placeholder="k" :style="{ width: '90%' }"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>

      </div>
    </el-dialog>
  </div>
</template>
<script>
import { createLogger } from "vuex";
export default {
  components: {},
  props: [],
  data() {
    return {
      field: [],
      open: false,
      title: "",
      dialogData: {},
      appletForm: {
        text: "小程序配置",
        appletId: "wx49a1b99acb82992f",
        appletSecretKey: "wx49a1b99acb82992f",
        appletAccessKey: "wx49a1b99acb82992f",
      },
      paymentForm: {
        text: "支付配置",
        paymentId: "zfb49a1b99acb82992f",
        paymentSecretKey: "zfb49a1b99acb82992f",
        paymentAccessKey: "zfb49a1b99acb82992f",
      },
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    //取消按钮
    cancel() {
      this.open = false;
    },

    //获取小程序配置
    obtainpayment() {
      console.log(12);
      var field = Object.keys(this.paymentForm);
      var value = Object.values(this.paymentForm);
      this.processing(field, value);
      this.open = true;
    },

    //获取APP配置
    obtainapplet() {
      var field = Object.keys(this.appletForm);
      var value = Object.values(this.appletForm);
      this.processing(field, value);
      this.open = true;
    },
    //处理
    processing(field, value) {
      this.dialogData = [];
      console.log(value);
      this.title = value.splice(0, 1);
      field.splice(0, 1);

      this.field = field;
      console.log(field);
      console.log(value);
      for (var i = 0; i < field.length; i++) {
        this.dialogData[field[i]] = value[i];
      }
      this.dialogData = { ...this.dialogData };
    },

    //确认按钮
    submitForm() {
      console.log(this.dialogData);
    },
  },
};
</script>
<style  scoped>
.form-style {
  padding: 10px 0 0 0;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  height: 224px;
}

.form-style:hover {
  transform: scale(1.03);
  box-shadow: 8px 8px 20px 0px rgba(177, 166, 166, 0.2);
}
</style>

