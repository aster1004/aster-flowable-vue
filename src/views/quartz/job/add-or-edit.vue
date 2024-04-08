<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-07 17:28:34
 * @FilePath: \aster-admin\src\views\quartz\job\add-or-edit.vue
 * @Description: 任务新增/编辑
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
      label-width="120px"
      @keyup.enter="submit()"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item prop="jobName" :label="$t('label.quartz.jobName')">
            <el-input v-model="formData.jobName" :placeholder="$t('placeholder.quartz.jobName')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="jobGroup" :label="$t('label.quartz.jobGroup')">
            <dict-select
              v-model="formData.jobGroup"
              dict-type="schedule_group"
              clearable
              :placeholder="$t('placeholder.quartz.jobGroup')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="invokeTarget">
            <template #label>
              {{ $t('label.quartz.invokeTarget') }}
              <el-tooltip placement="top">
                <template #content>
                  {{ $t('label.quartz.beanTarget') }}：asterTask.asterParams("aster") <br />{{
                    $t('label.quartz.classTarget')
                  }}：vip.aster.quartz.task.AsterTask.asterParams("aster") <br />{{
                    $t('label.quartz.paramTarget')
                  }}
                </template>
                <i class="iconfont icon-tishi"></i>
              </el-tooltip>
            </template>
            <el-input
              v-model="formData.invokeTarget"
              :placeholder="$t('placeholder.quartz.invokeTarget')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="cronExpression" :label="$t('label.quartz.cronExpression')">
            <el-input
              v-model="formData.cronExpression"
              :placeholder="$t('placeholder.quartz.cronExpression')"
            >
              <!-- <template #append>
                <el-button type="primary" @click="handleShowCron">
                  生成表达式
                  <i class="iconfont icon-xiangyou"></i>
                </el-button>
              </template> -->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="status" :label="$t('label.status')">
            <dict-radio v-model="formData.status" dict-type="status" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="misfirePolicy" :label="$t('label.quartz.misfirePolicy')">
            <el-radio-group v-model="formData.misfirePolicy" size="small">
              <el-radio-button label="1">{{ $t('label.quartz.immediately') }}</el-radio-button>
              <el-radio-button label="2">{{ $t('label.quartz.once') }}</el-radio-button>
              <el-radio-button label="3">{{ $t('label.quartz.abandon') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="concurrent" :label="$t('label.quartz.concurrent')">
            <el-radio-group v-model="formData.concurrent" size="small">
              <el-radio-button label="0">{{ $t('label.quartz.allow') }}</el-radio-button>
              <el-radio-button label="1">{{ $t('label.quartz.prohibit') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="remark" :label="$t('label.remark')">
            <el-input v-model="formData.remark" :placeholder="$t('placeholder.remark')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>

    <!-- <crontab ref="crontabRef" @fill="crontabFill" :expression="expression" /> -->
  </el-dialog>
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { jobInfoApi, jobSubmitApi } from '@/api/quartz/job';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import { isNotEmpty } from '@/utils';
  import DictRadio from '@/components/dict/dict-radio.vue';
  import DictSelect from '@/components/dict/dict-select.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const emits = defineEmits(['refresh']);

  /** 是否显示 */
  const visible = ref(false);
  /** 标题 */
  const title = computed(() => {
    return !formData.id ? t('button.add') : t('button.edit');
  });
  /** 传入的表达式 */
  const expression = ref('');
  /** 注册组件 */
  const formDataRef = ref();
  const crontabRef = ref();
  /** 表单内容 */
  const formData = reactive<Quartz.JobInfo>({
    id: '',
    jobName: '',
    jobGroup: '',
    invokeTarget: '',
    cronExpression: '',
    misfirePolicy: '',
    concurrent: '',
    status: '',
    remark: '',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {
      jobName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      jobGroup: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      invokeTarget: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    };
  });

  /** 初始化 */
  const init = async (key?: string) => {
    visible.value = true;
    formData.id = '';
    // 重置表单
    if (formDataRef.value) {
      formDataRef.value.resetFields();
    }
    // 判断新增还是编辑
    if (key && isNotEmpty(key)) {
      getInfo(key);
    }
  };

  /**
   * @description: 获取信息
   * @param {*} key
   * @return {*}
   */
  const getInfo = (key: string) => {
    jobInfoApi(key).then(({ data }) => {
      Object.assign(formData, data);
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

      jobSubmitApi(formData).then((res) => {
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

  /** cron表达式 */
  const handleShowCron = () => {
    expression.value = formData.cronExpression;
    crontabRef.value.init();
  };

  /** 回填cron表达式 */
  const crontabFill = (value: string) => {
    formData.cronExpression = value;
  };

  defineExpose({
    init,
  });
</script>
<style lang="scss" scoped></style>
