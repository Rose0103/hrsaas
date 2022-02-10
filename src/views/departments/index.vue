<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 头部 -->
      <el-card class="tree-card">
        <TreeTools :tree-node="company" :is-root=" true " @addDepts="addDepts" />
        <!-- 树形菜单 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true" @delDepts="getDepartments">
          <TreeTools slot-scope="{ data }" :tree-node="data" @addDepts="addDepts" />
        </el-tree>
      </el-card>
    </div>
    <AddDept :show-dialog="showDialog" />
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
      node: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转换成树形结构
      console.log(result)
    },
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
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
