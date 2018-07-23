// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
import plugin from '@/plugins'

import cookie from 'cookies-js'
import YDUI from 'vue-ydui'
import 'vue-ydui/dist/ydui.rem.css'
// import 'vue-ydui/dist/ydui.base.css';
import './assets/scss/base.scss'
import './assets/scss/main.scss'
import './assets/js/flexible'
import './assets/font/iconfont.css'
import './router/interception'   //路由拦截器
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
//import 'vue-ydui/dist/ydui.px.css'; 

window.Cookies = cookie
Vue.config.productionTip = false

Vue.use(plugin, {})
Vue.use(YDUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
