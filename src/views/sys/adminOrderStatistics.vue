<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>商城管理</BreadcrumbItem>
          <BreadcrumbItem>订单统计</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
          <li style="line-height:35px">日期：</li>
          <li><el-date-picker v-model="value1" type="date" placeholder="选择日期" :editable='false' format="yyyy-MM-dd" @change="myclick"></el-date-picker></li>
          <li style="line-height:35px">--</li>
          <li><el-date-picker v-model="value2" type="date" placeholder="选择日期" :editable='false' format="yyyy-MM-dd" @change="myclick2"></el-date-picker></li>
          <li><button type="button" name="button" @click="classify">按分类统计</button></li>
          <li><button type="button" name="button" @click="productIfy">按产品统计</button></li>
      </ul>
      </div>
        <div>
            <!-- <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectAll"></Table> -->
            <el-table v-show="Table_list" :data="tableData"  stripe border  style="width: 100%">
                    <el-table-column  prop="id"  label="ID"></el-table-column>
                    <el-table-column  prop="root_kind_name"  label="产品分类" ></el-table-column>
                    <el-table-column  prop="product_count"  label="购买数量"></el-table-column>
                    <el-table-column  prop="order_amount_src"  label="金额" ></el-table-column>
                    <el-table-column  prop="order_amount"  label="结算金额" ></el-table-column>
                    <el-table-column label="操作">
                      <template scope="scope">
                        <el-button  size="small"  @click="handleEdit(scope.$index, scope.row)">详情</el-button>
                      </template>
                    </el-table-column>
            </el-table>
            <el-table v-show="Table_list1" :data="tableData1"  stripe border  style="width: 100%">
                    <el-table-column  prop="id"  label="ID"  ></el-table-column>
                    <el-table-column  prop="mall_shortname"  label="商家"  ></el-table-column>
                    <el-table-column  prop="product_name"  label="产品名称" ></el-table-column>
                    <el-table-column  prop="productType"  label="产品类型"  ></el-table-column>
                    <el-table-column  prop="product_count"  label="购买数量"  ></el-table-column>
                    <el-table-column  prop="order_amount_src"  label="金额"  ></el-table-column>
                    <el-table-column  prop="order_amount"  label="结算金额"  ></el-table-column>
                    <el-table-column label="操作">
                      <template scope="scope">
                        <el-button  size="small"  @click="handleEdit1(scope.$index, scope.row)">详情</el-button>
                      </template>
                    </el-table-column>
            </el-table>
            <div  v-show="pagShow">
                <Page :total="totalRecord" show-total :page-size="pageSize" @on-change="changepage"></Page>
            </div>
        </div>
        <Modal  v-model="modal1"  title="详情" width="800">
            <el-table  :data="table_details"  stripe border  style="width: 100%">
              <el-table-column  prop="id"  label="ID" ></el-table-column>
              <el-table-column  prop="kind_name"  label="产品分类" ></el-table-column>
              <el-table-column  prop="product_name"  label="产品名称" ></el-table-column>
              <el-table-column  prop="productType"  label="产品类型"  width="190"></el-table-column>
              <el-table-column  prop="product_count"  label="购买数量"></el-table-column>
              <el-table-column  prop="order_amount_src"  label="金额" ></el-table-column>
              <el-table-column  prop="order_amount"  label="结算金额" ></el-table-column>
            </el-table>
            <Page :total="totalRecord1" show-total :page-size="pageSize1" @on-change="changepage1"></Page>
        </Modal>
        <Modal  v-model="modal2"  title="详情" width="800">
            <el-table  :data="product_details"  stripe border  style="width: 100%">
              <el-table-column  prop="id"  label="ID"  width="30"></el-table-column>
              <el-table-column  prop="kind_name"  label="产品分类"  ></el-table-column>
              <el-table-column  prop="product_name"  label="产品名称"  ></el-table-column>
              <el-table-column  prop="productType"  label="产品类型"  ></el-table-column>
              <el-table-column  prop="product_count"  label="购买数量" ></el-table-column>
              <el-table-column  prop="orderno"  label="订单号"  ></el-table-column>
              <el-table-column  prop="order_status"  label="状态"  ></el-table-column>
              <el-table-column  prop="order_amount"  label="结算金额"  ></el-table-column>
              <el-table-column  prop="ctime"  label="下单时间"  ></el-table-column>
            </el-table>
            <Page :total="totalRecord2" show-total :page-size="pageSize2" @on-change="changepage2"></Page>
        </Modal>
    </div>
  </div>
