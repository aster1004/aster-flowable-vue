<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-13 15:57:26
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\description.vue
 * @Description: 描述说明
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div
    v-if="!_hidden"
    :class="['description', formItem.props.justify, mode === 'print' ? 'print-description' : '']"
    :style="{ color: props.formItem.props.color }"
  >
    <span class="description-icon">
      <i :class="[formItem.props.icon, `!${formItem.props.fontSize}`]"></i>
    </span>
    <span :class="formItem.props.fontSize">
      {{ formItem.title }}
    </span>
  </div>
</template>
<script setup lang="ts">
  import { FormPermissionEnum } from '@/enums/workFlowEnum';
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType } from 'vue';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Object,
      default: {},
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search' | 'table' | 'print'>,
      default: 'design',
    },
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: {},
    },
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: {},
    },
  });

  /**
   * @description: 是否隐藏, true-隐藏
   */
  const _hidden = computed(() => {
    let r = false;
    // 解析隐藏条件公式
    if (props.formItem.props.hidden) {
      r = evaluateFormula(props.formItem.props.hidden, props.formData);
    }
    // 判断流程节点下该控件是否隐藏
    if (props.formItem.operation && props.formItem.operation.length > 0) {
      r = r || props.formItem.operation[0] == FormPermissionEnum.HIDDEN;
    }
    return r;
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);
  .description {
    display: flex;
    align-items: center;
    padding: 15px 0px;

    .description-icon {
      padding-right: 8px;
    }
  }
</style>
