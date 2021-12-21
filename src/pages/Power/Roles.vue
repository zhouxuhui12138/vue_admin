<template>
  <div>
    <!-- 导航 -->
    <NavBar title1="权限管理" title2="角色列表" />

    <!-- card -->
    <el-card>
      <!-- 添加用户 -->
      <div>
        <el-button type="primary" @click="addRoleIsShow = true">
          添加用户
        </el-button>
      </div>

      <!-- table表格 -->
      <el-table :data="rolesList" class="mt20" border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="[
                'border-bottom',
                'center',
                index1 === 0 ? 'border-top' : ''
              ]"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRights(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="['center', index2 === 0 ? '' : 'border-top']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRights(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRights(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <!-- 操作 -->
        <el-table-column prop="" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleShow(scope.row)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delectRole(scope.row)"
            />
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRoleShow(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹出层 添加用户 -->
    <el-dialog
      title="添加用户"
      :before-close="addRoleClose"
      :visible.sync="addRoleIsShow"
    >
      <!-- 表单 -->
      <el-form
        :model="addFrom"
        label-width="100px"
        :rules="addRule"
        ref="addRoleRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addFrom.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addFrom.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 关闭 -->
      <div class="dialog-footer">
        <el-button @click="addRoleIsShow = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确定</el-button>
      </div>
    </el-dialog>

    <!-- 弹出层 分配权限 -->
    <el-dialog
      title="分配权限"
      :before-close="setRoleClose"
      :visible.sync="setRoleIsShow"
    >
      <!-- tree组件 -->
      <el-tree
        :data="rightsList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultKeys"
        ref="setRights"
      />
      <!-- 关闭 -->
      <div class="dialog-footer mt20">
        <el-button @click="setRoleIsShow = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确定</el-button>
      </div>
    </el-dialog>

    <!-- 弹出层 修改用户 -->
    <el-dialog
      title="修改用户"
      :before-close="editRoleClose"
      :visible.sync="editRoleIsShow"
    >
      <!-- 表单 -->
      <el-form
        :model="editFrom"
        label-width="100px"
        :rules="addRule"
        ref="editRoleRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editFrom.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editFrom.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 关闭 -->
      <div class="dialog-footer">
        <el-button @click="editRoleIsShow = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar"
import {
  getRolesListApi,
  addRoleApi,
  deleteRoleApi,
  editRoleApi,
  getRoleApi,
  delectRoleRightsApi,
  getRightListApi,
  setRightsApi
} from "@/api/power.js"
export default {
  components: { NavBar },
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 权限列表
      rightsList: [],
      // 控制添加角色显示隐藏
      addRoleIsShow: false,
      // 控制修改角色显示隐藏
      editRoleIsShow: false,
      // 控制分配权限显示隐藏
      setRoleIsShow: false,
      // 添加角色表单
      addFrom: {
        roleName: "",
        roleDesc: ""
      },
      // 修改角色表单
      editFrom: {},
      // 添加用户表单验证
      addRule: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      },
      // 树形控件配置
      defaultProps: {
        children: "children",
        label: "authName"
      },
      // 默认被选中的权限数组
      defaultKeys: [],
      // 被分配角色的id
      roleId: ""
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await getRolesListApi()
      this.rolesList = res.data
    },
    // 添加用户弹出窗关闭
    addRoleClose() {
      this.addRoleIsShow = false
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return this.$msg("error", "请检查表单")
        const { data: res } = await addRoleApi(this.addFrom)
        if (res.meta.status !== 201) return this.$msg("error", res.meta.msg)
        this.$msg("success", "创建成功")
        this.addRoleIsShow = false
        this.getRolesList()
        this.addFrom.roleName = ""
        this.addFrom.roleDesc = ""
      })
    },
    // 删除角色
    async delectRole(user) {
      const confirm = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err)
      if (confirm !== "confirm") return this.$msg("info", "取消删除")

      const { data: res } = await deleteRoleApi(user.id)
      if (res.meta.status === 400) {
        return this.$msg("info", "不允许删除管理员用户")
      } else if (res.meta.status === 200) {
        this.$msg("success", "删除成功")
        this.getRolesList()
      } else {
        return this.$msg("error", res.meta.msg)
      }
    },
    // 显示修改用户
    async editRoleShow(user) {
      this.editRoleIsShow = true
      const { data: res } = await getRoleApi(user.id)
      this.editFrom = res.data
    },
    // 修改用户弹出窗关闭
    editRoleClose() {
      this.editRoleIsShow = false
    },
    // 修改用户
    editRole() {
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return this.$msg("error", "请检查表单")
        const { data: res } = await editRoleApi(
          this.editFrom.roleId,
          this.editFrom
        )
        if (res.meta.status !== 200) return this.$msg("error", res.meta.msg)
        this.$msg("success", "修改成功")
        this.editRoleIsShow = false
        this.getRolesList()
      })
    },
    // 分配权限弹出窗关闭
    setRoleClose() {
      this.setRoleIsShow = false
    },
    // 显示分配权限
    async setRoleShow(role) {
      this.roleId = role.id
      this.defaultKeys = []
      const { data: res } = await getRightListApi()
      this.rightsList = res.data
      this.getLeafKeys(role, this.defaultKeys)
      this.setRoleIsShow = true
    },
    // 分配权限
    async setRights() {
      // 获取被选中的节点的id
      const keys = [
        ...this.$refs.setRights.getCheckedKeys(),
        ...this.$refs.setRights.getHalfCheckedKeys()
      ]
      const rids = keys.join(",")
      const { data: res } = await setRightsApi(this.roleId, { rids })
      if (res.meta.status !== 200) return this.$msg("error", res.meta.msg)
      this.$msg("success", "修改成功")
      this.getRolesList()
      this.setRoleIsShow = false
    },
    // 删除用户权限
    async removeRights(role, rightsId) {
      const confirm = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err)
      if (confirm !== "confirm") return this.$msg("info", "取消删除")
      const { data: res } = await delectRoleRightsApi(role.id, rightsId)
      this.$msg("success", "删除成功")
      role.children = res.data
    },
    // 递归获取所有三级节点的id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.border-bottom {
  border-bottom: 1px solid #eee;
}

.border-top {
  border-top: 1px solid #eee;
}

.center {
  display: flex;
  align-items: center;
}

.mt20 {
  margin-top: 20px;
}
</style>
