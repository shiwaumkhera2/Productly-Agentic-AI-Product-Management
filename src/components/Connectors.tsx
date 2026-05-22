import React, { useState } from "react";
import { Link2, Sparkles, Check, Radio, RefreshCw } from "lucide-react";

interface ConnectorsProps {
  onSimulateWebhook: (type: string) => void;
}

export default function Connectors({ onSimulateWebhook }: ConnectorsProps) {
  const [integrations, setIntegrations] = useState([
    { id: "intercom", name: "Intercom Ingestion Core", desc: "Listens to customer support live chats, tags sentiment, and computes churn parameters.", status: "Connected" },
    { id: "slack", name: "Slack Discussion Listener", desc: "Watches defined product channels, extracting threads marked with emoji.", status: "Connected" },
    { id: "zendesk", name: "Zendesk Tickets Bridge", desc: "Ingests raw enterprise complaints and aggregates sync epic issues.", status: "Disconnected" },
    { id: "jira", name: "Jira Bidirectional Syncing", desc: "Pushes approved PRD action specs and maps status updates.", status: "Connected" },
    { id: "linear", name: "Linear Agile Pipeline", desc: "Creates task issues directly within active sprint epics.", status: "Connected" },
    { id: "github", name: "GitHub Repository Mapping", desc: "Scans repository file layout architecture for schema reference analysis.", status: "Disconnected" }
  ]);

  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([
    "System listening post initialised on route /api/v1/ingest/webhooks",
    "Active sync confirmed with Jira Cloud project ID PROD-24"
  ]);

  const handleToggle = (id: string) => {
    setIntegrations(integrations.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === "Connected" ? "Disconnected" : "Connected";
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const executeWebhookSimulation = (vendor: string) => {
    onSimulateWebhook(vendor);
    const timeString = new Date().toLocaleTimeString();
    let msg = `[${timeString}] Outbound simulation webhook captured from ${vendor.toUpperCase()}. Processing payload...`;
    if (vendor === "intercom") {
      msg += " Extracted ticket content: 'SAML SSO login holds our PM rollout.'";
    } else if (vendor === "slack") {
      msg += " Ingested thread thread-9481 regarding custom epic mappings.";
    }
    setSimulatedLogs([msg, ...simulatedLogs]);
  };

  return (
    <div id="connectors_root" className="flex-1 flex flex-col bg-[#FAFAFA] text-[#222222] overflow-hidden font-sans">
      
      {/* HUD Header */}
      <div className="p-6 border-b border-[#EBEBEB] bg-white shrink-0">
        <span className="text-[10px] text-[#FF385C] font-mono tracking-wider uppercase font-bold block mb-1">Integrations</span>
        <h2 className="text-xl font-bold text-[#222222] tracking-tight leading-none">Connectors &amp; Webhook Pipelines</h2>
        <p className="text-xs text-gray-500 mt-1.5">Sync support tools, roadmap schedules, and roadmap specifications directly with developer resources.</p>
      </div>

      {/* Grid area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left card grid */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#FAFAFA]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((item) => (
              <div 
                key={item.id} 
                className="p-5 bg-white border border-[#EBEBEB] rounded-2xl flex flex-col justify-between hover:border-gray-300 transition-all shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-[#222222] tracking-tight leading-none">{item.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.status === "Connected" 
                        ? "bg-[#FFF0F2] text-[#FF385C] border-[#FFD0D6]" 
                        : "bg-gray-50 text-gray-400 border-gray-200"
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-normal font-sans font-normal">{item.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0F0F0]">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="text-xs text-[#717171] hover:text-[#222222] flex items-center transition cursor-pointer font-semibold"
                  >
                    {item.status === "Connected" ? (
                      <span className="text-[#FF385C] flex items-center gap-1.5">🟢 Active Linkage</span>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1.5">⚪ Inactive Linkage</span>
                    )}
                  </button>

                  {item.status === "Connected" && (
                     <button
                       onClick={() => executeWebhookSimulation(item.id)}
                       className="cursor-pointer bg-white hover:bg-gray-50 border border-[#EBEBEB] text-[#FF385C] px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm"
                     >
                       Simulate webhook
                     </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right terminal pipeline logs */}
        <div className="w-80 bg-white p-6 flex flex-col justify-between border-l border-[#EBEBEB] shrink-0 text-xs overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <h4 className="text-xs uppercase tracking-wider text-[#222222] font-bold mb-4 flex items-center gap-1.5 pb-2 border-b border-[#EBEBEB]">
              <Radio className="w-4 h-4 text-[#FF385C] animate-pulse" />
              <span>Event Log Queue</span>
            </h4>
            
            <div className="flex-1 bg-gray-50 p-4 rounded-xl text-[11px] text-gray-600 leading-normal overflow-y-auto space-y-2 relative border border-[#EBEBEB] font-mono">
              {simulatedLogs.map((log, index) => (
                <div key={index} className="border-b border-gray-150 pb-1.5 w-full whitespace-pre-wrap leading-normal font-normal">
                  <span className="text-[#FF385C] font-bold">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-tr from-[#FFF0F2] to-white border border-[#FFD0D6] rounded-2xl mt-6 shrink-0 shadow-sm text-xs">
            <span className="text-[10px] font-bold text-[#FF385C] block uppercase tracking-wider mb-1">Live Endpoint URL</span>
            <p className="text-gray-500 leading-normal">
              Webhook triggers can deliver payloads to: <strong className="text-gray-800 font-mono text-[10px]">https://productly.io/api/v1/webhook</strong>. Set private credentials in the secrets list.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
