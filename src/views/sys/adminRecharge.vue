<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>数据统计</BreadcrumbItem>
          <BreadcrumbItem>充值待处理</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
          <li><button type="button" name="button" @click="sub">确认充值</button></li>
      </ul>
      </div>
        <div>
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectAll"></Table>
        </div>
        <!--修改弹出框开始-->
        <Modal v-model="modal2" title="添加或编辑" >
          <table border="1" cellspacing="0" cellpadding="0" class="table">
              <tr>
                  <td>发票抬头</td>
                  <td>{{invoice_title}}</td>
                  <td>备注</td>
                  <td>{{invoice_memo}}</td>
              </tr>
              <tr>
                  <td>地址</td>
                  <td>{{address}}</td>
                  <td>联系人</td>
                  <td>{{contact_name}}</td>
              </tr>
              <tr>
                  <td>发票类型</td>
                  <td>{{invoiceType}}</td>
                  <td>邮编</td>
                  <td>{{postcode}}</td>
              </tr>
              <tr>
                  <td>税务类型</td>
                  <td>{{taxType}}</td>
                  <td>税务数字</td>
                  <td>{{tax_no}}</td>
              </tr>
              <tr>
                  <td>联系电话</td>
                  <td>{{contact_phone}}</td>
              </tr>
          </table>
            <h3 style="margin:20px 0 20px 0">相关资质截图:</h3>
            <ul v-for="item in imgList" class="imglist">
                <li><a :href="item.newFileName">{{item.fileName}}</a></li>
            </ul>
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
              contact_name:'',
              tax_no:'',
              imgList:[],
              address:'',
              contact_phone:'',
              invoice_title:'',
              postcode:'',
              invoiceType:'',
              fileCode:'',
              taxType:'',
              invoice_memo:'',
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
                      title: '企业名称',
                      key: 'corp_name'
                  },
                  {
                      title: '支付内容',
                      key: 'pay_content'
                  },
                  {
                      title: '支付金额',
                      key: 'pay_amount_real'
                  },
                  {
                      title: '支付状态',
                      key: 'pay_state',
                      render: (h, params) => {
                          return h('div', [
                              h('span', params.row.pay_state>0?'已支付':'未支付')
                          ]);
                      }
                  },
                  {
                      title: '支付时间',
                      key: 'pay_time'
                  },
                  {
                      title: '操作',
                      key: 'action',
                      width: 220,
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
                              }, '获取发票信息')
                          ]);
                      }
                  }
              ],
              datatable: []
            }
        },
          created() {
                this.queryTable()
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
              this.$http.post(this.getHostUrl()+'/adminCorpCash/getCashInvoiceInfo.do?cashId='+this.id) .then(function(data){
                    console.log(data)
                    this.contact_name=data.body.data.contact_name
                    this.address=data.body.data.address
                    this.tax_no=data.body.data.tax_no
                    this.contact_phone=data.body.data.contact_phone
                    this.invoice_title=data.body.data.invoice_title
                    this.postcode=data.body.data.postcode
                    this.invoiceType=data.body.data.invoiceType
                    this.fileCode=data.body.data.fileCode
                    this.taxType=data.body.data.taxType
                    this.invoice_memo=data.body.data.invoice_memo
                    this.imgList=data.body.data.filelist
              },function(error){
              });
            },
          queryTable:function(){
            this.$http.post(this.getHostUrl()+'/adminCorpCash/queryWaitCash.do?start='+this.PagNum) .then(function(data){
                  this.totalRecord=data.body.totalRecord
                  this.pageSize=data.body.pageSize
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
          sub:function(){
            if(this.selectIds==""||this.datatable==''){
              this.$vux.alert.show({
                title: '提示',
                content: '没有选中充值项'
              });
              return;
            }else{
                    this.$http.post(this.getHostUrl()+'/adminCorpCash/doCash.do',{ids:this.selectIds,payState:1},{emulateJSON:true}).then(function(data){
                       this.queryTable();
                     },function(error){
                     });
                 }
          },
        }
    }
</script>
<style media="screen">
@import '../../static/css/style.css';
.ivu-modal-body{
  height: 400px
}
.imglist li{
  border-bottom: solid 1px #e6e6e6;
  line-height: 30px;
}
.imglist li a{
color:#333
}
.table,.table tr th,.table tr td { border:1px solid #ddd; }
.table tr{width: 100%}
.table { width: 100%;  line-height: 25px; text-align: center; border-collapse: collapse;}
.table td:nth-child(even){width: 35%}
.table td:nth-child(odd){width: 15%;background-color: #f0f0f0}
</style>
