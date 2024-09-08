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
    v-model:value="_value"
    :mode="mode"
    :formData="props.formData"
    :formItem="formItem"
    :tableId="tableId"
    :tableIndex="tableIndex"
    :showLabel="showLabel"
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
  import { computed, PropType } from 'vue';

  const emits = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      default: null,
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search' | 'print'>,
      default: 'design',
    },
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: () => {},
    },
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: {},
    },
    tableId: {
      type: String,
      default: '',
    },
    tableIndex: {
      type: Number,
      default: 0,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
  });

  const _value = computed({
    get() {
      return props.value;
    },
    set(val) {
      emits('update:value', val);
    },
  });
</script>
<style scoped lang="scss"></style>
