// 权限拦截在路由跳转   导航守卫

import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启进度条
  // 如果有token
  if (store.getters.token) {
    // 如果要访问的是 登录页
    if (to.path === '/login') {
      // 跳转到主页
      next('/')
    } else {
      next()
    }
  } else {
    // 没有token的情况下
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

// 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})
