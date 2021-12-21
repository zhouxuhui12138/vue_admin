<template>
  <div>
    <!-- 面包屑导航 -->
    <NavBar title1="订单管理" title2="订单列表" />

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <!-- 栅格系统 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 渲染表格 -->
      <el-table :data="ordersList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="primary" v-show="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-show="scope.row.pay_status === '0'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | showdata }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showAddress"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgress"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 修改地址dialog -->
    <el-dialog title="修改地址" :visible.sync="addressIsShow" width="50%" @close="addressFromClose">
      <!-- 表单 -->
      <el-form ref="addressRef" :model="address" label-width="100px">
        <el-form-item label="省市区/县">
          <el-cascader v-model="address.addressKyes" :options="cityData"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="address.address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 尾部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressIsShow = false">取 消</el-button>
        <el-button type="primary" @click="addressIsShow = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 显示物流dialog -->
    <el-dialog title="物流信息" :visible.sync="progressIsShow" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.ftime"
          color="green"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar"
import cityData from "./citydata"
import { formatDate } from "@/utils"
export default {
  components: {
    NavBar
  },
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 订单列表数据
      ordersList: [],
      // 是否显示修改地址对话框
      addressIsShow: false,
      // 修改地址表单双向绑定对象
      address: {
        // 级联选择器id
        addressKyes: [],
        // 详细地址
        address: ""
      },
      // 城市数据
      cityData: cityData,
      // 是否显示物流对话框
      progressIsShow: false,
      // 写死的物流地址 服务器崩了
      progressInfo: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: ""
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context: "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: ""
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: ""
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context: "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: ""
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: ""
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: ""
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: ""
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: ""
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: ""
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: ""
        }
      ]
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 请求订单列表数据
    getOrderList() {
      this.$http.get("orders", { params: this.queryInfo }).then(data => {
        const res = data.data
        if (res.meta.status !== 200) {
          return this.$message.error("error")
        }
        this.ordersList = res.data.goods
        this.total = res.data.total
        // console.log(this.ordersList)
        // console.log(this.total)
      })
    },
    // 每页显示数量发送改变触发事件
    handleSizeChange(newSize) {
      // 把新的值赋值给pagesize 然后重新请求数据
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 页面发生改变时触发事件
    handleCurrentChange(newPage) {
      // 把新的值赋值给pagenum 然后重新请求数据
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 显示修改地址对话框
    showAddress() {
      this.addressIsShow = true
    },
    // 关闭表单时触发
    addressFromClose() {
      this.address.addressKyes = []
      this.address.address = ""
    },
    // 打开显示物流进度dialog
    showProgress() {
      this.progressIsShow = true
      console.log(this.progressInfo)
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

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
