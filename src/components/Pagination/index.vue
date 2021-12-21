<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[2, 5, 10, 20]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="dataTotal"
  />
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number
    },
    pageSize: {
      type: Number
    },
    dataTotal: {
      type: Number,
      default: 0
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>

<style></style>
