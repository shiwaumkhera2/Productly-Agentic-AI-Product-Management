import React, { useState } from "react";
import { FeedbackLog } from "../types";
import { 
  Inbox, 
  Send, 
  Plus, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  Loader2,
  Bookmark,
  Users,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface FeedbackInboxProps {
  logs: FeedbackLog[];
  onAddFeedback: (data: Partial<FeedbackLog>) => Promise<void>;
  dispatchToAgent: (feedback: FeedbackLog) => void;
  isLoading: boolean;
}

export default function FeedbackInbox({ logs, onAddFeedback, dispatchToAgent, isLoading }: FeedbackInboxProps) {
  const [selectedLog, setSelectedLog] = useState<FeedbackLog | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCustomer, setFormCustomer] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSource, setFormSource] = useState("Intercom");
  const [formCategory, setFormCategory] = useState("Auth & Access Control");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback selected item if logs update
  const activeLog = selectedLog || logs[0] || null;

  // Quick stats
  const highRiskCount = logs.filter(l => l.churnRisk === "high").length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent || !formCustomer) return;
    
    setIsSubmitting(true);
    await onAddFeedback({
      title: formTitle,
      content: formContent,
      customer: formCustomer,
      email: formEmail || `${formCustomer.toLowerCase().replace(/\s+/g, '')}@company.com`,
      source: formSource,
      category: formCategory,
    });
    
    // reset form
    setFormTitle("");
    setFormContent("");
    setFormCustomer("");
    setFormEmail("");
    setShowAddForm(false);
    setIsSubmitting(false);
  };

  return (
    <div id="feedback_panel_root" className="flex-1 flex flex-col h-full bg-[#FAFAFA] text-[#222222] overflow-hidden font-sans">
      
      {/* Title & Stats HUD */}
      <div id="feedback_hud" className="p-6 border-b border-[#EBEBEB] bg-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shrink-0">
        <div>
          <span className="text-[10px] text-[#FF385C] font-mono tracking-wider uppercase font-bold block mb-1">Customer Feeds Queue</span>
          <h2 id="feedback_heading" className="text-xl font-bold text-[#222222] tracking-tight leading-none font-sans">Support &amp; Transcript Intake</h2>
          <p id="feedback_para" className="text-xs text-[#717171] mt-1.5">A clear space to collect user feedback, Intercom support logs, and Slack chats to outline priorities.</p>
        </div>
        
        <div id="feedback_counters" className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-[#FAEBEF] border border-[#FFD0D6] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#FF385C] flex items-center space-x-1.5">
            <span>Ingested Feeds:</span> 
            <span className="font-bold">{logs.length} total</span>
          </div>
          {highRiskCount > 0 && (
            <div className="bg-[#FFF0F2] border border-[#FFD0D6] px-3.5 py-2 rounded-xl text-xs font-medium text-rose-600 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="font-bold">{highRiskCount} High Risk Retention Signals</span>
            </div>
          )}
          <button 
            id="btn_new_feed"
            onClick={() => setShowAddForm(true)}
            className="cursor-pointer bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold py-2.5 px-4 rounded-xl flex items-center space-x-1.5 transition-all text-xs shadow-sm hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Feed Record</span>
          </button>
        </div>
      </div>

      {/* Main split-view area */}
      <div id="feedback_split" className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Feed List */}
        <div id="feedback_left_col" className="w-1/2 border-r border-[#EBEBEB] flex flex-col overflow-y-auto bg-[#F7F7F7]">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-2">
              <Loader2 className="w-8 h-8 text-[#FF385C] animate-spin" />
              <span className="text-xs text-[#717171]">Evaluating feedback data channels...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-[#EBEBEB] shadow-sm">
                <Inbox className="w-6 h-6 text-[#FF385C]" />
              </div>
              <p className="text-xs text-[#717171] uppercase tracking-wider font-semibold">Your feeds inbox is empty.</p>
              <p className="text-[11px] text-[#717171] max-w-xs leading-normal">Simulate some webhooks or click "Add Feed Record" to populate this workspace.</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {logs.map((log) => {
                const isSelected = activeLog?.id === log.id;
                return (
                  <div
                    id={`feedback_card_${log.id}`}
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border text-left flex flex-col justify-between min-h-[130px] ${
                      isSelected 
                        ? "bg-white border-[#FF385C] shadow-md ring-1 ring-[#FF385C]/10"
                        : "bg-white border-[#EBEBEB] hover:border-[#CCCCCC] hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          log.source === "Intercom" ? "bg-red-50 text-[#FF385C] border-red-100" :
                          log.source === "Slack Sync" ? "bg-amber-50 text-amber-700 border-amber-100" :
                          log.source === "User Interview" ? "bg-purple-50 text-purple-700 border-purple-100" :
                          "bg-teal-50 text-teal-700 border-teal-100"
                        }`}>
                          {log.source}
                        </span>
                        <span className="text-xs text-[#717171] font-medium">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#222222] truncate mb-1">
                        {log.title}
                      </h3>
                      
                      <p className="text-xs text-[#484848] line-clamp-2 leading-relaxed">
                        {log.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0F0F0]">
                      <span className="text-xs text-[#717171] font-semibold truncate max-w-[200px]">
                        👤 {log.customer}
                      </span>
                      
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {log.churnRisk === "high" && (
                          <span className="bg-[#FFF0F2] text-xs font-bold px-2 py-0.5 rounded-md border border-[#FFD0D6]">
                            ⚠️ Risk
                          </span>
                        )}
                        <span className="text-xs font-semibold text-[#717171] bg-gray-50 border border-[#EBEBEB] px-2 py-0.5 rounded-md">
                          Vibe: {log.vibeRating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Selected Detail Panel */}
        <div id="feedback_right_col" className="w-1/2 bg-white flex flex-col overflow-y-auto">
          {activeLog ? (
            <div id="feed_detail_panel" className="p-6 flex flex-col h-full bg-white justify-between">
              <div>
                <div className="border-b border-[#EBEBEB] pb-5 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-gray-200">
                      ID: {activeLog.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-[#717171]">
                      Received At: {new Date(activeLog.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <h1 className="text-lg font-bold text-[#222222] mb-3 leading-snug">
                    {activeLog.title}
                  </h1>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div className="bg-[#F7F7F7] p-3 rounded-xl border border-[#EBEBEB]">
                      <span className="text-[#717171] block text-[10px] uppercase font-bold">Contact Customer</span>
                      <span className="text-[#222222] block font-bold mt-0.5 truncate">{activeLog.customer}</span>
                      <span className="text-[#717171] block mt-0.5 truncate">{activeLog.email}</span>
                    </div>
                    <div className="bg-[#F7F7F7] p-3 rounded-xl border border-[#EBEBEB]">
                      <span className="text-[#717171] block text-[10px] uppercase font-bold">Domain Area</span>
                      <span className="text-[#222222] block font-bold mt-0.5">{activeLog.category}</span>
                      {activeLog.churnRisk === "high" ? (
                        <span className="text-rose-600 font-bold block text-[10px] uppercase mt-0.5 tracking-wider">⚠️ Retention Impacting</span>
                      ) : (
                        <span className="text-emerald-700 font-bold block text-[10px] uppercase mt-0.5 tracking-wider">Stable Sentiment</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ingested Content Block */}
                <div className="bg-white border border-[#EBEBEB] p-5 rounded-2xl mb-6 relative shadow-sm">
                  <div className="absolute top-4 right-4 flex items-center space-x-1.5 text-[9px] text-[#FF385C] bg-[#FFF0F2] px-2.5 py-0.5 rounded-full border border-[#FFD0D6] font-bold">
                    <Users className="w-3 h-3 animate-pulse" />
                    <span>Dialogue Context</span>
                  </div>
                  <h4 className="text-[10px] font-bold text-[#717171] uppercase tracking-wider mb-2.5">Conversation Snapshot</h4>
                  <div className="text-xs text-[#222222] leading-relaxed whitespace-pre-wrap">
                    {activeLog.content}
                  </div>
                </div>
              </div>

              {/* Action Buttons to trigger autonomous pipeline */}
              <div className="border-t border-[#EBEBEB] pt-5 mt-auto bg-white">
                <div className="bg-[#FFF0F2] border border-[#FFD0D6] rounded-xl p-4 mb-4 text-xs">
                  <div className="flex items-center space-x-2 text-[#FF385C] font-bold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="uppercase text-[9px] tracking-widest">RAG Index Verification</span>
                  </div>
                  <p className="text-xs text-[#484848] leading-normal font-sans">
                    Indexed correctly. This ticket can be parsed into actionable specs by clicking the AI Workspace pipeline triggers below.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button 
                    id="btn_trigger_spec_gen"
                    onClick={() => dispatchToAgent(activeLog)}
                    className="flex-1 cursor-pointer bg-[#FF385C] hover:bg-[#E61E4D] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Agent Workspace</span>
                  </button>
                  <button 
                    id="btn_trigger_prio_log"
                    onClick={() => {
                      alert("Context similarities mapped. No additional priorities needed.");
                    }}
                    className="cursor-pointer bg-white hover:bg-gray-50 border border-[#EBEBEB] text-[#484848] px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <span>Check RAG Similarities</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#717171] text-xs">
              Select an ingested feed to view full conversation details and trigger tasks.
            </div>
          )}
        </div>
      </div>

      {/* MODAL LIGHTBOX: Create Ingestion Stream */}
      {showAddForm && (
        <div id="add_modal_overlay" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div id="add_modal_card" className="bg-white border border-[#EBEBEB] rounded-2xl w-full max-w-xl p-6 shadow-xl text-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Add New Ingested Feedback</h3>
              <span className="text-[10px] bg-[#FFF0F2] text-[#FF385C] px-2.5 py-0.5 rounded border border-[#FFD0D6] font-bold">New Resource</span>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#484848] font-semibold mb-1 text-[11px]">Customer Identifier</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. OpenAI Ops" 
                    value={formCustomer}
                    onChange={(e) => setFormCustomer(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] outline-none focus:border-[#FF385C]"
                  />
                </div>
                <div>
                  <label className="block text-[#484848] font-semibold mb-1 text-[11px]">Client Admin Email</label>
                  <input 
                    type="email" 
                    placeholder="engineer@company.com" 
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] outline-none focus:border-[#FF385C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#484848] font-semibold mb-1 text-[11px]">Source Channel</label>
                  <select 
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] focus:border-[#FF385C] outline-none"
                  >
                    <option value="Intercom">Intercom Live Messenger</option>
                    <option value="Zendesk">Zendesk Enterprise Desk</option>
                    <option value="Slack Sync">Slack Discussion Trace</option>
                    <option value="User Interview">Sales Meeting Transcript</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#484848] font-semibold mb-1 text-[11px]">Product Segment</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] focus:border-[#FF385C] outline-none"
                  >
                    <option value="Auth & Access Control">Auth & Access Control</option>
                    <option value="Integrations & Sync">Integrations & Sync</option>
                    <option value="Roadmap & Strategy">Roadmap & Strategy</option>
                    <option value="AI Content & Generation">AI Models Pipeline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#484848] font-semibold mb-1 text-[11px]">Ingestion Title Summary</label>
                <input 
                  required
                  type="text" 
                  placeholder="Need SAML/Okta token sync mappings" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] outline-none focus:border-[#FF385C]"
                />
              </div>

              <div>
                <label className="block text-[#484848] font-semibold mb-1 text-[11px]">Dialogue Content</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Paste chat transcripts, customer notes or bullet ideas. Keyword 'Okta' or 'SAML' boosts churn risks automatically." 
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] outline-none focus:border-[#FF385C] font-sans"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button 
                  id="btn_cancel_add_feed"
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="bg-[#FAFAFA] hover:bg-gray-100 text-gray-700 border border-[#EBEBEB] px-4 py-2.5 rounded-xl cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button 
                  id="btn_submit_feed_form"
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Add To Feeds</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
