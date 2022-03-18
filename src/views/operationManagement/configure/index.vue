<template>

    <div class="configure-Form">
      <el-row :gutter="15" class="configure-row">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="100px"
        >
          <el-col :span="23">
            <div class="configure-applet">小程序配置:</div>
            <el-form-item label="APPid" prop="appletId">
              <el-input
                v-model="formData.appletId"
                placeholder="请输入小程序APPid"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="SecretKey" prop="appletSecretKey">
              <el-input
                v-model="formData.appletSecretKey"
                placeholder="请输入小程序SecretKey"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="AccessKey" prop="appletAccessKey">
              <el-input
                v-model="formData.appletAccessKey"
                placeholder="请输入小程序AccessKey"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="23">
            <div class="configure-applets">支付配置:</div>
            <el-form-item label="APPid" prop="paymentId">
              <el-input
                v-model="formData.paymentId"
                placeholder="请输入支付APPid"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="SecretKey" prop="paymentSecretKey">
              <el-input
                v-model="formData.paymentSecretKey"
                placeholder="请输入支付SecretKey"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="AccessKey" prop="paymentAccessKey">
              <el-input
                v-model="formData.paymentAccessKey"
                placeholder="请输入支付AccessKey"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="text-align: right; margin:10px 0">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
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
        appletSecretKey: undefined,
        appletAccessKey: undefined,
        paymentId: "",
        paymentSecretKey: undefined,
        paymentAccessKey: "",
      },
      rules: {
        appletId: [
          {
            required: true,
            message: "请输入小程序APPid",
            trigger: "blur",
          },
          {
            pattern: /^wx(?=.*\d)(?=.*[a-z])[\da-z]{16}$/,
            message: "小程序APPID错误",
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
            message: "请输入支付APPid",
            trigger: "blur",
          },
          {
            pattern: /^wx(?=.*\d)(?=.*[a-z])[\da-z]{16}$/,
            message: "小程序APPID错误",
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
            message: "请输入支付AccessKey",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
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
.min{
  width: 100%;
  height: 800px;
}
.configure-Form {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  padding: 20px;
  width: 480px;
  height: 566px;
  position: fixed;
  top: 20%;
  left: 40%;
}
.configure-row {
  width: 440px;
}
.configure-applet {
  text-align: left;
  margin: 15px 0;
  font-weight: 600;
}
.configure-applets {
  text-align: left;
  margin: 25px 0 15px 0;
  font-weight: 600;
}
</style>

