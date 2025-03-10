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
      <el-button v-if="rules && rules.length > 0" type="primary" @click="addRule">
        新增规则
      </el-button>
    </div>
    <div class="validate-main">
      <el-scrollbar v-if="rules && isNotEmpty(rules)" style="height: 100%; margin: 10px">
        <div class="validate-tip">
          说明：在提交表单时满足以下校验规则的数据将不允许提交，多条规则之间请避免输入互斥条件，以免校验出错
        </div>
        <div
          class="validate-content"
          v-for="(item, index) in rules"
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
              <span class="pb-5px">触发事件: {{ item.eventText }}</span>
              <span class="pb-5px">校验信息: {{ item.prompt }}</span>
              <span class="pb-5px">关联表单: {{ item.associationFormText }}</span>
              <span class="pt-5px">备注: {{ item.remark }}</span>
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
              <span class="text-sm pb-5px">暂无动态校验</span>
              <span class="text-sm pb-5px"
                >动态校验规则用于动态查询关联的表单数据校验当前表单数据</span
              >
              <span class="text-xs pb-5px">在提交表单时，满足校验规则的数据将不允许提交</span>
            </div>
          </template>
          <el-button type="primary" @click="openDynamicValidateRule"> 立即设置 </el-button>
        </el-empty>
      </div>
    </div>

    <add-or-edit ref="addOrEditRef" v-if="visible" />

    <dynamic-validate-rule-edit
      ref="dynamicValidateRuleEditRef"
      v-if="dynamicValidateRuleVisible"
      @submit="handleDynamicValidateRuleSubmit"
    />
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { ElMessageBox } from 'element-plus';
  import { isEmpty, isNotEmpty } from '@/utils';
  import { flatFormItems, generateFieldId, restorationFormulaByFormItems } from '@/utils/workflow';
  import { computed, ref, nextTick } from 'vue';
  import AddOrEdit from './add-or-edit.vue';
  import DynamicValidateRuleEdit from '../../components/settings/dynamic-validate-rule-edit.vue';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 新增或修改动态校验规则
  const addOrEditRef = ref();

  // 动态校验规则
  const dynamicValidateRuleEditRef = ref();

  // 表单显示
  const visible = ref<boolean>(false);

  // 动态校验显隐
  const dynamicValidateRuleVisible = ref<boolean>(false);

  // 校验规则
  const submitValidate = ref<WorkForm.SubmitValidate>({
    id: '',
    formula: '',
    errorMessage: '',
    enable: true,
  });

  // 选中规则的id
  const selectValidateId = ref('');

  /**
   * @description: 动态校验规则
   */
  const rules = computed({
    get() {
      if (!workFlowStore.design.settings || !workFlowStore.design.settings.dynamicValidateRules) {
        workFlowStore.design.settings = {
          ...workFlowStore.design.settings,
          dynamicValidateRules: [],
        };
      }
      return workFlowStore.design.settings.dynamicValidateRules;
    },
    set(val) {
      if (workFlowStore.design.settings) {
        workFlowStore.design.settings.dynamicValidateRules = val;
      }
    },
  });

  /**
   * @description: 鼠标移入
   */
  const handleMouseenter = (element: WorkForm.DynamicValidateRule) => {
    selectValidateId.value = element.id;
  };

  /**
   * @description: 鼠标移出
   */
  const handleMouseleave = (element: WorkForm.DynamicValidateRule) => {
    if (selectValidateId.value === element.id) {
      selectValidateId.value = '';
    }
  };

  /**
   * @description: 是否显示操作
   */
  const showOperation = (element: WorkForm.DynamicValidateRule) => {
    return selectValidateId.value === element.id;
  };

  /**
   * @description: 删除规则
   */
  const handleDelete = (element: WorkForm.SubmitValidate) => {
    ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(async () => {
        if (rules.value) {
          rules.value = rules.value.filter((item) => item.id !== element.id);
        }
      })
      .catch(() => {});
  };

  /**
   * 添加动态校验规则
   */
  const addRule = () => {
    dynamicValidateRuleVisible.value = true;
    nextTick(() => {
      dynamicValidateRuleEditRef.value.init();
    });
  };

  const handleEdit = (rule: any) => {
    dynamicValidateRuleVisible.value = true;
    nextTick(() => {
      dynamicValidateRuleEditRef.value.init(JSON.parse(JSON.stringify(rule)));
    });
  };

  /**
   * 打开动态校验规则
   */
  const openDynamicValidateRule = () => {
    dynamicValidateRuleVisible.value = true;
    nextTick(() => {
      dynamicValidateRuleEditRef.value.init();
    });
  };

  /**
   * 提交动态表单校验回调
   * @param val
   */
  const handleDynamicValidateRuleSubmit = (val: any) => {
    if (rules.value) {
      if (isEmpty(val.id)) {
        val.id = generateFieldId('rule');
      } else {
        // 先移除已存在的rule, 再添加
        rules.value = rules.value.filter((item) => item.id !== val.id);
      }
      rules.value = [...rules.value, JSON.parse(JSON.stringify(val))];
    }
    dynamicValidateRuleVisible.value = false;
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
