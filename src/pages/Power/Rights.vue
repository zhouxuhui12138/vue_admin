<template>
  <div>
    <!-- 导航 -->
    <NavBar title1="权限管理" title2="权限列表" />

    <!-- content -->
    <el-card>
      <el-table :data="RightsList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar"
import { getRightsListApi } from '@/api/power.js'
export default {
  components: { NavBar },
  data() {
    return {
      // 权限列表
      RightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await getRightsListApi()
      this.RightsList = res.data
      console.log(res)
    }
  },
}
</script>

<style></style>
