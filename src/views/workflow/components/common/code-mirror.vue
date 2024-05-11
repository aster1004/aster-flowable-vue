<template>
  <div ref="editorRef" class="editor-main"></div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { basicSetup } from 'codemirror';
  import { EditorState } from '@codemirror/state';
  import { javascript } from '@codemirror/lang-javascript';
  import { placeholdersPlugin } from '@/views/workflow/components/common/placeholders';
  import { functionPlugin } from '@/views/workflow/components/common/functions';
  import { EditorView } from '@codemirror/view';

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
            functionPlugin(),
            baseTheme,
            basicSetup,
            javascript(),
            EditorView.lineWrapping,
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
    } else {
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
</style>
