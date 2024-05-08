<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-09 11:37:59
 * @FilePath: \aster-flowable-vue\src\views\workflow\form\form-render.vue
 * @Description: 渲染表单
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div>
    <el-form
      :model="_formData"
      :rules="rules"
      :label-position="formInfo.labelPosition"
      :validate-on-rule-change="false"
    >
      <div v-for="(item, index) in _formItems.value" :key="index">
        <form-design-render
          v-model:value="_formData[item.id]"
          mode="form"
          :formData="_formData"
          :formItem="item"
        />
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
  import { flatFormItems } from '@/utils/workflow';
  import { computed, PropType, ref } from 'vue';
  import FormDesignRender from './form-design-render.vue';

  const emits = defineEmits(['update:formData']);
  const props = defineProps({
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: () => {},
    },
    formItems: {
      type: Array<WorkForm.FormItem>,
      default: () => [],
    },
    formInfo: {
      type: Object as PropType<WorkForm.BaseInfo>,
      default: () => {},
    },
    tableIndex: {
      type: Number,
      default: 0,
    },
  });

  /** 表单规则 */
  const rules = ref<WorkForm.FormRuleModel>({});

  const _formItems = computed(() => {
    let items = ref<WorkForm.FormItem[]>([]);
    flatFormItems(props.formItems, items.value);
    return items;
  });

  const _formData = computed({
    get() {
      return props.formData;
    },
    set(val) {
      emits('update:formData', val);
    },
  });
</script>
<style scoped lang="scss"></style>
