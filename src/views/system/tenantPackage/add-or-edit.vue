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
          <el-form-item prop="packageName" :label="$t('label.tenant.packageName')">
            <el-input
              v-model="formData.packageName"
              :placeholder="$t('placeholder.tenant.packageName')"
            />
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
          <el-form-item prop="menuIds" :label="$t('label.tenant.menuIds')">
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
  import { computed, reactive, ref } from 'vue';
  import { tenantPackageInfoApi, tenantPackageSaveApi } from '@/api/sys/tenantPackage';
  import { menuListApi } from '@/api/sys/menu';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import { isNotEmpty } from '@/utils';
  import DictRadio from '@/components/dict/dict-radio.vue';
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
  const formData = reactive<TenantPackage.TenantPackageInfo>({
    id: '',
    packageName: '',
    menuIds: [],
    status: '',
    remark: '',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {
      packageName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    };
  });
  /** 菜单列表 */
  const menuList = ref<Menu.MenuOptions[]>([]);

  /**
   * @description: 获取菜单
   * @return {*}
   */
  const getMenuList = async () => {
    return await menuListApi().then(({ data }) => {
      menuList.value = data;
    });
  };

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
      await getInfo(key);
    }
  };

  /**
   * @description: 获取信息
   * @param {*} key
   * @return {*}
   */
  const getInfo = async (key: string) => {
    await tenantPackageInfoApi(key).then(({ data }) => {
      Object.assign(formData, data);
      formData.menuIds.forEach((m) => {
        menuListTreeRef.value.setChecked(m, true);
      });
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
      formData.menuIds = [
        ...menuListTreeRef.value.getHalfCheckedKeys(),
        ...menuListTreeRef.value.getCheckedKeys(),
      ];
      tenantPackageSaveApi(formData).then((res) => {
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
<style lang="scss" scoped></style>
