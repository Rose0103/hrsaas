import request from '@/utils/request'

/**
 *  获取员工的简单列表
 * **/
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 *  获取员工列表
 * **/
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

/**
 *  删除员工接口
 * **/
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/**
 *  新增员工接口
 * **/
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

/**
 *  批量导入员工
 * **/
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 *  保存员工基本信息
 * **/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/**
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/**
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.id}/personalInfo`,
    method: 'put',
    data
  })
}

/**
 *  获取员工岗位信息
 * **/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 *  保存员工岗位信息
 * **/
export function updateJob(data) {
  return request({
    url: `/employees/${data.id}/jobs`,
    method: 'put',
    data
  })
}
