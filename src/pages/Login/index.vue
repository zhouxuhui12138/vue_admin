<template>
  <div class="login">
    <div class="login-box">
      <!-- title -->
      <h1 class="title">电商后台管理系统</h1>
      <!-- form -->
      <el-form
        label-width="0"
        class="form"
        :rules="loginRule"
        ref="loginForm"
        :model="user"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-s-check"
            v-model="user.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="user.password"
            show-password
          ></el-input>
        </el-form-item>
        <!-- btns -->
        <el-form-item class="btns">
          <el-button type="primary" round @click="login">登录</el-button>
          <el-button round @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { loginApi } from '@/api/user.js'
export default {
  data() {
    return {
      user: {
        username: "admin",
        password: "123456"
      },
      // 登录表单验证
      loginRule: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 5, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetForm() {
      this.user.username = ""
      this.user.password = ""
    },
    // 登录
    login() {
      this.$refs.loginForm.validate(async valid => {
        if (!valid) return 
        const { data: res } = await loginApi(this.user)
        if (res.meta.status !== 200) {
          return this.$msg("error", "请输入正确的账号或者密码")
        }
        const token = res.data.token
        this.$store.commit('SET_TOKEN', token)
        this.$msg("success", "登录成功")
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #2b4b6b;
  justify-content: center;
  align-items: center;

  .login-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background-color: #fff;

    .title {
      margin-top: 30px;
      font-size: 24px;
      color: pink;
    }

    .form {
      margin-top: 50px;
      width: 80%;

      .btns {
        display: flex;
        justify-content: end;
      }
    }
  }
}
</style>
