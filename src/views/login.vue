<template>
  <div class="login">
    <div class="login_style">
      <el-row class="mb60">
        <el-col :span="8" :offset="8">
          <h1>欢迎来到我的登录界面</h1>
        </el-col>
      </el-row>
      <el-row style="z-index:1000;">
        <el-col :span="8" :offset="8">
          <div class="grid-content bg-purple-light">
            <el-form :model="form" ref="form" hide-required-asterisk show-message>
              <el-form-item label="账户">
                <el-input
                  v-model="form.name"
                  required
                  placeholder="请输入账户"
                  clearable
                  style="width:350px"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input
                  v-model="form.password"
                  required
                  placeholder="请输入密码"
                  show-password
                  clearable
                  style="width:350px"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :loading="loading"
                  class="ml48"
                  style="width:350px;"
                  @click="login"
                >登录</el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :loading="loading"
                  class="ml48"
                  style="width:350px;"
                  @click="login2"
                >切换</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <ul class="bg-bubbles">
        <li v-for="(item, index) in bubbles" :key="index"></li>
      </ul>
      <ul class="spot">
        <li v-for="(item, index) in arr" :key="index"></li>
      </ul>
    </div>
  </div>
</template>
<script>
// import { postAction } from "@/api/index";
// import axios from 'axios';
import { mapState } from 'vuex';
export default {
  name: "Login",
  data() {
    return {
      form: {
        name: "",
        password: ""
      },
      loading: false,
      bubbles: [],
      arr: []
    };
  },
  methods: {
    login() {
      this.$store.dispatch('login', this.form).then(res => {
        console.log(res);
        this.$router.push('/dashboard');
      });
    },
    login2() {
      console.log(this.user);
    }
  },
  created() {
    this.bubbles.length = 10;
    this.arr.length = 10;
  },
  computed: {
    ...mapState({
      user: state => state.Login.user
    })
  }
};
</script>
<style lang="less">
.login {
  background: #fff url("../assets/1.jpg") no-repeat 0 0;
  background-size: cover;
  /* background-size: 100vw 100vh; */
  height: 100vh;
}
.login_style {
  width: 100%;
  height: 400px;
  position: absolute;
  top: calc(50vh - 200px);
}
.spot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  li {
    position: absolute;
    bottom: 10px;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: transparent;
    list-style: none;
    box-shadow: 1px 0 1px 1px #fff inset;
    animation: myfirst 30s infinite;
    transition-timing-function: linear;
    animation-direction: alternate;
    &:nth-child(1) {
      left: 10%;
    }
    &:nth-child(2) {
      left: 20%;
      width: 10px;
      height: 10px;
      animation-delay: 2s;
      animation-duration: 7s;
    }
    &:nth-child(3) {
      left: 25%;
      animation-delay: 4s;
    }
    &:nth-child(4) {
      left: 40%;
      width: 10px;
      height: 10px;
      animation-duration: 8s;
      background-color: rgba(255, 255, 255, 0.3);
    }
    &:nth-child(5) {
      left: 70%;
    }
    &:nth-child(6) {
      left: 80%;
      width: 10px;
      height: 10px;
      animation-delay: 3s;
      background-color: rgba(255, 255, 255, 0.2);
    }
    &:nth-child(7) {
      left: 32%;
      width: 10px;
      height: 10px;
      animation-delay: 2s;
    }
    &:nth-child(8) {
      left: 55%;
      width: 20px;
      height: 20px;
      animation-delay: 4s;
      animation-duration: 15s;
    }
    &:nth-child(9) {
      left: 25%;
      width: 10px;
      height: 10px;
      animation-delay: 2s;
      animation-duration: 12s;
      background-color: rgba(255, 255, 255, 0.3);
    }
    &:nth-child(10) {
      left: 85%;
      width: 10px;
      height: 10px;
      animation-delay: 5s;
    }
  }
  @keyframes myfirst {
    0% {
      left: 10%;
      top: 10%;
      transform: translateY(0px) rotate(45deg);
    }
    25% {
      left: 20%;
      top: 25%;
      transform: translateY(-400px) rotate(90deg);
    }
    50% {
      left: 40%;
      top: 45%;
      transform: translateY(-600px) rotate(135deg);
    }
    100% {
      left: 70%;
      top: 60%;
      transform: translateY(-1000px) rotate(180deg);
    }
  }
}
.bg-bubbles {
  position: absolute;
  /* // 使气泡背景充满整个屏幕 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  li {
    position: absolute;
    // bottom 的设置是为了营造出气泡从页面底部冒出的效果；
    bottom: -160px;
    // 默认的气泡大小；
    width: 10px;
    height: 10px;
    border-radius: 50%;
    // background-color: rgba(255, 255, 255, 0.15);
    background-color: transparent;
    box-shadow: 1px 0 1px 1px #fff inset;
    list-style: none;
    // 使用自定义动画使气泡渐现、上升和翻滚；
    animation: square 15s infinite;
    transition-timing-function: linear;
    // 分别设置每个气泡不同的位置、大小、透明度和速度，以显得有层次感；
    &:nth-child(1) {
      left: 10%;
    }
    &:nth-child(2) {
      left: 20%;
      width: 10px;
      height: 10px;
      animation-delay: 2s;
      animation-duration: 7s;
    }
    &:nth-child(3) {
      left: 25%;
      animation-delay: 4s;
    }
    &:nth-child(4) {
      left: 40%;
      width: 10px;
      height: 10px;
      animation-duration: 8s;
      background-color: rgba(255, 255, 255, 0.3);
    }
    &:nth-child(5) {
      left: 70%;
    }
    &:nth-child(6) {
      left: 80%;
      width: 10px;
      height: 10px;
      animation-delay: 3s;
      background-color: rgba(255, 255, 255, 0.2);
    }
    &:nth-child(7) {
      left: 32%;
      width: 10px;
      height: 10px;
      animation-delay: 2s;
    }
    &:nth-child(8) {
      left: 55%;
      width: 20px;
      height: 20px;
      animation-delay: 4s;
      animation-duration: 15s;
    }
    &:nth-child(9) {
      left: 25%;
      width: 10px;
      height: 10px;
      animation-delay: 2s;
      animation-duration: 12s;
      background-color: rgba(255, 255, 255, 0.3);
    }
    &:nth-child(10) {
      left: 85%;
      width: 10px;
      height: 10px;
      animation-delay: 5s;
    }
  }
  // 自定义 square 动画；
  @keyframes square {
    0% {
      opacity: 0.5;
      transform: translateY(0px) rotate(45deg);
    }
    25% {
      opacity: 0.75;
      transform: translateY(-400px) rotate(90deg);
    }
    50% {
      opacity: 1;
      transform: translateY(-600px) rotate(135deg);
    }
    100% {
      opacity: 0;
      transform: translateY(-1000px) rotate(180deg);
    }
  }
}
</style>