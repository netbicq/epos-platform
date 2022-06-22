import request from '@/utils/request'

// 添加门店账号购买
export function addAccount(data) {
  return request({
    url: '/platform/Te/addAccount',
    method: 'post',
    data: data
  })
}
// 编辑门店账号
export function editOrder(data) {
  return request({
    url: '/platform/Te/editOrder',
    method: 'post',
    data: data
  })
}


// 获取所有经销商信息
export function getAgencySelector(query) {
  return request({
    url: '/platform/Agency/getAgencySelector',
    method: 'get',
    params: query
  })
}
// 审核
export function checkAgencyOrder(query) {
  return request({
    url: '/platform/Te/audit?agencyOrderId='+query,
    method: 'get',
  })
}
// 删除门店
export function deleteAccount(query) {
  return request({
    url: '/platform/Te/deleteAccount/'+query,
    method: 'get',
  })
}
// 获取列表
export function getAccount(data) {
  return request({
    url: '/platform/Te/getAccount',
    method: 'post',
    data: data
  })
}