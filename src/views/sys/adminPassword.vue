<template>
  <div class="title_top">
    <div class="box">
      <Breadcrumb separator=">">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>附加工具</BreadcrumbItem>
          <BreadcrumbItem>修改密码</BreadcrumbItem>
      </Breadcrumb>
      <ul class="butt_right">
          <li><button type="button" name="button" @click="submit">确定修改</button></li>
      </ul>
      </div>
        <table border="1" class="table">
              <tr>
                <td>旧密码:</td>
                <td><input v-model="old_pass" type="password" name="" value="" class="pass_edit"></td>
              </tr>
              <tr>
                <td>新密码:</td>
                <td><input v-model="new_pass" type="password" name="" value="" class="pass_edit"></td>
              </tr>
        </table>
    </div>
  </div>
</template>
<script>
export default {
        data () {
            return {
              old_pass:'',
              new_pass:''
            }
        },
        methods: {
          submit:function(){
            if(this.old_pass==""||this.new_pass==""){
              this.$vux.alert.show({
                title: '提示',
                content: '请先填写密码！'
              });
            }else if(this.old_pass==this.new_pass){
              this.$vux.alert.show({
                title: '提示',
                content: '旧密码与新密码一致！'
              });
            }else if(this.new_pass.length>20){
              this.$vux.alert.show({
                title: '提示',
                content: '密码长度不能超过20！'
              });
            }else{
              this.$http.post(this.getHostUrl()+'/adminIndex/chgPwd.do',{oldpwd:this.old_pass,newpwd:this.new_pass},{emulateJSON:true}).then(function(data){
                  console.log(data)
                  if(data.body.code==0){
                    this.$vux.alert.show({
                      title: '提示',
                      content: '密码修改成功，请重新登录！'
                    });
                    setTimeout(()=>{
                      this.$router.push({ path: '/Login' })
                    },2000)
                  }
              },function(error){
              });
            }

          },
        }
    }
</script>
<style media="screen">
@import '../../static/css/style.css';
.content{
  width: 80%
}
.table,.table tr th,.table tr td { border:1px solid #ddd; }
.table tr{width: 100%}
.table { width: 100%;  line-height: 25px; text-align: center; border-collapse: collapse;}
.table td:nth-child(even){width: 25%}
.table td:nth-child(odd){width: 25%;}
.pass_edit{

}
</style>
