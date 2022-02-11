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
export function getEmployeeSimpleList(params) {
  return request({
    url: '/sys/user',
    params
  })
}
