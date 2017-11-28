<template>
    <div>
            <div class="title_top">
              <Breadcrumb separator=">">
                  <BreadcrumbItem>首页</BreadcrumbItem>
                  <BreadcrumbItem>系统设置</BreadcrumbItem>
                  <BreadcrumbItem>角色管理与授权</BreadcrumbItem>
              </Breadcrumb>
                <ul class="butt_right">
                    <li><button type="button" name="button" @click="add"><Icon type="plus"></Icon>&nbsp;添加</button></li>
                    <li><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
                </ul>
            </div>
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectChg"></Table>
          <!--以下是弹出框-->
          <!--修改弹出框开始-->
           <Modal v-model="modal2" title="添加或编辑" @on-ok="ok" @on-cancel="cancel" v-for="item in datatable" key="" width="800">
                <Form  label-position="top">
                      <FormItem label="列表名称">
                          <Input v-model="roleName"></Input>
                      </FormItem>
                </Form>
          </Modal>
          <!--修改弹出框结束-->
          <!--绑定菜单开始-->
           <Modal v-model="modal1" :loading="loading" title="角色菜单管理" @on-ok="saveRoleMenu" @on-cancel="cancel" v-for="item in datatable" key="" width="800">
                <Form  label-position="top">
                      <FormItem label="列表名称">
                          <Tree :data="baseData" multiple show-checkbox ref="tree"></Tree>
                      </FormItem>
                </Form>
          </Modal>
          <!--绑定菜单结束-->
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
                flag:1,
                ids:'',
                list:[],
                loading:true,
                pagNum:1,
                totalRecord:0,
                pageSize:0,
                roleId:"",
                roleName:"",
                toggleId:'',
                roleType:"",
                selectIds:'',
                baseData: [
                  {
                    id:1,
                    isParent:1,
                    expand: true,
                    title: '菜单项目',
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
                        key: 'roleId'
                    },
                    {
                        title: '名称',
                        key: 'roleName'
                    },
                    {
                        title: '状态',
                        key: 'roleType'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 180,
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
                                            // this.modal2=true
                                        }
                                    }
                                }, '修改按钮'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.bindmenu(params.index)
                                        }
                                    }
                                }, '绑定菜单')
                            ]);
                        }
                    }
                ],
                datatable: []
            }
        },
          created() {
                    this.$http.post(this.getHostUrl()+'/adminDeptRole/listRole.do',{corpId:-1},{emulateJSON:true}).then(function(data){
                          var codelist=eval(data.body.data);
                          this.datatable=eval(data.body.data)
                          this.listType=this.getCodeArray(codelist,'TYPE');
                          this.listState=this.getCodeArray(codelist,'STATE');
                    },function(error){
                    });
          },
        methods: {
          bindmenu(index){
            this.baseData=[{
              id:1,
              isParent:1,
              expand: true,
              title: '菜单项目',
              children:[],
            }];
            this.roleId=this.datatable[index].roleId
            this.$http.post(this.getHostUrl()+'/adminCommonTree/getSubMenuTreeByRole.do',{pId:'p_1',roleId:this.roleId},{emulateJSON:true}).then(function(data){
                for(var i=0;i<data.body.length;i++){
                   data.body[i].expand=false;
                   this.baseData[0].children.push(data.body[i])
                }
                this.modal1=true
            },function(error){
            });
          },
          saveRoleMenu(){
            this.ids='';
            var data=this.$refs.tree[0].getCheckedNodes();
            for(var i=0;i<data.length;i++){
              // if(data[i].isParent==0){
                this.ids+=","+data[i].id;
              // }
            }
            this.$http.post(this.getHostUrl()+'/adminDeptRole/editRoleMenu.do',{ids:this.ids,roleId:this.roleId},{emulateJSON:true}).then(function(data){
              this.modal1=false;
            },function(error){
            });
          },
          query(){
              this.$http.post(this.getHostUrl()+'/adminDeptRole/listRole.do',{corpId:-1},{emulateJSON:true}).then(function(data){
                var codelist=eval(data.body.data);
                this.datatable=eval(data.body.data)
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
              this.selectIds+=","+data[j].roleId;
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
                _this.$http.post(_this.getHostUrl()+'/adminDeptRole/delRole.do?',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
                   this.query();
                 },function(error){
                 });
              }
            });
          },
          show (index) {
              this.flag=2;
                this.roleName=this.datatable[index].roleName
                this.roleId=this.datatable[index].roleId
                this.modal2=true;
            },
            ok () {
              if(this.flag==2){
                if(!this.roleName==""){
                  this.$http.post(this.getHostUrl()+'/adminDeptRole/editRole.do',{
                    roleId:this.roleId,
                    roleName:this.roleName
                    },{emulateJSON:true}).then(function(data){
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
                if(!this.roleName==""){
                    this.$http.post(this.getHostUrl()+'/adminDeptRole/addRole.do',{
                      corpId:-1,
                      roleName:this.roleName,
                      roleType:1
                      },{emulateJSON:true}).then(function(data){
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
