<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-30 10:34:18
 * @FilePath: \aster-flowable-vue\src\views\workflow\auth\index.vue
 * @Description: 流程权限
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="main-box">
    <!-- 角色选择 -->
    <role ref="roleRef" @change="handleChangeRole" />
    <!-- 权限配置 -->
    <permission :role-info="roleInfo" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import role from './role.vue';
  import Permission from './permission.vue';

  // 已选中的角色
  const roleInfo = ref<WorkAuth.RoleInfo>({
    id: '',
    name: '',
  });

  /**
   * @description: 角色选择
   */
  const handleChangeRole = (role: WorkAuth.RoleInfo) => {
    roleInfo.value = role;
  };
</script>
<style scoped lang="scss"></style>
