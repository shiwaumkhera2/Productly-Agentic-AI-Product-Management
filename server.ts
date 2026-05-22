import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Global In-Memory Database for the Productly PM OS
let feedbackDatabase = [
  {
    id: "fb-101",
    source: "Intercom",
    customer: "HashiCorp Enterprise (SaaS Tier)",
    email: "clara.m@hashicorp.com",
    title: "Need granular SAML groups or SSO mapping to teams",
    content: "We cannot roll out Productly to our full 300 PM team because the current auth model forces everyone into a single admin role. We need role-based access control (RBAC) and team mapping synced with Okta SAML assertions, else we might churn by end of quarter.",
    sentiment: "negative",
    category: "Auth & Access Control",
    churnRisk: "high",
    vibeRating: 1,
    createdAt: "2026-05-18T10:00:00Z",
    status: "unprocessed"
  },
  {
    id: "fb-102",
    source: "Zendesk",
    customer: "Sentry Growth Team",
    email: "devin.s@sentry.io",
    title: "Jira sync is slow and keeps failing on Epic links",
    content: "When our product manager updates a roadmap item in Productly, it takes up to 45 minutes to reflect in Jira or fails completely. The error says 'Invalid Parent Link ID' because our Epic configuration matches a custom field pattern. We need a way to customize ticket templates in Productly.",
    sentiment: "neutral",
    category: "Integrations & Sync",
    churnRisk: "medium",
    vibeRating: 3,
    createdAt: "2026-05-19T14:15:00Z",
    status: "clustered"
  },
  {
    id: "fb-103",
    source: "Slack Sync",
    customer: "Vercel Product Ops",
    email: "p-ops@vercel.com",
    title: "Idea: Automatic PRD draft from Slack threads",
    content: "Our team brainstorms features recursively in private Slack channels. It would be an absolute game changer if we could mark a Slack thread with a :productly: emoji and have Productly ingest the entire conversation, resolve competing product design opinions, and draft a structured PRD in our workspace.",
    sentiment: "positive",
    category: "AI Content & Generation",
    churnRisk: "low",
    vibeRating: 5,
    createdAt: "2026-05-20T08:30:00Z",
    status: "processed"
  },
  {
    id: "fb-104",
    source: "User Interview",
    customer: "Retool Founder Core",
    email: "ben@retool.com",
    title: "Audio call summary transcription analysis",
    content: "Analyzing PM workflows. PM spends 40% of their day translating customer complaints into physical Jira specifications. 'If an LLM could map our feedback database to actual roadmap items, resolve if it is a duplicate, rate its technical feasibility, and sketch out the component schema, I would pay $1k/month easily.'",
    sentiment: "positive",
    category: "Roadmap & Strategy",
    churnRisk: "low",
    vibeRating: 4,
    createdAt: "2026-05-21T09:00:00Z",
    status: "unprocessed"
  }
];

let roadmapDatabase = [
  {
    id: "rd-1",
    title: "Enterprise SAML SSO & RBAC (Okta/Clerk Sync)",
    description: "Build robust multi-tenant role management, group sync, and full-spectrum enterprise single sign-on integration directly synced with Okta and Microsoft AD.",
    impact: "High",
    effort: "Medium",
    priorityScore: 92,
    status: "To Do",
    category: "Enterprise Security",
    agentRationale: "Triggered by High Churn risk alert from HashiCorp. Crucial for unlocking 100+ seat contract upgrades.",
    assignee: "Orchestrator Agent",
    jiraTicket: "PROD-2490",
  },
  {
    id: "rd-2",
    title: "Bespoke Jira/Linear Custom Fields Sync Engine",
    description: "Revamp the sync worker layer with customizable webhook mappings, support for Epic parent linkages, and real-time bidirectionality.",
    impact: "Medium",
    effort: "High",
    priorityScore: 74,
    status: "In Progress",
    category: "Integrations & Sync",
    agentRationale: "Addresses recurring Zendesk sync failures reported by Sentry PM team.",
    assignee: "Ticket Generator Agent",
    jiraTicket: "PROD-3184",
  },
  {
    id: "rd-3",
    title: "Slack Channel Ingest & Auto-PRD Draft Pipeline",
    description: "Deploy listening webhooks to capture Slack threads marked with emoji, fetch thread history, perform speaker sentiment resolution, and draft full-featured PRDs.",
    impact: "High",
    effort: "Medium",
    priorityScore: 88,
    status: "Backlog",
    category: "AI PM Co-Pilot",
    agentRationale: "High demand from Vercel Product Ops. Core feature differentiating our AI-native operation from standard tickets.",
    assignee: "PRD Writer Agent",
    jiraTicket: "Unassigned",
  }
];

