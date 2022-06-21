import request from '@/utils/request'
// 编辑文档
export function editDocument(data) {
  return request({
    url: '/platform/User/editDocument',
    method: 'post',
    data: data
  })
}
// 获取文档
export function pageDocument(query) {
  return request({
    url: '/platform/User/pageDocument',
    method: 'post',
    params: query
  })
}