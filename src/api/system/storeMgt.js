import request from '@/utils/request'

// 添加门店账号
export function addTenant(data) {
  return request({
    url: '/platform/Te/addTenant',
    method: 'post',
    data: data
  })
}
// 获取门店列表
export function getTenant(query) {
  return request({
    url: '/platform/Te/pageTenant',
    method: 'get',
    params: query
  })
}