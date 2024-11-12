<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-11-07 15:04:12
 * @FilePath: \aster-flowable-vue\src\views\system\calendar\calendar-event.vue
 * @Description: 新增/编辑事件
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    :close-on-click-modal="false"
    :lock-scroll="false"
    width="60%"
    draggable
  >
    <el-form ref="formRef" :model="form" size="small" label-width="100px" :rules="rules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>

      <el-form-item label="全天" prop="allDay">
        <el-switch v-model="form.allDay" />
      </el-form-item>

      <el-form-item label="开始时间" prop="start">
        <el-date-picker
          v-model="form.start"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="结束时间" prop="end">
        <el-date-picker
          v-model="form.end"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="颜色" prop="color">
        <el-color-picker v-model="form.color" show-alpha :predefine="predefineColors" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div v-if="type === 'edit'" class="flex justify-between">
        <el-button @click="handleDelete">{{ $t('button.delete') }}</el-button>
        <div>
          <el-button type="primary" @click="handleOk">{{ $t('button.confirm') }}</el-button>
          <el-button @click="onCancel">{{ $t('button.cancel') }}</el-button>
        </div>
      </div>
      <div v-else class="flex justify-end">
        <el-button type="primary" @click="handleOk">{{ $t('button.confirm') }}</el-button>
        <el-button @click="onCancel">{{ $t('button.cancel') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { DEFAULT_PRIMARY } from '@/config';
  import { ElMessageBox } from 'element-plus';
  import moment from 'moment';
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const props = defineProps<{
    type: 'edit' | 'add';
    visible: boolean;
    onCancel: VoidFunction;
    onEdit: (event: AsterCalendar.CalendarEventModel) => void;
    onCreate: (event: AsterCalendar.CalendarEventModel) => void;
    onDelete: (id: string) => void;
    initValues: AsterCalendar.CalendarEventModel;
  }>();

  /** 预定义主题颜色 */
  const predefineColors = ref([
    DEFAULT_PRIMARY,
    '#009688',
    '#daa96e',
    '#0c819f',
    '#409eff',
    '#27ae60',
    '#ff5c93',
    '#f39c12',
    '#9b59b6',
    '#e74c3c',
    '#90ee90',
    '#00ced1',
  ]);

  /** 标题 */
  const title = ref('');
  /** 注册组件 */
  const formRef = ref();
  /** 事件内容 */
  const form = ref<AsterCalendar.CalendarEventModel>({
    id: '',
    title: '',
    description: '',
    allDay: false,
    color: '',
    start: '',
    end: '',
  });

  /** 表单校验规则 */
  const rules = {
    title: [{ required: true, message: '请输入标题！', trigger: 'blur' }],
    start: [{ required: true, message: '请输入开始日期！', trigger: 'blur' }],
    end: [{ required: true, message: '请输入结束日期！', trigger: 'blur' }],
  };

  watch(
    () => props.initValues,
    (newVal) => {
      form.value = {
        ...newVal,
        allDay: newVal.allDay || false, // 确保 allDay 的初始值为 false
        start: moment(newVal.start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(newVal.end).format('YYYY-MM-DD HH:mm:ss'),
        color: newVal.color || '#fd726d',
      };
      title.value = props.type === 'add' ? '添加事件' : '编辑事件';
    },
    { immediate: true },
  );

  /**
   * @description: 表单提交
   */
  const handleOk = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        const event = { ...form.value, id: props.initValues.id };
        if (props.type === 'add') props.onCreate(event);
        if (props.type === 'edit') props.onEdit(event);
        props.onCancel();
      } else {
        console.log('Validate Failed');
      }
    });
  };

  /**
   * @description: 删除
   */
  const handleDelete = () => {
    ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    }).then(() => {
      props.onDelete(props.initValues.id);
      props.onCancel();
    });
  };
</script>
<style scoped lang="scss"></style>
