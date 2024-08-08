<template>
  <div>
    <div class="fd-nav-content">
      <section class="dingflow-design">
        <div class="zoom">
          <div class="zoom-out" :class="nowVal == 50 && 'disabled'" @click="zoomSize(1)"></div>
          <span>{{ nowVal }}%</span>
          <div class="zoom-in" :class="nowVal == 300 && 'disabled'" @click="zoomSize(2)"></div>
        </div>
        <div class="box-scale" :style="`transform: scale(${nowVal / 100});`">
          <nodeWrap
            v-if="isNotEmpty(_process)"
            v-model:nodeConfig="_process.nodeConfig"
            v-model:flowPermission="_process.flowPermission"
          />
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <errorDialog v-model:visible="tipVisible" :list="tipList" />
    <promoterDrawer />
    <approverDrawer :directorMaxLevel="_process.directorMaxLevel" />
    <copyerDrawer />
    <conditionDrawer ref="conditionRef" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { processStore } from '@/stores/modules/process';
  import errorDialog from '@/views/workflow/components/process/dialog/errorDialog.vue';
  import promoterDrawer from '@/views/workflow/components/process/drawer/promoterDrawer.vue';
  import approverDrawer from '@/views/workflow/components/process/drawer/approverDrawer.vue';
  import copyerDrawer from '@/views/workflow/components/process/drawer/copyerDrawer.vue';
  import conditionDrawer from '@/views/workflow/components/process/drawer/conditionDrawer.vue';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { isNotEmpty } from '@/utils';

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  const { setIsTried } = processStore();

  const tipList = ref<any>([]);
  const tipVisible = ref(false);
  const nowVal = ref(100);
  const nodeConfig = ref({});
  const conditionRef = ref();
  //

  const _process = computed(() => {
    return workFlowStore.design.process;
  });

  const reErr = ({ childNode }: any) => {
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
        for (let i = 0; i < conditionNodes.length; i++) {
          // 目前只有排他网关需要校验
          if (childNode.typeName == 'Exclusive') {
            if (conditionNodes[i].error) {
              tipList.value.push({ name: conditionNodes[i].nodeName, type: '条件' });
            } else if (childNode.typeName == 'Parallel') {
              // 暂时不需要处理
            } else if (childNode.typeName == 'Inclusive') {
              // 暂时不需要处理
            }
          }
          reErr(conditionNodes[i]);
        }
      }
    } else {
      childNode = null;
    }
  };
  /**
   * @description: 校验流程设计是否完善
   */
  const validate = async () => {
    return new Promise(async (resolve, reject) => {
      const errs: any[] = []; // 校验未通过时要呈现的err说明
      nodeConfig.value = _process.value.nodeConfig;
      setIsTried(true);
      conditionRef.value.validate(nodeConfig.value, errs); // 校验条件节点中的条件组、条件表达式是否完善
      tipList.value = [];
      reErr(nodeConfig.value);
      if (tipList.value.length == 0 && errs.length == 0) {
        resolve('ok');
      } else {
        tipList.value.forEach((v) => {
          errs.push(v.name + '节点- ' + v.type + ' 未设置');
        });
        reject(errs);
      }
    });
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
    // workFlowStore.design.process = nodeConfig.value;
    // console.log(JSON.stringify(processConfig.value));
  };

  defineExpose({
    jsonValue,
    validate,
  });
</script>
<style>
  @import '@/assets/styles/workflow.css';
  .error-modal-list {
    width: 455px;
  }
</style>
