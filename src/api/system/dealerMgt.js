import request from '@/utils/request'

// 添加经销商
export function addAgency(data) {
  return request({
    url: '/platform/Agency/addAgency',
    method: 'post',
    data: data
  })
}
// 编辑经销商
export function editsAgency(data) {
  return request({
    url: '/Agency/editsAgency',
    method: 'post',
    data: data
  })
}
// 获取经销商列表
export function getAllAgency() {
  return request({
    url: '/platform/Agency/findAllAgency',
    method: 'get',
  })
}
// 根据ID删除经销商
export function deleteAgency(dataSource) {
  return request({
    url: '/platform/Agency/deleteAgency/' + dataSource,
    method: 'get'
  })
}
// 分页
export function pageAgency(query) {
  return request({
    url: '/platform/Agency/pageAgency/',
    method: 'get',
    params: query
  })
}
