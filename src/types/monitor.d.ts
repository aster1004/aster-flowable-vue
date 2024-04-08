/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-02 10:13:01
 * @FilePath: \aster-flowable-vue\src\types\monitor.d.ts
 * @Description: 系统监控接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
/**
 * @description: 在线用户
 * @return {*}
 */
export interface UserOnline {
  tokenId: string;
  username: string;
  realName: string;
  gender: string;
  email: string;
  mobile: string;
}

/**
 * @description: 服务器信息
 * @return {*}
 */
declare namespace ServerInfo {
  export interface CpuModel {
    name: string;
    cpuNum: number;
    total: number;
    sys: number;
    used: number;
    wait: number;
    free: number;
    usage: number;
  }

  export interface MemModel {
    total: number;
    used: number;
    free: number;
    usage: number;
    swapTotal: number;
    swapUsed: number;
    swapFree: number;
    swapUsage: number;
  }

  export interface JvmModel {
    total: number;
    max: number;
    free: number;
    used: number;
    usage: number;
    name: string;
    version: string;
    home: string;
    startTime: string;
    runTime: string;
  }

  export interface SysModel {
    computerName: string;
    computerIp: string;
    userDir: string;
    osName: string;
    osArch: string;
  }

  export interface DiskModel {
    dirName: string;
    sysTypeName: string;
    typeName: string;
    total: string;
    free: string;
    used: string;
    usage: number;
  }

  export interface ServerModel {
    cpu: CpuModel;
    mem: MemModel;
    jvm: JvmModel;
    sys: SysModel;
    disks: Array<DiskModel>;
  }
}

/**
 * 缓存服务
 */
export interface CacheModel {
  info?: {
    redis_version: string;
    redis_mode: string;
    tcp_port: string;
    connected_clients: string;
    uptime_in_days: string;
    used_memory_human: string;
    used_cpu_user_children: string;
    maxmemory_human: string;
    aof_enabled: string;
    rdb_last_bgsave_status: string;
    instantaneous_input_kbps: string;
    instantaneous_output_kbps: string;
  };
  keyCount?: object;
  commandStats?: Array<object>;
}

/**
 * 缓存信息
 */
export interface CacheInfo {
  cacheName: string;
  cacheKey: string;
  cacheValue: string;
  remark: string;
}
