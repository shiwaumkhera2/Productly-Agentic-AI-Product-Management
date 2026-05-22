import React from "react";
import { 
  Inbox, 
  Map, 
  FileText, 
  Cpu, 
  BrainCircuit, 
  Award, 
  Link2,
  LogOut
} from "lucide-react";

interface UserSession {
  name: string;
  email: string;
  company: string;
  role: string;
  billingTier: string;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserSession | null;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Feeds Inbox", icon: Inbox, badge: "Inflow" },
    { id: "roadmap", label: "Product Roadmap", icon: Map },
    { id: "prds", label: "Spec Writer & PRD", icon: FileText },
    { id: "agents", label: "Agent Workspace", icon: Cpu },
    { id: "memory", label: "Product Memory Bank", icon: BrainCircuit },
    { id: "strategy", label: "Pitch Strategy", icon: Award },
    { id: "integrations", label: "Connectors", icon: Link2 },
  ];

  const getInitials = (fullName: string) => {
    if (!fullName) return "P";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <aside id="side_outer" className="w-64 bg-white border-r border-[#EBEBEB] flex flex-col h-full text-[#484848] select-none shrink-0 font-sans">
      {/* Brand Header */}
      <div id="side_brand" className="p-5 border-b border-[#EBEBEB] flex items-center space-x-3 bg-white">
        <div id="brand_dot" className="w-8 h-8 rounded-lg bg-[#FF385C] flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform hover:scale-105">
          P
        </div>
        <div>
          <h1 id="brand_title" className="text-base font-bold text-[#222222] tracking-tight leading-none">Productly</h1>
          <span id="brand_sub" className="text-[9px] text-[#FF385C] font-mono tracking-wider font-bold block mt-1 uppercase">Simplifying PM Workflow</span>
        </div>
      </div>

      {/* Navigation list */}
      <nav id="side_nav" className="flex-1 p-3 space-y-1.5 overflow-y-auto bg-white">
        <span className="px-3 text-[9px] font-bold text-[#717171] tracking-widest block mb-2 uppercase">Core App</span>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`nav_btn_${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group cursor-pointer ${
                isActive 
                  ? "bg-[#FFF0F2] text-[#FF385C] border border-[#FFD0D6]" 
                  : "hover:bg-[#F7F7F7] hover:text-[#222222] text-[#717171] border border-transparent"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#FF385C]" : "text-[#717171] group-hover:text-[#222222]"}`} />
                <span className="leading-none">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[8px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? "bg-[#FF385C] text-white" : "bg-[#F7F7F7] text-[#717171]"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile / session representation */}
      <div id="side_session" className="p-4 border-t border-[#EBEBEB] bg-white space-y-2">
        <div className="flex items-center space-x-3 p-2.5 bg-[#FFF0F2] rounded-xl border border-[#FFD0D6]">
          <div className="w-8 h-8 rounded-full bg-[#FF385C] flex items-center justify-center text-[10px] font-bold text-white shadow-inner shrink-0">
            {getInitials(user?.name || "YC")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#222222] truncate leading-tight">{user?.name || "Guest User"}</p>
            <p className="text-[10px] text-gray-500 truncate leading-none mt-0.5">{user?.company || "Productly Inc"}</p>
          </div>
        </div>

        <button 
          id="btn_side_logout"
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-1.5 py-2 hover:bg-gray-50 hover:text-[#E61E4D] text-[#FF385C] rounded-xl text-[11px] font-bold border border-transparent hover:border-[#FFD0D6] transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Portal</span>
        </button>
      </div>
    </aside>
  );
}