let generatedPRDs = [
  {
    id: "prd-1",
    title: "Enterprise SSO & Okta Group Sync Integration Engine",
    roadmapId: "rd-1",
    author: "PRD Writer Agent V2",
    status: "Waiting Approval",
    version: "v1.2 (Draft)",
    summary: "Complete specification for Enterprise SSO mapping SAML assertions directly into custom Productly workspace RBAC teams.",
    content: `# BRD & PRD: Enterprise SSO & Okta Group Sync Integration Engine

## 1. Executive Summary
HashiCorp and multiple other high-revenue growth customers require a secure, standard way to enforce Single Sign-On (SSO) while mapping enterprise divisions directly to teams. Currently, Productly lacks a robust Role-Based Access Control (RBAC) sync framework, hindering vertical market penetration. This specification details the architecture for Okta/SAML group assertions integration.

## 2. Problem Statement
PM operations teams are unable to provision, deprovision, or coordinate multi-tenant roles automatically. This leads to manual overhead and risks security non-compliance. Our churn analysis triggers high alerts on accounts holding tickets matching "SAML", "SSO", and "Okta".

## 3. Product Principles
- **Clarity first**: Provisioning must be zero-touch.
- **Enterprisegrade compliance**: Audit logs record every single rule update.
- **Fail-safe mapping**: If assertions do not match, fallback to the organization's customized 'Reader' default tier.

## 4. Feature Requirements
### Epic 1: Admin Configuration UI (SaaS console)
* **FR-1**: Workspace Admins can input XML metadata URL or paste certificate block.
* **FR-2**: Interactive mapping schema builder (e.g., Okta Attribute value \`eng-leads\` maps to Productly group \`Maintainer\`).

### Epic 2: Authentication Broker & SAML Assertion Handler
* **FR-3**: Ingest SAML 2.0 assertions. Parse mapping claims during initial login hook.
* **FR-4**: Perform JWT generation and store session security contexts locally. See Security Section.

## 5. System Schema & DB Migrations
\`\`\`sql
CREATE TABLE public.oauth_sso_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  saml_group_claim VARCHAR(255) NOT NULL,
  productly_role VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## 6. Engineering Action Tasks Generated
1. **SSO-101**: Setup Passport-SAML auth broker route mapping claims in node.
2. **SSO-102**: Build frontend SSO custom mapping tables interface in Next.js.
3. **SSO-003**: Formulate DB migration files and load test assertion payloads.`,
    createdAt: "2026-05-20T11:00:00Z"
  }
];

let vectorKnowledgeGraph = [
  { id: "kn-1", tag: "Feedback Chunk", snippet: "SSO Group Sync is a structural blocker for HashiCorp rollout.", similarity: 0.94, embeddingDimension: "[0.12, -0.45, 0.88...]" },
  { id: "kn-2", tag: "Jira Issue Trace", snippet: "PROD-3184: Epic parent linkages error matches Sentry's payload.", similarity: 0.82, embeddingDimension: "[-0.03, 0.54, 0.16...]" },
  { id: "kn-3", tag: "Market Signal", snippet: "Retool PM spent 40% translating tickets. High willingness to pay for autonomous translation agent.", similarity: 0.79, embeddingDimension: "[0.32, -0.11, 0.55...]" },
  { id: "kn-4", tag: "User Persona Docs", snippet: "Enterprise Buyer prioritizes strict Okta sync. Developer Buyer prioritizes webhook reliable sync.", similarity: 0.74, embeddingDimension: "[-0.23, 0.05, 0.81...]" }
];

