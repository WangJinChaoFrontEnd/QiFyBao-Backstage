<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>商城管理</BreadcrumbItem>
          <BreadcrumbItem>产品管理</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
          <li><button type="button" name="button" @click="edit"><Icon type="gear-a" style="font-size:16px"></Icon>&nbsp;修改分类</button></li>
          <li><button type="button" name="button" @click="add"><Icon type="plus"></Icon>&nbsp;添加</button></li>
          <li><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
      </ul>
      </div>
        <div class="" v-show="true">
            <el-tree :data="baseData" :props="defaultProps" :load="loadNode" lazy="" @node-click="handleNodeClick"></el-tree>
        </div>
        <!-- <Tree :data="baseData" selected="true" @on-select-change="selectChg"></Tree> -->
        <div class="content">
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectAll"></Table>
            <Page :total="totalRecord" show-total :page-size="pageSize" @on-change="changepage"></Page>
        </div>
        <!--属性弹出框-->
        <Modal v-model="modal6" title="属性详情" :loading="loading"  @on-ok="" @on-cancel="cancel" width="800">
              <button class="attr_modal" type="button" name="button" @click="addAttr"><Icon type="plus"></Icon>&nbsp;添加</button>
              <button class="attr_modal" type="button" name="button" @click="delAttr"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button>
              <Table stripe border :columns="columns3" :data="attrtable" @on-selection-change="selectAll"></Table>
        </Modal>
        <!--属性弹出框结束-->
        <!--属性添加弹出框-->
        <Modal v-model="modal7" title="属性编辑" :loading="loading"  @on-ok="Attrok" @on-cancel="cancel" width="800">
          <Form  label-position="top">
              <FormItem label="名称">
                  <Select v-model="attrName">
                      <Option v-for="item in listOrder" :value="item.id"  key="">{{item.prop_name}}</Option>
                  </Select>
              </FormItem>
              <FormItem label="值">
                  <Input v-model="attrValue"></Input>
              </FormItem>
          </Form>
        </Modal>
        <!--属性添加弹出框结束-->
        <!--浏览弹出框-->
        <Modal v-model="modal5" title="订单浏览详情" :loading="loading"  @on-ok="editok" @on-cancel="cancel" width="800">
              <Table stripe border :columns="columns2" :data="brotable"></Table>
              <Page :total="TiaoShu" show-total :page-size="pageBig" @on-change="browFun"></Page>
        </Modal>
        <!--浏览弹出框结束-->
        <!--评论弹出框-->
        <Modal v-model="modal4" title="订单评论详情" :loading="loading"  @on-ok="editok" @on-cancel="cancel" width="800">
              <Table stripe border :columns="columns1" :data="comtable"></Table>
              <Page :total="totalRecord1" show-total :page-size="pageSize1" @on-change="changepage1"></Page>
        </Modal>
        <!--评论弹出框结束-->
        <!--修改分类弹出框-->
        <Modal v-model="modal3" title="添加或编辑" :loading="loading"  @on-ok="editok" @on-cancel="cancel" width="800">
              <el-tree :data="baseData" :props="defaultProps" :load="loadNode" lazy="" @node-click="handleNode"></el-tree>
        </Modal>
        <!--修改分类弹出框结束-->
        <!--修改弹出框开始-->
        <Modal v-model="modal2" title="添加或编辑" :loading="loading"  @on-ok="ok" @on-cancel="cancel" width="800">
              <Form  label-position="top">
                    <FormItem label="状态">
                        <Select v-model="state">
                            <Option v-for="item in listState" :value="item.code"  key="">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="优惠类型">
                        <Select v-model="preferType">
                            <Option v-for="item in productPreferType" :value="item.code"  key="">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="产品类型">
                        <Select v-model="productType">
                            <Option v-for="item in mallProductType" :value="item.code"  key="">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="邮费">
                        <Input v-model="postfee"></Input>
                    </FormItem>
                    <FormItem label="产品名称">
                        <Input v-model="product_name"></Input>
                    </FormItem>
                    <FormItem label="价格">
                        <Input v-model="price"></Input>
                    </FormItem>
                    <FormItem label="原价">
                        <Input v-model="priceSrc"></Input>
                    </FormItem>
                    <Row>
                      <Col span="5" style="line-height:35px">产品logo:</Col>
                      <Col span="19">
                          <el-upload class="upload-demo" ref="upload2" name="files" :action="acturl" :file-list="fileList2" :before-upload="handlePreview2" :on-success="uploadSuccess2" :show-file-list="true" list-type="jpg/png/bmp/gif" :auto-upload="false" :data="uploadParamData2"  :headers="uploadParamHeader">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2">立即上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png/bmp/gif文件，且不超过10M<br/>{{ loadingStatus ? '上传中....' : '' }}</div>
                          </el-upload>
                      </Col>
                    </Row>
                    <div class=""></div>
                    <FormItem label="产品URL">
                        <Input v-model="productUrl"></Input>
                    </FormItem>
                    <FormItem label="使用期限">
                        <Input v-model="product_daycount"></Input>
                    </FormItem>
                    <FormItem label="优惠条件">
                        <Input v-model="prefer_where"></Input>
                    </FormItem>
                    <FormItem label="优惠值">
                        <Input v-model="prefer_value"></Input>
                    </FormItem>
                    <Row>
                      <Col span="5" style="line-height:35px">缩略图:</Col>
                      <Col span="19">
                          <el-upload class="upload-demo" ref="upload" name="files" :action="acturl" :file-list="fileList" :before-upload="handlePreview" :on-success="uploadSuccess" :show-file-list="true" list-type="jpg/png/bmp/gif" :auto-upload="false" :data="uploadParamData"  :headers="uploadParamHeader">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">立即上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png/bmp/gif文件，且不超过10M<br/>{{ loadingStatus ? '上传中....' : '' }}</div>
                          </el-upload>
                      </Col>
                    </Row>
                    <div class=""></div>
                    <FormItem label="淘宝URL">
                        <Input v-model="taobaoke_url"></Input>
                    </FormItem>
                    <div class="">
                      内容:
                    </div>
                    <div id="editorElem" style="text-align:left"></div>
              </Form>
        </Modal>
        <!--修改弹出框结束-->

    </div>
  </div>
