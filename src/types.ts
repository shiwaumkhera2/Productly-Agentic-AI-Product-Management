export interface FeedbackLog {
  id: string;
  source: string;
  customer: string;
  email: string;
  title: string;
  content: string;
  sentiment: string;
  category: string;
  churnRisk: string;
  vibeRating: number;
  createdAt: string;
  status: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  priorityScore: number;
  status: string;
  category: string;
  agentRationale: string;
  assignee: string;
  jiraTicket: string;
}

export interface PRDDocument {
  id: string;
  roadmapId: string;
  title: string;
  author: string;
  status: string;
  version: string;
  summary: string;
  content: string;
  createdAt: string;
}

export interface MemoryChunk {
  id: string;
  tag: string;
  snippet: string;
  similarity: number;
  embeddingDimension: string;
}

export interface StrategyBlueprint {
  vision: {
    pitch: string;
    narrative: string;
  };
  strategy: {
    winNow: string;
    moat: string;
    pricing: string;
  };
  databaseSchema: string;
  agentsSpec: Record<string, {
    name: string;
    prompt: string;
    tools: string[];
  }>;
}

export interface AgentRunLog {
  step: string;
  agent: string;
  details: string;
  tokens: number;
}
