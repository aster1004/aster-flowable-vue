<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-16 09:53:20
 * @FilePath: \aster-flowable-vue\src\views\workflow\design\design-header.vue
 * @Description: 设计页头部信息
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-row class="design-header">
    <el-col :span="6" class="header-left">
      <div class="p-10px">
        <el-button @click="back()" circle>
          <template #icon>
            <i class="iconfont icon-xiangzuo"></i>
          </template>
        </el-button>
      </div>
      <el-divider direction="vertical" />
      <div class="header-left__logo">
        <div class="pr-10px">
          <icon-select
            ref="iconSelectRef"
            v-model:icon="formInfo.icon"
            type="icon"
            :icon-style="iconStyle"
            :z-index="9999"
          />
        </div>
        <el-input ref="formNameRef" v-model="formInfo.formName"></el-input>
      </div>
    </el-col>
    <el-col :span="12" class="header-center">
      <el-menu :default-active="modelValue" @select="handleSelect" mode="horizontal">
        <el-menu-item index="formDesign">表单设计</el-menu-item>
        <el-menu-item index="processDesign">流程设计</el-menu-item>
        <el-menu-item index="listDesign">列表设计</el-menu-item>
        <el-menu-item index="formSettings">表单设置</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="6" class="header-right">
      <el-button @click="saveForm">
        <template #icon>
          <i class="iconfont icon-completed"></i>
        </template>
        {{ $t('button.save') }}
      </el-button>
      <el-button type="primary" @click="publishForm">
        <template #icon>
          <i class="iconfont icon-fabu"></i>
        </template>
        {{ $t('button.publish') }}
      </el-button>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { useRouter } from 'vue-router';
  import { computed, onMounted, PropType, ref } from 'vue';
  import IconSelect from '@/components/icon/icon-select.vue';
  import { isNotEmpty } from '@/utils';

  const workFlowStore = useWorkFlowStore();
  const router = useRouter();

  // 事件
  const emits = defineEmits(['update:modelValue', 'save', 'publish']);

  // props
  const props = defineProps({
    modelValue: {
      type: String as PropType<'formDesign' | 'processDesign' | 'listDesign' | 'formSettings'>,
      default: () => 'formDesign',
    },
  });

  // 注册组件
  const formNameRef = ref();

  /**
   * @description: 表单数据
   */
  const formInfo = computed(() => {
    return workFlowStore.design;
  });

  /**
   * @description: 图标样式
   */
  const iconStyle = computed(() => {
    if (isNotEmpty(formInfo.value.iconColor)) {
      return { color: '#fff', backgroundColor: formInfo.value.iconColor };
    } else {
      return {};
    }
  });

  /**
   * @description: 切换菜单
   */
  const handleSelect = (key: string) => {
    emits('update:modelValue', key);
  };

  /**
   * @description: 保存表单
   */
  const saveForm = () => {
    emits('save');
  };

  /**
   * @description: 发布表单
   */
  const publishForm = () => {
    emits('publish');
  };

  /**
   * @description: 返回
   */
  const back = () => {
    router.back();
  };

  onMounted(() => {
    // 聚焦表单名称
    formNameRef.value.focus();
  });
</script>
<style scoped lang="scss">
  .design-header {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-image: url(../../../assets/images/header_bg.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .header-left {
    display: flex;
    align-items: center;
    height: var(--el-menu-horizontal-height);
    padding-left: 20px;

    .el-divider--vertical {
      height: 60%;
      border-left: 1px var(--el-color-primary) var(--el-border-style);
    }

    &__logo {
      display: flex;
      align-items: center;
      margin-left: 10px;
      i {
        font-size: 20px;
        margin-right: 10px;
      }

      .el-input {
        --el-input-bg-color: none;
      }
      .el-input__wrapper {
        box-shadow: 0 1px 0 0 var(--el-input-border-color, var(--el-border-color));
        cursor: default;
        .el-input__inner {
          cursor: default !important;
        }
      }
    }
  }

  .header-center {
    min-width: 300px;
    display: flex;
    justify-content: center;

    .el-menu {
      width: 100%;
      display: flex;
      justify-content: center;
      background: none;
    }
    .el-menu--horizontal.el-menu {
      border: none;
    }

    .el-menu .el-menu-item:hover {
      outline: 0 !important;
      color: var(--el-color-primary) !important;
      background: none !important;
    }

    .el-menu .el-menu-item.is-active {
      outline: 0 !important;
      color: var(--el-color-primary) !important;
      background: none !important;
    }

    .el-menu-item.is-active::before {
      background: none !important;
    }
  }

  .el-container .el-header .el-menu .el-menu-item.is-active {
    color: var(--el-color-primary) !important;
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 40px;
  }
</style>
