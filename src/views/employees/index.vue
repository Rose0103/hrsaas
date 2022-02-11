<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <template v-slot:before>
          <span>
            挂耳费用该
          </span>
        </template>
        <template v-slot:after>
          <el-button>afa</el-button>
        </template>
      </PageTools>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  }
}
</script>

<style>

</style>
