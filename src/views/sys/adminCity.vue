<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem>地区县市管理</BreadcrumbItem>
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
        <Modal v-model="modal2" title="添加或编辑"  :loading="loading" @on-ok="ok" @on-cancel="cancel" v-for="item in datatable" key=""  width="800">
              <Form  label-position="top">
                    <FormItem label="名称">
                        <Input v-model="city_name"></Input>
                    </FormItem>
                    <FormItem label="类型">
                        <Select v-model="city_type" :disabled="show_city_type">
                            <Option v-for="item in city_type_List" :value="item.value" key="">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="序号">
                        <Select v-model="int_order" :value="item.value">
                            <Option v-for="item in cityList" :value="item.value" key="">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
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
              modal2:false,
              city_name:"",
              parentId:1,
              loading:true,
              id:0,
              show_city_type:true,
              listType:[],
              listState:[],
              city_type_List: [
                    {
                        value: 1,
                        label: '省'
                    },
                    {
                        value: 0,
                        label: '市'
                    },
                    {
                        value: 2,
                        label: '区县'
                    }
                ],
              city_type:0,
              cityList: [
                    {
                        value: 0,
                        label: '0'
                    },
                    {
                        value: 1,
                        label: '1'
                    },
                    {
                        value: 2,
                        label: '2'
                    },
                    {
                        value: 3,
                        label: '3'
                    },
                    {
                        value: 4,
                        label: '4'
                    },
                    {
                        value: 5,
                        label: '5'
                    }
                    ,
                    {
                        value: 6,
                        label: '6'
                    },
                    {
                        value: 7,
                        label: '7'
                    },
                    {
                        value: 8,
                        label: '8'
                    },
                    {
                        value: 9,
                        label: '9'
                    },
                    {
                        value: 10,
                        label: '10'
                    }
                ],
              int_order:0,
              baseData: [
                {
                  // id:1,
                  // isParent:1,
                  // title: '中华人民共和国',
                  // expand: true,
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
                      key: 'city_name'
                  },
                  {
                      title: '类型',
                      key: 'city_type_name'
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
              //  this.$http.post(this.getHostUrl()+'/adminCommonTree/getCityTree.do?pId=1').then(function(data){
              //      for(var i=0;i<data.body.length;i++){
              //         data.body[i].expand=false;
              //         this.baseData[0].children.push(data.body[i])
              //      }
              //  },function(error){
              //  }),
              //  this.queryTable(this.parentId);
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
                this.show_city_type=true;
                this.flag=2;
                this.city_name=this.datatable[index].city_name
                this.city_type=this.datatable[index].city_type
                this.int_order=Number(this.datatable[index].int_order)
                this.id=this.datatable[index].id
                this.modal2=true;
            },
          //添加
          add:function(){
            this.show_city_type=false;
            this.flag=1
            this.city_name=''
            this.city_type=2
            this.int_order=10
            this.modal2=true
          },
          ok () {
            if(this.flag==2){
              console.log(this.int_order)
              if(!this.city_name==""&&!this.int_order==""){
                    this.$http.post(this.getHostUrl()+'/adminCityManager/edit.do',{
                      id:this.id,
                      city_name:this.city_name,
                      city_type:this.city_type,
                      int_order:this.int_order
                      },{emulateJSON:true}).then(function(data){
                          this.queryTable(this.parentId);
                          this.modal2=false;
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
              if(!this.city_name==""){
                        this.$http.post(this.getHostUrl()+'/adminCityManager/add.do',{
                          int_order:Number(this.int_order),
                          city_type:this.city_type,
                          city_name:this.city_name,
                          up_id:this.parentId
                          },{emulateJSON:true}).then(function(data){
                              this.queryTable(this.parentId);
                              this.modal2=false
                          },function(error){
                          })
                }else{
                  this.$vux.alert.show({
                    title: '提示',
                    content: '选项不能为空'
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
          // selectChg:function(selectData){
          //   //以上是右边列表项
          //   if(selectData.length<1){
          //     return;
          //   }
          //   if(selectData[0].isParent==0){
          //       this.$vux.alert.show({
          //         title: '提示',
          //         content: '请选择省市'
          //       });
          //       this.datatable=[];
          //     return;
          //   }
          //   this.queryTable(selectData[0].id);
          // },
          queryTable:function(upid){
            this.$http.post(this.getHostUrl()+'/adminCityManager/findCityByUpId.do',{up_id:upid},{emulateJSON:true}) .then(function(data){
              this.datatable=eval(data.body.data)
              console.log(data)
                  for(var i=0;i<this.datatable.length;i++){
                    if(this.datatable[i].city_type==0){
                      this.datatable[i].city_type_name="市"
                    }else if(this.datatable[i].city_type==1){
                      this.datatable[i].city_type_name="省"
                    }else if(this.datatable[i].city_type==2){
                      this.datatable[i].city_type_name="区县"
                    }
                  }
                  this.parentId=upid;
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
                _this.$http.post(_this.getHostUrl()+'/adminCityManager/del.do',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
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