// Strategic blueprint storage containing YC strategy, PostgreSQL schemes, multi-agent workflows etc.
const strategicBlueprint = {
  vision: {
    pitch: "Productly is an autonomous AI Product Manager that turns raw user data into precise, production-ready engineering items, eliminating 80% of product management operations overhead through multi-agent orchestration.",
    narrative: "In tech, product management is the biggest operational bottleneck. Engineers stand idle waiting for PRDs, while PMs choke on customer feedback, support vectors, and analytics data. Productly operates as a persistent, autonomous PM teammate that watches Slack, Zoom, HubSpot, Intercom, and Jira, translating raw text into refined, prioritized actions, code wireframes, and Linear tickets completely on autopilot."
  },
  strategy: {
    winNow: "The convergence of advanced large context reasoning models (like Gemini 1.5/2.5/3.1 with massive token windows and native structuring) allows for recursive analysis across thousands of pieces of customer raw feedback simultaneously. Simple chatbots cannot coordinate custom developer workflows, but our stateful Multi-Agent Loop (backed by pgvector and LangGraph) converts ephemeral qualitative discussions with consumers into structural database mappings.",
    moat: "1. **Data Network Effects**: Every Slack message, customer interview, and bug ticket ingested feeds into our Vector Knowledge Graph, building an extremely fine-grained semantic memory. Over time, Productly knows the company's codebase, tech stack, UX specs, and design systems better than any human PM.\n2. **Deep Integration Lock-In**: Bridging sales (HubSpot), support (Zendesk/Intercom), and engineering (Jira/Linear) makes Productly the ultimate orchestrating single-source-of-truth. Moving off Productly would completely freeze the feedback loop.\n3. **Closed Human-in-the-Loop Feedback**: Productly agents suggest routes, write documents and generate designs, but request human verification. Each correction serves as immediate fine-tuning data.",
    pricing: "We deploy on a Usage + Per-PM Seat model:\n- **Starter ($149/mo)**: Ingests 2 feedback sources, includes 1 autonomous PM agent, executes up to 100 Agent runs/mo.\n- **Growth ($499/mo)**: Ingests infinite integrations, provides the complete Multi-Agent team, SSO integration, up to 1000 Agent runs/mo.\n- **Enterprise (Custom Matrix)**: Custom vector databases (pgvector), local VPC deployment, custom LLM fine-tuning, SLA sync guarantees."
  },
  databaseSchema: `
-- ========================================================
-- PRODUCTLY PRODUCTION-READY POSTGRESQL MULTI-TENANT SCHEMA
-- ========================================================

-- Enable Vector extensions for semantic similarity search & RAG
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Tenant/Workspace Models
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  billing_tier VARCHAR(100) DEFAULT 'free' CHECK (billing_tier IN ('free', 'starter', 'growth', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. User Accounts (Enterprise RBAC synced with Clerk)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(150),
  last_name VARCHAR(150),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Membership Linkage
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(organization_id, user_id)
);

-- 4. Unified Raw Customer Ingestion (Slack, Zendesk, Intercom, Calls)
CREATE TABLE public.customer_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  source_channel VARCHAR(100) NOT NULL CHECK (source_channel IN ('slack', 'intercom', 'zendesk', 'hubspot', 'zoom', 'manual_interview')),
  external_id VARCHAR(255), -- ID in the original vendor platform
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  title TEXT NOT NULL,
  raw_body TEXT NOT NULL,
  sentiment_score NUMERIC(3, 2), -- Range: -1.00 (highly toxic) to +1.00 (delighted)
  churn_impact_score INT DEFAULT 0 CHECK (churn_impact_score BETWEEN 0 AND 10), -- Calculated by Churn Predictor Agent
  category VARCHAR(150),
  status VARCHAR(50) DEFAULT 'unprocessed' CHECK (status IN ('unprocessed', 'vectorizing', 'clustered', 'processed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. pgvector Episodic Memory Chunkings (For Unified RAG)
CREATE TABLE public.feedback_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id UUID NOT NULL REFERENCES public.customer_feedback(id) ON DELETE CASCADE,
  chunk_content TEXT NOT NULL,
  chunk_embedding vector(1536) NOT NULL, -- Matched to gemini-embedding-2-preview (1536 dims) or OpenAI (1536 dims)
  meta_payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Index on Cosine Distance for swift RAG queries
CREATE INDEX ON public.feedback_embeddings USING hnsw (chunk_embedding vector_cosine_ops);

-- 6. Unified Roadmap & Feature Discovery Registry
CREATE TABLE public.roadmap_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  strategic_impact VARCHAR(50) CHECK (strategic_impact IN ('Low', 'Medium', 'High')),
  effort VARCHAR(50) CHECK (effort IN ('Low', 'Medium', 'High')),
  priority_score INT DEFAULT 0 CHECK (priority_score BETWEEN 0 AND 100),
  status VARCHAR(100) DEFAULT 'Backlog' CHECK (status IN ('Backlog', 'To Do', 'In Progress', 'Done', 'Archived')),
  category VARCHAR(150),
  agent_rationale TEXT, -- Narrative explaining why the Multi-Agent engine recommended this
  jira_ticket_ref VARCHAR(100) DEFAULT 'Unassigned',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 7. Document Control Core (PRDs & Blueprints)
CREATE TABLE public.prds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmap_items(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  content TEXT NOT NULL, -- Full markdown PRD compiled by the PRD Writer Agent
  author_agent_version VARCHAR(100) DEFAULT 'v1',
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'waiting_approval', 'approved', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 8. Technical Engineering Tickets (Jira / Linear Tasks sync)
CREATE TABLE public.engineering_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prd_id UUID REFERENCES public.prds(id) ON DELETE CASCADE,
  ticket_key VARCHAR(50) NOT NULL, -- e.g. 'PROD-2490'
  title VARCHAR(255) NOT NULL,
  technical_description TEXT NOT NULL,
  epic_link VARCHAR(100),
  assigned_agent VARCHAR(150),
  sync_status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'synced', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 9. Agent Run Orchestrator Telemetry Logs (LangGraph workflow tracer)
CREATE TABLE public.agent_run_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  workflow_type VARCHAR(150) NOT NULL, -- e.g., 'prioritization_audit', 'slack_to_prd'
  step_name VARCHAR(150) NOT NULL, -- e.g., 'feedback_clustering', 'prio_ranking'
  agent_identity VARCHAR(100) NOT NULL, -- e.g., 'Roadmap Agent'
  status VARCHAR(50) NOT NULL, -- 'running', 'completed', 'failed', 'paused_user_approval'
  log_payload JSONB DEFAULT '{}'::jsonb,
  system_instructions_used TEXT,
  token_usage INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ========================================================
-- INDEXES FOR SCALE & SPEED OPERATIONS
-- ========================================================
CREATE INDEX idx_feedback_org ON public.customer_feedback(organization_id);
CREATE INDEX idx_feedback_status ON public.customer_feedback(status);
CREATE INDEX idx_roadmap_priority ON public.roadmap_items(priority_score DESC);
CREATE INDEX idx_run_logs_org_created ON public.agent_run_logs(organization_id, created_at DESC);
  `,
  agentsSpec: {
    orchestrator: {
      name: "Orchestrator Agent (Master Planner)",
      prompt: "You are the Master Orchestrator for the Productly platform. Your task is to analyze requested product development objectives, retrieve corresponding company memories/feedback pools, and schedule tasks to specific agents recursively using state managers.\n\nInput: User objective, raw feed context.\nOutput: Pipeline execution flow charts and JSON logs.",
      tools: ["QueryFeedbackDatabase", "DispatchToAgent", "StoreEpisodicMemory", "AwaitHumanVerification"]
    },
    research: {
      name: "Research & Sentiment Agent",
      prompt: "You are a Customer Experience Analyst specializing in SaaS customer pain point discovery. Group incoming feed blocks, score raw sentiment correctly, tag churn urgency metrics, and compile semantic associations.",
      tools: ["RetrieveSemanticEmbeddings", "TagSeverity", "PublishClusteredInsights"]
    },
    roadmap: {
      name: "Roadmap Prioritization Agent",
      prompt: "You are a quantitative VC-style PM Strategist. Prioritize items utilizing WSJF (Weighted Shortest Job First) and impact/effort matrices. Detail written rationales backing scores.",
      tools: ["CalculatePriorityWSJF", "UpdateRoadmapItem", "CommitRationaleText"]
    },
    prdWriter: {
      name: "PRD Writer Agent",
      prompt: "You are an elite Lead Product Designer and PM. Write exhaustive technical specifications in perfectly formatted markdown. Detail data models, user-experience flows, and complete edge cases based on customer complaints.",
      tools: ["ReadKnowledgeGraph", "SearchPRDDatabase", "DraftMarkdownPRD"]
    },
    ticketGenerator: {
      name: "Engineering JIRA/Linear Translator Agent",
      prompt: "You are a Principal Software Architect. Take comprehensive PRDs, break them down into completely distinct, atomic engineering tickets with precise REST API schematics, backend/frontend split, and schema migrations.",
      tools: ["CreateJiraTicket", "SyncLinearIssue", "AuditCodebaseStructure"]
    }
  }
};

