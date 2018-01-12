// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

//引入路由文件
import router from './router'

//设置导航守卫，控制TabBar的显示隐藏
router.beforeEach((to, from, next) => {
  let path = to.path
  if(path === '/' || path === '/market' || path === '/cart' || path === '/my'){
    store.state.tabBarShow = true
  }else{
    store.state.tabBarShow = false
  }
  next()
})

//引入样式文件
import '@/styles/index.less'
//引入设置的rem值
import '@/styles/reset.js'
//引入mint-ui
import { Swipe, SwipeItem ,Lazyload , Indicator, MessageBox} from 'mint-ui';
//引入vuex
import store from './store'

//支持promise
import 'babel-polyfill'

//引入延迟300的插件
import fastclick from 'fastclick'
fastclick.attach(document.body)

//引入自己写的插件
import Toast from './components/Plugin/Toast';
Vue.use(Toast);

//使用
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.prototype.load = Indicator
Vue.prototype.$msg = MessageBox
Vue.use(Lazyload)

//引入http库
import axios from 'axios'
//添加到原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
