import request from "@/utils/request"

// 获取权限列表数据
export const getRightsListApi = () => {
  return request({
    url: "rights/list",
    method: "GET"
  })
}

// 获取角色列表数据
export const getRolesListApi = () => {
  return request({
    url: "roles",
    method: "GET"
  })
}

// 添加角色
export const addRoleApi = data => {
  return request({
    url: "roles",
    method: "POST",
    data
  })
}

// 删除角色
export const deleteRoleApi = id => {
  return request({
    url: `roles/${id}`,
    method: "DELETE"
  })
}

// 修改角色
export const editRoleApi = (id, data) => {
  return request({
    url: `roles/${id}`,
    method: "PUT",
    data
  })
}

// 获取角色
export const getRoleApi = (id, data) => {
  return request({
    url: `roles/${id}`,
    method: "GET"
  })
}

// 删除角色权限
export const delectRoleRightsApi = (roleId, rightsId) => {
  return request({
    url: `roles/${roleId}/rights/${rightsId}`,
    method: "DELETE"
  })
}

// 获取权限列表
export const getRightListApi = () => {
  return request({
    url: `rights/tree`,
    method: "GET"
  })
}

// 分配权限
export const setRightsApi = (roleId, data) => {
  return request({
    url: `roles/${roleId}/rights`,
    method: "POST",
    data
  })
}
