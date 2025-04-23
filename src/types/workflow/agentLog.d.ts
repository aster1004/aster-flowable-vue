declare namespace AgentLog {
  export interface AgentLogParams extends Page.ReqPage {
    name?: string;
    startTime: string | null;
    endTime: string | null;
  }

  export interface AgentLogInfo {
    id?: string;
    delegatorId?: string;
    delegatorName?: string;
    agentId?: string;
    agentName?: string;
    formCode?: string;
    formName?: string;
    procDefId?: string;
    procInstId?: string;
    nodeId?: string;
    nodeName?: string;
    createTime?: string;
    formName?: string;
    formStatus?: string;
    dataTitle?: string;
  }
}
