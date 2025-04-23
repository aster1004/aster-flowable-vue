import request from '@/config/axios';
import { PORT5 } from '../config';

/**
 * @description: 分页
 * @return {*}
 */
export const agentPageApi = (params: Agent.AgentParams) => {
  return request.get<Page.ResPage<Agent.AgentInfo>>(PORT5 + `/agent/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @return {*}
 */
export const agentInfoApi = (id: string) => {
  return request.get<Agent.AgentInfo>(PORT5 + `/agent/info/` + id, { noLoading: true });
};

/**
 * @description: 保存
 * @param {Agent.AgentInfo} info
 * @return {*}
 */
export const agentSaveApi = (info: Agent.AgentInfo) => {
  return request.post<string>(PORT5 + `/agent/save`, info, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids
 * @return {*}
 */
export const agentDeleteApi = (ids: any) => {
  return request.post<string>(PORT5 + `/agent/delete`, ids, { noLoading: true });
};
