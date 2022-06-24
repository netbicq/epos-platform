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




// 分页获取词典
export function pageDictType(data) {
  return request({
    url: '/platform/User/pageDictType',
    method: 'post',
    data: data
  })
}
