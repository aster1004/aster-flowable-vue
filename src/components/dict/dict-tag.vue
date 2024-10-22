<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-17 14:53:30
 * @FilePath: \aster-flowable-vue\src\components\dict\dict-tag.vue
 * @Description: 字典标签
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="dict-tag">
    <template v-for="(item, index) in dataList">
      <template v-if="values.includes(item.dictValue)">
        <el-tag
          v-if="tagValues.includes(item.labelClass)"
          :disable-transitions="true"
          :key="item.dictValue"
          :index="index"
          :type="item.labelClass"
          :size="size"
        >
          {{ item.dictLabel }}
        </el-tag>
        <span v-else :key="item.value" :index="index">
          {{ item.dictLabel }}
        </span>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, PropType, ref } from 'vue';
  import { useAppStore } from '@/stores/modules/app';
  import { getDictDataList } from '@/utils';

  const appStore = useAppStore();

  const props = defineProps({
    dictType: {
      type: String,
      required: true,
    },
    value: [Number, String],
    size: {
      type: String as PropType<'large' | 'default' | 'small'>,
      default: 'default',
    },
  });

  const tagValues = ref<string[]>(['primary', 'success', 'info', 'warning', 'danger']);

  const values = computed(() => {
    if (props.value !== null && typeof props.value !== 'undefined') {
      return [String(props.value)];
    } else {
      return [];
    }
  });

  const dataList = getDictDataList(appStore.dictList, props.dictType);
</script>
<style lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .dict-tag {
    display: inline-block;
    padding: 0 3px;
  }
</style>
