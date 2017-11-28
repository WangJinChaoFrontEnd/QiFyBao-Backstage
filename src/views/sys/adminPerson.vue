<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem>人员管理与权限</BreadcrumbItem>
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
        <Modal v-model="modal2" :loading="loading" title="添加或编辑" @on-ok="ok" @on-cancel="cancel" v-for="item in datatable" key="" width="800">
              <Form  label-position="top">
                    <FormItem label="姓名">
                        <Input v-model="userName"></Input>
                    </FormItem>
                    <FormItem label="手机号">
                        <Input v-model="mobile"></Input>
                    </FormItem>
                    <FormItem label="密码">
                        <Input type="password" v-model="pwd"></Input>
                    </FormItem>
                    <FormItem label="状态">
                        <Select v-model="uState">
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
              userName:"",
              mobile:"",
              deptName:'',
              loading:true,
              userSex:1,
              uState:"",
              pwd:'',
              parentId:1,
              listType:[],
              columns4: [
                  {
                      type: 'selection',
                      width: 60,
                      align: 'center'
                  },
                  {
                      title: 'ID',
                      key: 'userId'
                  },
                  {
                      title: '姓名',
                      key: 'userName'
                  },
                  {
                      title: '手机号',
                      key: 'mobile'
                  },
                  {
                      title: '部门信息',
                      key: 'deptName'
                  },
                  {
                      title: '状态',
                      key: 'uState'
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
            console.log(this.datatable)
              this.flag=2;
                this.userId=this.datatable[index].userId
                this.userName=this.datatable[index].userName
                this.mobile=this.datatable[index].mobile
                this.userSex=this.datatable[index].uSex;
                this.uState=this.datatable[index].uState;
                this.modal2=true;
            },
          //添加
          add:function(){
            this.modal2=true,
            this.flag=1,
            this.userName='',
            this.mobile='',
            this.userSex=1,
            this.uState=""
          },
          ok () {
            if(this.flag==2){
              if(!this.userName==""&&!this.userSex==""&&!this.pwd==""&&!this.mobile==""&&!this.uState==""){
                    this.$http.post(this.getHostUrl()+'/adminUserManager/edit.do',{
                      userId:this.userId,
                      userName:this.userName,
                      userSex:this.userSex,
                      pwd:this.pwd,
                      mobile:this.mobile,
                      userState:this.uState
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
                if(!this.userName==""&&!this.userSex==""&&!this.mobile==""&&!this.uState==""){
                  this.$http.post(this.getHostUrl()+'/adminUserManager/add.do',{
                    userName:this.userName,
                    userSex:this.userSex,
                    mobile:this.mobile,
                    userState:this.uState
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
            this.$http.post(this.getHostUrl()+'/adminUserManager/list.do') .then(function(data){
                  this.datatable=eval(data.body.data)
            },function(error){
            });
          },
          //删除
          selectAll:function(data){
            this.selectIds="";
            for(var j=0;j<data.length;j++){
              this.selectIds+=","+data[j].userId;
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
                _this.$http.post(_this.getHostUrl()+'/adminUserManager/del.do',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
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
</style>
