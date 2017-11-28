
<template>
    <div class="warp">
      <Form  label-position="top">
            <Row>
                <Col span="1" style="line-height:35px">标题:</Col>
                <Col span="23">
                  <Input v-model="title"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="1" style="line-height:35px">类型:</Col>
                <Col span="23">
                  <Select v-model="newsType">
                      <Option v-for="item in listType" :value="item.code"  key="">{{item.name}}</Option>
                  </Select>
                </Col>
            </Row>
            <Row>
              <Col span="1" style="line-height:35px">宣传图:</Col>
              <Col span="23">
                  <el-upload class="upload-demo" ref="upload" name="files" :action="acturl" :file-list="fileList" :before-upload="handlePreview" :on-success="uploadSuccess" :show-file-list="true" list-type="jpg/png/bmp/gif" :auto-upload="false" :data="uploadParamData"  :headers="uploadParamHeader">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">立即上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M<br/>{{ loadingStatus ? '上传中....' : '' }}</div>
                  </el-upload>
              </Col>
            </Row>
            <Row>
                <Col span="1" style="line-height:35px">新闻状态:</Col>
                <Col span="23">
                  <Select v-model="newsState">
                      <Option v-for="item in listState" :value="item.code"  key="">{{item.name}}</Option>
                  </Select>
                </Col>
            </Row>
            <Row>
                    <Col span="1" style="line-height:35px">发布时间:</Col>
                    <Col span="23">
                    <DatePicker type="date" :editable="enablew" :format="dateFormat" @on-change="changeDate1" v-model="cdate" placeholder="选择日期"></DatePicker>
                    </Col>
            </Row>
            <Row>
                <Col span="1" style="line-height:35px">外部URL:</Col>
                <Col span="23">
                <Input v-model="newsurl"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="1" style="line-height:35px">摘要:</Col>
                <Col span="23">
                <Input v-model="summary"></Input>
                </Col>
            </Row>
            <Row>
              <Col span="1" style="line-height:35px">相关附件:</Col>
              <Col span="23">
              <el-upload class="upload-demo" ref="upload2" name="files" :multiple="multipleFile" :action="acturl" :file-list="fileList2" :before-upload="handlePreview2" :on-success="uploadSuccess2" :show-file-list="true" :auto-upload="false" :data="uploadParamData2"  :headers="uploadParamHeader">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2">立即上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M<br/>{{ loadingStatus ? '上传中....' : '' }}</div>
              </el-upload>
              </Col>
            </Row>
      </Form>
      <ul  class="fileLi_box">
        <li class="fileLi" v-for="item in fileUploadList" key="">{{item.fileName}}&nbsp;<Icon type="ios-close" @click.native="delFile(item.id)"></Icon></li>
      </ul>
        <div class="">内容</div>
        <div id="editorElem" style="text-align:left" v-model="content"></div>
        <div class="button_box">
            <button type="button" name="button" class="back" @click="back">返回</button>
            <button type="button" name="button" class="submit" @click="EditNews">保存</button>
        </div>

    </div>
</template>

