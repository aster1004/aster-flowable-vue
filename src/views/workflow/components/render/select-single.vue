<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 14:18:45
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\select-single.vue
 * @Description: 单选框
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-form-item :label="formItem.title" :prop="formItem.id" v-if="!_hidden">
    <template v-if="mode === 'design'">
      <template v-if="formItem.props.expand">
        <el-radio-group :model-value="formItem.value" disabled>
          <el-radio v-for="(item, i) in options" :key="i" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </template>
      <template v-else>
        <el-select :model-value="formItem.value" :multiple="false" disabled>
          <el-option v-for="(item, i) in options" :key="i" :label="item.label" :value="item.value">
            {{ item.label }}
          </el-option>
        </el-select>
      </template>
    </template>

    <template v-else-if="mode === 'form'">
      <template v-if="formItem.props.expand">
        <el-radio-group v-model="_value" :disabled="props.formItem.props.readonly">
          <el-radio v-for="(item, i) in options" :key="i" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </template>
      <template v-else>
        <el-select
          v-model="_value"
          :multiple="false"
          :clearable="true"
          :disabled="props.formItem.props.readonly"
        >
          <el-option v-for="(item, i) in options" :key="i" :label="item.label" :value="item.value">
            {{ item.label }}
          </el-option>
        </el-select>
      </template>
    </template>

    <template v-else-if="mode === 'search'">
      <el-select v-model="_value" :multiple="false" :clearable="true">
        <el-option v-for="(item, i) in options" :key="i" :label="item.label" :value="item.value">
          {{ item.label }}
        </el-option>
      </el-select>
    </template>

    <template v-else>
      {{ _value }}
    </template>
  </el-form-item>
</template>
<script setup lang="ts">
  import { useAppStore } from '@/stores/modules/app';
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, onMounted, PropType } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { getDictDataList } from '@/utils';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search'>,
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

  // 字典
  const appStore = useAppStore();

  /**
   * @description: 选项
   */
  const options = computed(() => {
    if (props.formItem.props.type === 'static') {
      return props.formItem.props.options.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
    } else if (props.formItem.props.type === 'dict') {
      const dataList = getDictDataList(appStore.dictList, props.formItem.props.dictType);
      return dataList.map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue,
        };
      });
    } else if (props.formItem.props.type === 'dynamic') {
      //TODO 动态选项
    }
    return [];
  });

  /**
   * @description: 组件值
   */
  const _value = computed({
    get() {
      return props.value;
    },
    set(val) {
      emit('update:value', val);
    },
  });

  /**
   * @description: 是否隐藏, true-隐藏
   */
  const _hidden = computed(() => {
    let r = false;
    if (props.formItem.props.hidden) {
      r = evaluateFormula(props.formItem.props.hidden, props.formData);
    }
    if (props.formItem.props.required) {
      // 调用form-render的方法
      mittBus.emit('changeFormRules', {
        hidden: r,
        fieldId: props.formItem.id,
        fieldName: props.formItem.title,
        trigger: 'blur',
      });
    }
    return r;
  });

  onMounted(() => {
    if (
      !props.formItem.id ||
      !props.formData.hasOwnProperty(props.formItem.id) ||
      props.formData[props.formItem.id] == undefined
    ) {
      _value.value = props.formItem.value;
    }
  });
</script>
<style scoped lang="scss"></style>
