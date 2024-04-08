<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-01 17:21:25
 * @FilePath: \aster-flowable-vue\src\views\monitor\server\index.vue
 * @Description: 服务监控
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="monitor-server" v-if="serverInfo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('label.server.status') }}</span>
        </div>
      </template>
      <server-echarts
        :cpu-usage="serverInfo.cpu.usage"
        :mem-usage="serverInfo.mem.usage"
        :jvm-usage="serverInfo?.jvm.usage"
        :disk-usage="diskUsage"
      />
    </el-card>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('label.server.sys') }}</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="$t('label.server.sysOsName')">
          {{ serverInfo?.sys.osName }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.sysOsArch')">
          {{ serverInfo?.sys.osArch }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.sysName')">
          {{ serverInfo?.sys.computerName }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.sysIp')">
          {{ serverInfo?.sys.computerIp }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.sysDir')">
          {{ serverInfo?.sys.userDir }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('label.server.cpu') }}</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="$t('label.server.cpuName')">
          {{ serverInfo?.cpu.name }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.cpuNum')">
          {{ serverInfo?.cpu.cpuNum }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.cpuUsed')">
          {{ serverInfo?.cpu.used }}%
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.cpuSys')">
          {{ serverInfo?.cpu.sys }}%
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.cpuFree')">
          {{ serverInfo?.cpu.free }}%
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('label.server.mem') }}</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="$t('label.server.memTotal')">
          {{ serverInfo?.mem.total }} GB
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.memUsed')">
          {{ serverInfo?.mem.used }} GB
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.memFree')">
          {{ serverInfo?.mem.free }}%
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.memUsage')">
          {{ serverInfo?.mem.usage }}%
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('label.server.jvm') }}</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="$t('label.server.jvmName')">
          {{ serverInfo?.jvm.name }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.jvmVersion')">
          {{ serverInfo?.jvm.version }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.jvmMax')">
          {{ serverInfo?.jvm.max }} MB
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.jvmTotal')">
          {{ serverInfo?.jvm.total }} MB
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.jvmUsed')">
          {{ serverInfo?.jvm.used }} MB
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.jvmFree')">
          {{ serverInfo?.jvm.free }} MB
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.jvmUsage')">
          {{ serverInfo?.jvm.usage }}%
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.jvmHome')">
          {{ serverInfo?.jvm.home }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.jvmStartTime')">
          {{ serverInfo?.jvm.startTime }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('label.server.jvmRunTime')">
          {{ serverInfo?.jvm.runTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('label.server.disk') }}</span>
        </div>
      </template>
      <el-table :data="serverInfo?.disks" header-align="center" style="width: 100%">
        <el-table-column align="center" prop="typeName" :label="$t('label.server.typeName')" />
        <el-table-column
          align="center"
          prop="sysTypeName"
          :label="$t('label.server.sysTypeName')"
        />
        <el-table-column align="center" prop="dirName" :label="$t('label.server.dirName')" />
        <el-table-column align="center" prop="total" :label="$t('label.server.diskTotal')" />
        <el-table-column align="center" prop="used" :label="$t('label.server.diskUsed')" />
        <el-table-column align="center" prop="free" :label="$t('label.server.diskFree')" />
        <el-table-column align="center" prop="usage" :label="$t('label.server.diskUsage')">
          <template #default="scope"> {{ scope.row.usage }}% </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { onMounted } from 'vue';
  import { ResultEnum } from '@/enums/httpEnum';
  import { serverInfoApi } from '@/api/monitor/server';
  import { ServerInfo } from '@/types/monitor';
  import ServerEcharts from './server-echarts.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const serverInfo = ref<ServerInfo.ServerModel>();

  const getServerInfo = () => {
    serverInfoApi().then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        serverInfo.value = res.data;
      }
    });
  };

  const diskUsage = computed(() => {
    const len = serverInfo.value?.disks.length;
    if (!len) {
      return 0;
    }
    let usage = 0;
    serverInfo.value?.disks.forEach((disk) => {
      usage = usage + disk.usage;
    });
    return Number((usage / len).toFixed(2));
  });

  onMounted(() => {
    getServerInfo();
  });
</script>
<style scoped lang="scss">
  .monitor-server {
    .box-card {
      margin-bottom: 15px;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 16px;
        font-weight: bold;
      }
    }
    ::v-deep(.el-descriptions__label) {
      width: 100px !important;
    }
    ::v-deep(.el-descriptions__content) {
      width: 400px !important;
    }
  }
</style>
