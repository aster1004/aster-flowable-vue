<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-26 17:16:09
 * @FilePath: \aster-flowable-vue\src\views\auth\role\add-or-edit.vue
 * @Description: 角色新增/编辑
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :close-on-click-modal="false"
    :lock-scroll="false"
    width="60%"
    draggable
  >
    <el-form
      ref="formDataRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      @keyup.enter="submit()"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item prop="roleName" :label="$t('label.role.roleName')">
            <el-input v-model="formData.roleName" :placeholder="$t('placeholder.role.roleName')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="roleCode" :label="$t('label.role.roleCode')">
            <el-input v-model="formData.roleCode" :placeholder="$t('placeholder.role.roleCode')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="sort" :label="$t('label.sort')">
            <el-input-number v-model="formData.sort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="status" :label="$t('label.status')">
            <dict-radio v-model="formData.status" dict-type="status" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="remark" :label="$t('label.remark')">
            <el-input v-model="formData.remark" :placeholder="$t('placeholder.remark')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('label.role.menuAuth')">
            <el-tree
              ref="menuListTreeRef"
              :data="menuList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              accordion
              show-checkbox
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { reactive, ref, computed } from 'vue';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import { isNotEmpty } from '@/utils';
  import { roleInfoApi, roleMenuApi, roleSaveApi } from '@/api/sys/role';
  import DictRadio from '@/components/dict/dict-radio.vue';
  import { menuListApi } from '@/api/sys/menu';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const emits = defineEmits(['refresh']);

  /** 是否显示 */
  const visible = ref(false);
  /** 标题 */
  const title = computed(() => {
    return !formData.id ? t('button.add') : t('button.edit');
  });
  /** 注册组件 */
  const formDataRef = ref();
  const menuListTreeRef = ref();
  /** 表单内容 */
  const formData = reactive<Role.RoleInfo>({
    id: '',
    roleName: '',
    roleCode: '',
    remark: '',
    sort: 0,
    status: '0',
    menuIdList: [],
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {
      roleName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      roleCode: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    };
  });
  /** 菜单列表 */
  const menuList = ref<Menu.MenuOptions[]>([]);

  /** 初始化 */
  const init = async (key?: string) => {
    visible.value = true;
    formData.id = '';
    // 查询菜单
    await getMenuList();

    // 重置表单
    if (formDataRef.value) {
      formDataRef.value.resetFields();
    }
    if (menuListTreeRef.value) {
      menuListTreeRef.value.setCheckedKeys([]);
    }

    // 判断新增还是编辑
    if (key && isNotEmpty(key)) {
      // 查询角色信息
      await getDataInfo(key);
    }
  };

  /**
   * @description: 获取菜单
   * @return {*}
   */
  const getMenuList = async () => {
    return await menuListApi().then(({ data }) => {
      menuList.value = data;
    });
  };

  /**
   * @description: 获取角色信息
   * @param {*} key
   * @return {*}
   */
  const getDataInfo = async (key: string) => {
    await roleInfoApi(key).then(({ data }) => {
      Object.assign(formData, data);
      formData.menuIdList?.forEach((item) => menuListTreeRef.value.setChecked(item, true));
    });
  };

  /**
   * @description: 保存
   * @return {*}
   */
  const submit = () => {
    formDataRef.value.validate((valid: boolean) => {
      if (!valid) {
        return false;
      }
      formData.menuIdList = [
        ...menuListTreeRef.value.getHalfCheckedKeys(),
        ...menuListTreeRef.value.getCheckedKeys(),
      ];

      roleSaveApi(formData).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          ElMessage.success({
            message: t('common.success'),
            duration: 500,
            onClose: () => {
              visible.value = false;
              emits('refresh');
            },
          });
        }
      });
    });
  };

  defineExpose({
    init,
  });
</script>
