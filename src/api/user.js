import request from '@/utils/request'

// 登录 获取token
export const loginApi = (data) => {
  return request({
    url: 'login',
    method: 'POST',
    data
  })
}

// 请求列表数据
export const getMenuListApi = () => {
  return request({
    url: 'menus',
    method: 'GET'
  })
}

// 请求用户列表
export const getUserListApi = (params) => {
  return request({
    url: 'users',
    method: 'GET',
    params
  })
}

// 请求用户数据
export const getUserApi = (id) => {
  return request({
    url: `users/${id}`,
    method: 'GET'
  })
}

// 添加用户
export const addUserApi = (data) => {
  return request({
    url: 'users',
    method: 'POST',
    data
  })
}

// 删除用户
export const delectUserApi = (id) => {
  return request({
    url: `users/${id}`,
    method: 'DELETE'
  })
}

// 修改用户管理员状态
export const changeUserStateApi = (id, mg_state) => {
  return request({
    url: `users/${id}/state/${mg_state}`,
    method: 'PUT'
  })
}

// 修改用户
export const editUserApi = (id, data) => {
  return request({
    url: `users/${id}`,
    method: 'PUT',
    data
  })
}

// 获取所有角色的列表
export const getRolesListApi = (id, data) => {
  return request({
    url: `roles`,
    method: 'GET',
    data
  })
}

// 分配角色
export const setRoleApi = (userId, data) => {
  return request({
    url: `users/${userId}/role`,
    method: 'PUT',
    data
  })
}
