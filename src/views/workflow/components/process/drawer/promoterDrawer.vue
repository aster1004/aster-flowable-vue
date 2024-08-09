<!--
 * @Date: 2022-08-25 14:05:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-08-09 14:17:09
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
      <el-tab-pane label="节点属性" name="nodeProps">
        <el-form-item label="节点ID" prop="id">
          <el-input readonly v-model="rootNode.id" />
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="表单权限" name="formPermission">
        <form-permission v-model:value="rootNode.formPermission" :headerConfig="headerConfig" />
      </el-tab-pane>
      <el-tab-pane label="操作权限" name="buttonPermission">
        <button-permission v-model:value="rootNode.buttonPermission" />
      </el-tab-pane>
    </el-tabs>
    <!-- <div class="demo-drawer__content">
      <div class="promoter_content drawer_content">
        <p>{{ $func.arrToStr(flowPermission) || '所有人' }}</p>
        <el-button type="primary" @click="addPromoter">添加/修改发起人</el-button>
      </div>
      <employees-dialog
        :isDepartment="true"
        v-model:visible="promoterVisible"
        :data="checkedList"
        @change="surePromoter"
      />
    </div>
    <template #footer>
      <el-button type="primary" @click="savePromoter">确 定</el-button>
      <el-button @click="closeDrawer">取 消</el-button>
    </template> -->
  </el-drawer>
</template>
<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { processStore } from '@/stores/modules/process';
  import FormPermission from '../permission/form-permission.vue';
  import ButtonPermission from '../permission/button-permission.vue';
  import { getFormFieldData } from '@/utils/process/process';

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
    console.info('初始化加载发起人：', JSON.stringify(val));
    activeName.value = 'nodeProps';
    rootNode.value = JSON.parse(JSON.stringify(val.value));
    headerConfig.value = {
      required: false,
      edit: false,
      hidden: false,
      readonly: false,
    };
    let formField = getFormFieldData(val);
    rootNode.value.formPermission = JSON.parse(JSON.stringify(formField));
  });

  /**
   * 保存发起节点至store中
   */
  const savePromoter = () => {
    console.info('保存发起人节点信息：', JSON.stringify(rootNode.value));
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
