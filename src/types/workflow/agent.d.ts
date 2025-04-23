declare namespace Agent {
  export interface AgentParams extends Page.ReqPage {
    name?: string;
    startTime: string | null;
    endTime: string | null;
    status?: string;
  }

  export interface AgentInfo {
    id?: string;
    delegatorId?: string;
    delegatorName?: string;
    agentId?: string;
    agentName?: string;
    startTime?: string;
    endTime?: string;
    agentType?: string;
    agentReason?: string;
    agentFiles?: string[];
    status?: string;
    remark?: string;
  }
}
