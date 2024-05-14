<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 14:53:19
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\select-config.vue
 * @Description: 单选框/复选框 公共配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="select-config">
    <el-form-item label="选项配置">
      <el-tabs v-model="_formItem.props.type" type="border-card" class="select-tabs">
        <el-tab-pane label="静态" name="static">
          <draggable
            :list="_formItem.props.options"
            item-key=""
            group="option"
            handler=".select-icon"
            :options="{ animation: 300, sort: true }"
          >
            <template #item="{ index }">
              <div class="select-option">
                <i class="select-icon iconfont icon-tuozhuai"></i>
                <el-input v-model="_formItem.props.options[index]">
                  <template #append>
                    <el-button text @click="removeOption(index)">
                      <i class="iconfont icon-shanchu"></i>
                    </el-button>
                  </template>
                </el-input>
              </div>
            </template>
          </draggable>
          <div class="select-option">
            <el-button text type="primary" @click="addOption">添加选项</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="字典" name="dict">
          <el-select
            v-model="_formItem.props.dictType"
            placeholder="请选择字典"
            style="width: 100%"
          >
            <el-option
              v-for="item in _dictList"
              :key="item.id"
              :label="item.dictName"
              :value="item.dictType"
            />
          </el-select>
        </el-tab-pane>
        <el-tab-pane label="动态" name="dynamic">
          <!-- TODO select选项动态 -->
        </el-tab-pane>
      </el-tabs>
    </el-form-item>
    <el-form-item label="是否展开">
      <el-switch v-model="_formItem.props.expand" />
    </el-form-item>
    <el-form-item label="必填项">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { useAppStore } from '@/stores/modules/app';
  import { computed, PropType } from 'vue';
  import draggable from 'vuedraggable';

  const emits = defineEmits(['update:formItem']);
  const props = defineProps({
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: () => {},
    },
  });

  // 字典
  const appStore = useAppStore();

  /**
   * @description: 添加选项
   * @return {*}
   */
  const addOption = () => {
    const len = props.formItem.props.options.length + 1;
    props.formItem.props.options.push('选项' + len);
  };

  /**
   * @description: 删除选项
   * @param {number} index 下标
   * @return {*}
   */
  const removeOption = (index: number) => {
    props.formItem.props.options.splice(index, 1);
  };

  // 当前组件
  const _formItem = computed({
    get() {
      return props.formItem;
    },
    set(val) {
      emits('update:formItem', val);
    },
  });

  // 字典列表
  const _dictList = computed(() => {
    return appStore.dictList;
  });
</script>
<style scoped lang="scss">
  .select-config {
    .select-tabs {
      width: 100%;
    }
    .select-option {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 3px;
      color: #afadad;
    }

    .select-icon {
      padding: 3px;
      font-size: 20px !important;
    }
  }
</style>
