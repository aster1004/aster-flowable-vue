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
          <nodeWrap v-if="isNotEmpty(_process)" v-model:nodeConfig="_process" />
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">{{ $t('workflow.process.processCompleted') }}</div>
          </div>
        </div>
      </section>
    </div>
    <errorDialog v-model:visible="tipVisible" :list="tipList" />
    <promoterDrawer />
    <approverDrawer />
    <copyerDrawer />
    <conditionDrawer ref="conditionRef" />
    <subProcessDrawer />
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
  import subProcessDrawer from '@/views/workflow/components/process/drawer/subProcessDrawer.vue';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { isNotEmpty, isEmpty, isDef } from '@/utils';
  import { ProcessNodeTypeEnum } from '@/enums/workFlowEnum';
  import { setAllNodeFormPermission, getProcessNodesByType } from '@/utils/process/process';

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  const { setIsTried } = processStore();

  const tipList = ref<any>([]);
  const tipVisible = ref(false);
  const nowVal = ref(100);
  const nodeConfig = ref({});
  const conditionRef = ref();
  //

  const _process = computed({
    get() {
      return workFlowStore.design.process;
    },
    set(value) {
      workFlowStore.design.process = value;
    },
  });

  const reErr = ({ childNode }: any) => {
    if (childNode) {
      let { type, /*error, nodeName, */ conditionNodes } = childNode;
      /* if (type == 1 || type == 2) {
        if (error) {
          tipList.value.push({
            name: nodeName,
            type: ['', '审核人', '抄送人'][type],
          });
        }
        reErr(childNode);
      } else  */
      if (type == 3) {
        reErr(childNode);
      } else if (type == 4) {
        reErr(childNode);
        for (let i = 0; i < conditionNodes.length; i++) {
          // 目前只有排他网关和包容网关需要校验
          if (childNode.typeName === 'Exclusive' || childNode.typeName === 'Inclusive') {
            if (conditionNodes[i].error) {
              tipList.value.push({ name: conditionNodes[i].nodeName, type: '条件' });
            }
          } else if (childNode.typeName === 'Parallel') {
            // 并行网关不需要设置条件，不需要校验
          }
          reErr(conditionNodes[i]);
        }
      }
    } else {
      childNode = null;
    }
  };

  const validateRootAndApprove = async (errs: string[]) => {
    setAllNodeFormPermission();
    let nodes = getProcessNodesByType([ProcessNodeTypeEnum.ROOT, ProcessNodeTypeEnum.APPROVE]);
    if (isNotEmpty(nodes)) {
      nodes.forEach((node: any) => {
        node.error = false;
        node['errorTip'] = '';
        // 表单权限
        let nodeFormPermission = node.formPermission.filter((formField: any) => {
          return formField.operation.length > 0;
        });
        if (isEmpty(nodeFormPermission)) {
          node.error = true;
          let errorMsg = node.nodeName + '节点表单权限未配置';
          errs.push(errorMsg);
          node.errorTip += errorMsg + '<br/>';
        }
        let nodeButtonPermission = node.buttonPermission.filter((buttonItem: any) => {
          return buttonItem.status == true;
        });
        if (isEmpty(nodeButtonPermission)) {
          node.error = true;
          let errorMsg = node.nodeName + '节点表操作权限未配置';
          errs.push(errorMsg);
          node.errorTip += errorMsg + '<br/>';
        }
        if (node.type != ProcessNodeTypeEnum.ROOT && isEmpty(node.nodeUserList)) {
          node.error = true;
          let errorMsg = node.nodeName + '节点';
          if (node.type == ProcessNodeTypeEnum.APPROVE) {
            errorMsg += '审批人未配置';
          } else if (node.type == ProcessNodeTypeEnum.SEND) {
            errorMsg += '抄送人未配置';
          } else {
            errorMsg += '操作人未配置';
          }
          errs.push(errorMsg);
          node.errorTip += errorMsg + '<br/>';
        }
      });
    }
  };

  /**
   * @description: 校验流程设计是否完善
   */
  const validate = async () => {
    return new Promise(async (resolve, reject) => {
      const errs: string[] = []; // 校验未通过时要呈现的err说明
      nodeConfig.value = _process.value;
      setIsTried(true);
      await validateRootAndApprove(errs);
      conditionRef.value.validate(nodeConfig.value, errs); // 校验条件节点中的条件组、条件表达式是否完善
      tipList.value = [];
      reErr(nodeConfig.value);
      //递归设置节点的parentId，保证父子节点id正确,第一次parentId，传root，确保第一层子节点不丢失parentId
      rectifyNodeId(nodeConfig.value, 'root');
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

  /**
   * @description: 发布前，递归设置节点的parentId，保证父子节点id正确
   * @param childNode
   * @param parentId
   */
  const rectifyNodeId = ({ childNode }: any, parentId = '') => {
    if (isDef(childNode) && isNotEmpty(childNode)) {
      let { id, type, conditionNodes } = childNode;
      childNode.parentId = parentId;
      if (type <= 3 || type == 8) {
        rectifyNodeId(childNode, id);
      } else if (type == 4) {
        if (conditionNodes) {
          for (let i = 0; i < conditionNodes.length; i++) {
            rectifyNodeId(conditionNodes[i], conditionNodes[i].id);
            //继续遍历下方节点
            if (isDef(conditionNodes[i].childNode) && isNotEmpty(conditionNodes[i].childNode)) {
              rectifyNodeId(conditionNodes[i].childNode, conditionNodes[i].childNode.id);
            }
          }
        }
        rectifyNodeId(childNode, id);
        // 继续遍历下方节点
        if (isDef(childNode.childNode) && isNotEmpty(childNode.childNode)) {
          rectifyNodeId(childNode.childNode, childNode.childNode.id);
        }
      }
    } else {
      childNode = null;
    }
  };
  const zoomSize = (type: number) => {
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

  defineExpose({
    validate,
  });
</script>
<style>
  @import '@/assets/styles/workflow.css';
  .error-modal-list {
    width: 455px;
  }
</style>
