<template>
  <div>
    <!-- 面包屑导航 -->
    <NavBar title1="商品管理" title2="分类参数" />


    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>

      <!-- 选择商品分类 -->
      <el-row>
        <el-col class="cart_top">
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="cartCascaderKeys"
            :options="cartList"
            :props="cartProps"
            @change="cartCascaderChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab栏切换区域 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="first">
          <!-- 添加参数 -->
          <el-button type="primary" size="mini" :disabled="btnIsDisable" @click="addDialogIsShow = true">
            添加参数
          </el-button>
          <!-- 动态参数 -->
          <el-table :data="manyTableData" border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染的tag -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="tagClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 文本输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="second">
          <!-- 添加属性 -->
          <el-button type="primary" size="mini" :disabled="btnIsDisable" @click="addDialogIsShow = true">
            添加属性
          </el-button>
          <!-- 静态属性 -->
          <el-table :data="onlyTableData" border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染的tag -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="tagClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 文本输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数dialog -->
    <el-dialog :title="addDialogTitle" :visible.sync="addDialogIsShow" width="50%" @close="addDialogClose">
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="120px">
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogIsShow = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数dialog -->
    <el-dialog title="修改" :visible.sync="editDialogIsShow" width="50%" @close="editDialogClose">
      <el-form :model="editFrom" :rules="addFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogIsShow = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar"

export default {
  components: {
    NavBar,
  },

  data() {
    return {
      // 商品分类列表
      cartList: [],
      // 级联选择框配置对象
      cartProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 级联选择框双向绑定数组
      cartCascaderKeys: [],
      // 默认选中的tab栏
      activeName: "first",
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 添加参数对话框是否隐藏
      addDialogIsShow: false,
      // 添加属性双向绑定对象
      addFrom: {
        attr_name: "",
      },
      // 添加属性验证规则
      addFromRules: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      // 修改对话框是否隐藏
      editDialogIsShow: false,
      // 修改对话框双向绑定对象
      editFrom: {
        attr_name: "",
      },
    }
  },

  created() {
    this.getCartList()
  },

  methods: {
    // 请求商品分类数据
    getCartList() {
      this.$http.get("categories").then(data => {
        const res = data.data
        if (res.meta.status !== 200) {
          return this.$message.error("获取失败")
        } else {
          this.cartList = res.data
        }
      })
    },
    // 级联选择框发生变动触发 请求数据
    async cartCascaderChange() {
      // 只能选中三级分类
      if (this.cartCascaderKeys.length !== 3) {
        this.cartCascaderKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      } else {
        const { data: res } = await this.$http.get(`categories/${this.cartId}/attributes`, {
          params: {
            sel: this.cartSel,
          },
        })
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : []
          item.inputVisible = false
          item.inputValue = ""
        })
        console.log(res.data)
        if (res.meta.status !== 200) {
          return this.$message.error("获取失败")
        } else {
          if (this.activeName == "first") {
            this.manyTableData = res.data
          } else {
            this.onlyTableData = res.data
          }
        }
      }
    },
    // 点击tab栏触发
    tabClick() {
      this.cartCascaderChange()
      console.log(this.activeName)
    },
    // 添加参数dialog关闭触发
    addDialogClose() {
      this.$refs.addFromRef.resetFields()
      this.addFrom.attr_name = ""
    },
    // 添加参数
    addParams() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cartId}/attributes`, {
          attr_name: this.addFrom.attr_name,
          attr_sel: this.cartSel,
        })
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败")
        }
        this.$message.success("添加成功")
        this.cartCascaderChange()
        this.addDialogIsShow = false
      })
    },
    // 修改对话框显示
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`categories/${this.cartId}/attributes/${id}`, {
        attr_sel: this.cartSel,
      })
      if (res.meta.status !== 200) {
        return this.$message.error("error")
      }
      this.editFrom = res.data
      this.editDialogIsShow = true
    },
    // 修改对话框关闭
    editDialogClose() {
      this.$refs.editFromRef.resetFields()
    },
    // 修改参数
    editParams() {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cartId}/attributes/${this.editFrom.attr_id}`, {
          attr_name: this.editFrom.attr_name,
          attr_sel: this.cartSel,
        })
        if (res.meta.status !== 200) {
          return this.$message.error("失败")
        }
        this.$message.success("成功")
        this.cartCascaderChange()
        this.editDialogIsShow = false
      })
    },
    // 删除参数
    async removeParams(id) {
      const confirm = await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch(err => err)
      if (confirm !== "confirm") {
        return this.$message.info("取消删除")
      }

      const { data: res } = await this.$http.delete(`categories/${this.cartId}/attributes/${id}`)
      if (res.meta.status === 400) {
        return this.$message.info("不允许删除管理员用户")
      } else if (res.meta.status === 200) {
        this.cartCascaderChange()
        return this.$message.success("删除成功")
      } else {
        return this.$message.error("删除失败")
      }
    },
    // 文本输入框失去焦点或者按下enter触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ""
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ""
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 将对attr_vals的操作同步到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cartId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(","),
      })
      if (res.meta.status !== 200) {
        return this.$message.error("error")
      }
      this.$message.success("success")
    },
    // 删除tag
    tagClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    // 显示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 自动获取焦点
      this.$nextTick(none => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
  },

  computed: {
    // 判断是否禁用按钮
    btnIsDisable() {
      return this.cartCascaderKeys.length !== 3 ? true : false
    },
    // 获取选中三级分类id
    cartId() {
      return this.cartCascaderKeys.length === 3 ? this.cartCascaderKeys[2] : null
    },
    // 获取sel
    cartSel() {
      return this.activeName == "first" ? "many" : "only"
    },
    // 动态获取dialog title
    addDialogTitle() {
      return this.activeName == "first" ? "动态参数" : "静态属性"
    },
  },
}
</script>

<style lang="less" scoped>
.cart_top {
  margin-top: 20px;
  font-size: 16px;
}

.el-table {
  margin-top: 20px;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>
