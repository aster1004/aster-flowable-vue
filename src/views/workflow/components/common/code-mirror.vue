<template>
  <div ref="editorRef" class="editor-main"></div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { basicSetup } from 'codemirror';
  import { EditorState } from '@codemirror/state';
  import { javascript } from '@codemirror/lang-javascript';
  import { PlaceholderWidget } from '@/types/workflow/app';
  import {
    Decoration,
    DecorationSet,
    MatchDecorator,
    ViewPlugin,
    ViewUpdate,
    EditorView,
  } from '@codemirror/view';

  const props = defineProps({
    modelValue: {
      type: String,
    },
  });

  const editorRef = ref();
  const editorView = ref();

  const placeholderMatcher = new MatchDecorator({
    regexp: /\[\[(.+?)\]\]/g,
    decoration: (match) => Decoration.replace({ widget: new PlaceholderWidget(match[1]) }),
  });

  const placeholders = ViewPlugin.fromClass(
    class {
      placeholders: DecorationSet;
      constructor(view: EditorView) {
        this.placeholders = placeholderMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.placeholders = placeholderMatcher.updateDeco(update, this.placeholders);
      }
    },
    {
      decorations: (v) => v.placeholders,
      provide: (plugin) =>
        EditorView.atomicRanges.of((view) => {
          return view.plugin(plugin)?.placeholders || Decoration.none;
        }),
    },
  );

  const baseTheme = EditorView.baseTheme({
    '.cm-line': {
      padding: '8px 10px',
    },
  });

  const initEditor = () => {
    if (typeof editorView.value !== 'undefined') {
      editorView.value.destroy();
    }
    if (editorRef.value) {
      editorView.value = new EditorView({
        state: EditorState.create({
          extensions: [placeholders, baseTheme, basicSetup, javascript()],
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
  const markText = (from: number, to: number, val: string, type = false) => {
    const text = type ? `[[${val}]]` : `${val}`;
    editorView.value.dispatch({
      changes: {
        from: from,
        to: to,
        insert: text,
      },
      // 光标位置
      selection: {
        anchor: from + val.length,
      },
    });
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
