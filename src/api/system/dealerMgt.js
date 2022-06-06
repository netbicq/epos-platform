import request from '@/utils/request'

// 添加经销商
export function addAgency(data) {
  return request({
    url: '/platform/Agency/addAgency',
    method: 'post',
    data: data
  })
}
// 获取策略表数据
export function getStrategyData() {
  return request({
    url: '/platform/ds/lists',
    method: 'get',
  })
}
