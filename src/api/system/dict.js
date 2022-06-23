import request from '@/utils/request'

// 添加词典
export function addDict(data) {
  return request({
    url: '/platform/User/addDict',
    method: 'post',
    data: data
  })
}
// 根据ID删除词典
export function deleteDict(data) {
  return request({
    url: '/platform/User/deleteDict?dictId='+data,
    method: 'get',
  })
}
// 编辑词典
export function editDict(data) {
  return request({
    url: '/platform/User/editDict',
    method: 'post',
    data: data
  })
}




// 分页
export function getPageNotice(query) {
  return request({
    url: '/platform/manager/getPageNotice',
    method: 'get',
    params: query
  })
}
// 设置通知状态
export function setIsShow(query) {
  return request({
    url: '/platform/manager/setIsShow/{id}',
    method: 'get',
    params: query
  })
}
