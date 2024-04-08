<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-26 15:16:42
 * @FilePath: \aster-flowable-vue\src\views\auth\dept\add-or-edit.vue
 * @Description: 部门新增/编辑
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
      <el-form-item prop="pid" :label="$t('label.dept.parentName')" class="popover-list">
        <el-tree-select
          v-model="formData.pid"
          :data="dataList"
          value-key="id"
          check-strictly
          :render-after-expand="false"
          :props="{ label: 'orgName', children: 'children' }"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item prop="orgName" :label="$t('label.dept.orgName')">
        <el-input v-model="formData.orgName" :placeholder="$t('placeholder.dept.orgName')" />
      </el-form-item>
      <el-form-item prop="sort" :label="$t('label.sort')">
        <el-input-number v-model="formData.sort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item prop="status" :label="$t('label.status')">
        <dict-radio v-model="formData.status" dict-type="status" />
      </el-form-item>
      <el-form-item prop="r" :remark="$t('label.remark')">
        <el-input
          v-model="formData.remark"
          :rows="2"
          type="textarea"
          :placeholder="$t('placeholder.remark')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { deptInfoApi, deptListApi, deptSaveApi } from '@/api/sys/dept';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isNotEmpty } from '@/utils';
  import { ElMessage } from 'element-plus';
  import { computed, reactive, ref } from 'vue';
  import DictRadio from '@/components/dict/dict-radio.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const emits = defineEmits(['refresh']);

  /** 显示 */
  const visible = ref(false);
  /** 标题 */
  const title = computed(() => {
    return !formData.id ? t('button.add') : t('button.edit');
  });
  /** 注册组件 */
  const formDataRef = ref();
  /** 表单数据 */
  const formData = reactive<Dept.DeptInfo>({
    id: '',
    pid: '',
    orgName: '',
    sort: 0,
    status: '0',
    parentName: '',
    remark: '',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {
      orgName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      pid: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    };
  });

  const dataList = ref<Dept.DeptInfo[]>([]);

  /**
   * @description: 初始化
   * @param {*} type
   * @param {*} dept
   * @return {*}
   */
  const init = async (type: string, dept?: Dept.DeptInfo) => {
    visible.value = true;
    formData.id = '';
    // 列表
    await getDataList();
    // 重置表单
    if (formDataRef.value) {
      formDataRef.value.resetFields();
    }
    // 判断新增还是编辑
    if (dept && isNotEmpty(dept.id)) {
      if (type == 'add') {
        formData.pid = dept.id;
      } else {
        dept.id && getDataInfo(dept.id);
      }
    }
  };

  /**
   * @description: 获取菜单列表
   * @return {*}
   */
  const getDataList = async () => {
    return await deptListApi().then(({ data }) => {
      dataList.value = data;
    });
  };

  /**
   * @description: 获取菜单信息
   * @param {*} key
   * @return {*}
   */
  const getDataInfo = async (key: string) => {
    await deptInfoApi(key).then(({ data }) => {
      Object.assign(formData, data);
      if (formData.pid == '0') {
        treeSetDefaultHandle();
      }
    });
  };

  /**
   * @description: 设置默认值
   * @param {*} key
   * @return {*}
   */
  const treeSetDefaultHandle = () => {
    formData.pid = '0';
    formData.parentName = '一级部门';
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

      deptSaveApi(formData).then((res) => {
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
