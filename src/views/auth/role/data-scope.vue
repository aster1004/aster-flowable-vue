<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-27 16:22:50
 * @FilePath: \aster-admin\src\views\auth\role\data-scope.vue
 * @Description: 数据范围
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    :title="$t('label.role.dataAuth')"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :width="600"
    draggable
  >
    <el-form ref="formRef" :model="formData">
      <el-form-item prop="roleName" :label="$t('label.role.roleName')">
        <el-input :value="roleName" disabled />
      </el-form-item>
      <el-form-item prop="dataScope" :label="$t('label.role.dataScope')">
        <dict-select v-model="formData.dataScope" dict-type="data_scope" clearable />
      </el-form-item>
      <el-form-item
        prop="orgList"
        v-show="formData.dataScope == '4'"
        :label="$t('label.role.dataAuth')"
      >
        <el-tree
          ref="orgListTreeRef"
          :data="orgList"
          :props="{ label: 'orgName', children: 'children' }"
          node-key="id"
          accordion
          show-checkbox
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { dataScopeSaveApi, roleInfoApi } from '@/api/sys/role';
  import { ResultEnum } from '@/enums/httpEnum';
  import DictSelect from '@/components/dict/dict-select.vue';
  import { ElMessage } from 'element-plus';
  import { reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { deptListApi } from '@/api/sys/dept';

  const { t } = useI18n();

  const formRef = ref();
  const visible = ref(false);
  const roleName = ref<string>('');
  const formData = reactive<Role.DataScope>({
    id: '',
    dataScope: '',
    orgIdList: [],
  });

  const orgListTreeRef = ref();
  const orgList = ref<Dept.DeptInfo[]>([]);

  const getRoleInfo = (id: string) => {
    roleInfoApi(id).then(({ data }) => {
      formData.id = id;
      roleName.value = data.roleName;
      formData.dataScope = data.dataScope ? data.dataScope : '';
      formData.orgIdList = data.orgIdList ? data.orgIdList : [];
      orgListTreeRef.value.setCheckedKeys(formData.orgIdList);
    });
  };

  const getOrgList = () => {
    deptListApi().then(({ data }) => {
      orgList.value = data;
    });
  };

  const init = async (id: string) => {
    visible.value = true;

    // 重置表单数据
    if (formRef.value) {
      formRef.value.resetFields();
    }
    if (orgListTreeRef.value) {
      orgListTreeRef.value.setCheckedKeys([]);
    }

    // 角色信息
    if (id) {
      getRoleInfo(id);
    }
    // 机构列表
    getOrgList();
  };

  /**
   * @description: 保存
   * @return {*}
   */
  const submit = () => {
    formData.orgIdList = orgListTreeRef.value.getCheckedKeys();

    dataScopeSaveApi(formData).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        ElMessage.success({
          message: t('common.success'),
          duration: 500,
          onClose: () => {
            visible.value = false;
          },
        });
      }
    });
  };

  defineExpose({
    init,
  });
</script>
