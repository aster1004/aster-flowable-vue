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
          <el-form-item prop="id" label="主键">
            <el-input v-model="formData.id" placeholder="主键" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="delegatorId" label="被代理人ID">
            <el-input v-model="formData.delegatorId" placeholder="被代理人ID" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="agentId" label="代理人ID">
            <el-input v-model="formData.agentId" placeholder="代理人ID" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="formCode" label="表单编码">
            <el-input v-model="formData.formCode" placeholder="表单编码" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="procDefId" label="流程定义ID">
            <el-input v-model="formData.procDefId" placeholder="流程定义ID" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="procInstId" label="流程实例ID">
            <el-input v-model="formData.procInstId" placeholder="流程实例ID" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="nodeId" label="节点ID">
            <el-input v-model="formData.nodeId" placeholder="节点ID" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="nodeName" label="节点名称">
            <el-input v-model="formData.nodeName" placeholder="节点名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="createTime" label="创建时间">
            <el-input v-model="formData.createTime" placeholder="创建时间" />
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
  import { agentLogInfoApi, agentLogSaveApi } from '@/api/workflow/agentLog';
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
  /** 表单内容 */
  const formData = reactive<AgentLog.AgentLogInfo>({
    id: '',
    delegatorId: '',
    agentId: '',
    formCode: '',
    procDefId: '',
    procInstId: '',
    nodeId: '',
    nodeName: '',
    createTime: '',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {};
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
    agentLogInfoApi(key).then(({ data }) => {
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

      agentLogSaveApi(formData).then((res) => {
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
