import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AgentPulse from "./components/AgentPulse";
import FooterStatus from "./components/FooterStatus";
import FeedbackInbox from "./components/FeedbackInbox";
import WSJFRoadmap from "./components/WSJFRoadmap";
import PRDEngine from "./components/PRDEngine";
import AgentWorkspace from "./components/AgentWorkspace";
import MemoryExplorer from "./components/MemoryExplorer";
import CapitalStrategy from "./components/CapitalStrategy";
import Connectors from "./components/Connectors";
import AuthScreen from "./components/AuthScreen";
import { FeedbackLog, RoadmapItem, PRDDocument, MemoryChunk } from "./types";

interface UserSession {
  name: string;
  email: string;
  company: string;
  role: string;
  billingTier: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Authentication states
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem("productly_active_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (sessionData: UserSession) => {
    localStorage.setItem("productly_active_user", JSON.stringify(sessionData));
    setUser(sessionData);
  };

  const handleLogout = () => {
    localStorage.removeItem("productly_active_user");
    setUser(null);
  };

  // State Stores
  const [feedback, setFeedback] = useState<FeedbackLog[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [prds, setPrds] = useState<PRDDocument[]>([]);
  const [kb, setKb] = useState<MemoryChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load everything on startup
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [feedbackRes, roadmapRes, prdRes, kbRes] = await Promise.all([
        fetch("/api/feedback"),
        fetch("/api/roadmap"),
        fetch("/api/prds"),
        fetch("/api/kb")
      ]);
      
      const [feedbackData, roadmapData, prdData, kbData] = await Promise.all([
        feedbackRes.json(),
        roadmapRes.json(),
        prdRes.json(),
        kbRes.json()
      ]);

      setFeedback(feedbackData);
      setRoadmap(roadmapData);
      setPrds(prdData);
      setKb(kbData);
    } catch (err) {
      console.error("Error retrieving organizational telemetry data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add customer feedback row
  const handleAddFeedback = async (data: Partial<FeedbackLog>) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        // Reload raw databases
        await fetchInitialData();
      }
    } catch (err) {
      console.error("Failed adding raw transcript payload:", err);
    }
  };

  // Propose Roadmap Item
  const handleAddRoadmapItem = async (data: Partial<RoadmapItem>) => {
    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        await fetchInitialData();
      }
    } catch (err) {
      console.error("Failed proposing strategic roadmap indices:", err);
    }
  };

  // Sync Jira / Boost WSJF priority Score
  const handleUpdateRoadmapItem = async (id: string, status: string, jiraTicket?: string, priorityScore?: number) => {
    try {
      const response = await fetch(`/api/roadmap/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, jiraTicket, priorityScore })
      });
      if (response.ok) {
        await fetchInitialData();
      }
    } catch (err) {
      console.error("Failed executing synchronization update:", err);
    }
  };

  // Create PRD manually
  const handleAddPRD = async (data: Partial<PRDDocument>) => {
    try {
      const response = await fetch("/api/prds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        await fetchInitialData();
        // Shift tab view to highlight the spec
        setActiveTab("prds");
      }
    } catch (err) {
      console.error("Failed drafting specification document:", err);
    }
  };

  // Approve PRD Spec / Update markdown specs
  const handleApprovePRD = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/prds/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        await fetchInitialData();
      }
    } catch (err) {
      console.error("Failed updating spec approval state:", err);
    }
  };

  // Dispatches a chosen transcript / prompt text directly to Multi-Agent Sandbox
  const handleRunAgentWorkflow = async (promptText: string, chosenAgent: string) => {
    try {
      const response = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptText,
          chosenAgent
        })
      });

      const resData = await response.json();
      // Reload states in background to show newly drafted entries
      fetchInitialData();
      return resData;
    } catch (err) {
      console.error("Multi-Agent dispatch error:", err);
      return { success: false, logs: [], output: "Failed compiling flow." };
    }
  };

  // Inbound simulation webhook helper
  const handleSimulateWebhook = async (vendor: string) => {
    if (vendor === "intercom" || vendor === "slack") {
      let title = "";
      let content = "";
      let customer = "";
      let category = "";

      if (vendor === "intercom") {
        title = "Severe issue: SAML Group SSO Auth claims mapping";
        content = "Multiple PM logs report: 'Okta assertion fails on workspace mapping admin tiers, locking out developer roles.' High urgency risk of enterprise subscription churn.";
        customer = "HashiCorp Ops Integration";
        category = "Auth & Access Control";
      } else {
        title = "Slack brain-draft: Custom JIRA epic linked fields sync";
        content = "Slack chat channel: Team suggests building auto-resolving template linkage mapper so EPIC Link constraints matches developer workflow fields directly automatically.";
        customer = "Sentry dev discussion";
        category = "Integrations & Sync";
      }

      await handleAddFeedback({
        source: vendor === "intercom" ? "Intercom" : "Slack Sync",
        customer,
        title,
        content,
        category
      });
    }
  };

  const dispatchToAgentWorkspace = (log: FeedbackLog) => {
    setActiveTab("agents");
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white text-[#222222] font-sans overflow-hidden select-none">
      
      {/* Top Banner / Navigation Bar */}
      <Header activeTab={activeTab} user={user} />

      {/* Main split dashboard view */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar Selector */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

        {/* Active tab routing workspace renderer */}
        <section className="flex-grow flex overflow-hidden bg-[#FAFAFA]">
          
          {activeTab === "dashboard" && (
            <div className="flex-1 flex overflow-hidden bg-white">
              <FeedbackInbox 
                logs={feedback} 
                onAddFeedback={handleAddFeedback} 
                dispatchToAgent={dispatchToAgentWorkspace}
                isLoading={isLoading}
              />
            </div>
          )}

          {activeTab === "roadmap" && (
            <WSJFRoadmap 
              roadmap={roadmap} 
              onAddRoadmapItem={handleAddRoadmapItem} 
              onUpdateStatus={handleUpdateRoadmapItem}
            />
          )}

          {activeTab === "prds" && (
            <PRDEngine 
              prds={prds} 
              onAddPRD={handleAddPRD} 
              onApprovePRD={handleApprovePRD}
              isLoading={isLoading}
            />
          )}

          {activeTab === "agents" && (
            <div className="flex-1 flex overflow-hidden">
              <AgentWorkspace onRunAgent={handleRunAgentWorkflow} />
              <AgentPulse />
            </div>
          )}

          {activeTab === "memory" && (
            <MemoryExplorer kb={kb} isLoading={isLoading} />
          )}

          {activeTab === "strategy" && (
            <CapitalStrategy />
          )}

          {activeTab === "integrations" && (
            <Connectors onSimulateWebhook={handleSimulateWebhook} />
          )}

        </section>

      </main>

      {/* Global Status Footer */}
      <FooterStatus />

    </div>
  );
}
