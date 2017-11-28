<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>数据统计</BreadcrumbItem>
          <BreadcrumbItem>员工消费统计</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
        <li style="line-height:35px">日期：</li>
        <li><el-date-picker v-model="value1" type="date" placeholder="选择日期" :editable='false' format="yyyy-MM-dd" @change="myclick"></el-date-picker></li>
        <li style="line-height:35px">--</li>
        <li><el-date-picker v-model="value2" type="date" placeholder="选择日期" :editable='false' format="yyyy-MM-dd" @change="myclick2"></el-date-picker></li>
      </ul>
      </div>
        <el-tree :data="baseData" :props="defaultProps" :load="loadNode" lazy="" @node-click="handleNodeClick"></el-tree>
        <div class="content">
            <Table stripe border :columns="columns4" :data="datatable" v-show="cit"></Table>
            <Table stripe border :columns="columns3" :data="datatable3" v-show="con"></Table>
        </div>
        <!--修改弹出框开始-->
        <Modal v-model="modal2" title="明细"  width="800" >
          <Table stripe border :columns="columns2" :data="datatable2"></Table>
            <Page :total="totalRecord" show-total :page-size="pageSize" @on-change="changepage"></Page>
        </Modal>
        <!--修改弹出框结束-->
    </div>
  </div>
</template>
<script>
export default {
        data () {
            return {
              enablew:false,
              cit:true,
              con:false,
              dateFormat:'yyyy-MM-dd',
              value1:'',
              value2:'',
              totalRecord:0,
              pageSize:0,
              PagNum:1,
              modal2:false,
              fileList:[],
              dataType:0,
              ecid:0,
              userId:0,
              corpId:0,
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
              columns4: [
                  {
                      title: 'ID',
                      key: 'id'
                  },
                  {
                      title: '姓名',
                      key: 'name'
                  },
                  {
                      title: '城市',
                      key: 'city_name'
                  },
                  {
                      title: '金额',
                      key: 'amountCount'
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
                              }, '明细')
                          ]);
                      }
                  }
              ],
              columns3: [
                  {
                      title: 'ID',
                      key: 'id'
                  },
                  {
                      title: '姓名',
                      key: 'name'
                  },
                  {
                      title: '金额',
                      key: 'amountCount'
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
                                          this.show3(params.index)
                                      }
                                  }
                              }, '明细')
                          ]);
                      }
                  }
              ],
              columns2: [
                  {
                      width: 60,
                      align: 'center'
                  },
                  {
                      title: 'ID',
                      key: 'id'
                  },
                  {
                      title: '支付金额',
                      key: 'pay_amount_real'
                  },
                  {
                      title: '支付内容',
                      key: 'pay_content'
                  },
                  {
                      title: '支付类型',
                      key: 'pay_type',
                      render: (h, params) => {
                          return h('div', [
                              h('span', params.row.pay_type==0?'积分支付':'')
                          ]);
                      }
                  },
                  {
                      title: '支付时间',
                      key: 'pay_time'
                  }
              ],
              datatable3: [],
              datatable2:[],
              datatable: [],
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
            this.value2=y+"-"+m+"-"+d
            this.value1=y+'-'+m+'-'+"01";
          },
          myclick(v){
            this.value1=v;
          },
          myclick2(v){
            this.value2=v;
          },
          loadNode(node, resolve) {
            var rootid=1;
            if(node.level>0){
              rootid=node.data.id
            }
            if(node.level==4){
              resolve([]);
              return;
            }
            this.$http.post(this.getHostUrl()+'/adminCommonTree/getCityCorpTree.do?pId='+rootid).then(function(data){
              var treedata=[];
                for(var i=0;i<data.body.length;i++){
                  treedata.push(data.body[i])
                }
                resolve(treedata);
            },function(error){
            })
          },
          handleNodeClick(data) {
            if(data.type==0||data.type==3){
              this.dataType=data.type
              this.corpId=data.id;
              this.ecid=data.id
              this.queryTable()
            }else{
              this.corpId=0;
              this.datatable=[];
            }
          },
          show (index) {
                this.userId=this.datatable[index].id
                this.modal2=true;
                this.queryDetailed()
            },
            show3 (index) {
                  this.userId=this.datatable3[index].id
                  this.modal2=true;
                  this.queryDetailed()
              },
            changepage:function(index){
                this.PagNum=index
                this.queryDetailed()
            },
            queryDetailed(){
              this.$http.post(this.getHostUrl()+'/adminUserCash/queryCashDetail.do',{start:this.PagNum,userid:this.userId,begindate:this.value1,enddate:this.value2},{emulateJSON:JSON}).then(function(data){
                  this.totalRecord=data.body.totalRecord
                  this.pageSize=data.body.pageSize
                  this.datatable2=eval(data.body.data)
              },function(error){})
            },
          queryTable:function(){
            if(this.dataType==0){
              this.con=false
              this.cit=true
              this.$http.post(this.getHostUrl()+'/adminUserCash/queryStatCashByCity.do',{cityId:this.corpId,begindate:this.value1,enddate:this.value2},{emulateJSON:true}).then(function(data){
                this.datatable=eval(data.body.data)
              },function(error){
              });
            }else if(this.dataType==3){
              this.con=true
              this.cit=false
              this.$http.post(this.getHostUrl()+'/adminUserCash/queryStatCashByCorp.do',{ecid:this.ecid,begindate:this.value1,enddate:this.value2},{emulateJSON:true}).then(function(data){
                this.datatable3=eval(data.body.data)
              },function(error){
              });
            }
          }
        }
    }
</script>
<style media="screen">
@import '../../static/css/style.css';
/*.ivu-modal-content{
  width: 900px
}*/
</style>
