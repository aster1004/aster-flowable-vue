<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 18:14:30
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\dept-picker-config.vue
 * @Description: 部门配置
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
    <el-form-item label="设置默认值">
      <el-input @click="setDefaultDialog" readonly v-model="_defaultInfos">
        <template #suffix>
          <i class="iconfont icon-xinzeng" style="color: var(--el-color-primary)" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="仅以下部门可被选择">
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
      type="dept"
      title="部门选择"
      :form-item="_formItem"
      :multiple="true"
      mode="design"
      @success="handleSuccess"
    />
    <!--  是否多选取决于_formItem.props.multiple  -->
    <user-org-picker
      ref="userDeptDefaultPickerRef"
      type="dept"
      title="部门选择"
      :form-item="_formItem"
      :multiple="_formItem.props.multiple"
      mode="design"
      @success="handleDefaultSuccess"
    />
    <formula ref="defaultValueRef" title="默认值" v-model:formula="defaultValue" />
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref, watchEffect, onMounted } from 'vue';
  import { isNotEmpty } from '@/utils';
  import { selectDeptsByIdsApi } from '@/api/sys/dept';
  import { ResultEnum } from '@/enums/httpEnum';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';
  import Formula from '@/views/workflow/components/common/formula.vue';
  const valueType = ref<string>('formula');
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 默认值
  const defaultValue = ref<string>('');
  // 注册组件
  const defaultValueRef = ref();
  // 定义一个联合类型
  type UserDeptRole = User.UserInfo | Dept.DeptInfo | Role.RoleInfo;
  // 选人选部门组件
  const userDeptPickerRef = ref();
  // 选选部门组件，设置默认值
  const userDeptDefaultPickerRef = ref();
  const selectedInfos = ref<UserDeptRole[]>([]);
  const defaultInfos = ref<UserDeptRole[]>([]);
  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
  const _default = computed({
    get() {
      return _formItem.value?.value || [];
    },
    set(val) {
      if (_formItem.value) {
        _formItem.value.value = val;
      }
    },
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
  const _selectedInfos = computed(() => {
    // 根据不通类型，获取不通的名称，如user 获取realName，dept 获取deptName，role 获取roleName
    return (selectedInfos.value || []).map((item: any) => item?.orgName);
  });

  const _defaultInfos = computed(() => {
    // 根据不通类型，获取不通的名称，如user 获取realName，dept 获取deptName，role 获取roleName
    return (defaultInfos.value || []).map((item: any) => item?.orgName);
  });
  /**
   * @description: 显示默认值
   */
  const showDefaultValue = () => {
    defaultValueRef.value.init();
  };

  /**
   * @description: 显示筛选部门弹窗
   */
  const showSelectedDialog = () => {
    userDeptPickerRef.value.init(selectedInfos.value);
  };
  /**
   * @description: 设置默认值
   */
  const setDefaultDialog = () => {
    userDeptDefaultPickerRef.value.init(defaultInfos.value);
  };
  /**
   * @description: 选人选部门组件回调
   * @param {*} val 选中人员
   * @return {*}
   */
  const handleSuccess = (val: UserDeptRole[]) => {
    selectedInfos.value = [];
    const deptIds = ref<string[]>([]);
    if (val.length > 0) {
      val.forEach((item: UserDeptRole) => {
        selectedInfos.value.push(item);
        item.id && deptIds.value.push(item.id);
      });
    }
    _canselected.value.ids = deptIds.value;
  };

  /**
   * @description: 选人选部门设置默认值组件回调
   * @param {*} val 选中人员
   * @return {*}
   */
  const handleDefaultSuccess = (val: UserDeptRole[]) => {
    defaultInfos.value = [];
    const deptIds = ref<string[]>([]);
    if (val.length > 0) {
      val.forEach((item: UserDeptRole) => {
        defaultInfos.value.push(item);
        item.id && deptIds.value.push(item.id);
      });
    }
    _default.value = deptIds.value;
  };

  /**
   * @description: 根据id查询部门信息
   * @param {*} ids 部门id集合
   * @return {*}
   */
  const selectDeptsByIds = async (ids: string[]) => {
    selectedInfos.value = [];
    _canselected.value.ids = [];
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
   * @description: 查询默认值：根据id查询部门信息
   * @param {*} ids 部门id集合
   * @return {*}
   */
  const selectDeptsDefaultByIds = async (ids: string[]) => {
    defaultInfos.value = [];
    if (isNotEmpty(ids)) {
      await selectDeptsByIdsApi(ids).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          const data = res.data;
          data.forEach((item: Dept.DeptInfo) => {
            defaultInfos.value.push(item);
          });
        }
      });
    }
  };

  watchEffect(() => {
    selectDeptsByIds(_canselected.value.ids);
    selectDeptsDefaultByIds(_default.value);
  });
</script>
<style scoped lang="scss"></style>
