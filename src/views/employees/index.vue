<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <template v-slot:before>
          <span>
            共{{ pager.total }}条记录
          </span>
        </template>
        <template v-slot:after>
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column type="index" width="80" align="center" label="序号" sortable="" />
          <el-table-column prop="username" align="center" label="姓名" sortable="" />
          <el-table-column prop="workNumber" align="center" label="工号" sortable="" />
          <el-table-column prop="formOfEmployment" align="center" label="聘用形式" sortable="" :formatter="formatEmployment" />
          <el-table-column prop="departmentName" align="center" label="部门" sortable="" />
          <!-- 作用域插槽来做 +过滤器 -->
          <el-table-column prop="timeOfEntry" align="center" label="入职时间" sortable="">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" align="center" label="账户状态" sortable="">
            <template v-slot=" { row} ">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页组件 -->
          <el-pagination background :total="pager.total" :page-size="pager.size" :current-page="pager.page" layout="prev,pager,next" @current-change="changePage" />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeSimpleList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
export default {
  data() {
    return {
      list: [],
      pager: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false
    }
  },
  created() {
    this.getEmployeeSimpleList()
  },
  methods: {
    async getEmployeeSimpleList() {
      this.loading = true
      const { total, rows } = await getEmployeeSimpleList(this.pager)
      this.list = rows
      this.pager.total = total
      this.loading = false
    },
    changePage(val) {
      this.pager.page = val
      this.getEmployeeSimpleList()
    },
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    }
  }
}
</script>

<style>

</style>
