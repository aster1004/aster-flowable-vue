<template>
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
    <el-form :model="rule" ref="businessFormRef" label-width="100px" :rules="businessFormRules">
      <el-form-item label="触发事件" prop="event">
        <el-select v-model="rule.event" placeholder="请选择触发事件">
          <el-option
            v-for="item in businessEventOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目标表单" prop="target">
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
      <el-form-item label="操作类型" prop="operationType">
        <el-select
          v-model="rule.operationType"
          placeholder="请选择操作类型"
          @change="handleOperationChange"
        >
          <el-option
            v-for="item in businessOperationOptions"
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
        <el-row :gutter="10" v-for="(filter, index) in rule.filters" :key="index">
          <el-col :span="9">
            <el-select
              v-model="filter.target"
              placeholder="请选择目标表单字段"
              @change="handleFilterChange($event, index)"
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
                v-for="item in filterOperatorOptions[index]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
          <el-col :span="9">
            <el-select v-model="filter.current" placeholder="请选择当前表单字段">
              <el-option
                v-for="item in filterCurrentFormItems[index]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
          <el-col :span="2">
            <div class="w-full h-full flex items-center justify-center">
              <i class="iconfont icon-shanchu" @click="handleFilterDelete(index)"></i>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-if="isNotEmpty(rule.operationType) && rule.operationType !== 'delete'">
      <div class="dialog-tip">
        <p> 具体操作 对数据的具体操作-更新和插入数据 </p>
        <el-button type="primary" link @click="handleAddOperate">
          <i class="iconfont icon-plus p-5px"></i> 添加操作
        </el-button>
      </div>
      <div class="dialog-filter">
        <el-row :gutter="10" v-for="(operate, index) in rule.operations" :key="index">
          <el-col :span="9">
            <el-select
              v-model="operate.target"
              placeholder="请选择目标表单字段"
              @change="handleOperateChange($event, index)"
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
            <el-select v-model="operate.operator">
              <el-option
                v-for="item in operateOperatorOptions[index]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
          <el-col :span="9">
            <el-select v-model="operate.current" placeholder="请选择当前表单字段">
              <el-option
                v-for="item in operateCurrentFormItems[index]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
          <el-col :span="2">
            <div class="w-full h-full flex items-center justify-center">
              <i class="iconfont icon-shanchu" @click="handleOperateDelete(index)"></i>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="ruleVisible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { appFormTreeWithFormItemApi } from '@/api/workflow/app';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { isEmpty, isNotEmpty } from '@/utils';
  import { dataFillOptionsByFormItems } from '@/utils/workflow';
  import { ElMessage } from 'element-plus';
  import { computed, onMounted, ref } from 'vue';
  import { ValueType } from '../component-config-export';
  import {
    businessEventOptions,
    businessFilterOperators,
    businessOperateOperators,
    businessOperationOptions,
  } from '@/enums/workFlowEnum';
  import { ResultEnum } from '@/enums/httpEnum';

  const emits = defineEmits(['submit']);
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 弹窗显示
  const ruleVisible = ref(false);
  const businessFormRef = ref();
  // 目标表单选项
  const targetOptions = ref<WorkComponent.FormTreeNode[]>([]);
  // 扁平化目标表单选项
  const flatTargetOptions = ref<WorkComponent.FormTreeNode[]>([]);
  // 目标表单的表单项
  const targetFormItems = ref<WorkComponent.DataFillOption[]>([]);
  // 过滤条件的操作符
  const filterOperatorOptions = ref<WorkComponent.TreeNode[][]>([]);
  // 过滤条件的当前表单的表单项
  const filterCurrentFormItems = ref<WorkComponent.DataFillOption[][]>([]);
  // 过滤条件的操作符
  const operateOperatorOptions = ref<WorkComponent.TreeNode[][]>([]);
  // 操作条件的当前表单的表单项
  const operateCurrentFormItems = ref<WorkComponent.DataFillOption[][]>([]);
  // 业务规则
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
    enable: true,
  });

  /**
   * @description: 校验目标表单
   */
  const validatorTarget = (_rule: any, value: any, callback: any) => {
    if (isEmpty(value.value)) {
      callback(new Error('请选择目标表单'));
    } else {
      callback();
    }
  };

  /**
   * @description: 表单校验规则
   */
  const businessFormRules = ref({
    event: [
      {
        required: true,
        message: '请选择触发事件',
        trigger: 'change',
      },
    ],
    target: [
      {
        required: true,
        validator: validatorTarget,
        trigger: 'change',
      },
    ],
    operationType: [
      {
        required: true,
        message: '请选择操作类型',
        trigger: 'change',
      },
    ],
  });

  /**
   * @description: 当前表单的表单项
   */
  const _formItems = computed(() => {
    return dataFillOptionsByFormItems(workFlowStore.design.formItems, false);
  });

  /**
   * @description: 清空过滤条件和具体操作
   */
  const clearFilterOperator = () => {
    filterOperatorOptions.value = [businessFilterOperators];
    filterCurrentFormItems.value = [JSON.parse(JSON.stringify(_formItems.value))];
    rule.value.filters = [];
    operateOperatorOptions.value = [businessOperateOperators];
    operateCurrentFormItems.value = [JSON.parse(JSON.stringify(_formItems.value))];
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
      targetFormItems.value = dataFillOptionsByFormItems(node.formItems, false);
    }
    // 清空过滤条件和具体操作
    clearFilterOperator();
    // 若是明细表，则设置操作类型只能为仅插入和仅删除
    if (node.value.indexOf('-field') != -1) {
      rule.value.target.isTableList = true;
      businessOperationOptions.forEach((item) => {
        if (item.value !== 'delete' && item.value !== 'insert') {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    } else {
      rule.value.target.isTableList = false;
      businessOperationOptions.forEach((item) => {
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
      rule.value.operations = [{ target: '', operator: '', current: '' }];
    } else if (val === 'delete') {
      rule.value.filters = [{ target: '', operator: '', current: '' }];
      rule.value.operations = [];
    } else {
      rule.value.filters = [{ target: '', operator: '', current: '' }];
      rule.value.operations = [{ target: '', operator: '', current: '' }];
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
    filterOperatorOptions.value.push(businessFilterOperators);
    filterCurrentFormItems.value.push(JSON.parse(JSON.stringify(_formItems.value)));
  };

  /**
   * @description: 判断是否禁用 true-不禁用, false-禁用
   */
  const isDisabled = (
    targetType: string,
    targetName: string,
    currentType: string,
    currentName: string,
  ) => {
    // 组件一致直接返回true
    if (targetName === currentName) {
      return true;
    }
    if (targetType === currentType) {
      if (targetType === ValueType.object || targetType === ValueType.array) {
        return targetName === currentName;
      }
      return true;
    } else {
      return false;
    }
  };

  /**
   * @description: 过滤条件变化
   */
  const handleFilterChange = (val: string, index: number) => {
    const targetItem = targetFormItems.value.find((item) => item.value == val);
    if (targetItem == undefined) {
      return;
    }
    // 根据目标表单字段的类型，筛选可填充的当前表单字段
    filterCurrentFormItems.value[index] = filterCurrentFormItems.value[index].map(
      (item: WorkComponent.DataFillOption) => {
        const disabled = isDisabled(targetItem.type, targetItem.name, item.type, item.name);
        item['disabled'] = !disabled;
        return item;
      },
    );
    // 根据目标表单字段类型，筛选操作符
    filterOperatorOptions.value[index] = filterOperatorOptions.value[index].map((item) => {
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
   * @description: 删除过滤条件
   */
  const handleFilterDelete = (index: number) => {
    rule.value.filters.splice(index, 1);
    filterOperatorOptions.value.splice(index, 1);
    filterCurrentFormItems.value.splice(index, 1);
  };

  /**
   * @description: 添加具体操作
   */
  const handleAddOperate = () => {
    rule.value.operations.push({
      target: '',
      operator: '',
      current: '',
    });
    operateOperatorOptions.value.push(businessOperateOperators);
    operateCurrentFormItems.value.push(JSON.parse(JSON.stringify(_formItems.value)));
  };

  /**
   * @description: 操作条件变化
   */
  const handleOperateChange = (val: string, index: number) => {
    const targetItem = targetFormItems.value.find((item) => item.value == val);
    if (targetItem == undefined) {
      return;
    }
    // 根据目标表单字段的类型，筛选可填充的当前表单字段
    operateCurrentFormItems.value[index] = operateCurrentFormItems.value[index].map(
      (item: WorkComponent.DataFillOption) => {
        const disabled = isDisabled(targetItem.type, targetItem.name, item.type, item.name);
        item['disabled'] = !disabled;
        return item;
      },
    );
    // 根据目标表单字段类型，筛选操作符
    operateOperatorOptions.value[index] = operateOperatorOptions.value[index].map((item) => {
      if (targetItem.type !== ValueType.number) {
        if (item.value === 'plus' || item.value === 'minus') {
          item.disabled = true;
        }
      } else {
        item.disabled = false;
      }
      return item;
    });
  };

  /**
   * @description: 删除具体操作
   */
  const handleOperateDelete = (index: number) => {
    rule.value.operations.splice(index, 1);
    operateOperatorOptions.value.splice(index, 1);
    operateCurrentFormItems.value.splice(index, 1);
  };

  /**
   * @description: 提交
   */
  const handleSubmit = () => {
    businessFormRef.value.validate((validate) => {
      if (validate) {
        if (rule.value.operationType == 'insert') {
          if (
            rule.value.operations.length == 0 ||
            (rule.value.operations.length == 1 && isEmpty(rule.value.operations[0].target))
          ) {
            ElMessage.error('请添加操作内容');
            return;
          }
        } else if (rule.value.operationType == 'delete') {
          if (
            rule.value.filters.length == 0 ||
            (rule.value.filters.length == 1 && isEmpty(rule.value.filters[0].target))
          ) {
            ElMessage.error('请添加过滤条件');
            return;
          }
        } else {
          if (
            rule.value.operations.length == 0 ||
            (rule.value.operations.length == 1 && isEmpty(rule.value.operations[0].target)) ||
            rule.value.filters.length == 0 ||
            (rule.value.filters.length == 1 && isEmpty(rule.value.filters[0].target))
          ) {
            ElMessage.error('请添加过滤条件或具体操作');
            return;
          }
        }

        emits('submit', rule.value);
        ruleVisible.value = false;
      }
    });
  };

  /**
   * @description: 扁平化树形结构
   */
  const flatTreeNodes = (nodes: WorkComponent.FormTreeNode[]) => {
    return nodes.reduce((pre, cur) => {
      const cols = [...pre, cur];
      if (cur.children) {
        return [...cols, ...flatTreeNodes(cur.children)];
      } else {
        return cols;
      }
    }, [] as WorkComponent.FormTreeNode[]);
  };

  /**
   * @description: 获取目标表单选项
   * @return {*}
   */
  const getTargetForm = async (callback: () => void) => {
    await appFormTreeWithFormItemApi().then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        targetOptions.value = [];
        targetOptions.value = res.data.map((item) => {
          return { ...item, disabled: true };
        });
        // 扁平化树形结构
        flatTargetOptions.value = flatTreeNodes(targetOptions.value);
        callback();
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 初始化
   */
  const init = async (element?: WorkForm.BusinessRule) => {
    // 获取目标表单的下拉信息
    await getTargetForm(() => {
      if (element) {
        rule.value = { ...element };
        const targetItems = flatTargetOptions.value.find(
          (item) => item.value == rule.value.target.value,
        );
        if (targetItems && targetItems.formItems) {
          targetFormItems.value = dataFillOptionsByFormItems(targetItems.formItems, false);
        }
        if (isNotEmpty(rule.value.filters)) {
          rule.value.filters.forEach(() => {
            filterCurrentFormItems.value.push(JSON.parse(JSON.stringify(_formItems.value)));
            filterOperatorOptions.value.push(businessFilterOperators);
          });
        }
        if (isNotEmpty(rule.value.operations)) {
          rule.value.operations.forEach(() => {
            operateCurrentFormItems.value.push(JSON.parse(JSON.stringify(_formItems.value)));
            operateOperatorOptions.value.push(businessOperateOperators);
          });
        }
      } else {
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
          enable: true,
        };
      }
      ruleVisible.value = true;
    });
  };

  defineExpose({ init });
</script>
<style scoped lang="scss">
  .business-dialog {
    .dialog-tip {
      padding: 0px 30px 15px 30px;
      color: var(--el-text-color-secondary);
    }
    .dialog-filter {
      padding: 0px 30px 15px 30px;
    }
  }
</style>
