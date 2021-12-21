import request from "@/utils/request"

// 获取商品列表
export const getGoodsListApi = params => {
  return request({
    url: "goods",
    method: "GET",
    params
  })
}

// 删除商品
export const removeGoodsApi = id => {
  return request({
    url: `goods/${id}`,
    method: "DELETE"
  })
}

// 获取商品分类列表
export const getCartListApi = () => {
  return request({
    url: `categories`,
    method: "GET"
  })
}
