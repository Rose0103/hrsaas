<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 头部 -->
      <el-card class="tree-card">
        <TreeTools :tree-node="company" :is-root=" true " @addDepts="addDepts" />
        <!-- 树形菜单 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <TreeTools slot-scope="{ data }" :tree-node="data" @addDepts="addDepts" @delDepts="getDepartments" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <AddDept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'label'
      },
      showDialog: false, // 显示窗体
      node: null,
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转换成树形结构
      this.loading = false
    },
    // 新增部门节点
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    // 编辑部门节点
    editDepts(node) {
      // 首先打开弹层
      this.showDialog = true
      this.node = node // 赋值操作的节点
      // 我们需要在这个位置 调用子组件的方法
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
