<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <el-row style="height: 60px">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog=true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="list" border="">
              <el-table-column align="center" type="index" width="80" label="序号" />
              <el-table-column align="center" prop="name" label="角色名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination background :total="pager.total" :page-size="pager.pagesize" :current-page="pager.page" layout="prev,pager,next" @current-change="changePage" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 右侧内容 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置分配权限的弹层 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 权限是一颗树 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        default-expand-all
        :show-checkbox="true"
        node-key="id"
        :check-strictly="true"
        :default-checked-keys="selectCheck"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [],
      pager: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      // 公司信息
      formData: {},
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      permData: [], // 专门用来接收权限数据 树形数据
      defaultProps: {
        label: 'name'
      },
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 用户角色列表
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pager)
      this.list = rows
      this.pager.total = total
    },
    // 获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除角色
    async deleteRole(id) {
      //  提示
      try {
        await this.$confirm('确认删除该角色吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 只有点击了确定 才能进入到下方
          await deleteRole(id) // 调用删除接口
          this.getRoleList() // 重新加载数据
          this.$message.success('删除角色成功')
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑角色
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑  没有id就是新增
        if (this.roleForm.id) {
          // 调用更新接口
          await updateRole(this.roleForm)
        } else {
          // 新增角色
          await addRole(this.roleForm)
        }

        // 重新拉取数据
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.roleForm = {}
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    changePage(page) {
      this.pager.page = page
      this.getRoleList()
    },
    // 分配权限按钮
    // 获取当前权限点数据
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      this.roleId = id
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    async btnPermOK() {
      await assignPerm({ id: this.roleId, permIds: this.$refs.permTree.getCheckedKeys() })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>

<style>

</style>
