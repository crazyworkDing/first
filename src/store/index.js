import Vue from 'vue'
import Vuex from 'vuex'
import Login from './login'
Vue.use(Vuex)

export default new Vuex.Store({
  
  modules: {
    Login
  }
})


//mutations必须是同步的，必须获取到值的。。。而actions则是可以异步的
