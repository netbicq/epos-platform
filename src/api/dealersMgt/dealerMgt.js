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
    url: '/platform/Agency/editsAgency',
    method: 'post',
    data: data
  })
}
// 根据ID删除经销商
export function deleteAgency(dataSource) {
  return request({
    url: '/platform/Agency/deleteAgency/' + dataSource,
    method: 'get'
  })
}
// 根据ID查询门店数量
export function queryMargin(dataSource) {
  return request({
    url: '/platform/Agency/queryMargin?id=' + dataSource,
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
// 重置密码
export function resetPassword(query) {
  return request({
    url: '/platform/Agency/resetPassword',
    method: 'get',
    params: query
  })
}
