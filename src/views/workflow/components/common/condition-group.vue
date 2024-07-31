<!--
 * @Author: lwj
 * @Date: 2024-07-19 09:53:47
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\condition-group.vue
 * @Description: 条件分支条件组组件
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="condition-group">
    <div>
      <el-text>{{ groupTitle }}</el-text>
      <div>
        <el-text style="margin-right: 10px">组内条件关系:</el-text>
        <el-switch
          v-model="_value.groupType"
          active-text="且"
          inactive-text="或"
          active-value="AND"
          inactive-value="OR"
        ></el-switch>
      </div>
      <div>
        <el-button link type="primary" :icon="Plus" @click="addCondition">添加条件</el-button>
        <el-button link type="danger" :icon="Delete" @click="$emit('delete')">删除</el-button>
      </div>
    </div>
    <div>
      <div class="cd-group-tip" v-if="_value.conditionList.length === 0">
        <el-text>请点击上方 + 添加条件选项</el-text>
      </div>
      <el-form label-position="top" label-width="100" class="group-item">
        <el-form-item v-for="(condition, i) in _value.conditionList" :key="condition.id">
          <el-text class="w-60px mb-2" truncated>{{ condition.title }}</el-text>
          <condition-item
            v-model:condition="_value.conditionList[i]"
            style="display: inline-block; width: calc(100% - 85px)"
          />
          <el-icon class="ico-del" @click="_value.conditionList.splice(i, 1)">
            <Delete />
          </el-icon>
        </el-form-item>
      </el-form>
    </div>
    <!--添加条件弹框-->
    <el-dialog title="选择条件" v-model="conditionVisible" :width="480" append-to-body>
      <el-checkbox-group v-model="checkedValue" value-key="id">
        <el-checkbox
          v-for="condition in formList"
          :label="condition.title"
          :value="condition"
          :key="condition.id"
        >
        </el-checkbox>
      </el-checkbox-group>
      <div class="condition-tip"
        >📢 表单字段设置为
        <span style="font-weight: bold; margin-top: 5px">必填</span> 即可作为条件</div
      >
      <i class="el-icon-plus" slot="reference"></i>

      <template #footer>
        <el-button @click="conditionVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureCondition">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, ref, computed, defineEmits } from 'vue';
  const emit = defineEmits(['update:conditionGroup', 'delete']);
  import ConditionItem from '@/views/workflow/components/common/condition-item.vue';
  import { formItemList } from '@/utils/workflow';
  import { Delete, Plus } from '@element-plus/icons-vue';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  const props = defineProps({
    groupTitle: {
      type: String,
      default: '',
    },
    conditionGroup: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });
  /*添加条件弹框*/
  const conditionVisible = ref(false);
  const checkedValue = ref([]);

  const _value = computed({
    get() {
      return props.conditionGroup;
    },
    set(val) {
      emit('update:conditionGroup', val);
    },
  });
  /**
   * @description: 表单组件
   * @return {*}
   */
  const formItems = computed(() => {
    return workFlowStore.design.formItems;
  });

  /**
   * @description: 排除不支持的组件
   * @param node
   */
  const unSupportType = (node: WorkComponent.ComponentConfig) => {
    return [
      'SelectMultiple', //下拉多选
      'UploadImage', //上传图片
      'UploadFile', //上传附件
      'AssociatedForm', // 关联表单
      'GeoLocation', //地理位置
      'Area', //行政区划
      'Signature', //手写签名
      'AssociatedProcess', //关联流程
    ].includes(node.name);
  };
  /**
   * @description: form表单数据
   * @return {*}
   */
  const formList = computed(() => {
    let nodes: WorkComponent.ComponentConfig[] = [];
    formItemList(formItems.value, nodes);
    //排除非必填组件 和 不支持的组件
    nodes = nodes.filter((node: WorkComponent.ComponentConfig) => {
      return node.props.required === true && !unSupportType(node);
    });

    if (nodes.length === 0 || nodes[0].id !== 'root') {
      nodes.unshift({
        id: 'root',
        icon: 'iconfont icon-yonghu',
        name: 'UserPicker',
        props: {},
        title: '发起人',
        value: [],
        valueType: 'User',
      });
    }
    console.log('form 表单条件列表：', nodes);
    return nodes;
  });
  const addCondition = () => {
    conditionVisible.value = true;
  };
  const sureCondition = () => {
    checkedValue.value.forEach((item: WorkComponent.ComponentConfig) => {
      _value.value.conditionList.push({
        id: item.id,
        name: item.name,
        title: item.title,
        value: item.value,
        valueType: item.valueType,
        props: item.props,
        compareVal: [], //目标值
        compare: '', //比较符
      });
    });
    console.log('条件组：', _value.value);
    checkedValue.value = []; //清空选中
    conditionVisible.value = false;
  };
</script>

<style scoped lang="scss">
  .condition-group {
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid var(--el-border-color);
    margin-bottom: 20px;

    .cd-group-tip {
      text-align: center;
      padding: 10px 0;
    }

    & > :first-child {
      padding: 0 5px;
      display: flex;
      align-items: center;
      background-color: var(--el-color-info-light-9);

      & > :first-child {
        flex: 1;
      }

      & > :nth-child(2) {
        display: flex;
        align-items: center;
        margin-right: 50px;
      }
    }

    & > :nth-child(2) {
      padding: 10px;
    }
  }
  :deep(.group-item) {
    .ico-del {
      color: var(--el-color-danger);
      margin: 5px 0 0 10px;
      cursor: pointer;
    }

    .el-form-item__label {
      margin-bottom: 0 !important;
    }
  }
</style>
