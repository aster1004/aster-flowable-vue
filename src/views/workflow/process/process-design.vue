<template>
  <div>
    <div class="fd-nav">
      <div class="fd-nav-left">
        <div class="fd-nav-back" @click="toReturn">
          <i class="anticon anticon-left"></i>
        </div>
        <div class="fd-nav-title">{{ workFlowDef.name }}</div>
      </div>
      <div class="fd-nav-right">
        <button type="button" class="ant-btn button-publish" @click="saveSet">
          <span>发 布</span>
        </button>
      </div>
    </div>
    <div class="fd-nav-content">
      <section class="dingflow-design">
        <div class="zoom">
          <div class="zoom-out" :class="nowVal == 50 && 'disabled'" @click="zoomSize(1)"></div>
          <span>{{ nowVal }}%</span>
          <div class="zoom-in" :class="nowVal == 300 && 'disabled'" @click="zoomSize(2)"></div>
        </div>
        <div class="box-scale" :style="`transform: scale(${nowVal / 100});`">
          <nodeWrap v-model:nodeConfig="nodeConfig" v-model:flowPermission="flowPermission" />
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <errorDialog v-model:visible="tipVisible" :list="tipList" />
    <promoterDrawer />
    <approverDrawer :directorMaxLevel="directorMaxLevel" />
    <copyerDrawer />
    <conditionDrawer />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { getWorkFlowData, setWorkFlowData } from '@/api/workflow/index';
  import { useStore } from '@/stores/index';
  import errorDialog from '@/views/workflow/components/process/dialog/errorDialog.vue';
  import promoterDrawer from '@/views/workflow/components/process/drawer/promoterDrawer.vue';
  import approverDrawer from '@/views/workflow/components/process/drawer/approverDrawer.vue';
  import copyerDrawer from '@/views/workflow/components/process/drawer/copyerDrawer.vue';
  import conditionDrawer from '@/views/workflow/components/process/drawer/conditionDrawer.vue';
  import { isDef, isNotEmpty } from '@/utils';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import processData from '@/data/process.json';

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  let { setTableId, setIsTried } = useStore();

  let tipList = ref([]);
  let tipVisible = ref(false);
  let nowVal = ref(100);
  const processConfig = ref({});
  let nodeConfig = ref({});
  let workFlowDef = ref({});
  let flowPermission = ref([]);
  let directorMaxLevel = ref(0);
  onMounted(async () => {
    let route = useRoute();
    console.info(route);
    let appId = route.query.appId;
    let id = route.query.id;
    let { data } = await getWorkFlowData({ workFlowDefId: route.query.workFlowDefId });
    console.info('流程设计json：', data);
    if (isDef(id) && isNotEmpty(id)) {
      console.info('修改流程设计：', id);
    } else {
      console.info('初始化流程设计');
      workFlowStore.design.process = processData;
      console.info('process', JSON.stringify(workFlowStore.design.process));
      processConfig.value = data;
      nodeConfig.value = processData.nodeConfig;

      /* let {
        nodeConfig: nodes,
        flowPermission: flows,
        directorMaxLevel: directors,
        workFlowDef: works,
        tableId,
      } = data;
      console.info(nodes); */
      /* nodes.childNode = [];
      nodeConfig.value = nodes;
      flowPermission.value = [];
      directorMaxLevel.value = 0;
      workFlowDef.value = works; */
      //1 directorMaxLevel.value = [];
      //1 setTableId(tableId);
    }
  });
  const toReturn = () => {
    //window.location.href = ""
  };
  const reErr = ({ childNode }) => {
    if (childNode) {
      let { type, error, nodeName, conditionNodes } = childNode;
      if (type == 1 || type == 2) {
        if (error) {
          tipList.value.push({
            name: nodeName,
            type: ['', '审核人', '抄送人'][type],
          });
        }
        reErr(childNode);
      } else if (type == 3) {
        reErr(childNode);
      } else if (type == 4) {
        reErr(childNode);
        for (var i = 0; i < conditionNodes.length; i++) {
          if (conditionNodes[i].error) {
            tipList.value.push({ name: conditionNodes[i].nodeName, type: '条件' });
          }
          reErr(conditionNodes[i]);
        }
      }
    } else {
      childNode = null;
    }
  };
  const saveSet = async () => {
    setIsTried(true);
    tipList.value = [];
    reErr(nodeConfig.value);
    if (tipList.value.length != 0) {
      tipVisible.value = true;
      return;
    }
    processConfig.value.flowPermission = flowPermission.value;
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(processConfig.value));
    /* let res = await setWorkFlowData(processConfig.value);
    if (res.code == 200) {
      ElMessage.success('设置成功');
      setTimeout(function () {
        window.location.href = '';
      }, 200);
    } */
  };
  const zoomSize = (type) => {
    if (type == 1) {
      if (nowVal.value == 50) {
        return;
      }
      nowVal.value -= 10;
    } else {
      if (nowVal.value == 300) {
        return;
      }
      nowVal.value += 10;
    }
  };

  const jsonValue = () => {
    console.log(JSON.stringify(nodeConfig.value));
    workFlowStore.design.process = nodeConfig.value;
    // console.log(JSON.stringify(processConfig.value));
  };

  defineExpose({
    jsonValue,
  });
</script>
<style>
  @import '@/assets/styles/workflow.css';
  .error-modal-list {
    width: 455px;
  }
</style>
