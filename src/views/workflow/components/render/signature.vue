<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:44:20
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\signature.vue
 * @Description: 签名
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
      <div v-if="mode === 'design'">
        <div class="sign-design">
          <el-button disabled> <i class="iconfont icon-qianming pr-5px"></i>点击签字 </el-button>
        </div>
      </div>
      <div v-else-if="mode === 'form'" class="sign-form">
        <div class="sign-form-btn">
          <el-button @click="handleClick" v-if="!_readonly">
            {{ isNotEmpty(_value) ? '重新签名' : '点击签名' }}
          </el-button>
        </div>
        <el-image v-if="isNotEmpty(_value)" class="sign-form-image" :src="_value" />
      </div>
      <div v-else-if="mode === 'search'" class="sign-form">
        <el-image v-if="isNotEmpty(_value)" class="sign-form-image" :src="_value" />
      </div>
      <span v-else>
        {{ _value }}
      </span>
      <Sign
        ref="signRef"
        :show-line-width="formItem.props.showLineWidth"
        :show-line-color="formItem.props.showLineColor"
        :show-local="formItem.props.showLocal"
        @success="handleSuccess"
      />
    </el-form-item>
    <div v-else class="print-image" ref="printRef">
      <div class="print-image-label" :style="{ height: printMaxHeight + 'px' }">
        <span ref="printLabelRef" v-show="showLabel">{{ formItem.title }}</span>
      </div>
      <div class="print-image-value" :style="{ height: printMaxHeight + 'px' }">
        <el-image
          ref="printValueRef"
          v-if="isNotEmpty(_value)"
          style="height: 50px"
          :src="_value"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { ref, computed, PropType, watch } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty } from '@/utils';
  import Sign from '@/components/sign/index.vue';
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

  // 注册组件
  const signRef = ref();
  // 打开签名
  const handleClick = () => {
    signRef.value.init();
  };
  // 更新签名
  const handleSuccess = (val: string) => {
    _value.value = val;
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
  .sign-design {
    color: #909399;
  }

  .sign-form-image {
    height: 50px;
    margin-top: 10px;
    border: 1px dashed #ccc;
  }
</style>
