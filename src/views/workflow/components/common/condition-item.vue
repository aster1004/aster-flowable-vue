<!--
 * @Author: lwj
 * @Date: 2024-07-22 09:53:47
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\condition-group.vue
 * @Description: 条件分支组件，条件组【condition-group】的子组件
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div>
    <el-select v-model="_value.compare" style="width: 30%">
      <el-option
        v-for="op in CompareOptions[_value.valueType]"
        :key="op.value"
        :label="op.label"
        :value="op.value"
      />
    </el-select>
    <el-divider direction="vertical" />

    <!--每类条件选项-->
    <template v-if="_value.valueType === 'Role'"> </template>
    <template v-else-if="_value.valueType === 'User' || _value.valueType === 'Dept'">
      <el-input @click="setDefaultDialog" readonly style="width: 65%" v-model="_selectedInfos">
        <template #suffix>
          <i class="iconfont icon-xinzeng" style="color: var(--el-color-primary)" />
        </template>
      </el-input>
    </template>
    <template v-else-if="_value.valueType === 'Number'">
      <template
        v-if="
          _value.compare === 'B' ||
          _value.compare === 'AB' ||
          _value.compare === 'BA' ||
          _value.compare === 'ABA'
        "
      >
        <el-input
          style="width: 30%"
          type="number"
          v-model="_value.compareVal[0]"
          placeholder="左比较值"
        ></el-input>
        ~
        <el-input
          style="width: 30%"
          type="number"
          v-model="_value.compareVal[1]"
          placeholder="右比较值"
        ></el-input>
      </template>
      <el-select
        v-else-if="_value.compare === 'IN'"
        multiple
        filterable
        v-model="_value.compareVal"
        style="width: 65%"
        placeholder="请输入选项"
      >
        <el-option
          v-for="op in _value.compareVal"
          :key="op.symbol"
          :label="op.name"
          :value="op.name"
        />
      </el-select>
      <el-input
        v-else
        type="number"
        style="width: 65%"
        v-model="_value.compareVal[0]"
        placeholder="比较值"
      />
    </template>

    <!--  处理类型是String，组件是下拉单选的情况  -->
    <template v-else-if="_value.valueType === 'String' && _value.name === 'SelectSingle'">
      <!--   处理包含操作   -->
      <el-select
        v-if="_value.compare === 'IN'"
        multiple
        filterable
        allow-create
        v-model="_value.compareVal"
        style="width: 65%"
        placeholder="请输入选项"
      >
        <el-option
          v-for="(option, oi) in getOptions()"
          :key="oi"
          :label="option"
          :value="option"
        ></el-option>
      </el-select>
      <!--   处理其他操作：等于、不等于、含有字符串   -->
      <el-select
        v-else
        style="width: 65%"
        clearable
        v-model="_value.compareVal[0]"
        placeholder="选择值"
      >
        <el-option
          v-for="(option, oi) in getOptions()"
          :key="oi"
          :label="option"
          :value="option"
        ></el-option>
      </el-select>
      <!--      <el-input style="width: 65%" v-else v-model="_value.compareVal[0]" placeholder="输入比较值" />-->
    </template>

    <template v-else-if="_value.valueType === 'String'">
      <el-select
        v-if="_value.compare === 'IN'"
        multiple
        filterable
        allow-create
        v-model="_value.compareVal"
        style="width: 65%"
        placeholder="请输入选项"
      >
        <el-option
          v-for="op in _value.compareVal"
          :key="op.symbol"
          :label="op.name"
          :value="op.name"
        />
      </el-select>
      <el-input style="width: 65%" v-else v-model="_value.compareVal[0]" placeholder="输入比较值" />
    </template>

    <template v-else-if="_value.valueType === 'Array'"> </template>
    <template v-else-if="_value.valueType === 'Date'"> </template>
    <template v-else-if="_value.valueType === 'DateRange'"> </template>

    <user-org-picker
      ref="userDeptPickerRef"
      :type="pickerType.type"
      :title="pickerTitle"
      :multiple="true"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { CompareOptions } from '@/utils/ConditionCompare';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';

  const emit = defineEmits(['update:condition', 'delete']);

  const props = defineProps({
    condition: {
      type: Object,
      required: true,
    },
  });
  // 定义一个联合类型
  type UserDeptRole = User.UserInfo | Dept.DeptInfo | Role.RoleInfo;
  // 选人选部门组件
  const userDeptPickerRef = ref();
  const _value = computed({
    get() {
      // console.log('condition----', props.condition);
      return props.condition;
    },
    set(val) {
      emit('update:condition', val);
    },
  });

  const titleMap = {
    user: '人员选择',
    dept: '部门选择',
    sysRole: '系统角色',
    flowRole: '流程角色',
  };
  // 弹窗标题
  const pickerTitle = computed(() => titleMap[pickerType.value.type] || '未知类型');

  // 选人选部门组件类型
  const pickerType = computed(() => {
    if (_value.value.valueType === 'User') {
      if (_value.value.compare === 'IN' || _value.value.compare === 'NIN') {
        return {
          type: 'user', // 可选类型，user（选人) | dept(选部门) | sysRole(系统角色) | flowRole(流程角色)
        };
      } else if (_value.value.compare === 'DEPTIN' || _value.value.compare === 'DEPTNIN') {
        return {
          type: 'dept', // 可选类型，user（选人) | dept(选部门) | sysRole(系统角色) | flowRole(流程角色)
        };
      } else if (_value.value.compare === 'SYSROLEIN' || _value.value.compare === 'SYSROLENIN') {
        return {
          type: 'sysRole', // 可选类型，user（选人) | dept(选部门) | sysRole(系统角色) | flowRole(流程角色)
        };
      } else if (_value.value.compare === 'FLOWROLEIN' || _value.value.compare === 'FLOWROLENIN') {
        return {
          type: 'flowRole', // 可选类型，user（选人) | dept(选部门) | sysRole(系统角色) | flowRole(流程角色)
        };
      }
    } else if (_value.value.valueType === 'Dept') {
      return {
        type: 'dept', // 可选类型，user（选人) | dept(选部门) | sysRole(系统角色) | flowRole(流程角色)
      };
    }
    // 默认为选人组件
    return {
      type: 'user',
    };
  });

  //选人类型变了则清空已选择的数据
  watch(
    () => pickerType.value.type,
    () => {
      _value.value.compareVal = [];
    },
  );
  /**
   * @description: 设置默认值
   */
  const setDefaultDialog = () => {
    userDeptPickerRef.value.init(_value.value.compareVal);
  };
  /**
   * @description: 选人选部门组件回调
   * @param {*} val 选中人员
   * @return {*}
   */
  const handleSuccess = (val: UserDeptRole[]) => {
    if (val.length > 0) {
      val.forEach((item: UserDeptRole) => {
        _value.value.compareVal.push({ ...item, name: getLabel(item) });
      });
    }
  };
  /**
   * @description: 显示label名
   */

  const _selectedInfos = computed(() => {
    // 根据不通类型，获取不通的名称，如user 获取realName，dept 获取deptName，role 获取roleName
    return (_value.value.compareVal || []).map((item: any) => getLabel(item));
  });
  const getLabel = (item: any) => {
    switch (item.type) {
      case 'user':
        return item?.realName;
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

  /**
   * 获取下拉框选项
   */
  const getOptions = () => {
    console.log('获取下拉框选项：', _value.value.props?.options);
    return _value.value.props?.options;
  };
</script>

<style scoped lang="scss"></style>
