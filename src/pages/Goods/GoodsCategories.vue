<template>
  <div>
    <!-- 面包屑导航 -->
    <NavBar title1="商品管理" title2="商品分类" />

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cartList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        class="table"
        border
        show-index
        index-text="#"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-show="scope.row.cat_deleted === false" style="color: hotpink"></i>
          <i class="el-icon-error" v-show="scope.row.cat_deleted === true" style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-show="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-show="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-show="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="edit" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="setCartShow(scope.row.cat_id)">
            编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCart(scope.row.cat_id)">
            删除
          </el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
      ></el-pagination>
    </el-card>

    <!-- 添加分类dialog -->
    <el-dialog title="添加分类" :visible.sync="addCateIsShow" width="50%" @close="addCartFromClose">
      <!-- 主体 -->
      <el-form :model="addCartFrom" :rules="addCartFromRules" ref="addCartFromRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCartFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectKeys"
            :options="parentCartList"
            @change="parentCartChange"
            :props="cascaderProps"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 尾部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateIsShow = false">取 消</el-button>
        <el-button type="primary" @click="addCart">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类dialog -->
    <el-dialog title="修改分类" :visible.sync="setCateIsShow" width="50%">
      <el-form ref="setFormRef" :model="setCartFrom" label-width="100px" :rules="addCartFromRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="setCartFrom.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setCateIsShow = false">取 消</el-button>
        <el-button type="primary" @click="setCart">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar"
import TreeTable from 'vue-table-with-tree-grid'

export default {
  components: {
    NavBar,
    TreeTable
  },
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 2
      },
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "sort"
        },
        {
          label: "操作",
          type: "template",
          template: "edit"
        }
      ],
      // 添加分类验证规则
      addCartFromRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ]
      },
      // 添加分类表单数据对象
      addCartFrom: {
        cat_name: "", // 分类名字
        cat_pid: 0, // 分类id
        cat_level: 0 // 分类等级
      },
      // 修改分类表单数据对象
      setCartFrom: {
        cat_name: ""
      },
      // 为级联选择器配置props
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
        expandTrigger: "hover"
      },
      cartList: [], // 存储商品分类数据
      totle: 0, // 总数据条数
      addCateIsShow: false, // 添加分类显示与隐藏
      setCateIsShow: false, // 修改分类显示与隐藏
      parentCartList: [], // 父级分类数据
      selectKeys: [] // 父级分类选择的id
    }
  },
  created() {
    this.getCartList()
  },
  methods: {
    // 请求商品分类数据
    async getCartList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败")
      }
      // console.log(res);
      this.cartList = res.data.result
      this.totle = res.data.total
      // console.log(this.totle);
      // console.log(this.cartList);
    },

    // pagesize发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCartList()
    },

    // pagenum发生改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCartList()
    },

    // 点击显示添加分类dialog
    addCateDialog() {
      this.getParentCartList()
      this.addCateIsShow = true
    },

    // 请求父级分类数据
    getParentCartList() {
      this.$http
        .get("categories", {
          params: { type: 2 }
        })
        .then(data => {
          // console.log(data);
          const res = data.data
          if (res.meta.status !== 200) {
            return this.$message.error("获取失败")
          } else {
            this.parentCartList = res.data
            // console.log(this.parentCartList);
          }
        })
    },

    // 父级分类发生改变触发
    parentCartChange() {
      // console.log(this.selectKeys);
      if (this.selectKeys.length > 0) {
        this.addCartFrom.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCartFrom.cat_level = this.selectKeys.length
        return
      } else {
        this.addCartFrom.cat_pid = 0
        this.addCartFrom.cat_level = 0
      }
    },

    // 确认添加用户
    addCart() {
      // console.log(this.addCartFrom);
      // 表单预验证
      this.$refs.addCartFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post("categories", this.addCartFrom)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败")
        } else {
          // this.$message.success('添加成功')
          this.getCartList()
          this.addCateIsShow = false
        }
      })
    },

    // 添加分类关闭时清空表单
    addCartFromClose() {
      this.$refs.addCartFromRef.resetFields()
      this.selectKeys = []
      this.addCartFrom.cat_pid = 0
      this.addCartFrom.cat_level = 0
    },

    // 点击显示修改用户dialog
    async setCartShow(id) {
      // 根据id请求数据
      const { data: res } = await this.$http.get("categories/" + id)
      if (res.meta.status !== 200) return
      this.setCartFrom = res.data
      // console.log(this.setCartFrom);
      this.setCateIsShow = true
    },

    // 确认修改分类
    setCart() {
      // 表单预验证
      this.$refs.setFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return this.$message.error("修改的内容有误")
        // 发起修改表单的数据请求
        const { data: res } = await this.$http.put("categories/" + this.setCartFrom.cat_id, {
          cat_name: this.setCartFrom.cat_name
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败")
        }
        this.setCateIsShow = false
        this.getCartList()
        this.$message.success("修改成功")
      })
    },

    // 删除分类
    async removeCart(id) {
      const confirm = await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err)
      if (confirm !== "confirm") {
        return this.$message.info("取消删除")
      }

      const { data: res } = await this.$http.delete("categories/" + id)
      if (res.meta.status === 400) {
        return this.$message.info("不允许删除管理员用户")
      } else if (res.meta.status === 200) {
        this.getCartList()
        return this.$message.success("删除成功")
      } else {
        return this.$message.error("删除失败")
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}

.table {
  margin-top: 20px;
}
</style>
