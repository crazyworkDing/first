<template>
  <div class="d-menu">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      text-color="#DD3C1F"
      background-color="#5781c3"
      :router="true"
    >
      <el-submenu v-for="(item, index) in routerIndex" :key="index" :index="item.path" style="text-align: left;">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.name}}</span>
        </template>
        <el-menu-item-group v-for="(item2, inIndex) in item.children" :key="inIndex">
          <el-menu-item :index="item2.path">{{item2.name}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item v-for="(item, index) in routerIndex2" :key="index" :index="item.path" style="text-align: left;">
        <i class="el-icon-menu"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "DMenu",
  data() {
    return {
      routerIndex: [],
      routerIndex2: []
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getRouter() {
      this.routerIndex = this.$router.options.routes.filter(res => {
        return res.children;
      });
      this.routerIndex2 = this.$router.options.routes.filter(res => {
        if (!res.children) {
          return res.path != '/'
        }
        return !res.children;
      });
    }
  },
  mounted() {
    this.getRouter();
  }
};
</script>

<style scoped>
</style>