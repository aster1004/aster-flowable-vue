<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:43:12
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\area.vue
 * @Description: 省市区
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="!_hidden">
    <el-form-item
      v-if="mode != 'print'"
      :prop="formItemProp"
      :label-width="labelWidth"
      :show-message="showMessage"
    >
      <template #label>
        <span v-show="showLabel" style="line-height: normal">{{ formItem.title }}</span>
      </template>

      <div v-if="mode === 'design'" class="area-design">
        <i class="iconfont icon-diqu !text-sm"></i>
        {{ formItem.props.placeholder }}
      </div>
      <el-cascader
        v-else-if="mode === 'form'"
        v-model="_valueForm"
        :options="treeData"
        :disabled="_readonly"
        :placeholder="formItem.props.placeholder"
        separator="-"
        clearable
      />
      <div v-else-if="mode === 'search'">
        <el-input v-model="_value" clearable />
      </div>
      <span v-else>
        {{ _value }}
      </span>
    </el-form-item>
    <div v-else class="print-cell" ref="printRef">
      <div class="print-cell-label" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printLabelRef" v-show="showLabel">{{ formItem.title }}</p>
      </div>
      <div class="print-cell-value" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printValueRef">{{ _value }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, onMounted, PropType, ref, watch } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty } from '@/utils';
  import { areaList } from '@vant/area-data';
  import { FormPermissionEnum } from '@/enums/workFlowEnum';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: String,
      default: '',
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

  // 节点树
  const treeData = ref<WorkComponent.TreeNode[]>([]);
  // 打印 宽度
  const printRef = ref();
  const printLabelRef = ref();
  const printValueRef = ref();
  const printMaxHeight = ref(32);

  /**
   * @description: 更新高度
   */
  const updateHeight = () => {
    const parentHeight = printRef.value.parentNode?.offsetHeight;
    const labelHeight = printLabelRef.value?.offsetHeight;
    const valueHeight = printValueRef.value?.offsetHeight;
    printMaxHeight.value = Math.max(parentHeight, labelHeight, valueHeight);
  };

  /**
   * @description: 加载节点数据
   * @return {*}
   */
  const loadTreeData = async () => {
    const provinceList = { ...areaList.province_list };
    const cityList = { ...areaList.city_list };
    const countyList = { ...areaList.county_list };

    treeData.value.length = 0;

    // 遍历省列表
    Object.keys(provinceList).forEach((provinceKey) => {
      const province: WorkComponent.TreeNode = {
        label: provinceList[provinceKey],
        value: provinceList[provinceKey],
        children: [],
      };

      // 如果级别大于2
      if (props.formItem.props.level >= 2) {
        // 遍历市数据
        Object.keys(cityList).forEach((cityKey) => {
          const cityDistance = Number(cityKey) - Number(provinceKey);
          if (cityDistance > 0 && cityDistance < 10000) {
            const city: WorkComponent.TreeNode = {
              label: cityList[cityKey],
              value: cityList[cityKey],
              children: [],
            };
            if (props.formItem.props.level > 2) {
              Object.keys(countyList).forEach((countyKey) => {
                const countyDistance = Number(countyKey) - Number(cityKey);
                if (countyDistance > 0 && countyDistance < 100) {
                  const county: WorkComponent.TreeNode = {
                    label: countyList[countyKey],
                    value: countyList[countyKey],
                  };
                  delete countyList[countyKey];
                  city.children?.push(county);
                }
              });
            } else {
              city.children = undefined;
            }
            delete cityList[cityKey];
            province.children?.push(city);
          }
        });
      } else {
        province.children = undefined;
      }
      delete provinceList[provinceKey];
      treeData.value.push(province);
    });
  };

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
    if (!props.showLabel) {
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
   * @description: 组件值
   */
  const _valueForm = computed({
    get() {
      if (isNotEmpty(props.value)) {
        return props.value.split('-');
      }
      return [];
    },
    set(val) {
      emit('update:value', val.join('-'));
    },
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
    // 解析隐藏条件公式
    if (props.formItem.props.hidden) {
      let expression = props.formItem.props.hidden;
      // 如果是子表中的控件，则需要用到下标
      if (isNotEmpty(props.tableId)) {
        expression = expression.replaceAll('?', props.tableIndex);
      }
      r = evaluateFormula(expression, props.formData);
    }
    // 判断流程节点下该控件是否隐藏
    if (props.formItem.operation && props.formItem.operation.length > 0) {
      r = r || props.formItem.operation[0] == FormPermissionEnum.HIDDEN;
    }
    // 如果是必填则动态添加rule
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

  /**
   * @description: 是否只读, true-只读
   */
  const _readonly = computed(() => {
    let r = props.formItem.props.readonly;
    if (props.formItem.operation && props.formItem.operation.length > 0) {
      r = r || props.formItem.operation[0] == FormPermissionEnum.READONLY;
    }
    return r;
  });

  onMounted(() => {
    loadTreeData();
  });

  /**
   * @description: 监听打印高度
   */
  watch(
    () => [props.mode, printRef.value],
    () => {
      if (printRef.value && props.mode === 'print') {
        updateHeight();
      }
    },
    { immediate: true, deep: true },
  );

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);
  .area-design {
    color: #606266;
  }
</style>
