<template>
    <div>
            <div class="title_top">
              <Breadcrumb separator=">">
                  <BreadcrumbItem>首页</BreadcrumbItem>
                  <BreadcrumbItem>商城管理</BreadcrumbItem>
                  <BreadcrumbItem>商城广告管理</BreadcrumbItem>
              </Breadcrumb>
                <ul class="butt_right">
                    <!-- <li><router-link to="/sys/adminModal"><button type="button" name="button" @click="addMessage"><Icon type="plus"></Icon>&nbsp;添加</button></router-link></li> -->
                    <li><button type="button" name="button" @click="addMessage"><Icon type="plus"></Icon>&nbsp;添加</button></li>
                    <li style="margin:0 10px 0 10px"><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
                </ul>
            </div>
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectChg"></Table>
            <Modal v-model="modal4" width="820px" @on-ok="ok">
              <Row>
                  <Col span="2" style="line-height:35px">名称:</Col>
                  <Col span="22">
                    <Input v-model="adv_name"></Input>
                  </Col>
              </Row>
              <Row>
                  <Col span="2" style="line-height:35px">图地址:</Col>
                  <Col span="22">
                    <el-upload class="upload-demo" :on-remove="remPic" ref="upload" name="files" :action="acturl" :file-list="fileList" :before-upload="handlePreview" :on-success="uploadSuccess" :show-file-list="true" list-type="picture"  :auto-upload="false" :data="uploadParamData"  :headers="uploadParamHeader">
                      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">立即上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png/bmp/gif文件，且不超过10M<br/>{{ loadingStatus ? '上传中....' : '' }}</div>
                    </el-upload>
                  </Col>
              </Row>
              <Row>
                  <Col span="2" style="line-height:35px">链接地址:</Col>
                  <Col span="22">
                    <Input v-model="browse_url"></Input>
                  </Col>
              </Row>
            </Modal>
    </div>
</template>
<script>
export default {
        data () {
            return {
                modal4:false,
                flag:0,
                acturl:"",
                fileList:[],
                list:[],
                uploadParamData:{},
                uploadParamHeader:{},
                loadingStatus: false,
                adv_name:'',
                img_url:'',
                browse_url:'',
                rem_url:'',
                loading:true,
                totype:0,
                id:0,
                selectIds:'',
                columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'ID',
                        key: 'id'
                    },
                    {
                        title: '名称',
                        key: 'adv_name'
                    },
                    {
                        title: '链接地址',
                        key: 'browse_url'
                    },
                    {
                        title: '宣传图',
                        key: 'img_url'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                datatable: []
            }
        },
          mounted() {
            this.fileCode=new Date().getTime();
            this.uploadParamHeader={"USER-TOKEN":window.localStorage.getItem("token")};
            this.uploadParamData={fileCode:''};
            this.uploadParamData2={fileCode:this.fileCode};
            this.acturl=this.getHostUrl()+"/commonUploadOrDownload/uploadBackJson.do";
            this.query();
          },
        methods: {
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
                   this.rem_url=2
                   this.img_url=res.data[0].url;
                 }else{
                   this.$vux.alert.show({
                     title: '提示',
                     content: '上传失败'
                   });
                 }

                 this.loadingStatus=false;
                 return;
            },
          remPic(data){
            this.rem_url=1
          },
          ok(){
                    if(this.flag==1){
                          if(!this.adv_name==""&&!this.img_url==""){
                          this.$http.post(this.getHostUrl()+'/adminMallAdvManager/add.do',{
                            adv_name:this.adv_name,
                            img_url:this.img_url,
                            browse_url:this.browse_url
                          },{emulateJSON:true}).then(function(data){
                            this.query()
                          },function(error){
                          })
                        }else{
                          this.$vux.alert.show({
                            title: '提示',
                            content: '内容不能为空'
                          });
                          this.modal4=false;
                          setTimeout(() => {
                                    this.modal4=true;
                                }, 200);
                          return;
                        }
                    }else if(this.flag==2){
                      if(!this.adv_name==""&&!this.img_url==""){
                        if(this.rem_url==1){
                          this.img_url=''
                          this.$http.post(this.getHostUrl()+'/adminMallAdvManager/edit.do',{
                            id:this.id,
                            adv_name:this.adv_name,
                            img_url:this.img_url,
                            browse_url:this.browse_url
                          },{emulateJSON:true}).then(function(data){
                            this.query()
                            this.rem_url=0
                          },function(error){
                          })
                        }else{
                          this.$http.post(this.getHostUrl()+'/adminMallAdvManager/edit.do',{
                            id:this.id,
                            adv_name:this.adv_name,
                            img_url:this.img_url,
                            browse_url:this.browse_url
                          },{emulateJSON:true}).then(function(data){
                            this.query()
                            this.rem_url=0
                          },function(error){
                          })
                        }

                    }else{
                      this.$vux.alert.show({
                        title: '提示',
                        content: '内容不能为空'
                      });
                      this.modal4=false;
                      setTimeout(() => {
                                this.modal4=true;
                            }, 200);
                      return;
                    }
                    }
          },
          addMessage(){
              this.flag=1
              this.modal4=true
              this.adv_name=""
              this.fileList=[]
              this.img_url=""
              this.browse_url=""
          },
          query(){
              this.$http.post(this.getHostUrl()+'/adminMallAdvManager/listAll.do').then(function(data){
                   this.datatable=eval(data.body.data);
              },function(error){
              })
          },
          sync:function(){
              this.query();
          },
          selectChg(data){
            this.selectIds="";
            for(var j=0;j<data.length;j++){
              this.selectIds+=","+data[j].id;
            }
          },
          del:function(){
            if(this.selectIds.length<1){
              this.$vux.alert.show({
                title: '提示',
                content: '没有选中删除项'
              });
              return;
            }
            const _this = this;
            this.$vux.confirm.show({
              title:'提示',
              content:'你真的要删除吗?',
              onCancel () {
              },
              onConfirm () {
                _this.$http.post(_this.getHostUrl()+'/adminMallAdvManager/del.do?',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
                   this.query();
                 },function(error){
                 });
              }
            });
          },
          show (index) {
                this.flag=2
                this.fileList=[]
                this.id=this.datatable[index].id
                this.adv_name=this.datatable[index].adv_name
                this.img_url=this.datatable[index].img_url
                if(this.img_url==""){
                  this.fileList=[]
                }else{
                  this.fileList.push({url:this.img_url})
                }
                this.browse_url=this.datatable[index].browse_url

                this.modal4=true
            }
        }
    }
</script>
<style media="screen">

@import '../../static/css/style.css';
.butt_right li:nth-child(2){
  margin:auto
}
</style>
