<template>
    <div>
            <div class="title_top">
              <Breadcrumb separator=">">
                  <BreadcrumbItem>首页</BreadcrumbItem>
                  <BreadcrumbItem>系统设置</BreadcrumbItem>
                  <BreadcrumbItem>头条内容管理</BreadcrumbItem>
              </Breadcrumb>

                <ul class="butt_right">
                    <li><router-link to="/sys/adminModal"><button type="button" name="button"><Icon type="plus"></Icon>&nbsp;添加</button></router-link></li>
                    <li style="margin:0 10px 0 10px"><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
                    <li>
                      <span>类型</span>
                        <Select v-model="newsType"  style="width:100px">
                            <Option v-for="item in listType" :value="item.code"  key="">{{item.name}}</Option>
                        </Select>
                    </li>
                    <li style="margin-left:10px"><button type="button" name="button" @click="sync"><Icon type="search"></Icon>&nbsp;查询</button></li>
                </ul>
            </div>
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectChg"></Table>
            <Page :total="totalRecord" show-total :page-size="pageSize" @on-change="changepage"></Page>
    </div>
</template>
<script>
import E from 'wangeditor'
import textEdit from '../Home'
export default {
        components:{
          textEdit
        },
        data () {
            return {
                flag:0,
                page:0,
                list:[],
                pagNum:1,
                totalRecord:0,
                loading:true,
                pageSize:0,
                cList:"",
                cVar:"",
                category:'',
                cId:"",
                cCode:'',
                vState:"",
                cDesc:"",
                cType:"",
                cState:0,
                DelCid:"",
                cSort:"",
                cTime:"",
                newsId:0,
                newsType:0,
                listType:[],
                listState:[],
                selectIds:'',
                columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        width: 60,
                        title: 'ID',
                        key: 'newsId'
                    },
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '发布人',
                        key: 'uName'
                    },
                    {
                        title: '类型',
                        key: 'newsType'
                    },
                    {
                        width:90,
                        title: '阅读量',
                        key: 'readCount'
                    },
                    {
                        width:90,
                        title: '是否置顶',
                        key: 'toper'
                    },
                    {
                        title: '发布时间',
                        key: 'ctime'
                    },
                    {
                        title: '发布日期',
                        key: 'cdate'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 190,
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
                                }, '修改'),
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
                                            this.Top(params.index)
                                        }
                                    }
                                }, '置顶')
                            ]);
                        }
                    }
                ],
                datatable: []
            }
        },
          mounted() {
                    this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
                          var codelist=eval(data.body.data);
                          this.listType=this.getCodeArray(codelist,'NEWSTYPE')
                    },function(error){
                    });
                    this.newsType=0;
                    this.query();
          },
        methods: {
          Top(index){
              this.$http.post(this.getHostUrl()+'/adminNews/editToper.do',{newsId:this.datatable[index].newsId,toperstate:1},{emulateJSON:true}).then(function(data){
                this.query()
              },function(error){
              })
          },
          query(){
              this.$http.post(this.getHostUrl()+'/adminNews/listAll.do',{start:this.pagNum,newstype_q:this.newsType,ordername:'id'},{emulateJSON:true}).then(function(data){
                   this.page=data.body.totalPage
                   this.totalRecord=data.body.totalRecord
                   this.pageSize=data.body.pageSize
                   this.datatable=eval(data.body.data);
              },function(error){
              })
          },
          sync:function(){
              this.query();
          },
          selectChg(data){
            this.selectIds="";
            for(var j=0;j<data.length;j++){
              this.selectIds+=","+data[j].newsId;
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
                _this.$http.post(_this.getHostUrl()+'/adminNews/del.do?',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
                   this.query();
                 },function(error){
                 });
              }
            });
          },
          show (index) {
                this.newsId=this.datatable[index].newsId
                this.$router.push({path: '/sys/adminEditNews', query: {newsId: this.newsId}});
            },
            changepage:function(index){
                this.$http.post(this.getHostUrl()+'/adminNews/listAll.do',{start:index,newstype_q:0,ordername:'id'},{emulateJSON:true}).then(function(data){
                         this.page=data.body.totalPage
                         this.totalRecord=data.body.totalRecord
                         this.pageSize=data.body.pageSize
                         this.datatable=data.body.data
                  },function(error){
                  })
            },
        }
    }
</script>
<style media="screen">

@import '../../static/css/style.css';
.butt_right li:nth-child(2){
  margin:auto
}
</style>
