<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-13 15:20:41
 * @FilePath: \aster-flowable-vue\src\views\workflow\settings\print-template\index.vue
 * @Description: 打印模板
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="template-container">
    <div class="template-title">
      <span>打印模板</span>
      <div>
        <el-button type="info" link @click="printVisible = true"> 默认模板预览 </el-button>
        <el-button
          v-if="printTemplates && printTemplates.length > 0"
          type="primary"
          @click="handleAdd"
        >
          新增模板
        </el-button>
      </div>
    </div>
    <div class="template-main">
      <el-scrollbar
        v-if="printTemplates && isNotEmpty(printTemplates)"
        style="height: 100%; margin: 10px"
      >
        <div class="template-tip"> 说明：可以对表单内的字段进行自由的排版用于日常单据的打印 </div>
        <div
          class="template-content"
          v-for="(item, index) in printTemplates"
          :key="index"
          @mouseleave="handleMouseleave(item)"
          @mouseenter="handleMouseenter(item)"
        >
          <el-row class="p-15px text-sm">
            <el-col :span="2" class="!flex justify-center items-center">
              <span>{{ index + 1 }}</span>
            </el-col>
            <el-col
              :span="22"
              class="!flex justify-start items-cente"
              style="color: var(--el-text-color-primary)"
            >
              <span>{{ item.title }}</span>
            </el-col>
          </el-row>
          <div class="template-operation" v-show="showOperation(item)">
            <i class="iconfont icon-bianji1" @click="handleEdit(item)"></i>
            <i class="iconfont icon-guanbi1" @click="handleDelete(item)"></i>
          </div>
        </div>
      </el-scrollbar>
      <div class="template-empty" v-else>
        <el-empty :image-size="80">
          <template #description>
            <div class="template-empty-text">
              <span class="text-sm pb-5px">您还没添加任何自定义打印模板</span>
              <span class="text-xs pb-5px">可以对表单内的字段进行自由的排版用于日常单据的打印</span>
            </div>
          </template>
          <el-button type="primary" @click="handleAdd"> 立即设置 </el-button>
        </el-empty>
      </div>
    </div>

    <el-dialog
      v-model="designVisible"
      :title="selectedTemplate.title"
      :show-close="false"
      :lock-scroll="false"
      fullscreen
    >
      <template #header>
        <div class="design-dialog--header">
          <div class="pl-5px">
            <el-input v-if="isEditTitle" v-model="designTitle" clearable style="min-width: 290px" />
            <span v-else>
              {{ designTitle }}
            </span>
          </div>
          <div>
            <i class="iconfont icon-bianji1" v-if="!isEditTitle" @click="isEditTitle = true"></i>
            <i class="iconfont icon-completed" v-else @click="isEditTitle = false"></i>
          </div>
        </div>
      </template>
      <print-template-design v-model:value="selectedTemplate.templateContent" />
      <template #footer>
        <el-button type="primary" @click="handleSubmitTemplate">
          {{ $t('button.confirm') }}
        </el-button>
        <el-button @click="designVisible = false">{{ $t('button.cancel') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref } from 'vue';
  import PrintTemplateDesign from './print-template-design.vue';
  import { isNotEmpty } from '@/utils';
  import { generateFieldId } from '@/utils/workflow';
  import { ElMessageBox } from 'element-plus';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 是否显示设计模板
  const designVisible = ref<boolean>(false);
  // 是否编辑模板标题
  const isEditTitle = ref<boolean>(false);
  // 模板标题
  const designTitle = ref<string>('');
  // 是否显示打印预览
  const printVisible = ref<boolean>(false);
  // 选中的模板
  const selectedTemplate = ref<WorkForm.PrintTemplate>({
    id: '',
    title: '自定义模板',
    templateContent: '',
  });
  // 选中模板ID
  const selectedTemplateId = ref('');

  /**
   * @description: 保存打印模板
   * @return {*}
   */
  const handleSubmitTemplate = () => {
    selectedTemplate.value.title = designTitle.value;
    if (printTemplates.value) {
      if (isNotEmpty(selectedTemplate.value.id)) {
        const content = printTemplates.value.find(
          (item) => selectedTemplate.value && item.id === selectedTemplate.value.id,
        );
        if (content) {
          content.title = selectedTemplate.value.title;
          content.templateContent = selectedTemplate.value.templateContent;
        } else {
          printTemplates.value.push(selectedTemplate.value);
        }
      } else {
        if (isNotEmpty(selectedTemplate.value.templateContent)) {
          selectedTemplate.value.id = generateFieldId('print');
          printTemplates.value = [...printTemplates.value, selectedTemplate.value];
        }
      }
    }
    console.log('submit-template--->', printTemplates.value);
    designVisible.value = false;
  };

  /**
   * @description: 鼠标移入
   */
  const handleMouseenter = (element: WorkForm.PrintTemplate) => {
    selectedTemplateId.value = element.id;
  };

  /**
   * @description: 鼠标移出
   */
  const handleMouseleave = (element: WorkForm.PrintTemplate) => {
    if (selectedTemplateId.value === element.id) {
      selectedTemplateId.value = '';
    }
  };

  /**
   * @description: 是否显示操作
   */
  const showOperation = (element: WorkForm.PrintTemplate) => {
    return selectedTemplateId.value === element.id;
  };

  /**
   * @description: 新增模板
   * @return {*}
   */
  const handleAdd = () => {
    ElMessageBox.prompt('请输入模板名称', '新增模板', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/,
      inputErrorMessage: '模板名称为1-20位中文、字母、数字',
    }).then(({ value }) => {
      selectedTemplate.value = {
        id: generateFieldId('print'),
        title: value,
        templateContent: '',
      };
      designTitle.value = value;
      designVisible.value = true;
    });
  };

  /**
   * @description: 编辑模板
   * @param {*} element 模板信息
   * @return {*}
   */
  const handleEdit = (element: WorkForm.PrintTemplate) => {
    selectedTemplate.value = JSON.parse(JSON.stringify(element));
    designTitle.value = selectedTemplate.value.title;
    designVisible.value = true;
  };

  /**
   * @description: 删除规则
   */
  const handleDelete = (element: WorkForm.PrintTemplate) => {
    if (printTemplates.value) {
      printTemplates.value = printTemplates.value.filter((item) => item.id !== element.id);
    }
  };

  // 打印模板
  const printTemplates = computed({
    get() {
      if (!workFlowStore.design.settings) {
        workFlowStore.design.settings = {
          printTemplates: [],
        };
      }
      if (!workFlowStore.design.settings.printTemplates) {
        workFlowStore.design.settings.printTemplates = [];
      }
      return workFlowStore.design.settings.printTemplates;
    },
    set(val) {
      if (workFlowStore.design.settings) {
        workFlowStore.design.settings.printTemplates = val;
      }
    },
  });
</script>
<style scoped lang="scss">
  // 去除页眉
  @page {
    size: auto;
    margin-top: 3mm;
  }

  .template-container {
    width: 100%;
    height: 100%;

    .template-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      height: 55px;
      padding: 15px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid var(--el-border-color);
    }

    .template-main {
      width: 100%;
      height: calc(100% - 55px);

      .template-empty {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &-text {
          display: flex;
          flex-direction: column;
          text-align: center;
          color: var(--el-text-color-secondary);
        }
      }

      .template-tip {
        background-color: var(--el-color-primary-light-9);
        padding: 10px 20px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }

      .template-content {
        position: relative;
        margin-top: 20px;
        border: 1px dashed var(--el-border-color);

        .template-operation {
          position: absolute;
          top: 0px;
          right: 0px;
          i {
            font-size: large;
            cursor: pointer;
            color: #8c8c8c;
            padding: 5px;

            &:hover {
              color: $primary-color;
            }
          }
        }
      }

      .template-content:hover {
        border: 1px dashed var(--el-color-primary-light-5);
        background: var(--el-color-primary-light-9);
      }
    }
  }

  .design-dialog--header {
    width: 100%;
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
