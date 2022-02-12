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
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
          <el-button size="small" type="danger" @click="exportData">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
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
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
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
    <AddEmployee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      list: [],
      pager: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false,
      type: this.$route.query.type
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.pager)
      this.list = rows
      this.pager.total = total
      this.loading = false
    },
    changePage(val) {
      this.pager.page = val
      this.getEmployeeList()
    },
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除按钮
    async delEmployee(id) {
      //  提示
      try {
        await this.$confirm('确认删除该员工吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 只有点击了确定 才能进入到下方
          await delEmployee(id) // 调用删除接口
          this.getEmployeeList() // 重新加载数据
          this.$message.success('删除员工成功')
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel
    exportData() {
      // 表头对应关系
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取全部数据
        const { rows } = await getEmployeeList({ page: 1, size: this.pager.total })
        // 全部数据格式化
        const data = this.formatJson(headers, rows)
        // excel是引入文件的导出对象
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表'
        })
      })
    },
    // 该方法负责将数组对象转化成二维数组
    // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
    formatJson(header, rows) {
      // 遍历数组
      return rows.map(item => {
        // item是一个对象 { username: '张三',mobile: 139003289,...}
        // header 是 ['姓名', '手机号',...]
        return Object.keys(header).map(key => {
          // 导出需要判断 字段格式
          if (header[key] === 'timeOfEntry' || header[key] === 'correctionTime') {
            return formatDate(item[header[key]]) // 返回格式化之前的时间
          } else if (header[key] === 'formOfEmployment') {
            const en = EmployeeEnum.hireType(obj => obj.id === item[header[key]])
            return en ? en.value : '未知'
          }
          return item[header[key]]
        })
        // ['张三', 139003289,...]
      })
    }
  }
}
</script>

<style>

</style>
