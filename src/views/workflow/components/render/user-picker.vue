<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 18:13:48
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\user-picker.vue
 * @Description: 用户
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-form-item
    v-if="!_hidden"
    :prop="formItemProp"
    :label-width="labelWidth"
    :show-message="showMessage"
  >
    <template #label>
      <span v-show="showLabel">{{ formItem.title }}</span>
    </template>

    <el-select v-if="mode === 'design'" v-model="selectedUsers" placeholder="请选择" disabled />
    <el-select
      v-else-if="mode == 'form'"
      v-model="_value"
      multiple
      placeholder="请选择"
      :disabled="formItem.props.readonly"
      @click="handleAdd"
    >
      <el-option
        v-for="(item, index) in selectedUsers"
        :key="index"
        :label="item.username"
        :value="item.id"
      />
    </el-select>
    <el-select
      v-else-if="mode == 'search'"
      v-model="_value"
      multiple
      placeholder="请选择"
      :disabled="formItem.props.readonly"
      @click="handleAdd"
    >
      <el-option
        v-for="(item, index) in selectedUsers"
        :key="index"
        :label="item.username"
        :value="item.id"
      />
    </el-select>
    <span v-else>
      {{ _names }}
    </span>
    <user-org-picker
      ref="userDeptPickerRef"
      type="user"
      title="选择人员"
      :form-item="formItem"
      @success="handleSuccess"
    />
  </el-form-item>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType, ref, watchEffect } from 'vue';
  import mittBus from '@/utils/mittBus';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';
  import { selectUsersByIdsApi } from '@/api/sys/user';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isNotEmpty } from '@/utils';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search' | 'table'>,
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
    tableId: {
      type: String,
      default: '',
    },
    tableIndex: {
      type: Number,
      default: 0,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
  });

  // 选人选部门组件
  const userDeptPickerRef = ref();
  // 已选择的人员
  const selectedUsers = ref<User.UserInfo[]>([]);

  /**
   * @description: 选人选部门组件初始化
   * @return {*}
   */
  const handleAdd = () => {
    userDeptPickerRef.value.init(selectedUsers.value);
  };

  /**
   * @description: 选人选部门组件回调
   * @param {*} val 选中人员
   * @return {*}
   */
  const handleSuccess = (val: User.UserInfo[]) => {
    selectedUsers.value = [];
    const userIds = ref<string[]>([]);
    if (val.length > 0) {
      val.forEach((item: User.UserInfo) => {
        selectedUsers.value.push(item);
        item.id && userIds.value.push(item.id);
      });
    }
    _value.value = userIds.value;
  };

  /**
   * @description: 批量获取用户信息
   * @param {*} ids
   * @return {*}
   */
  const selectUsersByIds = (ids: string[]) => {
    if (isNotEmpty(ids)) {
      selectUsersByIdsApi(ids).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          selectedUsers.value = [];
          const data = res.data;
          data.forEach((item: User.UserInfo) => {
            selectedUsers.value.push(item);
          });
        }
      });
    } else {
      selectedUsers.value = [];
    }
  };

  // 键
  const formItemProp = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return props.tableId + '.' + props.tableIndex + '.' + props.formItem.id;
    } else {
      return props.formItem.id;
    }
  });

  // 标签长度
  const labelWidth = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return '12px';
    } else {
      return '';
    }
  });

  // 是否显示校验信息
  const showMessage = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return false;
    } else {
      return true;
    }
  });

  /**
   * @description: 组件值
   */
  const _value = computed({
    get() {
      return props.value;
    },
    set(val) {
      emit('update:value', val);
    },
  });

  /**
   * @description: 已选中用户的名称
   */
  const _names = computed(() => {
    console.log('------------------');
    console.log(selectedUsers.value);
    if (isNotEmpty(selectedUsers.value)) {
      return selectedUsers.value
        .map((item: User.UserInfo) => {
          return item.realName;
        })
        .join(',');
    }
    return '';
  });

  /**
   * @description: 监听_value值变化
   */
  watchEffect(() => {
    selectUsersByIds(_value.value);
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
<style scoped lang="scss"></style>
