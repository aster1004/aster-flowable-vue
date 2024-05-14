<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-23 17:37:13
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\form-properties.vue
 * @Description: 表单属性
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="properties">
    <el-form
      ref="formRef"
      :model="formInfo"
      :rules="formRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item prop="formName">
        <template #label>
          <span class="form-label">表单名称</span>
        </template>
        <el-input v-model="formInfo.formName" placeholder="请输入表单名称" />
      </el-form-item>
      <el-form-item prop="icon">
        <template #label>
          <span class="form-label">表单图标</span>
        </template>
        <div class="form-icon">
          <div>
            <span>选择图标</span>
            <icon-select
              ref="iconSelectRef"
              v-if="showIconSelect"
              v-model:icon="formInfo.icon"
              :icon-style="iconStyle"
              type="button"
              :z-index="9999"
            />
          </div>
          <div class="form-icon__color">
            <span>颜色</span>
            <color-picker v-if="showIconSelect" v-model="formInfo.iconColor" />
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span class="form-label">数据标题</span>
        </template>
        <el-input placeholder="请选择数据标题" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <span class="form-label">标签位置</span>
        </template>
        <dict-select v-model="formInfo.labelPosition" dict-type="label_position"></dict-select>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span class="form-label">标签宽度</span>
        </template>
        <el-input type="number" v-model="formInfo.labelWidth"></el-input>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span class="form-label">组件尺寸</span>
        </template>
        <el-radio-group v-model="formInfo.size">
          <el-radio-button label="大" value="large" />
          <el-radio-button label="中" value="default" />
          <el-radio-button label="小" value="small" />
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="remark">
        <template #label>
          <span class="form-label">表单描述</span>
        </template>
        <el-input v-model="formInfo.remark" :rows="3" type="textarea" placeholder="请输入描述" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import IconSelect from '@/components/icon/icon-select.vue';
  import ColorPicker from '@/components/color/color-picker.vue';
  import { isDef, isNotEmpty } from '@/utils';

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 是否显示图标下拉选择器
  const showIconSelect = ref(false);
  // 注册组件
  const formRef = ref();
  const iconSelectRef = ref();
  // 表单规则
  const formRules = {
    formName: [
      { required: true, message: '请输入表单名称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
    ],
    icon: [{ required: true, message: '请选择图标', trigger: 'blur' }],
  };

  /**
   * @description: 表单数据
   */
  const formInfo = computed(() => {
    return workFlowStore.design;
  });

  /**
   * @description: 图标样式
   * @param {*} computed
   * @return {*}
   */
  const iconStyle = computed(() => {
    let style = {};
    if (isDef(formInfo.value.iconColor) && isNotEmpty(formInfo.value.iconColor)) {
      style = {
        color: '#ffffff',
        backgroundColor: formInfo.value.iconColor,
      };
    }
    return style;
  });

  onMounted(() => {
    showIconSelect.value = true;
  });
</script>
<style scoped lang="scss">
  .properties {
    padding: 5px 15px;

    .form-label {
      font-weight: 600;
    }

    .form-icon {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        padding-right: 15px;
        color: #606266;
      }

      &__color {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
</style>
