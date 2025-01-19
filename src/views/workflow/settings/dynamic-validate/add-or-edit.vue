<template>
  <el-dialog v-model="visible" :title="title + '动态校验'" width="700" :before-close="handleClose">
    <span>This is a message</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="visible = false"> {{ btnName }} </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  // 展示变量
  const visible = ref<boolean>(false);

  // 表单数据
  const formData = ref<any>({ ruleId: '' });

  // 根据ruleId计算标题是新增还是修改
  const title = computed(() => {
    return formData.value.ruleId ? '修改' : '新增';
  });

  // 根据ruleId计算标题是新增还是修改
  const btnName = computed(() => {
    return formData.value.ruleId ? '修改' : '新增';
  });

  /**
   * 关闭
   */
  const handleClose = () => {
    visible.value = false;
  };

  /**
   * 初始化
   */
  const init = (ruleInfo: any) => {
    console.info(ruleInfo);
    visible.value = true;
  };

  defineExpose({
    init,
  });
</script>
<style lang="scss" scoped></style>
