import axios from "axios"
import { Loading } from "element-ui"

const baseURL = "https://lianghj.top:8888/api/private/v1/"

const request = axios.create({
  baseURL
})

// 请求拦截器
request.interceptors.request.use(config => {
  // 每次请求都带上token
  config.headers.Authorization = localStorage.getItem("token")
  // 加载
  Loading.service({
    text: "加载中"
  })
  // 返回配置对象
  return config
})

// 响应时拦截器
request.interceptors.response.use(config => {
  // 结束加载
  let loadingInstance = Loading.service()
  loadingInstance.close()
  return config
})

export default request
