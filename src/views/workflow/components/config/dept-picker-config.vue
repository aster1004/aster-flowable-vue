<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 18:14:30
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\dept-picker-config.vue
 * @Description: 部门配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">人员选择</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.placeholder')">
      <el-input v-model="_formItem.props.placeholder" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.defaultValue')">
      <el-select v-model="valueType">
        <el-option label="固定值" value="fixed" />
        <el-option label="数据联动" value="linkage" />
      </el-select>
      <el-input @click="showDefaultValue" readonly>
        <template #suffix>
          <i class="iconfont icon-xinzeng" style="color: var(--el-color-primary)" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="t('workflow.component.deptFilter')">
      <el-input @click="showSelectedDialog" readonly v-model="_selectedInfos">
        <template #suffix>
          <i class="iconfont icon-xinzeng" style="color: var(--el-color-primary)" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="t('workflow.component.required')">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.isMultiple')">
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
    <!-- 数据联动 -->
    <data-linkage ref="dataLinkageRef" />
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref, watchEffect, onMounted } from 'vue';
  import { isNotEmpty } from '@/utils';
  import { selectDeptsByIdsApi } from '@/api/sys/dept';
  import { ResultEnum } from '@/enums/httpEnum';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';
  import DataLinkage from '../common/data-linkage.vue';
  import { ElMessage } from 'element-plus';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 默认值类型
  const valueType = ref<string>('fixed');
  // 注册组件
  const userDeptDefaultPickerRef = ref();
  const dataLinkageRef = ref();
  // 定义一个联合类型
  type UserDeptRole = User.UserInfo | Dept.DeptInfo | Role.RoleInfo;
  // 选人选部门组件
  const userDeptPickerRef = ref();
  // 选选部门组件，设置默认值
  const selectedInfos = ref<UserDeptRole[]>([]);
  const defaultInfos = ref<UserDeptRole[]>([]);

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });

  /**
   * @description: 默认值,id数组
   */
  const _defaultValue = computed({
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

  /**
   * @description: 显示默认值
   */
  const showDefaultValue = () => {
    if (!_formItem.value || !_formItem.value.props.hasOwnProperty('default')) {
      ElMessage.warning('该控件的配置信息已更改，如要设置默认值需删除后重新拖入表单');
      return;
    }
    // 默认值类型
    _formItem.value.props.default.type = valueType.value;
    if (valueType.value === 'fixed') {
      // 清空数据联动配置
      _formItem.value.props.default.linkage = {
        // 联动目标表单编码
        formCode: [],
        // 联动条件
        conditions: [],
        // 联动填充
        dataFill: '',
      };
      userDeptDefaultPickerRef.value.init(defaultInfos.value);
    }
    if (valueType.value === 'linkage') {
      // 清空固定值配置
      _formItem.value.value = [];
      dataLinkageRef.value.init();
    }
  };

  /**
   * @description: 显示筛选部门弹窗
   */
  const showSelectedDialog = () => {
    userDeptPickerRef.value.init(selectedInfos.value);
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
    _defaultValue.value = deptIds.value;
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
    selectDeptsDefaultByIds(_defaultValue.value);
  });

  // 打开组件时，获取默认值类型
  onMounted(() => {
    if (_formItem.value && _formItem.value.props.default) {
      valueType.value = _formItem.value.props.default.type;
    } else {
      valueType.value = 'fixed';
    }
  });
</script>
<style scoped lang="scss"></style>
