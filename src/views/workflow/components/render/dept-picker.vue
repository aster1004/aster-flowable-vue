<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 18:15:03
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\dept-picker.vue
 * @Description: 部门
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="mode === 'design'">
    <el-form-item :label="formItem.title" :prop="formItem.id" v-if="!_hidden">
      <div class="add-dept-wrapper">
        <el-button class="add-dept-icon" type="primary" plain round :icon="User">
          <Plus style="width: 1em; height: 1em" />
        </el-button>
      </div>
      <span class="placeholder">{{ formItem.props.placeholder }}</span>
    </el-form-item>
  </div>
  <div v-else-if="mode == 'form'">
    <el-form-item :label="formItem.title" :prop="formItem.id" v-if="!_hidden">
      <div class="add-dept-wrapper">
        <el-button class="add-dept-icon" type="primary" plain round :icon="User" @click="handleAdd">
          <Plus style="width: 1em; height: 1em" />
        </el-button>
        <el-tag
          class="add-dept-item"
          v-for="(item, index) in selectedDepts"
          :key="item"
          closable
          hit
          @close="handleRemove(index)"
        >
          {{ item.orgName }}
        </el-tag>
        <span v-if="_value?.length == 0" class="placeholder">{{ formItem.props.placeholder }}</span>
      </div>
    </el-form-item>
    <user-org-picker
      ref="userDeptPickerRef"
      type="dept"
      title="选择部门"
      :form-item="formItem"
      @success="handleSuccess"
    />
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType, ref } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { User, Plus } from '@element-plus/icons-vue';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isNotEmpty } from '@/utils';
  import { selectDeptsByIdsApi } from '@/api/sys/dept';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search'>,
      default: 'design',
    },
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: {},
    },
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: {},
    },
  });

  // 选人选部门组件
  const userDeptPickerRef = ref();
  // 已选择的部门
  const selectedDepts = ref<Dept.DeptInfo[]>([]);

  /**
   * @description: 选人选部门组件初始化
   * @return {*}
   */
  const handleAdd = () => {
    userDeptPickerRef.value.init(selectedDepts.value);
  };

  /**
   * @description: 移除部门
   * @param {*} index 下标
   * @return {*}
   */
  const handleRemove = (index: number) => {
    _value.value.splice(index, 1);
    selectedDepts.value.splice(index, 1);
  };

  /**
   * @description: 添加部门
   * @return {*}
   */
  const handleSuccess = (val: Dept.DeptInfo[]) => {
    selectedDepts.value = [];
    const deptIds = ref<string[]>([]);
    if (val.length > 0) {
      val.forEach((item: Dept.DeptInfo) => {
        selectedDepts.value.push(item);
        item.id && deptIds.value.push(item.id);
      });
    }
    _value.value = deptIds.value;
  };

  /**
   * @description: 根据id查询部门信息
   * @param {*} ids 部门id集合
   * @return {*}
   */
  const selectDeptsByIds = (ids: string[]) => {
    if (isNotEmpty(ids)) {
      selectDeptsByIdsApi(ids).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          const data = res.data;
          data.forEach((item: Dept.DeptInfo) => {
            // 通过id判断selectedDepts是否存在该记录，如不存在则push
            if (selectedDepts.value.some((val: Dept.DeptInfo) => val.id == item.id)) {
              return;
            }
            selectedDepts.value.push(item);
          });
        }
      });
    } else {
      selectedDepts.value = [];
    }
  };

  /**
   * @description: 组件值
   */
  const _value = computed({
    get() {
      selectDeptsByIds(props.value);
      return props.value;
    },
    set(val) {
      emit('update:value', val);
    },
  });

  /**
   * @description: 是否隐藏, true-隐藏
   */
  const _hidden = computed(() => {
    let r = false;
    if (props.formItem.props.hidden) {
      r = evaluateFormula(props.formItem.props.hidden, props.formData);
    }
    if (props.formItem.props.required) {
      // 调用form-render的方法
      mittBus.emit('changeFormRules', {
        hidden: r,
        fieldId: props.formItem.id,
        fieldName: props.formItem.title,
        trigger: 'blur',
      });
    }
    return r;
  });

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  .add-dept-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .add-dept-icon {
      display: flex;
      align-items: center;
      border-radius: 100px;
      border: 1px solid var(--el-color-primary);
      justify-content: center;
      cursor: pointer;
      margin: 2px 5px 4px;
    }
    .add-dept-item {
      display: flex;
      align-items: center;
      min-width: 70px;
      height: 32px;
      padding: 0 4px;
      margin: 2px 5px 4px;
    }
  }
  .placeholder {
    margin-left: 10px;
    color: #adabab;
    font-size: smaller;
  }
  ::v-deep(.el-form-item, .el-form-item--default) {
    margin-bottom: 0px;
  }
</style>
