import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import * as directives from '@/directives'
import * as filters from '@/filters'
import checkPermission from './mixin/checkPermission'
import '@/icons' // icon
import '@/permission' // permission control
// 注册全局组件
import Component from '@/components'

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(Component) // 注册自己的插件
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

// 注册自定义过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 全局混入检查对象
Vue.mixin(checkPermission)  // 表示所有的组件都拥有了检查的方法

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