</template>
<script>
import E from 'wangeditor'
export default {
        data () {
            return {
              flag:0,
              loading:true,
              modal2:false,
              modal3:false,
              modal4:false,
              modal5:false,
              modal6:false,
              modal7:false,
              TiaoShu:0,
              totalRecord:0,
              totalRecord1:0,
              parentId:0,
              PagNum:1,
              PagNum1:1,
              pageSize:0,
              pageSize1:0,
              attrName:0,
              attrValue:'',
              pageBig:0,
              product_name:'',
              kindImg:'',
              ImgList:'',
              imgUrl:'',
              productIcon:'',
              productUrl:'',
              price:'',
              priceSrc:'',
              postfee:'',
              acturl:"",
              isPar:0,
              kindOrder:0,
              fileList:[],
              fileList2:[],
              fileCode:'',
              productType:'',
              content:'',
              product_daycount:'',
              preferType:'',
              prefer_where:'',
              prefer_value:'',
              listState:[],
              productPreferType:[],
              mallProductType:[],
              state:1,
              taobaoke_url:'',
              Addmodal:1,
              uploadParamData:{},
              uploadParamHeader:{},
              uploadParamData2:{},
              loadingStatus: false,
              selectIds:'',
              TreedataIds:'',
              id:0,
              TreeId:0,
              listOrder:[],
              baseData: [
                {
                  id:1,
                  isParent:1,
                  title: '中华人民共和国',
                  expand: true,
                  children:[],
                }
              ],
              baseData2: [
                {
                  id:1,
                  isParent:1,
                  title: '中华人民共和国',
                  expand: true,
                  children:[],
                }
              ],
              columns1: [
                  {

                      width: 60,
                      align: 'center'
                  },
                  {
                      title: 'ID',
                      key: 'id'
                  },
                  {
                      title: '用户名称',
                      key: 'uname'
                  },
                  {
                      title: '用户类型',
                      key: 'utype'
                  },
                  {
                      title: '企业名称',
                      key: 'corp_name'
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
                      title: '用户名称',
                      key: 'uname'
                  },
                  {
                      title: '用户类型',
                      key: 'utype'
                  },
                  {
                      title: '企业名称',
                      key: 'corp_name'
                  },
                  {
                      title: '时间',
                      key: 'ctime'
                  }
              ],
              columns3: [
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
                      title: '产品名称',
                      key: 'prop_name'
                  },
                  {
                      title: '属性值',
                      key: 'prop_value'
                  }
              ],
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
                      title: '名称',
                      key: 'product_name'
                  },
                  {
                      width: 70,
                      title: '原价',
                      key: 'price'
                  },
                  {
                      title: '类型',
                      key: 'productType'
                  },
                  {
                      title: '使用周期',
                      key: 'product_daycount'
                  },
                  {
                      title: '优惠类型',
                      key: 'preferType'
                  },
                  {
                      title: '优惠条件',
                      key: 'prefer_where'
                  },
                  {
                      width: 80,
                      title: '优惠值',
                      key: 'prefer_value'
                  },
                  {
                      width: 70,
                      title: '推荐',
                      key: 'toper'
                  },
                  {
                      title: '状态',
                      key: 'state',
                      render: (h, params) => {
                          return h('div', [
                              h('span', params.row.state>0?'可用':'不可用')
                          ]);
                      }
                  },
                  {
                      title: '浏览量',
                      key: 'browse_count'
                  },
                  {
                      title: '时间',
                      key: 'ctime'
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
                                          this.attr(params.index)
                                      }
                                  }
                              }, '属性'),
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
                                          this.browse(params.index)
                                      }
                                  }
                              }, '浏览')
                          ]);
                      }
                  }
              ],
              datatable: [],
              comtable:[],
              brotable:[],
              attrtable:[],
              defaultProps: {
                children: 'children',
                label: 'name'
              },
            }
        },
          mounted() {
            this.fileCode=new Date().getTime();
            this.uploadParamHeader={"USER-TOKEN":window.localStorage.getItem("token")};
            this.uploadParamData={fileCode:''};
            this.uploadParamData2={fileCode:this.fileCode};
            this.acturl=this.getHostUrl()+"/commonUploadOrDownload/uploadBackJson.do";
               this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
                     var codelist=eval(data.body.data);
                     this.listState=this.getCodeArray(codelist,'STATE')
                     this.productPreferType=this.getCodeArray(codelist,'MALL_PRODUCT_PREFER_TYPE')
                     this.mallProductType=this.getCodeArray(codelist,'MALL_PRODUCT_TYPE')
               },function(error){
               });
               this.$http.post(this.getHostUrl()+'/adminProductPropManager/listAll.do').then(function(data){
                 this.listOrder=data.body.data
               },function(error){
               });
               this.queryTable(this.parentId);
               var editor = new E('#editorElem')
               editor.customConfig.uploadImgMaxLength = 1
               editor.customConfig.uploadImgTimeout = 30000
               editor.customConfig.uploadImgServer = this.HOST+'/resources/wangEditor/jsp/upload_json.jsp'
               editor.customConfig.onchange = (html) => {
                 this.content = html
               };
               editor.customConfig.uploadImgHooks = {
                     before: function (xhr, editor, files) {
                     },
                     success: function (xhr, editor, result) {
                         // 图片上传并返回结果，图片插入成功之后触发
                         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                     },
                     fail: function (xhr, editor, result) {
                         // 图片上传并返回结果，但图片插入错误时触发
                         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                     },
                     error: function (xhr, editor) {
                         // 图片上传出错时触发
                         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                         // alert("上传失败");
                     },
                     timeout: function (xhr, editor) {
                         // 图片上传超时时触发
                         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                         // alert("上传超时");
                     }
                 }
               editor.create()
          },
        methods: {
          addAttr(index){//添加属性
            this.modal7=true
          },
          delAttr(){//删除属性
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
              onConfirm () {
                _this.$http.post(_this.getHostUrl()+'/adminProductManager/delProp.do',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
                   this.attrquery()
                 },function(error){
                 });
              }
            });
          },
          Attrok(){
            this.$http.post(this.getHostUrl()+'/adminProductManager/addProp.do',{
            productId:this.id,
            propValue:this.attrValue,
            propId:this.attrName
            },{emulateJSON:true}).then(function(data){
              this.attrquery()
              this.modal7=false
            },function(error){
            });
          },
          browse(index){
            this.PagNum1=1
            this.id=this.datatable[index].id
            this.modal5=true
            this.browsequery()
          },
          submitUpload() {
            this.$refs.upload.submit();
          },
          attr:function(index){
            this.id=this.datatable[index].id
            this.modal6=true
            this.attrquery()
          },
          attrquery(){
            this.$http.post(this.getHostUrl()+'/adminProductManager/listProp.do',{productId:this.id},{emulateJSON:true}) .then(function(data){
              this.attrtable=eval(data.body.data)
            },function(error){
            });
          },
          comment:function(index){
            this.PagNum1=1
            this.id=this.datatable[index].id
            this.modal4=true
            this.commentquery()
          },
          browsequery:function(){
            this.$http.post(this.getHostUrl()+'/adminProductManager/listAccessUser.do',{productId:this.id,start:this.PagNum1},{emulateJSON:true}) .then(function(data){
              this.TiaoShu=data.body.totalRecord
              this.pageBig=data.body.pageSize
              this.brotable=eval(data.body.data)
            },function(error){
            });
          },
          commentquery:function(){
            this.$http.post(this.getHostUrl()+'/adminProductManager/listComment.do',{productId:this.id,start:this.PagNum1},{emulateJSON:true}) .then(function(data){
              this.totalRecord1=data.body.totalRecord
              this.pageSize1=data.body.pageSize
              this.comtable=eval(data.body.data)
            },function(error){
            });
          },
          changepage1:function(index){
            this.PagNum1=index
            this.commentquery()
          },
          browFun:function(index){
            this.PagNum1=index
            this.commentquery()
          },
          handlePreview(file) {
              this.file=file;
              if(this.file.name.indexOf("jpg")>=0||this.file.name.indexOf("png")>=0||this.file.name.indexOf("bmp")>=0||this.file.name.indexOf("gif")>=0){
                this.loadingStatus=true;
                return true;
              }else{
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的文件。'
                });
                this.loadingStatus=false;
                return false;
              }
          },
          uploadSuccess(res, file,fileList){
                 if(res.code==0){
                   this.productIcon=res.data[0].url;
                 }else{
                   this.$vux.alert.show({
                     title: '提示',
                     content: '上传失败'
                   });
                 }
                 this.$refs.upload.clearFiles();
                 this.loadingStatus=false;
                 return;
            },
            submitUpload2() {
              this.$refs.upload2.submit();
            },

            handlePreview2(file) {
                this.file=file;
                if(this.file.name.indexOf("jpg")>=0||this.file.name.indexOf("png")>=0||this.file.name.indexOf("bmp")>=0||this.file.name.indexOf("gif")>=0){
                  this.loadingStatus=true;
                  return true;
                }else{
                  this.$Notice.warning({
                      title: '文件格式不正确',
                      desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的文件。'
                  });
                  this.loadingStatus=false;
                  return false;
                }
            },
            uploadSuccess2(res, file,fileList){
                   if(res.code==0){
                     this.imgUrl=res.data[0].url;
                   }else{
                     this.$vux.alert.show({
                       title: '提示',
                       content: '上传失败'
                     });
                   }
                   this.$refs.upload2.clearFiles();
                   this.loadingStatus=false;
                   return;
              },
          loadNode(node, resolve) {
            if(node.level>0){
              this.parentId=node.data.id
            }
            if(node.level==4){
              resolve([]);
              return;
            }
            this.$http.post(this.getHostUrl()+'/adminProductManager/getKindTree.do?pId='+this.parentId).then(function(data){
              var treedata=[];
                for(var i=0;i<data.body.length;i++){
                  treedata.push(data.body[i])
                }
                resolve(treedata);
            },function(error){
            })
          },
          handleNodeClick(data) {
            if(data.isParent==0){
              this.Addmodal=1
              this.parentId=data.id;
              this.queryTable(this.parentId)
            }else{
              this.Addmodal=2
            }
          },
          edit(){
            if(this.selectIds.length<1){
              this.$vux.alert.show({
                title: '提示',
                content: '请选择要修改的商品'
              });
            }else{
              this.modal3=true
            }
          },
          handleNode(data){
              this.isPar=data.isParent
              this.TreeId=data.id
          },
          editok:function(){
            if(this.isPar==1){
              this.$vux.alert.show({
                title: '提示',
                content: '请选择新的分类'
              });
              this.modal3=false;
              setTimeout(() => {
                        this.modal3=true;
                    }, 200);
            }else{
              this.$http.post(this.getHostUrl()+'/adminProductManager/editKind.do',{
                ids:this.selectIds,
                kindId:this.TreeId
                },{emulateJSON:true}).then(function(data){
                  this.queryTable(this.parentId);
                  this.modal3=false;
                },function(error){
                })
            }
          },
          cancel () {
          },
          show (index) {
                var editor = new E('#editorElem')
                editor.customConfig.uploadImgMaxLength = 1
                editor.customConfig.uploadImgTimeout = 30000
                editor.customConfig.uploadImgServer = this.HOST+'/resources/wangEditor/jsp/upload_json.jsp'
                editor.customConfig.onchange = (html) => {
                  this.content = html
                };
                editor.create()
                this.flag=2;
                this.modal2=true;
                this.id=this.datatable[index].id
                this.$http.post(this.getHostUrl()+'/adminProductManager/getProduct.do',{
                  productId:this.id,
                  },{emulateJSON:true}).then(function(data){
                    this.product_name=data.body.product_name
                    this.imgUrl=data.body.img_url
                    this.productIcon=data.body.product_icon
                    this.productUrl=data.body.product_url
                    this.price=data.body.price
                    this.priceSrc=data.body.price_src
                    this.postfee=data.body.postfee
                    this.productType=data.body.product_type
                    this.content=data.body.content
                    this.product_daycount=data.body.product_daycount
                    this.preferType=data.body.prefer_type
                    this.prefer_where=data.body.prefer_where
                    this.prefer_value=data.body.prefer_value
                    this.state=data.body.state
                    this.taobaoke_url=data.body.taobaoke_url
                    editor.txt.html(this.content)
                  },function(error){
                  })
            },
          //添加
          add:function(){
            if(this.Addmodal==1){
              var editor = new E('#editorElem')
              editor.customConfig.uploadImgMaxLength = 1
              editor.customConfig.uploadImgTimeout = 30000
              editor.customConfig.uploadImgServer = this.HOST+'/resources/wangEditor/jsp/upload_json.jsp'
              editor.customConfig.onchange = (html) => {
                this.content = html
              };
              editor.create()
              editor.txt.clear()
              this.flag=1
              this.product_name="",
              this.imgUrl="",
              this.productIcon="",
              this.productUrl="",
              this.price="",
              this.priceSrc="",
              this.postfee="",
              this.productType="",
              this.content="",
              this.product_daycount="",
              this.preferType="",
              this.prefer_where="",
              this.prefer_value="",
              this.state="",
              this.taobaoke_url="",
              this.modal2=true
            }else{
              return
            }
          },
          ok () {
            if(this.flag==2){
              if(!this.product_name==""){
                this.$http.post(this.getHostUrl()+'/adminProductManager/edit.do',{
                  productName:this.product_name,
                  imgUrl:this.imgUrl,
                  productIcon:this.productIcon,
                  productUrl:this.productUrl,
                  price:this.price,
                  priceSrc:this.priceSrc,
                  postFee:this.postfee,
                  productType:this.productType,
                  content:this.content,
                  productDaycount:this.product_daycount,
                  preferType:this.preferType,
                  preferWhere:this.prefer_where,
                  preferValue:this.prefer_value,
                  state:this.state,
                  taobaokeUrl:this.taobaoke_url,
                  productId:this.id
                  },{emulateJSON:true}).then(function(data){
                      this.queryTable(this.parentId);
                      this.modal2=false
                  },function(error){
                    this.modal2=false;
                    setTimeout(() => {
                              this.modal2=true;
                          }, 200);
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
                if(!this.product_name==""){
                        this.$http.post(this.getHostUrl()+'/adminProductManager/add.do',{
                          productName:this.product_name,
                          imgUrl:this.imgUrl,
                          productIcon:this.productIcon,
                          productUrl:this.productUrl,
                          price:this.price,
                          priceSrc:this.priceSrc,
                          postFee:this.postFee,
                          productType:this.productType,
                          content:this.content,
                          productDaycount:this.product_daycount,
                          preferType:this.preferType,
                          preferWhere:this.prefer_where,
                          preferValue:this.prefer_value,
                          state:this.state,
                          taobaokeUrl:this.taobaoke_url,
                          kindId:this.parentId
                          },{emulateJSON:true}).then(function(data){
                              this.queryTable(this.parentId);
                              this.modal2=false
                          },function(error){
                            this.modal2=false;
                            setTimeout(() => {
                                      this.modal2=true;
                                  }, 200);
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
          //选中或展开某个节点时调用
          selectChg:function(selectData){
              //以上是右边列表项
              if(selectData.length<1){
                return;
              }
              if(selectData[0].isParent==0){
                this.queryTable(selectData[0].id);
              }else{
                this.queryTable(0);
              }
          },
          queryTable:function(upid){
            this.parentId=upid;
            this.$http.post(this.getHostUrl()+'/adminProductManager/listAll.do',{kindId:upid,start:this.PagNum},{emulateJSON:true}) .then(function(data){
              this.page=data.body.totalPage
              this.totalRecord=data.body.totalRecord
              this.pageSize=data.body.pageSize
              this.datatable=eval(data.body.data)
            },function(error){
            });
          },
          changepage:function(index){
            this.PagNum=index
              this.queryTable(this.isParent)
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
                _this.$http.post(_this.getHostUrl()+'/adminProductManager/del.do',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
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
.ivu-modal-body{
  height: 800px
}
.attr_modal{
  width: 88px;
  height: 35px;
  background-color:#2d8cf0;
  border: none;
  color: white;
  border-radius: 5px
}
.content{
  width: 87%;
  padding-right: 0
}
.el-tree{
  width: 13%
}
</style>
