import Vue from 'vue'
import Router from 'vue-router'
import Index from "../views/Index"
import Login from "../views/Login"
import adminParam from "../views/sys/adminParam"
import adminMenu from "../views/sys/adminMenu"
import adminRole from "../views/sys/adminRole"
import adminOrga from "../views/sys/adminOrga"
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect:'/Login'
    },
    {
      path: '/Index',
      component: Index
    },
    {
      path: '/sys/adminParam',
      component: adminParam
    },
    {
      path: '/sys/adminMenu',
      component: adminMenu
    },
    {
      path: '/sys/adminOrga',
      component: adminOrga
    },
    {
      path: '/sys/adminRole',
      component: adminRole
    },
    {
      path: '/Login',
      component: Login
    }
  ]
})
