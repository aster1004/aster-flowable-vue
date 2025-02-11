<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-23 11:16:28
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\print\default-print.vue
 * @Description: 默认打印模板
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="print-container" v-show="visible">
    <div class="print-header">
      {{ formInfo.formName }}
    </div>
    <div class="print-body">
      <el-scrollbar>
        <div class="print-table" style="position: relative">
          <div class="print-row" v-for="(item, index) in formItems" :key="index">
            <form-design-render
              v-if="
                item.name === 'GridLayout' ||
                item.name === 'GridTitle' ||
                item.name === 'Description'
              "
              :value="formData"
              :ref="item.id"
              mode="print"
              :formData="formData"
              :formItem="item"
            />
            <form-design-render
              v-else
              :value="formData[item.id]"
              :ref="item.id"
              mode="print"
              :formData="formData"
              :formItem="item"
            />
          </div>
          <div class="form-complete" v-if="formStatus === '9'"> </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { PropType } from 'vue';
  import FormDesignRender from '../../form/form-design-render.vue';

  defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: () => ({}),
    },
    formItems: {
      type: Array as PropType<WorkComponent.ComponentConfig[]>,
      default: () => [],
    },
    formInfo: {
      type: Object as PropType<WorkForm.BaseInfo>,
      default: () => ({
        formName: '',
        icon: '',
        iconColor: '',
        labelPosition: '',
        labelWidth: 80,
      }),
    },
    formStatus: {
      type: String,
      default: '',
    },
  });
</script>
<style scoped lang="scss">
  @import url(./print.scss);
</style>
