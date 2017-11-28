<template>
    <div>
            <div class="title_top">
              <Breadcrumb separator=">">
                  <BreadcrumbItem>首页</BreadcrumbItem>
                  <BreadcrumbItem>系统设置</BreadcrumbItem>
                  <BreadcrumbItem>参数配置</BreadcrumbItem>
              </Breadcrumb>
                <ul class="butt_right">
                    <li><button type="button" name="button" @click="add"><Icon type="plus"></Icon>&nbsp;添加</button></li>
                    <li><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
                    <li><button type="button" name="button" @click="sync"><Icon type="shuffle"></Icon>&nbsp;同步内存</button></li>
                </ul>
            </div>
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectChg"></Table>
            <Page :total="totalRecord" show-total :page-size="pageSize" @on-change="changepage"></Page>
          <!--以下是弹出框-->
          <!--修改弹出框开始-->
          <Modal v-model="modal2" :loading="loading" title="添加或编辑" @on-ok="ok" @on-cancel="cancel" v-for="item in datatable" key=""  width="800">
                <Form  label-position="top">
                      <FormItem label="列表名称">
                          <Input v-model="cList"></Input>
                      </FormItem>
                      <FormItem label="变量名称">
                          <Input v-model="cVar"></Input>
                      </FormItem>
                      <FormItem label="值名称">
                          <Input v-model="cText"></Input>
                      </FormItem>
                      <FormItem label="值">
                          <Input v-model="cCode"></Input>
                      </FormItem>
                      <FormItem label="描述">
                          <Input v-model="cDesc"></Input>
                      </FormItem>
                      <FormItem label="序号">
                          <Input v-model="cSort"></Input>
                      </FormItem>
                      <FormItem label="变量类型">
                          <Select v-model="cType">
                              <Option v-for="item in listType" :value="item.code"  key="">{{item.name}}</Option>
                          </Select>
                      </FormItem>
                      <FormItem label="状态">
                          <Select v-model="cState">
                              <Option v-for="item in listState" :value="item.code"  key="">{{item.name}}</Option>
                          </Select>
                      </FormItem>
                </Form>
          </Modal>
          <!--修改弹出框结束-->
    </div>
</template>
<script>
export default {
        data () {
            return {
                flag:0,
                modal1: false,
                modal2: false,
                page:0,
                list:[],
                pagNum:1,
                totalRecord:0,
                loading:true,
                pageSize:0,
                cList:"",
                cVar:"",
                cText:'',
                cId:"",
                cCode:'',
                vState:"",
                cDesc:"",
                cType:"",
                cState:0,
                DelCid:"",
                cSort:"",
                cTime:"",
                listType:[],
                listState:[],
                selectIds:'',
                columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '列表名称',
                        key: 'cList'
                    },
                    {
                        title: '变量名称',
                        key: 'cVar'
                    },
                    {
                        title: '显示值',
                        key: 'cId'
                    },
                    {
                        title: '值',
                        key: 'vState'
                    },
                    {
                        title: '描述',
                        key: 'cDesc'
                    },
                    {
                        title: '类型',
                        key: 'cType'
                    },
                    {
                        title: '状态',
                        key: 'cState'
                    },
                    {
                        title: '排序号',
                        key: 'cSort'
                    },
                    {
                        title: '创建时间',
                        key: 'cTime'
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
                datatable: []
            }
        },
          created() {
                    this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
                          var codelist=eval(data.body.data);
                          this.listType=this.getCodeArray(codelist,'TYPE');
                          this.listState=this.getCodeArray(codelist,'STATE');
                    },function(error){
                    });
                    this.query();
          },
        methods: {
          query(){
              this.$http.post(this.getHostUrl()+'/adminParamManager/listAll.do',{start:this.pagNum},{emulateJSON:true}).then(function(data){
                   this.page=data.body.totalPage
                   this.totalRecord=data.body.totalRecord
                   this.pageSize=data.body.pageSize
                   this.datatable=eval(data.body.data);
              },function(error){
              })
          },
          sync:function(){
            this.$http.post(this.getHostUrl()+'/adminParamManager/sync.do').then(function(data){
            },function(error){
            })
          },
          add(){
            this.flag=1;
            this.cList=''
            this.cVar=''
            this.cId=0
            this.cCode=''
            this.cDesc=''
            this.cSort=''
            this.cTime=''
            this.cType=''
            this.cState=''
            this.modal2=true;
          },
          selectChg(data){
            this.selectIds="";
            for(var j=0;j<data.length;j++){
              this.selectIds+=","+data[j].cId;
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
                _this.$http.post(_this.getHostUrl()+'/adminParamManager/del.do?',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
                   this.query();
                 },function(error){
                 });
              }
            });
          },
          show (index) {
              this.flag=2;
                this.cList=this.datatable[index].cList
                this.cVar=this.datatable[index].cVar
                this.cId=this.datatable[index].cId
                this.cText=this.datatable[index].cText
                this.cCode=this.datatable[index].cCode
                this.cDesc=this.datatable[index].cDesc
                this.cSort=this.datatable[index].cSort
                this.cTime=this.datatable[index].cTime
                this.cType=this.datatable[index].vType;
                this.cState=this.datatable[index].vState;
                this.modal2=true;
            },
            changepage:function(index){
                this.$http.post(this.getHostUrl()+'/adminParamManager/listAll.do?start='+index).then(function(data){
                         this.page=data.body.totalPage
                         this.totalRecord=data.body.totalRecord
                         this.pageSize=data.body.pageSize
                         this.datatable=data.body.data
                  },function(error){
                  })
            },
            ok () {
              if(this.flag==2){
                if(!this.cList==""&&!this.cVar==""&&!this.cText==""&&!this.cDesc==""&&!this.cType==""&&!this.cState==""){
                    this.$http.post(this.getHostUrl()+'/adminParamManager/edit.do',{
                      cId:this.cId,
                      cList:this.cList,
                      cVar:this.cVar,
                      cText:this.cText,
                      cCode:this.cCode,
                      cDesc:this.cDesc,
                      cType:this.cType,
                      cState:this.cState,
                      cSort:this.cSort},{emulateJSON:true}).then(function(data){
                          this.query();
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
                if(!this.cList==""&&!this.cVar==""&&!this.cText==""&&!this.cDesc==""&&!this.cType==""&&!this.cState==""){
                    this.$http.post(this.getHostUrl()+'/adminParamManager/add.do',{
                      cId:this.cId,
                      cList:this.cList,
                      cVar:this.cVar,
                      cText:this.cText,
                      cCode:this.cCode,
                      cDesc:this.cDesc,
                      cType:this.cType,
                      cState:this.cState,
                      cSort:this.cSort},{emulateJSON:true}).then(function(data){
                        this.pagNum=1;
                        this.query();
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
            cancel () {
            }
        }
    }
</script>
<style media="screen">
@import '../../static/css/style.css';
</style>
