import React from "react";
import { Sparkles } from "lucide-react";

interface UserSession {
  name: string;
  email: string;
  company: string;
  role: string;
  billingTier: string;
}

interface HeaderProps {
  activeTab: string;
  user: UserSession | null;
}

export default function Header({ activeTab, user }: HeaderProps) {
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "dashboard": return "Feeds Inbox";
      case "roadmap": return "Product Roadmap";
      case "prds": return "Spec Writer (PRD)";
      case "agents": return "Agent Reasoning Workspace";
      case "memory": return "Product Memory Bank";
      case "strategy": return "Pitch Strategy";
      case "integrations": return "Connectors";
      default: return "Productly Portal";
    }
  };

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
    <header className="h-16 border-b border-[#EBEBEB] flex items-center justify-between px-6 bg-white shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-base text-[#222222]">Productly OS</span>
        </div>
        <div className="h-4 w-[1px] bg-gray-200"></div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FF385C] bg-[#FFF0F2] px-3 py-1 rounded-full border border-[#FFD0D6]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF385C]"></span>
          <span>{getTabLabel(activeTab)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-[#717171] hidden sm:flex">
          <Sparkles className="w-4 h-4 text-[#FF385C]" />
          <span>Autonomous Copilot Active</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-[11px] font-bold text-[#222222] leading-none">{user?.name || "Strategist"}</p>
            <p className="text-[9px] text-[#FF385C] font-mono font-bold leading-none mt-1 uppercase">{user?.role || "Co-Pilot"}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-[#FF385C] border border-[#FFD0D6] shadow-sm flex items-center justify-center text-white font-bold text-xs">
            {getInitials(user?.name || "YC")}
          </div>
        </div>
      </div>
    </header>
  );
}
