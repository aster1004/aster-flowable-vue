<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 18:13:48
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\user-picker.vue
 * @Description: 用户
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="mode === 'design'">
    <el-form-item :label="formItem.title" :prop="formItem.id" v-if="!_hidden">
      <div class="add-user-wrapper">
        <el-button class="add-user-icon" type="primary" plain round :icon="User">
          <Plus style="width: 1em; height: 1em" />
        </el-button>
      </div>
      <span class="placeholder">{{ formItem.props.placeholder }}</span>
    </el-form-item>
  </div>
  <div v-else-if="mode == 'form'">
    <el-form-item :label="formItem.title" :prop="formItem.id" v-if="!_hidden">
      <div class="add-user-wrapper">
        <el-button class="add-user-icon" type="primary" plain round :icon="User" @click="handleAdd">
          <Plus style="width: 1em; height: 1em" />
        </el-button>
        <el-tag
          class="add-user-item"
          v-for="(item, index) in selectedUser"
          :key="item"
          closable
          hit
          @close="handleClose(index)"
        >
          {{ item.username }}
        </el-tag>
        <span v-if="_value?.length == 0" class="placeholder">{{ formItem.props.placeholder }}</span>
      </div>
    </el-form-item>
    <user-org-picker
      ref="userDeptPickerRef"
      type="user"
      title="选择人员"
      :form-item="formItem"
      @selectOk="selectOk"
    />
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType, watchEffect, watch, ref, isRef, nextTick } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { User, Plus } from '@element-plus/icons-vue';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';
  import { userSelectBatchIdsApi } from '@/api/sys/user';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isNotEmpty } from '@/utils';
  //选人选部门组件
  const userDeptPickerRef = ref();
  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Array,
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
  const selectedUser = ref<User.UserInfo[]>([]);
  const handleClose = (index: number) => {
    _value.value.splice(index, 1);
    selectedUser.value.splice(index, 1);
  };

  /**
   * @description: 组件值
   */
  const _value = computed({
    get() {
      selectUserInfoBatchIds(props.value);
      return props.value;
    },
    set(val) {
      emit('update:value', val);
    },
  });

  const selectOk = (val: User.UserInfo[]) => {
    selectedUser.value = [];
    const userIds = ref([]);
    if (val.length > 0) {
      val.forEach((item: User.UserInfo) => {
        selectedUser.value.push(item);
        userIds.value.push(item.id);
      });
    }
    _value.value = userIds.value;
  };
  /**
   * 通过ids批量获取用户信息
   * @param ids
   */
  const selectUserInfoBatchIds = (ids: string[]) => {
    if (isNotEmpty(ids)) {
      userSelectBatchIdsApi(ids).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          const data = res.data;
          data.forEach((item: User.UserInfo) => {
            // 通过id判断selectedUser是否存在该记录，如不存在则push
            if (selectedUser.value.some((val: User.UserInfo) => val.id == item.id)) {
              return;
            }
            selectedUser.value.push(item);
          });
        }
      });
    } else {
      selectedUser.value = [];
    }
  };
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

  /**
   * 选人选部门组件初始化
   */
  const handleAdd = () => {
    userDeptPickerRef.value.init(selectedUser.value);
  };
</script>
<style scoped lang="scss">
  .add-user-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .add-user-icon {
      display: flex;
      align-items: center;
      border-radius: 100px;
      border: 1px solid var(--el-color-primary);
      justify-content: center;
      cursor: pointer;
      margin: 2px 5px 4px;
    }
    .add-user-item {
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
