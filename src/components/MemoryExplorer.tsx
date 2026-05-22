import React, { useState } from "react";
import { MemoryChunk } from "../types";
import { 
  BrainCircuit, 
  Search, 
  Database,
  Plus, 
  CheckCircle,
  HelpCircle,
  Sparkles
} from "lucide-react";

interface MemoryExplorerProps {
  kb: MemoryChunk[];
  isLoading: boolean;
}

export default function MemoryExplorer({ kb, isLoading }: MemoryExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  const filteredKb = kb.filter((chunk) => {
    const matchesSearch = chunk.snippet.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          chunk.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTag === "all" || chunk.tag.toLowerCase().includes(activeTag.toLowerCase());
    return matchesSearch && matchesTag;
  });

  return (
    <div id="memory_panel_root" className="flex-1 flex flex-col bg-[#FAFAFA] text-[#222222] overflow-hidden font-sans">
      
      {/* HUD Header */}
      <div className="p-6 border-b border-[#EBEBEB] bg-white shrink-0">
        <span className="text-[10px] text-[#FF385C] font-mono tracking-wider uppercase font-bold block mb-1">Company Knowledge Base</span>
        <h2 className="text-xl font-bold text-[#222222] tracking-tight leading-none">Product Memory Bank</h2>
        <p className="text-xs text-[#717171] mt-1.5">Semantically query customer chats, user stories, and feature drafts indexed in the system.</p>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Workspace Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#FAFAFA]">
          
          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Query stored product snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#EBEBEB] pl-10 pr-4 py-3 rounded-xl text-xs text-[#222222] focus:border-[#FF385C] outline-none shadow-sm font-medium"
              />
            </div>
            
            <div className="flex gap-1.5 shrink-0 overflow-x-auto pb-1">
              {["all", "Feedback", "Jira", "Market", "Specs"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === "all" ? "all" : tag)}
                  className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    (tag === "all" && activeTag === "all") || (tag !== "all" && activeTag.toLowerCase().includes(tag.toLowerCase()))
                      ? "bg-[#FF385C] text-white border-transparent shadow-sm"
                      : "bg-white text-gray-600 border-[#EBEBEB] hover:border-gray-400"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Table list */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center text-xs text-gray-500 py-8">Simulating memory database indexing query...</div>
            ) : filteredKb.length === 0 ? (
              <div className="text-center text-xs text-gray-500 py-8">No matching concepts found inside the organization memory index.</div>
            ) : (
              filteredKb.map((chunk) => (
                <div 
                  key={chunk.id} 
                  className="p-5 bg-white border border-[#EBEBEB] rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-gray-300 transition shadow-sm"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center space-x-2 text-[10px]">
                      <span className="bg-[#FFF0F2] text-[#FF385C] border border-[#FFD0D6] uppercase px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        {chunk.tag}
                      </span>
                      <span className="text-gray-400 font-semibold font-mono">RECORD ID: {chunk.id}</span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-sans font-normal">
                      "{chunk.snippet}"
                    </p>

                    <div className="text-[10px] text-gray-500 bg-[#FAFAFA] p-2.5 rounded-xl border border-[#EBEBEB] leading-relaxed truncate max-w-lg">
                      <span className="font-bold text-[#FF385C] mr-1">RAG KEY INDEX:</span> {chunk.embeddingDimension}
                    </div>
                  </div>

                  <div className="w-28 shrink-0 flex flex-col justify-between items-end md:border-l border-gray-100 md:pl-4 text-right min-h-[90px]">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Cos Similarity</span>
                      <span className="text-lg text-[#FF385C] font-bold block tracking-tight">
                        {(chunk.similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 block mt-2">
                      Verified
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Informative explanation text for memory */}
        <div className="w-80 bg-white p-6 flex flex-col justify-between border-l border-[#EBEBEB] shrink-0 text-xs overflow-y-auto">
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-[#222222] font-bold pb-2 border-b border-[#EBEBEB]">Company Knowledge</h4>
            
            <p className="text-gray-600 leading-relaxed font-sans">
              Productly is persistent in consolidating feedback matrices into vector nodes. This allows for prompt queries with high speed.
            </p>

            <div className="p-4 bg-[#FFF0F2] border border-[#FFD0D6] rounded-xl space-y-2.5 text-gray-700 shadow-sm">
              <span className="font-bold text-[#FF385C] text-[10px] block uppercase tracking-wider">Storage Layouts:</span>
              <ul className="list-disc pl-4 space-y-2 text-[11px] leading-relaxed">
                <li><strong>Interview Notes</strong>: Transcription dialogues indexed at runtime.</li>
                <li><strong>Roadmap Weighting</strong>: Formula scales and strategic cost metrics delay markers.</li>
                <li><strong>Core Blueprints</strong>: Structured specifications linked in real-time.</li>
              </ul>
            </div>

            <p className="text-gray-600 leading-relaxed font-sans">
              Any prompt submitted in the Multi-Agent Workspace queries this database semantically, resulting in context alignment with <strong className="text-[#FF385C]">zero hallucinations</strong>.
            </p>
          </div>

          <div className="p-4 bg-gray-50 border border-[#EBEBEB] rounded-xl mt-6">
            <span className="text-[10px] font-bold text-[#FF385C] block uppercase tracking-wider mb-1">PG Extension OK</span>
            <p className="text-gray-500 leading-normal font-sans">
              The internal RAG is actively indexing 1,482 float vectors representing key spec modules.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
