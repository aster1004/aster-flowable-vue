<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-11-07 10:58:00
 * @FilePath: \aster-flowable-vue\src\components\calendar\calendar-header.vue
 * @Description: 日程头部按钮
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="calendar-header">
    <el-dropdown @command="handleMenuClick">
      <el-button size="small">
        <div class="flex items-center">
          <i :class="[currentView.icon, '!text-sm']"></i>
          <span class="mx-1 text-sm font-medium">{{ currentView.label }}</span>
        </div>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(menu, index) in menus" :key="index" :command="menu.value">
            <i :class="[menu.icon, '!text-sm']"></i>
            <span class="mx-1 text-sm font-medium">{{ menu.label }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="flex justify-center items-center">
      <i class="iconfont icon-xiangzuo cursor-pointer" @click="handleMove('prev')"></i>
      <span class="mx-2 text-lg font-bold">{{ formattedDate }}</span>
      <i class="iconfont icon-xiangyou cursor-pointer" @click="handleMove('next')"></i>
    </div>
    <div class="flex items-center">
      <el-button type="primary" plain @click="handleMove('today')"> 今天 </el-button>
      <el-button type="primary" plain @click="onCreate">
        <i class="iconfont icon-xinzeng"></i>
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import moment, { MomentInput } from 'moment';
  import { computed, ref } from 'vue';

  const props = defineProps<{
    now: MomentInput;
    view: AsterCalendar.ViewType;
    onMove: (action: AsterCalendar.HandleMoveArg) => void;
    onCreate: VoidFunction;
    onViewTypeChange: (view: AsterCalendar.ViewType) => void;
  }>();

  /**
   * @description: 视图选项
   */
  const menus = ref<AsterCalendar.ViewTypeMenu[]>([
    {
      label: '月',
      value: 'dayGridMonth',
      icon: 'iconfont icon-yueliang',
    },
    {
      label: '周',
      value: 'timeGridWeek',
      icon: 'iconfont icon-zhouqi',
    },
    {
      label: '日',
      value: 'timeGridDay',
      icon: 'iconfont icon-jinri',
    },
    {
      label: '列表',
      value: 'listWeek',
      icon: 'iconfont icon-liebiao',
    },
  ]);

  /**
   * @description: 切换视图
   * @param {string} command 视图类型
   * @return {*}
   */
  const handleMenuClick = (command: string) => {
    const selectedViewType = menus.value.find((item) => item.value === command);
    if (selectedViewType) {
      props.onViewTypeChange(selectedViewType.value);
    } else {
      console.error(`viewType "${command}" is not available.`);
    }
  };

  /**
   * @description: 切换到今天
   * @return {*}
   */
  const handleMove = (type: AsterCalendar.HandleMoveArg) => {
    props.onMove(type);
  };

  /**
   * @description: 获取当前视图类型
   * @return {*}
   */
  const currentView = computed(
    () => menus.value.find((item) => item.value === props.view) || menus.value[0],
  );

  /**
   * @description: 获取当前日期
   */
  const formattedDate = computed(() => {
    return moment(props.now, 'YYYY-MM-DD').format('YYYY年 MM月 DD日');
  });
</script>
<style scoped lang="scss">
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 30px;
    height: 52px;
  }
</style>
