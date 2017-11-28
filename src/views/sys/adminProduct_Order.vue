<template>
  <div class="title_top">
    <div class="box">
        <Breadcrumb separator=">">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>商城管理</BreadcrumbItem>
            <BreadcrumbItem>订单管理</BreadcrumbItem>
        </Breadcrumb>
        <ul class="butt_right button_right_time">
          <li style="line-height:30px">订单状态</li>
          <li style="width:200px">
            <Select v-model="mallList_status" @on-change="mallListAll">
                <Option v-for="item in mallList" :value="item.code"  key="">{{item.name}}</Option>
            </Select>
          </li>
          <li style="line-height:30px"><p>日期:</p></li>
            <li>
                  <DatePicker type="date" :value="begindate" format="yyyy-MM-dd" placeholder="选择日期" style="width: 200px" :editable="Timetext"></DatePicker>
            </li>
            <li style="line-height:30px">——</li>
            <li>
                  <DatePicker type="date" :value="enddate" format="yyyy-MM-dd" placeholder="选择日期" style="width: 200px" :editable="Timetext"></DatePicker>
            </li>
            <li><button type="button" name="button" @click="querydate"><Icon type="search"></Icon>&nbsp;查询</button></li>
        </ul>
      </div>
        <div>
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectAll"></Table>
        </div>
        <!--评论弹出框Start-->
          <Modal v-model="modal1" :loading="loading" title="订单评论详情" @on-ok="comok" @on-cancel="cancel" v-for="item in datatable" key="">
            <Table stripe border :columns="columns1" :data="comtable" @on-selection-change="selectAll"></Table>
            <Page :total="totalRecord1" show-total :page-size="pageSize1" @on-change="changepage1"></Page>
          </Modal>
        <!--评论弹出框END-->
        <!--修改弹出框开始-->
        <Modal v-model="modal2"  title="详情" @on-ok="ok" @on-cancel="cancel" v-for="item in datatable" key="" :ok-text="okText" width="1200">
              <table border="1" cellspacing="0" cellpadding="0" class="table">
                <tr>
                  <td>物流名称</td>
                  <td>
                    <Select v-model="wl_name" @on-change="ChoiceAll">
                        <Option v-for="item in wuLiulist" :value="item.id"  key="">{{item.wuliu_name}}</Option>
                    </Select>
                  </td>
                  <td>订单号</td>
                  <td>
                    <Input v-model="wl_orderno"  disabled></Input>
                  </td>
                </tr>
                <tr>
                  <td>产品分类</td>
                  <td><Input v-model="kind_name"  disabled></Input></td>
                  <td>产品名称</td>
                  <td><Input v-model="product_name" disabled></Input></td>
                </tr>
                <tr>
                  <td>产品类型</td>
                  <td><Input v-model="productType" disabled></Input></td>
                  <td>购买数量</td>
                  <td><Input v-model="product_count" disabled></Input></td>
                </tr>
                <tr>
                  <td>支付金额</td>
                  <td style="overflow:hidden">
                    <Input style="float:left;width:200px" v-model="order_amount" :disabled="editPriceText"></Input>
                      <div  v-show="mallListButt">
                          <button style="float:left" class="edit_price" type="button" name="button"  @click="editPrice">修改金额</button>
                          <button style="float:left" class="edit_price" type="button" name="button"  @click="editPriceOk">确定</button>
                      </div>
                  </td>
                  <td>下单人</td>
                  <td><Input v-model="uname" disabled></Input></td>
                </tr>
                <tr>
                  <td>联系电话</td>
                  <td><Input v-model="mobile" disabled></Input></td>
                  <td>附加信息</td>
                  <td style="overflow:hidden">
                      <Input style="float:left;width:200px;marginRight:10px;margin-top:1px" v-model="ext_info" :disabled="editInfoText"></Input>
                      <span v-show="info_box">
                          <button style="float:left;marginRight:10px" type="button" name="button" class="edit_info" @click="editInfo">修改附加信息</button>
                          <button style="float:left;marginRight:10px" type="button" name="button" class="edit_info" @click="editInfoSub">确定</button>
                      </span>
                  </td>
                </tr>
                <tr>
                  <td>规格</td>
                  <td><Input v-model="product_specification" disabled></Input></td>
                  <td>收件人</td>
                  <td><Input v-model="contact" disabled></Input></td>
                </tr>
                <tr>
                  <td>联系电话</td>
                  <td><Input v-model="contact_mobile" disabled></Input></td>
                  <td>联系地址</td>
                  <td><Input v-model="address" disabled></Input></td>
                </tr>
                <tr>
                  <td>邮编</td>
                  <td><Input v-model="postcode" disabled></Input></td>
                  <td>状态</td>
                  <td><Input v-model="order_status" disabled></Input></td>
                </tr>
                <tr>
                  <td>物流单号</td>
                  <td><Input v-model="wl_orderno"></Input></td>
                  <td>退换货类型</td>
                  <td>
                    <RadioGroup v-model="cancel_status" @on-change="RadioAll">
                      <Radio label="待审"></Radio>
                      <Radio label="同意"></Radio>
                      <Radio label="拒绝"></Radio>
                    </RadioGroup>
                    <button v-show="cancelOkHide" style="" type="button" name="button" class="edit_info" @click="cancelOk">确定</button>
                </td>
                </tr>
                <tr>
                  <td>退换物事由</td>
                  <td><Input v-model="cancel_memo" disabled></Input></td>
                  <td>退换货物流</td>
                  <td><Input v-model="cancel_wl_name" disabled></Input></td>
                </tr>
                <tr>
                  <td>退换物流号</td>
                  <td><Input v-model="cancel_wl_orderno" disabled></Input></td>
                  <td>下单时间</td>
                  <td><Input v-model="ctime" disabled></Input></td>
                </tr>
                <tr>
                  <td>发货时间</td>
                  <td><Input v-model="wl_ctime" disabled></Input></td>
                  <td>退换货物流</td>
                  <td><Input v-model="cancel_wl_name" disabled></Input></td>
                </tr>
              </table>
              <!-- <Form  label-position="top">
                    <FormItem label="物流名称">
                        <Select v-model="wl_name" @on-change="ChoiceAll">
                            <Option v-for="item in wuLiulist" :value="item.id"  key="">{{item.wuliu_name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="订单号">
                        <Input v-model="wl_orderno"  disabled></Input>
                    </FormItem>
                    <FormItem label="产品分类">
                        <Input v-model="kind_name"  disabled></Input>
                    </FormItem>
                    <FormItem label="产品名称">
                        <Input v-model="product_name" disabled></Input>
                    </FormItem>
                    <FormItem label="产品类型">
                        <Input v-model="productType" disabled></Input>
                    </FormItem>
                    <FormItem label="购买数量">
                        <Input v-model="order_amount" disabled></Input>
                    </FormItem>
                    <FormItem label="支付金额">
                        <Input v-model="payed_amount" disabled></Input>
                    </FormItem>
                    <FormItem label="下单人">
                        <Input v-model="uname" disabled></Input>
                    </FormItem>
                    <FormItem label="联系电话">
                        <Input v-model="mobile" disabled></Input>
                    </FormItem>
                    <FormItem label="附加信息">
                        <Input v-model="ext_info" :disabled="editInfoText"></Input>
                        <button type="button" name="button" class="edit_info" @click="editInfo">修改附加信息</button>
                        <button type="button" name="button" class="edit_info" @click="editInfoSub">确定</button>
                    </FormItem>
                    <FormItem label="规格">
                        <Input v-model="product_specification" disabled></Input>
                    </FormItem>
                    <FormItem label="收件人">
                        <Input v-model="contact" disabled></Input>
                    </FormItem>
                    <FormItem label="联系电话">
                        <Input v-model="contact_mobile" disabled></Input>
                    </FormItem>
                    <FormItem label="联系地址">
                        <Input v-model="address" disabled></Input>
                    </FormItem>
                    <FormItem label="邮编">
                        <Input v-model="postcode" disabled></Input>
                    </FormItem>
                    <FormItem label="状态">
                        <Input v-model="order_status" disabled></Input>
                    </FormItem>
                    <FormItem label="物流单号">
                        <Input v-model="wl_orderno"></Input>
                    </FormItem>
                    <FormItem label="退换货类型">
                        <RadioGroup v-model="cancel_status">
                            <Radio label="待审"></Radio>
                            <Radio label="同意"></Radio>
                            <Radio label="拒绝"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="退换物事由">
                        <Input v-model="cancel_memo" disabled></Input>
                    </FormItem>
                    <FormItem label="退换货物流">
                        <Input v-model="cancel_wl_name" disabled></Input>
                    </FormItem>
                    <FormItem label="退换物流号">
                        <Input v-model="cancel_wl_orderno" disabled></Input>
                    </FormItem>
                    <FormItem label="下单时间">
                        <Input v-model="ctime" disabled></Input>
                    </FormItem>
                    <FormItem label="发货时间">
                        <Input v-model="wl_ctime" disabled></Input>
                    </FormItem>
              </Form> -->
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
              Timetext:false,
              okText:'发货',
              begindate:'',
              info_box:true,
              enddate:'',
              cancel_status_Number:0,
              editPriceText:true,
              cancelOkHide:true,
              mallListButt:false,
              mallList:[],
              mallList_status:0,
              flag:0,
              modal1:false,
              modal2:false,
              editInfoText:true,
              mall_name:'',
              textarea_info:'',
              orderStatus:0,
              PagNum:1,
              PagNum1:1,
              totalRecord:0,
              pageSize:0,
              totalRecord1:0,
              pageSize1:0,
              address:'',
              cancel_memo:'',
              cancel_status:'待审',
              cancel_wl_com:'',
              cancel_wl_name:'',
              cancel_wl_orderno:'',
              contact:'',
              contact_mobile:'',
              ctime:'',
              ext_info:'',
              kind_name:'',
              memo:'',
              mobile:'',
              order_amount:'',
              order_status:'',
              orderno:'',
              payed_amount:'',
              postcode:'',
              productType:'',
              product_count:'',
              product_id:0,
              product_name:'',
              product_specification:'',
              uname:'',
              user_id:0,
              orderStatus1:0,
              wl_com:'',
              wl_ctime:'',
              wl_id:'',
              wl_name:'',
              wl_orderno:'',
              logistics_name:'',
              loading:true,
              parentId:1,
              id:0,
              listType:[],
              wuLiulist:[],
              columns1: [
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
                      title: '用户类型',
                      key: 'utype'
                  },
                  {
                      title: '用户名称',
                      key: 'uname'
                  },
                  {
                      title: '星级',
                      key: 'star_num'
                  },
                  {
                      title: '内容',
                      key: 'content'
                  },
                  {
                      title: '时间',
                      key: 'ctime'
                  },
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
                      title: '订单号',
                      key: 'orderno'
                  },
                  {
                      title: '下单人',
                      key: 'uname'
                  },
                  {
                      title: '产品名称',
                      key: 'product_name'
                  },
                  {
                      title: '产品分类',
                      key: 'kind_name'
                  },
                  {
                      title: '产品类型',
                      key: 'productType'
                  },
                  {
                      title: '购买数量',
                      key: 'product_count'
                  },
                  {
                      title: '金额',
                      key: 'order_amount'
                  },
                  {
                      title: '实付金额',
                      key: 'payed_amount'
                  },
                  {
                      title: '时间',
                      key: 'ctime'
                  },
                  {
                      title: '状态',
                      key: 'order_status'
                  },
                  {
                      title: '时间',
                      key: 'ctime'
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
                                      }
                                  }
                              }, '详情'),
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
                                          this.comment(params.index)
                                      }
                                  }
                              }, '评论'),
                              params.row.orderStatus==0?
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
                                          this.close(params.index)
                                      }
                                  }
                              }, '关闭'):''
                          ]);
                      }
                  }
              ],
              datatable: [],
              comtable:[]
            }
        },
          created() {
                 this.getDay()
                 this.queryTable()
                 this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
                       var codelist=eval(data.body.data);
                       this.listType=this.getCodeArray(codelist,'STATE');
                       this.mallList=this.getCodeArray(codelist,'MALL_ORDER_STATUS');
                       this.mallList.unshift({code:100,name:'全部'})
                 },function(error){
                 });
          },
        methods: {
          close(index){
            this.id=this.datatable[index].id
            this.$http.post(this.getHostUrl()+'/adminOrderManager/cancelOrder.do',{
              orderid:this.id
            },{emulateJSON:true}).then(function(data){
                this.queryTable()
            },function(error){
            });
          },
          RadioAll(data){
            if(data=="同意"){
              this.cancel_status_Number=1
            }else if(data=="拒绝"){
              this.cancel_status_Number=2
            }else if(data=="待审"){
              this.cancel_status_Number=0
            }
          },
          cancelOk(){
            this.$http.post(this.getHostUrl()+'/adminOrderManager/editOrderCancelStatus.do',{
              orderid:this.id,
              cancelStatus:this.cancel_status_Number
            },{emulateJSON:true}).then(function(data){
              this.queryTable()
            },function(error){
            });
          },
          editPrice(){
            this.order_amount=''
            this.editPriceText=false
          },
          editPriceOk(){
            this.$http.post(this.getHostUrl()+'/adminOrderManager/editOrderAmount.do',{
              orderid:this.id,
              orderAmount:this.order_amount
            },{emulateJSON:true}).then(function(data){
                  this.editPriceText=true
            },function(error){
            });
          },
          getDay(){
            var now=new Date()
            var y=now.getFullYear()
            var m=now.getMonth()+1
            var d=now.getDate()
            m=m<10?"0"+m:m
            d=d<10?"0"+d:d
            this.enddate=y+"-"+m+"-"+d
            this.begindate=y+'-'+m+'-'+"01";
          },
          mallListAll(data){
            this.mallList_status=data
          },
          ChoiceAll(data){
            for(var i=0;i<this.wuLiulist.length;i++){
              if(this.wuLiulist[i].id==data){
                this.logistics_name=this.wuLiulist[i].wuliu_name
              }
            }
          },
          querydate(){
            if(this.enddate.length<1||this.begindate.length<1){
                this.$vux.alert.show({
                  title: '提示',
                  content: '查询条件不能为空'
                });
            }
            this.queryTable()
          },
          editInfo(){
            this.editInfoText=false
          },
          editInfoSub(){
            if(this.ext_info.length<1){
              this.$vux.alert.show({
                title: '提示',
                content: '附加信息不能为空'
              });
            }else{
              this.$http.post(this.getHostUrl()+'/adminOrderManager/editOrderExt.do',{
                orderid:this.id,
                extinfo:this.ext_info
              },{emulateJSON:true}).then(function(data){
                  this.editInfoText=true
              },function(error){
              });
            }
          },
          comment(index){
            this.id=this.datatable[index].id
            this.modal1=true
            this.$http.post(this.getHostUrl()+'/adminOrderManager/listOrderComment.do',{
              start:this.PagNum1,
              orderid:this.id
              },{emulateJSON:true}).then(function(data){
                this.totalRecord1=data.body.totalRecord
                this.pageSize1=data.body.pageSize
                this.comtable=data.body.data
              },function(error){
              })
          },
          cancel () {
          },
          comok(){
            this.modal1=false
          },
          changepage:function(index){
              this.PagNum=index
              this.queryTable()
          },
          changepage1:function(index){
              this.PagNum1=index
              this.queryTable()
          },
          show (index) {
            if(this.mallList_status==0){
              this.info_box=false
              this.mallListButt=true
              this.okText="确定"
            }else{
              this.mallListButt=false
              this.info_box=true
            }
            if(this.mallList_status==4){
            this.cancelOkHide=true
            this.okText="确定"
            }else{
              this.cancelOkHide=false
            }
            if(this.mallList_status==5){
              this.okText="退货"
            }
              this.flag=2;
              this.id=this.datatable[index].id
              this.modal2=true;
              this.$http.post(this.getHostUrl()+'/adminOrderManager/getOrder.do?orderid='+this.id) .then(function(data){
                    this.address=data.body.address
                    this.cancel_memo=data.body.cancel_memo;
                    this.cancel_wl_com=data.body.cancel_wl_com;
                    this.cancel_wl_name=data.body.cancel_wl_name
                    this.cancel_wl_orderno=data.body.cancel_wl_orderno;
                    this.contact=data.body.contact
                    this.contact_mobile=data.body.contact_mobile;
                    this.ctime=data.body.ctime
                    this.ext_info=data.body.ext_info;
                    this.kind_name=data.body.kind_name
                    this.memo=data.body.memo;
                    this.mobile=data.body.mobile;
                    this.order_amount=data.body.order_amount/100+'实付(0)';
                    this.order_status=data.body.order_status;
                    this.orderStatus1=data.body.orderStatus;
                    this.orderno=data.body.orderno;
                    this.payed_amount=data.body.payed_amount;
                    this.postcode=data.body.postcode;
                    this.productType=data.body.productType;
                    this.product_count=data.body.product_count;
                    this.product_id=data.body.product_id;
                    this.product_name=data.body.product_name;
                    this.product_specification=data.body.product_specification;
                    this.uname=data.body.uname;
                    this.user_id=data.body.user_id;
                    this.wl_com=data.body.wl_com;
                    this.wl_ctime=data.body.wl_ctime;
                    this.wl_id=data.body.wl_id;
                    this.wl_name=data.body.wl_name;
                    this.wl_orderno=data.body.wl_orderno;
              },function(error){
              });
              this.$http.post(this.getHostUrl()+'/adminOrderManager/listWuLiuCom.do',{},{emulateJSON:true}).then(function(data){
                    this.wuLiulist=data.body.data
                },function(error){
                })
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
            if(this.mallList_status==5){
              this.$http.post(this.getHostUrl()+'/adminOrderManager/cancelOrder.do',{
                    orderid:this.id
                    },{emulateJSON:true}) .then(function(data){
                      this.queryTable()
                      this.modal2=false;
              },function(error){
              });
            }
            if(this.mallList_status==4||this.mallList_status==0){
              this.onCancel()
            }else{
              if(this.wl_name.length<1||this.wl_orderno.length<1){
                this.$vux.alert.show({
                  title: '提示',
                  content: '物流名称不能为空'
                });
                this.modal2=false;
                setTimeout(()=>{
                  this.modal2=true
                },50)
              }else{
              this.$http.post(this.getHostUrl()+'/adminOrderManager/editOrder.do',{
                    orderid:this.id,
                    orderStatus:2,
                    wlId:this.wl_id,
                    wlOrderno:this.wl_orderno,
                    wlName:this.logistics_name
                    },{emulateJSON:true}) .then(function(data){
                      this.queryTable()
                      this.modal2=false;
              },function(error){
              });
              }
            }
          },
          queryTable:function(){
            this.$http.post(this.getHostUrl()+'/adminOrderManager/listAll.do?start='+this.PagNum,{
                  orderStatus:this.mallList_status,
                  begindate:this.begindate,
                  enddate:this.enddate
                  },{emulateJSON:true}) .then(function(data){
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
.edit_info,.edit_price{
  width: 80px;
  height: 30px;
  line-height: 30px;
  background-color: #2d8cf0;
  border: none;
  color: white;
  border-radius: 4px;
  margin-top: 2px
}
.ivu-input[disabled], fieldset[disabled] .ivu-input{
  color: black
}
.table,.table tr th,.table tr td { border:1px solid #ddd; }
.table tr{width: 100%}
.table { width: 100%;  line-height: 25px; text-align: center; border-collapse: collapse;}
.table td:nth-child(even){width: 35%}
.table td:nth-child(odd){width: 15%}
</style>
