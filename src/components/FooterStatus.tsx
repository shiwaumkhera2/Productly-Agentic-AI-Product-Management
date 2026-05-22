import React from "react";

export default function FooterStatus() {
  return (
    <footer className="h-8 border-t border-[#EBEBEB] bg-white flex items-center justify-between px-6 text-[11px] font-sans text-[#717171] select-none shrink-0">
      <div className="flex gap-4 items-center">
        <span className="flex items-center gap-1.5 font-medium text-[#FF385C]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF385C]"></span>
          </span>
          System Sync Engaged
        </span>
        <span className="h-3 w-[1px] bg-gray-200"></span>
        <span className="font-normal text-xs text-gray-500">Fast Cloud Delivery</span>
      </div>
      <div className="flex gap-4 items-center">
        <span className="text-[#FF385C] bg-[#FFF0F2] px-2.5 py-0.5 rounded border border-[#FFD0D6] font-bold text-[9px] uppercase">
          SANDBOX SECURE
        </span>
        <span className="text-[#222222] font-semibold bg-[#F7F7F7] px-2.5 py-0.5 rounded border border-[#EBEBEB] text-[9px]">
          V1.0.0-PRO
        </span>
      </div>
    </footer>
  );
}
