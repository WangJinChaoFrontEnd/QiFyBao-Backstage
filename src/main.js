// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import VueResource from 'vue-resource'
import myhelp from './help'
// import $ from 'jquery'
import { AlertPlugin,LoadingPlugin,ConfirmPlugin } from 'vux'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Vuex from 'vuex'
import store from './vuex/store'
Vue.use(Vuex)
Vue.use(LoadingPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ElementUI)
import myutil from './static/js/util.js'
Vue.use(myutil);
Vue.config.productionTip = false
Vue.use(iView)
Vue.use(VueResource)
Vue.prototype.HOST = '/qfb';
/* eslint-disable no-new */
Vue.http.interceptors.push((request, next) => {
    //  this.showLoading = true;
    if(window.localStorage.getItem("token")==null||window.localStorage.getItem("token")==""){
      if(request.url.indexOf('/adminLogin/login.do')<0&&request.url.indexOf('common/getWebToken.do')<0){
        self.location.href="http://localhost:8080/?#/Login";
        return;
      }
    }
    Vue.http.headers.common['USER-TOKEN']=window.localStorage.getItem("token");
    // console.log(window.localStorage.getItem("token"));
     myhelp.$emit('toggleLoading', true)
    next((response) => {
        myhelp.$emit('toggleLoading', false);
        if(response.ok && response.body.timeout==1){
          // this.$router.push({ path: '/Index' })  跳转首页
          self.location.href="http://localhost:8080/?#/Login";
        }
        if(!response.ok){
            myhelp.$emit('toggleErrDialog',true,response.status);
        }
        return response
    });
});
router.beforeEach(function (to, from, next) {
  iView.LoadingBar.start();
  next();
}),
router.afterEach(function (to) {
  iView.LoadingBar.finish();
}),
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
