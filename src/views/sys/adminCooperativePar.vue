<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>商城管理</BreadcrumbItem>
          <BreadcrumbItem>合作伙伴管理</BreadcrumbItem>
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
        <Modal v-model="modal2" :loading="loading" title="编辑内容" @on-ok="ok" @on-cancel="cancel" v-for="item in datatable" key="">
              <Form  label-position="top">
                    <FormItem label="状态">
                        <Select v-model="state">
                            <Option v-for="item in listType" :value="item.code"  key="">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="企业名称">
                        <Input v-model="mall_name"></Input>
                    </FormItem>
                    <FormItem label="企业简称">
                        <Input v-model="mall_shortname"></Input>
                    </FormItem>
                    <FormItem label="营业执照号">
                        <Input v-model="yyzzh"></Input>
                    </FormItem>
                    <FormItem label="地址">
                        <Input v-model="adress"></Input>
                    </FormItem>
                    <FormItem label="办公电话">
                        <Input v-model="office_phone"></Input>
                    </FormItem>
                    <FormItem label="法人代表">
                        <Input v-model="legal_name"></Input>
                    </FormItem>
                    <FormItem label="联系人">
                        <Input v-model="conact_name"></Input>
                    </FormItem>
                    <FormItem label="联系人电话">
                        <Input v-model="conact_phone"></Input>
                    </FormItem>
                    <FormItem label="客服QQ">
                        <Input v-model="qq"></Input>
                    </FormItem>
                    <FormItem label="企业网址">
                        <Input v-model="conact_url"></Input>
                    </FormItem>
                    <FormItem label="企业介绍">
                        <Input v-model="content"></Input>
                    </FormItem>
              </Form>
        </Modal>
        <!--修改弹出框结束-->
        <Page :total="totalRecord" show-total :page-size="pageSize" @on-change="changepage"></Page>
    </div>
  </div>
</template>
<script>
export default {
        data () {
            return {
              flag:0,
              modal2:false,
              mall_name:'',
              PagNum:1,
              totalRecord:0,
              pageSize:0,
              mall_shortname:'',
              yyzzh:'',
              adress:'',
              conact_phone:'',
              office_phone:'',
              legal_name:'',
              conact_name:'',
              conact_phone:'',
              qq:'',
              conact_url:'',
              content:'',
              loading:true,
              state:1,
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
                      width: 60,
                      title: 'ID',
                      key: 'id'
                  },
                  {
                      title: '企业名称',
                      key: 'mall_name'
                  },
                  {
                      title: '企业简称',
                      key: 'mall_shortname'
                  },
                  {
                      title: '营业执照号',
                      key: 'yyzzh'
                  },
                  {
                      width: 100,
                      title: '法人代表',
                      key: 'legal_name'
                  },
                  {
                      width: 100,
                      title: '联系人',
                      key: 'conact_name'
                  },
                  {
                      title: '联系电话',
                      key: 'conact_phone'
                  },
                  {
                      title: '客服QQ',
                      key: 'qq'
                  },
                  {
                      width: 100,
                      title: '状态',
                      key: 'state',
                      render: (h, params) => {
                          return h('div', [
                              h('span', params.row.state>0?'可用':'不可用')
                          ]);
                      }
                  },
                  {
                      title: '时间',
                      key: 'ctime'
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
                this.queryTable()
               this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
                     var codelist=eval(data.body.data);
                     this.listType=this.getCodeArray(codelist,'STATE');
               },function(error){
               });
          },
        methods: {
          cancel () {
          },
          changepage:function(index){
              this.PagNum=index
              this.queryTable()
          },
          show (index) {
              this.flag=2;
              this.id=this.datatable[index].id

              this.modal2=true;
              this.$http.post(this.getHostUrl()+'/adminPartnersManager/getPartners.do?partnersId='+this.id) .then(function(data){
                    this.mall_name=data.body.data.mall_name
                    this.mall_shortname=data.body.data.mall_shortname;
                    this.yyzzh=data.body.data.yyzzh
                    this.adress=data.body.data.address;
                    this.office_phone=data.body.data.office_phone
                    this.legal_name=data.body.data.legal_name;
                    this.conact_name=data.body.data.conact_name
                    this.conact_phone=data.body.data.conact_phone;
                    this.content=data.body.data.company_text
                    this.conact_url=data.body.data.website;
                    this.qq=data.body.data.qq
                    this.state=data.body.data.state;
              },function(error){
              });
            },
          //添加
          add:function(){
            this.modal2=true,
            this.flag=1,
            this.mall_name=''
            this.mall_shortname='';
            this.yyzzh=''
            this.adress=''
            this.office_phone=''
            this.legal_name=''
            this.conact_name=''
            this.conact_phone=''
            this.content=''
            this.conact_url=''
            this.qq=''
            this.state=1
          },
          ok () {
            if(this.flag==2){
              if(!this.mall_name==""){
                    this.$http.post(this.getHostUrl()+'/adminPartnersManager/edit.do',{
                      partnersId:this.id,
                      mallName:this.mall_name,
                      mallShortname:this.mall_shortname,
                      yyzzh:this.yyzzh,
                      address:this.adress,
                      officePhone:this.office_phone,
                      legalName:this.legal_name,
                      conactName:this.conact_name,
                      conactPhone:this.conact_phone,
                      companyText:this.content,
                      webSite:this.conact_url,
                      qq:this.qq,
                      state:this.state
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
                if(!this.mall_name==""){
                  this.$http.post(this.getHostUrl()+'/adminPartnersManager/add.do',{
                    mallName:this.mall_name,
                    mallShortname:this.mall_shortname,
                    yyzzh:this.yyzzh,
                    address:this.adress,
                    officePhone:this.office_phone,
                    legalName:this.legal_name,
                    conactName:this.conact_name,
                    conactPhone:this.conact_phone,
                    companyText:this.content,
                    webSite:this.conact_url,
                    qq:this.qq,
                    state:this.state
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
            this.$http.post(this.getHostUrl()+'/adminPartnersManager/listAll.do?start='+this.PagNum) .then(function(data){
                  this.totalRecord=data.body.totalRecord
                  this.pageSize=data.body.pageSize
                  this.datatable=eval(data.body.data)
                  console.log(data)
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
                _this.$http.post(_this.getHostUrl()+'/adminPartnersManager/del.do',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
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
