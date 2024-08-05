<template>
  <div class="node-wrap" v-if="nodeConfig.type < 3">
    <div
      class="node-wrap-box"
      :class="
        (nodeConfig.type == 0 ? 'start-node ' : '') +
        (isTried && nodeConfig.error ? 'active error' : '')
      "
    >
      <div class="title" :style="`background: rgb(${bgColors[nodeConfig.type]});`">
        <span v-if="nodeConfig.type == 0">{{ nodeConfig.nodeName }}</span>
        <template v-else>
          <!-- <span class="iconfont">{{ nodeConfig.type == 1 ? '111' : '222' }}</span> -->
          <i
            :class="
              nodeConfig.type == 1
                ? ['iconfont', 'node-icon', 'icon-shenpi']
                : ['iconfont', 'node-icon', 'icon-chaosongwode']
            "
          ></i>
          <!-- @focus="$event.currentTarget.select()"
            v-focus -->
          <input
            v-if="isInput"
            type="text"
            class="ant-input editable-title-input"
            @blur="blurEvent()"
            v-model="nodeConfig.nodeName"
            :placeholder="defaultText"
          />
          <span v-else class="editable-title" @click="clickEvent()">{{ nodeConfig.nodeName }}</span>
          <i class="iconfont icon-close node-close" @click="delNode"></i>
          <!-- <i class="anticon anticon-close close" @click="delNode"></i> -->
        </template>
      </div>
      <div class="content" @click="setPerson">
        <span class="text">
          <span class="placeholder" v-if="!showText">请选择{{ defaultText }}</span>
          {{ showText }}
        </span>
        <i class="iconfont icon-xiangyou"></i>
      </div>
      <div class="error_tip" v-if="isTried && nodeConfig.error">
        <i class="iconfont icon-cuowutishi" style="color: #f25643; font-size: 24px"></i>
      </div>
    </div>
    <addNode v-model:childNodeP="nodeConfig.childNode" />
  </div>
  <div class="branch-wrap" v-if="nodeConfig.type == 4">
    <div class="branch-box-wrap">
      <div class="branch-box">
        <button class="add-branch" @click="addTerm(nodeConfig.typeName)">添加条件</button>
        <div class="col-box" v-for="(item, index) in nodeConfig.conditionNodes" :key="index">
          <condition-node
            :isTried="isTried"
            :conditionNode="item"
            :typeName="nodeConfig.typeName"
            :index="index"
            :content="conditionStr(nodeConfig, index)"
            :nodeCount="nodeConfig.conditionNodes.length"
            @setPerson="setPerson"
            @delTerm="delTerm"
            @arrTransfer="arrTransfer"
          />

          <nodeWrap v-if="item.childNode" v-model:nodeConfig="item.childNode" />
          <template v-if="index == 0">
            <div class="top-left-cover-line"></div>
            <div class="bottom-left-cover-line"></div>
          </template>
          <template v-if="index == nodeConfig.conditionNodes.length - 1">
            <div class="top-right-cover-line"></div>
            <div class="bottom-right-cover-line"></div>
          </template>
        </div>
      </div>
      <addNode v-model:childNodeP="nodeConfig.childNode" />
    </div>
  </div>
  <nodeWrap v-if="nodeConfig.childNode" v-model:nodeConfig="nodeConfig.childNode" />
