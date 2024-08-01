<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-28 15:55:37
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\data-fill.vue
 * @Description: 数据填充规则
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    width="60%"
    :close-on-click-modal="false"
    :lock-scroll="false"
    destroy-on-close
  >
    <template #header="{ titleId, titleClass }">
      <span :id="titleId" :class="titleClass">数据填充规则</span>
      <span style="font-size: 12px; color: #bbb">
        (通过规则的设定，可实现关联流程的数据回显至当前流程的表单中)
      </span>
    </template>

    <div class="fill-content">
      <div>
        <el-row v-for="(item, index) in dataFills" :key="index" class="fill-content__item">
          <el-col :span="3" class="fill-content__item__col justify-start"> 将关联表单的 </el-col>
          <el-col :span="8" class="fill-content__item__col justify-center">
            <el-select
              v-model="item.associatedFieldId"
              placeholder="选择关联表单字段"
              @change="handleAssociatedChange($event)"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in associatedOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="fill-content__item__col justify-center"> 的值填充到 </el-col>
          <el-col :span="8" class="fill-content__item__col justify-center">
            <el-select
              v-model="item.currentFieldId"
              placeholder="选择当前表单字段"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in currentOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
          <el-col :span="1" class="fill-content__item__col justify-end">
            <i class="iconfont icon-shanchu" @click="deleteRule(index)"></i>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-button type="primary" link @click="addRule()">
          <i class="iconfont icon-plus pr-5px"></i>添加规则
        </el-button>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="onSubmit">{{ $t('button.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { dataFillOptionsByFormItems, filterDataFillOptionsFilter } from '@/utils/workflow';

  const emits = defineEmits(['updateDataFill']);

  // 是否显示
  const visible = ref(false);
  // 当前表单的选项
  const currentOptions = ref<WorkComponent.DataFillOption[]>([]);
  // 关联表单的表单选项
  const associatedOptions = ref<WorkComponent.DataFillOption[]>([]);
  // 关联规则
  const dataFills = ref<WorkComponent.DataFillModel[]>([]);

  /**
   * @description: 初始化
   * @param {WorkComponent.DataFillModel[]} currentDataFill 当前表单的关联规则
   * @param {WorkComponent.ComponentConfig[]} currentItems 当前表单的表单项
   * @param {WorkComponent.ComponentConfig[]} associatedItems 关联表单的表单项
   * @return {*}
   */
  const init = (
    currentDataFill: WorkComponent.DataFillModel[],
    currentItems: WorkComponent.ComponentConfig[],
    associatedItems: WorkComponent.ComponentConfig[],
  ) => {
    dataFills.value = [];
    if (currentDataFill.length == 0) {
      addRule();
    } else {
      dataFills.value = currentDataFill;
    }
    currentOptions.value = dataFillOptionsByFormItems(currentItems, true);
    associatedOptions.value = dataFillOptionsByFormItems(associatedItems, false);
    visible.value = true;
  };

  /**
   * @description: 添加规则
   * @return {*}
   */
  const addRule = () => {
    dataFills.value.push({
      currentFieldId: '',
      associatedFieldId: '',
    });
  };

  /**
   * @description: 删除规则
   * @param {number} index 下标
   * @return {*}
   */
  const deleteRule = (index: number) => {
    dataFills.value.splice(index, 1);
  };

  /**
   * @description: 关联表单字段改变
   * @param {string} e 关联表单字段的值
   * @return {*}
   */
  const handleAssociatedChange = (e: string) => {
    const associatedItem = associatedOptions.value.find((item) => item.value == e);
    if (associatedItem == undefined) {
      return;
    }
    // 根据关联表单字段的类型，筛选可填充的当前表单字段
    currentOptions.value = currentOptions.value.map((item: WorkComponent.DataFillOption) => {
      const disabled = filterDataFillOptionsFilter(
        associatedItem.type,
        associatedItem.name,
        item.type,
        item.name,
      );
      item['disabled'] = !disabled;
      return item;
    });
  };

  const onSubmit = () => {
    visible.value = false;
    emits('updateDataFill', dataFills.value);
  };

  defineExpose({
    init,
  });
</script>
<style scoped lang="scss">
  .fill-content {
    width: 100%;

    &__title {
      display: flex;

      i {
        padding: 0 5px;
      }
    }

    &__item {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 10px;

      &__col {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
