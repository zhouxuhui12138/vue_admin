import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "@/store"
import request from "@/utils/request"

Vue.config.productionTip = false

// Element Ui 引入
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
Vue.use(ElementUI)

// 引入自己的全局css
import "@/assets/css/main.css"

// 二次封装element
import { message } from "@/utils/element"
Vue.prototype.$msg = message

// 全局注册富文本编辑器
import VueQuillEditor from "vue-quill-editor"
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"
Vue.use(VueQuillEditor)

Vue.prototype.$http = request

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
