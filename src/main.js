import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import Storage from 'vue-ls'
import './mock/index.js'
import 'element-ui/lib/theme-chalk/index.css';
import '@/style/index.css';
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  let token =  Vue.ls.get('Token');
  if (!token) {
    Vue.ls.set('Token', '1')
    next({path: '/login'})
  } else{
    next()
  }
  
})
router.afterEach(() => {})
const options = {
  namespace: 'vuejs__',
  name: 'ls',
  storage: 'local'
}
Vue.use(Storage, options)
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