<script>
    import E from 'wangeditor'

    export default {
      name: 'editor',
      data () {
        return {
          enablew:false,
          dateFormat:'yyyy-MM-dd',
          editorContent: '',
          title:'',
          newsImg:'',
          fileList:[],
          fileList2:[],
          fileUploadList:[],
          newsType:0,
          multipleFile:true,
          loadingStatus: false,
          newsState:0,
          listState:0,
          listType:[],
          fileCode:'',
          content:'',
          uploadParamData:{},
          uploadParamHeader:{},
          uploadParamData2:{},
          acturl:"",
          summary:"",
          newsurl:"",
          cdate:'',
        }
      },
      mounted() {
        this.$http.post(this.getHostUrl()+'/adminNews/getNews.do?newsId='+this.$route.query.newsId).then(function(data){
              this.title=data.body.title,
              this.newsType=data.body.newsType,
              this.newsState=data.body.newsState,
              this.cdate=data.body.cdate,
              this.newsurl=data.body.newsUrl,
              this.summary=data.body.summary;
              this.content=data.body.content;
              this.fileCode=data.body.fileCode;
              this.newsImg=data.body.newsImg;
              editor.txt.html(data.body.content);
              this.uploadParamData2={fileCode:this.fileCode};
              this.getFileUploadList();
        },function(error){
        });
        this.uploadParamHeader={"USER-TOKEN":window.localStorage.getItem("token")};
        this.uploadParamData={fileCode:''};
        this.acturl=this.getHostUrl()+"/commonUploadOrDownload/uploadBackJson.do";
        this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
              var codelist=eval(data.body.data);
              this.listType=this.getCodeArray(codelist,'NEWSTYPE');
              this.listState=this.getCodeArray(codelist,'STATE');
        },function(error){
        });
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
      },
      methods: {
        back(){
          window.history.go(-1)
        },
        changeDate1(data){
          this.cdate=data;
        },
        getFileUploadList(){
          this.$http.post(this.getHostUrl()+'/commonUploadOrDownload/getFileListByFileCode.do?fileCode='+this.fileCode).then(function(data){
            this.fileUploadList=data.body;
          },function(error){
          });
        },
        delFile(v_id){
          this.$http.post(this.getHostUrl()+'/commonUploadOrDownload/delUpload.do?fileId='+v_id).then(function(data){
            this.getFileUploadList();
          },function(error){
          });
        },
        warning () {
        this.$Message.warning('标题不能为空');
        },
        success () {
        this.$Message.success('修改成功');
        },
        error() {
                this.$Message.error('上传失败');
        },
        EditNews(){
          if(this.title.length<1){
            this.warning()
          }else{
            this.content=this.editorContent
            this.$http.post(this.getHostUrl()+'/adminNews/edit.do',{
              newsId:this.$route.query.newsId,
              title:this.title,
              newstype:this.newsType,
              newsImg:this.newsImg,
              content:this.content,
              summary:this.summary,
              newsurl:this.newsurl,
              tdate:this.cdate,
              newsState:this.newsState
            },{emulateJSON:true}).then(function(data){
              this.success()
              this.back()
            },function(error){
            });
          }
        },
        submitUpload() {
          this.$refs.upload.submit();
        },
        handlePreview(file) {
            this.file=file;
            if(this.file.name.indexOf("jpg")>=0||this.file.name.indexOf("png")>=0||this.file.name.indexOf("bmp")>=0||this.file.name.indexOf("gif")>=0){
              this.loadingStatus=true;
              return true;
            }else{
              this.$Notice.warning({
                  title: '文件格式不正确',
                  desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的文件。'
              });
              this.loadingStatus=false;
              return false;
            }
        },
        uploadSuccess(res, file,fileList){
               if(res.code==0){
                 this.newsImg=res.data[0].url;
               }else{
                 this.error()
               }
               this.$refs.upload.clearFiles();
               this.loadingStatus=false;
               return;
          },
          submitUpload2() {
            this.$refs.upload2.submit();
          },
          handlePreview2(file) {
              this.loadingStatus=true;
              return true;
          },
          uploadSuccess2(res, file,fileList){
             if(res.code==0){
             }else{
               this.error()
             }
             this.loadingStatus=false;
             this.getFileUploadList();
             return;
          }
      }

    }
</script>

<style scoped>
.warp{
  padding:5rem
}
.button_box{
  overflow: hidden;
}
.submit{
  width: 45%;
  float: right;
  height: 50px;
  margin-top: 10px;
  font-size: 18px;
  background-color: #2d8cf0;
  border: none;
  border-radius: 8px;
  color:white
}
.back{
  float: left;
  width: 45%;
  height: 50px;
  margin-top: 10px;
  font-size: 18px;
  background-color: #2d8cf0;
  border: none;
  border-radius: 8px;
  color:white
}
.fileLi_box{
  overflow: hidden;
  margin-bottom: 10px;
}
.fileLi{
  float:left;
  list-style:none;
  margin-right: 10px;
}
</style>
