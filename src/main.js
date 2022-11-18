import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载vant 核心组件库
import Vant from 'vant'

// 加载vant全局样式
import 'vant/lib/index.css'

// 注册全局样式
import './styles/index.less'

// 加载动态设置 REM 基准值
import 'amfe-flexible'

//
import './utils/dayjs'
// 注册使用vant组件库
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
