<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>数据统计</BreadcrumbItem>
          <BreadcrumbItem>消费统计</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
        <li style="line-height:30px"><p>日期:</p></li>
          <li>
                <DatePicker type="date" :value="begindate" format="yyyy-MM-dd" placeholder="选择日期" style="width: 200px" :editable="TimeText" @on-change="begindatefunc"></DatePicker>
          </li>
          <li style="line-height:30px">——</li>
          <li>
                <DatePicker type="date" :value="enddate" format="yyyy-MM-dd" placeholder="选择日期" style="width: 200px" :editable="TimeText" @on-change="enddatefunc"></DatePicker>
          </li>
      </ul>
      </div>
        <el-tree :data="baseData" :props="defaultProps" :load="loadNode" lazy="" @node-click="handleNodeClick"></el-tree>
        <!-- <Tree :data="baseData" selected="true" @on-select-change="selectChg"></Tree> -->
        <div class="content">
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectAll"></Table>
        </div>
        <!--修改弹出框开始-->
        <Modal v-model="modal2" title="消费明细"   v-for="item in datatable1" key="" width="800">
              <Table stripe border :columns="columns1" :data="datatable1" @on-selection-change="selectAll"></Table>
        </Modal>
        <!--修改弹出框结束-->
        <!--修改弹出框开始-->
        <Modal v-model="modal3" title="发票信息"  key="" width="800">
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
    </div>
  </div>
</template>
<script>
export default {
        data () {
            return {
              TimeText:false,
              begindate:'',
              imgList:[],
              enddate:'',
              flag:0,
              modal2:false,
              modal3:false,
              city_name:"",
              parentId:1,
              isParent:1,
              loading:true,
              contact_name:'',
              tax_no:'',
              address:'',
              contact_phone:'',
              invoice_title:'',
              postcode:'',
              invoiceType:'',
              fileCode:'',
              taxType:'',
              invoice_memo:'',
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
              columns1: [
                  {
                      width:100,
                      title: 'ID',
                      key: 'id'
                  },
                  {
                      title: '支付内容',
                      key: 'pay_content'
                  },
                  {
                      title: '支付状态',
                      key: 'pay_state'
                  },
                  {
                      title: '实际支付金额',
                      key: 'pay_amount_real',
                      render: (h, params) => {
                          return h('div', [
                              h('span', params.row.pay_amount_real>0?params.row.pay_amount_real/100:params.row.pay_amount_real/100)
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
                      width: 200,
                      align: 'center',
                      render: (h, params) => {
                          return h('div', [
                            params.row.pay_amount_real>0?
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
                                          this.getInvoice(params.index)
                                      }
                                  }
                              }, '获取发票信息'):''
                          ]);
                      }
                  }
              ],
              columns4: [
                  {
                      title: 'ID',
                      key: 'id'
                  },
                  {
                      title: '公司名称',
                      key: 'corp_name'
                  },
                  {
                      title: '总数',
                      key: 'amountCount',
                      render: (h, params) => {
                          return h('div', [
                              h('span', params.row.amountCount>0?params.row.amountCount/100:params.row.amountCount/100)
                          ]);
                      }
                  },
                  {
                      title: '操作',
                      key: 'action',
                      width: 200,
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
                              }, '消费明细')
                          ]);
                      }
                  }
              ],
              datatable: [],
              datatable1:[],
              defaultProps: {
                children: 'children',
                label: 'title'
              },
            }
        },
          created() {
            this.getDay()
          },
        methods: {
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
          begindatefunc(data){
            this.begindate=data
          },
          enddatefunc(data){
            this.enddate=data
          },
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
              this.isParent=data.isParent
              this.parentId=data.id;
              this.queryTable(this.parentId,this.isParent)
          },
          cancel () {
          },
          getInvoice(index){
            this.id=this.datatable1[index].id
            this.modal3=true
            this.$http.post(this.getHostUrl()+'/adminCorpCash/getCashInvoiceInfo.do',{cashId:this.id},{emulateJSON:true}).then(function(data){
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
            })
          },
          show (index) {
                this.show_city_type=true;
                this.id=this.datatable[index].id
                this.modal2=true;
                this.$http.post(this.getHostUrl()+'/adminCorpCash/queryCashDetail.do',{start:1,begindate:this.begindate,enddate:this.enddate,ecid:this.id},{emulateJSON:true}).then(function(data){
                  this.datatable1=eval(data.body.data)
                  if(this.datatable1==""){
                    this.$vux.alert.show({
                      title: '提示',
                      content: '数据为空'
                    });
                  }
                },function(error){
                })
            },
          ok () {
            if(this.flag==2){
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
          queryTable:function(upid,Parent){
              if(Parent==0){
                return false
              }else{
                this.$http.post(this.getHostUrl()+'/adminCorpCash/queryStatCash.do',{cityId:upid,begindate:this.begindate,enddate:this.enddate},{emulateJSON:true}) .then(function(data){
                      this.datatable=eval(data.body.data)
                      this.parentId=upid;
                },function(error){
                });
              }
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
/*.ivu-modal-content{
  width: 900px
}*/
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
