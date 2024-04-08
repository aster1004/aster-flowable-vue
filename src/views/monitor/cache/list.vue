<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-07 14:22:53
 * @FilePath: \aster-admin\src\views\monitor\cache\list.vue
 * @Description: 缓存列表
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>缓存信息</span>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card style="height: calc(100vh - 200px)">
          <template #header>
            <span><i class="iconfont icon-liebiao"></i> 缓存列表</span>
            <el-button type="primary" text class="float-right py-3px" @click="refreshCacheNames()">
              <i class="iconfont icon-shuaxin"></i>
            </el-button>
          </template>
          <el-table
            :data="cacheNames"
            :height="tableHeight"
            highlight-current-row
            @row-click="getCacheKeys"
            style="width: 100%"
          >
            <el-table-column
              label="缓存名称"
              align="center"
              property="cacheName"
              :show-overflow-tooltip="true"
              :formatter="nameFormatter"
            ></el-table-column>

            <el-table-column
              label="备注"
              align="center"
              property="remark"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="操作" align="center" class-name="operation">
              <template #default="scope">
                <el-button
                  size="small"
                  type="primary"
                  text
                  v-hasPerm="['monitor:cache:delete']"
                  @click="handleClearCacheName(scope.row)"
                >
                  <i class="iconfont icon-shanchu"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="height: calc(100vh - 200px)">
          <template #header>
            <span><i class="iconfont icon-key"></i> 键名列表</span>
            <el-button type="primary" text class="float-right py-3px" @click="refreshCacheKeys()">
              <i class="iconfont icon-shuaxin"></i>
            </el-button>
          </template>
          <el-table
            :data="cacheKeys"
            :height="tableHeight"
            highlight-current-row
            @row-click="handleCacheValue"
            style="width: 100%"
          >
            <el-table-column
              label="缓存键名"
              align="center"
              :show-overflow-tooltip="true"
              :formatter="keyFormatter"
            >
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="operation">
              <template #default="scope">
                <el-button
                  size="small"
                  type="primary"
                  text
                  v-hasPerm="['monitor:cache:delete']"
                  @click="handleClearCacheKey(scope.row)"
                >
                  <i class="iconfont icon-shanchu"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="height: calc(100vh - 200px)">
          <template #header>
            <span><i class="iconfont icon-neirong"></i> 缓存内容</span>
            <el-button
              type="primary"
              text
              class="float-right py-3px"
              v-hasPerm="['monitor:cache:delete']"
              @click="handleClearCacheAll()"
            >
              <i class="iconfont icon-shanchu"></i>清理全部
            </el-button>
          </template>
          <el-form :model="cacheForm">
            <el-row>
              <el-col :span="22">
                <el-form-item label="缓存名称" prop="cacheName">
                  <el-input v-model="cacheForm.cacheName" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item label="缓存键名" prop="cacheKey">
                  <el-input v-model="cacheForm.cacheKey" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item label="缓存内容" prop="cacheValue">
                  <el-input v-model="cacheForm.cacheValue" type="textarea" :rows="8" readonly />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>
<script setup lang="ts">
  import {
    cacheNameApi,
    cacheKeyApi,
    cacheValueApi,
    clearCacheName,
    clearCacheKey,
    clearCacheAll,
  } from '@/api/monitor/caching';
  import { ResultEnum } from '@/enums/httpEnum';
  import { CacheInfo } from '@/types/monitor';
  import { onMounted, ref } from 'vue';
  import { ElMessage } from 'element-plus';

  const tableHeight = window.innerHeight - 300;

  const cacheNames = ref<CacheInfo[]>([]);
  const nowCacheName = ref<string>('');
  const cacheKeys = ref<string[]>([]);
  const cacheForm = ref<CacheInfo>({
    cacheName: '',
    cacheKey: '',
    cacheValue: '',
    remark: '',
  });

  /** 列表前缀去除 */
  const nameFormatter = (row: CacheInfo) => {
    return row.cacheName.replace(':', '');
  };

  /** 查询缓存名称列表 */
  const getCacheNames = () => {
    cacheNameApi().then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        cacheNames.value = res.data;
      }
    });
  };

  /** 查询缓存键名列表 */
  const getCacheKeys = (row?: CacheInfo) => {
    cacheKeys.value = [];
    const cacheName = row !== undefined ? row.cacheName : nowCacheName.value;
    if (cacheName === '') {
      return;
    }
    cacheKeyApi(cacheName).then(({ data }) => {
      cacheKeys.value = data;
      nowCacheName.value = cacheName;
    });
  };

  /** 清理指定名称缓存 */
  const handleClearCacheName = (row: CacheInfo) => {
    clearCacheName(row.cacheName).then(() => {
      ElMessage.success('清理缓存名称[' + row.cacheName + ']成功');
      getCacheKeys();
    });
  };

  /** 刷新缓存名称列表 */
  const refreshCacheNames = () => {
    getCacheNames();
    // 重置key和value
    cacheKeys.value = [];
    nowCacheName.value = '';
    ElMessage.success('刷新缓存列表成功');
  };

  /** 刷新缓存键名列表 */
  const refreshCacheKeys = () => {
    getCacheKeys();
    cacheForm.value = {
      cacheName: '',
      cacheKey: '',
      cacheValue: '',
      remark: '',
    };
    ElMessage.success('刷新键名列表成功');
  };

  /** 清理指定键名缓存 */
  const handleClearCacheKey = (cacheKey: string) => {
    clearCacheKey(cacheKey).then(() => {
      ElMessage.success('清理缓存键名[' + cacheKey + ']成功');
      getCacheKeys();
    });
  };
  /** 键名前缀去除 */
  const keyFormatter = (cacheKey: string) => {
    return cacheKey.replace(nowCacheName.value, '');
  };

  /** 查询缓存内容详细 */
  const handleCacheValue = (cacheKey: string) => {
    cacheValueApi(nowCacheName.value, cacheKey).then(({ data }) => {
      cacheForm.value = data;
    });
  };

  /** 清理全部缓存 */
  const handleClearCacheAll = () => {
    clearCacheAll().then(() => {
      ElMessage.success('清理全部缓存成功');
    });
  };

  onMounted(() => {
    getCacheNames();
  });
</script>
<style scoped lang="scss">
  page {
    padding: 0 20rpx;
  }
</style>
