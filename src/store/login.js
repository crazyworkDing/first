import { Promise } from "core-js";
import { postAction } from '@/api/index'
import Vue from 'vue'
const login = {
  state: {
    user: {
      name: '',
      password: '',
      token: ''
    }
  },
  getters: {
    filterUser: (state) => {  //1 getters可以获取其他getters的值 ,可以为(state,getters)
      return state.user;
    },
    commFilter: (state) => (id) => {  //2 可以当做公共方法进行数据过滤，只需this.$store.getters.commFilter(2)
      return state.user.name == id;
    }
  },
  mutations: {    // commit方法调用此方法
    restUser(state) {
      state.user = {
        name: '',
        password: '',
        token: ''
      };
    },
    changeUser(state, n) {  //this.$store.commit('changeUser', 'me')
      state.user = Object.assign({}, n);
    },
    changeUser2(state, n) { //this.$store.commit({type: 'changeUser2', 'me'})  这种方式与上面效果一样
      state.user.name = n
    }
  },
  actions: {
    restUser(context, n) {   //触发通过dispatch方法 this.$store.dispatch('restUser', 'me')
      context.commit('changeUser', n);
    },
    changeUser({commit, state, getters}) {  // {...}对象接受类似store实例的方法和属性，所以可以接受之前的方法
      commit('changeUser', state.user.name);
      commit('changeUser2', getters.filterUser.name);
    },
    changeUser2({commit, dispatch, state, getters}) {
      commit('changeUser', state.user.name);
      commit('changeUser2', getters.filterUser.name);
      dispatch('changeUser')
    },
    login({commit, state}, params) {
      return new Promise((resolve, reject) => {
        postAction('api/login', params).then(res => {
          if (res.status == 200) {
            commit('changeUser', res.data);
            Vue.ls.set('Token', res.data.token);
            console.log(state.user);  //这里state里面的值只有通过commit才能改变
            console.log(res);
            resolve(res);
          } else {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        })
      })
    }
  }
}

export default login;