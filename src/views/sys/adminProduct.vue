<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>商城管理</BreadcrumbItem>
          <BreadcrumbItem>产品分类管理</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
          <li><button type="button" name="button" @click="add"><Icon type="plus"></Icon>&nbsp;添加</button></li>
          <li><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
      </ul>
      </div>
        <el-tree :data="baseData" :props="defaultProps" :load="loadNode" lazy="" @node-click="handleNodeClick"></el-tree>
        <!-- <Tree :data="baseData" selected="true" @on-select-change="selectChg"></Tree> -->
        <div class="content">
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectAll"></Table>
        </div>
        <!--修改弹出框开始-->
        <Modal v-model="modal2" title="添加或编辑" :loading="loading"  @on-ok="ok" @on-cancel="cancel" >
              <Form  label-position="top">
                    <FormItem label="序号">
                        <Select v-model="kindOrder">
                            <Option v-for="item in listOrder" :value="item.value"  key="">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="名称">
                        <Input v-model="kind_name"></Input>
                    </FormItem>
                    <Row>
                      <Col span="5" style="line-height:35px">宣传图:</Col>
                      <Col span="19">
                          <el-upload class="upload-demo" ref="upload" name="files" :action="acturl" :file-list="fileList" :before-upload="handlePreview" :on-success="uploadSuccess" :show-file-list="true" list-type="jpg/png/bmp/gif" :auto-upload="false" :data="uploadParamData"  :headers="uploadParamHeader">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">立即上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png/bmp/gif文件，且不超过10M<br/>{{ loadingStatus ? '上传中....' : '' }}</div>
                          </el-upload>
                      </Col>
                    </Row>
                    <div class=""></div>
              </Form>
        </Modal>
        <!--修改弹出框结束-->
    </div>
  </div>
