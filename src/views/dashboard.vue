<template>
  <div class="dashboard">
    <el-container>
      <el-header height="100px" class="title">welcome to your website</el-header>
      <el-container>
        <el-aside width="250px">
          <d-menu></d-menu>
        </el-aside>
        <el-main>
          <router-view key="/about"></router-view>
        </el-main>
      </el-container>
      <el-footer class="title foot" height="200px">this is your footer</el-footer>
    </el-container>
  </div>
</template>

<script>
import DMenu from './modules/DMenu';
export default {
  name: "Dashboard",
  components: {
    DMenu
  }
};
</script>

<style scoped lang="less">
.dashboard {
  background: #fff url("../assets/4.jpg") no-repeat 0 0;
  background-size: cover;
  /* background-size: 100vw 100vh; */
  height: 100vh;
}
.el-aside {
  overflow-y: hidden;
}
.title {
  line-height: 100px;
  font-size: 20px;
  background-color: #a93434;
}
.foot {
  line-height: 200px;
}
</style>
