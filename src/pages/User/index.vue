<template>
  <div class="user">
    <!-- 导航 -->
    <NavBar title1="用户管理" title2="用户列表" />

    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="40">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="userInfo.query" clearable @clear="getUserList">
            <el-button icon="el-icon-search" slot="append" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserIsShow = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <!-- table表格 -->
      <el-table :data="userList" border style="width: 100%">
        <!-- 索引 -->
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 姓名 -->
        <el-table-column prop="username" label="姓名"></el-table-column>
        <!-- 邮箱 -->
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <!-- 电话 -->
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <!-- 角色 -->
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态" width="110px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="switchChange(scope.row)"
            />
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column prop="" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              round
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUserisShow(scope.row.id)"
            />
            <el-button
              round
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scope.row.id)"
            />
            <el-button
              round
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="distributeUserShow(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :dataTotal="totle"
        :currentPage="userInfo.pagenum"
        :pageSize="userInfo.pagesize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </el-card>

    <!-- 弹出层 添加用户 -->
    <el-dialog
      title="添加用户"
      :before-close="addUserClose"
      :visible.sync="addUserIsShow"
    >
      <!-- 表单 -->
      <el-form
        :model="addFrom"
        label-width="70px"
        :rules="addRule"
        ref="addUser"
      >
        <el-form-item label="名称" prop="username">
          <el-input v-model="addFrom.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addFrom.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addFrom.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 关闭 -->
      <div class="dialog-footer">
        <el-button @click="addUserIsShow = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </div>
    </el-dialog>

    <!-- 弹出层 修改用户 -->
    <el-dialog
      title="修改用户"
      :before-close="editUserClose"
      :visible.sync="editUserIsShow"
    >
      <!-- 表单 -->
      <el-form
        :model="setFrom"
        label-width="70px"
        :rules="addRule"
        ref="editUser"
      >
        <el-form-item label="用户名">
          <el-input
            autocomplete="off"
            disabled
            v-model="setFrom.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input autocomplete="off" v-model="setFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input autocomplete="off" v-model="setFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 关闭 -->
      <div class="dialog-footer">
        <el-button @click="editUserIsShow = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确定</el-button>
      </div>
    </el-dialog>

    <!-- 弹出层 分配用户 -->
    <el-dialog
      title="分配用户"
      :before-close="distributeUserClose"
      :visible.sync="distributeUserIsShow"
    >
      <!-- content -->
      <div>
        <p>当前的用户: {{ distributeUser.username }}</p>
        <p>当前的角色: {{ distributeUser.role_name }}</p>
        <p class="select">
          分配新角色:
          <el-select v-model="selectRolesId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <!-- 关闭 -->
      <div class="dialog-footer">
        <el-button @click="distributeUserIsShow = false">取 消</el-button>
        <el-button type="primary" @click="setUser">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar"
import Pagination from "@/components/Pagination"
import {
  getUserListApi,
  addUserApi,
  delectUserApi,
  changeUserStateApi,
  getUserApi,
  editUserApi,
  getRolesListApi,
  setRoleApi
} from "@/api/user.js"
export default {
  components: { NavBar, Pagination },
  data() {
    // 验证手机号正则
    var checkTel = (rule, value, cb) => {
      const regEmail = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error("手机号错误"))
    }
    return {
      // 请求参数
      userInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      // 用户列表
      userList: [],
      // 总用户数量
      totle: null,
      // 添加用户dialog是否展示
      addUserIsShow: false,
      // 修改用户dialog是否展示
      editUserIsShow: false,
      // 分配用户是否显示
      distributeUserIsShow: false,
      // 添加用户
      addFrom: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户表单验证
      addRule: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkTel, trigger: "blur" }
        ]
      },
      // 修改用户
      setFrom: {},
      // 分配角色
      distributeUser: {},
      // 用户角色列表
      rolesList: [],
      // 下拉菜单双向绑定
      selectRolesId: ""
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 请求用户列表数据
    async getUserList() {
      const { data: res } = await getUserListApi(this.userInfo)
      if (res.meta.status !== 200) {
        return this.$msg("error", res.meta.msg)
      }
      this.userList = res.data.users
      this.totle = res.data.total
    },
    // 改变显示数量时触发
    handleSizeChange(pagesize) {
      this.userInfo.pagesize = pagesize
      this.getUserList()
    },
    // 页面发生改变时触发
    handleCurrentChange(pagenum) {
      this.userInfo.pagenum = pagenum
      this.getUserList()
    },
    // 添加用户关闭时
    addUserClose() {
      this.addUserIsShow = false
    },
    // 添加用户
    addUser() {
      this.$refs.addUser.validate(async valid => {
        if (!valid) return this.$msg("error", "请输入账号和密码")
        const { data: res } = await addUserApi(this.addFrom)
        if (res.meta.status !== 201) return this.$msg("error", res.meta.msg)
        this.$msg("success", "创建成功")
        this.addUserIsShow = false
        this.getUserList()
      })
    },
    // 删除用户
    async removeUser(id) {
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

      const { data: res } = await delectUserApi(id)
      if (res.meta.status === 400) {
        return this.$msg("info", "不允许删除管理员用户")
      } else if (res.meta.status === 200) {
        this.$msg("success", "删除成功")
        this.getUserList()
        this.handleCurrentChange(1)
      } else {
        return this.$msg("error", res.meta.msg)
      }
    },
    // 改变管理员状态
    async switchChange(user) {
      const { data: res } = await changeUserStateApi(user.id, user.mg_state)
      if (res.meta.status !== 200) return this.$msg("error", "修改失败")
      this.$msg("success", "修改成功")
    },
    // 弹出修改用户参数
    async editUserisShow(id) {
      this.editUserIsShow = true
      const { data: res } = await getUserApi(id)
      this.setFrom = res.data
    },
    // 修改用户
    editUser() {
      this.$refs.editUser.validate(async valid => {
        if (!valid) return this.$msg("error", "请检查输入表单")
        const { data: res } = await editUserApi(this.setFrom.id, this.setFrom)
        if (res.meta.status !== 200) return this.$msg("error", res.meta.msg)
        this.$msg("success", "修改成功")
        this.editUserIsShow = false
        this.getUserList()
      })
    },
    // 修改用户关闭
    editUserClose() {
      this.editUserIsShow = false
    },
    // 弹出分配用户参数
    async distributeUserShow(user) {
      this.distributeUserIsShow = true
      this.distributeUser = user
      const { data: res } = await getRolesListApi()
      if (res.meta.status !== 200) return this.$msg("error", res.meta.msg)
      this.rolesList = res.data
    },
    // 确定分配用户
    async setUser() {
      if (this.selectRolesId === "") return this.$msg("error", "请选择角色")
      const { data: res } = await setRoleApi(this.distributeUser.id, {
        rid: this.selectRolesId
      })
      if (res.meta.status !== 200) return this.$msg("error", res.meta.msg)
      this.$msg("success", "修改成功")
      this.getUserList()
      this.distributeUserIsShow = false
      this.selectRolesId = ''
    },
    // 关闭分配用户
    distributeUserClose() {
      this.distributeUserIsShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.select {
  margin: 20px 0;
}
</style>
