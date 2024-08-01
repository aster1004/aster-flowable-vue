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
          <div class="condition-node">
            <div class="condition-node-box">
              <div class="auto-judge" :class="isTried && item.error ? 'error active' : ''">
                <div class="sort-left" v-if="index != 0" @click="arrTransfer(index, -1)">&lt;</div>
                <div class="title-wrapper">
                  <!-- @focus="$event.currentTarget.select()"
                    v-focus -->
                  <input
                    v-if="isInputList[index]"
                    type="text"
                    class="ant-input editable-title-input"
                    @blur="blurEvent(index)"
                    v-model="item.nodeName"
                  />

                  <span v-else class="editable-title" @click="clickEvent(index)">
                    <span :class="item.icon"></span>{{ item.nodeName }}</span
                  >
                  <span class="priority-title" @click="setPerson(item.priorityLevel)"
                    >优先级{{ item.priorityLevel }}</span
                  >
                  <i
                    class="iconfont icon-close condition-node-close"
                    v-if="!item.isDefault"
                    @click="delTerm(index)"
                  ></i>
                  <!-- <i class="anticon anticon-close close" @click="delTerm(index)"></i> -->
                </div>
                <div
                  class="sort-right"
                  v-if="index != nodeConfig.conditionNodes.length - 1"
                  @click="arrTransfer(index)"
                  >&gt;</div
                >
                <div class="content" @click="setPerson(item.priorityLevel, item.isDefault)">{{
                  conditionStr(nodeConfig, index)
                }}</div>
                <div class="error_tip" v-if="isTried && item.error">
                  <i class="iconfont icon-cuowutishi" style="color: #f25643; font-size: 24px"></i>
                </div>
              </div>
              <addNode v-model:childNodeP="item.childNode" />
            </div>
          </div>
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
  import { Lock } from '@element-plus/icons-vue';
  let _uid = getCurrentInstance().uid;

  let props = defineProps({
    nodeConfig: {
      type: Object,
      default: () => ({}),
    },
    flowPermission: {
      type: Object,
      default: () => [],
    },
  });
  let defaultText2 = computed(() => {
    console.log(props.nodeConfig.type);
    return props.nodeConfig.type;
  });
  let defaultText = computed(() => {
    console.log(props.nodeConfig);
    return placeholderList[props.nodeConfig.type];
  });
  let showText = computed(() => {
    if (props.nodeConfig.type == 0) return $func.arrToStr(props.flowPermission) || '所有人';
    if (props.nodeConfig.type == 1) return $func.setApproverStr(props.nodeConfig);
    return $func.copyerStr(props.nodeConfig);
  });

  let isInputList = ref([]);
  let isInput = ref(false);
  const resetConditionNodesErr = () => {
    console.log(props.nodeConfig);
    for (var i = 0; i < props.nodeConfig.conditionNodes.length; i++) {
      console.log('=========', props.nodeConfig.conditionNodes[i]);
      props.nodeConfig.conditionNodes[i].error =
        conditionStr(props.nodeConfig, i) == '请设置条件' &&
        i != props.nodeConfig.conditionNodes.length - 1;
    }
  };
  onMounted(() => {
    if (props.nodeConfig.type == 1) {
      props.nodeConfig.error = !$func.setApproverStr(props.nodeConfig);
    } else if (props.nodeConfig.type == 2) {
      props.nodeConfig.error = !$func.copyerStr(props.nodeConfig);
    } else if (props.nodeConfig.type == 4) {
      console.log(props.nodeConfig.conditionNodes.length);
      resetConditionNodesErr();
    }
  });
  let emits = defineEmits(['update:flowPermission', 'update:nodeConfig']);
  let store = useStore();
  let {
    setPromoter,
    setApprover,
    setCopyer,
    setCondition,
    setFlowPermission,
    setApproverConfig,
    setCopyerConfig,
    setConditionsConfig,
  } = store;
  let isTried = computed(() => store.isTried);
  let flowPermission1 = computed(() => store.flowPermission1);
  let approverConfig1 = computed(() => store.approverConfig1);
  let copyerConfig1 = computed(() => store.copyerConfig1);
  let conditionsConfig1 = computed(() => store.conditionsConfig1);
  watch(flowPermission1, (flow) => {
    if (flow.flag && flow.id === _uid) {
      emits('update:flowPermission', flow.value);
    }
  });
  watch(approverConfig1, (approver) => {
    if (approver.flag && approver.id === _uid) {
      emits('update:nodeConfig', approver.value);
    }
  });
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
        console.log(props.nodeConfig.conditionNodes);
        //同事更新默认节点的优先级
        props.nodeConfig.conditionNodes[len].priorityLevel = len + 1;
        break;
      case 'Parallel':
        // 并行分支无默认节点，正常push即可
        props.nodeConfig.conditionNodes.push({
          nodeName: '并行分支' + len,
          isDefault: false,
          type: 5,
          priorityLevel: len,
          childNode: null,
        });
        break;
      case 'Inclusive':
        // 插入到默认节点的前边
        props.nodeConfig.conditionNodes.splice(len - 1, 0, {
          nodeName: '包容分支' + len,
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