</template>
<script>
export default {
        data () {
            return {
              modal1:false,
              dialogVisible: false,
              productId:0,
              kindid:0,
              value1:'',
              value2:'',
              flag:0,
              pagShow:false,
              modal2:false,
              Table_list:false,
              Table_list1:false,
              prop_name:"",
              loading:true,
              state:"",
              pageNum:1,
              pageNum1:1,
              pageNum2:1,
              parentId:1,
              id:0,
              listType:[],
              totalRecord:0,
              totalRecord1:0,
              pageSize:0,
              pageSize1:0,
              totalRecord2:0,
              pageSize2:0,
              tableData: [],
              tableData1:[],
              datatable:[],
              table_details:[],
              product_details:[],
              gridData:[],
              formLabelWidth: '120px'
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
          cancel () {
          },
          changepage:function(index){
            this.pageNum=index
            this.classify()
          },
          changepage1:function(index){
            this.pageNum1=index
            this.querytable_de()
          },
          changepage2:function(index){
            this.pageNum2=index
            this.queryproduct_de()
          },
          show (index) {
              this.flag=2;
              this.id=this.datatable[index].id
                this.prop_name=this.datatable[index].prop_name
                this.state=this.datatable[index].state;
                this.modal2=true;
            },
            handleEdit(index,data){
              this.modal1=true
              this.kindid=data.id
              this.querytable_de()
            },
            handleEdit1(index,data){
              this.modal2=true
              this.productId=data.id
              this.queryproduct_de()
            },
            queryproduct_de(){
              this.$http.post(this.getHostUrl()+'/adminOrderStatManager/statOrderByProduct.do',{
                start:this.pageNum2,
                begindate:this.value1,
                enddate:this.value2,
                productId:this.productId
              },{emulateJSON:true}).then(function(data){
                this.product_details=data.body.data
                for(var i=0;i<data.body.data.length;i++){
                  this.product_details[i].order_amount=data.body.data[i].order_amount/100
                }
                this.totalRecord2=data.body.totalRecord
                this.pageSize2=data.body.pageSize
              },function(error){})
            },
            querytable_de(){
              this.$http.post(this.getHostUrl()+'/adminOrderStatManager/statProductOrder.do',{
                start:this.pageNum1,
                begindate:this.value1,
                enddate:this.value2,
                kindid:this.kindid
              },{emulateJSON:true}).then(function(data){
                this.table_details=data.body.data
                this.totalRecord1=data.body.totalRecord
                this.pageSize1=data.body.pageSize
              },function(error){})
            },
          //按分类统计
          classify:function(){
            if(this.value1==""||this.value2==""){
              this.$vux.alert.show({
                title: '提示',
                content: '日期不能为空'
              });
            }else{
              this.Table_list=true
              this.Table_list1=false
              this.$http.post(this.getHostUrl()+'/adminOrderStatManager/statKindOrder.do',{
                start:this.pageNum,
                begindate:this.value1,
                enddate:this.value2
              },{emulateJSON:true}).then(function(data){
                this.tableData=data.body.data
                for(var i=0;i<data.body.data.length;i++){
                  this.tableData[i].order_amount_src=data.body.data[i].order_amount_src/100
                  this.tableData[i].order_amount=data.body.data[i].order_amount/100
                }
                this.totalRecord=data.body.totalRecord
                this.pageSize=data.body.pageSize
                if(this.tableData.length>1){
                  this.pagShow=true
                }else{
                  this.pagShow=false
                }
              },function(error){})
                  }
          },
          productIfy:function(){
            if(this.value1==""||this.value2==""){
              this.$vux.alert.show({
                title: '提示',
                content: '时间不能为空'
              });
            }else{
              this.Table_list=false
              this.Table_list1=true
              this.pageNum=1
              this.$http.post(this.getHostUrl()+'/adminOrderStatManager/statProductOrder.do',{
                start:this.pageNum,
                begindate:this.value1,
                enddate:this.value2,
                kindid:-1
              },{emulateJSON:true}).then(function(data){
                this.tableData1=data.body.data
                for(var i=0;i<data.body.data.length;i++){
                  this.tableData1[i].order_amount_src=data.body.data[i].order_amount_src/100
                  this.tableData1[i].order_amount=data.body.data[i].order_amount/100
                }
                this.totalRecord=data.body.totalRecord
                this.pageSize=data.body.pageSize
                if(this.tableData1.length>1){
                  this.pagShow=true
                }else{
                  this.pagShow=false
                }
              },function(error){})
                }
          },
        }
    }
</script>
<style media="screen">
.ivu-modal-wrap .ivu-modal{
  width: 800px
}
@import '../../static/css/style.css';
.ivu-modal-body{
  height: 400px
}
.ivu-modal-content{
  width: 800px
}
</style>
