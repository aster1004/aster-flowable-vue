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
              <span class="pb-5px">触发事件: {{ _eventLabel(item.event) }}</span>
              <span class="pt-5px">目标表单: {{ item.target.label }}</span>
              <span class="pt-5px">操作方式: {{ _operationTypeLabel(item.operationType) }}</span>
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

    <el-dialog
      v-model="ruleVisible"
      width="60%"
      title="业务规则配置"
      :close-on-click-modal="false"
      :lock-scroll="false"
      class="business-dialog"
    >
      <div class="dialog-tip">
        <p>
          "流程启动"是指表单提交时就触发，"流程完成"是指流程审批完成时触发，"流程作废"是指流程被驳回、被撤销时触发。
        </p>
        <p>"明细表"的操作类型只支持仅插入数据和仅删除数据。</p>
      </div>
      <el-form label-width="100px">
        <el-form-item label="触发事件">
          <el-select v-model="rule.event" placeholder="请选择触发事件">
            <el-option
              v-for="item in eventOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标表单">
          <el-tree-select
            v-model="rule.target.value"
            :data="targetOptions"
            node-key="value"
            check-strictly
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select
            v-model="rule.operationType"
            placeholder="请选择操作类型"
            @change="handleOperationChange"
          >
            <el-option
              v-for="item in operationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="isNotEmpty(rule.operationType) && rule.operationType !== 'insert'">
        <div class="dialog-tip">
          <p>
            操作范围
            可对目标表单中哪些数据进行操作（注：只对符合以下条件的数据进行操作，不设置条件则不操作）
          </p>
          <el-button type="primary" link @click="handleAddFilter">
            <i class="iconfont icon-plus p-5px"></i> 添加过滤条件
          </el-button>
        </div>
        <div class="dialog-filter">
          <el-row :gutter="20" v-for="(filter, index) in rule.filters" :key="index">
            <el-col :span="10">
              <el-select
                v-model="filter.target"
                placeholder="请选择目标表单字段"
                @change="handleFilterChange"
              >
                <el-option
                  v-for="item in targetFormItems"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="filter.operator">
                <el-option
                  v-for="item in filterOperatorOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-select v-model="filter.current" placeholder="请选择当前表单字段">
                <el-option
                  v-for="item in currentFormItems"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="isNotEmpty(rule.operationType) && rule.operationType !== 'delete'">
        <div class="dialog-tip">
          <p> 具体操作 对数据的具体操作-更新和插入数据 </p>
          <el-button type="primary" link @click="handleAddOpreate">
            <i class="iconfont icon-plus p-5px"></i> 添加操作
          </el-button>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="handleSubmit">{{ $t('button.confirm') }}</el-button>
        <el-button @click="ruleVisible = false">{{ $t('button.cancel') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { appFormTreeWithFormItemApi } from '@/api/workflow/app';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { isNotEmpty } from '@/utils';
  import { dataFillOptionsByFormItems, filterDataFillOptionsFilter } from '@/utils/workflow';
  import { ElMessage } from 'element-plus';
  import { computed, onMounted, ref } from 'vue';
  import { ValueType } from '../components/component-config-export';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 校验规则
  const rule = ref<WorkForm.BusinessRule>({
    id: '',
    // 触发事件
    event: '',
    // 目标表单
    target: {
      label: '',
      value: '',
      isTableList: false,
    },
    // 操作类型
    operationType: '',
    // 过滤条件
    filters: [],
    // 具体操作
    operations: [],
    // 是否启用
    enable: false,
  });
  // 选中规则的id
  const selectRuleId = ref('');
  // 弹窗显示
  const ruleVisible = ref(false);
  // 目标表单选项
  const targetOptions = ref<WorkComponent.FormTreeNode[]>([]);
  // 目标表单的表单项
  const targetFormItems = ref<WorkComponent.DataFillOption[]>([]);
  // 当前表单的表单项
  const currentFormItems = ref<WorkComponent.DataFillOption[]>([]);

  /**
   * @description: 触发事件选项
   */
  const eventOptions = ref([
    {
      label: '流程启动时',
      value: 'start',
    },
    {
      label: '流程完成时',
      value: 'completed',
    },
    {
      label: '流程作废时',
      value: 'cancel',
    },
  ]);

  /**
   * @description: 操作类型选项
   */
  const operationOptions = ref<WorkComponent.TreeNode[]>([
    {
      label: '仅更新数据',
      value: 'update',
    },
    {
      label: '仅插入数据',
      value: 'insert',
    },
    {
      label: '更新和插入数据',
      value: 'save',
    },
    {
      label: '仅删除数据',
      value: 'delete',
    },
  ]);

  /**
   * @description: 过滤操作符选项
   */
  const filterOperatorOptions = ref<WorkComponent.TreeNode[]>([
    {
      label: '等于',
      value: 'eq',
    },
    {
      label: '不等于',
      value: 'neq',
    },
    {
      label: '大于',
      value: 'gt',
    },
    {
      label: '大于等于',
      value: 'gte',
    },
    {
      label: '小于',
      value: 'lt',
    },
    {
      label: '小于等于',
      value: 'lte',
    },
  ]);

  /**
   * @description: 业务规则
   */
  const rules = computed({
    get() {
      if (!workFlowStore.design.settings) {
        workFlowStore.design.settings = {
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
    return eventOptions.value.find((item) => item.value === val)?.label;
  };

  /**
   * @description: 获取操作类型标签
   */
  const _operationTypeLabel = (val: string) => {
    return operationOptions.value.find((item) => item.value === val)?.label;
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
    rule.value = {
      id: '',
      // 触发事件
      event: '',
      // 目标表单
      target: {
        label: '',
        value: '',
        isTableList: false,
      },
      // 操作类型
      operationType: '',
      // 过滤条件
      filters: [],
      // 具体操作
      operations: [],
      // 是否启用
      enable: false,
    };
    ruleVisible.value = true;
  };

  /**
   * @description: 编辑
   */
  const handleEdit = (element: WorkForm.BusinessRule) => {
    rule.value = { ...element };
    ruleVisible.value = true;
  };

  /**
   * @description: 删除
   */
  const handleDelete = (element: WorkForm.BusinessRule) => {};

  /**
   * @description: 清空过滤条件和具体操作
   */
  const clearFilterOperator = () => {
    rule.value.filters = [
      {
        target: '',
        operator: '',
        current: '',
      },
    ];
    rule.value.operations = [];
  };

  /**
   * @description: 节点点击
   */
  const handleNodeClick = (node: WorkComponent.FormTreeNode) => {
    rule.value.target.label = node.label;
    rule.value.target.value = node.value;
    // 目标表单的表单项
    if (node.formItems) {
      console.log(node.formItems);
      targetFormItems.value = dataFillOptionsByFormItems(node.formItems, false);
      console.log(targetFormItems.value);
    }
    // 清空过滤条件和具体操作
    clearFilterOperator();
    // 若是明细表，则设置操作类型只能为仅插入和仅删除
    if (node.value.indexOf('-field') != -1) {
      rule.value.target.isTableList = true;
      operationOptions.value.forEach((item) => {
        if (item.value !== 'delete' && item.value !== 'insert') {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    } else {
      rule.value.target.isTableList = false;
      operationOptions.value.forEach((item) => {
        item.disabled = false;
      });
    }
  };

  /**
   * @description: 操作类型变化
   */
  const handleOperationChange = (val: string) => {
    if (val === 'insert') {
      rule.value.filters = [];
    } else if (val === 'delete') {
      rule.value.operations = [];
    }
  };

  /**
   * @description: 添加过滤条件
   */
  const handleAddFilter = () => {
    rule.value.filters.push({
      target: '',
      operator: '',
      current: '',
    });
  };

  /**
   * @description: 过滤条件变化
   */
  const handleFilterChange = (val: string) => {
    const targetItem = targetFormItems.value.find((item) => item.value == val);
    if (targetItem == undefined) {
      return;
    }
    // 根据目标表单字段的类型，筛选可填充的当前表单字段
    currentFormItems.value = currentFormItems.value.map((item: WorkComponent.DataFillOption) => {
      const disabled = filterDataFillOptionsFilter(
        targetItem.type,
        targetItem.name,
        item.type,
        item.name,
      );
      item['disabled'] = !disabled;
      return item;
    });
    // 根据目标表单字段类型，筛选操作符
    filterOperatorOptions.value = filterOperatorOptions.value.map((item) => {
      if (targetItem.type !== ValueType.number) {
        if (
          item.value === 'gt' ||
          item.value === 'gte' ||
          item.value === 'lt' ||
          item.value === 'lte'
        ) {
          item.disabled = true;
        }
      } else {
        item.disabled = false;
      }
      return item;
    });
  };

  /**
   * @description: 添加具体操作
   */
  const handleAddOpreate = () => {};
  /**
   * @description: 提交
   */
  const handleSubmit = () => {
    console.log('rule--->', rule.value);
  };
  /**
   * @description: 获取目标表单选项
   * @return {*}
   */
  const getTargetForm = async () => {
    await appFormTreeWithFormItemApi().then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        targetOptions.value = [];
        targetOptions.value = res.data.map((item) => {
          return { ...item, disabled: true };
        });
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  onMounted(() => {
    // 获取目标表单的下拉信息
    getTargetForm();
    // 获取当前表单的表单项
    currentFormItems.value = [];
    currentFormItems.value = dataFillOptionsByFormItems(workFlowStore.design.formItems, false);
  });
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

    .business-dialog {
      .dialog-tip {
        padding: 0px 30px 15px 30px;
        color: var(--el-text-color-secondary);
      }
      .dialog-filter {
        padding: 0px 30px 15px 30px;
      }
    }
  }
</style>
