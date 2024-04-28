<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-26 11:17:56
 * @FilePath: \aster-flowable-vue\src\views\workflow\form\form-design-render.vue
 * @Description: 加载组件
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <component
    :is="formItem.name"
    :ref="formItem.id + 'Ref'"
    v-model:value="formItem.value"
    :mode="mode"
    :formItem="formItem"
  />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import renderExport from '../components/render/render-export';
  export default defineComponent({
    components: renderExport,
  });
</script>
<script setup lang="ts">
  import { PropType } from 'vue';

  const props = defineProps({
    mode: {
      type: String as PropType<'design' | 'form' | 'search'>,
      default: 'design',
    },
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: {},
    },
  });
</script>
<style scoped lang="scss"></style>
