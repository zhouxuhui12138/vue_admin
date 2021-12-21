<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/welcome' }" @click.native="toHome">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ title1 }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ title2 }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { EventBus  } from '@/utils/bus.js'
export default {
  props: {
    title1: {
      type: String,
      default: ''
    },
    title2: {
      type: String,
      default: ''
    },
  },
  methods: {
    // 事件总线发送
    toHome() {
      EventBus.$emit('toHome')
    }
  }
}
</script>

<style></style>
