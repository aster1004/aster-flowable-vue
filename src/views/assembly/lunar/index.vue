<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-01 15:38:56
 * @FilePath: \aster-flowable-vue\src\views\assembly\lunar\index.vue
 * @Description: 阴阳历
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="calendar">
    <perpetual-calendar />
  </div>
</template>
<script setup lang="ts">
  import perpetualCalendar from '@/components/lunar/perpetualCalendar.vue';
</script>
<style scoped lang="scss">
  page {
    padding: 0 20rpx;
  }

  .calendar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    text-align: center;
  }
</style>