</template>
<script setup>
  import { onMounted, ref, watch, getCurrentInstance, computed } from 'vue';
  import $func from '@/utils/fun';
  import { conditionStr } from '@/utils/ConditionCompare';
  import { useStore } from '@/stores/index';
  import { bgColors, placeholderList } from '@/utils/const';
  import ConditionNode from '@/views/workflow/components/process/process/conditionNode.vue';
  const _uid = getCurrentInstance().uid;
  const store = useStore();
  const {
    setPromoter,
    setApprover,
    setCopyer,
    setCondition,
    setFlowPermission,
    setApproverConfig,
    setCopyerConfig,
    setConditionsConfig,
  } = store;
  const emits = defineEmits(['update:flowPermission', 'update:nodeConfig']);
  const props = defineProps({
    nodeConfig: {
      type: Object,
      default: () => ({}),
    },
    flowPermission: {
      type: Object,
      default: () => [],
    },
  });

  const isInputList = ref([]);
  const isInput = ref(false);

  const defaultText = computed(() => {
    return placeholderList[props.nodeConfig.type];
  });
  const showText = computed(() => {
    if (props.nodeConfig.type == 0) return $func.arrToStr(props.flowPermission) || '所有人';
    if (props.nodeConfig.type == 1) return $func.setApproverStr(props.nodeConfig);
    return $func.copyerStr(props.nodeConfig);
  });

  const isTried = computed(() => {
    store.isTried;
  });
  const flowPermission1 = computed(() => {
    store.flowPermission1;
  });
  const approverConfig1 = computed(() => {
    JSON.parse(JSON.stringify(store.approverConfig1));
  });
  const copyerConfig1 = computed(() => {
    store.copyerConfig1;
  });
  const conditionsConfig1 = computed(() => {
    store.conditionsConfig1;
  });

  const resetConditionNodesErr = () => {
    for (let i = 0; i < props.nodeConfig.conditionNodes.length; i++) {
      props.nodeConfig.conditionNodes[i].error =
        conditionStr(props.nodeConfig, i) == '请设置条件' &&
        i != props.nodeConfig.conditionNodes.length - 1;
    }
  };
  watch(flowPermission1, (flow) => {
    if (flow.flag && flow.id === _uid) {
      emits('update:flowPermission', flow.value);
    }
  });
  watch(
    () => approverConfig1.value,
    (approver) => {
      if (approver.flag && approver.id === props.nodeConfig.id) {
        console.info('NodeWrap保存【' + approver.id + '】节点的值', JSON.stringify(approver.value));
        emits('update:nodeConfig', approver.value);
      }
    },
  );

  watch(copyerConfig1, (copyer) => {
    if (copyer.flag && copyer.id === _uid) {
      emits('update:nodeConfig', copyer.value);
    }
  });
  watch(conditionsConfig1, (condition) => {
    if (condition.flag && condition.id === _uid) {
      emits('update:nodeConfig', condition.value);
    }
  });

  const clickEvent = (index) => {
    if (index || index === 0) {
      isInputList.value[index] = true;
    } else {
      isInput.value = true;
    }
  };
  const blurEvent = (index) => {
    if (index || index === 0) {
      isInputList.value[index] = false;
      props.nodeConfig.conditionNodes[index].nodeName =
        props.nodeConfig.conditionNodes[index].nodeName || '条件';
    } else {
      isInput.value = false;
      props.nodeConfig.nodeName = props.nodeConfig.nodeName || defaultText;
    }
  };
  const delNode = () => {
    emits('update:nodeConfig', props.nodeConfig.childNode);
  };
  /**
   * 添加条件,根据typeName类型处理
   * @param typeName，Exclusive：排他网关，Parallel：并行网关，Inclusive：包容网关
   */
  const addTerm = (typeName) => {
    let len = props.nodeConfig.conditionNodes.length;
    switch (typeName) {
      case 'Exclusive':
        // 插入到默认节点的前边
        props.nodeConfig.conditionNodes.splice(len - 1, 0, {
          nodeName: '条件' + len,
          icon: 'iconfont icon-bumen',
          type: 3,
          priorityLevel: len,
          groupType: 'OR', // 组之间的，逻辑类型，OR-或，AND-与
          isDefault: false,
          conditionGroups: [
            {
              groupType: 'AND', // 组内之间逻辑类型，OR-或，AND-与
              conditionList: [],
            },
          ],
          nodeUserList: [],
          childNode: null,
        });
        //同事更新默认节点的优先级
        props.nodeConfig.conditionNodes[len].priorityLevel = len + 1;
        break;
      case 'Parallel':
        // 并行分支无默认节点，正常push即可
        props.nodeConfig.conditionNodes.push({
          nodeName: '并行分支' + (len + 1),
          icon: 'iconfont icon-jiekou',
          isDefault: false,
          type: 5,
          priorityLevel: 1, // 并行分支无优先级，默认都为1
          childNode: null,
        });
        break;
      case 'Inclusive':
        // 插入到默认节点的前边
        props.nodeConfig.conditionNodes.splice(len - 1, 0, {
          nodeName: '包容分支' + len,
          icon: 'iconfont icon-liucheng1',
          type: 6,
          priorityLevel: len,
          groupType: 'OR', // 组之间的，逻辑类型，OR-或，AND-与
          isDefault: false,
          conditionGroups: [
            {
              groupType: 'AND', // 组内之间逻辑类型，OR-或，AND-与
              conditionList: [],
            },
          ],
          nodeUserList: [],
          childNode: null,
        });
        props.nodeConfig.conditionNodes[len].priorityLevel = len + 1;
        break;
    }

    resetConditionNodesErr();
    emits('update:nodeConfig', props.nodeConfig);
  };
  const delTerm = (index) => {
    const { typeName } = props.nodeConfig;
    props.nodeConfig.conditionNodes.splice(index, 1);
    let conditionTitle = '条件';
    if (typeName == 'Parallel') {
      conditionTitle = '并行分支';
    } else if (typeName === 'Inclusive') {
      conditionTitle = '包容分支';
    }
    props.nodeConfig.conditionNodes.map((item, index) => {
      item.priorityLevel = index + 1;
      item.nodeName = conditionTitle + (index + 1);
      // 如果是默认节点
      if (item.isDefault) {
        item.nodeName = '默认节点';
      }
    });
    resetConditionNodesErr();
    emits('update:nodeConfig', props.nodeConfig);
    if (props.nodeConfig.conditionNodes.length == 1) {
      if (props.nodeConfig.childNode) {
        if (props.nodeConfig.conditionNodes[0].childNode) {
          reData(props.nodeConfig.conditionNodes[0].childNode, props.nodeConfig.childNode);
        } else {
          props.nodeConfig.conditionNodes[0].childNode = props.nodeConfig.childNode;
        }
      }
      emits('update:nodeConfig', props.nodeConfig.conditionNodes[0].childNode);
    }
  };
  const reData = (data, addData) => {
    if (!data.childNode) {
      data.childNode = addData;
    } else {
      reData(data.childNode, addData);
    }
  };
  const setPerson = (priorityLevel, isDefault = false) => {
    const { type, typeName } = props.nodeConfig;
    console.info('nodeConfig：', props.nodeConfig);
    console.info('type：', type);
    if (type == 0) {
      setPromoter(true);
      setFlowPermission({
        value: props.flowPermission,
        flag: false,
        id: _uid,
      });
    } else if (type == 1) {
      setApprover(true);
      setApproverConfig({
        value: {
          ...JSON.parse(JSON.stringify(props.nodeConfig)),
          ...{ settype: props.nodeConfig.settype ? props.nodeConfig.settype : 1 },
        },
        flag: false,
        id: _uid,
      });
    } else if (type == 2) {
      setCopyer(true);
      setCopyerConfig({
        value: JSON.parse(JSON.stringify(props.nodeConfig)),
        flag: false,
        id: _uid,
      });
    } else {
      // 排他网关和包容网关
      if (typeName === 'Exclusive' || typeName === 'Inclusive') {
        //判断是否为默认节点，如果是默认节点则不能进行条件配置
        if (!isDefault) {
          setCondition(true);
          setConditionsConfig({
            value: JSON.parse(JSON.stringify(props.nodeConfig)),
            priorityLevel,
            flag: false,
            id: _uid,
          });
        }
      } else if (typeName == 'Parallel') {
        // 并行网关
        ElMessage.warning('该节点无需配置！');
      }
    }
  };
  const arrTransfer = (index, type = 1) => {
    //向左-1,向右1
    props.nodeConfig.conditionNodes[index] = props.nodeConfig.conditionNodes.splice(
      index + type,
      1,
      props.nodeConfig.conditionNodes[index],
    )[0];
    props.nodeConfig.conditionNodes.map((item, index) => {
      item.priorityLevel = index + 1;
    });
    resetConditionNodesErr();
    emits('update:nodeConfig', props.nodeConfig);
  };

  onMounted(() => {
    if (props.nodeConfig.type == 1) {
      props.nodeConfig.error = !$func.setApproverStr(props.nodeConfig);
    } else if (props.nodeConfig.type == 2) {
      props.nodeConfig.error = !$func.copyerStr(props.nodeConfig);
    } else if (props.nodeConfig.type == 4) {
      // type == 4 网关节点
      resetConditionNodesErr();
    }
  });
</script>
<style>
  .error_tip {
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translate(150%, 0px);
    font-size: 24px;
  }

  .promoter_person .el-dialog__body {
    padding: 10px 20px 14px 20px;
  }

  .selected_list {
    margin-bottom: 20px;
    line-height: 30px;
  }

  .selected_list span {
    margin-right: 10px;
    padding: 3px 6px 3px 9px;
    line-height: 12px;
    white-space: nowrap;
    border-radius: 2px;
    border: 1px solid rgba(220, 220, 220, 1);
  }

  .selected_list img {
    margin-left: 5px;
    width: 7px;
    height: 7px;
    cursor: pointer;
  }

  .node-icon {
    margin-left: -5px;
  }

  .node-close {
    position: absolute;
    right: 10px;
  }

  .condition-node-close {
    position: absolute;
    top: -10px;
    right: -10px;
  }
</style>
