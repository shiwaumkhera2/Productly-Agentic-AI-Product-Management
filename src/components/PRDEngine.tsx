import React, { useState } from "react";
import { PRDDocument } from "../types";
import { 
  FileText, 
  Check, 
  Plus, 
  Loader2,
  Code2,
  FileCheck2,
  Lock
} from "lucide-react";

interface PRDEngineProps {
  prds: PRDDocument[];
  onAddPRD: (data: Partial<PRDDocument>) => Promise<void>;
  onApprovePRD: (id: string, newStatus: string) => void;
  isLoading: boolean;
}

export default function PRDEngine({ prds, onAddPRD, onApprovePRD, isLoading }: PRDEngineProps) {
  const [selectedPRD, setSelectedPRD] = useState<PRDDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formRoadmapId, setFormRoadmapId] = useState("rd-1");
  const [isCreating, setIsCreating] = useState(false);

  const activePRD = selectedPRD || prds[0] || null;

  const handleApprove = (prd: PRDDocument) => {
    onApprovePRD(prd.id, "Approved");
    if (activePRD?.id === prd.id) {
      setSelectedPRD({ ...prd, status: "Approved" });
    }
    alert(`Success! [${prd.title}] has been approved and marked active.`);
  };

  const handleSaveEdit = () => {
    if (!activePRD) return;
    onApprovePRD(activePRD.id, activePRD.status); 
    activePRD.content = editedContent;
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (!activePRD) return;
    setEditedContent(activePRD.content);
    setIsEditing(true);
  };

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) return;
    setIsCreating(true);
    await onAddPRD({
      title: formTitle,
      content: formContent,
      roadmapId: formRoadmapId,
    });
    setFormTitle("");
    setFormContent("");
    setShowAddForm(false);
    setIsCreating(false);
  };

  return (
    <div id="prd_panel_root" className="flex-1 flex flex-col h-full bg-[#FAFAFA] text-[#222222] overflow-hidden font-sans">
      
      {/* HUD Header */}
      <div id="prd_hud" className="p-6 border-b border-[#EBEBEB] bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <span className="text-[10px] text-[#FF385C] font-mono tracking-wider uppercase font-bold block mb-1">Specification Engine</span>
          <h2 className="text-xl font-bold text-[#222222] tracking-tight leading-none">PRD Spec Writer</h2>
          <p className="text-xs text-[#717171] mt-1.5">Drafting clean, structured requirements specs from customer interview records and roadmap priorities.</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button 
            id="btn_write_new_prd"
            onClick={() => setShowAddForm(true)}
            className="cursor-pointer px-4 py-2.5 bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Draft New Spec</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: PRD List */}
        <div className="w-80 border-r border-[#EBEBEB] overflow-y-auto p-4 space-y-3 shrink-0 bg-[#F7F7F7]">
          <span className="text-[10px] font-bold text-[#717171] uppercase tracking-wider block mb-2 pl-2">Available Specs</span>
          
          {isLoading ? (
            <div className="text-xs text-gray-500 p-4 text-center">Reading storage records...</div>
          ) : prds.length === 0 ? (
            <div className="text-xs text-gray-500 p-4 text-center">No specifications created yet.</div>
          ) : (
            <div className="space-y-2">
              {prds.map((p) => {
                const isSelected = activePRD?.id === p.id;
                return (
                  <div
                    id={`prd_menu_item_${p.id}`}
                    key={p.id}
                    onClick={() => {
                      setSelectedPRD(p);
                      setIsEditing(false);
                    }}
                    className={`p-4 rounded-xl cursor-pointer border text-left transition-all ${
                      isSelected 
                        ? "bg-white border-[#FF385C] shadow-sm ring-1 ring-[#FF385C]/10"
                        : "bg-white border-[#EBEBEB] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{p.version}</span>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                        p.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <h5 className={`text-xs font-bold mb-1 truncate leading-none ${isSelected ? "text-[#FF385C]" : "text-[#222222]"}`}>{p.title}</h5>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mt-1">{p.summary}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Document view */}
        <div className="flex-1 overflow-y-auto bg-white p-8 flex flex-col">
          {activePRD ? (
            <div className="max-w-3xl mx-auto w-full space-y-6">
              
              {/* Document Metadata header */}
              <div className="border-b border-[#EBEBEB] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] text-[#717171] uppercase mb-2">
                    <span className="font-semibold text-gray-500">VERSION ID:</span>
                    <span className="text-[#FF385C] font-semibold">{activePRD.id}</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-500">AUTHOR:</span>
                    <span className="text-[#FF385C] font-semibold">{activePRD.author}</span>
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-[#222222] leading-tight">{activePRD.title}</h1>
                </div>

                <div className="flex space-x-2 shrink-0">
                  {activePRD.status !== "Approved" && (
                    <button 
                      onClick={() => handleApprove(activePRD)}
                      className="cursor-pointer px-4 py-2 bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Spec</span>
                    </button>
                  )}
                  {isEditing ? (
                    <button 
                      onClick={handleSaveEdit}
                      className="cursor-pointer px-4 py-2 bg-[#222222] hover:bg-black text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Save Spec
                    </button>
                  ) : (
                    <button 
                      onClick={handleStartEdit}
                      className="cursor-pointer px-4 py-2 bg-[#FAFAFA] hover:bg-gray-100 border border-gray-300 text-[#484848] rounded-xl text-xs font-bold transition-all"
                    >
                      Edit Spec
                    </button>
                  )}
                </div>
              </div>

              {/* Editable Markdown Content Body */}
              {isEditing ? (
                <div className="space-y-1.5">
                  <div className="bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-t-xl text-[10px] text-gray-600 font-semibold uppercase flex items-center space-x-1.5">
                    <Code2 className="w-4 h-4 text-[#FF385C]" />
                    <span>Markdown Workspace Editor</span>
                  </div>
                  <textarea 
                    rows={18}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EBEBEB] rounded-b-xl border-t-none p-4 text-[#222222] font-mono text-xs leading-relaxed outline-none focus:border-[#FF385C]"
                  />
                </div>
              ) : (
                <div className="prose max-w-none text-xs text-gray-700 leading-relaxed space-y-4">
                  {/* Simplistic Markdown Previewer */}
                  <div className="bg-white border border-[#EBEBEB] p-6 rounded-2xl whitespace-pre-wrap leading-relaxed font-sans text-gray-700 shadow-sm">
                    {activePRD.content}
                  </div>
                </div>
              )}
              
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#717171] text-xs">
              <FileText className="w-8 h-8 text-gray-300 mb-2" />
              <span>Select or draft a product requirements specification document.</span>
            </div>
          )}
        </div>

      </div>

      {/* MODAL: Draft New Spec */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#EBEBEB] rounded-2xl w-full max-w-xl p-6 shadow-xl text-xs">
            <h3 className="text-base font-bold text-[#222222] mb-4 pb-3 border-b border-[#EBEBEB]">Compose Product Specification</h3>
            
            <form onSubmit={handleSubmitNew} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold text-xs mb-1">Spec Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. SSO Integration specification" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] outline-none focus:border-[#FF385C]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold text-xs mb-1">Strategic Alignment Linkage</label>
                  <select 
                    value={formRoadmapId}
                    onChange={(e) => setFormRoadmapId(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] outline-none focus:border-[#FF385C]"
                  >
                    <option value="rd-1">Enterprise SAML SSO (rd-1)</option>
                    <option value="rd-2">Custom Jira/Linear Custom sync (rd-2)</option>
                    <option value="rd-3">Slack Ingest Engine (rd-3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-xs mb-1">Content (Raw Markdown)</label>
                <textarea 
                  required
                  rows={8}
                  placeholder="# Spec Title&#10;&#10;## 1. Problem Statement&#10;Describe user problem here.&#10;&#10;## 2. Technical Solution&#10;Outline APIs to invoke." 
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-4 text-[#222222] font-mono rounded-xl outline-none focus:border-[#FF385C]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-[#EBEBEB] px-4 py-2.5 rounded-xl cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer flex items-center space-x-1.5 shadow-sm"
                >
                  {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Commit PRD Blueprint</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
