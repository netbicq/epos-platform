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
export function editTenant(data) {
  return request({
    url: '/platform/Te/editTenant',
    method: 'post',
    data: data
  })
}


// 根据ID获取经销商信息
export function findAgencyById(query) {
  return request({
    url: '/platform/Agency/findById/',
    method: 'get',
    params: query
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