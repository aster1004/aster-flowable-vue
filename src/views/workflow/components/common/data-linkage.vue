<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-07-26 15:42:28
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\data-linkage.vue
 * @Description: 默认值-数据联动
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    width="60%"
    style="min-width: 720px"
    :title="title"
    :close-on-click-modal="false"
    :lock-scroll="false"
    destroy-on-close
  >
    <el-form class="linkage" label-position="top">
      <el-form-item>
        <template #label>
          <div class="linkage-label">
            <span>联动目标表单</span>
          </div>
        </template>
        <el-cascader
          v-model="formCode"
          :options="treeNodes"
          :show-all-levels="false"
          clearable
          filterable
          placeholder="请选择关联表单"
          style="width: 100%"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="linkage-label">
            <span>联动条件</span>
            <span class="tip"> 当前表单输入的值等于目标表单的值时，执行联动填充 </span>
          </div>
        </template>
        <div style="width: 100%">
          <el-row
            class="flex justify-center items-center pb-10px"
            v-for="(item, index) in conditions"
            :key="index"
          >
            <el-col :span="10" class="flex items-center">
              <el-select
                v-model="item.currentFieldId"
                :placeholder="currentPlaceholder"
                style="width: 100%"
              >
                <el-option
                  v-for="option in currentOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                  :disabled="option.disabled"
                />
              </el-select>
            </el-col>
            <el-col :span="3" class="flex justify-center items-center"> 的值等于 </el-col>
            <el-col :span="10">
              <el-select
                v-model="item.associatedFieldId"
                :placeholder="associatedPlaceholder"
                style="width: 100%"
              >
                <el-option
                  v-for="option in associatedOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                  :disabled="option.disabled"
                />
              </el-select>
            </el-col>
            <el-col :span="1" class="flex items-center justify-end">
              <i class="iconfont icon-shanchu" @click="deleteCondition(index)"></i>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-button type="primary" link @click="addCondition()">
            <i class="iconfont icon-plus pr-5px"></i>添加规则
          </el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="linkage-label">
            <span>联动目标表单</span>
          </div>
        </template>
        <div style="width: 100%">
          <el-row>
            <el-col :span="10" class="flex items-center">
              <el-input :model-value="_formItem?.title" disabled style="width: 100%" />
            </el-col>
            <el-col :span="3" class="flex justify-center items-center">的值等于</el-col>
            <el-col :span="10" class="flex items-center">
              <el-select
                v-model="dataFill"
                :placeholder="associatedPlaceholder"
                style="width: 100%"
              >
                <el-option
                  v-for="option in fillOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                  :disabled="option.disabled"
                />
              </el-select>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="onSubmit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { appFormTreeApi } from '@/api/workflow/app';
  import { formInfoByCodeApi } from '@/api/workflow/form';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { isEmpty, isNotEmpty } from '@/utils';
  import { dataFillOptionsByFormItems, filterDataFillOptionsFilter } from '@/utils/workflow';
  import { ElMessage } from 'element-plus';
  import { computed, onBeforeMount, ref } from 'vue';

  defineProps({
    title: {
      type: String,
      default: '数据联动设置',
    },
    currentPlaceholder: {
      type: String,
      default: '当前表单控件',
    },
    associatedPlaceholder: {
      type: String,
      default: '联动表单控件',
    },
  });

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 显示弹窗
  const visible = ref(false);
  // 表单树
  const treeNodes = ref<WorkComponent.TreeNode[]>([]);
  // 联动表单信息
  const associatedFormInfo = ref<WorkForm.FormModel>();
  // 联动表单: [应用编码,表单编码]
  const formCode = ref<string[]>([]);
  // 联动条件
  const conditions = ref<WorkComponent.DataFillModel[]>([]);
  // 联动条件选项
  const associatedOptions = ref<WorkComponent.DataFillOption[]>([]);
  // 数据填充字段
  const dataFill = ref('');
  // 数据填充选项
  const fillOptions = ref<WorkComponent.DataFillOption[]>([]);

  /**
   * @description: 显示应用表单树
   * @return {*}
   */
  const getTreeData = () => {
    appFormTreeApi().then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        treeNodes.value = res.data;
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 获取联动表单信息
   * @return {*}
   */
  const getAssociatedFormInfo = async (code: string) => {
    await formInfoByCodeApi(code).then(async (res) => {
      if (res.code == ResultEnum.SUCCESS) {
        // 联动表单信息
        associatedFormInfo.value = res.data;
        // 联动表单项
        associatedOptions.value = dataFillOptionsByFormItems(res.data.formItems, false);
        // 可填充字段的表单项
        fillOptions.value = associatedOptions.value.map((item) => {
          let obj: WorkComponent.DataFillOption = { ...item };
          let disabled = true;
          if (_formItem.value) {
            disabled = filterDataFillOptionsFilter(
              obj.type,
              obj.name,
              _formItem.value.valueType,
              _formItem.value.name,
            );
          }
          obj['disabled'] = !disabled;
          return obj;
        });
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 级联选中值变化
   * @param {string[]} val 选中的值
   * @return {*}
   */
  const handleChange = async (val: string[]) => {
    // 清空条件
    conditions.value = [];
    addCondition();
    associatedOptions.value = [];
    // 清空填充
    dataFill.value = '';
    fillOptions.value = [];

    if (isNotEmpty(val) && val.length === 2) {
      await getAssociatedFormInfo(val[1]);
    }
  };

  /**
   * @description: 删除联动条件
   * @param {number} index 下标
   * @return {*}
   */
  const deleteCondition = (index: number) => {
    conditions.value.splice(index, 1);
  };

  /**
   * @description: 添加联动条件
   * @return {*}
   */
  const addCondition = () => {
    conditions.value.push({
      currentFieldId: '',
      associatedFieldId: '',
    });
  };

  /**
   * @description: 提交
   * @return {*}
   */
  const onSubmit = () => {
    // 校验
    if (isNotEmpty(dataFill.value)) {
      if (isEmpty(conditions.value)) {
        ElMessage.error('请选择联动条件');
      }
      if (conditions.value && conditions.value.length > 0) {
        let flag = false;
        conditions.value.forEach((item) => {
          if (isNotEmpty(item.currentFieldId) && isNotEmpty(item.associatedFieldId)) {
            flag = true;
          }
        });
        if (!flag) {
          ElMessage.error('请选择联动条件');
        }
      }
    }
    // 提交
    if (_formItem.value) {
      _formItem.value.props.default.linkage = {
        formCode: formCode.value,
        conditions: conditions.value,
        dataFill: dataFill.value,
      };
    }
    visible.value = false;
  };

  /**
   * @description: 初始化
   * @return {*}
   */
  const init = async () => {
    visible.value = true;
    if (_formItem.value) {
      const linkage = JSON.parse(JSON.stringify(_formItem.value.props.default.linkage));
      // 已选中的表单
      formCode.value = linkage.formCode;
      if (formCode.value && formCode.value.length == 2) {
        await getAssociatedFormInfo(formCode.value[1]);
      }
      // 联动条件
      conditions.value = linkage.conditions;
      if (conditions.value.length == 0) {
        addCondition();
      }
      // 联动填充
      dataFill.value = linkage.dataFill;
    }
  };

  // 当前表单的表单项
  const currentOptions = computed(() => {
    return dataFillOptionsByFormItems(workFlowStore.design.formItems, false).filter((item) => {
      return item.value != _formItem.value?.id;
    });
  });

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });

  onBeforeMount(() => {
    getTreeData();
  });

  defineExpose({
    init,
  });
</script>
<style scoped lang="scss">
  .linkage {
    width: 100%;

    .linkage-label {
      line-height: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;

      .tip {
        line-height: 20px;
        font-size: 12px;
        color: #c9ccd8;
      }
    }
  }
</style>
