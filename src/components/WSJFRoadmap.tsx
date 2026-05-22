import React, { useState } from "react";
import { RoadmapItem } from "../types";
import { 
  Map, 
  ArrowUpRight, 
  Layers, 
  Gauge, 
  Sliders, 
  Activity, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Plus,
  Compass
} from "lucide-react";

interface WSJFRoadmapProps {
  roadmap: RoadmapItem[];
  onAddRoadmapItem: (data: Partial<RoadmapItem>) => Promise<void>;
  onUpdateStatus: (id: string, status: string, jiraTicket?: string, score?: number) => void;
}

export default function WSJFRoadmap({ roadmap, onAddRoadmapItem, onUpdateStatus }: WSJFRoadmapProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImpact, setNewImpact] = useState("High");
  const [newEffort, setNewEffort] = useState("Medium");
  const [newCategory, setNewCategory] = useState("Core Feature");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    setIsSubmitting(true);
    await onAddRoadmapItem({
      title: newTitle,
      description: newDesc,
      impact: newImpact,
      effort: newEffort,
      category: newCategory
    });
    setNewTitle("");
    setNewDesc("");
    setShowAddForm(false);
    setIsSubmitting(false);
  };

  const handleManualSync = (item: RoadmapItem) => {
    const randomID = "PROD-" + Math.floor(1000 + Math.random() * 9000);
    onUpdateStatus(item.id, "In Progress", randomID);
    alert(`Success! Linked topic with developer active sprints. Created Ticket Key: ${randomID}`);
  };

  const handlePromoteWSJF = (item: RoadmapItem) => {
    const elevatedScore = Math.min(100, item.priorityScore + 10);
    onUpdateStatus(item.id, item.status, item.jiraTicket, elevatedScore);
  };

  return (
    <div id="roadmap_panel_root" className="flex-1 flex flex-col h-full bg-[#FAFAFA] text-[#222222] overflow-hidden font-sans">
      
      {/* Title & HUD */}
      <div id="roadmap_hud" className="p-6 border-b border-[#EBEBEB] bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <span className="text-[10px] text-[#FF385C] font-mono tracking-wider uppercase font-bold block mb-1 font-sans">Core Prioritization</span>
          <h2 className="text-xl font-bold text-[#222222] tracking-tight leading-none">Product Roadmap</h2>
          <p className="text-xs text-[#717171] mt-1.5">Weighted metrics calculated from support tickets and customer values to structure development sprints.</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button 
            id="btn_add_roadmap_item"
            onClick={() => setShowAddForm(true)}
            className="cursor-pointer px-4 py-2.5 bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Propose New Topic</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Prioritized Items / Right Weighted Calculator Overview */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Table/List Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 border-r border-[#EBEBEB] bg-[#FAFAFA]">
          {roadmap.map((item) => (
            <div 
              key={item.id} 
              className="p-5 bg-white border border-[#EBEBEB] rounded-2xl hover:border-[#CCCCCC] hover:shadow-md transition-all flex flex-col md:flex-row md:items-start md:justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="bg-[#FFF0F2] text-[#FF385C] font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-[#FFD0D6]">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border text-center ${
                    item.status === "In Progress" ? "border-amber-200 bg-amber-50 text-amber-700" :
                    item.status === "Done" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                    "border-gray-200 bg-gray-50 text-gray-600"
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-[#222222] tracking-tight">{item.title}</h3>
                <p className="text-xs text-[#484848] leading-relaxed max-w-2xl font-normal">{item.description}</p>
                
                {/* Agent Rationale Block */}
                <div className="mt-3 bg-[#F7F7F7] border border-[#EBEBEB] p-3.5 rounded-xl text-xs text-[#484848] leading-relaxed font-sans">
                  <span className="text-[#FF385C] font-bold block mb-1 text-[10px] uppercase tracking-wider">AI Alignment Assessment:</span>
                  {item.agentRationale}
                </div>
              </div>

              {/* Dynamic Stats & Action Widgets */}
              <div className="md:w-48 flex flex-col justify-between items-end h-full min-h-[110px] md:border-l border-gray-100 md:pl-4 shrink-0">
                <div className="text-right w-full">
                  <span className="text-[10px] text-[#717171] font-bold uppercase tracking-wider block">Priority Score</span>
                  <span className="text-2xl font-bold text-[#FF385C] block tracking-tight">
                    {item.priorityScore} <span className="text-xs text-[#717171] font-normal">/ 100</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-700 mb-3 w-full">
                  <div className="bg-[#FAFAFA] py-1 px-1.5 rounded-lg text-center border border-gray-200">
                    <span className="text-gray-500 block text-[9px] uppercase font-bold">IMPACT</span>
                    <span className="text-gray-900 font-bold">{item.impact}</span>
                  </div>
                  <div className="bg-[#FAFAFA] py-1 px-1.5 rounded-lg text-center border border-gray-200">
                    <span className="text-gray-500 block text-[9px] uppercase font-bold">EFFORT</span>
                    <span className="text-gray-900 font-bold">{item.effort}</span>
                  </div>
                </div>

                <div className="flex space-x-1.5 w-full">
                  <button 
                    onClick={() => handlePromoteWSJF(item)}
                    className="cursor-pointer flex-1 bg-white hover:bg-gray-50 text-[#FF385C] hover:text-[#E61E4D] py-1.5 rounded-lg border border-[#EBEBEB] text-xs font-semibold transition-all shadow-sm"
                    title="Promote prioritization score level"
                  >
                    Boost
                  </button>
                  {item.jiraTicket === "Unassigned" ? (
                    <button 
                      onClick={() => handleManualSync(item)}
                      className="cursor-pointer flex-1 bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                    >
                      Sync Jira
                    </button>
                  ) : (
                    <div className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold text-center flex items-center justify-center rounded-lg py-1.5">
                      {item.jiraTicket}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Strategic Roadmap Explanatory Column */}
        <div className="w-80 bg-white p-6 flex flex-col justify-between overflow-y-auto text-xs shrink-0">
          <div>
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-[#EBEBEB]">
              <Compass className="w-4 h-4 text-[#FF385C]" />
              <h4 className="text-xs uppercase tracking-widest text-[#222222] font-bold">CoD Weighted Logic</h4>
            </div>

            <div className="space-y-4 text-[#484848] leading-relaxed font-sans">
              <p>
                Productly OS weights priority scores using a direct delay index factor rather than subjective human or sales opinions.
              </p>
              
              <div className="bg-[#FFF0F2] border border-[#FFD0D6] p-4 rounded-xl space-y-2 text-[#484848] shadow-sm">
                <div className="font-bold text-[#FF385C] text-xs">Weighted Priority Algebra:</div>
                <div className="text-xs bg-white p-2 rounded-lg text-[#FF385C] font-semibold text-center border border-[#FFD0D6]">
                  (Cost of Delay + Churn Risk) / Size
                </div>
                <ul className="list-disc pl-4 space-y-1.5 mt-2.5 text-[11px] text-[#484848]">
                  <li><span className="font-bold text-[#222222]">Cost of Delay</span>: Strategic business penalty</li>
                  <li><span className="font-bold text-[#222222]">Churn Risk</span>: Immediate customer renewal hazard</li>
                  <li><span className="font-bold text-[#222222]">Value</span>: Multi-tenant request count</li>
                  <li><span className="font-bold text-[#222222]">Size</span>: Level-of-effort sizing</li>
                </ul>
              </div>

              <p>
                Entering high-churn keywords like <strong>"SSO"</strong> or <strong>"Okta token link"</strong> auto-escalates critical items to help product teams move fast.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-[#EBEBEB] rounded-xl mt-6 relative shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF385C] block mb-1">HNSW Vector Feedback</span>
            <p className="text-[#484848] leading-normal text-xs font-sans">
              Active matching shows high priority links among multiple cloud organizations.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL LIGHTBOX: Create Roadmap Proposal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-[#EBEBEB] rounded-2xl w-full max-w-lg p-6 shadow-xl text-xs">
            <h3 className="text-base font-bold text-[#222222] mb-4 pb-3 border-b border-[#EBEBEB]">Propose New Topic</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold text-xs mb-1">Proposal Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Export workspace analytics directly to HubSpot DB" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] outline-none focus:border-[#FF385C]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-xs mb-1">Description & Goal</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="What customer challenge does this resolve?" 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] outline-none focus:border-[#FF385C] font-sans"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold text-[10px] mb-1 uppercase">Value Impact</label>
                  <select 
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] outline-none focus:border-[#FF385C]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold text-[10px] mb-1 uppercase">Effort / Size</label>
                  <select 
                    value={newEffort}
                    onChange={(e) => setNewEffort(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] outline-none focus:border-[#FF385C]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold text-[10px] mb-1 uppercase">Sector Area</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EBEBEB] p-2.5 rounded-xl text-[#222222] outline-none focus:border-[#FF385C]"
                  >
                    <option value="Core Platform">Core Platform</option>
                    <option value="AI PM Co-Pilot">AI PM Co-Pilot</option>
                    <option value="Integrations > Sync">Integrations</option>
                    <option value="Enterprise Security">Security Area</option>
                  </select>
                </div>
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
                  disabled={isSubmitting}
                  className="bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm"
                >
                  Propose Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
