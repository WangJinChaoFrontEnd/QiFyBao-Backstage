<template>
    <div>
            <div class="title_top">
              <Breadcrumb separator=">">
                  <BreadcrumbItem>首页</BreadcrumbItem>
                  <BreadcrumbItem>系统设置</BreadcrumbItem>
                  <BreadcrumbItem>系统消息管理</BreadcrumbItem>
              </Breadcrumb>

                <ul class="butt_right">
                    <!-- <li><router-link to="/sys/adminModal"><button type="button" name="button" @click="addMessage"><Icon type="plus"></Icon>&nbsp;添加</button></router-link></li> -->
                    <li><button type="button" name="button" @click="addMessage"><Icon type="plus"></Icon>&nbsp;添加</button></li>
                    <li style="margin:0 10px 0 10px"><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
                </ul>
            </div>
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectChg"></Table>
            <Page :total="totalRecord" show-total :page-size="pageSize" @on-change="changepage"></Page>
            <Modal v-model="modal4" width="820px" @on-ok="ok">
              <Row>
                  <Col span="2" style="line-height:35px">标题:</Col>
                  <Col span="22">
                    <Input v-model="title"></Input>
                  </Col>
              </Row>
              <Row>
                  <Col span="2" style="line-height:35px">接受目标:</Col>
                  <Col span="22">
                      <Select v-model="totype">
                          <Option v-for="item in listType" :value="item.code"  key="">{{item.name}}</Option>
                      </Select>
                  </Col>
              </Row>
              <Row>
                  <Col span="2" style="line-height:35px">目标ID:</Col>
                  <Col span="22">
                      <Input v-model="toid"></Input>
                  </Col>
              </Row>
              <Row>
                  <Col span="2" style="line-height:35px">状态:</Col>
                  <Col span="22">
                    <Select v-model="state">
                        <Option v-for="item in listState" :value="item.code"  key="">{{item.name}}</Option>
                    </Select>
                  </Col>
              </Row>
              <Row>
                  <Col span="2" style="line-height:35px">摘要:</Col>
                  <Col span="22">
                    <Input v-model="summary"></Input>
                  </Col>
              </Row>
              <div class="">
                内容:
              </div>
              <div id="editorElem" style="text-align:left"></div>
            </Modal>
    </div>
