import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../views/login.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // name: 'dashboard2',
    // component: () => import('../views/dashboard.vue')
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/dashboard.vue'),
    redirect: '/about',
    children: [
      {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
