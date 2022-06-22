import request from '@/utils/request'

// 新增数据源管理
export function addDataSource(data) {
  return request({
    url: '/platform/ds/add',
    method: 'post',
    data: data
  })
}
// 新增数据源策略
export function addStrategyData(data) {
  return request({
    url: '/platform/ds/adds',
    method: 'post',
    data: data
  })
}
// 编辑数据源
export function editDataSource(data) {
  return request({
    url: '/platform/ds/edit',
    method: 'post',
    data: data
  })
}
// 编辑数据源策略
export function editStrategyData(data) {
  return request({
    url: '/platform/ds/edits',
    method: 'post',
    data: data
  })
}
// 获取策略表数据
export function getStrategyData(query) {
  return request({
    url: '/platform/ds/pagelists',
    method: 'post',
    params: query
  })
}
// 获取数据源数据
export function getSourceData(query) {
  return request({
    url: '/platform/ds/pagelist',
    method: 'get',
    params: query
  })
}
// 根据ID删除数据源
export function deleteDataSource(dataSource) {
  return request({
    url: '/platform/ds/delete/{id}?id=' + dataSource,
    method: 'get'
  })
}
// 根据ID删除策略表数据
export function deleteStrategyData(dataSource) {
  return request({
    url: '/platform/ds/deletes/{id}?id=' + dataSource,
    method: 'get'
  })
}