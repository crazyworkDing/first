import axios from "axios";
import Vue from 'vue';
// import store from '@/store'
const instance = axios.create({
  baseURL: '/rrms',
  timeout: '2000'
})
const err = (err) => {
  return Promise.reject(err)
}
instance.interceptors.request.use(config => {
  const token = Vue.ls.get('Token');
  if (token) {
    config.headers['X-Access-Token'] = token;
  }
  // config.headers['X-Access-Token'] = store.Login.user.token;
  return config;
})
instance.interceptors.response.use((response) => {
  // Vue.ls.set('Response', response);
  return response;
}, err)
export {
  instance as axios
}