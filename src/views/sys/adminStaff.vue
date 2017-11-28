<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>资料管理</BreadcrumbItem>
          <BreadcrumbItem>企业员工管理</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
          <li><button type="button" name="button" @click="add"><Icon type="plus"></Icon>&nbsp;添加</button></li>
          <li><button type="button" name="button" @click="del"><Icon type="trash-a" style="font-size:16px"></Icon>&nbsp;删除</button></li>
          <li><button type="button" name="button" @click="setMan"><Icon type="gear-b" style="font-size:16px"></Icon>&nbsp;设置管理员</button></li>
          <li style="margin-left:10px"><button type="button" name="button" @click="Import"><Icon type="forward" style="font-size:16px"></Icon>&nbsp;导入</button></li>
      </ul>
      </div>
        <el-tree :data="baseData" :props="defaultProps" :load="loadNode" lazy="" @node-click="handleNodeClick"></el-tree>
        <div class="content">
            <Table stripe border :columns="columns4" :data="datatable" @on-selection-change="selectAll"></Table>
        </div>
        <!--修改弹出框开始-->
        <Modal v-model="modal2" title="添加或编辑" :loading="loading"  @on-ok="ok('formValidate')" @on-cancel="cancel" >
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                <FormItem label="状态" prop="ustate">
                    <Select v-model="formValidate.ustate">
                        <Option v-for="item in listType" :value="item.code"  key="">{{item.name}}</Option>
                    </Select>
                </FormItem>
                    <FormItem label="姓名" prop="userName">
                        <Input v-model="formValidate.userName"></Input>
                    </FormItem>
                    <FormItem label="性别"  prop="sex">
                        <Select v-model="formValidate.sex">
                            <Option v-for="item in sexTypesel" :value="item.code"  key="">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="手机号" prop="mobile">
                        <Input v-model="formValidate.mobile"></Input>
                    </FormItem>
                    <FormItem label="证书类型" prop="certType">
                        <Select v-model="formValidate.certType">
                            <Option v-for="item in certTypesel" :value="item.code"  key="">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="证件号" prop="cert_no">
                        <Input v-model="formValidate.cert_no"></Input>
                    </FormItem>
                    <FormItem label="出生日期" prop="birthday">
                            <DatePicker type="date" :editable="enablew" :format="dateFormat" @on-change="changeDate1" v-model="formValidate.birthday" placeholder="选择日期"></DatePicker>
                    </FormItem>
                    <FormItem label="入职日期" prop="inday">
                            <DatePicker type="date" :editable="enablew" :format="dateFormat" @on-change="changeDate2" v-model="formValidate.inday" placeholder="选择日期"></DatePicker>
                    </FormItem>
                    <FormItem label="邮箱" prop="mail">
                        <Input v-model="formValidate.mail"></Input>
                    </FormItem>
                    <FormItem label="备注" prop="memo">
                        <Input v-model="formValidate.memo"></Input>
                    </FormItem>
              </Form>
        </Modal>
        <!--修改弹出框结束-->
        <!--设置管理员弹出框开始-->
        <Modal v-model="modal3" title="设置管理员" :loading="loading"  @on-ok="ok" @on-cancel="cancel" >
                <RadioGroup v-model="vertical" vertical @on-change="redioAll">
                  <Radio label="设置管理员">
                      <span>设置管理员</span>
                  </Radio>
                  <Radio label="取消管理员">
                      <span>取消管理员</span>
                  </Radio>
              </RadioGroup>
        </Modal>
        <!--设置管理员弹出框结束-->
        <!--导入弹出框开始-->
        <Modal v-model="modal4" title="导入"  :loading="loading" @on-ok="ok" @on-cancel="cancel">
          <el-upload class="upload-demo" ref="upload" name="userExcel" :action="acturl" :file-list="fileList" :before-upload="handlePreview" :on-success="uploadSuccess" :show-file-list="true" list-type="xls/xlsx" :auto-upload="false" :data="uploadParamData"  :headers="uploadParamHeader">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">立即上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过10M<br/>{{ loadingStatus ? '上传中....' : '' }}</div>
          </el-upload>
        </Modal>
        <!--导入弹出框结束-->
    </div>
  </div>
