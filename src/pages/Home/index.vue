<template>
  <el-container class="home">
    <!-- header -->
    <el-header>
      <div>
        <img src="../../assets/logo.png" />
        <span>后台管理系统</span>
      </div>
      <el-button type="warning" round @click="loginOut">退出</el-button>
    </el-header>

    <!-- container -->
    <el-container>
      <!-- aside -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 控制是否收起aside -->
        <div class="toggle" @click="toggle">| | |</div>
        <el-menu
          background-color="#313743"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="(item, index) in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="(subItem, index) in item.children"
              :key="subItem.id"
              :index="'/' + subItem.path"
              @click="savePath('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- main -->
      <el-main
        class="el-main-let"
        :style="{ left: isCollapse ? '64px' : '200px' }"
      >
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuListApi } from "@/api/user.js"
import { EventBus } from "@/utils/bus.js"

export default {
  data() {
    return {
      // 控制侧边栏是否折叠
      isCollapse: false,
      // 侧边栏数据
      menuList: [],
      // 图标数据
      iconList: {
        125: "el-icon-s-check",
        103: "el-icon-folder-opened",
        101: "el-icon-shopping-bag-2",
        102: "el-icon-notebook-2",
        145: "el-icon-s-platform"
      },
      // 控制侧边栏高亮
      activePath: ""
    }
  },
  created() {
    this.getMenuList()
    this.activePath = localStorage.getItem("activePath")
  },
  methods: {
    // 获取侧边栏数据
    async getMenuList() {
      const { data: res } = await getMenuListApi()
      if (res.meta.status === 200) {
        this.menuList = res.data
      } else {
        this.$msg("error", res.meta.msg)
      }
    },
    // 保存上次点击的地址
    savePath(path) {
      localStorage.setItem("activePath", path)
      this.activePath = path
    },
    // 退出登录
    loginOut() {
      this.$store.commit("DELECT_TOKEN")
      this.$router.replace("/login")
    },
    // 收起或展开侧边栏
    toggle() {
      this.isCollapse = !this.isCollapse
    }
  },
  mounted() {
    // 事件总线接收 让侧边栏回到welcome时取消高亮
    EventBus.$on("toHome", () => {
      this.activePath = ""
    })
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100vh;

  .el-header {
    display: flex;
    background-color: #363d40;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div {
      display: flex;
      align-items: center;
      img {
        width: 10%;
        height: 10%;
      }
      span {
        padding: 0 0 0 20px;
      }
    }
  }

  .el-aside {
    background-color: #313743;
    transition: all 0.4s;
    .el-menu {
      border-right: 0;
    }
    .toggle {
      background-color: #4a5064;
      color: #fff;
      font-size: 10px;
      line-height: 24px;
      text-align: center;
      cursor: pointer;
      height: 24px;
    }
  }

  .el-main {
    background-color: #e9edf1;
  }

  .el-aside {
    display: block;
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
  }

  .el-main {
    position: absolute;
    right: 0;
    top: 60px;
    bottom: 0;
    overflow-y: scroll;
    left: 200px;
  }
}
</style>
