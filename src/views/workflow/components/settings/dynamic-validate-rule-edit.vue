<template>
  <el-dialog
    v-model="ruleVisible"
    width="60%"
    title="动态校验规则配置"
    :close-on-click-modal="false"
    :lock-scroll="false"
    class="business-dialog"
  >
    <div class="dialog-tip">
      <p> "流程启动时"是指表单提交时就触发，"流程审批时"是指流程审批提交时触发。 </p>
    </div>
    <el-form
      :model="rule"
      ref="dynamicValidateFormRef"
      label-width="100px"
      :rules="dynamicValidateFormRules"
    >
      <el-form-item label="触发事件" prop="event">
        <el-select v-model="rule.event" placeholder="请选择触发事件" @change="handleEventChange">
          <el-option
            v-for="item in dynamicValidateEventOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提示信息" prop="prompt">
        <el-input v-model="rule.prompt" placeholder="请输入提示信息" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="rule.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="关联表单" prop="associationForm">
        <el-select
          v-model="rule.associationForm"
          placeholder="请选择关联表单"
          @change="handleAssociationFormChange"
        >
          <el-option
            v-for="(item, index) in _associationFormFields"
            :key="index"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <div class="dialog-tip">
        <p> 添加校验条件, 用于全局表单校验, 校验结果为true时表单不允许提交。</p>
      </div>
      <div class="dialog-tip">
        <el-button type="primary" link @click="handleAddFilter">
          <i class="iconfont icon-plus p-5px"></i> 添加校验条件
        </el-button>
      </div>
      <div class="dialog-filter">
        <el-row
          class="filter-row"
          :gutter="10"
          v-for="(filterItem, index) in rule.filters"
          :key="index"
        >
          <el-col :span="4">
            <el-select v-model="filterItem.judge" placeholder="逻辑">
              <el-option
                v-for="(judgeItem, index) in dynamicValidateJudgeOptions"
                :label="judgeItem.label"
                :value="judgeItem.value"
                :key="index"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="filterItem.selfField"
              placeholder="当前表单属性"
              @change="handleSelfChange($event, index)"
            >
              <el-option
                :label="fieldItem.title"
                :value="fieldItem.id"
                v-for="(fieldItem, index) in _currentFormFields"
                :key="index"
              />
            </el-select>
          </el-col>
          <el-col :span="1">
            <div class="text-box"> 值 </div>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="filterItem.equation"
              placeholder="比较符号"
              @change="handleEquationChange($event, index)"
            >
              <el-option
                v-for="(optionItem, index) in filterItem.equationOptions"
                :label="optionItem.label"
                :value="optionItem.value"
                :key="index"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="filterItem.targetField"
              placeholder="目标表单属性"
              @change="handleTargetOperateChange($event, index)"
            >
              <el-option
                :label="targetItem.label"
                :value="targetItem.value"
                v-for="(targetItem, index) in filterItem.targetOptions"
                :key="index"
              />
            </el-select>
          </el-col>
          <el-col :span="1">
            <div class="w-full h-full flex items-center justify-center">
              <i class="iconfont icon-shanchu" @click="handleOperateDelete(index)"></i>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="ruleVisible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { isEmpty } from '@/utils';
  import { flatFormItems } from '@/utils/workflow';
  import { formInfoByCodeApi } from '@/api/workflow/form';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { computed, ref } from 'vue';
  import { ValueType } from '../component-config-export';
  import {
    dynamicValidateEventOptions,
    dynamicValidateJudgeOptions,
    businessStringFilterOperators,
    businessFilterOperators,
  } from '@/enums/workFlowEnum';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 回调方法
  const emits = defineEmits(['submit']);
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 弹窗显示
  const ruleVisible = ref(false);
  // 表单数据对象
  const dynamicValidateFormRef = ref();
  // 目标表单的表单项
  const targetFormItems = ref<WorkComponent.ComponentConfig[]>([]);
  // 业务规则
  const rule = ref<WorkForm.DynamicValidateRule>({
    id: '',
    // 触发事件
    event: '',
    // 触发事件文本
    eventText: '',
    // 过滤条件
    filters: [],
    // 是否启用
    enable: true,
    // 提示信息
    prompt: '',
    // 备注
    remark: '',
    // 关联表单
    associationForm: '',
    // 关联表单文本
    associationFormText: '',
    // 关联表单表名
    formCode: '',
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
  const dynamicValidateFormRules = ref({
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
    prompt: [
      {
        required: true,
        message: '请输入提示信息',
        trigger: 'blur',
      },
    ],
    associationForm: [
      {
        required: true,
        message: '请选择关联表单',
        trigger: 'blur',
      },
    ],
  });

  // 选择动态当前表单所支持的组件类型
  const formField = ref([
    'InputText',
    'InputTextarea',
    'InputNumber',
    'InputAmount',
    'SelectSingle',
    'SerialNumber',
  ]);

  // 当前表单属性
  const _currentFormFields = computed(() => {
    const items = flatFormItems(workFlowStore.design.formItems);
    return items.filter((item: any) => {
      return formField.value.indexOf(item.name) !== -1;
    });
  });

  // 关联表单属性
  const _associationFormFields = computed(() => {
    const items = flatFormItems(workFlowStore.design.formItems);
    return items.filter((item: any) => {
      return item.name == 'AssociatedForm';
    });
  });

  /**
   * 选择关联表单
   * @param value
   */
  const handleAssociationFormChange = async (value: any) => {
    // 获取所有的表单字段数据
    const fieldItems = flatFormItems(workFlowStore.design.formItems);
    // 获取所选当前表单的字段对象
    let fieldFilterItem = fieldItems.filter((item: any) => {
      return value == item.id;
    });
    console.info(fieldFilterItem);
    rule.value.filters.forEach((filterItem: any, index: number) => {
      filterItem.targetField = '';
    });
    let associationForm = fieldFilterItem[0];
    rule.value.associationFormText = associationForm.title;
    rule.value.formCode = associationForm.props.formCode[1];
    // 查询表单字段项
    await getAssociatedFormInfo(associationForm.props.formCode[1]);
  };

  /**
   * 选择当前表单属性
   * @param option 当前表单fieldId
   * @param index 所在行的索引
   */
  const handleSelfChange = (option: WorkComponent.DataFillOption, index: number) => {
    // 获取当前行数据
    let filterItem = rule.value.filters[index];
    filterItem.equation = '';
    filterItem.equationText = '';
    filterItem.targetField = '';
    filterItem.targetFieldText = '';
    // 获取所有的表单字段数据
    const fieldItems = _currentFormFields.value;
    // 获取所选当前表单的字段对象
    let fieldFilterItem = fieldItems.filter((item: any) => {
      return option == item.id;
    });
    if (isEmpty(fieldFilterItem)) {
      filterItem.equationOptions = [];
    } else {
      let fieldItem = fieldFilterItem[0];
      // 当前表单字段文本名称
      filterItem.selfFieldText = fieldItem['title'];
      if (fieldItem['valueType'] == ValueType.number) {
        // 处理计算符号
        filterItem.equationOptions = businessFilterOperators;
        // 处理目标表单的下拉数据
        filterItem.targetOptions = targetFormItems.value
          .filter((item: any) => {
            return item.valueType == ValueType.number;
          })
          .map((item: any) => {
            return { label: item.title, value: item.id };
          });
      } else if (fieldItem['valueType'] == ValueType.string) {
        // 处理计算符号
        filterItem.equationOptions = businessStringFilterOperators;
        // 处理目标表单的下拉数据
        filterItem.targetOptions = targetFormItems.value
          .filter((item: any) => {
            return item.valueType == ValueType.string;
          })
          .map((item: any) => {
            return { label: item.title, value: item.id };
          });
      }
    }
  };

  /**
   * 选择目标表单属性
   * @param val
   * @param index
   */
  const handleTargetOperateChange = (val: any, index: number) => {
    // 获取当前行数据
    let filterItem = rule.value.filters[index];
    // 获取所有的表单字段数据
    const fieldItems = filterItem.targetOptions;
    // 获取所选当前表单的字段对象
    let fieldFilterItem = fieldItems.filter((item: any) => {
      return val == item.value;
    });
    if (isEmpty(fieldFilterItem)) {
      filterItem.targetFieldText = '';
    } else {
      filterItem.targetFieldText = fieldFilterItem[0]['label'];
    }
  };

  /**
   * 处理修改比较符
   * @param val
   * @param index
   */
  const handleEquationChange = (val: any, index: number) => {
    // 获取当前行数据
    let filterItem = rule.value.filters[index];
    // 获取比较符号的选项数据
    let equationOptions = filterItem.equationOptions;
    let equationItems = equationOptions.filter((item: any) => {
      return val == item.value;
    });
    if (isEmpty(equationItems)) {
      filterItem.equationText = '';
    } else {
      filterItem.equationText = equationItems[0]['label'];
    }
  };

  /**
   * 处理修改触发事件
   * @param val
   */
  const handleEventChange = (val: string) => {
    let events = dynamicValidateEventOptions.filter((item: any) => {
      return val == item.value;
    });
    if (!isEmpty(events)) {
      rule.value.eventText = events[0]['label'];
    }
  };

  /**
   * @description: 获取关联表单信息
   * @return {*}
   */
  const getAssociatedFormInfo = async (code: string) => {
    let filters = rule.value.filters;
    filters.forEach((filterItem: any) => {
      filterItem.targetOptions = [];
    });
    await formInfoByCodeApi(code).then(async (res) => {
      if (res.code == ResultEnum.SUCCESS) {
        targetFormItems.value = res.data.formItems;
      }
    });
  };

  /**
   * @description: 添加过滤条件
   */
  const handleAddFilter = () => {
    rule.value.filters.push({
      selfField: '',
      selfFieldText: '',
      targetField: '',
      targetFieldText: '',
      judge: '',
      equation: '',
      equationText: '',
      equationOptions: [],
      targetOptions: [],
    });
  };

  /**
   * @description: 删除具体操作
   */
  const handleOperateDelete = (index: number) => {
    ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(async () => {
        rule.value.filters.splice(index, 1);
      })
      .catch(() => {});
  };

  /**
   * @description: 提交
   */
  const handleSubmit = () => {
    dynamicValidateFormRef.value.validate((validate: boolean) => {
      if (validate) {
        if (isEmpty(rule.value.filters)) {
          ElMessage.error('请添加过滤条件');
          return false;
        }
        let filters = rule.value.filters as any[];
        // 使用 some 方法进行验证
        const hasError = filters.some((filterItem: any) => {
          if (isEmpty(filterItem.selfField)) {
            ElMessage.error('当前表单属性不能为空');
            return true;
          }
          if (isEmpty(filterItem.equation)) {
            ElMessage.error('比较符号不能为空');
            return true;
          }
          if (isEmpty(filterItem.targetField)) {
            ElMessage.error('目标表单属性不能为空');
            return true;
          }
          return false;
        });

        if (hasError) {
          return;
        }
        emits('submit', rule.value);
        ruleVisible.value = false;
      }
    });
  };

  /**
   * @description: 初始化
   */
  const init = async (element?: WorkForm.DynamicValidateRule) => {
    ruleVisible.value = true;
    if (element) {
      // 查询关联表单信息
      await handleAssociationFormChange(element.associationForm);
      rule.value = { ...element };
    } else {
      rule.value = {
        id: '',
        // 触发事件
        event: '',
        // 触发事件文本
        eventText: '',
        // 过滤条件
        filters: [],
        // 是否启用
        enable: true,
        // 提示信息
        prompt: '',
        // 备注
        remark: '',
        // 关联表单
        associationForm: '',
        // 关联表单文本
        associationFormText: '',
        // 关联表单表名
        formCode: '',
      };
    }
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

  .text-box {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon-shanchu:hover {
    color: $primary-color;
    cursor: pointer;
  }

  .filter-row {
    margin-bottom: 10px;
  }

  .el-overlay {
    z-index: 1999 !important;
  }
</style>
