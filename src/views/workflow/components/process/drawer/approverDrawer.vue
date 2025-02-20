<template>
  <el-drawer
    :append-to-body="true"
    v-model="visible"
    :show-close="false"
    :size="550"
    :before-close="saveApprover"
  >
    <template #header>
      <el-input
        v-if="editFlag"
        v-model="approverConfig.value.nodeName"
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
        <el-tab-pane :label="t('workflow.process.nodeProperty')" name="nodeProps">
          <el-form-item :label="t('workflow.process.nodeId')" prop="id">
            <el-input readonly v-model="approverConfig.id" />
          </el-form-item>
          <el-form-item :label="t('workflow.process.nodeApprover')" prop="approveUser">
            <el-input :value="approveUserText" readonly @click="openUserSelect">
              <template #suffix>
                <i class="iconfont icon-xinzeng icon-primary" @click="openUserSelect" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item :label="t('workflow.process.approverEmpty')">
            <el-select v-model="approverConfig.value.noUser" placeholder="请选择">
              <el-option
                v-for="item in noUserOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('workflow.process.mutiApproverType')">
            <el-select v-model="approverConfig.value.approveType" placeholder="请选择">
              <el-option
                v-for="item in approveTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane :label="t('workflow.process.formPermission')" name="formPermission">
          <form-permission
            v-model:value="approverConfig.value.formPermission"
            :headerConfig="headerConfig"
          />
        </el-tab-pane>
        <el-tab-pane :label="t('workflow.process.buttonPermission')" name="buttonPermission">
          <button-permission v-model:value="approverConfig.value.buttonPermission" />
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <member-select
      ref="memberSelectRef"
      v-if="memberVisible"
      :title="t('workflow.process.selectApprover')"
      :value="approverConfig.value.nodeUserList"
      @submit="handleSubmitMember"
      @close="handleCloseMemberSelect"
    />
  </el-drawer>
</template>
<script setup lang="ts">
  import { ref, computed, watch, onMounted, nextTick } from 'vue';
  import { processStore } from '@/stores/modules/process';
  import MemberSelect from '../../common/member-select.vue';
  import { isNotEmpty } from '@/utils';
  import FormPermission from '../permission/form-permission.vue';
  import ButtonPermission from '../permission/button-permission.vue';
  import { getFormFieldData } from '@/utils/process/process';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  let store = processStore();
  let { setApproverConfig, setApprover } = store;

  // 编辑状态
  const editFlag = ref<boolean>(false);

  // 选择审核人
  const memberVisible = ref<boolean>(false);

  // 注册组件
  const memberSelectRef = ref();

  // 当前审核节点的配置
  const approverConfig = ref<any>({});

  // store中的审核节点配置
  const approverConfig1 = computed(() => store.approverConfig1);

  // 审核节点标题
  const _nodeName = computed(() => {
    const config = JSON.parse(JSON.stringify(store.approverConfig1));
    if (config && config.value) {
      return config.value.nodeName;
    }
    return '';
  });

  // 审批人文本
  const approveUserText = computed(() => {
    let expression = '';
    let val = approverConfig.value.value.nodeUserList;
    if (isNotEmpty(val)) {
      expression = val
        .map((v: any) => {
          if (v.type === 'user') {
            return '{用户：' + v.name + '}';
          } else if (v.type === 'dept') {
            return '{部门：' + v.name + '}';
          } else if (v.type === 'role') {
            return '{角色：' + v.name + '}';
          } else if (v.type === 'form') {
            return '{表单：' + v.name + '}';
          } else {
            return '未知';
          }
        })
        .join(',');
    }
    return expression;
  });

  // 监听审核节点配置
  watch(
    () => approverConfig1.value,
    (val) => {
      // console.info('初始化：', JSON.stringify(val));
      activeName.value = 'nodeProps';
      editFlag.value = false;
      approverConfig.value = JSON.parse(JSON.stringify(val));
      approverConfig.value.id = val.value.id;
      headerConfig.value = {
        required: false,
        edit: false,
        hidden: false,
        readonly: false,
      };
      let formField = getFormFieldData(val);
      approverConfig.value.value.formPermission = JSON.parse(JSON.stringify(formField));
      // let buttonData = getButtonData(val);
      // approverConfig.value.value.buttonPermission = JSON.parse(JSON.stringify(val.value.buttonPermission));
    },
  );

  let approverDrawer = computed(() => store.approverDrawer);

  // 没有人时节点处理方式
  const noUserOption = ref<Array<any>>([
    {
      value: 'autoPass',
      label: '自动通过',
    },
    {
      value: 'autoReject',
      label: '自动驳回',
    },
  ]);

  // 多人签批方式
  const approveTypeOption = ref<Array<any>>([
    {
      value: 'togetherCountersign',
      label: '会签(可同时审批，须全部同意)',
    },
    {
      value: 'orderCountersign',
      label: '会签(按选择顺序审批，须全部同意，不支持加签)',
    },
    {
      value: 'orSign',
      label: '或签(有一人同意即可)',
    },
  ]);

  let visible = computed({
    get() {
      return approverDrawer.value;
    },
    set() {
      closeDrawer();
    },
  });

  // 选中的tab
  const activeName = ref<string>('nodeProps');

  /**
   * 获取选中的审批人
   * @param val
   */
  const handleSubmitMember = (val: any) => {
    /* let expression = '';
    if (isNotEmpty(val)) {
      expression = val
        .map((v: any) => {
          if (v.type === 'user') {
            return '{用户：' + v.name + '}';
          } else if (v.type === 'dept') {
            return '{部门：' + v.name + '}';
          } else {
            return '';
          }
        })
        .join(',');
    } */
    // console.info('选中人的文本：', expression);
    approverConfig.value.value.nodeUserList = val;
  };

  // 表单属性表格配置
  const headerConfig = ref({});

  /**
   * 保存审批节点信息
   */
  const saveApprover = () => {
    let nodeUserList = approverConfig.value.value.nodeUserList;
    // 是否会签, 会签是2, 非会签是1
    approverConfig.value.value.examineMode =
      isNotEmpty(nodeUserList) && nodeUserList.length > 1 ? 2 : 1;
    // console.info('保存审批节点信息：', JSON.stringify(approverConfig.value.value));
    // 保存审批节点信息
    setApproverConfig({
      value: JSON.parse(JSON.stringify(approverConfig.value.value)),
      flag: true,
      id: approverConfig1.value.value.id,
    });
    closeDrawer();
  };

  /**
   * 关闭抽屉
   */
  const closeDrawer = () => {
    setApprover(false);
  };

  /**
   * 打开选择审批人
   */
  const openUserSelect = () => {
    memberVisible.value = true;
    nextTick(() => {
      memberSelectRef.value.init();
    });
  };

  /**
   * 关闭选择审批人
   */
  const handleCloseMemberSelect = () => {
    memberVisible.value = false;
  };

  onMounted(() => {});
</script>
<style lang="scss">
  .custom-title {
    display: flex;
    justify-content: space-between;
  }
  .icon-bianji {
    cursor: pointer;
  }
</style>
