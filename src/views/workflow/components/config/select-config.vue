<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 14:53:19
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\select-config.vue
 * @Description: 单选框/复选框 公共配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="select-config">
    <el-form-item label="选项配置">
      <el-tabs
        v-model="activeName"
        @tab-change="handleTabChange"
        type="border-card"
        class="select-tabs"
      >
        <el-tab-pane label="静态" name="static">
          <draggable
            :list="_formItem.props.options"
            item-key=""
            group="option"
            handler=".select-icon"
            :options="{ animation: 300, sort: true }"
          >
            <template #item="{ index }">
              <div class="select-option">
                <i class="select-icon iconfont icon-tuozhuai"></i>
                <el-input v-model="_formItem.props.options[index]">
                  <template #append>
                    <el-button text @click="removeOption(index)">
                      <i class="iconfont icon-shanchu"></i>
                    </el-button>
                  </template>
                </el-input>
              </div>
            </template>
          </draggable>
          <div class="select-option">
            <el-button text type="primary" @click="addOption">添加选项</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="字典" name="dict">
          <el-select
            v-model="_formItem.props.dictType"
            placeholder="请选择字典"
            @change="handleDictChange"
            style="width: 100%"
          >
            <el-option
              v-for="item in _dictList"
              :key="item.id"
              :label="item.dictName"
              :value="item.dictType"
            />
          </el-select>
        </el-tab-pane>
        <el-tab-pane label="动态" name="dynamic">
          <el-cascader
            v-model="_formItem.props.dynamic.value"
            :props="dynamicProps"
            :clearable="true"
            :show-all-levels="false"
            @change="handleDynamicChange"
          />
        </el-tab-pane>
      </el-tabs>
    </el-form-item>
    <el-form-item label="默认值">
      <el-select
        v-model="_formItem.value"
        :multiple="_formItem.valueType == 'Array'"
        @change="handelDefaultValue"
      >
        <el-option v-for="(item, i) in options" :key="i" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="是否展开">
      <el-switch v-model="_formItem.props.expand" />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { useAppStore } from '@/stores/modules/app';
  import { getDictDataList, isNotEmpty } from '@/utils';
  import { computed, PropType, ref, watch } from 'vue';
  import draggable from 'vuedraggable';
  import type { CascaderProps } from 'element-plus';
  import { appFormTreeApi } from '@/api/workflow/app';
  import { ResultEnum } from '@/enums/httpEnum';
  import { formInfoByCodeApi } from '@/api/workflow/form';
  import { flatFormItems } from '@/utils/workflow';
  import { instanceListByCodeApi } from '@/api/workflow/process';

  const emits = defineEmits(['update:formItem']);
  const props = defineProps({
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: () => {},
    },
  });

  // 字典
  const appStore = useAppStore();
  // 页签名称
  const activeName = ref<string>('');
  // 选项
  const options = ref<any[]>([]);
  // 动态表单树
  const treeNodes = ref<WorkComponent.TreeNode[]>([]);
  // 动态表单项
  const dynamicFormItems = ref<WorkComponent.TreeNode[]>([]);

  /**
   * @description: 添加选项
   * @return {*}
   */
  const addOption = () => {
    const len = props.formItem.props.options.length + 1;
    props.formItem.props.options.push('选项' + len);
  };

  /**
   * @description: 删除选项
   * @param {number} index 下标
   * @return {*}
   */
  const removeOption = (index: number) => {
    props.formItem.props.options.splice(index, 1);
  };

  /**
   * @description: 获取字典列表
   * @return {*}
   */
  const getDictOptions = async () => {
    const dataList = await getDictDataList(appStore.dictList, _formItem.value.props.dictType);
    options.value = dataList.map((item) => {
      return {
        label: item.dictLabel,
        value: item.dictLabel,
      };
    });
  };

  /**
   * @description: 字典类型变化
   * @return {*}
   */
  const handleDictChange = async () => {
    // 获取字典选项
    await getDictOptions();
    // 选项变化清除默认值
    _formItem.value.value = null;
  };

  /**
   * @description: 级联面板配置
   * @return {*}
   */
  const dynamicProps: CascaderProps = {
    lazy: true,
    async lazyLoad(node, resolve) {
      const { level, value } = node;
      if (level == 0) {
        await appFormTreeApi().then((res) => {
          if (res.code === ResultEnum.SUCCESS) {
            treeNodes.value = res.data;
            const nodes = treeNodes.value.map((item) => {
              return {
                label: item.label,
                value: item.value,
                leaf: false,
              };
            });
            resolve(nodes);
          } else {
            resolve([]);
          }
        });
      } else if (level == 1) {
        const nodes = treeNodes.value.find((item) => item.value == value);
        if (nodes && nodes.children) {
          const children = nodes.children.map((item) => {
            return {
              label: item.label,
              value: item.value,
              leaf: false,
            };
          });
          resolve(children);
        } else {
          resolve([]);
        }
      } else if (level == 2) {
        const code = value + '';
        await formInfoByCodeApi(code).then((res) => {
          if (res.code === ResultEnum.SUCCESS) {
            dynamicFormItems.value = flatFormItems(res.data.formItems)
              .filter((item) => {
                return (
                  item.name === 'InputText' ||
                  item.name === 'InputTextarea' ||
                  item.name === 'InputNumber' ||
                  item.name === 'InputAmount' ||
                  (item.name === 'SelectSingle' && item.props.type !== 'dynamic')
                );
              })
              .map((item) => {
                return {
                  label: item.title,
                  value: item.id,
                  leaf: true,
                };
              });
            resolve(dynamicFormItems.value);
          } else {
            resolve([]);
          }
        });
      } else {
        resolve([]);
      }
    },
  };

  /**
   * @description: 获取动态选项
   * @return {*}
   */
  const getDynamicOptions = async () => {
    if (
      isNotEmpty(_formItem.value.props.dynamic.value) &&
      _formItem.value.props.dynamic.value.length == 3
    ) {
      await instanceListByCodeApi(_formItem.value.props.dynamic.value[1], '9').then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          if (res.data && res.data.length > 0) {
            options.value = res.data.map((item: Process.InstanceInfo) => {
              const fieldId = _formItem.value.props.dynamic.value[2];
              const label = item[fieldId];
              return {
                value: label,
                label: label,
              };
            });
          } else {
            options.value = [];
          }
        } else {
          options.value = [];
        }
      });
    } else {
      options.value = [];
    }
  };

  /**
   * @description: 级联面板值变化
   * @param {*} e 值
   * @return {*}
   */
  const handleDynamicChange = async (e: string[]) => {
    if (e && e.length == 3) {
      const item = dynamicFormItems.value.find((item) => item.value == e[2]);
      if (item) {
        _formItem.value.props.dynamic.label = item.label;
      }
    } else {
      _formItem.value.props.dynamic.label = '';
    }
    // 获取动态字段选项
    await getDynamicOptions();
    // 选项变化清除默认值
    _formItem.value.value = null;
  };

  // 当前组件
  const _formItem = computed({
    get() {
      return props.formItem;
    },
    set(val) {
      emits('update:formItem', val);
    },
  });

  // 字典列表
  const _dictList = computed(() => {
    return appStore.dictList;
  });

  // 监听页签变化
  const handleTabChange = async (val: string) => {
    activeName.value = val;
    _formItem.value.props.type = val;
    // 页签变化清除默认值
    _formItem.value.value = _formItem.value.valueType === 'Array' ? [] : '';
    if (val === 'static') {
      options.value = _formItem.value.props.options.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
    } else if (val === 'dict') {
      await getDictOptions();
    } else if (val === 'dynamic') {
      await getDynamicOptions();
    } else {
      options.value = [];
    }
  };

  /**
   * @description: 默认值变化
   * @param {*} e 值
   * @return {*}
   */
  const handelDefaultValue = (e: any) => {
    _formItem.value.value = e;
  };

  watch(
    () => _formItem.value.id,
    (val) => {
      if (val && isNotEmpty(val)) {
        handleTabChange(_formItem.value.props.type);
      }
    },
    { immediate: true, deep: true },
  );
</script>
<style scoped lang="scss">
  .select-config {
    .select-tabs {
      width: 100%;
    }
    .select-option {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 3px;
      color: #afadad;
    }

    .select-icon {
      padding: 3px;
      font-size: 20px !important;
    }
  }
</style>
