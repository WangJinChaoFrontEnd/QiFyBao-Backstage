import Vue from 'vue'
import Router from 'vue-router'
import Index from "../views/Index"
import Login from "../views/Login"
import adminParam from "../views/sys/adminParam"
import adminMenu from "../views/sys/adminMenu"
import adminRole from "../views/sys/adminRole"
import adminOrga from "../views/sys/adminOrga"
import adminCity from "../views/sys/adminCity"
import adminPerson from "../views/sys/adminPerson"
import adminEnterp from "../views/sys/adminEnterp"
import adminStaff from "../views/sys/adminStaff"
import adminNews from "../views/sys/adminNews"
import adminModal from "../views/sys/adminAddNews"
import adminMessage from "../views/sys/adminMessage"
import adminEditNews from "../views/sys/adminEditNews"
import adminProduct from "../views/sys/adminProduct"
import adminProduct_istration from "../views/sys/adminProduct_istration"
import adminProductAttri from "../views/sys/adminProductAttri"
import adminCooperativePar from "../views/sys/adminCooperativePar"
import adminProduct_Order from "../views/sys/adminProduct_Order"
import adminOrderStatistics from "../views/sys/adminOrderStatistics"
import adminRecharge from "../views/sys/adminRecharge"
import adminConsumption from "../views/sys/adminConsumption"
import adminAdvertisement from "../views/sys/adminAdvertisement"
import adminStaffConsumption from "../views/sys/adminStaffConsumption"
import adminEnterpriseQuery from "../views/sys/adminEnterpriseQuery"
import adminUserQuery from "../views/sys/adminUserQuery"
import adminDataQuery from "../views/sys/adminDataQuery"
import adminPassword from "../views/sys/adminPassword"
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
      path: '/sys/adminUserQuery',
      component: adminUserQuery
    },
    {
      path: '/sys/adminPassword',
      component: adminPassword
    },
    {
      path: '/sys/adminDataQuery',
      component: adminDataQuery
    },
    {
      path: '/sys/adminEnterpriseQuery',
      component: adminEnterpriseQuery
    },
    {
      path: '/sys/adminStaffConsumption',
      component: adminStaffConsumption
    },
    {
      path: '/sys/adminRecharge',
      component: adminRecharge
    },
    {
      path: '/sys/adminOrderStatistics',
      component: adminOrderStatistics
    },
    {
      path: '/sys/adminAdvertisement',
      component: adminAdvertisement
    },
    {
      path: '/sys/adminConsumption',
      component: adminConsumption
    },
    {
      path: '/sys/adminProduct_istration',
      component: adminProduct_istration
    },
    {
      path: '/sys/adminProduct_Order',
      component: adminProduct_Order
    },
    {
      path: '/sys/adminCooperativePar',
      component: adminCooperativePar
    },
    {
      path: '/sys/adminProductAttri',
      component: adminProductAttri
    },
    {
      path: '/sys/adminProduct',
      component: adminProduct
    },
    {
      path: '/sys/adminMessage',
      component: adminMessage
    },
    {
      path: '/sys/adminModal',
      component: adminModal
    },
    {
      path: '/sys/adminEditNews',
      component: adminEditNews
    },
    {
      path: '/sys/adminNews',
      component: adminNews
    },
    {
      path: '/sys/adminStaff',
      component: adminStaff
    },
    {
      path: '/sys/adminEnterp',
      component: adminEnterp
    },
    {
      path: '/sys/adminPerson',
      component: adminPerson
    },
    {
      path: '/sys/adminCity',
      component: adminCity
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
