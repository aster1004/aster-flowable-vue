<template>
  <div class="permission-container">
    <el-table :data="_value" style="width: 100%">
      <el-table-column prop="title" label="属性" />
      <el-table-column prop="edit" label="编辑" header-align="center" align="center">
        <template #header>
          <el-checkbox label="编辑" v-model="headerConfig.edit" @change="checkedAll('edit')" />
        </template>
        <template #default="scope">
          <el-checkbox-group v-model="scope.row.operation">
            <el-checkbox value="edit" @change="changeOperation(scope.row)" />
          </el-checkbox-group>
        </template>
      </el-table-column>
      <el-table-column prop="readonly" label="只读" header-align="center" align="center">
        <template #header>
          <el-checkbox
            label="只读"
            v-model="headerConfig.readonly"
            @change="checkedAll('readonly')"
          />
        </template>
        <template #default="scope">
          <el-checkbox-group v-model="scope.row.operation">
            <el-checkbox value="readonly" @change="changeOperation(scope.row)" />
          </el-checkbox-group>
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="隐藏" header-align="center" align="center">
        <template #header>
          <el-checkbox label="隐藏" v-model="headerConfig.hidden" @change="checkedAll('hidden')" />
        </template>
        <template #default="scope">
          <el-checkbox-group v-model="scope.row.operation">
            <el-checkbox value="hidden" @change="changeOperation(scope.row)" />
          </el-checkbox-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
  import { computed, onMounted } from 'vue';

  const emits = defineEmits(['update:value']);

  const props = defineProps({
    headerConfig: {
      type: Object,
      default: () => {
        return [];
      },
    },
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

  const changeOperation = (field: any) => {
    console.info(field);
    if (field.operation.length > 1) {
      field.operation = [field.operation[field.operation.length - 1]];
    }
  };

  /**
   * 选中所有
   */
  const checkedAll = (field: string) => {
    let headerConfig = props.headerConfig;
    for (let key in headerConfig) {
      // console.info('key：', key);
      if (headerConfig[field]) {
        if (key !== field) {
          headerConfig[key] = false;
        }
      }
    }
    _value.value.forEach((formField: any) => {
      formField.operation = headerConfig[field] ? [field] : [];
    });
  };

  onMounted(() => {});

  defineExpose({});
</script>
<style lang="scss">
  .permission-container {
    width: 100%;
  }
</style>
