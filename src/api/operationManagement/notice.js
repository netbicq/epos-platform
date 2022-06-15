import request from '@/utils/request'

// 添加通知 
export function addNotice(data) {
  return request({
    url: '/platform/manager/addNotice',
    method: 'post',
    data: data
  })
}
// 编辑通知
export function editNotice(data) {
  return request({
    url: '/platform/manager/editNotice',
    method: 'post',
    data: data
  })
}
// 根据ID删除通知
export function deleteNotice(data) {
  return request({
    url: '/platform/manager/delete/'+data,
    method: 'post',
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
