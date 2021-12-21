// 对一些常用的element组件二次封装
import { Message } from 'element-ui'

// 弹窗提示
export const message = (msg, title) => {
  Message ({
    message: title,
    type: msg,
  })
}
