<template>
  <div class="goods-list">
    <!-- 导航 -->
    <NavBar title1="商品管理" title2="商品列表" />

    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="40">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="userInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="add">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格 -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="95px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | showdata }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="130px">
          <template slot-scope="scope">
            <el-button round type="primary" icon="el-icon-edit" size="mini" />
            <el-button
              round
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoods(scope.row.goods_id)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :dataTotal="total"
        :currentPage="userInfo.pagenum"
        :pageSize="userInfo.pagesize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar"
import Pagination from "@/components/Pagination"
import { getGoodsListApi, removeGoodsApi } from "@/api/goods.js"
import { formatDate } from "@/utils"
export default {
  components: { NavBar, Pagination },
  data() {
    return {
      // 请求参数
      userInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      // 商品列表
      goodsList: [],
      // 商品数量
      total: null
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 请求商品列表
    async getGoodsList() {
      const { data: res } = await getGoodsListApi(this.userInfo)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 改变显示数量时触发
    handleSizeChange(pagesize) {
      this.userInfo.pagesize = pagesize
      this.getGoodsList()
    },
    // 页面发生改变时触发
    handleCurrentChange(pagenum) {
      this.userInfo.pagenum = pagenum
      this.getGoodsList()
    },
    // 删除商品
    async removeGoods(id) {
      const confirm = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err)
      if (confirm !== "confirm") return this.$message.info("取消删除")
      const { data: res } = await removeGoodsApi(id)
      if (res.meta.status !== 200) return this.$msg("error", "删除失败")
      this.$msg("success", "删除成功")
      this.getGoodsList()
    },
    // 添加商品
    add() {
      this.$router.push('/goods/add')
    }
  },
  filters: {
    // 将请求过来的时间戳转换为时间
    showdata(value) {
      //将时间戳转换成date对象
      const date = new Date(value * 1000)
      //将date进行格式化
      return formatDate(date, "yyyy/MM/dd hh:mm")
    }
  }
}
</script>

<style></style>