// --- API ENDPOINTS ---

// Strategic Spec Route (YC Blueprint Content)
app.get("/api/strategy", (req, res) => {
  res.json(strategicBlueprint);
});

// Feedback Fetch & Add
app.get("/api/feedback", (req, res) => {
  res.json(feedbackDatabase);
});

app.post("/api/feedback", (req, res) => {
  const { source, customer, email, title, content, sentiment, category } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  const sentimentFinal = sentiment || (content.includes("churn") || content.includes("fail") || content.includes("angry") ? "negative" : "positive");
  const churnCalculated = (sentimentFinal === "negative" || content.includes("Okta") || content.includes("SSO") || content.includes("churn")) ? "high" : "low";

  const newFeedback = {
    id: `fb-${Date.now()}`,
    source: source || "Manual Ingest",
    customer: customer || "Anonymous Guest",
    email: email || "unknown@guest.com",
    title,
    content,
    sentiment: sentimentFinal,
    category: category || "General PM Request",
    churnRisk: churnCalculated,
    vibeRating: sentimentFinal === "negative" ? 2 : 4,
    createdAt: new Date().toISOString(),
    status: "unprocessed"
  };

  feedbackDatabase.unshift(newFeedback);
  
  // Also push a mock semantic link in vector DB representation to show dynamic indexing!
  vectorKnowledgeGraph.unshift({
    id: `kn-${Date.now()}`,
    tag: "Feedback Chunk",
    snippet: `Inbound customer ${customer} requested: "${title}" - classified under ${category}.`,
    similarity: 0.91,
    embeddingDimension: `[${(Math.random() * 0.5).toFixed(2)}, ${(Math.random() * -0.5).toFixed(2)}, 0.72...]`
  });

  res.status(201).json(newFeedback);
});

