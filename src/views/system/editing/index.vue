<template>
  <div class="editorBox">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="企业端文档说明" name="first">
        <v-md-editor :disabled-menus="[]" @upload-image="handleUploadImage" v-model="text" height="800px"
          @save="EditContent"></v-md-editor>
      </el-tab-pane>

      <el-tab-pane label="小程序文档说明" name="second">
        <v-md-editor :disabled-menus="[]" @upload-image="handleUploadImage" v-model="text" height="800px"
          @save="EditContent"></v-md-editor>
      </el-tab-pane>

      <el-tab-pane label="平台端文档说明" name="third">
        <v-md-editor :disabled-menus="[]" @upload-image="handleUploadImage" v-model="text" height="800px"
          @save="EditContent"></v-md-editor>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
export default {
  name: 'PageEdit',
  data() {
    return {
      text: '',
      activeName: 'first'
    }
  },
  mounted() {
    if (localStorage.getItem("mdText") == null) {
      this.text = `# 介绍
## Vue.js 是什么
Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与[现代化的工具链](https://cn.vuejs.org/v2/guide/single-file-components.html)以及各种[支持类库](https://github.com/vuejs/awesome-vue#libraries--plugins)结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

如果你想在深入学习 Vue 之前对它有更多了解，我们制作了一个视频，带您了解其核心概念和一个示例工程。

如果你已经是有经验的前端开发者，想知道 Vue 与其它库/框架有哪些区别，请查看[对比其它框架](https://cn.vuejs.org/v2/guide/comparison.html)。
## 起步
::: danger
官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识。如果你刚开始学习前端开发，将框架作为你的第一步可能不是最好的主意——掌握好基础知识再来吧！之前有其它框架的使用经验会有帮助，但这不是必需的。
:::
# 介绍
## Vue.js 是什么
Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与[现代化的工具链](https://cn.vuejs.org/v2/guide/single-file-components.html)以及各种[支持类库](https://github.com/vuejs/awesome-vue#libraries--plugins)结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

如果你想在深入学习 Vue 之前对它有更多了解，我们制作了一个视频，带您了解其核心概念和一个示例工程。

如果你已经是有经验的前端开发者，想知道 Vue 与其它库/框架有哪些区别，请查看[对比其它框架](https://cn.vuejs.org/v2/guide/comparison.html)。
## 起步
::: danger
官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识。如果你刚开始学习前端开发，将框架作为你的第一步可能不是最好的主意——掌握好基础知识再来吧！之前有其它框架的使用经验会有帮助，但这不是必需的。
:::
# 介绍
## Vue.js 是什么
Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与[现代化的工具链](https://cn.vuejs.org/v2/guide/single-file-components.html)以及各种[支持类库](https://github.com/vuejs/awesome-vue#libraries--plugins)结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

如果你想在深入学习 Vue 之前对它有更多了解，我们制作了一个视频，带您了解其核心概念和一个示例工程。

如果你已经是有经验的前端开发者，想知道 Vue 与其它库/框架有哪些区别，请查看[对比其它框架](https://cn.vuejs.org/v2/guide/comparison.html)。
## 起步
::: danger
官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识。如果你刚开始学习前端开发，将框架作为你的第一步可能不是最好的主意——掌握好基础知识再来吧！之前有其它框架的使用经验会有帮助，但这不是必需的。
:::
# 介绍
## Vue.js 是什么
Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与[现代化的工具链](https://cn.vuejs.org/v2/guide/single-file-components.html)以及各种[支持类库](https://github.com/vuejs/awesome-vue#libraries--plugins)结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

如果你想在深入学习 Vue 之前对它有更多了解，我们制作了一个视频，带您了解其核心概念和一个示例工程。

如果你已经是有经验的前端开发者，想知道 Vue 与其它库/框架有哪些区别，请查看[对比其它框架](https://cn.vuejs.org/v2/guide/comparison.html)。
## 起步
::: danger
官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识。如果你刚开始学习前端开发，将框架作为你的第一步可能不是最好的主意——掌握好基础知识再来吧！之前有其它框架的使用经验会有帮助，但这不是必需的。
:::`
    } else {
      this.text = localStorage.getItem("mdText")
    }
  },
  methods: {
    EditContent(text, html) {
      localStorage.removeItem("mdText");
      localStorage.setItem("mdText", text);
    },
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
    handleClick(tab, event) {
      console.log(tab, event);
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
