<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-13 15:18:40
 * @FilePath: \aster-flowable-vue\src\views\workflow\settings\business-rule.vue
 * @Description: 业务规则
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="business-container">
    <div class="business-title">
      <span>业务规则</span>
      <el-button v-if="rules && rules.length > 0" type="primary" @click="handleAdd">
        新增规则
      </el-button>
    </div>

    <div class="business-main">
      <el-scrollbar v-if="rules && isNotEmpty(rules)" style="height: 100%; margin: 10px">
        <div class="business-tip">
          说明：业务规则用于处理表单与表单之间的数据关联变更，通过业务规则能对其它表单的数据进行插入、更新、删除等操作
        </div>
        <div
          class="business-content"
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
              <div class="pb-5px">触发事件: {{ _eventLabel(item.event) }}</div>
              <el-row>
                <el-col :span="10" class="pt-5px">目标表单: {{ item.target.label }}</el-col>
                <el-col :span="8" class="pt-5px"
                  >操作方式: {{ _operationTypeLabel(item.operationType) }}</el-col
                >
              </el-row>
            </el-col>
            <el-col :span="3" class="!flex justify-center items-center">
              <el-switch v-model="item.enable" />
            </el-col>
          </el-row>
          <div class="business-operation" v-show="showOperation(item)">
            <i class="iconfont icon-bianji1" @click="handleEdit(item)"></i>
            <i class="iconfont icon-guanbi1" @click="handleDelete(item)"></i>
          </div>
        </div>
      </el-scrollbar>
      <div class="business-empty" v-else>
        <el-empty :image-size="80">
          <template #description>
            <div class="business-empty-text">
              <span class="text-sm pb-5px">暂无业务规则</span>
              <span class="text-xs pb-5px">
                设置业务规则能对其它表单的数据进行插入、更新、删除等操作
              </span>
            </div>
          </template>
          <el-button type="primary" @click="handleAdd"> 立即设置 </el-button>
        </el-empty>
      </div>
    </div>
    <business-rule-edit ref="businessRuleEditRef" @submit="handleSubmit" />
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import businessRuleEdit from '../components/settings/business-rule-edit.vue';
  import { isEmpty, isNotEmpty } from '@/utils';
  import { computed, ref } from 'vue';
  import { businessEventOptions, businessOperationOptions } from '@/enums/workFlowEnum';
  import { ElMessageBox } from 'element-plus';
  import { generateFieldId } from '@/utils/workflow';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const businessRuleEditRef = ref();
  // 选中规则的id
  const selectRuleId = ref('');

  /**
   * @description: 业务规则
   */
  const rules = computed({
    get() {
      if (!workFlowStore.design.settings || !workFlowStore.design.settings.businessRules) {
        workFlowStore.design.settings = {
          ...workFlowStore.design.settings,
          businessRules: [],
        };
      }
      return workFlowStore.design.settings.businessRules;
    },
    set(val) {
      if (workFlowStore.design.settings) {
        workFlowStore.design.settings.businessRules = val;
      }
    },
  });

  /**
   * @description: 获取事件标签
   */
  const _eventLabel = (val: string) => {
    return businessEventOptions.find((item) => item.value === val)?.label;
  };

  /**
   * @description: 获取操作类型标签
   */
  const _operationTypeLabel = (val: string) => {
    return businessOperationOptions.find((item) => item.value === val)?.label;
  };

  /**
   * @description: 鼠标移入
   */
  const handleMouseenter = (element: WorkForm.BusinessRule) => {
    selectRuleId.value = element.id;
  };

  /**
   * @description: 鼠标移出
   */
  const handleMouseleave = (element: WorkForm.BusinessRule) => {
    if (selectRuleId.value === element.id) {
      selectRuleId.value = '';
    }
  };

  /**
   * @description: 是否显示操作
   */
  const showOperation = (element: WorkForm.BusinessRule) => {
    return selectRuleId.value === element.id;
  };

  /**
   * @description: 新增
   * @return {*}
   */
  const handleAdd = () => {
    businessRuleEditRef.value.init();
  };

  /**
   * @description: 编辑
   */
  const handleEdit = (element: WorkForm.BusinessRule) => {
    businessRuleEditRef.value.init(element);
  };

  /**
   * @description: 删除
   */
  const handleDelete = (element: WorkForm.BusinessRule) => {
    console.log(rules.value);
    console.log(element);
    ElMessageBox.confirm('确定删除该业务规则吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        if (rules.value) {
          rules.value = rules.value.filter((item) => item.id !== element.id);
        }
      })
      .catch(() => {});
  };

  /**
   * @description: 处理业务规则提交
   */
  const handleSubmit = (element: WorkForm.BusinessRule) => {
    if (rules.value) {
      if (isEmpty(element.id)) {
        element.id = generateFieldId('rule');
      }
      rules.value = [...rules.value, JSON.parse(JSON.stringify(element))];
    }
  };
</script>
<style scoped lang="scss">
  .business-container {
    width: 100%;
    height: 100%;

    .business-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      height: 55px;
      padding: 15px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid var(--el-border-color);
    }

    .business-main {
      width: 100%;
      height: calc(100% - 55px);

      .business-empty {
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

      .business-tip {
        background-color: var(--el-color-primary-light-9);
        padding: 10px 20px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }

      .business-content {
        position: relative;
        margin-top: 20px;
        border: 1px dashed var(--el-border-color);

        .business-operation {
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

      .business-content:hover {
        border: 1px dashed var(--el-menu-active-color);
        background: var(--el-menu-active-bg-color);
      }
    }
  }
</style>
