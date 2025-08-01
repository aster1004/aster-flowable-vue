<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-09 11:37:59
 * @FilePath: \aster-flowable-vue\src\views\workflow\form\form-render.vue
 * @Description: 渲染表单
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="form-render">
    <el-form
      ref="formRef"
      :model="_formData"
      :rules="rules"
      :label-position="formInfo.labelPosition"
      :label-width="formInfo.labelWidth"
      :validate-on-rule-change="false"
    >
      <div v-for="(item, index) in _formItems" :key="index">
        <form-design-render
          v-if="
            item.name === 'GridLayout' || item.name === 'GridTitle' || item.name === 'Description'
          "
          v-model:value="_formData"
          :ref="item.id"
          :mode="mode"
          :formData="_formData"
          :formItem="item"
        />
        <form-design-render
          v-else
          v-model:value="_formData[item.id]"
          :ref="item.id"
          :mode="mode"
          :formData="_formData"
          :formItem="item"
        />
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, PropType, ref } from 'vue';
  import FormDesignRender from './form-design-render.vue';
  import mittBus from '@/utils/mittBus';
  import { ElMessage } from 'element-plus';

  const emits = defineEmits(['update:formData']);
  const props = defineProps({
    mode: {
      type: String as PropType<'design' | 'form' | 'search' | 'table' | 'print'>,
      default: 'form',
    },
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: () => {},
    },
    formItems: {
      type: Array<WorkComponent.ComponentConfig>,
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

  // 注册组件
  const formRef = ref();

  /**
   * 表单项
   */
  const _formItems = computed(() => {
    return props.formItems;
  });

  /**
   * 表单数据
   */
  const _formData = computed({
    get() {
      return props.formData;
    },
    set(val) {
      emits('update:formData', val);
    },
  });

  /**
   * @description: 解析表单项
   * @param {WorkComponent.ComponentConfig[]} formItems
   * @param {WorkForm.FormRuleModel} rules
   * @return {*}
   */
  const analysisFormItems = (
    formItems: WorkComponent.ComponentConfig[],
    rules: WorkForm.FormRuleModel,
  ) => {
    if (!formItems) return {};
    formItems.forEach((item) => {
      if (item.name === 'GridLayout') {
        analysisFormItems(item.props.items, rules);
      } else {
        //TODO 此处需要添加默认值
        if (item.props.required) {
          rules[item.id] = [
            {
              type: item.valueType === 'Array' ? 'array' : undefined,
              required: true,
              message: '请输入' + item.title,
              trigger: item.name && item.name.indexOf('Select') != -1 ? 'change' : 'blur',
            },
          ];
        }
      }
    });
  };

  /**
   * @description: 表单校验
   * @return {*}
   */
  const validate = async (callback: Function) => {
    await formRef.value.validate(async (valid) => {
      if (valid) {
        await callback();
      } else {
        ElMessage.error('表单校验失败!');
      }
    });
  };

  /**
   * 表单规则
   */
  const rules = ref<WorkForm.FormRuleModel>({});

  interface MittRuleParam {
    hidden: boolean;
    fieldId: string;
    fieldName: string;
    trigger: string;
  }
  // 表单规则监听器
  mittBus.on('changeFormRules', (params: MittRuleParam) => {
    if (params.hidden) {
      rules.value.hasOwnProperty(params.fieldId) && delete rules.value[params.fieldId];
    } else {
      const rule = [
        { required: true, message: '请输入' + params.fieldName, trigger: params.trigger },
      ];
      rules.value[params.fieldId] = rule;
    }
  });

  onMounted(() => {
    // analysisFormItems(props.formItems, rules.value);
  });

  onBeforeUnmount(() => {
    // 组件销毁时关闭mitt事件监听器
    mittBus.off('changeFormRules', () => {});
  });

  defineExpose({
    validate,
  });
</script>
<style scoped lang="scss">
  .form-render {
    padding: 10px;
  }
</style>
