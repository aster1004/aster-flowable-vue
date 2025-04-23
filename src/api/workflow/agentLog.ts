import request from '@/config/axios';
import { PORT5 } from '../config';

/**
 * @description: 分页
 * @return {*}
 */
export const agentLogPageApi = (params: AgentLog.AgentLogParams) => {
  return request.get<Page.ResPage<AgentLog.AgentLogInfo>>(PORT5 + `/agentLog/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @return {*}
 */
export const agentLogInfoApi = (id: string) => {
  return request.get<AgentLog.AgentLogInfo>(PORT5 + `/agentLog/info/` + id, { noLoading: true });
};

/**
 * @description: 保存
 * @param {AgentLog.AgentLogInfo} info
 * @return {*}
 */
export const agentLogSaveApi = (info: AgentLog.AgentLogInfo) => {
  return request.post<string>(PORT5 + `/agentLog/save`, info, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids
 * @return {*}
 */
export const agentLogDeleteApi = (ids: any) => {
  return request.post<string>(PORT5 + `/agentLog/delete`, ids, { noLoading: true });
};
