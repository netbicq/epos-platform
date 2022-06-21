<template>
  <div class="editorBox">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="企业端文档说明" name="first">
        <!-- <v-md-editor :disabled-menus="[]" @upload-image="handleUploadImage" v-model="Enterprise" height="800px"
          @save="EditContent('Enterprise')"></v-md-editor> -->
      </el-tab-pane>

      <el-tab-pane label="小程序文档说明" name="second">
       <!--  <v-md-editor :disabled-menus="[]" @upload-image="handleUploadImage" v-model="Applets" height="800px"
          @save="EditContent('Applets')"></v-md-editor> -->
      </el-tab-pane>

      <el-tab-pane label="平台端文档说明" name="third">
        <v-md-editor :disabled-menus="[]" @upload-image="handleUploadImage" v-model="platform" height="800px"
          @save="EditContent"></v-md-editor>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import {
  editDocument, pageDocument
} from "@/api/docPage.js";
export default {
  name: 'PageEdit',
  data() {
    return {
      queryParams: {
        content: "",
        edition_type: "Enterprise", // 企业
        title: "string",
        id: ""
      },
      activeName: 'first',
      Enterprise: '',// 企业
      platform: '',//平台
      Applets: '',//小程序
      platformId: '',
      AppletsId: '',
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取文档
    getList() {
      pageDocument().then(res => {
        if (res.type == "success" && res.code == 200) {
          var platform = res.result.find((item) => { if (item.edition_type == "platform") { return item } }) //平台
          var Applets = res.result.find((item) => { if (item.edition_type == "Applets") { return item } })  //小程序
          var Enterprise = res.result.find((item) => { if (item.edition_type == "Enterprise") { return item } })//企业
          this.Enterprise = Enterprise.content
          this.platform = platform.content
          this.Applets = Applets.content
          this.queryParams.id = Enterprise.id
          this.platformId = platform.id
          this.AppletsId = Applets.id
          console.log(res.result)
        }
      })
    },
    // 新增文档
    EditContent(text) {
      console.log(text)
      /* if (Types == 'Applets') {
        this.queryParams.content=this.Applets
      } else if (Types == 'platform') {
        this.queryParams.content=text
      } else if (Types == 'Enterprise') {
        this.queryParams.content=this.Enterprise
      } */
      this.queryParams.content = text
      console.log(this.queryParams)
      editDocument(this.queryParams).then(res => {
        if (res.type == "success" && res.code == 200) {
          this.$message.success('保存成功');
          this.getList();
        }
      })
    },
    // 上传文件
    handleUploadImage(event, insertImage, files) {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容

      console.log(event, insertImage, files);

      // 此处只做示例
      insertImage({
        url:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg',
        desc: '七龙珠',
        // width: 'auto',
        // height: 'auto',
      });
    },
    // 选择文档
    handleClick(tab) {
      console.log(this.platform)
      if (tab.index == 2) {
        this.queryParams = {
          edition_type: "platform", // 平台
          title: "string",
          id: this.platformId
        }
      } else if (tab.index == 1) {
        this.queryParams = {
          edition_type: "Applets", // 小程序
          title: "string",
          id: this.AppletsId
        }
      }
    }
  },
}

</script>

<style lang="scss" scoped>
.editorBox {
  box-sizing: border-box;
  padding: 20px;
}

.EditType {
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 20px;

}
</style>
