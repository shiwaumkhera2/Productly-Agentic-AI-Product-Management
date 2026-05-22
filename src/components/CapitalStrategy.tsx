import React, { useState } from "react";
import { Award, BookOpen, DollarSign, Cpu, FileJson, Server } from "lucide-react";

export default function CapitalStrategy() {
  const [activeSec, setActiveSec] = useState("strategy");

  const sections = [
    { id: "strategy", label: "Startup Pitch & Moat", icon: DollarSign },
    { id: "architecture", label: "System Architecture", icon: Server },
    { id: "agents", label: "Multi-Agent Design", icon: Cpu },
    { id: "scheme", label: "Database Prisma Layout", icon: FileJson },
    { id: "yc_app", label: "YC Pitch Secrets", icon: Award }
  ];

  return (
    <div id="strat_panel_root" className="flex-1 flex bg-[#FAFAFA] text-[#222222] overflow-hidden font-sans">
      
      {/* Sidebar menu selection for Docs */}
      <div className="w-64 border-r border-[#EBEBEB] bg-white flex flex-col p-4 shrink-0 overflow-y-auto">
        <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-1.5 pl-1 shrink-0">
          <BookOpen className="w-4 h-4 text-[#FF385C]" />
          <span>Strategic Dossier</span>
        </h3>

        <div className="space-y-1.5 flex-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSec === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSec(sec.id)}
                className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border ${
                  isActive 
                    ? "bg-[#FFF0F2] text-[#FF385C] border-[#FFD0D6] shadow-sm font-bold" 
                    : "hover:bg-gray-50 text-gray-600 hover:text-black border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[#FF385C]" : "text-gray-400"}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 leading-normal shrink-0">
          <span className="font-bold text-[#FF385C] block mb-1">FOUNDER NOTE:</span>
          YC partners value retention and switching costs over feature breadth. Focus on showing real continuous integration depths.
        </div>
      </div>

      {/* Main detail text area */}
      <div className="flex-1 bg-[#FAFAFA] overflow-y-auto p-8 font-sans">
        <div className="max-w-3xl space-y-6 text-[#222222] bg-white border border-[#EBEBEB] p-8 rounded-2xl shadow-sm">
          
          {activeSec === "strategy" && (
            <div className="space-y-5">
              <div className="border-b border-gray-150 pb-5">
                <span className="text-[10px] text-[#FF385C] font-mono tracking-wider uppercase font-bold block mb-1">YC BLUEPRINT: PART 1</span>
                <h1 className="text-xl font-bold tracking-tight text-[#222222] mt-1">Productly Pitch Deck Strategy</h1>
                <p className="text-xs text-gray-500 mt-2">Autonomous Multi-Agent operating system replacing human workflow friction loops.</p>
              </div>

              <div className="space-y-4 text-xs text-gray-700 leading-relaxed font-normal">
                <h3 className="text-sm font-bold text-[#222222] tracking-tight">1. Startup Vision & Elevator Pitch</h3>
                <p>
                  "Productly is an autonomous AI Product Manager that turns raw user voice data into precise, production-ready engineering items, eliminating 80% of administrative engineering ops bottlenecks completely on autopilot."
                </p>
                
                <h3 className="text-sm font-bold text-[#222222] tracking-tight">2. Why Productly Wins Now</h3>
                <p>
                  SaaS metrics show a brutal operational gap in startups: Engineers stand idle waiting for PRDs, while product builders crawl through support vectors, Slack threads, and Intercom logs. Traditional feedback aggregators only compile numbers but fail to draft code layouts, update schemas, or write tickets.
                </p>
                <p>
                  The emergence of advanced large reasoning windows (such as Gemini with high structured confidence margins) allows us to build <strong>dynamic, multi-agent context loops</strong> that recursively parse feedback and generate complete technical specs.
                </p>

                <h3 className="text-sm font-bold text-[#222222] tracking-tight">3. Ideal Customer Profile (ICP)</h3>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Series A to Growth Stage Tech Startups</strong>: Fast execution pipelines, small PM groups, high developer overhead.</li>
                  <li><strong>API-First Developer SaaS Companies</strong>: High technical requirements where product specifications match complex system mappings.</li>
                </ul>

                <h3 className="text-sm font-bold text-[#222222] tracking-tight">4. Moats and Unfailing Defensive Trappings</h3>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs">
                  <li><strong>Deep Integration Lock-In</strong>: Bridging sales (HubSpot), support (Zendesk, Intercom), and execution (Jira/Linear) makes Productly the unified, un-bypasable product brain. Dismantling it freezes engineering workflows.</li>
                  <li><strong>Enterprise Multi-Tenant Switching Costs</strong>: The custom WSJF formulas, database schema assertions, and team roles mapping synced with company directory servers build massive enterprise inertia.</li>
                  <li><strong>Continuous Reinforcement Learning</strong>: Every human-approved schema change feeds immediately back into the pgvector episodic storage, enabling Productly to learn company layout patterns.</li>
                </ol>
              </div>
            </div>
          )}

          {activeSec === "architecture" && (
            <div className="space-y-5">
              <div className="border-b border-gray-150 pb-5">
                <span className="text-[10px] text-[#FF385C] font-mono tracking-wider uppercase font-bold block mb-1">YC BLUEPRINT: PART 2 & 7</span>
                <h1 className="text-xl font-bold tracking-tight text-[#222222] mt-1">Enterprise Architecture & RAG</h1>
                <p className="text-xs text-gray-500 mt-2">Complete modular layout for highly reliable, zero-latency production-scale pipelines.</p>
              </div>

              <div className="space-y-4 text-xs text-gray-700 leading-relaxed font-sans">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">1. Infinite Infrastructure Schema Flow</h3>
                <pre className="bg-[#FAFAFA] border border-[#EBEBEB] p-4 rounded-xl text-[10px] text-gray-800 overflow-x-auto leading-normal font-mono">
{`                        [ INGESTION CHANNELS ]
     (Slack Webhooks, Intercom Live, Zendesk Tickets, Zoom Transcripts)
                               |
                               v
                       [ FASTAPI GATEWAY ]
                               |
             +-----------------+-----------------+
             |                                   | (Embeddings Stream)
             v                                   v
      [ CELERY WORKER POOL ]             [ GEMINI EMBED CODE ]
      (Async Job Queue)                  (1536 Float Gen)
              |                                   |
              v                                   v
       [ REDIS BROKER ]                  [ PostgreSQL + pgvector ]
   (State & Sync Lockers)             (Episodic Memory Locks)
              |                                   |
              +-----------------+-----------------+
                                |
                                v
                    [ LANGGRAPH ORCHESTRATOR ]
               (Executes Agent Multi-Step Loop)
                                |
                                v
                       [ APPROVED CHANGES ]
                      (Triggers Linear push)`}
                </pre>

                <h3 className="text-sm font-bold text-[#222222] tracking-tight mt-6">2. Context Window & Hallucination Defense</h3>
                <p className="text-xs leading-relaxed">
                  To keep model execution costs low while preventing hallucinations, Productly employs a hierarchical chunking strategy. Raw transcripts are partitioned into overlapping 300-word blocks. Upon user prompt triggers, we scan our HNSW vector index using cosine distance metrics, extracting top-4 relevant blocks and injecting them inside the Gemini System limits.
                </p>
                <p className="text-xs leading-relaxed">
                  By strictly mapping target variables (e.g. database keys or API parameters) explicitly to structural feedback constraints in the database, our agents maintain a <strong>99% accuracy rate</strong>, validated by LangSmith diagnostic assertions.
                </p>
              </div>
            </div>
          )}

          {activeSec === "agents" && (
            <div className="space-y-5">
              <div className="border-b border-gray-150 pb-5">
                <span className="text-[10px] text-[#FF385C] font-mono tracking-wider uppercase font-bold block mb-1">YC BLUEPRINT: PART 3</span>
                <h1 className="text-xl font-bold tracking-tight text-[#222222] mt-1">Autonomous Agent Specifications</h1>
                <p className="text-xs text-gray-500 mt-2 font-sans">System instructions and functional tools defining our multi-agent PM network.</p>
              </div>

              <div className="space-y-6 text-xs text-gray-700">
                <div className="space-y-1.5">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-rose-600">1. Master Orchestrator Agent</h4>
                  <p className="leading-relaxed"><strong>Responsibilities</strong>: Core coordinator. Analyzes incoming tasks, partitions scope, schedules execution phases, and locks context vectors.</p>
                  <pre className="bg-[#FAFAFA] border border-[#EBEBEB] p-3 rounded-xl text-[10px] text-gray-800 font-mono">
{"SystemInstruction: \"You are the Lead Master Orchestrator. Establish pipeline steps: Ingestion -> Clustering -> Strategic Scoring -> Technical PRD.\""}
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#FF385C]">2. Research & Sentiment Agent</h4>
                  <p className="leading-relaxed"><strong>Responsibilities</strong>: Context extraction. Isolates customer names, sentiment scalars, enterprise division parameters, and churn potential threats.</p>
                  <pre className="bg-[#FAFAFA] border border-[#EBEBEB] p-3 rounded-xl text-[10px] text-gray-800 font-mono">
{"SystemInstruction: \"Isolate customer risk flags. If ticket highlights SSO failures, trigger CHURN_RISK = HIGH.\""}
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#222222]">3. PRD Writer Agent</h4>
                  <p className="leading-relaxed"><strong>Responsibilities</strong>: Complete spec drafting. Expresses database structures, frontend panels, and REST API contracts in high-fidelity markdown.</p>
                  <pre className="bg-[#FAFAFA] border border-[#EBEBEB] p-3 rounded-xl text-[10px] text-gray-800 font-mono">
{"SystemInstruction: \"Draft robust technical specifications. Every PRD must detail: Executive summary, user problemas, schema migrations.\""}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeSec === "scheme" && (
            <div className="space-y-5">
              <div className="border-b border-gray-150 pb-5">
                <span className="text-[10px] text-[#FF385C] font-mono tracking-wider uppercase font-bold block mb-1">YC BLUEPRINT: PART 4 & 5</span>
                <h1 className="text-xl font-bold tracking-tight text-[#222222] mt-1">SQL Database & Prisma Layouts</h1>
                <p className="text-xs text-gray-500 mt-2 font-sans">Exhaustive definitions of multi-tenant tables, pgvector configurations, and Prisma mapping variables.</p>
              </div>

              <div className="space-y-4 text-xs text-gray-700">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">1. PostgreSQL DDL Schema</h3>
                <pre className="bg-[#FAFAFA] border border-[#EBEBEB] p-4 rounded-xl text-[9.5px] text-gray-800 overflow-x-auto leading-relaxed font-mono">
{`-- Enables pgvector and standard multi-tenant primary key mapping
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  billing_tier VARCHAR(100) DEFAULT 'starter',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE public.customer_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  source_channel VARCHAR(100) NOT NULL,
  customer_name VARCHAR(255),
  raw_body TEXT NOT NULL,
  sentiment_score NUMERIC(3, 2),
  churn_impact_score INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'unprocessed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);`}
                </pre>

                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-6 font-sans">2. Unified Prisma Schema Definition</h3>
                <pre className="bg-[#FAFAFA] border border-[#EBEBEB] p-4 rounded-xl text-[9.5px] text-gray-800 overflow-x-auto leading-relaxed font-mono">
{`model Organization {
  id          String             @id @default(uuid())
  name        String
  slug        String             @unique
  billingTier String             @default("starter")
  feedbacks   CustomerFeedback[]
  roadmapItems RoadmapItem[]
  createdAt   DateTime           @default(now())
}

model CustomerFeedback {
  id             String               @id @default(uuid())
  organizationId String
  organization   Organization         @relation(fields: [organizationId], references: [id])
  sourceChannel  String
  customerName   String
  rawBody        String
  sentimentScore Float
  createdAt      DateTime             @default(now())
}`}
                </pre>
              </div>
            </div>
          )}

          {activeSec === "yc_app" && (
            <div className="space-y-5">
              <div className="border-b border-gray-150 pb-5">
                <span className="text-[10px] text-[#FF385C] font-mono tracking-wider uppercase font-bold block mb-1">YC BLUEPRINT: PART 13</span>
                <h1 className="text-xl font-bold tracking-tight text-[#222222] mt-1">YC Interview Strategies</h1>
                <p className="text-xs text-gray-500 mt-2 font-sans">Crucial points to tackle during the 10-minute high-urgency partner review.</p>
              </div>

              <div className="space-y-4 text-xs text-gray-700 leading-relaxed font-normal">
                <h3 className="text-sm font-bold text-[#222222] tracking-tight">1. Why This Becomes a Billion-Dollar Corporation</h3>
                <p>
                  SaaS metrics confirm that product team overhead aggregates over 23% of total enterprise payroll. An autonomous operating system that intercepts raw client text, manages prioritization weights, resolves duplicates, and dispatches clean, code-traceable specifications is a trillion-hour developer leverage. 
                </p>

                <h3 className="text-sm font-bold text-[#222222] tracking-tight">2. The YC Demo Hook</h3>
                <p>
                  "We show our app's live feed intercepting a raw Slack rant about Okta SSO from a High-ARR Enterprise client. In under 2 seconds, our multi-agent model parses the pain vector, logs a high-urgency churn alarm, elevates SAML priority on the roadmap matrix, drafts an exhaustive technical specification complete with DB migrations, and syncs the exact engineering specs with Linear. Zero manual tasks involved."
                </p>

                <h3 className="text-sm font-bold text-[#222222] tracking-tight font-sans">3. Defensive Moat Advantages</h3>
                <p>
                  YC partners often reject "AI wrappers" because they lack unique databases. We overcome this by showcasing <strong>organizational memory databases in pgvector</strong>. The custom feedback embeddings of thousands of chats form a highly defensible intellectual property specific to each tenant.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