</template>
<script>
export default {
        data () {
          const validatePass = (rule, value, callback) => {
                if(!(/^1(3|4|5|7|8)\d{9}$/.test(value))||value===""){
                    callback(new Error('合法手机号并且不能为空'));
                 }else{
                   callback();
                 }
            }
            const validateCard = (rule, value, callback) => {
                  if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))||value===""){
                      callback(new Error('合法身份证号并且不能为空'));
                   }else{
                     callback();
                   }
              }
            const validatestate = (rule, value, callback) => {
                    if(value===""){
                        callback(new Error('不能为空'));
                     }else{
                       callback();
                     }
                }
            const validateSex = (rule, value, callback) => {
                      if(value===""){
                          callback(new Error('不能为空'));
                       }else{
                         callback();
                       }
                  }
            const validateType = (rule, value, callback) => {
                        if(value===""){
                            callback(new Error('不能为空'));
                         }else{
                           callback();
                         }
                    }
            return {
              enablew:false,
              dateFormat:'yyyy-MM-dd',
              formValidate: {
                    userName: '',
                    mail: '',
                    city: '',
                    sex: '',
                    cert_no:'',
                    mobile:'',
                    ustate:'',
                    certType:'',
                    interest: [],
                    birthday: '',
                    inday:'',
                    time: '',
                    memo: '',
                    desc: ''
                },
                ruleValidate: {
                    userName: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    ustate: [
                        { required: true, validator: validatestate, trigger: 'change' }
                    ],
                    certType: [
                        { required: true, validator: validateType, trigger: 'change' }
                    ],
                    cert_no: [
                        { required: true, validator: validateCard, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    mail: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    sex: [
                        { required: true, validator: validateSex, trigger: 'change'}
                    ],
                    city: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    birthday: [
                        { required: true,  message: '请选择日期', trigger: 'change' }
                    ],
                    inday: [
                        { required: true,  message: '请选择时间', trigger: 'change' }
                    ]
                },
              modalClassName:'ivu-modal_upload',
              vertical: '设置管理员',
              flag:0,
              loadingStatus: false,
              loading:true,
              modal2:false,
              modal3:false,
              fileList:[],
              uploadParamData:{},
              uploadParamHeader:{},
              modal4:false,
              acturl:"",
              corpId:0,
              userId:'',
              userName:'',
              managerStatus:'',
              ustate:'',
              sex:'',
              mobile:'',
              cert_no:'',
              mail:'',
              memo:"",
              certType:"",
              selectIds:'',
              TreedataIds:'',
              id:0,
              listType:[],
              sexTypesel:[],
              certTypesel:[],
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
                      type: 'selection',
                      width: 60,
                      align: 'center'
                  },
                  {
                      title: 'ID',
                      key: 'userId'
                  },
                  {
                      title: '姓名',
                      key: 'userName'
                  },
                  {
                      title: '性别',
                      key: 'sex'
                  },
                  {
                      title: '手机号',
                      key: 'mobile'
                  },
                  {
                      title: '邮箱',
                      key: 'mail'
                  },
                  {
                      title: '入职日期',
                      key: 'inday'
                  },
                  {
                      title: '状态',
                      key: 'ustate',
                      render: (h, params) => {
                          return h('div', [
                              h('span', params.row.corp_state>0?'可用':'不可用')
                          ]);
                      }
                  },
                  {
                      title: '管理员',
                      key: 'manager',
                      render: (h, params) => {
                          return h('div', [
                              h('span', params.row.manager>0?'管理员':'否')
                          ]);
                      }
                  },
                  {
                      title: '备注',
                      key: 'memo'
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
              datatable: [],
              defaultProps: {
                children: 'children',
                label: 'title'
              },
            }
        },
          created() {
               this.$http.post(this.getHostUrl()+'/api/common/getSysCode.do').then(function(data){
                     var codelist=eval(data.body.data);
                     this.listType=this.getCodeArray(codelist,'STATE');
                     this.sexTypesel=this.getCodeArray(codelist,'SEX');
                     this.certTypesel=this.getCodeArray(codelist,'CERT_TYPE');
               },function(error){
               });
          },
        methods: {
          changeDate1(data){
            this.formValidate.birthday=data;
          },
          changeDate2(data){
            this.formValidate.inday=data;
          },
          submitUpload() {
            this.$refs.upload.submit();
          },
          handlePreview(file) {
              this.file=file;
              if(this.file.name.indexOf("xls")>=0||this.file.name.indexOf("xlsx")>=0){
                this.loadingStatus=true;
                return true;
              }else{
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 xls 或 xlsx 格式的文件。'
                });
                this.loadingStatus=false;
                return false;
              }
            },
            uploadSuccess(res, file,fileList){
                 if(res.code==0){
                   this.$vux.alert.show({
                     title: '提示',
                     content: '导入提交成功，系统稍后会自动导入'
                   });
                 }else{
                   this.$vux.alert.show({
                     title: '提示',
                     content: res.msg
                   });
                 }
                 this.$refs.upload.clearFiles();
                 this.loadingStatus=false;
                 return;
            },
            Import(){
              if(this.corpId==0){
                this.$vux.alert.show({
                  title: '提示',
                  content: '请先选择区县'
                });
                return;
              }
              this.uploadParamHeader={"USER-TOKEN":window.localStorage.getItem("token")};
              this.uploadParamData={corpId:this.corpId};
              this.acturl=this.getHostUrl()+"/adminCorpUserManager/adminUserUploadImport.do"
              this.modal4=true
            },
          redioAll(data){
            if(data=="取消管理员"){
              this.managerStatus=0
            }else if(data=="设置管理员"){
              this.managerStatus=1
            }
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
            if(data.isParent==0){
              this.corpId=data.id;
              this.queryTable()
            }else{
              this.corpId=0;
              this.datatable=[];
            }
          },
          cancel () {
          },
          show (index) {
                this.flag=2;
                this.userId=this.datatable[index].userId
                this.formValidate.userName=this.datatable[index].userName
                this.formValidate.sex=this.datatable[index].sex
                if(this.formValidate.sex=="男"){
                  this.formValidate.sex=0
                }else if(this.formValidate.sex=="女"){
                  this.formValidate.sex=1
                }else if(this.formValidate.sex="未知"){
                  this.formValidate.sex=2
                }
                this.formValidate.mobile=this.datatable[index].mobile
                this.formValidate.birthday=this.datatable[index].birthday
                this.formValidate.inday=this.datatable[index].inday
                this.formValidate.mail=this.datatable[index].mail
                if(this.datatable[index].certType=="身份证"){
                  this.formValidate.certType=1
                }else if(this.datatable[index].certType=="军官证"){
                  this.formValidate.certType=2
                }
                this.formValidate.cert_no=this.datatable[index].cert_no
                this.formValidate.memo=this.datatable[index].memo
                this.formValidate.ustate=this.datatable[index].ustate
                this.modal2=true;
            },
          //添加
          add:function(){
            if(this.corpId==0){
              this.$vux.alert.show({
                title: '提示',
                content: '请先选择区县'
              });
              return;
            }
            this.flag=1
            this.formValidate.ustate=""
            this.formValidate.memo=""
            this.formValidate.cert_no=""
            this.formValidate.mail=""
            this.formValidate.certType=""
            this.formValidate.inday=""
            this.formValidate.birthday=""
            this.formValidate.mobile=""
            this.formValidate.sex=""
            this.formValidate.userName=""
            this.modal2=true
          },
          ok (name) {
            if(this.flag==2){
              this.$refs[name].validate((valid) => {
                    if (valid) {
                      this.$http.post(this.getHostUrl()+'/adminCorpUserManager/edit.do',{
                          userId:this.userId,
                          userName:this.formValidate.userName,
                          sex:this.formValidate.sex,
                          mobile:this.formValidate.mobile,
                          birthDay:this.formValidate.birthday,
                          inDay:this.formValidate.inday,
                          mail:this.formValidate.mail,
                          certType:this.formValidate.certType,
                          certNo:this.formValidate.cert_no,
                          memo:this.formValidate.memo,
                          userState:this.formValidate.ustate
                      },{emulateJSON:true}).then(function(data){
                        this.queryTable();
                        this.modal2=false
                      },function(error){

                      });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
              }else if(this.flag==1){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                      this.$http.post(this.getHostUrl()+'/adminCorpUserManager/add.do',{
                          corpId:this.corpId,
                          userName:this.formValidate.userName,
                          sex:this.formValidate.sex,
                          mobile:this.formValidate.mobile,
                          deptId:0,
                          birthDay:this.formValidate.birthday,
                          inDay:this.formValidate.inday,
                          mail:this.formValidate.mail,
                          certType:this.formValidate.certType,
                          certNo:this.formValidate.cert_no,
                          memo:this.formValidate.memo,
                          userState:this.formValidate.ustate
                      },{emulateJSON:true}).then(function(data){
                        this.queryTable();
                        this.modal2=false
                      },function(error){
                      });
                    } else {
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
                })
            }else if(this.flag==3){
              this.$http.post(this.getHostUrl()+'/adminCorpUserManager/setManager.do',{ids:this.selectIds,managerStatus:this.managerStatus},{emulateJSON:true}) .then(function(data){
                this.queryTable();
                this.modal3=false
              },function(error){
                this.modal3=false
              });
            }else{
              this.modal4=false
            }
          },
          queryTable:function(){
            this.$http.post(this.getHostUrl()+'/adminCorpUserManager/list.do',{corpId:this.corpId},{emulateJSON:true}) .then(function(data){
              console.log(data)
              this.datatable=eval(data.body.data)
            },function(error){
            });
          },
          //删除
          selectAll:function(data){
            this.selectIds="";
            for(var j=0;j<data.length;j++){
              this.selectIds+=","+data[j].userId;
            }
          },
          setMan(){
            this.flag=3;
            if(this.selectIds.length<1){
              this.$vux.alert.show({
                title: '提示',
                content: '没有选中设置项'
              });
              return;
            }
            this.modal3=true
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
                _this.$http.post(_this.getHostUrl()+'/adminCorpUserManager/del.do',{ids:_this.selectIds},{emulateJSON:true}).then(function(data){
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
/*body .ivu-modal-body:nth-child(3){
  height: 120px
}*/
</style>
