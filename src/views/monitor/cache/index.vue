<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-06 11:26:44
 * @FilePath: \aster-admin\src\views\monitor\cache\index.vue
 * @Description: 缓存监控
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="monitor-cache">
    <el-card class="box-card" v-if="cacheInfo.info?.redis_version">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
        </div>
      </template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="Redis版本">{{
          cacheInfo.info?.redis_version
        }}</el-descriptions-item>
        <el-descriptions-item label="运行模式">{{
          cacheInfo.info?.redis_mode == 'standalone' ? '单机' : '集群'
        }}</el-descriptions-item>
        <el-descriptions-item label="端口">{{ cacheInfo.info?.tcp_port }}</el-descriptions-item>
        <el-descriptions-item label="客户端">{{
          cacheInfo.info?.connected_clients
        }}</el-descriptions-item>
        <el-descriptions-item label="运行时间（天）">{{
          cacheInfo.info?.uptime_in_days
        }}</el-descriptions-item>
        <el-descriptions-item label="Key数量">{{ cacheInfo.keyCount }}</el-descriptions-item>
        <el-descriptions-item label="最大内存配置">{{
          cacheInfo.info?.maxmemory_human
        }}</el-descriptions-item>
        <el-descriptions-item label="使用CPU"
          >{{ cacheInfo.info?.used_cpu_user_children }}%</el-descriptions-item
        >
        <el-descriptions-item label="已用内存">{{
          cacheInfo.info?.used_memory_human
        }}</el-descriptions-item>
        <el-descriptions-item label="AOF是否开启">{{
          cacheInfo.info?.aof_enabled === '0' ? '否' : '是'
        }}</el-descriptions-item>
        <el-descriptions-item label="RDB是否成功">{{
          cacheInfo.info?.rdb_last_bgsave_status
        }}</el-descriptions-item>
        <el-descriptions-item label="网络入口/出口"
          >{{ cacheInfo.info?.instantaneous_input_kbps }}kps/{{
            cacheInfo.info?.instantaneous_output_kbps
          }}kps</el-descriptions-item
        >
      </el-descriptions>
    </el-card>

    <el-card class="box-card" v-if="cacheInfo.info?.redis_version">
      <template #header>
        <div class="card-header">
          <span>命令统计</span>
        </div>
      </template>
      <el-table :data="dataList" header-align="center" style="width: 100%">
        <el-table-column align="center" prop="name" label="属性" />
        <el-table-column align="center" prop="value" label="值" />
      </el-table>
      <el-pagination
        :background="true"
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[5, 10, 25, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <cache-list />
  </div>
</template>
<script setup lang="ts">
  import { cacheInfoApi } from '@/api/monitor/caching';
  import { ResultEnum } from '@/enums/httpEnum';
  import { CacheModel } from '@/types/monitor';
  import { computed, onMounted, reactive, ref } from 'vue';
  import CacheList from './list.vue';

  const cacheInfo = ref<CacheModel>({});
  const total = ref<number>(0);
  const queryParams = reactive<Page.ReqPage>({
    pageNum: 1,
    pageSize: 5,
  });

  /** 缓存命令 */
  const dataList = computed(() => {
    if (cacheInfo.value.commandStats) {
      return cacheInfo.value.commandStats.slice(
        (queryParams.pageNum - 1) * queryParams.pageSize,
        queryParams.pageNum * queryParams.pageSize,
      );
    }
    return [];
  });

  /**
   * @description: 更改每页大小
   * @param {*} val
   * @return {*}
   */
  const handleSizeChange = (val: number) => {
    queryParams.pageNum = 1;
    queryParams.pageSize = val;
  };

  /**
   * @description: 更改页码
   * @param {*} val
   * @return {*}
   */
  const handleCurrentChange = (val: number) => {
    queryParams.pageNum = val;
  };

  /** 获取缓存服务信息 */
  const getCacheInfo = () => {
    cacheInfoApi().then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        cacheInfo.value = res.data;
        if (cacheInfo.value.commandStats) {
          total.value = cacheInfo.value.commandStats.length;
        }
      }
    });
  };

  onMounted(() => {
    getCacheInfo();
  });
</script>
<style scoped lang="scss">
  .monitor-cache {
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
      width: 120px !important;
    }
    ::v-deep(.el-descriptions__content) {
      width: 200px !important;
    }

    .el-pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
</style>
