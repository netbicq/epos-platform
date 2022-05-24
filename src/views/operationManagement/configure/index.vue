<template>
  <div class="configure-Form">
    <el-row :gutter="15" class="configure-row">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8" style="padding: 10px 30px 10px 20px">
          <div style="
              padding: 10px 0 0 0;
              box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
              height: 224px;
            ">
            <div style="margin: 10px 0 10px 15px">小程序配置:</div>
            <el-form-item label="Id:" prop="appletId">
              <el-input v-model="formData.appletId" placeholder="请输入小程序Id" show-word-limit clearable
                :style="{ width: '90%' }"></el-input>
            </el-form-item>
            <el-form-item label="SecretKey:" prop="appletSecretKey">
              <el-input v-model="formData.appletSecretKey" placeholder="请输入小程序SecretKey" show-word-limit clearable
                :style="{ width: '90%' }"></el-input>
            </el-form-item>
            <el-form-item label="AccessKey:" prop="appletAccessKey">
              <el-input v-model="formData.appletAccessKey" placeholder="请输入小程序AccessKey" show-word-limit clearable
                :style="{ width: '90%' }"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8" style="padding: 10px 30px 10px 20px">
          <div style="
              padding: 10px 0 0 0;
              box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
              height: 224px;
            ">
            <div style="margin: 10px 0 10px 15px">支付配置:</div>

            <el-form-item label="Id:" prop="paymentId">
              <el-input v-model="formData.paymentId" placeholder="请输入支付Id" show-word-limit clearable
                :style="{ width: '90%' }"></el-input>
            </el-form-item>
            <el-form-item label="SecretKey:" prop="paymentSecretKey">
              <el-input v-model="formData.paymentSecretKey" placeholder="请输入支付SecretKey" show-word-limit clearable
                :style="{ width: '90%' }"></el-input>
            </el-form-item>
            <el-form-item label="AccessKey:" prop="paymentAccessKey">
              <el-input v-model="formData.paymentAccessKey" placeholder="请输入支付AccessKey:" show-word-limit clearable
                :style="{ width: '90%' }"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24" style="text-align: center;margin-top: 20px;">
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        appletId: "",
        appletSecretKey: "",
        appletAccessKey: "",
        paymentId: "",
        paymentSecretKey: "",
        paymentAccessKey: "",
      },
      rules: {
        appletId: [
          {
            required: true,
            message: "请输入小程序Id",
            trigger: "blur",
          },
        ],
        appletSecretKey: [
          {
            required: true,
            message: "请输入小程序SecretKey",
            trigger: "blur",
          },
        ],
        appletAccessKey: [
          {
            required: true,
            message: "请输入小程序AccessKey",
            trigger: "blur",
          },
        ],
        paymentId: [
          {
            required: true,
            message: "请输入支付Id",
            trigger: "blur",
          },
        ],
        paymentSecretKey: [
          {
            required: true,
            message: "请输入支付SecretKey",
            trigger: "blur",
          },
        ],
        paymentAccessKey: [
          {
            required: true,
            message: "请输入支付AccessKey:",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    submitForm() {
      console.log(this.formData);
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
      });
    },
  },
};
</script>
<style  scoped>
</style>

