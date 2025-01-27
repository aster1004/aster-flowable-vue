<!--
 * @Date: 2022-08-25 14:05:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-08-12 10:33:25
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\process\drawer\promoterDrawer.vue
-->
<template>
  <el-drawer
    :append-to-body="true"
    title="发起人"
    v-model="visible"
    class="set_promoter"
    :show-close="false"
    :size="550"
    :before-close="savePromoter"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane :label="t('workflow.process.nodeProperty')" name="nodeProps">
        <el-form-item :label="t('workflow.process.nodeId')" prop="id">
          <el-input readonly v-model="rootNode.id" />
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane :label="t('workflow.process.formPermission')" name="formPermission">
        <form-permission v-model:value="rootNode.formPermission" :headerConfig="headerConfig" />
      </el-tab-pane>
      <el-tab-pane :label="t('workflow.process.buttonPermission')" name="buttonPermission">
        <button-permission v-model:value="rootNode.buttonPermission" />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { processStore } from '@/stores/modules/process';
  import FormPermission from '../permission/form-permission.vue';
  import ButtonPermission from '../permission/button-permission.vue';
  import { getFormFieldData } from '@/utils/process/process';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  let store = processStore();
  let { setPromoter, setFlowPermission } = store;

  // 选中的tab
  const activeName = ref<string>('nodeProps');

  // 表单属性表格配置
  const headerConfig = ref({});

  let promoterDrawer = computed(() => store.promoterDrawer);

  // 发起节点
  const rootNode = ref<any>({});

  let flowPermission1 = computed(() => store.flowPermission1);

  // 是否展示
  let visible = computed({
    get() {
      return promoterDrawer.value;
    },
    set() {
      closeDrawer();
    },
  });

  watch(flowPermission1, (val) => {
    // console.info('初始化加载发起人：', JSON.stringify(val));
    activeName.value = 'nodeProps';
    rootNode.value = JSON.parse(JSON.stringify(val.value));
    // 表单权限头信息
    headerConfig.value = {
      required: false,
      edit: false,
      hidden: false,
      readonly: false,
    };
    // 获取表单属性数据
    let formField = getFormFieldData(val);
    rootNode.value.formPermission = JSON.parse(JSON.stringify(formField));
  });

  /**
   * 保存发起节点至store中
   */
  const savePromoter = () => {
    // console.info('保存发起人节点信息：', JSON.stringify(rootNode.value));
    setFlowPermission({
      value: rootNode.value,
      flag: true,
      id: flowPermission1.value.id,
    });
    closeDrawer();
  };
  const closeDrawer = () => {
    setPromoter(false);
  };
</script>
<style lang="scss">
  .set_promoter {
    .promoter_content {
      padding: 0 20px;
      .el-button {
        margin-bottom: 20px;
      }
      p {
        padding: 18px 0;
        font-size: 14px;
        line-height: 20px;
        color: #000000;
      }
    }
  }
</style>
