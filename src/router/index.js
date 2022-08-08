import { createRouter, createWebHashHistory } from 'vue-router'
// 1. 定义路由组件.
import Login from '../views/Login'
import Home from '../views/Home'
import Register from '../views/Register'
// Home嵌套路由
import HomePersonalInformation from '../components/HomePersonalInformation'
import HomePlan from '../components/HomePlan'
import HomeUserPermission from '../components/HomeUserPermission'
import HomeUserList from '../components/HomeUserList'
import axios from 'axios'
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
      path: 'plan', name: "计划", component: HomePlan
    }, {
      path: 'user-permission', name: "用户权限", component: HomeUserPermission
    }, {
      path: 'user-list', name: "用户列表", component: HomeUserList
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
      "http://127.0.0.1:3000/token",
      JSON.stringify(window.localStorage.getItem("token"))
    )
    .then((data) => {
      if (data.data.verify === true) {
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