</template>
<script>
export default {
        data () {
            return {
              flag:0,
              loading:true,
              modal2:false,
              parentId:0,
              kind_name:'',
              kindImg:'',
              ImgList:'',
              acturl:"",
              kindOrder:0,
              fileList:[],
              uploadParamData:{},
              uploadParamHeader:{},
              loadingStatus: false,
              selectIds:'',
              TreedataIds:'',
              id:0,
              listOrder:[
                    {
                        value: 0,
                        name: 0
                    },
                    {
                        value: 1,
                        name: 1
                    },
                    {
                        value: 2,
                        name: 2
                    },
                    {
                        value: 3,
                        name: 3
                    },
                    {
                        value: 4,
                        name: 4
                    },
                    {
                        value: 5,
                        name: 5
                    },
                    {
                        value: 6,
                        name: 6
                    },
                    {
                        value: 7,
                        name: 7
                    },
                    {
                        value: 8,
                        name: 8
                    },
                    {
                        value: 9,
                        name: 9
                    },
                    {
                        value: 10,
                        name: 10
                    }
              ],
              baseData: [
                {
                  id:1,
                  isParent:1,
                  title: '中华人民共和国',
                  expand: true,
                  children:[],
                }
              ],
              baseData2: [
                {
                  id:1,
                  isParent:1,
                  title: '中华人民共和国',
                  expand: true,
                  children:[],
                }
              ],
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
                      key: 'kind_name'
                  },
                  {
                      title: '序号',
                      key: 'kind_order'
                  },
                  {
                      title: '操作',
                      key: 'action',
                      width: 80,
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
              datatable: [],
              defaultProps: {
                children: 'children',
                label: 'name'
              },
            }
        },
          created() {
            this.fileCode=new Date().getTime();
            this.uploadParamHeader={"USER-TOKEN":window.localStorage.getItem("token")};
            this.uploadParamData={fileCode:''};
            this.uploadParamData2={fileCode:this.fileCode};
            this.acturl=this.getHostUrl()+"/commonUploadOrDownload/uploadBackJson.do";
               this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
                     var codelist=eval(data.body.data);
                     this.listType=this.getCodeArray(codelist,'STATE');
               },function(error){
               });
               this.queryTable(this.parentId);
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
                   this.newsImg=res.data[0].url;
                 }else{
                   this.$vux.alert.show({
                     title: '提示',
                     content: '上传失败'
                   });
                 }
                 this.$refs.upload.clearFiles();
                 this.loadingStatus=false;
                 return;
            },
          loadNode(node, resolve) {
            if(node.level>0){
              this.parentId=node.data.id
            }
            if(node.level==4){
              resolve([]);
              return;
            }
            this.$http.post(this.getHostUrl()+'/adminProductKindManager/getKindTree.do?pId='+this.parentId).then(function(data){
              var treedata=[];
                for(var i=0;i<data.body.length;i++){
                  treedata.push(data.body[i])
                }
                resolve(treedata);
            },function(error){
            })
          },
          handleNodeClick(data) {
            // if(data.isParent==0){
            if(data.isParent>0){
              this.parentId=data.id;
              this.queryTable(this.parentId)
            }else{
              return
            }
            // }else{
            //   this.parentId=1;
            //   this.datatable=[];
            // }
          },
          cancel () {
          },
          show (index) {
                this.flag=2;
                this.kind_name=this.datatable[index].kind_name
                this.kindOrder=this.datatable[index].kind_order
                this.newsImg=this.datatable[index].kind_img
                this.id=this.datatable[index].id
                this.modal2=true;
            },
          //添加
          add:function(){
            this.flag=1
            this.kind_name=""
            this.newsImg=""
            this.kindOrder=""
            this.modal2=true
          },
          ok () {
            if(this.flag==2){
              if(!this.kind_name==""){
                      this.$http.post(this.getHostUrl()+'/adminProductKindManager/edit.do',{
                        kindName:this.kind_name,
                        kindImg:this.newsImg,
                        kindOrder:this.kindOrder,
                        kindId:this.id
                        },{emulateJSON:true}).then(function(data){
                            this.queryTable(this.parentId);
                            this.modal2=false
                        },function(error){
                        })
              }else{
                  this.$vux.alert.show({
                    title: '提示',
                    content: '内容不能为空'
                  });
                  this.modal2=false;
                  setTimeout(() => {
                            this.modal2=true;
                        }, 200);
                  return;
                }
              }else{
                if(!this.kind_name==""){
                        this.$http.post(this.getHostUrl()+'/adminProductKindManager/add.do',{
                          kindName:this.kind_name,
                          kindImg:this.newsImg,
                          kindOrder:this.kindOrder,
                          upId:this.parentId
                          },{emulateJSON:true}).then(function(data){
                              this.queryTable(this.parentId);
                              this.modal2=false
                          },function(error){
                          })
                }else{
                  this.$vux.alert.show({
                    title: '提示',
                    content: '内容不能为空'
                  });
                  this.modal2=false;
                  setTimeout(() => {
                            this.modal2=true;
                        }, 200);
                  return;
                }
            }
          },
          //选中或展开某个节点时调用
          selectChg:function(selectData){
              //以上是右边列表项
              if(selectData.length<1){
                return;
              }
              if(selectData[0].isParent==0){
                this.queryTable(selectData[0].id);
              }else{
                this.queryTable(0);
              }
          },
          queryTable:function(upid){
            this.parentId=upid;
            this.$http.post(this.getHostUrl()+'/adminProductKindManager/listAll.do',{upId:upid},{emulateJSON:true}) .then(function(data){
              this.datatable=eval(data.body.data)
            },function(error){
            });
          },
          //删除
          selectAll:function(data){
            this.selectIds="";
            for(var j=0;j<data.length;j++){
              this.selectIds+=","+data[j].id;
            }
          },
          // TreeAll(selectData){
          //   if(selectData.length<1){
          //     return;
          //   }
          //   if(selectData[0].isParent==0){
          //     this.TreedataIds=selectData[0].id
          //   }else{
          //     this.TreedataIds=0;
          //   }
          // },

          checkCity(data){
            if(data.length<1){
              return;
            }
            if(data.isParent==0){
              this.TreedataIds=data.id
            }else{
              this.TreedataIds=0;
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
                _this.$http.post(_this.getHostUrl()+'/adminProductKindManager/del.do.do',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
                   this.queryTable(this.parentId);
                 },function(error){
                 });
              }
            });
          },
        }
    }
</script>
<style media="screen">
@import '../../static/css/style.css';
</style>
