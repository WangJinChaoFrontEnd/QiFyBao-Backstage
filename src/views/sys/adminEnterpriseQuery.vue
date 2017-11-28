<template>
    <div>
            <div class="title_top">
              <Breadcrumb separator=">">
                  <BreadcrumbItem>首页</BreadcrumbItem>
                  <BreadcrumbItem>客服管理</BreadcrumbItem>
                  <BreadcrumbItem>企业查询</BreadcrumbItem>
              </Breadcrumb>

                <ul class="butt_right">
                    <li style="line-height:35px">值：</li>
                    <li><Input v-model="value"></Input></li>
                    <li style="margin-left:10px"><button type="button" name="button" @click="sync"><Icon type="search"></Icon>&nbsp;查询</button></li>
                </ul>
            </div>
            <Table stripe border :columns="columns4" :data="datatable"></Table>
    </div>
</template>
<script>
export default {
        data () {
            return {
                flag:0,
                page:0,
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
                        title: 'ID',
                        key: 'sId'
                    },
                    {
                        title: '企业名称',
                        key: 'sName'
                    },
                    {
                        title: '城市名称',
                        key: 'cName'
                    },
                    {
                        title: '属性',
                        key: 'dcName'
                    }
                ],
                datatable: []
            }
        },
        methods: {
          query(){
              this.$http.post(this.getHostUrl()+'/adminUserQuery/queryCorp.do',{queryContent:this.value},{emulateJSON:true}).then(function(data){
                   this.datatable=eval(data.body.data);
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
              this.query()
            }
          }
        }
    }
</script>
<style media="screen">
@import '../../static/css/style.css';
.butt_right li:nth-child(2){
  margin:auto；auto;
  text-align: center
}
</style>