</template>
<script>
import E from 'wangeditor'
export default {
        data () {
            return {
                modal4:false,
                flag:0,
                page:0,
                list:[],
                pagNum:1,
                totalRecord:0,
                loading:true,
                pageSize:0,
                totype:0,
                toid:'',
                title:'',
                content:'',
                summary:'',
                msgId:0,
                state:1,
                cList:"",
                cVar:"",
                content:'',
                category:'',
                cId:"",
                cCode:'',
                vState:"",
                cType:"",
                cState:0,
                DelCid:"",
                cSort:"",
                cTime:"",
                newsId:0,
                newsType:0,
                listType:[
                  {
                    code:-1,
                    name:'全部'
                  },
                  {
                    code:0,
                    name:'用户类型'
                  },
                  {
                    code:1,
                    name:'企业'
                  },
                  {
                    code:2,
                    name:'个人'
                  },
                ],
                listState:[],
                selectIds:'',
                columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'ID',
                        key: 'msgId'
                    },
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '接收ID',
                        key: 'to_id'
                    },
                    {
                        title: '接收目标',
                        key: 'to_type'
                    },
                    {
                        title: '状态',
                        key: 'state',
                        render: (h, params) => {
                            return h('div', [
                                h('span', params.row.state>0?'可用':'不可用')
                            ]);
                        }
                    },
                    {
                        title: '发布时间',
                        key: 'ctime'
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
                  // this.$http.post(this.getHostUrl()+'/adminSysMessage/getMessage.do',{msgId:this.msgId},{emulateJSON:true}).then(function(data){
                  //          this.summary=data.body.summary
                  //          editor.txt.html(data.body.content)
                  //   },function(error){
                  //   })
                    var editor = new E('#editorElem')
                    editor.customConfig.uploadImgMaxLength = 1
                    editor.customConfig.uploadImgTimeout = 30000
                    editor.customConfig.uploadImgServer = this.HOST+'/resources/wangEditor/jsp/upload_json.jsp'
                    editor.customConfig.onchange = (html) => {
                      this.content = html
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
                    this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
                          var codelist=eval(data.body.data);
                          this.listState=this.getCodeArray(codelist,'STATE')
                    },function(error){
                    });
                    this.newsType=0;
                    this.query();

          },
        methods: {
          ok(){
                    if(this.totype=="全部"){
                      this.totype=-1
                    }else if(this.totype=="用户类型"){
                      this.totype=0
                    }else if(this.totype=="企业"){
                      this.totype=1
                    }else if(this.totype=="个人"){
                      this.totype=2
                    }
                    if(this.flag==1){
                          if(!this.title==""&&!this.state==""){

                          this.$http.post(this.getHostUrl()+'/adminSysMessage/add.do',{
                            totype:this.totype,
                            toid:this.toid,
                            title:this.title,
                            content:this.content,
                            summary:this.summary,
                            state:this.state
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
                      if(!this.title==""&&!this.state==""){
                      this.$http.post(this.getHostUrl()+'/adminSysMessage/edit.do',{
                        msgId:this.msgId,
                        totype:this.totype,
                        toid:this.toid,
                        title:this.title,
                        content:this.content,
                        summary:this.summary,
                        state:this.state
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
                    }
          },
          addMessage(){
            var editor = new E('#editorElem')
            editor.customConfig.uploadImgMaxLength = 1
            editor.customConfig.uploadImgTimeout = 30000
            editor.customConfig.uploadImgServer = this.HOST+'/resources/wangEditor/jsp/upload_json.jsp'
            editor.customConfig.onchange = (html) => {
              this.content = html
            };
            editor.create()
            editor.txt.clear()
              this.flag=1
              this.modal4=true
              this.totype=""
              this.toid=""
              this.title=""
              this.summary=""
              this.state=""
              this.content=""
          },
          query(){
              this.$http.post(this.getHostUrl()+'/adminSysMessage/listAll.do',{start:this.pagNum},{emulateJSON:true}).then(function(data){
                   this.page=data.body.totalPage
                   this.totalRecord=data.body.totalRecord
                   this.pageSize=data.body.pageSize
                   this.datatable=eval(data.body.data);
                   for(var i=0;i<this.datatable.length;i++){
                     if(this.datatable[i].to_type==-1){
                       this.datatable[i].to_type="全部"
                     }else if(this.datatable[i].to_type==0){
                       this.datatable[i].to_type="用户类型"
                     }else if(this.datatable[i].to_type==1){
                       this.datatable[i].to_type="企业"
                     }else if(this.datatable[i].to_type==2){
                       this.datatable[i].to_type="个人"
                     }
                   }
              },function(error){
              })
          },
          sync:function(){
              this.query();
          },
          selectChg(data){
            this.selectIds="";
            for(var j=0;j<data.length;j++){
              this.selectIds+=","+data[j].msgId;
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
                _this.$http.post(_this.getHostUrl()+'/adminSysMessage/del.do?',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
                   this.query();
                 },function(error){
                 });
              }
            });
          },
          show (index) {
                this.flag=2
                if(this.totype=="全部"){
                  this.totype=-1
                }else if(this.totype=="用户类型"){
                  this.totype=0
                }else if(this.totype=="企业"){
                  this.totype=1
                }else if(this.totype=="个人"){
                  this.totype=2
                }
                this.msgId=this.datatable[index].msgId
                this.toid=this.datatable[index].to_id,
                this.title=this.datatable[index].title,
                this.totype=this.datatable[index].to_type,
                this.state=this.datatable[index].state,
                this.modal4=true
                var editor = new E('#editorElem')
                editor.customConfig.uploadImgMaxLength = 1
                editor.customConfig.uploadImgTimeout = 30000
                editor.customConfig.uploadImgServer = this.HOST+'/resources/wangEditor/jsp/upload_json.jsp'
                editor.customConfig.onchange = (html) => {
                  this.content = html
                };
                editor.create()
                this.$http.post(this.getHostUrl()+'/adminSysMessage/getMessage.do',{msgId:this.msgId},{emulateJSON:true}).then(function(data){
                         this.summary=data.body.summary
                         this.content=data.body.content
                         editor.txt.html(this.content)
                  },function(error){
                  })

            },
            changepage:function(index){
                this.$http.post(this.getHostUrl()+'/adminNews/listAll.do',{start:index,newstype_q:0,ordername:'id'},{emulateJSON:true}).then(function(data){
                         this.page=data.body.totalPage
                         this.totalRecord=data.body.totalRecord
                         this.pageSize=data.body.pageSize
                         this.datatable=data.body.data
                  },function(error){
                  })
            },
        }
    }
</script>
<style media="screen">

@import '../../static/css/style.css';
.butt_right li:nth-child(2){
  margin:auto
}
</style>
