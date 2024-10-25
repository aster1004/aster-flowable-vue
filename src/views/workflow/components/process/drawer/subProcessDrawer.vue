<!--
 * @Date: 2024-08-25 14:05:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-25 17:51:49
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\process\drawer\subProcessDrawer.vue
-->
<template>
  <el-drawer
    :append-to-body="true"
    v-model="visible"
    :show-close="false"
    :size="550"
    :before-close="saveSubProcess"
  >
    <template #header>
      <el-input
        v-if="editFlag"
        v-model="subProcessConfig.value.nodeName"
        placeholder="请输入节点名称"
        @blur="editFlag = false"
      />
      <div class="custom-title" v-else>
        <div>{{ _nodeName }}</div>
        <i class="iconfont icon-bianji icon-primary" @click="editFlag = true"></i>
      </div>
    </template>
    <el-form
      ref="nodeFormRef"
      style="max-width: 600px"
      :rules="[]"
      label-width="auto"
      label-position="top"
      status-icon
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="节点属性" name="nodeProps">
          <el-form-item label="节点ID" prop="id">
            <el-input readonly v-model="subProcessConfig.id" />
          </el-form-item>

          <el-form-item label="选择子流程">
            <el-cascader
              v-model="subProcessConfig.value.subProcessNode.subProcessCode"
              :options="treeNodes"
              :show-all-levels="false"
              clearable
              filterable
              placeholder="请选择所属表单"
              @change="handleNodeChange"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item>
            <template #label>
              <div style="display: flex; align-items: center">
                <el-tooltip
                  class="box-item"
                  effect="light"
                  :raw-content="true"
                  content="<span style='line-height:2'>• 同步：主流程等子流程完成后才可继续执行</br>• 异步：子流程中的任务将会异步发起，不影响主流程，</span>"
                  placement="left-start"
                >
                  <i class="iconfont icon-tishi" />
                </el-tooltip>
                <span class="ml-1">是否异步</span>
              </div>
            </template>
            <template #default>
              <el-radio-group v-model="subProcessConfig.value.subProcessNode.isAsync">
                <el-radio :value="false">同步</el-radio>
                <el-radio :value="true">异步</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
          <!--后期如果子流程需要支持多实例，则修改此处-->
          <!-- <el-form-item>
            <template #label>
              <div style="display: flex; align-items: center">
                <el-tooltip
                  class="box-item"
                  effect="light"
                  :raw-content="true"
                  content="<span style='line-height:2'>• 无：单实例顺序执行</br>• 并行：多实例并行执行</br>• 串行：多实例顺序执行</br></span>"
                  placement="left-start"
                >
                  <i class="iconfont icon-tishi" />
                </el-tooltip>
                <span class="ml-1">多实例</span>
              </div>
            </template>
            <template #default>
              <el-radio-group v-model="subProcessConfig.value.subProcessNode.multiInstanceType">
                <el-radio-button value="None">无</el-radio-button>
                <el-radio-button value="Prallel">并行</el-radio-button>
                <el-radio-button value="Sequential">串行</el-radio-button>
              </el-radio-group>
            </template>
          </el-form-item>-->

          <el-form-item label="子流程发起人" prop="approveUser">
            <el-radio-group v-model="subProcessConfig.value.subProcessNode.startUser.type">
              <el-radio :value="StartUserEnum.ROOT">同主流程发起人</el-radio>
              <el-radio :value="StartUserEnum.SELECT">指定人员</el-radio>
              <el-radio :value="StartUserEnum.FORM">从表单获取</el-radio>
            </el-radio-group>

            <!-- 指定人员 -->
            <el-input
              v-if="subProcessConfig.value.subProcessNode.startUser.type === StartUserEnum.SELECT"
              :value="approveUserText"
              readonly
              @click="openUserSelect"
            >
              <template #suffix>
                <i class="iconfont icon-xinzeng icon-primary" @click="openUserSelect" />
              </template>
            </el-input>

            <!-- 从表单获取 -->
            <template
              v-if="subProcessConfig.value.subProcessNode.startUser.type === StartUserEnum.FORM"
            >
              <el-select
                v-model="subProcessConfig.value.subProcessNode.startUser.value"
                placeholder="请选择表单字段"
                style="width: 240px"
              >
                <el-option
                  v-for="item in formList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
              <span class="ml-4" style="color: var(--el-text-color-secondary)">
                表单选人字段必须为必填且单选
              </span>
            </template>
          </el-form-item>

          <el-text class="mb-2" truncated>数据流转规则</el-text>
          <el-tabs type="border-card">
            <el-tab-pane>
              <template #label>
                <span class="custom-tabs-label">
                  <span>父流程 → 子流程</span>
                </span>
              </template>
              <el-text style="color: var(--el-text-color-secondary)">
                子流程启动前，从父流程传值给子流程
              </el-text>
              <el-row
                align="middle"
                class="content__item"
                :gutter="15"
                v-for="(item, i) in subProcessConfig.value.subProcessNode.parentToChild"
              >
                <el-col :span="8">
                  <el-select
                    v-model="subProcessConfig.value.subProcessNode.parentToChild[i].pFieldId"
                  >
                    <el-option
                      v-for="(item, index) in currentOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select v-model="subProcessConfig.value.subProcessNode.parentToChild[i].mode">
                    <el-option label="填充" value="fill"></el-option>
                    <el-option label="追加" value="append"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select
                    v-model="subProcessConfig.value.subProcessNode.parentToChild[i].cFieldId"
                  >
                    <el-option
                      v-for="(item, index) in subProcessOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-col>
                <el-col :span="2">
                  <i
                    class="iconfont icon-shanchu"
                    style="color: var(--el-color-error)"
                    @click="subProcessConfig.value.subProcessNode.parentToChild.splice(i, 1)"
                  >
                  </i>
                </el-col>
              </el-row>
              <div>
                <el-button type="text" @click="p2cAdd()">
                  <i class="iconfont icon-plus">继续添加</i>
                </el-button>
              </div>
            </el-tab-pane>

            <el-tab-pane>
              <template #label>
                <span>子流程 → 父流程</span>
              </template>
              <el-text style="color: var(--el-text-color-placeholder)">
                子流程正常结束后，将值回填或追加给父流程
              </el-text>
              <el-row
                align="middle"
                class="content__item"
                :gutter="15"
                v-for="(item, i) in subProcessConfig.value.subProcessNode.childToParent"
              >
                <el-col :span="8">
                  <el-select
                    v-model="subProcessConfig.value.subProcessNode.childToParent[i].cFieldId"
                  >
                    <el-option
                      v-for="(item, index) in subProcessOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select v-model="subProcessConfig.value.subProcessNode.childToParent[i].mode">
                    <el-option label="填充" value="fill"></el-option>
                    <el-option label="追加" value="append"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select
                    v-model="subProcessConfig.value.subProcessNode.childToParent[i].pFieldId"
                  >
                    <el-option
                      v-for="(item, index) in currentOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-col>
                <el-col :span="2">
                  <i
                    class="iconfont icon-shanchu"
                    style="color: var(--el-color-error)"
                    @click="subProcessConfig.value.subProcessNode.parentToChild.splice(i, 1)"
                  ></i>
                </el-col>
              </el-row>
              <div>
                <el-button type="text" @click="c2pAdd()">
                  <i class="iconfont icon-plus">继续添加</i>
                </el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="表单权限" name="formPermission">
          <form-permission
            v-model:value="subProcessConfig.value.formPermission"
            :headerConfig="headerConfig"
          />
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-drawer>
  <member-select
    ref="memberSelectRef"
    title="选择审批人"
    :type="['user']"
    :value="[]"
    @submit="handleSubmitMember"
  />
