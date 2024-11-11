<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-13 15:20:41
 * @FilePath: \aster-flowable-vue\src\views\workflow\settings\print-template\print-template-preview.vue
 * @Description: 打印预览
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    title="打印预览"
    v-model="printVisible"
    :close-on-click-modal="false"
    :lock-scroll="false"
    width="60%"
    height="100%"
  >
    <default-print
      id="default"
      v-if="printType === 'default'"
      :visible="printType === 'default'"
      :form-data="formData"
      :form-items="formItems"
      :form-info="formInfo"
      :form-status="formStatus"
    />
    <div v-else-if="printType === 'custom'">
      <div id="custom" v-show="printType === 'custom'" v-html="templateContent"></div>
    </div>
    <template #footer>
      <el-button type="primary" v-print="printObj">打印</el-button>
      <el-button @click="printVisible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { computed, nextTick, PropType, reactive, ref, watch } from 'vue';
  import DefaultPrint from '@/views/workflow/components/print/default-print.vue';
  import { defaultComponentConfig } from '@/views/workflow/components/component-config-export';
  import print from 'vue3-print-nb';
  import { fillFormData, templateFillValue } from '@/utils/print';
  import { flatFormItems } from '@/utils/workflow';

  const props = defineProps({
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

  // 是否显示打印预览
  const printVisible = ref<boolean>(false);
  // 模板类型
  const printType = ref<'default' | 'custom'>('default');
  // 自定义模板内容
  const templateContent = ref<string>('');
  // 自定义模板变量的值
  const templateValue = ref({});
  // 注册打印插件
  const vPrint = print;
  // 打印配置
  const printObj = reactive({
    id: 'default',
    popTitle: '&nbsp', // 页眉
  });

  /**
   * @description: 表单平铺
   * @return {*}
   */
  const _formItems = computed(() => {
    const items = flatFormItems(props.formItems);
    return [
      ...items,
      ...defaultComponentConfig,
      {
        id: 'formName',
        title: '表单名称',
        name: 'InputText',
        icon: props.formInfo.icon,
        value: props.formInfo.formName,
        valueType: 'string',
        props: {},
      },
    ];
  });

  /**
   * @description: 表单数据
   */
  const _formData = computed(() => {
    let data = JSON.parse(JSON.stringify(props.formData));
    data['create_by'] = [data['create_by']];
    data['create_by_org'] = [data['create_by_org']];
    data['formName'] = props.formInfo.formName;
    return data;
  });

  // 打印预览
  const init = (type: 'default' | 'custom', content?: string) => {
    printVisible.value = true;
    printType.value = type;
    if (type === 'custom' && content) {
      nextTick(async () => {
        templateContent.value = content.replace(/class="field-content"/g, 'style="padding: 0 5px"');
        await templateFillValue(_formData.value, _formItems.value, templateValue.value);
        await fillFormData('custom', templateValue.value, templateContent.value);
      });
    }
  };

  watch(
    () => templateValue.value,
    (val) => {
      if (val && document.getElementById('custom')) {
        nextTick(async () => {
          await fillFormData('custom', val, templateContent.value);
        });
      }
    },
    { immediate: true, deep: true },
  );

  // 监听类型变化
  watch(
    () => printType.value,
    (val) => {
      if (val) {
        printObj.id = val;
      }
    },
    { immediate: true, deep: true },
  );

  defineExpose({ init });
</script>
<style scoped lang="scss">
  // 去除页眉
  @page {
    size: auto;
    margin-top: 3mm;
  }

  .template-container {
    width: 100%;
    height: 100%;

    .template-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      height: 55px;
      padding: 15px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid var(--el-border-color);
    }

    .template-main {
      width: 100%;
      height: calc(100% - 55px);

      .template-empty {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &-text {
          display: flex;
          flex-direction: column;
          text-align: center;
          color: var(--el-text-color-secondary);
        }
      }

      .template-tip {
        background-color: var(--el-color-primary-light-9);
        padding: 10px 20px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }

      .template-content {
        position: relative;
        margin-top: 20px;
        border: 1px dashed var(--el-border-color);

        .template-operation {
          position: absolute;
          top: 0px;
          right: 0px;
          i {
            font-size: large;
            cursor: pointer;
            color: #8c8c8c;
            padding: 5px;

            &:hover {
              color: $primary-color;
            }
          }
        }
      }

      .template-content:hover {
        border: 1px dashed var(--el-menu-active-color);
        background: var(--el-menu-active-bg-color);
      }
    }
  }
</style>
<style lang="scss">
  #custom {
    table {
      border: 1px solid gray !important;
      tr {
        border: 1px solid gray !important;
        td {
          border: 1px solid gray !important;
        }
      }
    }
  }
</style>
