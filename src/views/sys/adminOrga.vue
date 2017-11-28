<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem>组织机构管理</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
          <li><button type="button" name="button" @click="addReady"><Icon type="plus"></Icon>&nbsp;添加</button></li>
          <li><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
      </ul>
      </div>
        <Tree :data="baseData" selected="true" @on-select-change="selectChg"></Tree>
        <div class="content">
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectAll"></Table>
        </div>
        <!--修改弹出框开始-->
        <Modal v-model="modal2" title="添加或编辑" :loading="loading" @on-ok="AddorSave" @on-cancel="cancel" key="" width="800">
              <Form  label-position="top">
                    <FormItem label="名称">
                        <Input v-model="deptname"></Input>
                    </FormItem>
                    <FormItem label="类型">
                        <Select v-model="isDept">
                            <Option v-for="item in listType" :value="item.code"  key="">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="序号">
                        <Input v-model="deptOrder" type="text"></Input>
                    </FormItem>
              </Form>
        </Modal>
        <!--修改弹出框结束-->
        <!--角色指定弹出框-->
        <Modal v-model="modal1" :loading="loading" title="角色指定" @on-ok="RoleAssOk" @on-cancel="cancel" width="800">
          <div>
              <Table stripe border :columns="columns5" :data="RoleAsstable" @on-current-change="RoleAssdata" highlight-row></Table>
          </div>
        </Modal>
        <!--角色指定弹出框结束-->
        <!--人员指定弹出框-->
        <Modal v-model="modal3" :loading="loading" title="人员指定" @on-ok="personnelOk" @on-cancel="cancel">
          <div>
              <Table stripe border :columns="columns6" :data="personneltable" @on-selection-change="setAll"></Table>
          </div>
        </Modal>
        <!--人员指定弹出框结束-->
    </div>
  </div>
</template>
<script>

