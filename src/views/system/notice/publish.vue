<!-- 模板 -->
<template>
  <el-dialog
    v-model="visible"
    title="发布"
    :close-on-click-modal="false"
    :lock-scroll="false"
    width="40%"
    draggable
  >
    <el-form ref="formDataRef" :model="formData" label-width="100px" @keyup.enter="submit()">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="type" :label="$t('label.notice.publishType')">
            <el-select v-model="type">
              <el-option :label="$t('label.notice.publishNow')" :value="1" />
              <el-option :label="$t('label.notice.publishJob')" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="type == 2">
          <el-form-item prop="publishTime" :label="$t('label.notice.publishTime')">
            <el-date-picker
              v-model="formData.publishTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
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
  import { ref, reactive } from 'vue';
  import { noticePublishApi } from '@/api/sys/notice';
  import { ElMessage } from 'element-plus/es';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  /** 是否显示 */
  const visible = ref(false);
  /** 数据 */
  const formData = reactive<Notice.PublishParams>({
    id: '',
    publishTime: '',
  });
  /** 发布类型 */
  const type = ref<number>(1);

  /**
   * @description: 提交
   * @return {*}
   */
  const submit = () => {
    noticePublishApi(formData).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        ElMessage.success(t('common.success'));
      }
      visible.value = false;
    });
  };

  /**
   * @description: 初始化
   * @param {*} id 公告id
   * @return {*}
   */
  const init = (id: string) => {
    formData.id = id;
    visible.value = true;
  };

  defineExpose({
    init,
  });
</script>
<style scoped lang="scss">
  page {
    padding: 0 20rpx;
  }
</style>
