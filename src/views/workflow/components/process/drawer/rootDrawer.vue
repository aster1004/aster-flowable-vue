<!--
 * @Date: 2022-08-25 14:05:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-01-26 17:41:22
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\process\drawer\rootDrawer.vue
-->
<template>
  <el-drawer
    :append-to-body="true"
    :title="props.title"
    v-model="_visible"
    class="set_promoter"
    :show-close="false"
    :size="550"
    :before-close="closeDrawer"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane :label="t('workflow.process.nodeProperty')" name="nodeProps">
        <el-form-item :label="t('workflow.process.nodeId')" prop="id">
          <el-input readonly v-model="_value.id" />
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane :label="t('workflow.process.formPermission')" name="formPermission">
        <form-permission v-model:value="_value.formPermission" :headerConfig="headerConfig" />
      </el-tab-pane>
      <el-tab-pane :label="t('workflow.process.buttonPermission')" name="buttonPermission">
        <button-permission v-model:value="_value.buttonPermission" />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import FormPermission from '../permission/form-permission.vue';
  import ButtonPermission from '../permission/button-permission.vue';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  const emits = defineEmits(['beforeClose']);

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    value: {
      type: Object,
      default: () => {
        return {
          id: '',
          formPermission: [],
          buttonPermission: [],
        };
      },
    },
  });

  // 选中的tab
  const activeName = ref<string>('nodeProps');

  // 表单属性表格配置
  const headerConfig = ref({
    required: false,
    edit: false,
    hidden: false,
    readonly: false,
  });

  const _visible = computed(() => {
    return props.visible;
  });

  const _value = computed(() => {
    return props.value;
  });
  // console.info(JSON.stringify(_value.value));

  const closeDrawer = () => {
    emits('beforeClose', {});
  };
</script>
<style lang="scss"></style>
