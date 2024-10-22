<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:41:48
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\geo-location.vue
 * @Description: 地理位置
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
      <div v-if="mode === 'design'" class="geo-design">
        <span>
          <i class="iconfont icon-dingwei !text-sm"></i>
          {{ formItem.props.placeholder }}
        </span>
      </div>
      <div v-else-if="mode === 'form'">
        <el-input
          :model-value="_value.address"
          :placeholder="formItem.props.placeholder"
          :readonly="_readonly"
        >
          <template #append>
            <i v-if="formItem.props.readonly" class="iconfont icon-dingwei"></i>
            <el-button v-else text @click="showAmap">
              <i class="iconfont icon-dingwei"></i>
            </el-button>
          </template>
        </el-input>
      </div>
      <div v-else-if="mode === 'search'">
        <el-input v-model="_value" />
      </div>
      <span v-else>
        {{ _value.address }}
      </span>

      <amap-marker ref="amapRef" :form="_value" @address="address"></amap-marker>
    </el-form-item>
    <div v-else class="print-cell" ref="printRef">
      <div class="print-cell-label" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printLabelRef" v-show="showLabel">{{ formItem.title }}</p>
      </div>
      <div class="print-cell-value" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printValueRef">{{ _value ? _value.address : '' }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, nextTick, onMounted, PropType, ref } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty } from '@/utils';
  import AmapMarker from '@/components/map/amap-marker.vue';
  import { FormPermissionEnum } from '@/enums/workFlowEnum';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Object as PropType<WorkForm.GeoPositionModel>,
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

  // 注册组件
  const amapRef = ref();
  // 打印 宽度
  const printRef = ref();
  const printLabelRef = ref();
  const printValueRef = ref();
  const printMaxHeight = ref(32);

  /**
   * @description: 更新高度
   */
  const updateHeight = () => {
    const parentHeight = printRef.value.parentNode.offsetHeight;
    const labelHeight = printLabelRef.value.offsetHeight;
    const valueHeight = printValueRef.value.offsetHeight;
    printMaxHeight.value = Math.max(parentHeight, labelHeight, valueHeight);
  };

  // 显示地图弹窗
  const showAmap = () => {
    amapRef.value.init();
  };

  /**
   * @description: 获取地图地址信息
   * @param {*} address 地址
   * @param {*} coord 经纬度
   * @param {*} adcode 区域编码
   * @return {*}
   */
  const address = (address: string, coord: number[], adcode: string) => {
    _value.value['address'] = address;
    _value.value['longitude'] = coord[0];
    _value.value['latitude'] = coord[1];
    _value.value['adcode'] = adcode;
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
    if (props.mode === 'print') {
      nextTick(() => {
        updateHeight();
      });
    }
  });

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);
  .geo-design {
    color: #606266;
  }
</style>
