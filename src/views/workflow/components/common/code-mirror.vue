<template>
  <div ref="editorRef" class="editor-main"></div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { basicSetup } from 'codemirror';
  import { EditorState } from '@codemirror/state';
  import { javascript } from '@codemirror/lang-javascript';
  import { EditorView, placeholder } from '@codemirror/view';
  import {
    placeholdersPlugin,
    placeholdersPlugin2,
  } from '@/views/workflow/components/common/placeholders';
  import { functionPlugin } from '@/views/workflow/components/common/functions';

  const props = defineProps({
    // 编辑器默认提示信息
    placeholder: {
      type: String,
      required: false,
      default: () => '当表达式值解析为true时，当前表单域隐藏',
    },
    //是否可编辑
    editable: {
      default: true,
      type: Boolean,
    },
  });
  const editorRef = ref();
  const editorView = ref();

  const baseTheme = EditorView.baseTheme({
    '&.cm-editor': {
      fontSize: '15px',
    },
    '&.cm-editor.cm-focused': {
      outline: 'none',
    },
    '&.cm-editor .cm-gutterElement': {
      lineHeight: '28px',
    },
    '&.cm-editor .cm-line': {
      lineHeight: '28px',
    },
  });

  const initEditor = () => {
    if (typeof editorView.value !== 'undefined') {
      editorView.value.destroy();
    }

    if (editorRef.value) {
      editorView.value = new EditorView({
        state: EditorState.create({
          extensions: [
            placeholdersPlugin(),
            placeholdersPlugin2(),
            functionPlugin(),
            baseTheme,
            basicSetup,
            javascript(),
            EditorView.editable.of(props.editable),
            EditorView.lineWrapping,
            placeholder(props.placeholder as string),
          ],
        }),
        parent: editorRef.value,
      });
    }
  };

  const focus = () => {
    editorView.value.focus();
  };

  const getValue = () => {
    return editorView.value.state.doc.toString();
  };

  const setValue = (val) => {
    editorView.value.dispatch({
      changes: { from: 0, to: editorView.value.state.doc.length, insert: val },
    });
  };

  const getCursor = () => {
    return editorView.value.state.selection.main.head;
  };

  const setCursor = (pos) => {
    editorView.value.dispatch({ selection: { anchor: pos } });
  };

  const replaceSelection = (val) => {
    editorView.value.dispatch(editorView.value.state.replaceSelection(val));
  };
  const markText = (from: number, to: number, val: string, type: string) => {
    if (type == 'variable') {
      const text = `[[${val}]] `;
      editorView.value.dispatch({
        changes: {
          from: from,
          to: to,
          insert: text,
        },
        // 光标位置
        selection: {
          anchor: from + text.length,
        },
      });
    } else if (type == 'variable2') {
      const text = `{{${val}}} `;
      editorView.value.dispatch({
        changes: {
          from: from,
          to: to,
          insert: text,
        },
        // 光标位置
        selection: {
          anchor: from + text.length,
        },
      });
    } else if (type == 'func') {
      const text = `${val}()`;
      editorView.value.dispatch({
        changes: {
          from: from,
          to: to,
          insert: text,
        },
        // 光标位置
        selection: {
          anchor: from + text.length - 1,
        },
      });
    }
  };

  onMounted(() => {
    initEditor();
  });

  defineExpose({
    focus,
    getValue,
    setValue,
    getCursor,
    setCursor,
    replaceSelection,
    markText,
  });
</script>
<style scoped lang="scss">
  .editor-main {
    width: 100%;
    height: 100%;
  }
  ::v-deep(.cm-editor) {
    height: 100%;
  }
  ::v-deep(.cm-gutters) {
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-regular);
    border-right: 1px solid var(--el-border-color);
  }
  ::v-deep(.cm-activeLineGutter) {
    background-color: #cceeff44;
  }
</style>
