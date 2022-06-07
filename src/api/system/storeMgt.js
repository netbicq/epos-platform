import request from '@/utils/request'

// 添加门店账号
export function addTenant(data) {
  return request({
    url: '/platform/Te/addTenant',
    method: 'post',
    data: data
  })
}
// 获取经销商列表
export function getAllAgency(query) {
  return request({
    url: '/platform/Agency/findAllAgency',
    method: 'get',
    params: query
  })
}