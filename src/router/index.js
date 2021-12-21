import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

// 路由懒加载 引入组件
const Login = () => import("@/pages/Login")
const Home = () => import("@/pages/Home")
const User = () => import("@/pages/User")
const Rights = () => import("@/pages/Power/Rights.vue")
const Roles = () => import("@/pages/Power/Roles.vue")
const GoodsList = () => import("@/pages/Goods/GoodsList.vue")
const AddGoods = () => import("@/pages/Goods/AddGoods.vue")
const GoodsParams = () => import("@/pages/Goods/GoodsParmas.vue")
const GoodsCategories = () => import("@/pages/Goods/GoodsCategories.vue")
const Order = () => import("@/pages/Order")
const Report = () => import("@/pages/Report")
const welcome = () => import("@/components/Welcome")

const routes = [
  // 路由重定向
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      { path: "/welcome", component: welcome },
      { path: "/users", component: User },
      { path: "/goods", component: GoodsList },
      { path: "/goods/add", component: AddGoods },
      { path: "/params", component: GoodsParams },
      { path: "/categories", component: GoodsCategories },
      { path: "/reports", component: Report },
      { path: "/orders", component: Order },
      { path: "/rights", component: Rights },
      { path: "/roles", component: Roles },
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next()

  const token = localStorage.getItem("token")
  if (!token) {
    return next("/login")
  }
  next()
})

export default router
