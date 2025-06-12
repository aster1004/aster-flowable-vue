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
          <span class="form-label">{{ t('workflow.label.formName') }}</span>
        </template>
        <el-input
          v-model="formInfo.formName"
          :placeholder="t('workflow.form.formNamePlaceholder')"
          :maxlength="TITLE_MAXLENGTH"
        />
      </el-form-item>
      <el-form-item prop="icon">
        <template #label>
          <span class="form-label">{{ t('workflow.label.formIcon') }}</span>
        </template>
        <div class="form-icon">
          <div>
            <span>{{ t('workflow.form.selectIcon') }}</span>
            <icon-select
              ref="iconSelectRef"
              v-if="showIconSelect"
              v-model:icon="formInfo.icon"
              :icon-style="iconStyle"
              type="icon"
              :z-index="9999"
            />
          </div>
          <div class="form-icon__color">
            <span>{{ t('workflow.form.iconColor') }}</span>
            <color-picker v-if="showIconSelect" v-model="formInfo.iconColor" />
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="dataTitle">
        <template #label>
          <span class="form-label">{{ t('workflow.label.dataTitle') }}</span>
        </template>
        <el-select
          v-model="formInfo.dataTitle"
          multiple
          :placeholder="t('workflow.form.dataTitlePlaceholder')"
        >
          <el-option
            v-for="(item, index) in _flatFormItems"
            :key="index"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="labelPosition">
        <template #label>
          <span class="form-label">{{ t('workflow.label.labelPosition') }}</span>
        </template>
        <dict-select v-model="formInfo.labelPosition" dict-type="label_position"></dict-select>
      </el-form-item>
      <el-form-item prop="labelWidth">
        <template #label>
          <span class="form-label">{{ t('workflow.label.labelWidth') }}</span>
        </template>
        <el-input type="number" v-model="formInfo.labelWidth"></el-input>
      </el-form-item>
      <el-form-item prop="remark">
        <template #label>
          <span class="form-label">{{ t('workflow.label.formDesc') }}</span>
        </template>
        <el-input
          v-model="formInfo.remark"
          :rows="3"
          type="textarea"
          :placeholder="t('workflow.form.formDescPlaceholder')"
          :maxlength="DESCRIPTION_MAXLENGTH"
        />
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
  import { flatFormItems, flatFormItemsExclude } from '@/utils/workflow';
  import { useI18n } from 'vue-i18n';
  import { TITLE_MAXLENGTH, DESCRIPTION_MAXLENGTH } from '@/config/formConfig';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 国际化
  const { t } = useI18n();

  // 是否显示图标下拉选择器
  const showIconSelect = ref(false);
  // 注册组件
  const formRef = ref();
  const iconSelectRef = ref();
  // 表单规则
  const formRules = {
    formName: [
      { required: true, message: t('workflow.form.formNameRule'), trigger: 'blur' },
      { min: 2, max: 50, message: t('workflow.form.formNameLength'), trigger: 'blur' },
    ],
    icon: [{ required: true, message: t('workflow.form.formIconRule'), trigger: 'blur' }],
    dataTitle: [{ required: true, message: t('workflow.form.dataTitleRule'), trigger: 'blur' }],
  };
  // 校验表单
  const validate = async () => {
    return new Promise<void>((resolve, reject) => {
      formRef.value
        .validate()
        .then(() => resolve())
        .catch((err) => {
          reject(Object.keys(err).map((v) => err[v][0].message));
        });
    });
  };
  /**
   * @description: 表单数据
   */
  const formInfo = computed(() => {
    return workFlowStore.design;
  });

  /**
   * 表单项平铺，排除布局组件
   */
  const _flatFormItems = computed(() => {
    const items = flatFormItemsExclude(workFlowStore.design.formItems);
    return items;
  });

  /**
   * @description: 图标样式
   * @param {*} computed
   * @return {*}
   */
  const iconStyle = computed(() => {
    let style: { color: string; backgroundColor: string } = {
      color: 'none',
      backgroundColor: 'none',
    };
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
  defineExpose({ validate });
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
