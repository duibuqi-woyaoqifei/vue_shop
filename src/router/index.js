import { createRouter, createWebHashHistory } from 'vue-router'
// 1. 定义路由组件.
import Login from '../views/Login'
import Home from '../views/Home'
import Register from '../views/Register'
// Home嵌套路由
import HomePersonalInformation from '../components/HomePersonalInformation'
import HomeRoleList from '../components/HomeRoleList'
import HomePermissionList from '../components/HomePermissionList'
import HomeUserList from '../components/HomeUserList'
import HomeProductList from "../components/HomeProductList"
import HomeCommodityClassification from "../components/HomeCommodityClassification"
import HomeCommodityParameterSetting from "../components/HomeCommodityParameterSetting"
import HomeOrderManage from "../components/HomeOrderManage"
import HomeBasicSetting from "../components/HomeBasicSetting"
import HomeDataReport from "../components/HomeDataReport";

// 路由守卫使用
import axios from '../plugnis/axios'
import { ElMessage } from 'element-plus'

// 2. 定义一些路由
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/home', redirect: '/home/personal-information' },
  { path: '/login', name: "登录", component: Login },
  { path: '/register', name: "注册", component: Register },
  {
    path: '/home', name: "主页", component: Home, children: [{
      path: 'personal-information', name: "我的信息", component: HomePersonalInformation
    }, {
      path: 'role-list', name: "角色列表", component: HomeRoleList
    }, {
      path: 'permission-list', name: "权限列表", component: HomePermissionList
    }, {
      path: 'user-list', name: "用户列表", component: HomeUserList
    }, {
      path: 'product-list', name: "商品列表", component: HomeProductList
    }, {
      path: 'commodity-classification', name: "商品分类", component: HomeCommodityClassification
    }, {
      path: 'commodity-parameter-setting', name: "商品参数设置", component: HomeCommodityParameterSetting
    }, {
      path: 'order-manage', name: "订单管理", component: HomeOrderManage
    }, {
      path: 'basic-setting', name: "基本设置", component: HomeBasicSetting
    }, {
      path: 'data-report', name: "数据报表", component: HomeDataReport
    },]
  }
]

// 3. 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由前置导航守卫（访问权限）
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') return next()
  // 校验token
  axios
    .post(
      axios.baseURL + "/token",
      JSON.stringify(window.localStorage.getItem("token"))
    )
    .then((data) => {
      if (data.verify === true) {
        return next()
      } else {
        ElMessage({
          message: "请重新登录！",
          type: "error",
          showClose: true,
        })
        return next("/login")
      }
    })
    .catch((err) => {
      return next("/login")
    });
})


export default router

