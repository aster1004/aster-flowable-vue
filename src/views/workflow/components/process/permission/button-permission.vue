<template>
  <div class="button-container">
    <el-table :data="_value" :show-header="false" :stripe="true" :border="true" style="width: 100%">
      <el-table-column prop="operation" label="操作按钮" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            inline-prompt
            active-text="开启"
            inactive-text="关闭"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';

  const emits = defineEmits(['update:value']);

  const props = defineProps({
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
  });

  const _value = computed({
    get() {
      return props.value;
    },
    set(value) {
      emits('update:value', value);
    },
  });
</script>
<style lang="scss">
  .button-container {
    width: 100%;
  }
</style>
