<template>
    <div style="height:100%">
        <div class="warp_box">
                <div class="content_box">
                  <div class="left_img">
                    <div class=""></div>
                      <img src="../static/images/Leaf.png" alt="">
                  </div>
                  <!--以下是登录表单-->
                  <div class="admin_from_box">
                    <button type="button" name="button" @click="clearCookie"></button>
                    <form class="">
                    <ul class="admin_from">
                      <li>登录<span>SIGN IN</span></li>
                      <li>
                        <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-shouji"></use>
                        </svg>
                        <input type="text"    v-model="phoneNum" placeholder="手机号" @blur="checkShow">
                          <span class="phone_Prompt" v-show="Prompt_phone">*请输入合法的用户名，且不能为空！</span>
                      </li>
                      <li>
                        <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-mima"></use>
                        </svg>
                        <input type="password" name="" v-model="password_text" placeholder="密码">
                        <span class="phone_Prompt" v-show="PassWord">*请输入密码，不能为空！</span>
                      </li>
                      <li><div v-show="name"><span><input type="checkbox" v-model="checked" name="" @click="username">&nbsp;记住用户名</span></div></li>
                      <li><input type="submit" name="" value="登录" @click="SignIn"></li>
                    </ul>
                    </form>
                  </div>
              </div>
        </div>
    </div>
</template>
<script>
import "../static/js/iconfont.js"
export default {
    name: 'Home',
    data(){
      return {
          phoneNum:'',
          Prompt_phone:false,
          PassWord:false,
          password_text:'',
          checked:true,
          newPhone:'',
          name:false,
      }
    },
    mounted () {
      localStorage.removeItem("token");
      this.$http.post(this.getHostUrl()+'/api/common/getWebToken.do').then(function(data){
        // console.log(data)
            localStorage.setItem("token",data.body.token)
            // console.log(window.localStorage.getItem("token"))
      },function(error){
        this.warning()
      })
    },
    created() {
          this.checkCookie()
      },

    watch:{
      phoneNum:function(newVal,oldVal){
        if(!newVal.length==""){
          this.Prompt_phone=false
          this.newPhone=newVal
        }else{
          this.Prompt_phone=true
        }
      },
      password_text:function(newVal,oldVal){
        if(!newVal.length==""){
          this.PassWord=false
          this.password_text=newVal
        }else{
          this.PassWord=true
        }
      }
    },
    methods:{
      checkShow () {
        if(!this.phoneNum.length==""){
          this.name=true
        }
      },
      success () {
          this.$Message.success('登录成功!');
        },
      warning () {
          this.$Message.warning('请填写完整信息!');
        },
      error () {
          this.$Message.error('失败');
        },
        username:function(){
          if(this.checked){
            this.clearCookie();
            this.checkCookie();
          }else{
            this.clearCookie();
          }
        },
        SignIn:function() {
             if(!this.newPhone=="" && !this.password_text==""){
               //这是登录接口
                this.$http.post(this.getHostUrl()+'/adminLogin/login.do?mobile='+this.newPhone+'&pwd='+this.password_text).then(function(data){
                  // console.log(data)
                  //  console.log(window.localStorage.getItem("token"))
                      if(data.body.code==0){
                        this.success()
                        if(this.checked){
                          this.clearCookie();
                          this.checkCookie();
                        }else{
                          this.clearCookie();
                        }
                        this.$router.push({ path: '/Index' })
                      }else{
                        this.error()
                      }
              },function(error){
                  this.error()
              })
            }else{
              this.warning()
            }
        },
      //设置cookie
        setCookie: function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        //获取cookie
        getCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "";
        },
        //清除cookie
        clearCookie: function () {
            this.setCookie("username", "", -1);
        },
        checkCookie: function () {
            this.phoneNum = this.getCookie("username");
            if (this.phoneNum != "") {
                console.log("")
            } else {
                this.phoneNum = this.newPhone
                if (this.phoneNum != "" && this.phoneNum != null) {
                    this.setCookie("username", this.phoneNum, 365);//1是时间
                }
            }
        }
    },
    components: {
    }
}
</script>
<style>
.warp_box{
  width: 100%;
  height: 100%;
  background: url("../static/images/BackG.png") 100% ;
  position: relative;
  overflow: hidden;
}
input[type='number'] {
    -moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
-webkit-appearance: none;
margin: 0;
}
.phone_Prompt{
  position: absolute;
  left: 0;
  bottom: -24px;
  color: red
}
.content_box{
  width: 900px;
  height: 640px;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -320px;
  margin-left: -450px;
}
.left_img{
  float: left;
  width: 320px;
  height: 640px;
}
.left_img img{
  width: 100%;
  height: 100%;
}
.admin_from_box{
  float: left;
  width: 580px;
  position: relative;
}
.admin_from_box .admin_from{
  width: 420px;
  height: 420px;
  position: absolute;
  left: 50%;
  top:50%;
  margin-left: -210px;
  margin-top: 110px;
}
.admin_from li:nth-child(1){
  font-size: 34px;
}
.admin_from li:nth-child(1) span{
  font-size: 26px;
  margin-left: 20px;
  color: #7bae5f
}
.admin_from li:nth-child(2),.admin_from li:nth-child(3){
  width: 100%;
  border-bottom: solid 1px #f0f0f0;
  margin-top: 47px;
  position: relative;
  height: 54px;
}
.icon {
   width: 1em; height: 1em;
   vertical-align: -0.15em;
   fill: currentColor;
   overflow: hidden;
   font-size: 30px;
   margin-top: 10px
}
.admin_from li:nth-child(2) i{
  float: left;
  line-height:50px;
}
.admin_from li:nth-child(2) input{
  float: right;
  height: 50px;
  width: 370px;
  border: none;
  color:#555;
  font-size: 16px;
}
.admin_from li:nth-child(3) i{
  float: left;
  line-height:50px;
}
.admin_from li:nth-child(3) input{
  float: right;
  height: 50px;
  width: 370px;
  border: none;
  color:#555;
  font-size: 16px;
}
.admin_from li:nth-child(4) span:nth-child(1){
  display: block;
  float: left;
  font-size: 16px;
  color: #666
}
.admin_from li:nth-child(4) span:nth-child(2){
  display: block;
  float: right;
}
.admin_from li:nth-child(4) span:nth-child(2) a{
  color: #7bae5f;
  font-size: 16px
}
.admin_from li:nth-child(4){
  overflow: hidden;
  margin-top: 50px
}
.admin_from li:nth-child(5) input{
  width: 100%;
  height: 50px;
  background-color: #7bae5f;
  border: none;
  border-radius: 8px;
  margin-top: 49px;
  color: white;
  font-size: 22px
}

</style>
