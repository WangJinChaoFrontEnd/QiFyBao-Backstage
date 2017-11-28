<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>商城管理</BreadcrumbItem>
          <BreadcrumbItem>产品属性管理</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
          <li><button type="button" name="button" @click="add"><Icon type="plus"></Icon>&nbsp;添加</button></li>
          <li><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
      </ul>
      </div>
        <div>
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectAll"></Table>
        </div>
        <!--修改弹出框开始-->
        <Modal v-model="modal2" :loading="loading" title="添加或编辑" @on-ok="ok" @on-cancel="cancel" v-for="item in datatable" key="">
              <Form  label-position="top">
                    <FormItem label="名称">
                        <Input v-model="prop_name"></Input>
                    </FormItem>
                    <FormItem label="状态">
                        <Select v-model="state">
                            <Option v-for="item in listType" :value="item.code"  key="">{{item.name}}</Option>
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
              prop_name:"",
              loading:true,
              state:"",
              parentId:1,
              id:0,
              listType:[],
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
                      key: 'prop_name'
                  },
                  {
                      title: '状态',
                      key: 'state',
                      render: (h, params) => {
                          return h('div', [
                              h('span', params.row.isDept>0?'不可用':'可用')
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
              datatable: []
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
          cancel () {
          },
          show (index) {
              this.flag=2;
              this.id=this.datatable[index].id
                this.prop_name=this.datatable[index].prop_name
                this.state=this.datatable[index].state;
                this.modal2=true;
            },
          //添加
          add:function(){
            this.modal2=true,
            this.flag=1,
            this.prop_name=''
          },
          ok () {
            if(this.flag==2){
              if(!this.prop_name==""){
                    this.$http.post(this.getHostUrl()+'/adminProductPropManager/edit.do',{
                      propId:this.id,
                      propName:this.prop_name,
                      propState:this.state
                      },{emulateJSON:true}).then(function(data){
                          this.queryTable();
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
                if(!this.prop_name==""){
                  this.$http.post(this.getHostUrl()+'/adminProductPropManager/add.do',{
                    propName:this.prop_name,
                    propState:this.state
                    },{emulateJSON:true}).then(function(data){
                        this.queryTable();
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
          queryTable:function(){
            this.$http.post(this.getHostUrl()+'/adminProductPropManager/listAll.do.do') .then(function(data){
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
                _this.$http.post(_this.getHostUrl()+'/adminProductPropManager/del.do',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
                   this.queryTable();
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
.ivu-modal-body{
  height: 400px
}
</style>
