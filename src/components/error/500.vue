<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-13 16:27:49
 * @FilePath: \aster-flowable-vue\src\components\error\500.vue
 * @Description: 500
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="not-container">
    <img src="@/assets/images/500.png" class="not-img" alt="500" />
    <div class="not-detail">
      <h2>500</h2>
      <h4>抱歉，您的网络不见了~🤦‍♂️🤦‍♀️</h4>
      <el-button type="primary" @click="router.back"> 返回上一页 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="500">
  import { useRouter } from 'vue-router';
  const router = useRouter();
</script>

<style scoped lang="scss">
  @import './index.scss';
</style>
