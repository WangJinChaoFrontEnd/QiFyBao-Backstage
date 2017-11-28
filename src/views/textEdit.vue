<template>
    <div>
        <div id="editorElem" style="text-align:left"></div>
        <button v-on:click="getContent">查看内容</button>
    </div>
</template>

<script>
    import E from 'wangeditor'

    export default {
      name: 'editor',
      data () {
        return {
          editorContent: ''
        }
      },
      methods: {
        getContent: function () {
            alert(this.editorContent)
        }
      },
      mounted() {
        var editor = new E('#editorElem')
        editor.customConfig.uploadImgMaxLength = 1
        editor.customConfig.uploadImgTimeout = 30000
        editor.customConfig.uploadImgServer = this.HOST+'/resources/wangEditor/jsp/upload_json.jsp'
        editor.customConfig.onchange = (html) => {
          this.editorContent = html
        };
        editor.customConfig.uploadImgHooks = {
              before: function (xhr, editor, files) {
              },
              success: function (xhr, editor, result) {
                  // 图片上传并返回结果，图片插入成功之后触发
                  // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
              },
              fail: function (xhr, editor, result) {
                  // 图片上传并返回结果，但图片插入错误时触发
                  // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
              },
              error: function (xhr, editor) {
                  // 图片上传出错时触发
                  // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                  // alert("上传失败");
              },
              timeout: function (xhr, editor) {
                  // 图片上传超时时触发
                  // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                  // alert("上传超时");
              }
          }
        editor.create()
      }
    }
</script>

<style scoped>
</style>