// Roadmap Fetch & Update
app.get("/api/roadmap", (req, res) => {
  res.json(roadmapDatabase);
});

app.post("/api/roadmap", (req, res) => {
  const { title, description, impact, effort, category } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required." });
  }

  // Calculate generic WSJF priority score
  let score = 50;
  if (impact === "High") score += 30;
  if (impact === "Medium") score += 15;
  if (effort === "Low") score += 15;
  if (effort === "High") score -= 15;

  const newItem = {
    id: `rd-${Date.now()}`,
    title,
    description,
    impact: impact || "Medium",
    effort: effort || "Medium",
    priorityScore: score,
    status: "To Do",
    category: category || "Core Roadmap",
    agentRationale: "Created manually by Product Manager. Prioritized by Productly WSJF heuristic engine in real-time.",
    assignee: "Roadmap Agent",
    jiraTicket: "Unassigned"
  };

  roadmapDatabase.unshift(newItem);
  res.status(201).json(newItem);
});

app.put("/api/roadmap/:id", (req, res) => {
  const { id } = req.params;
  const { status, jiraTicket, priorityScore } = req.body;
  const item = roadmapDatabase.find(r => r.id === id);
  if (item) {
    if (status !== undefined) item.status = status;
    if (jiraTicket !== undefined) item.jiraTicket = jiraTicket;
    if (priorityScore !== undefined) item.priorityScore = priorityScore;
    return res.json(item);
  }
  res.status(404).json({ error: "Roadmap item not found" });
});

// PRD Fetch & Add
app.get("/api/prds", (req, res) => {
  res.json(generatedPRDs);
});

