<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-07 14:43:24
 * @FilePath: \aster-flowable-vue\src\components\wangEditor\index.vue
 * @Description: 富文本编辑器
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div :class="['editor-box', self_disabled ? 'editor-disabled' : '']">
    <Toolbar
      v-if="!hideToolBar"
      class="editor-toolbar"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      v-model="valueHtml"
      class="editor-content"
      :style="{ height }"
      :mode="mode"
      :default-config="editorConfig"
      @on-created="handleCreated"
      @on-blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
  import { nextTick, computed, inject, shallowRef, onBeforeUnmount } from 'vue';
  import { IToolbarConfig, IEditorConfig } from '@wangeditor/editor';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { uploadFile } from '@/api';
  import '@wangeditor/editor/dist/css/style.css';
  import { ElMessage, formContextKey, formItemContextKey } from 'element-plus';
  import { ImageUpload } from '@/config/fileConfig';

  // 富文本 DOM 元素
  const editorRef = shallowRef();

  // 实列化编辑器
  const handleCreated = (editor: any) => {
    editorRef.value = editor;
  };

  // 接收父组件参数，并设置默认值
  interface RichEditorProps {
    value: string; // 富文本值 ==> 必传
    toolbarConfig?: Partial<IToolbarConfig>; // 工具栏配置 ==> 非必传（默认为空）
    editorConfig?: Partial<IEditorConfig>; // 编辑器配置 ==> 非必传（默认为空）
    height?: string; // 富文本高度 ==> 非必传（默认为 500px）
    mode?: 'default' | 'simple'; // 富文本模式 ==> 非必传（默认为 default）
    hideToolBar?: boolean; // 是否隐藏工具栏 ==> 非必传（默认为false）
    disabled?: boolean; // 是否禁用编辑器 ==> 非必传（默认为false）
  }
  const props = withDefaults(defineProps<RichEditorProps>(), {
    toolbarConfig: () => {
      return {
        excludeKeys: [],
      };
    },
    editorConfig: () => {
      return {
        placeholder: '请输入内容...',
        MENU_CONF: {},
      };
    },
    height: '500px',
    mode: 'default',
    hideToolBar: false,
    disabled: false,
  });

  // 获取 el-form 组件上下文
  const formContext = inject(formContextKey, void 0);
  // 获取 el-form-item 组件上下文
  const formItemContext = inject(formItemContextKey, void 0);
  // 判断是否禁用上传和删除
  const self_disabled = computed(() => {
    return props.disabled || formContext?.disabled;
  });

  // 判断当前富文本编辑器是否禁用
  if (self_disabled.value) nextTick(() => editorRef.value.disable());

  // 富文本的内容监听，触发父组件改变，实现双向数据绑定
  const emit = defineEmits<{
    'update:value': [value: string];
    'check-validate': [];
  }>();
  const valueHtml = computed({
    get() {
      return props.value;
    },
    set(val: string) {
      // 防止富文本内容为空时，校验失败
      if (editorRef.value.isEmpty()) val = '';
      emit('update:value', val);
    },
  });

  /**
   * @description 图片自定义上传
   * @param file 上传的文件
   * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
   * */
  type InsertFnTypeImg = (url: string, alt?: string, href?: string) => void;
  props.editorConfig.MENU_CONF!['uploadImage'] = {
    async customUpload(file: File, insertFn: InsertFnTypeImg) {
      if (!uploadImgValidate(file)) return;
      let formData = new FormData();
      formData.append('file', file);
      try {
        const { data } = await uploadFile(formData);
        insertFn(data.url);
      } catch (error) {
        console.log(error);
      }
    },
  };

  // 图片上传前判断
  const uploadImgValidate = (file: File): boolean => {
    // 判断图片类型
    if (!ImageUpload.type.includes(file.type)) {
      ElMessage.error('上传文件必须是图片格式');
      return false;
    } else if (file.size / 1024 / 1024 > ImageUpload.maxSize) {
      // 判断图片大小
      ElMessage.error('上传图片大小不能超过' + ImageUpload.maxSize + 'MB');
      return false;
    }
    return true;
  };

  /**
   * @description 视频自定义上传
   * @param file 上传的文件
   * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
   * */
  type InsertFnTypeVideo = (url: string, poster?: string) => void;
  props.editorConfig.MENU_CONF!['uploadVideo'] = {
    async customUpload(file: File, insertFn: InsertFnTypeVideo) {
      if (!uploadVideoValidate(file)) return;
      let formData = new FormData();
      formData.append('file', file);
      try {
        const { data } = await uploadFile(formData);
        insertFn(data.url);
      } catch (error) {
        console.log(error);
      }
    },
  };

  // 视频上传前判断
  const uploadVideoValidate = (file: File): boolean => {
    console.log(file);
    return true;
  };

  // 编辑框失去焦点时触发
  const handleBlur = () => {
    formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
  };

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    if (!editorRef.value) return;
    editorRef.value.destroy();
  });

  defineExpose({
    editor: editorRef,
  });
</script>

<style scoped lang="scss">
  /* 富文本组件校验失败样式 */
  .is-error {
    .editor-box {
      border-color: var(--el-color-danger);
      .editor-toolbar {
        border-bottom-color: var(--el-color-danger);
      }
    }
  }

  /* 富文本组件禁用样式 */
  .editor-disabled {
    cursor: not-allowed !important;
  }

  /* 富文本组件样式 */
  .editor-box {
    /* 防止富文本编辑器全屏时 tabs组件 在其层级之上 */
    z-index: 2;
    width: 100%;
    border: 1px solid var(--el-border-color-darker);
    .editor-toolbar {
      border-bottom: 1px solid var(--el-border-color-darker);
    }
    .editor-content {
      overflow-y: hidden;
    }
  }
</style>
