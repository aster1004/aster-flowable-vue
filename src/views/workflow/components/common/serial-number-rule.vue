<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-07 17:37:17
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\serial-number-rule.vue
 * @Description: 流水号规则
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    width="38%"
    title="配置规则"
    :close-on-click-modal="false"
    :lock-scroll="false"
    destroy-on-close
    style="min-width: 500px"
  >
    <div class="serial-number-container">
      <draggable
        class="serial-number-list"
        item-key="id"
        :list="rules"
        group="serialNumber"
        @start="serialDrag = true"
        @end="serialDrag = false"
        :options="{
          animation: 300,
          sort: true,
        }"
      >
        <template #item="{ element, index }">
          <div class="serial-number-item">
            <el-row>
              <el-col :span="2" class="!flex justify-start items-center">
                <i class="iconfont icon-tuozhuai !text-lg serial-number-icon"></i>
              </el-col>
              <el-col :span="20">
                <template v-if="element.type === 'control'">
                  <serial-number-popover
                    :ref="`controlRef${index}`"
                    v-model:rule="rules[index]"
                    :options="_controlOptions"
                  />
                </template>
                <template v-else-if="element.type === 'fixed'">
                  <el-input
                    v-model="element.value"
                    placeholder="请输入1-4个数字中英文或特殊字符"
                    class="custom-input"
                  >
                    <template #prepend>
                      <span> {{ element.name }} </span>
                    </template>
                    <template #append>
                      <el-button plain @click="clear(index)">
                        <i class="iconfont icon-close" style="font-size: 12px"></i>
                      </el-button>
                    </template>
                  </el-input>
                </template>
                <template v-else-if="element.type === 'datetime'">
                  <serial-number-popover
                    :ref="`datetimeRef${index}`"
                    v-model:rule="rules[index]"
                    :options="_datetimeOptions"
                  />
                </template>
                <template v-else>
                  <el-input v-model="element.value">
                    <template #prepend>
                      <span> {{ element.name }} </span>
                    </template>
                    <template #append>
                      <el-select v-model="element.isRest" style="width: 150px">
                        <el-option
                          v-for="(item, index) in [true, false]"
                          :key="index"
                          :label="item ? '按年重置' : '不重置'"
                          :value="item"
                        />
                      </el-select>
                    </template>
                  </el-input>
                </template>
              </el-col>
              <el-col :span="2" class="!flex justify-end items-center">
                <i class="iconfont icon-shanchu !text-sm" @click="handleRemove(index)"></i>
              </el-col>
            </el-row>
          </div>
        </template>
      </draggable>

      <el-dropdown trigger="click" @command="handleCommand" class="pt-5px">
        <el-button plain> 新增 <i class="iconfont icon-xiangxia pl-5px"></i> </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="control">表单控件</el-dropdown-item>
            <el-dropdown-item command="fixed">固定字符</el-dropdown-item>
            <el-dropdown-item command="datetime">提交日期</el-dropdown-item>
            <el-dropdown-item command="increment">自增位数</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="serial-number-display">
      <span>流水号预览：</span>
      <span> {{ _serialNumber }} </span>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { flatFormItemsExclude, generateFieldId } from '@/utils/workflow';
  import moment from 'moment';
  import { computed, ref } from 'vue';
  import draggable from 'vuedraggable';
  import { ValueType } from '../component-config-export';
  import SerialNumberPopover from './serial-number-popover.vue';

  const emits = defineEmits(['saveRules']);

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 是否显示
  const visible = ref(false);
  // 拖拽
  const serialDrag = ref<boolean>(false);
  // 规则列表
  const rules = ref<WorkComponent.SerialNumberRule[]>([]);
  // 规则配置列表
  const ruleConfigs = [
    { type: 'control', name: '表单控件', value: '' },
    { type: 'fixed', name: '固定字符', value: '' },
    { type: 'datetime', name: '提交日期', value: 'YYYY' },
    { type: 'increment', name: '自增位数', value: 4, isRest: false },
  ];
  // 日期选项
  const _datetimeOptions = [
    { label: '年', value: 'YYYY' },
    { label: '年月', value: 'YYYYMM' },
    { label: '年月日', value: 'YYYYMMDD' },
  ];

  /**
   * @description: 处理指令事件
   * @param {*} command 菜单指令
   * @return {*}
   */
  const handleCommand = (command: string) => {
    const rule = ruleConfigs.find((r) => r.type === command);
    if (rule) {
      const ruleId = generateFieldId('rule');
      rules.value.push({ id: ruleId, ...rule });
    }
  };

  /**
   * @description: 清空
   * @param {*} index
   * @return {*}
   */
  const clear = (index: number) => {
    rules.value[index].value = '';
  };

  /**
   * @description: 初始化
   * @param {*} val 已配置的规则
   * @return {*}
   */
  const init = (val: WorkComponent.SerialNumberRule[]) => {
    rules.value = JSON.parse(JSON.stringify(val));
    visible.value = true;
  };

  // 表单控件
  const _controlOptions = computed(() => {
    return flatFormItemsExclude(workFlowStore.design.formItems)
      .filter((item) => {
        return (
          item.valueType != ValueType.array &&
          item.valueType != ValueType.object &&
          item.name != 'SerialNumber'
        );
      })
      .map((item) => {
        return {
          label: item.title,
          value: item.id,
        };
      });
  });

  // 移除
  const handleRemove = (index: number) => {
    rules.value.splice(index, 1);
  };

  // 流水号预览
  const _serialNumber = computed(() => {
    let serialNumber = '';
    rules.value.forEach((rule) => {
      if (rule.type === 'control') {
        const item = workFlowStore.design.formItems.find((item) => item.id === rule.value);
        if (item) {
          serialNumber += item.title + '(值)';
        }
      } else if (rule.type === 'fixed') {
        serialNumber += rule.value;
      } else if (rule.type === 'datetime') {
        serialNumber += moment().format(rule.value);
      } else {
        serialNumber += '1'.padStart(rule.value, '0');
      }
    });
    return serialNumber;
  });

  /**
   * @description: 保存
   * @return {*}
   */
  const handleSubmit = () => {
    emits('saveRules', rules.value, _serialNumber.value);
    visible.value = false;
  };

  defineExpose({
    init,
  });
</script>
<style scoped lang="scss">
  .serial-number-container {
    height: 250px;
    padding: 0 15px;
    overflow-y: auto;

    .serial-number-list {
      width: 100%;
      .serial-number-item {
        padding-bottom: 3px;
        color: var(--el-text-color-primary);
      }

      .serial-number-icon {
        color: var(--el-color-primary);
      }
    }
  }

  .serial-number-display {
    margin-top: 20px;
    padding: 10px 15px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #f3f3f3;
  }

  .custom-input {
    ::v-deep(.el-input-group__append, .el-input-group__prepend) {
      align-items: center;
      background-color: #fff;
      border-radius: 0;
      border-top-right-radius: var(--el-input-border-radius);
      border-bottom-right-radius: var(--el-input-border-radius);
      color: var(--el-color-info);
      display: inline-flex;
      justify-content: center;
      min-height: 100%;
      padding: 0 10px;
      position: relative;
      white-space: nowrap;
    }
  }
</style>
