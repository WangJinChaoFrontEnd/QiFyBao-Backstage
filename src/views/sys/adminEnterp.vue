<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem>企业机构管理</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
          <li><button type="button" name="button" @click="add"><Icon type="plus"></Icon>&nbsp;添加</button></li>
          <li><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
          <li><button type="button" name="button" @click="modifyCity"><Icon type="map"></Icon>&nbsp;调区域</button></li>
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
                <FormItem label="公司状态">
                    <Select v-model="corp_state">
                        <Option v-for="item in listType" :value="item.code"  key="">{{item.name}}</Option>
                    </Select>
                </FormItem>
                    <FormItem label="公司名称">
                        <Input v-model="corp_name"></Input>
                    </FormItem>
                    <FormItem label="公司法人">
                        <Input v-model="corp_faren"></Input>
                    </FormItem>
                    <FormItem label="联系人">
                        <Input v-model="corp_contact_name"></Input>
                    </FormItem>
                    <FormItem label="联系人手机">
                        <Input v-model="corp_contact_mobile"></Input>
                    </FormItem>
                    <FormItem label="公司电话">
                        <Input v-model="corp_phone"></Input>
                    </FormItem>
                    <FormItem label="公司邮箱">
                        <Input v-model="corp_mail"></Input>
                    </FormItem>
                    <FormItem label="公司地址">
                        <Input v-model="corp_address"></Input>
                    </FormItem>
              </Form>
        </Modal>
        <!--修改弹出框结束-->
        <!--修改弹出框开始-->
        <Modal v-model="modal3" title="选择新的区域" :loading="loading"  @on-ok="saveCorpCity" @on-cancel="cancel"  key="">
            <el-tree :data="baseData" :props="defaultProps" :load="loadNode" lazy="" @node-click="checkCity" style="width:100%" ></el-tree>
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
              modal3:false,
              parentId:1,
              corp_name:'',
              corp_faren:'',
              corp_contact_name:'',
              corp_contact_mobile:'',
              corp_phone:'',
              corp_mail:'',
              corp_address:'',
              corp_state:'',
              selectIds:'',
              TreedataIds:'',
              id:0,
              listType:[],
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
                      title: '公司名称',
                      key: 'corp_name'
                  },
                  {
                      title: '公司法人',
                      key: 'corp_faren'
                  },
                  {
                      title: '联系人',
                      key: 'corp_contact_name'
                  },
                  {
                      title: '联系人手机',
                      key: 'corp_contact_mobile'
                  },
                  {
                      title: '公司电话',
                      key: 'corp_phone'
                  },
                  {
                      title: '公司邮箱',
                      key: 'corp_mail'
                  },
                  {
                      title: '公司地址',
                      key: 'corp_address'
                  },
                  {
                      title: '公司状态',
                      key: 'corp_state',
                      render: (h, params) => {
                          return h('div', [
                              h('span', params.row.corp_state>0?'可用':'不可用')
                          ]);
                      }
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
                label: 'title'
              },
            }
        },
          created() {
               this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
                     var codelist=eval(data.body.data);
                     this.listType=this.getCodeArray(codelist,'STATE');
               },function(error){
               });
               this.queryTable(this.parentId);
          },
        methods: {
          loadNode(node, resolve) {
            if(node.level>0){
              this.parentId=node.data.id
            }
            if(node.level==4){
              resolve([]);
              return;
            }
            this.$http.post(this.getHostUrl()+'/adminCommonTree/getCityTree.do?pId='+this.parentId).then(function(data){
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
              this.parentId=data.id;
              this.queryTable(this.parentId)
            // }else{
            //   this.parentId=1;
            //   this.datatable=[];
            // }
          },
          cancel () {
          },
          show (index) {
                this.flag=2;
                this.corp_name=this.datatable[index].corp_name
                this.corp_faren=this.datatable[index].corp_faren
                this.corp_contact_name=this.datatable[index].corp_contact_name
                this.corp_contact_mobile=this.datatable[index].corp_contact_mobile
                this.corp_phone=this.datatable[index].corp_phone
                this.corp_mail=this.datatable[index].corp_mail
                this.corp_address=this.datatable[index].corp_address
                this.corp_state=this.datatable[index].corp_state
                this.id=this.datatable[index].id
                this.modal2=true;
            },
          //添加
          add:function(){
            if(this.parentId==0){
              this.$vux.alert.show({
                title: '提示',
                content: '请先选择区县'
              });
              return;
            }
            this.flag=1
            this.corp_name=""
            this.corp_faren=""
            this.corp_contact_name=""
            this.corp_contact_mobile=""
            this.corp_phone=""
            this.corp_mail=""
            this.corp_address=""
            this.corp_state=""
            this.modal2=true
          },
          ok () {
            if(this.flag==2){
                if(!this.corp_name==""&&!this.corp_faren==""&&!this.corp_contact_name==""&&!this.corp_contact_mobile==""&&!this.corp_phone==""&&!this.corp_mail==""&&!this.corp_address==""&&!this.corp_state==""){
                      this.$http.post(this.getHostUrl()+'/adminCorpManager/edit.do',{
                        corpId:this.id,
                        corpName:this.corp_name,
                        corpFaren:this.corp_faren,
                        corpContactName:this.corp_contact_name,
                        corpContactMobile:this.corp_contact_mobile,
                        corpPhone:this.corp_phone,
                        corpMail:this.corp_mail,
                        corpAddress:this.corp_address,
                        corpState:this.corp_state
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
                if(!this.corp_name==""&&!this.corp_faren==""&&!this.corp_contact_name==""&&!this.corp_contact_mobile==""&&!this.corp_phone==""&&!this.corp_mail==""&&!this.corp_address==""&&!this.corp_state==""){
                        this.$http.post(this.getHostUrl()+'/adminCorpManager/add.do',{
                          corpName:this.corp_name,
                          corpFaren:this.corp_faren,
                          corpContactName:this.corp_contact_name,
                          corpContactMobile:this.corp_contact_mobile,
                          corpPhone:this.corp_phone,
                          corpMail:this.corp_mail,
                          corpAddress:this.corp_address,
                          corpState:this.corp_state,
                          cityId:this.parentId
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
            this.$http.post(this.getHostUrl()+'/adminCorpManager/list.do',{cityId:upid},{emulateJSON:true}) .then(function(data){
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
          modifyCity(){
            if(this.selectIds.length<1){
              this.$vux.alert.show({
                title: '提示',
                content: '请选择要调整的公司'
              });
              return;
            }
            this.modal3 = true;
            return;
          },
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
          saveCorpCity(){
            if(this.TreedataIds==0){
              this.$vux.alert.show({
                title: '提示',
                content: '请选择要区县'
              });
              if(this.selectIds.length<1){
                this.$vux.alert.show({
                  title: '提示',
                  content: '请选择要调整的公司'
                });
              }
              this.modal3=false;
              setTimeout(() => {
                        this.modal3=true;
                    }, 200);
              return;
            }
            this.$http.post(this.getHostUrl()+'/adminCorpManager/editCity.do',{ids:this.selectIds,cityId:this.TreedataIds},{emulateJSON:true}).then(function(data){
              this.queryTable(this.parentId);
              this.modal3 = false;
            },function(error){
            });
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
                _this.$http.post(_this.getHostUrl()+'/adminCorpManager/del.do',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
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
