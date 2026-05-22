import React from "react";
import { Activity, Flame } from "lucide-react";

export default function AgentPulse() {
  const agents = [
    { name: "Orchestrator Core", status: "ROUTING", color: "text-[#FF385C] bg-[#FFF0F2] border-[#FFD0D6]", desc: "Mapping inbound user issues directly to specific epic components...", progress: 84 },
    { name: "Support Ingestion Engine", status: "ANALYZING", color: "text-[#FF385C] bg-[#FFF0F2] border-[#FFD0D6]", desc: "Parsing Slack threads & Intercom transcripts for pgvector embeddings...", progress: 92 },
    { name: "WSJF Matrix Strategist", status: "EVALUATING", color: "text-[#FF385C] bg-[#FFF0F2] border-[#FFD0D6]", desc: "Recalculating strategic weight delays based on ARR and churn indicators...", progress: 45 },
    { name: "Prisma Schema Co-pilot", status: "STANDBY", color: "text-[#717171] bg-gray-100 border-gray-200", desc: "Standing by to compile database models for approved specifications...", progress: 0 },
    { name: "Jira / Linear Bridge", status: "DISPATCHED", color: "text-emerald-700 bg-emerald-50 border-emerald-200", desc: "Pushing approved PRD issues directly into development sprints...", progress: 100 }
  ];

  return (
    <aside id="agent_pulse_panel_aside" className="w-64 border-l border-[#EBEBEB] bg-white flex flex-col h-full select-none text-[11px] shrink-0 font-sans">
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        
        {/* Header indicator */}
        <div className="flex items-center space-x-2 pb-2 border-b border-[#EBEBEB]">
          <Activity className="w-4 h-4 text-[#FF385C] animate-pulse" />
          <h3 className="text-[10px] font-bold text-[#222222] uppercase tracking-widest leading-none">Agent Monitor Stream</h3>
        </div>

        {/* List of active background agents */}
        <div className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.name} className="p-3 bg-white border border-[#EBEBEB] rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-[#222222] leading-none">{agent.name}</span>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-md border font-bold tracking-wider ${agent.color}`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-[10px] text-[#717171] leading-relaxed mb-2 font-normal">
                {agent.desc}
              </p>
              {agent.progress > 0 && (
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#FF385C] h-full rounded-full transition-all duration-500"
                    style={{ width: `${agent.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Soft warning message with Red Alert styling */}
        <div className="p-4 bg-[#FFF0F2] border border-[#FFD0D6] rounded-xl relative overflow-hidden shadow-sm">
          <div className="flex items-center space-x-1.5 text-[#FF385C] font-bold mb-1.5">
            <Flame className="w-4 h-4 text-[#FF385C] animate-bounce" />
            <span className="uppercase text-[9px] tracking-widest font-bold">Churn Risk Assessment</span>
          </div>
          <p className="text-[10px] text-[#484848] leading-relaxed">
            Okta Single Sign-On block detected inside customer conversation stream. Segment ARR impact: <span className="text-[#FF385C] font-bold font-mono bg-white px-1.5 py-0.5 rounded border border-[#FFD0D6]">$140k ARR</span>.
          </p>
        </div>

      </div>
      
      {/* Footer list */}
      <div className="p-4 border-t border-[#EBEBEB] bg-[#FAFAFA]">
        <span className="text-[9px] font-mono font-bold text-[#717171] uppercase tracking-widest mb-2 block">Indexed Pipelines</span>
        <div className="flex flex-wrap gap-1">
          {["SLACK", "JIRA", "INTERCOM", "NOTION"].map((label) => (
            <span key={label} className="bg-white text-[#484848] px-1.5 py-0.5 rounded border border-[#EBEBEB] font-mono text-[8px] font-bold">
              {label}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