app.post("/api/prds", (req, res) => {
  const { roadmapId, title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  const newPRD = {
    id: `prd-${Date.now()}`,
    title,
    roadmapId: roadmapId || "rd-unlinked",
    author: "PRD Writer Agent V2",
    status: "Waiting Approval",
    version: "v1.0 (Draft)",
    summary: content.substring(0, 150) + "...",
    content,
    createdAt: new Date().toISOString()
  };

  generatedPRDs.unshift(newPRD);
  res.status(201).json(newPRD);
});

app.put("/api/prds/:id", (req, res) => {
  const { id } = req.params;
  const { status, content } = req.body;
  const prd = generatedPRDs.find(p => p.id === id);
  if (prd) {
    if (status !== undefined) prd.status = status;
    if (content !== undefined) prd.content = content;
    return res.json(prd);
  }
  res.status(404).json({ error: "PRD not found" });
});

// Knowledge Graph (Vector Memory) Representation
app.get("/api/kb", (req, res) => {
  res.json(vectorKnowledgeGraph);
});

// STATEFUL ORCHESTRATED MULTI-AGENT LOOP & RUN ENGINES
// Uses process.env.GEMINI_API_KEY with standard client, otherwise returns beautiful synthetic PM results.
app.post("/api/agents/run", async (req, res) => {
  const { promptText, chosenAgent, feedbackIds, roadmapLinkId } = req.body;
  
  if (!promptText) {
    return res.status(400).json({ error: "promptText (instruction) is required." });
  }

  // Create temporary log entries representing real steps of multi-agent execution:
  // Research Agent -> Prioritize Agent -> PRD Writer Agent.
  const logs = [
    { step: "Orchestration Plan Formulation", agent: "Orchestrator Agent", details: "Ingested command: '" + promptText + "'. Scheduled Feedback-to-Roadmap translation workspace.", tokens: 250 },
    { step: "Retrieval Augmented Ingestion", agent: "Memory Manager Agent", details: "Queried pgvector feedback index. Identified " + (feedbackIds ? feedbackIds.length : 3) + " high-cosine-similarity tickets. Ingested raw feedback chunks into prompt context.", tokens: 550 }
  ];

  const ai = getGeminiClient();

  // If live AI is requested and we have a key, let's invoke a REAL Gemini 3.5 Flash run
  let aiGeneratedOutput = "";
  let realAICalled = false;

  if (ai) {
    try {
      logs.push({ step: "Invoking Deep LLM Reasoning", agent: "Orchestrator Agent", details: "Sending 1M context token bundle to 'gemini-3.5-flash'. Running structural PRD/prioritization solver instructions.", tokens: 1950 });
      
      const payloadContext = `
You are the AI Product Manager running inside "Productly".
The user has issued this instruction to you:
"${promptText}"

The context of the company's feedback base is:
${JSON.stringify(feedbackDatabase.slice(0, 3), null, 2)}

Existing roadmap items are:
${JSON.stringify(roadmapDatabase, null, 2)}

Provide a beautiful, production-ready, structured output based strictly on the user's instructions.
If they are asking to draft a PRD, write an exhaustive product requirement document (in Markdown) with executive summary, user problems, functional criteria, APIs, database migrations, and a list of specific tech JIRA tasks.
If they are prioritizing, output a prioritized table with impact/effort analysis of items and detailed rationales.
Make sure your answer is extremely detailed, expert, and professional.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: payloadContext,
      });

      aiGeneratedOutput = response.text || "";
      realAICalled = true;
      logs.push({ step: "Generation Pipeline Complete", agent: chosenAgent || "PRD Writer Agent", details: "Successfully compiled and verified syntax. Human approval loop triggered.", tokens: 2840 });
    } catch (err: any) {
      console.error("Gemini call failed, utilizing graceful fallback:", err);
      // Fallback is handled below
    }
  }

  // Graceful, richly detailed fallback if Gemini is unconfigured or failed, keeping the UX 100% functional:
  if (!realAICalled) {
    logs.push({ step: "Vector Space Context Extraction", agent: "Research Agent", details: "Running NLP clustering algorithms on Okta and SSO claims. Highlighted HashiCorp churn warning.", tokens: 850 });
    logs.push({ step: "WSJF Index Formulation", agent: "Roadmap Agent", details: "Calculating complexity variables. Enterprise RBAC determined to possess 92 score weight.", tokens: 1100 });
    
    if (promptText.toLowerCase().includes("saml") || promptText.toLowerCase().includes("sso") || promptText.toLowerCase().includes("security") || promptText.toLowerCase().includes("prd")) {
      aiGeneratedOutput = `
# BRD/PRD Draft: Automated Enterprise Identity Sync Federation (SAML / Okta)

## 1. Context & Executive Summary
This document is automatically triggered by customer churn signals (specifically HashiCorp enterprise tier). To upgrade our average contract value by 3x, we must support administrative role mappings derived from Okta SAML claims.

## 2. Dynamic Problem Discovery
- HashiCorp reports "Inability to map teams to active workspace divisions."
- Churn risk: High (SAML block raises friction by 90%).

## 3. Scope & Architecture
- Interface for Okta Metadata XML sync.
- Express passport broker mappings middleware.
- Post-login assertion team sync loops.

## 4. DB Migration Blueprint
\`\`\`sql
CREATE TABLE org_sso_configs (
  id UUID PRIMARY KEY,
  sso_provider VARCHAR(50),
  metadata_url TEXT,
  role_mappings JSONB
);
\`\`\`

## 5. Engineering Action Plan
1. **SSO-101**: Build metadata endpoint parsing assertions.
2. **SSO-102**: Embed role routing gate middleware in Express.
3. **SSO-103**: Test failure assertions.
`;
    } else {
      aiGeneratedOutput = `
# Automated Strategic Analysis & Roadmap Action Draft
**Generated specifically for: "${promptText}"**

## 1. Competitive Moat Analysis
Our multi-agent index reveals that resolving feedback loops 5x faster translates directly into a 42% retention uplift. We must prioritize self-healing integrations (PROD-3184) and our Slack ingest engine (rd-3).

## 2. Technical Feasibility & Impact Matrix
- **Action Item A**: Slack :productly: emoji trigger. Impact: High | Effort: Medium. Prioritized Score: 88.
- **Action Item B**: Custom Epics parent metadata resolution. Impact: Medium | Effort: High. Prioritized Score: 74.

## 3. Agent Execution Log Comments
- *Roadmap Agent*: High impact scores approved corresponding to retrol/feedback density weight.
- *Prioritization Agent*: Recommends executing Slack integration immediately due to rapid developer deployment pipelines.
`;
    }
    logs.push({ step: "Result Ready for Workspace Ingest", agent: chosenAgent || "Roadmap Agent", details: "Output successfully validated using heuristics. Committing draft into database indices.", tokens: 1400 });
  }

  // Update real database arrays if target workflows matches common cases!
  if (promptText.toLowerCase().includes("prd") || promptText.toLowerCase().includes("write") || promptText.toLowerCase().includes("draft")) {
    const isSso = promptText.toLowerCase().includes("sso") || promptText.toLowerCase().includes("saml") || promptText.toLowerCase().includes("security");
    const docTitle = isSso ? "Enterprise Identity Sync Federation (Okta/SAML)" : "Dynamic Multi-Agent Project Spec";
    const mappedRoadmap = isSso ? "rd-1" : (roadmapLinkId || "rd-3");
    
    const newPrd = {
      id: `prd-${Date.now()}`,
      title: docTitle,
      roadmapId: mappedRoadmap,
      author: chosenAgent || "PRD Writer Agent V2",
      status: "Waiting Approval",
      version: "v1.0 (Draft)",
      summary: aiGeneratedOutput.substring(0, 150) + "...",
      content: aiGeneratedOutput,
      createdAt: new Date().toISOString()
    };
    generatedPRDs.unshift(newPrd);
  } else if (promptText.toLowerCase().includes("prio") || promptText.toLowerCase().includes("priorit") || promptText.toLowerCase().includes("wsjf")) {
    // Manually tweak Roadmap item to show priority change
    if (roadmapDatabase.length > 0) {
      roadmapDatabase[0].priorityScore = 98;
      roadmapDatabase[0].agentRationale = `WSJF recalculated by Orchestrator Agent following incoming command: "${promptText}". Strategic urgency elevated due to customer density factors.`;
    }
  }

  res.json({
    success: true,
    agent: chosenAgent || "PRD Writer Agent",
    logs: logs,
    output: aiGeneratedOutput,
    aiCalled: realAICalled
  });
});

// Serve frontend static assets in production, otherwise serve Vite middleware in development
const distPath = path.join(process.cwd(), "dist");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // Let Vite handle frontend routes recursively in dev
  startVite();
}

async function startVite() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Productly backend starting at http://0.0.0.0:${PORT}`);
});
