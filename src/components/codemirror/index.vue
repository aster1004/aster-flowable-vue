<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-29 10:55:18
 * @FilePath: \aster-flowable-vue\src\components\codemirror\index.vue
 * @Description: 在线代码编辑器
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div style="width: 100%">
    <codemirror
      v-model="codes"
      placeholder="Code goes here..."
      :style="{ height: height + 'px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="handleReady"
      @change="change($event)"
      @focus="log('focus', $event)"
      @blur="log('blur', $event)"
    />
  </div>
</template>

<script setup>
  import { ref, shallowRef, watch } from 'vue';
  import { Codemirror } from 'vue-codemirror';
  import { javascript } from '@codemirror/lang-javascript';

  const props = defineProps({
    modelValue: {
      type: String,
    },
    height: {
      type: Number,
      default: 400,
    },
  });
  const codes = ref('');
  watch(
    () => props.modelValue,
    (val) => {
      codes.value = val || '';
    },
    {
      immediate: true,
      // deep: true
    },
  );
  const extensions = [javascript()];
  const log = console.log;

  // Codemirror EditorView instance ref
  const view = shallowRef();
  const handleReady = (payload) => {
    view.value = payload.view;
  };
  const emit = defineEmits(['update:modelValue']);
  const change = (event) => {
    emit('update:modelValue', event);
  };
</script>
