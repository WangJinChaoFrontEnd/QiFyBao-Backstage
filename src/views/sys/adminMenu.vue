<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem>菜单项目管理</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
          <li><button type="button" name="button" @click="add"><Icon type="plus"></Icon>&nbsp;添加</button></li>
          <li><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
      </ul>
      </div>
        <Tree :data="baseData" selected="true" @on-select-change="selectChg"></Tree>
        <div class="content">
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectAll"></Table>
        </div>
        <!--修改弹出框开始-->
        <Modal v-model="modal2" title="添加或编辑" :loading="loading" @on-ok="ok" @on-cancel="cancel" v-for="item in datatable" key="" width="800">
              <Form  label-position="top">
                    <FormItem label="名称">
                        <Input v-model="menuName"></Input>
                    </FormItem>
                    <FormItem label="类型">
                        <Select v-model="menuType">
                            <Option v-for="item in listType" :value="item.code"  key="">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="URL">
                        <Input v-model="menuUrl"></Input>
                    </FormItem>
                    <FormItem label="序号">
                        <Input v-model="menuOrder"></Input>
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
              name:[],
              flag:0,
              modal2:false,
              menuUrl:"",
              menuName:"",
              menuOrder:1,
              menuType:0,
              menuId:'',
              menuIcon:'',
              loading:true,
              parentId:1,
              menuLevel:0,
              listType:[],
              listState:[],
              baseData: [
                {
                  id:1,
                  isParent:1,
                  title: '菜单项目',
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
                      title: '名称',
                      key: 'menuName'
                  },
                  {
                      title: '类型',
                      key: 'menuType'
                  },
                  {
                      title: 'URL',
                      key: 'menuUrl'
                  },
                  {
                      title: '序号',
                      key: 'menuOrder'
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
               this.$http.post(this.getHostUrl()+'/adminCommonTree/getSubMenuTree.do?pId=1').then(function(data){
                   for(var i=0;i<data.body.length;i++){
                      data.body[i].expand=false;
                      this.baseData[0].children.push(data.body[i])
                   }
               },function(error){
               }),
               this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
                     var codelist=eval(data.body.data);
                     this.listType=this.getCodeArray(codelist,'MENU_TYPE');
                     this.listState=this.getCodeArray(codelist,'STATE');
               },function(error){
               });
               this.queryTable(this.parentId);
          },
        methods: {
          cancel () {
          },
          show (index) {
              this.flag=2;
                this.menuName=this.datatable[index].menuName
                this.menuUrl=this.datatable[index].menuUrl
                this.menuOrder=this.datatable[index].menuOrder
                this.menuType=this.datatable[index].menuType;
                this.menuId=this.datatable[index].menuId;
                this.menuIcon=this.datatable[index].menuIcon;
                this.modal2=true;
            },
          //添加
          add:function(){
            this.flag=1
            this.menuUrl=''
            this.menuOrder=''
            this.menuName=''
            this.menuType=""
            this.modal2=true
          },
          ok () {
            if(this.flag==2){
                if(!this.menuUrl==""&&!this.menuOrder==""&&!this.menuType==""&&!this.menuName==""){
                  this.$http.post(this.getHostUrl()+'/adminMenuManager/edit.do',{
                    menuId:this.menuId,
                    menuUrl:this.menuUrl,
                    menuOrder:this.menuOrder,
                    menuType:this.menuType,
                    menuName:this.menuName,
                    menuIcon:this.menuIcon,
                    menuLevel:0
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
              if(!this.menuUrl==""&&!this.menuOrder==""&&!this.menuType==""&&!this.menuName==""){
              if(this.parentId>1){
                this.menuLevel=1;
              }else{
                this.menuLevel=0;
              }
              this.$http.post(this.getHostUrl()+'/adminMenuManager/add.do',{
                menuUrl:this.menuUrl,
                menuOrder:this.menuOrder,
                menuType:this.menuType,
                menuName:this.menuName,
                parentId:this.parentId,
                menuIcon:this.menuIcon,
                menuLevel:this.menuLevel
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
            }
          },
          //选中或展开某个节点时调用
          selectChg:function(selectData){
            //以上是右边列表项
            if(selectData.length<1){
              return;
            }
            if(selectData[0].isParent==0){
                this.$vux.alert.show({
                  title: '提示',
                  content: '请选择一级菜单'
                });
              return;
            }
            this.queryTable(selectData[0].id);
          },
          queryTable:function(upid){
            this.parentId=upid;
            this.$http.post(this.getHostUrl()+'/adminMenuManager/listAll.do',{parentId:upid},{emulateJSON:true}) .then(function(data){
                  if(data.body.data.length==0){
                    this.datatable=[{menuName:'暂无数据'}];
                  }else{
                    this.datatable=eval(data.body.data)
                  }
            },function(error){
            });
          },
          //删除
          selectAll:function(data){
            this.selectIds="";
            for(var j=0;j<data.length;j++){
              this.selectIds+=","+data[j].menuId;
            }
          },
          del:function(){
            console.log(this.datatable)
            if(this.datatable.length<1){
              this.$vux.alert.show({
                title: '提示',
                content: '列表为空'
              });
              return
            }
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
                _this.$http.post(_this.getHostUrl()+'/adminMenuManager/del.do',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
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