export default {
        data () {
            return {
              name:[],
              flag:0,
              modal2:false,
              modal1:false,
              modal3:false,
              deptId:"",
              deptname:"",
              loading:true,
              roleId:"",
              RoleA:"",
              DepRole:"",
              roleName:"",
              isDept:'',
              deptOrder:"",
              parentId:0,
              selectIds:'',
              listType:[],
              listState:[],
              baseData: [
                {
                  id:0,
                  isParent:1,
                  title: '部门结构',
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
                      key: 'deptId'
                  },
                  {
                      title: '名称',
                      key: 'deptName'
                  },
                  {
                      title: '类型',
                      key: 'isDept',
                      render: (h, params) => {
                          return h('div', [
                              h('span', params.row.isDept>0?'部门':'岗位')
                          ]);
                      }
                  },
                  {
                      title: '序号',
                      key: 'deptOrder'
                  },
                  {
                      title: '操作',
                      key: 'action',
                      width: 300,
                      align: 'center',
                      render: (h, params) => {
                          return h('div', [
                              h('Button', {
                                  props: {
                                      type: 'primary',
                                      size: 'small'
                                  },//0是岗位，1是部门
                                  style: {
                                      marginRight: '5px'
                                  },
                                  on: {
                                      click: () => {
                                          this.show(params.index)
                                      }
                                  }
                              }, '修改按钮'),
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
                                          this.RoleAssSet(params.index)
                                      }
                                  }
                              }, '角色指定'),
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
                                          this.personnelSet(params.index)
                                      }
                                  }
                              }, '人员指定')
                          ]);
                      }
                  }
              ],
              datatable: [],
              columns5: [
                  {
                      type: 'index',
                      width: 60,
                      align: 'center'
                  },
                  {
                      title: 'ID',
                      key: 'roleId'
                  },
                  {
                      title: '名称',
                      key: 'roleName'
                  }
              ],
              RoleAsstable:[],
              columns6: [
                  {
                      type: 'selection',
                      width: 60,
                      align: 'center'
                  },
                  {
                      title: '姓名',
                      key: 'uId'
                  },
                  {
                      title: '部门信息',
                      key: 'uName'
                  }
              ],
              personneltable: [],
            }
        },
        created() {
               this.$http.post(this.getHostUrl()+'/adminCommonTree/getEcDeptTree.do',{corpId:-1,pId:'p_0'},{emulateJSON:true}).then(function(data){
                   for(var i=0;i<data.body.length;i++){
                      data.body[i].expand=false;
                      this.baseData[0].children.push(data.body[i]);
                      this.parentId=0;
                   }
                   this.queryTable(this.parentId);
               },function(error){
               });
               this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
                     var codelist=eval(data.body.data);
                     this.listType=this.getCodeArray(codelist,'DEPTTYPE');
                     this.listState=this.getCodeArray(codelist,'STATE');
               },function(error){
               });
               this.queryTable(this.parentId);
        },
        methods: {
          //人员指定
          personnelSet(index){
            if(this.datatable[index].isDept==1){
              return;
            }
            this.modal3=true
            this.deptId=this.datatable[index].deptId
            this.$http.post(this.getHostUrl()+'/adminDeptRole/queryDeptUser.do?corpId=-1&deptId='+this.deptId) .then(function(data){
                   this.personneltable=eval(data.body.data)
                   for(var i=0;i<this.personneltable.length;i++){
                     if(this.personneltable[i].deptId>0){
                       this.personneltable[i]._checked=true
                     }
                   }
            },function(error){
            });
          },
          //人员指定确定
          personnelOk(){
            this.$http.post(this.getHostUrl()+'/adminDeptRole/setDeptUser.do',{ids:this.selectIds,deptId:this.deptId},{emulateJSON:true}) .then(function(data){
            },function(error){
            });
          },
          //角色指定确定
          RoleAssOk(){
            this.$http.post(this.getHostUrl()+'/adminDeptRole/setRoleDept.do',{roleId:this.RoleA,deptId:this.deptId},{emulateJSON:true}) .then(function(data){
              for(var i=0;i<this.RoleAsstable.length;i++){
                if(this.RoleAsstable[i].roleId==this.RoleA){
                  this.RoleAsstable[i]._highlight=true
                }
              }
            },function(error){
            });
          },
          //角色指定
          RoleAssSet(index){
            if(this.datatable[index].isDept==1){
              return;
            }
              this.modal1=true
              this.deptId=this.datatable[index].deptId
              this.$http.post(this.getHostUrl()+'/adminDeptRole/listRoleDept.do?corpId=-1&deptId='+this.deptId) .then(function(data){
                     this.RoleAsstable=eval(data.body.data);
                     for(var i=0;i<this.RoleAsstable.length;i++){
                       if(this.RoleAsstable[i].deptId>0){
                         this.RoleAsstable[i]._highlight=true;
                         this.RoleA=this.RoleAsstable[i].roleId;
                       }
                     }
              },function(error){
              });

          },
          RoleAssdata(data){
            this.RoleA=data.roleId
          },
          cancel () {
          },
          show (index) {
            this.modal2=true
              this.flag=2;
              this.deptname=this.datatable[index].deptName
              this.deptId=this.datatable[index].deptId
              this.deptOrder=this.datatable[index].deptOrder
              this.isDept=this.datatable[index].isDept
            },
          //添加
          addReady:function(){
            this.flag=1
            this.deptName=''
            this.isDept =1
            this.deptOrder="10"
            this.modal2=true
          },
          AddorSave () {
            this.deptOrder=this.deptOrder.replace(/[^0-9]/ig,"");
            if(this.deptOrder==null||this.deptOrder==""){
              this.deptOrder=10;
            }
            if(this.flag==2){
              if(!this.deptname==""&&!this.isDept==""&&!this.deptOrder==""){
                this.$http.post(this.getHostUrl()+'/adminDeptRole/edit.do',{
                  deptId:this.deptId,
                  deptname:this.deptname,
                  deptOrder:this.deptOrder
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
              var reg = /^[u4E00-u9FA5]+$/;
              if(this.deptname.length<1){
                this.$vux.alert.show({
                  title: '提示',
                  content: '请输入名称'
                });
              }else{
                if(!this.deptname==""&&!this.isDept==""&&!this.deptOrder==""){
                this.$http.post(this.getHostUrl()+'/adminDeptRole/add.do',{
                  deptname:this.deptname,
                  isDept:this.isDept,
                  deptOrder:this.deptOrder,
                  parentId:this.parentId,
                  corpId:-1
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
            }
          },
          //选中或展开某个节点时调用
          selectChg:function(selectData){

            //以上是右边列表项
            if(selectData.length<1){
              return;
            }else{
              this.parentId=selectData[0].id.toString().replace(/[^0-9]/ig,"")
            }
            if(selectData[0].isParent==0){
                this.$vux.alert.show({
                  title: '提示',
                  content: '请选择一级菜单'
                });
              return;
            }
            this.queryTable(this.parentId);
          },
          loca:function(data){

          },
          queryTable:function(upid){
            this.$http.post(this.getHostUrl()+'/adminDeptRole/listDept.do?corpId=-1&parentId='+upid) .then(function(data){
                  this.datatable=eval(data.body.data)
            },function(error){
            });
          },
          queryTree:function(){

          },
          //人员指定获取id
          setAll:function(data){
            this.selectIds="";
            for(var j=0;j<data.length;j++){
              this.selectIds+=","+data[j].uId;
            }
          },
          //删除
          selectAll:function(data){
            this.selectIds="";
            for(var j=0;j<data.length;j++){
              this.selectIds+=","+data[j].deptId;
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
                _this.$http.post(_this.getHostUrl()+'/adminDeptRole/del.do',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
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
@import '../../static/zTreeStyle/zTreeStyle.css';
@import '../../static/css/style.css';
</style>
