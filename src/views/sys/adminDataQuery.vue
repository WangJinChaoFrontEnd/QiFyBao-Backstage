<template>
    <div>
            <div class="title_top">
              <Breadcrumb separator=">">
                  <BreadcrumbItem>首页</BreadcrumbItem>
                  <BreadcrumbItem>客服管理</BreadcrumbItem>
                  <BreadcrumbItem>数据导入查询</BreadcrumbItem>
              </Breadcrumb>
                <ul class="butt_right">
                    <li style="line-height:35px">人员ID：</li>
                    <li><Input v-model="value"></Input></li>
                    <li style="margin-left:10px"><button type="button" name="button" @click="sync"><Icon type="search"></Icon>&nbsp;查询</button></li>
                </ul>
            </div>
            <Table stripe border :columns="columns4" :data="datatable"></Table>
            <Page :total="totalRecord" show-total :page-size="pageSize" @on-change="changepage"></Page>
            <Modal v-model="modal2"  title="明细" width="800">
                <Table stripe border :columns="columns1" :data="datatable1"></Table>
                <Page :total="totalRecord1" show-total :page-size="pageSize1" @on-change="changepage1"></Page>
            </Modal>
    </div>
</template>
<script>
export default {
        data () {
            return {
                flag:0,
                PagNum:1,
                PagNum1:1,
                modal2:false,
                totalRecord:0,
                pageSize:0,
                totalRecord1:0,
                pageSize1:0,
                value:'',
                batch_number:0,
                list:[
                    {
                        value: 0,
                        label: '手机号'
                    },
                    {
                        value:1,
                        label: '名称'
                    }
                ],
                value:'',
                loading:true,
                cList:"",
                newsId:0,
                listType:[],
                listState:[],
                selectIds:'',
                columns4: [
                    {
                        title: '批次号',
                        key: 'batch_number'
                    },
                    {
                        title: '导入类型',
                        key: 'data_type',
                        render: (h, params) => {
                            return h('div', [
                                h('span', params.row.data_type==1?'员工':'')
                            ]);
                        }
                    },
                    {
                        title: '失败人数',
                        key: 'fail_count'
                    },
                    {
                        title: '成功人数',
                        key: 'suc_count'
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
                columns1: [
                    {
                        title: '行数',
                        key: 'row_number'
                    },
                    {
                        title: '身份',
                        key: 'result_status'
                    }
                ],
                datatable: [],
                datatable1: []
            }
        },
        created(){
          this.query()
        },
        methods: {
          changepage:function(index){
              this.PagNum=index
              this.query()
          },
          changepage1:function(index){
              this.PagNum1=index
              this.queryDetailed()
          },
          show(index){
            this.modal2=true
            this.batch_number=this.datatable[index].batch_number
            this.queryDetailed()
          },
          queryDetailed(){
            this.$http.post(this.getHostUrl()+'/adminQueryImport/queryUserDetail.do',{start:this.PagNum1,batch_number:this.batch_number},{emulateJSON:true}).then(function(data){
              this.datatable1=data.body.data
              this.totalRecord1=data.body.totalRecord
              this.pageSize1=data.body.pageSize
            },function(error){})
          },
          query(){
              this.$http.post(this.getHostUrl()+'/adminQueryImport/queryUserList.do',{start:this.PagNum,userid:this.value},{emulateJSON:true}).then(function(data){
                   this.datatable=eval(data.body.data);
                   this.totalRecord=data.body.totalRecord
                   this.pageSize=data.body.pageSize
              },function(error){
              })
          },
          sync:function(){
            if(this.value==""){
              this.$vux.alert.show({
                title: '提示',
                content: '请先选择查询的值'
              });
            }else{
              this.value=Number(this.value)
              this.query()
            }
          }
        }
    }
</script>
<style media="screen">
@import '../../static/css/style.css';
.butt_right li:nth-child(2){
  margin:auto;
  text-align: center
}
</style>
