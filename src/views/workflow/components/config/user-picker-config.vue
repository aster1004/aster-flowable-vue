<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 18:13:40
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\user-picker-config.vue
 * @Description: 用户配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="控件名称">
      <template #label>
        <div class="flex justify-between items-center">
          <span>控件名称</span>
          <span class="text-xs font-normal">人员选择</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item label="提示内容">
      <template #label>
        <div class="flex justify-between items-center">
          <span>提示内容</span>
          <span class="text-xs font-normal">提示内容</span>
        </div>
      </template>
      <el-input v-model="_formItem.props.placeholder" />
    </el-form-item>
    <el-form-item label="默认值">
      <el-select v-model="valueType">
        <el-option label="计算公式" value="formula" />
        <el-option label="数据联动" value="data" />
      </el-select>
      <el-input @click="showDefaultValue">
        <template #suffix>
          <i class="iconfont icon-xinzeng" style="color: var(--el-color-primary)" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="仅以下人员可被选择">
      <el-select v-model="_canselected.type">
        <el-option label="人员选择" value="user" />
        <el-option label="部门选择" value="dept" />
        <el-option label="系统角色" value="sysRole" />
        <el-option label="流程角色" value="flowRole" />
      </el-select>
      <el-input @click="showSelectedDialog" readonly v-model="_selectedInfos">
        <template #suffix>
          <i class="iconfont icon-xinzeng" style="color: var(--el-color-primary)" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
    <el-form-item label="是否多选">
      <el-switch v-model="_formItem.props.multiple" />
    </el-form-item>

    <user-org-picker
      ref="userDeptPickerRef"
      :type="_canselected.type"
      :title="pickerTitle"
      :form-item="_formItem"
      :multiple="true"
      @success="handleSuccess"
    />
    <formula ref="defaultValueRef" title="默认值" v-model:formula="defaultValue" />
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref, watchEffect } from 'vue';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';
  import { isNotEmpty } from '@/utils';
  import { selectUsersByIdsApi } from '@/api/sys/user';
  import { ResultEnum } from '@/enums/httpEnum';
  import { selectDeptsByIdsApi } from '@/api/sys/dept';
  import { selectRolesByIdsApi } from '@/api/sys/role';
  import Formula from '@/views/workflow/components/common/formula.vue';
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  const valueType = ref<string>('formula');

  // 默认值
  const defaultValue = ref<string>('');
  // 注册组件
  const defaultValueRef = ref();
  // 定义一个联合类型
  type UserDeptRole = User.UserInfo | Dept.DeptInfo | Role.RoleInfo;
  // 选人选部门组件
  const userDeptPickerRef = ref();
  /**
   * @description: 显示默认值
   */
  const showDefaultValue = () => {
    defaultValueRef.value.init();
  };

  /**
   * @description: 显示筛选人员弹窗
   */
  const showSelectedDialog = () => {
    userDeptPickerRef.value.init(selectedInfos.value);
  };
  const selectedInfos = ref<UserDeptRole[]>([]);
  /**
   * @description: 选人选部门组件回调
   * @param {*} val 选中人员
   * @return {*}
   */
  const handleSuccess = (val: UserDeptRole[]) => {
    const userIds = ref<string[]>([]);
    if (val.length > 0) {
      val.forEach((item: UserDeptRole) => {
        selectedInfos.value.push(item);
        item.id && userIds.value.push(item.id);
      });
    }
    _canselected.value.ids = userIds.value;
    selectedInfos.value = [];
  };
  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });

  const _canselected = computed({
    get() {
      return _formItem.value?.props?.canselected;
    },
    set(val) {
      if (_formItem.value) {
        // 如果_props存在则直接赋值，否则初始化_props对象
        if (!_formItem.value.props) _formItem.value.props = {};
        _formItem.value.props.canselected = val;
      }
    },
  });
  const titleMap = {
    user: '人员选择',
    dept: '部门选择',
    sysRole: '系统角色',
    flowRole: '流程角色',
  };
  // 弹窗标题
  const pickerTitle = computed(() => titleMap[_canselected.value.type] || '未知类型');

  /**
   *  @description: 显示逗号拼接的字符串
   *  canselected: {
   *   type: 'user', // 可选类型，user（选人) | dept(选部门) | sysRole(系统角色) | flowRole(流程角色)
   *   ids: [],
   *  },
   *  @return ‘张三,李四,xxx...’
   */
  const _selectedInfos = computed(() => {
    console.log('canselected', selectedInfos.value);
    // 根据不通类型，获取不通的名称，如user 获取username，dept 获取deptName，role 获取roleName
    return (selectedInfos.value || []).map((item: any) => getLabel(item));
  });
  const getLabel = (item: any) => {
    switch (_canselected.value.type) {
      case 'user':
        return item?.username;
      case 'dept':
        return item?.orgName;
      case 'sysRole':
        return item?.roleName;
      case 'flowRole':
        return item?.roleName;
      default:
        return '';
    }
  };

  // 通过type 和 ids 获取对应的名称
  const getLabelByTypeAndIds = (type: string, ids: any) => {
    selectedInfos.value = [];
    _canselected.value.ids = [];
    // 通过id 和 type 获取对应的名称
    if (ids && ids.length > 0) {
      switch (type) {
        case 'user':
          // 获取用户信息
          selectUsersByIds(ids);
          break;
        case 'dept':
          // 获取部门信息
          selectDeptsByIds(ids);
          break;
        case 'sysRole':
          // 获取系统角色信息
          selectRolesByIds(ids);
          break;
        case 'flowRole':
          // 获取流程角色信息
          break;
        default:
          break;
      }
    }
  };

  /**
   * @description: 批量获取用户信息
   * @param {*} ids
   * @return {*}
   */
  const selectUsersByIds = (ids: string[]) => {
    selectUsersByIdsApi(ids).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        const data = res.data;
        data.forEach((item: User.UserInfo) => {
          selectedInfos.value.push(item);
          _canselected.value.ids.push(item.id);
        });
      }
    });
  };

  /**
   * @description: 根据id查询部门信息
   * @param {*} ids 部门id集合
   * @return {*}
   */
  const selectDeptsByIds = async (ids: string[]) => {
    if (isNotEmpty(ids)) {
      await selectDeptsByIdsApi(ids).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          const data = res.data;
          data.forEach((item: Dept.DeptInfo) => {
            selectedInfos.value.push(item);
            _canselected.value.ids.push(item.id);
          });
        }
      });
    }
  };
  /**
   * @description: 根据id查询部门信息
   * @param {*} ids 部门id集合
   * @return {*}
   */
  const selectRolesByIds = async (ids: string[]) => {
    if (isNotEmpty(ids)) {
      await selectRolesByIdsApi(ids).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          const data = res.data;
          data.forEach((item: Role.RoleInfo) => {
            selectedInfos.value.push(item);
            _canselected.value.ids.push(item.id);
          });
        }
      });
    }
  };

  /**
   * @description: 监听_canselected.value值变化，获取对应的label
   */
  watchEffect(() => {
    getLabelByTypeAndIds(_canselected.value.type, _canselected.value.ids);
  });
</script>
<style scoped lang="scss"></style>
