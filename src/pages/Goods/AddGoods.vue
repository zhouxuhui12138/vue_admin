<template>
  <div>
    <!-- 导航 -->
    <NavBar title1="商品管理" title2="添加商品" />

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警示框 -->
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center></el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="goods_name">
              <!-- 级联选择框 -->
              <el-cascader
                v-model="addFrom.goods_cat"
                :options="cartList"
                :props="cartProps"
                @change="cartCascaderChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, index) in item.attr_vals"
                  :key="index"
                  border
                  size="small"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品照片 -->
          <el-tab-pane label="商品照片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addFrom.goods_interoduce" />
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewIsShow" width="50%">
      <img :src="previewUrl" alt="" class="preview-img" />
    </el-dialog>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar"
import _ from "lodash"

export default {
  components: { NavBar },
  data() {
    return {
      // 控制step选中状态的变量
      activeIndex: "0",
      // 添加商品的表单数据对象
      addFrom: {
        goods_name: "",
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        // 级联选择器双向绑定数组
        goods_cat: [],
        // 上传图片数组
        pics: [],
        // 商品详情
        goods_interoduce: "",
        attrs: []
      },
      // 添加商品的验证规则
      addFromRules: {
        goods_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        goods_price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        goods_weight: [{ required: true, message: "请输入商品重量", trigger: "blur" }],
        goods_number: [{ required: true, message: "请输入商品数量", trigger: "blur" }]
      },
      // 商品分类列表
      cartList: [],
      // 级联选择框配置
      cartProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // upload请求地址
      uploadUrl: "http://timemeetyou.com:8889/api/private/v1/upload",
      // 给upload设置token
      headersObj: {
        Authorization: sessionStorage.getItem("token")
      },
      // 图片预览地址
      previewUrl: "",
      // 图片预览dialog是否显示
      previewIsShow: false
    }
  },
  created() {
    this.getCartList()
  },
  methods: {
    // 请求商品分类列表数据
    getCartList() {
      this.$http.get("categories").then(data => {
        const res = data.data
        if (res.meta.status !== 200) return
        this.cartList = res.data
      })
    },
    // 级联选择器发生变化触发
    cartCascaderChange() {
      if (this.addFrom.goods_cat.length !== 3) {
        this.addFrom.goods_cat = []
      }
    },
    // 切换tab触发
    beforeTabLeave(newTab, oldTab) {
      if (oldTab === "0" && this.addFrom.goods_cat.length !== 3) {
        this.$message.info("请选择分类")
        return false
      }
    },
    // tab发生点击触发
    tabClick() {
      if (this.activeIndex === "1") {
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "many" }
          })
          .then(data => {
            const res = data.data
            if (res.meta.status !== 200) return
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(",")
            })
            this.manyTableData = res.data
          })
      } else if (this.activeIndex === "2") {
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "only" }
          })
          .then(data => {
            const res = data.data
            if (res.meta.status !== 200) return
            this.onlyTableData = res.data
            console.log(this.onlyTableData)
          })
      }
    },
    // 预览图片处理函数
    handlePreview(file) {
      // console.log(file)
      this.previewUrl = file.response.data.url
      this.previewIsShow = true
    },
    // 移除图片处理函数
    handleRemove(file) {
      console.log(file)
      const filePath = file.response.data.tmp_path
      const i = this.addFrom.pics.findIndex(x => x.pic === filePath)
      this.addFrom.pics.splice(i, 1)
    },
    // 图片上传成功处理函数
    uploadSuccess(res) {
      const picInfo = {
        pic: res.data.tmp_path
      }
    },
    // 添加商品
    add() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必填项")
        }
        const form = _.cloneDeep(this.addFrom)
        form.goods_cat = form.goods_cat.join(",")

        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(" ")
          }
          this.addFrom.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }
          this.addFrom.attrs.push(newInfo)
        })
        form.attrs = this.addFrom.attrs
        console.log(form)

        const { data: res } = await this.$http.post("goods", form)
        console.log(res)
        if (res.meta.status !== 201) return
        this.$message.success("success")
        this.$router.push("/goods")
      })
    }
  },
  computed: {
    cateId() {
      return this.addFrom.goods_cat.length === 3 ? this.addFrom.goods_cat[2] : null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 20px;

  /deep/ .el-step__title {
    font-size: 14px;
  }
}

.el-form {
  margin-top: 20px;

  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  /deep/ .ql-editor {
    min-height: 300px;
  }

  .el-button {
    margin-top: 10px;
  }
}

.preview-img {
  width: 100%;
}
</style>
