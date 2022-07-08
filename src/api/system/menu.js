import request from '@/utils/request'
// 新增菜单
export function addMenu(data) {
  return request({
    url: '/platform/menu/addMenu',
    method: 'post',
    data: data
  })
}
// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/platform/menu/delMenuById/' + menuId,
    method: 'get'
  })
}
// 排序菜单
export function getMenuById(id,num) {
  return request({
    url: '/platform/menu/getMenuById/'+ id+'/'+num,
    method: 'get',
  })
}
// 获取菜单列表
export function getMenuList(data) {
  return request({
    url: '/platform/menu/getMenuList',
    method: 'post',
    data: data
  })
}
// 编辑菜单
export function editMenu(data) {
  return request({
    url: '/platform/menu/editMenu',
    method: 'post',
    data: data
  })
}





// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}



// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: data
  })
}

