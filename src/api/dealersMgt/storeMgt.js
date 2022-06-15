import request from '@/utils/request'

// 添加门店账号
export function addTenant(data) {
  return request({
    url: '/platform/Te/addTenant',
    method: 'post',
    data: data
  })
}
// 编辑门店账号
export function editTenant(data) {
  return request({
    url: '/platform/Te/editTenant',
    method: 'post',
    data: data
  })
}
// 获取门店列表
export function getTenant(data) {
  return request({
    url: '/platform/Te/pageTenant',
    method: 'post',
    data: data
  })
}
// 根据ID删除门店
export function deleteTenant(dataSource) {
  return request({
    url: '/platform/Te/deleteTenant/' + dataSource,
    method: 'get'
  })
}
// 锁定
export function setStatues(query) {
  return request({
    url: '/platform/Te/setStatues/',
    method: 'get',
    params: query
  })
}