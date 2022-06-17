import request from '@/utils/request'

// 新增售价策略
export function addPricePolicy(data) {
  return request({
    url: '/platform/manager/addPricePolicy',
    method: 'post',
    data: data
  })
}
// 编辑售价策略
export function editPricePolicy(data) {
  return request({
    url: '/platform/manager/editPricePolicy',
    method: 'post',
    data: data
  })
}

// 删除售价策略获取经销商信息
export function deletePricePolicy(data) {
  return request({
    url: '/platform/manager/deletePricePolicy/',
    method: 'post',
    data: data
  })
}
// 获取售价策略
export function getPagePricePolicy(query) {
  return request({
    url: '/platform/manager/getPagePricePolicy',
    method: 'get',
    params: query
  })
}