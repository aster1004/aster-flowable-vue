<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-09-04 16:28:57
 * @FilePath: \aster-flowable-vue\src\views\workflow\auth\permission.vue
 * @Description: 权限设置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <system-perm v-if="permType === 'system'" :role-id="roleInfo.id" />
    <user-perm v-else :role-id="roleInfo.id" :role-type="permType" />
  </div>
</template>
<script setup lang="ts">
  import { isNotEmpty } from '@/utils';
  import { PropType, ref, watch } from 'vue';
  import SystemPerm from './system-perm.vue';
  import UserPerm from './user-perm.vue';

  const props = defineProps({
    roleInfo: {
      type: Object as PropType<WorkAuth.RoleInfo>,
      default: { id: '', name: '' },
    },
  });

  // 权限类型
  const permType = ref<string>('system');

  /**
   * @description: 监听角色信息变化
   */
  watch(
    () => props.roleInfo,
    (val) => {
      if (val && val.id && isNotEmpty(val.id)) {
        permType.value = val.type ? val.type : 'system';
      }
    },
    { immediate: true, deep: true },
  );
</script>
<style scoped lang="scss"></style>
