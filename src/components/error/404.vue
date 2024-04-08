<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-13 16:27:49
 * @FilePath: \aster-admin\src\components\error\404.vue
 * @Description: 404
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="not-container">
    <img src="@/assets/images/404.png" class="not-img" alt="404" />
    <div class="not-detail">
      <h2>404</h2>
      <h4>抱歉，您访问的页面不存在~🤷‍♂️🤷‍♀️</h4>
      <el-button type="primary" @click="router.back"> 返回上一页 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="404">
  import { useRouter } from 'vue-router';
  const router = useRouter();
</script>

<style scoped lang="scss">
  @import './index.scss';
</style>
