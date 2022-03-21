<template>
  <div class="configure-Form">
    <el-row :gutter="15" class="configure-row">
      <el-form
        ref="elForm"
        :model="appletForm"
        size="medium"
        label-width="100px"
      >
        <el-col :span="8" style="padding: 10px 30px 10px 20px">
          <div class="form-style" @click="obtainapplet">
            <div style="margin: 10px 0 10px 15px">{{ appletForm.text }}:</div>
            <el-form-item label="Id" prop="appletId">
              <el-input
                v-model="appletForm.appletId"
                clearable
                disabled
                :style="{ width: '90%' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="SecretKey" prop="appletSecretKey">
              <el-input
                v-model="appletForm.appletSecretKey"
                clearable
                disabled
                :style="{ width: '90%' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="AccessKey" prop="appletAccessKey">
              <el-input
                v-model="appletForm.appletAccessKey"
                clearable
                disabled
                :style="{ width: '90%' }"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8" style="padding: 10px 30px 10px 20px">
          <div class="form-style" @click="obtainpayment">
            <div style="margin: 10px 0 10px 15px">{{ paymentForm.text }}:</div>
            <el-form-item label="Id" prop="paymentId">
              <el-input
                v-model="paymentForm.paymentId"
                clearable
                disabled
                :style="{ width: '90%' }"
              ></el-input>
            </el-form-item>

            <el-form-item label="SecretKey" prop="paymentSecretKey">
              <el-input
                v-model="paymentForm.paymentSecretKey"
                clearable
                disabled
                :style="{ width: '90%' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="AccessKey" prop="paymentAccessKey">
              <el-input
                v-model="paymentForm.paymentAccessKey"
                clearable
                disabled
                :style="{ width: '90%' }"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-form>
    </el-row>

    <!-- 修改小程序配置 -->
    <el-dialog
      :close-on-click-modal="true"
      :title="title[0]"
      :visible.sync="appletopen"
      width="600px"
      height="540px"
      append-to-body
    >
      <el-form
        ref="elForm"
        :model="dialogData"
        size="medium"
        label-width="100px"
      >
        <el-form-item
          v-for="(k, i) in dialogData"
          :key="i"
          :label="k"
        >
          <el-input
            :v-model="k"
            clearable
            :placeholder="k.i"
            :style="{ width: '90%' }"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { createLogger } from 'vuex';
export default {
  components: {},
  props: [],
  data() {
    return {
      arardfsa:[],
      appletopen: false,
      paymentopen: false,
      title: "",
      dialogData: {},
      appletForm: {
        text: "小程序配置",
        appletId: "小程序ID",
        appletSecretKey: "小程序SecretKey",
        appletAccessKey: "小程序AccessKey",
      },
      paymentForm: {
        text: "支付配置",
        paymentId: "",
        paymentSecretKey: "",
        paymentAccessKey: "",
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //取消按钮
    cancel() {
      this.paymentopen = false;
      this.appletopen = false;
    },
    //重置

    //获取APP配置
    obtainapplet() {
    this.dialogData=[]
      var field = Object.keys(this.appletForm);
      var value = Object.values(this.appletForm);
      value.splice(0,1)

      this.title = field.splice(0, 1);
     
      console.log(value);
      console.log(this.appletForm);
    //   this.dialogData=field
     
      for (var i = 0; i < field.length; i++) {
    
         this.dialogData[field[i]]=value[i]
       
      }
      console.log(typeof(this.dialogData));
      console.log(this.dialogData);
      this.appletopen=true
    },
    //获取支付配置遮罩
    obtainpayment() {
      this.paymentopen = true;
    },
    //确认按钮
    submitForm(){
        console.log(this.dialogData);
    }
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

