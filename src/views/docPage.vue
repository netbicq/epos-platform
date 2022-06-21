<template>
  <div class="documentMain">
    <div class="topBox">
      <div class="currentVersion">
        <i class="el-icon-caret-right" style="color: #3eaf7c;font-size: 20px;"></i>
        {{ cur }}
      </div>
      <div class="choiceIng">
        <div style="display: flex;align-items: center;margin-bottom: 10px;"><img src="../assets/images/huifutong.png"
            alt=""></div>
        <div>
          <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="1">
              <template slot="title">文档选择</template>
              <el-menu-item index="企业端文档">企业端文档</el-menu-item>
              <el-menu-item index="小程序文档">小程序文档</el-menu-item>
              <el-menu-item index="平台端文档">平台端文档</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </div>
    </div>
    <div class="documenBox">
      <div class="documentTitle">
        <div v-for="(anchor, index) in titles" :key="index" class="sidebar"
          :style="{ padding: `7px 0 6px ${anchor.indent * 20}px`, fontSize: `${anchor.Label}rem` }"
          @click="handleAnchorClick(anchor)">
          <a :style="anchor.Label" :class="{ 'aColor': cIndex === index }" @click="current(index)"
            style="font-size:18px;">{{
                anchor.title
            }}</a>
        </div>
      </div>
      <div class="documentText">
        <v-md-preview :text="text" ref="preview" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  pageDocument
} from "@/api/docPage.js";
export default {
  data() {
    return {
      cur: '企业端文档',
      cIndex: '',
      text: '',
      titles: [],
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      pageDocument().then(res => {
      if (res.type == "success" && res.code == 200) {
        var a = res.result.find((item) => { if (item.edition_type == "platform") { return item } }).content //平台
        var Applets = res.result.find((item) => { if (item.edition_type == "Applets") { return item } }).content  //小程序
        this.text = res.result.find((item) => { if (item.edition_type == "Enterprise") { return item } }).content//企业
        console.log(res.result)
        setInterval(this.valChange, 10)
      }
    })
    },
    valChange() {
      const anchors = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
        console.log(this.$refs.preview.$el, 'aaa')
        console.log(anchors, 'aaa')
        const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());
        if (!titles.length) {
          this.titles = [];
          return;
        }
        const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();
        function LabelFun(tagName) {
          var LabeStyle = {}
          if (tagName == "H1") {
            LabeStyle = {
              "fontSize": "1.2rem",
              "fontWeight": 600
            }
            return LabeStyle
          }
          return ""
        }
        this.titles = titles.map((el) => (
          {
            title: el.innerText,
            lineIndex: el.getAttribute('data-v-md-line'),
            indent: hTags.indexOf(el.tagName),
            Label: LabelFun(el.tagName)
          }
        ));
    },
    handleAnchorClick(anchor) {
      const { preview } = this.$refs;
      const { lineIndex } = anchor;
      const heading = preview.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);
      if (heading) {
        preview.scrollToTarget({
          target: heading,
          scrollContainer: window,
          top: 60,
        });
      }
    },
    current(i) {
      this.cIndex = i
    },
    handleSelect(key, keyPath) {
      this.cur = key
      console.log(key, keyPath);
    }
  },
};
</script>
<style>
.el-menu--popup {
  min-width: 100px;
}
</style>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}

.aColor {
  font-weight: bold;
  color: #42b983;
}

.documenBox {
  margin-top: 60px;
}

.currentVersion {
  float: left;
  font-size: 18px;
  font-weight: 600;
}

.choiceIng {
  float: right;
  display: flex;
}

.topBox {
  width: 100%;
  height: 61px;
  line-height: 61px;
  background-color: #fff;
  box-sizing: border-box;
  padding-left: 40px;
  padding-right: 60px;
  border-bottom: 1px solid #eaecef;
  position: fixed;
  top: 0;
  z-index: 999;
}

.documentMain {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.documentTitle {
  padding: 40px 10px 60px 20px;
  width: 350px;
  height: 100%;
  position: fixed;
  overflow: auto;
  left: 20px;
}

.documentText {
  padding: 10px 20px 60px 20px;
  max-width: 900px;
  min-width: 400px;
}

.sidebar-link {
  color: #2C3E50;
  font-size: 1.1rem;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  cursor: pointer;
  padding-bottom: 3px
}

.sidebar .sidebar-link:hover {
  font-weight: bold;
  color: #3eaf7c;
}

.active {
  font-weight: bold;
  color: #42b983;
}

@media screen and (max-width: 1300px) {
  .documentText {
    margin-left: 290px;
  }
}

@media screen and (max-width: 900px) {
  .documentTitle {
    width: 0;
    padding: 0;
    left: 0;
  }

  .documentText {
    margin-left: 0;
  }


}
</style>