<!--
 * @Date: 2023-03-15 14:44:17
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-05-24 15:20:48
 * @FilePath: /Workflow-Vue3/src/components/drawer/conditionDrawer.vue
-->

<template>
  <el-drawer
    :append-to-body="true"
    title="条件设置"
    v-model="visible"
    class="condition_copyer"
    :show-close="false"
    :size="550"
    :before-close="saveCondition"
  >
    <template #header="{ titleId, titleClass }">
      <h3 :id="titleId" :class="titleClass" style="font-size: 17px">条件设置</h3>
      <el-select v-model="conditionConfig.priorityLevel" class="priority_level">
        <!--  默认条件优先级放到最后，故conditionsConfig.conditionNodes.length - 1  -->
        <template v-if="showPriorityLevel">
          <el-option
            v-for="item in conditionsConfig.conditionNodes.length - 1"
            :value="item"
            :key="item"
            :label="'优先级' + item"
          />
        </template>
      </el-select>
    </template>
    <el-form>
      <!-- 多条件组时，逻辑运算符才生效     -->
      <el-form-item label="条件组关系" v-if="visible && conditionConfig.conditionGroups.length > 1">
        <el-radio-group v-model="conditionConfig.groupType">
          <el-radio label="且" value="AND"></el-radio>
          <el-radio label="或" value="OR"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-button
        style="margin-bottom: 20px"
        link
        type="primary"
        :icon="Plus"
        @click="addConditionGroup"
        >添加条件组</el-button
      >
    </el-form>
    <!--  条件组  -->
    <condition-group
      v-for="(item, i) in conditionConfig.conditionGroups"
      v-model:conditionGroup="conditionConfig.conditionGroups[i]"
      :groupTitle="`条件组 ${i + 1}`"
      :key="i"
      @delete="delConditionGroup(i)"
    />
    <template #footer>
      <el-button type="primary" @click="saveCondition">确 定</el-button>
      <el-button @click="closeDrawer">取 消</el-button>
    </template>
  </el-drawer>
</template>
<script setup>
  import { ref, watch, computed } from 'vue';
  import { useStore } from '@/stores/index';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { Plus } from '@element-plus/icons-vue';
  import conditionGroup from '@/views/workflow/components/common/condition-group.vue';
  import { ElMessage } from 'element-plus';
  import { conditionStr } from '@/utils/ConditionCompare';
  import { isEmpty } from '@/utils/index';
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  /**
   * @description: 表单组件
   * @return {*}
   */
  const formItems = computed(() => {
    return workFlowStore.design.formItems;
  });
  const conditionsConfig = ref({
    conditionNodes: [],
  });
  const conditionConfig = ref({});
  const PriorityLevel = ref('');
  const conditions = ref([]);

  const store = useStore();
  const { setCondition, setConditionsConfig } = store;
  const tableId = computed(() => store.tableId);
  const conditionsConfig1 = computed(() => store.conditionsConfig1);
  const conditionDrawer = computed(() => store.conditionDrawer);

  const visible = computed({
    get() {
      return conditionDrawer.value;
    },
    set() {
      closeDrawer();
    },
  });

  watch(conditionsConfig1, (val) => {
    conditionsConfig.value = val.value;
    PriorityLevel.value = val.priorityLevel;
    conditionConfig.value = val.priorityLevel
      ? conditionsConfig.value.conditionNodes[val.priorityLevel - 1]
      : { nodeUserList: [] };
  });
  const showPriorityLevel = computed(() => {
    return conditionsConfig.value.conditionNodes?.length > 0;
  });
  const saveCondition = () => {
    closeDrawer();
    // 调整优先级顺序
    let a = conditionsConfig.value.conditionNodes.splice(PriorityLevel.value - 1, 1); //截取旧下标
    conditionsConfig.value.conditionNodes.splice(conditionConfig.value.priorityLevel - 1, 0, a[0]); //填充新下标
    conditionsConfig.value.conditionNodes.map((item, index) => {
      item.priorityLevel = index + 1;
    });
    for (let i = 0; i < conditionsConfig.value.conditionNodes.length; i++) {
      conditionsConfig.value.conditionNodes[i].error =
        conditionStr(conditionsConfig.value, i) == '请设置条件' &&
        i != conditionsConfig.value.conditionNodes.length - 1;
    }
    setConditionsConfig({
      value: conditionsConfig.value,
      flag: true,
      id: conditionsConfig1.value.id,
    });
  };

  const closeDrawer = (val) => {
    setCondition(false);
  };
  // 添加一个分组
  const addConditionGroup = () => {
    conditionConfig.value.conditionGroups.push({
      groupType: 'AND',
      conditionList: [],
    });
  };
  // 删除分组
  const delConditionGroup = (index) => {
    if (conditionConfig.value.conditionGroups.length < 2) {
      ElMessage.warning('至少保留一个条件组');
      return;
    }
    conditionConfig.value.conditionGroups.splice(index, 1);
  };
  // 递归校验条件组条件是否符合
  const handleError = ({ childNode }, errs) => {
    if (childNode) {
      let { type, typeName, conditionNodes } = childNode;
      // 递归处理条件节点
      if (type == 4) {
        if (conditionNodes.length > 0) {
          for (let i = 0; i < conditionNodes.length; i++) {
            handleError(conditionNodes[i], errs); //处理节点内的
            const conditionNode = conditionNodes[i];
            const isDefault = conditionNode.isDefault; // 是否为默认条件
            conditionNode.error = false;
            if (typeName == 'Exclusive' || typeName == 'Inclusive') {
              // 排除默认条件的校验
              if (conditionNode.conditionGroups.length === 0 && !isDefault) {
                conditionNode.error = true;
                errs.push(`条件 ${conditionNode.nodeName}未添加条件组`);
                // return;
              } else {
                for (let k = 0; k < conditionNode.conditionGroups.length; k++) {
                  const conditionList = conditionNode.conditionGroups[k].conditionList;
                  if (conditionList.length === 0) {
                    conditionNode.error = true;
                    errs.push(`${conditionNode.nodeName}-条件组 ${k + 1} 未添加条件`);
                    // return;
                  }
                  for (let i = 0; i < conditionList.length; i++) {
                    const cd = conditionList[i];
                    if (!cd.compare || hasEmpty(cd.compareVal || [])) {
                      conditionNode.error = true;
                      errs.push(
                        `${conditionNode.nodeName}-条件组 ${k + 1} 内条件未完善，请完善条件项: ${cd.title}`,
                      );
                      // return;
                    }
                  }
                }
              }
            } else if (typeName == 'Parallel') {
              // 处理并行网关校验
            }
            //校验下方节点， 排除默认条件的校验
            if (isEmpty(conditionNode.childNode) && !isDefault) {
              conditionNode.error = true;
              errs.push(`${conditionNode.nodeName} 下方分支未配置流程节点`);
            }
          }
        }
      }
      handleError(childNode, errs);
    } else {
      childNode = null;
    }
  };
  /**
   * @description: 校验条件组条件是否符合
   * @return {*}
   */
  const validate = (node, errs) => {
    console.log('-----流程设计-网关条件校验-----');
    handleError(node, errs);
  };
  const hasEmpty = (arr) => {
    return (
      arr.length === 0 ||
      arr.findIndex((v) => {
        return v === null || v === undefined || String(v).trim() === '';
      }) > -1
    );
  };
  defineExpose({ validate });
</script>
<style lang="scss">
  .condition_copyer {
    .priority_level {
      position: absolute;
      top: 11px;
      right: 30px;
      width: 200px;
      height: 32px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(217, 217, 217, 1);
      font-size: 12px;
    }
  }
</style>
