<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-13 15:18:02
 * @FilePath: \aster-flowable-vue\src\views\workflow\settings\submit-validate.vue
 * @Description: 提交校验
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="validate-container">
    <div class="validate-title">
      <span>动态校验</span>
      <el-button
        v-if="submitValidates && submitValidates.length > 0"
        type="primary"
        @click="addFormula"
      >
        新增规则
      </el-button>
    </div>
    <div class="validate-main">
      <el-scrollbar
        v-if="submitValidates && isNotEmpty(submitValidates)"
        style="height: 100%; margin: 10px"
      >
        <div class="validate-tip">
          说明：在提交表单时满足以下校验规则的数据将不允许提交，多条规则之间请避免输入互斥条件，以免前台校验出错
        </div>
        <div
          class="validate-content"
          v-for="(item, index) in submitValidates"
          :key="index"
          @mouseleave="handleMouseleave(item)"
          @mouseenter="handleMouseenter(item)"
        >
          <el-row class="p-15px">
            <el-col :span="2" class="!flex justify-center items-center">
              <span>{{ index + 1 }}</span>
            </el-col>
            <el-col
              :span="18"
              class="!flex flex-col justify-start text-sm"
              style="color: var(--el-text-color-primary)"
            >
              <span class="pb-5px">校验规则: {{ convertFormula(item.formula) }}</span>
              <span class="pt-5px">错误提示: {{ item.errorMessage }}</span>
            </el-col>
            <el-col :span="3" class="!flex justify-center items-center">
              <el-switch v-model="item.enable" />
            </el-col>
          </el-row>
          <div class="validate-operation" v-show="showOperation(item)">
            <i class="iconfont icon-bianji1" @click="handleEdit(item)"></i>
            <i class="iconfont icon-guanbi1" @click="handleDelete(item)"></i>
          </div>
        </div>
      </el-scrollbar>
      <div class="validate-empty" v-else>
        <el-empty :image-size="80">
          <template #description>
            <div class="validate-empty-text">
              <span class="text-sm pb-5px">暂无提交校验</span>
              <span class="text-xs pb-5px">在提交表单时，满足校验规则的数据将不允许提交</span>
            </div>
          </template>
          <el-button type="primary" @click="showFormula"> 立即设置 </el-button>
        </el-empty>
      </div>
    </div>

    <!-- <formula
      ref="formulaRef"
      title="表单提交校验"
      type="validate"
      header-title="当满足以下条件时表单不允许提交"
      placeholder="例：报销金额 > 10000"
      v-model:formula="submitValidate.formula"
      @callback="callback"
    /> -->
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { isNotEmpty } from '@/utils';
  import { flatFormItems, generateFieldId, restorationFormulaByFormItems } from '@/utils/workflow';
  import { computed, ref } from 'vue';
  // import Formula from '../components/common/formula.vue';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const formulaRef = ref();
  // 校验规则
  const submitValidate = ref<WorkForm.SubmitValidate>({
    id: '',
    formula: '',
    errorMessage: '',
    enable: true,
  });
  // 选中规则的id
  const selectValidateId = ref('');

  // 提交校验
  const submitValidates = computed({
    get() {
      if (!workFlowStore.design.settings) {
        workFlowStore.design.settings = {
          submitValidates: [],
        };
      }
      return workFlowStore.design.settings.submitValidates;
    },
    set(val) {
      if (workFlowStore.design.settings) {
        workFlowStore.design.settings.submitValidates = val;
      }
    },
  });

  // 扁平化表单组件
  const _flatFormItems = computed(() => {
    return flatFormItems(workFlowStore.design.formItems);
  });

  /**
   * @description: 鼠标移入
   */
  const handleMouseenter = (element: WorkForm.SubmitValidate) => {
    selectValidateId.value = element.id;
  };

  /**
   * @description: 鼠标移出
   */
  const handleMouseleave = (element: WorkForm.SubmitValidate) => {
    if (selectValidateId.value === element.id) {
      selectValidateId.value = '';
    }
  };

  /**
   * @description: 是否显示操作
   */
  const showOperation = (element: WorkForm.SubmitValidate) => {
    return selectValidateId.value === element.id;
  };

  /**
   * @description: 新增规则
   */
  const addFormula = () => {
    submitValidate.value = {
      id: '',
      formula: '',
      errorMessage: '',
      enable: true,
    };
    showFormula();
  };

  /**
   * @description: 编辑规则
   */
  const handleEdit = (element: WorkForm.SubmitValidate) => {
    submitValidate.value = element;
    showFormula();
  };

  /**
   * @description: 删除规则
   */
  const handleDelete = (element: WorkForm.SubmitValidate) => {
    if (submitValidates.value) {
      submitValidates.value = submitValidates.value.filter((item) => item.id !== element.id);
    }
  };

  /**
   * @description: 转换公式, 将fieldId转为title
   */
  const convertFormula = (val: string) => {
    return restorationFormulaByFormItems(val, _flatFormItems.value);
  };

  /**
   * @description: 显示公式
   */
  const showFormula = () => {
    formulaRef.value.init(submitValidate.value);
  };

  /**
   * @description: 公式回调
   */
  const callback = (val: WorkForm.SubmitValidate) => {
    if (!val) {
      return;
    }
    if (val.id && isNotEmpty(val.id)) {
      if (submitValidates.value && submitValidates.value.length > 0) {
        submitValidates.value = submitValidates.value.map((item) => {
          if (item.id === val.id) {
            return { ...val };
          } else {
            return item;
          }
        });
      } else {
        submitValidates.value = [val];
      }
    } else {
      if (submitValidates.value) {
        const ruleId = generateFieldId('rule');
        submitValidates.value = [
          ...submitValidates.value,
          { id: ruleId, formula: val.formula, errorMessage: val.errorMessage, enable: true },
        ];
      }
    }
  };
</script>
<style scoped lang="scss">
  .validate-container {
    width: 100%;
    height: 100%;

    .validate-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      height: 55px;
      padding: 15px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid var(--el-border-color);
    }

    .validate-main {
      width: 100%;
      height: calc(100% - 55px);

      .validate-empty {
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

      .validate-tip {
        background-color: var(--el-color-primary-light-9);
        padding: 10px 20px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }

      .validate-content {
        position: relative;
        margin-top: 20px;
        border: 1px dashed var(--el-border-color);

        .validate-operation {
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

      .validate-content:hover {
        border: 1px dashed var(--el-menu-active-color);
        background: var(--el-menu-active-bg-color);
      }
    }
  }
</style>
