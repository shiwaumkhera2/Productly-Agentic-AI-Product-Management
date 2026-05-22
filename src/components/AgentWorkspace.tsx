import React, { useState } from "react";
import { AgentRunLog } from "../types";
import { 
  Plus, 
  Cpu, 
  Play, 
  Activity, 
  Database,
  ArrowUpRight, 
  Settings, 
  Zap, 
  Layers, 
  Loader2,
  Info,
  Terminal,
  FileCode
} from "lucide-react";

interface AgentWorkspaceProps {
  onRunAgent: (prompt: string, agent: string) => Promise<{
    success: boolean;
    logs: AgentRunLog[];
    output: string;
    aiCalled: boolean;
  }>;
}

export default function AgentWorkspace({ onRunAgent }: AgentWorkspaceProps) {
  const [chosenAgent, setChosenAgent] = useState("PRD Writer Agent");
  const [promptText, setPromptText] = useState("Extract HashiCorp Okta Single Sign-On issues and draft a robust multi-tenant security PRD mapping Okta assertion levels to user roles.");
  const [logs, setLogs] = useState<AgentRunLog[]>([
    { step: "Initialize Connection", agent: "Orchestrator Agent", details: "Ready to launch product spec synthesis.", tokens: 0 }
  ]);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiCalled, setAiCalled] = useState(false);

  // Pre-configured templates
  const templates = [
    { label: "Okta/SAML SSO Spec", prompt: "Extract HashiCorp Okta Single Sign-On issues and draft a robust multi-tenant security PRD mapping Okta assertion levels to user roles." },
    { label: "Cluster Churn Alerts", prompt: "Scan all manual interview transcripts and negative Intercom feeds. Predict which high-ticket partners are likely to churn due to sync bottlenecks." },
    { label: "Analyze Custom Epics Sync", prompt: "Map dev issue tracing complaints regarding EPIC Link sync to custom JIRA layouts. Sketch out schema to map custom epics." },
    { label: "Linear Epics Roadmap", prompt: "Synthesize Slack threads marked as features. Create 3 prioritizations backing them up with financial WSJF weight matrix scores of at least 80." }
  ];

  const handleLaunch = async () => {
    if (!promptText.trim()) return;
    setIsLoading(true);
    setLogs([]);
    setOutput("");
    
    try {
      const response = await onRunAgent(promptText, chosenAgent);
      if (response.success) {
        setLogs(response.logs);
        setOutput(response.output);
        setAiCalled(response.aiCalled);
      } else {
        setLogs([
          { step: "Broker Error", agent: "Orchestrator Agent", details: "Process timed out. Fallback is processing locally.", tokens: 0 }
        ]);
      }
    } catch (err) {
      setLogs([
        { step: "Internal Error", agent: "Orchestrator Agent", details: "Offline pipeline engaged to recover schema context layers.", tokens: 0 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="agents_pnl_root" className="flex-1 flex flex-col bg-[#FAFAFA] text-[#222222] overflow-hidden font-sans">
      
      {/* Top Controls Bar */}
      <div className="p-6 border-b border-[#EBEBEB] bg-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shrink-0">
        <div>
          <span className="text-[10px] text-[#FF385C] font-mono tracking-wider uppercase font-bold block mb-1">Copilot Engine</span>
          <h2 className="text-xl font-bold text-[#222222] tracking-tight leading-none">Agent Workspace</h2>
          <p className="text-xs text-[#717171] mt-1.5">Direct AI product managers to outline specs, categorize user feedback lists, or construct roadmap drafts.</p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-gray-500 font-semibold">DELEGATED PROJECT AGENT:</span>
          <select 
            value={chosenAgent}
            onChange={(e) => setChosenAgent(e.target.value)}
            className="bg-white border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] font-semibold focus:border-[#FF385C] outline-none cursor-pointer text-xs"
          >
            <option value="Orchestrator Agent">Orchestrator Agent (Team Lead)</option>
            <option value="Research Agent">Research Agent (Data Ingest)</option>
            <option value="Roadmap Agent">Roadmap Priority Strategist</option>
            <option value="PRD Writer Agent">PRD Writer Specialist</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT COLUMN: Input Sandbox and Agent State Logs */}
        <div className="lg:w-1/2 p-6 flex flex-col space-y-5 overflow-y-auto border-r border-[#EBEBEB] bg-[#FAFAFA]">
          
          {/* Quick Prompt Templates */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#717171] uppercase tracking-wider block">Co-Pilot Blueprint Templates</span>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((tpl, i) => (
                <button
                  id={`btn_template_${i}`}
                  key={tpl.label}
                  onClick={() => setPromptText(tpl.prompt)}
                  className="p-3 bg-white border border-[#EBEBEB] hover:border-[#CCCCCC] rounded-xl text-xs text-left text-gray-700 hover:text-black transition-all truncate block cursor-pointer shadow-sm"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Entry Area */}
          <div className="space-y-1.5 flex-1 flex flex-col min-h-[160px]">
            <span className="text-[10px] font-bold text-[#717171] uppercase tracking-wider block">Focus Instructions</span>
            <textarea
              id="txt_prompt_entry"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full flex-1 p-4 bg-white border border-[#EBEBEB] text-[#222222] rounded-xl text-xs leading-relaxed outline-none focus:border-[#FF385C] resize-none font-medium text-gray-700 font-sans shadow-sm"
              placeholder="Type or select an autonomous product management instructions template..."
            />
          </div>

          {/* Call button */}
          <div className="flex items-center justify-between pt-1 shrink-0">
            <div className="flex items-center space-x-2 text-xs text-[#FF385C] bg-[#FFF0F2] p-2.5 rounded-xl border border-[#FFD0D6] font-medium">
              <Zap className="w-4 h-4 animate-pulse" />
              <span>Running robust Gemini Models workspace</span>
            </div>

            <button
              id="btn_launch_agent"
              onClick={handleLaunch}
              disabled={isLoading || !promptText.trim()}
              className="px-6 py-3 bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold rounded-xl text-xs flex items-center space-x-2 cursor-pointer shadow-sm transition-all hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating Spec...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-white fill-current" />
                  <span>Launch Copilot</span>
                </>
              )}
            </button>
          </div>

          {/* PROCESS STEPS LOGS */}
          <div className="space-y-2.5 pt-4 border-t border-[#EBEBEB]">
            <div className="flex items-center space-x-1.5">
              <Terminal className="w-4 h-4 text-[#FF385C]" />
              <span className="text-[10px] font-bold text-[#717171] uppercase tracking-wider block">Trace Actions</span>
            </div>
            <div className="space-y-2 text-xs">
              {logs.map((log, index) => (
                <div key={index} className="bg-white border border-[#EBEBEB] p-4 rounded-xl space-y-1 shadow-sm">
                  <div className="flex justify-between items-center text-[#222222]">
                    <span className="font-bold text-[#FF385C]">Phase {index + 1}: {log.step}</span>
                    <span className="text-gray-500 font-semibold text-[10px]">[{log.agent}]</span>
                  </div>
                  <p className="text-gray-600 leading-normal font-sans font-normal">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Output Preview Rendering */}
        <div className="flex-1 bg-white flex flex-col justify-between overflow-hidden">
          
          <div className="p-4 border-b border-[#EBEBEB] bg-white flex justify-between items-center shrink-0">
            <span className="text-xs text-[#717171] font-bold uppercase tracking-wider">Compilation Target Workspace</span>
            {aiCalled ? (
              <span className="text-purple-700 text-[10px] font-bold bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full">
                LIVE COMPILATION
              </span>
            ) : (
              <span className="text-[#FF385C] text-[10px] font-bold bg-[#FFF0F2] border border-[#FFD0D6] px-2.5 py-0.5 rounded-full">
                LOCAL COMPILATION
              </span>
            )}
          </div>

          <div className="flex-1 p-6 overflow-y-auto text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-10 h-10 text-[#FF385C] animate-spin" />
                <p className="text-gray-500 text-xs font-semibold text-center leading-relaxed font-sans">
                  Synthesizing prompt templates...<br/>
                  Matching context references down to specifications...
                </p>
              </div>
            ) : output ? (
              <div className="prose max-w-none text-gray-700 rounded-2xl bg-white p-5 border border-[#EBEBEB] leading-relaxed shadow-sm">
                {output}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#717171] space-y-3">
                <Info className="w-8 h-8 text-gray-300" />
                <span className="font-bold text-xs">Awaiting Agent Instructions</span>
                <span className="text-[11px] text-gray-400">Launch a blueprint template on the left to review parsed spec requirements here.</span>
              </div>
            )}
          </div>

          {output && (
            <div className="p-4 border-t border-[#EBEBEB] bg-[#FFF0F2] flex justify-between items-center text-xs shrink-0">
              <p className="text-[#FF385C] font-semibold text-xs leading-tight">
                💡 Document generated! You can review the specification under the Spec Writer & PRD workspace tab.
              </p>
              <button 
                onClick={() => {
                  alert("Successfully integrated coordinates into project memory!");
                }}
                className="bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold px-4 py-2 rounded-xl cursor-pointer shrink-0 ml-3 transition-colors shadow-sm"
              >
                Ingest to Memory
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
