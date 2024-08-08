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
        <el-tab-pane label="节点属性" name="nodeProps">
          <el-form-item label="节点ID" prop="id">
            <el-input readonly v-model="approverConfig.id" />
          </el-form-item>
          <el-form-item label="审核人" prop="approveUser">
            <el-input :value="approveUserText" readonly @click="openUserSelect">
              <template #suffix>
                <i class="iconfont icon-xinzeng icon-primary" @click="openUserSelect" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="审批人为空时">
            <el-select v-model="approverConfig.value.noUser" placeholder="请选择">
              <el-option
                v-for="item in noUserOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="多人审批时审批方式">
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
        <el-tab-pane label="表单权限" name="formPermission">
          <form-permission
            v-model:value="approverConfig.value.formPermission"
            :headerConfig="headerConfig"
          />
        </el-tab-pane>
        <el-tab-pane label="操作按钮" name="buttonPermission">
          <button-permission v-model:value="approverConfig.value.buttonPermission" />
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- <template #footer>
      <el-button type="primary" @click="saveApprover">确 定</el-button>
      <el-button @click="closeDrawer">取 消</el-button>
    </template> -->
    <range
      title="选择审批人"
      :visible="rangeVisible"
      v-if="rangeVisible"
      @submit="handleRange"
      @closeRange="closeRange"
      :value="approverConfig.value.nodeUserList"
    />
  </el-drawer>
</template>
<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { processStore } from '@/stores/modules/process';
  import Range from '../../render/range.vue';
  import { isNotEmpty } from '@/utils';
  import FormPermission from '../permission/form-permission.vue';
  import ButtonPermission from '../permission/button-permission.vue';
  import { getFormFieldData } from '@/utils/process/process';

  let store = processStore();
  let { setApproverConfig, setApprover } = store;

  // 编辑状态
  const editFlag = ref<boolean>(false);

  // 人员选择
  const rangeVisible = ref<boolean>(false);

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
          } else {
            return '';
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
      console.info('初始化：', JSON.stringify(val));
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
  const handleRange = (val: any) => {
    let expression = '';
    if (isNotEmpty(val)) {
      expression = val
        .map((v) => {
          if (v.type === 'user') {
            return '{用户：' + v.name + '}';
          } else if (v.type === 'dept') {
            return '{部门：' + v.name + '}';
          } else {
            return '';
          }
        })
        .join(',');
    }
    console.info('选中人的文本：', expression);
    approverConfig.value.value.nodeUserList = val;
  };

  // 按钮数据
  /* const nodeButtonData = ref([
    {
      operation: '同意',
      name: 'agree',
      status: true,
    },
    {
      operation: '不同意',
      name: 'disagree',
      status: true,
    },
    {
      operation: '撤销',
      name: 'revoke',
      status: true,
    },
    {
      operation: '转交',
      name: 'forward',
      status: true,
    },
    {
      operation: '加签',
      name: 'addNode',
      status: true,
    },
  ]); */

  // 发起节点按钮数据
  /* const rootButtonData = ref([
    {
      operation: '提交',
      name: 'submit',
      status: true,
    },
  ]); */

  // 表单属性表格配置
  const headerConfig = ref({});

  // 操作按钮数据
  /* const getButtonData = (val: any) => {
    console.info('bbbbbbbbbbbbbbbbb', val);
    let buttonPermission = val.value.buttonPermission;
    console.info('buttonPermission:--------------->', buttonPermission);
    let type = val.value.type;
    if (isNotEmpty(buttonPermission)) {
      if (type == 0) {
        rootButtonData.value.forEach((buttonItem: any) => {
          for (let i = 0; i < buttonPermission.length; i++) {
            let item: any = buttonPermission[i];
            if (buttonItem.name == item.name) {
              buttonItem.status = item.status;
            }
          }
        });
        return rootButtonData.value;
      } else {
        nodeButtonData.value.forEach((buttonItem: any) => {
          for (let i = 0; i < buttonPermission.length; i++) {
            let item: any = buttonPermission[i];
            if (buttonItem.name == item.name) {
              buttonItem.status = item.status;
            }
          }
        });
        return nodeButtonData.value;
      }
    } else {
      return type == 0 ? rootButtonData.value : nodeButtonData.value;
    }
  }; */

  /**
   * 保存审批节点信息
   */
  const saveApprover = () => {
    let nodeUserList = approverConfig.value.value.nodeUserList;
    // 是否会签, 会签是2, 非会签是1
    approverConfig.value.value.examineMode =
      isNotEmpty(nodeUserList) && nodeUserList.length > 1 ? 2 : 1;
    console.info('保存审批节点信息：', JSON.stringify(approverConfig.value.value));
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
    rangeVisible.value = true;
  };

  /**
   * 关闭审批人
   */
  const closeRange = () => {
    rangeVisible.value = false;
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