</template>
<script setup lang="ts">
  import { ref, computed, watch, onMounted, watchEffect } from 'vue';
  import { processStore } from '@/stores/modules/process';
  import { isNotEmpty, isEmpty, isUnDef, isDef } from '@/utils';
  import FormPermission from '../permission/form-permission.vue';
  import { getFormFieldData } from '@/utils/process/process';
  import { appFormTreeApi } from '@/api/workflow/app';
  import { formInfoByCodeApi } from '@/api/workflow/form';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus';
  import MemberSelect from '@/views/workflow/components/common/member-select.vue';
  import {
    formItemList,
    unSupportType,
    flatFormItemsExclude,
    dataFillOptionsByFormItems,
  } from '@/utils/workflow';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { StartUserEnum } from '@/enums/workFlowEnum';

  let store = processStore();
  let { setSubProcessConfig, setSubProcess } = store;
  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 编辑状态
  const editFlag = ref<boolean>(false);
  // 注册组件
  const memberSelectRef = ref();
  // 当前审核节点的配置
  const subProcessConfig = ref<any>({});

  // 表单树
  const treeNodes = ref<WorkComponent.TreeNode[]>([]);
  // store中的审核节点配置
  const subProcessConfig1 = computed(() => store.subProcessConfig1);
  // 目标表单信息
  const associatedFormInfo = ref<WorkForm.FormModel>();
  // 当前表单的选项
  const currentOptions = ref<WorkComponent.DataFillOption[]>([]);
  // 关联表单的表单选项
  const subProcessOptions = ref<WorkComponent.DataFillOption[]>([]);
  // 选中的子流程code
  const subProcessCode = ref('');
  // 审核节点标题
  const _nodeName = computed(() => {
    const config = JSON.parse(JSON.stringify(store.subProcessConfig1));
    if (config && config.value) {
      return config.value.nodeName;
    }
    return '';
  });

  const nodeUserList = ref([
    {
      id: '1',
      name: 'admin',
      type: 'user',
    },
  ]);
  // 审批人文本
  const approveUserText = computed(() => {
    console.log(subProcessConfig.value.value.subProcessNode.startUser);
    let val = subProcessConfig.value?.value.subProcessNode?.startUser.value;
    if (isNotEmpty(val)) {
      return val?.name;
    }
  });

  /**
   * @description: 表单组件
   * @return {*}
   */
  const formItems = computed(() => {
    return workFlowStore.design.formItems;
  });

  const subProcessDrawer = computed(() => store.subProcessDrawer);
  /**
   * @description: form表单数据
   * @return {*}
   */
  const formList = computed(() => {
    let nodes: WorkComponent.ComponentConfig[] = [];
    formItemList(formItems.value, nodes);
    //排除非必填组件 和 不支持的组件
    nodes = nodes.filter((node: WorkComponent.ComponentConfig) => {
      const flag = node.props.required === true && !unSupportType(node);
      if (node.valueType === 'User' || node.valueType === 'Dept') {
        return node.props.multiple === false && flag;
      }
      return flag;
    });

    console.log('form 表单条件列表：', nodes);
    return nodes;
  });
  const visible = computed({
    get() {
      return subProcessDrawer.value;
    },
    set() {
      closeDrawer();
    },
  });

  // 选中的tab
  const activeName = ref<string>('nodeProps');

  // 表单属性表格配置
  const headerConfig = ref({});

  /**
   * 保存审批节点信息
   */
  const saveSubProcess = () => {
    // 保存审批节点信息
    setSubProcessConfig({
      value: JSON.parse(JSON.stringify(subProcessConfig.value.value)),
      flag: true,
      id: subProcessConfig1.value.value.id,
    });
    closeDrawer();
  };

  /**
   * 关闭抽屉
   */
  const closeDrawer = () => {
    setSubProcess(false);
  };

  /**
   * 打开选择审批人
   */
  const openUserSelect = () => {
    memberSelectRef.value.init();
  };

  /**
   * @description: 显示应用表单树
   * @return {*}
   */
  const getTreeData = () => {
    appFormTreeApi().then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        treeNodes.value = res.data;
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 级联选中值变化
   * @param {string[]} val 选中的值
   * @return {*}
   */
  const handleNodeChange = (val: string[]) => {
    console.log(val);
    if (val && isNotEmpty(val) && val.length === 2) {
      // 父节点
      const parentNode = treeNodes.value.filter((node) => node.value === val[0])[0];
      // 当前节点信息
      const processNode = parentNode.children.filter((cNode) => cNode.value === val[1])[0];
      subProcessConfig.value.value.subProcessNode.subProcessCode = processNode.value;
      subProcessConfig.value.value.subProcessNode.subProcessName = processNode.label;
      subProcessCode.value = processNode.value;
    } else {
      // 值置空时, 需清空所有数据
      subProcessConfig.value.value.subProcessNode.subProcessCode = '';
      subProcessConfig.value.value.subProcessNode.subProcessName = '';
      subProcessCode.value = '';
    }
  };

  /**
   * 获取选中的审批人
   * @param val
   */
  const handleSubmitMember = (val: any) => {
    console.log(val);
    subProcessConfig.value.value.subProcessNode.startUser.value = val[0];
  };

  // 监听审核节点配置
  watch(
    () => subProcessConfig1.value,
    (val) => {
      console.info('初始化----------：', val);
      activeName.value = 'nodeProps';
      editFlag.value = false;
      subProcessConfig.value = JSON.parse(JSON.stringify(val));
      subProcessConfig.value.id = val.value.id;
      subProcessCode.value = subProcessConfig.value.value.subProcessNode.subProcessCode;
      headerConfig.value = {
        required: false,
        edit: false,
        hidden: false,
        readonly: false,
      };
      let formField = getFormFieldData(val);
      subProcessConfig.value.value.formPermission = JSON.parse(JSON.stringify(formField));
    },
  );
  watch(
    () => subProcessCode.value,
    (val) => {
      console.log('watch---', val);
      if (isDef(val) && isNotEmpty(val)) {
        console.log(val);
        currentOptions.value = dataFillOptionsByFormItems(formItems.value, true);
        getAssociatedFormInfo(val);
      }
    },
    { immediate: true, deep: true },
  ); /*watchEffect(() => {
    console.log('watcheffect');

    //加载目标表单信息
    /!*if (isNotEmpty(subProcessConfig.value.value?.subProcessNode?.subProcessCode)) {
      console.log(subProcessConfig.value.value.subProcessNode.subProcessCode);
      currentOptions.value = dataFillOptionsByFormItems(formItems.value, true);
      getAssociatedFormInfo(subProcessConfig.value.value.subProcessNode.subProcessCode);
    }*!/
  });*/
  // 父到子添加
  const p2cAdd = () => {
    subProcessConfig.value.value.subProcessNode.parentToChild.push({
      cFieldId: '',
      pFieldId: '',
      mode: 'fill',
    });
  };
  // 父到子添加
  const c2pAdd = () => {
    subProcessConfig.value.value.subProcessNode.childToParent.push({
      cFieldId: '',
      pFieldId: '',
      mode: 'fill',
    });
  };

  /**
   * @description: 获取关联表单信息
   * @return {*}
   */
  const getAssociatedFormInfo = async (code: string) => {
    await formInfoByCodeApi(code).then(async (res) => {
      if (res.code == ResultEnum.SUCCESS) {
        associatedFormInfo.value = res.data;
        subProcessOptions.value = dataFillOptionsByFormItems(
          associatedFormInfo.value?.formItems,
          false,
        );
        console.log(associatedFormInfo.value);
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  onMounted(() => {
    getTreeData();
  });
</script>
<style scoped lang="scss">
  .custom-title {
    display: flex;
    justify-content: space-between;
  }
  .icon-bianji {
    cursor: pointer;
  }
  .el-cascader-node {
    max-width: 300px;
  }

  .el-row {
    margin-top: 15px;
    margin-left: 0px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .content__item {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
