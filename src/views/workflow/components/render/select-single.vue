<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 14:18:45
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\select-single.vue
 * @Description: 单选框
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="el-form-item">
    <template v-if="mode === 'design'">
      <el-form-item
        v-if="!_hidden"
        :prop="formItemProp"
        :label-width="labelWidth"
        :show-message="showMessage"
        style="width: 100%"
      >
        <template #label>
          <span v-show="showLabel">{{ formItem.title }}</span>
        </template>
        <template v-if="formItem.props.expand">
          <el-radio-group :model-value="formItem.value" readonly>
            <el-radio v-for="(item, i) in options" :key="i" :value="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </template>
        <template v-else>
          <el-select
            :model-value="formItem.value"
            :multiple="false"
            :clearable="true"
            :disabled="true"
          >
            <el-option
              v-for="(item, i) in options"
              :key="i"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </template>
      </el-form-item>
    </template>

    <template v-else-if="mode === 'form'">
      <el-form-item
        v-if="!_hidden"
        :prop="formItemProp"
        :label-width="labelWidth"
        :show-message="showMessage"
        style="width: 100%"
      >
        <template #label>
          <span v-show="showLabel">{{ formItem.title }}</span>
        </template>
        <template v-if="formItem.props.expand">
          <el-radio-group v-model="_value" :disabled="formItem.props.readonly">
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
            :disabled="formItem.props.readonly"
          >
            <el-option
              v-for="(item, i) in options"
              :key="i"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </template>
      </el-form-item>
    </template>
    <template v-else-if="mode === 'search'">
      <el-form-item
        v-if="!_hidden"
        :prop="formItemProp"
        :label-width="labelWidth"
        :show-message="showMessage"
        style="width: 100%"
      >
        <template #label>
          <span v-show="showLabel">{{ formItem.title }}</span>
        </template>
        <el-select v-model="_value" :multiple="false" :clearable="true">
          <el-option v-for="(item, i) in options" :key="i" :label="item.label" :value="item.value">
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
    </template>
    <template v-else>
      {{ _label }}
    </template>
  </div>
</template>
<script setup lang="ts">
  import { useAppStore } from '@/stores/modules/app';
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, onMounted, PropType, ref, watch } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { getDictDataList, isNotEmpty } from '@/utils';
  import { instanceListByCodeApi } from '@/api/workflow/instance';
  import { ResultEnum } from '@/enums/httpEnum';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search' | 'table'>,
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

  // 字典
  const appStore = useAppStore();
  // 选项
  const options = ref<any[]>([]);

  // 键
  const formItemProp = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return props.tableId + '.' + props.tableIndex + '.' + props.formItem.id;
    } else {
      return props.formItem.id;
    }
  });

  // 标签长度
  const labelWidth = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return '12px';
    } else {
      return '';
    }
  });

  // 是否显示校验信息
  const showMessage = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return false;
    } else {
      return true;
    }
  });

  /**
   * @description: 获取动态选项
   * @return {*}
   */
  const getDynamicOptions = async () => {
    if (
      isNotEmpty(props.formItem.props.dynamic.value) &&
      props.formItem.props.dynamic.value.length == 3
    ) {
      await instanceListByCodeApi(props.formItem.props.dynamic.value[1], '9').then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          if (res.data && res.data.length > 0) {
            options.value = res.data.map((item: Process.InstanceInfo) => {
              const fieldId = props.formItem.props.dynamic.value[2];
              const label = item[fieldId];
              return {
                value: item.procInstId + '.' + fieldId,
                label: label,
              };
            });
          } else {
            options.value = [];
          }
        } else {
          options.value = [];
        }
      });
    } else {
      options.value = [];
    }
  };

  // 监听类型变化
  watch(
    () => props.formItem.props.type,
    async (val: string) => {
      if (val === 'static') {
        options.value = props.formItem.props.options.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
      } else if (val === 'dict') {
        const dataList = getDictDataList(appStore.dictList, props.formItem.props.dictType);
        options.value = dataList.map((item) => {
          return {
            label: item.dictLabel,
            value: item.dictValue,
          };
        });
      } else if (val === 'dynamic') {
        await getDynamicOptions();
      } else {
        options.value = [];
      }
    },
    { immediate: true, deep: true },
  );

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
   * @description: 标签
   */
  const _label = computed(() => {
    let label = '';
    if (isNotEmpty(_value.value)) {
      options.value.forEach((item) => {
        if (item.value === _value.value) {
          label = item.label;
        }
      });
    }
    return label;
  });

  /**
   * @description: 是否隐藏, true-隐藏
   */
  const _hidden = computed(() => {
    let r = false;
    if (props.formItem.props.hidden) {
      let expression = props.formItem.props.hidden;
      // 如果是子表中的控件，则需要用到下标
      if (isNotEmpty(props.tableId)) {
        expression = expression.replaceAll('?', props.tableIndex);
      }
      r = evaluateFormula(expression, props.formData);
    }
    if (props.formItem.props.required) {
      // 调用form-render的方法
      mittBus.emit('changeFormRules', {
        hidden: r,
        fieldId: isNotEmpty(props.tableId)
          ? props.tableId + '.' + props.tableIndex + '.' + props.formItem.id
          : props.formItem.id,
        fieldName: props.formItem.title,
        trigger: 'blur',
      });
    }
    return r;
  });

  onMounted(() => {
    const dataStr = JSON.stringify(props.formData);
    if (!props.formItem.id || dataStr.indexOf(props.formItem.id) == -1) {
      _value.value = props.formItem.value;
    }
  });

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss"></style>
