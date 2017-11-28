<template>
    <div>
      <!--外围DIV-->
      <!--top_title-->
      <div class="layout">
        <Menu mode="horizontal" theme="dark" active-name="1">
            <div class="layout-logo"><img src="../static/images/logo.png"></div>
                <div class="layout-text">
                      <Icon type="android-apps"></Icon>
                      后台管理系统
                </div>
            <div class="layout-nav">
                <ul class="user" @click="show=!show">
                    <li><Avatar style="background-color: #87d068" icon="person" /></li>
                    <li>{{userinfo.uName}}</li>
                    <li><Icon type="arrow-down-b"></Icon></li>
                    <transition name="bounce">
                        <li class="flex_box" v-if="show">
                              <div><a href="" style="color:white">修改密码</a></div>
                              <div><a href="javascript:;" style="color:white" @click="Sign_out">退出当前账号</a></div>
                        </li>
                    </transition>
                </ul>
            </div>
        </Menu>
    </div>
      <!--top_title-END-->
        <div class="nav">
            <Menu theme="dark" @on-select="addTabs">
                <Submenu v-for="item in menu" v-if="item.pId==1" :name="item.mKey" key="">
                    <template slot="title" v-if="item.pId==1">{{item.mName}}</template>
                    <MenuItem v-for="item2 in menu" v-if="item.pId==1&&item2.pId==item.mId" :name="item2.mKey" key="">{{item2.mName}}</MenuItem>
                </Submenu>
            </Menu>
        </div>
        <div class="pane">
          <el-tabs v-model="activeTabName" type="card" editable  @tab-remove="closeTab">
              <el-tab-pane  key=""  v-for="item in tabList"  :label="item.label"  :name="item.name">
                <component :is="item.component"></component>
              </el-tab-pane>
          </el-tabs>
          <!--<Tabs v-model="activeTabName" type="card" closable @on-tab-remove="closeTab">
              <TabPane v-for="item in tabList" :label="item.label" :name="item.name" :closable="item.closable" key="">
                <component :is="item.component"></component>
              </TabPane>
          </Tabs>-->
        </div>
        <!--外围DIV-END-->
    </div>
</template>
<script>
import "../static/js/iconfont.js"
const Home = resolve => require(['./Home'], resolve)
export default {
    name: 'Home',
    data(){
      return {
        show:false,
        userinfo:{
          uName:''
        },
        menu:[],
        tabList:[{
            label: '主页',
            name: 'home',
            disabled: false,
            closable: false,
            component: Home
        }],
        activeTabName:'home'
      }
    },
    created() {
        this.$http.post(this.getHostUrl()+'/adminIndex/getLoginInfo.do').then(function(data){
              if(data.body.data==null||data.body.data.length<7){
                return;
              }else{
                this.userinfo=data.body.data
              }
         },function(error){
         });
         this.$http.post(this.getHostUrl()+'/adminIndex/getMenu.do').then(function(data){
            this.menu=data.body.data
         },function(error){
         });
    },
    methods:{
      //退出当前账号
      Sign_out:function(){
        this.$http.post(this.getHostUrl()+'/adminLogin/logout.do').then(function(data){
              if(data.body.code==0){
                this.$router.push({ path: '/Login' })
              }
        },function(error){
        })
      },
      toggle:function(){
        this.show=!this.show
      },
      addTabs:function(name){
        var viewname="";
        for(var i=0;i<this.menu.length;i++){
          if(this.menu[i].mKey==name){
            viewname=this.menu[i].mUrl;
            if (this.tabList.filter(f => f.name == name) == 0) {
                let component = resolve => require([`../views${viewname}`], resolve)
                this.tabList.push({
                    label: this.menu[i].mName,
                    name: this.menu[i].mKey,
                    disabled: false,
                    closable: true,
                    component: component
                });
                console.log(this.tabList)
            }
            break;
          }
        }
        this.activeTabName=name;
      },
      closeTab:function(name) {
        let tab = this.tabList.filter(f => f.name == name)[0];
        let index = this.tabList.indexOf(tab);
        this.tabList = this.tabList.filter(f => f.name != name);
        // if (index != this.tabList.length - 1) {
        //   this.activeTabName = this.tabList[index + 1].name;
        // } else {
        //   this.activeTabName = this.tabList[index - 1].name;
        // }
        this.activeTabName = this.tabList[this.tabList.length-1].name;
      }
    }
}
</script>
<style>
.bounce-enter-active {
  animation: bounce-in 0.5s linear;
}
.bounce-leave-active {
  animation: bounce-out 0.5s linear;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
}
body{
  margin:0
}
.nav {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: #495060;
    margin-top: 61px;
    width: 150px;
}
.layout-text{
  float: left;
  color: white;
  line-height: 80px;
  margin-left: 10px
}
.nav .ivu-menu-submenu{
  width: 150px
}

.pane {
    position: absolute;
    left: 15rem;
    top: 0;
    bottom: 0;
    right: 0;
    margin-top: 61px;
}

.el-menu--dark{
  background-color:#495060
}
.el-menu--dark .el-submenu .el-menu{
  background-color: #363e4f
}
/*top_title*/
.layout{
        border: 1px solid #495060;
        background: #f5f7f9;
        height: 60px;
        height: 60px;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 999
    }
    .layout-logo{
        width: 160px;
        height: 50px;
        float: left;
        position: relative;
        top: 4px;
        left: 20px;
        line-height: 0
    }
    .layout-logo img{
      width: 100%;
      height: 100%;
      margin: 0
    }
    .layout-nav{
        float: right
    }
    .user li{
      float: left;
    }
    .user{
      height: 60px;
      width: 300px;
      margin-top: 5px;
      height: 45px;
      position: relative;
      cursor: pointer;
    }
    .user li:nth-child(1){
      width: 45px;
      height: 45px;
      overflow: hidden;
      border-radius: 100px;

    }
    .user li:nth-child(2){
      color: white;
      width: 200px;
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height:45px
    }
    .user li:nth-child(3){
      float: left;
      margin-left: 5px;
      color: white;
      line-height: 45px;
      cursor: pointer;
    }
    .user li img{
      width: 100%;
      height: 100%
    }
    .flex_box{
      width: 100px;
      height: 80px;
      background-color: #495060;
      position: absolute;
      right: 0;
      bottom: -90px;
    }
    .flex_box div{
      color: white;
      line-height: 40px;
      text-align: center;
      border-bottom: solid 1px white
    }
    .ivu-avatar.ivu-avatar-icon{
        margin-top: 6px;
        margin-left: 12px;
    }
    .ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item{
      padding-left: 10px
    }
    /*top_title_END*/
</style>
