"use client";

import { useDemo, User } from "@/contexts/DemoContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

export default function Dashboard() {
  const { users, properties, photos, userRole } = useDemo();
  const router = useRouter();

  if (userRole !== "manager") {
    return (
      <div className="min-h-screen bg-[#111827] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You do not have permission to view the manager dashboard.</p>
        <button onClick={() => router.push("/")} className="text-blue-500 hover:text-blue-400 font-medium">
          Return Home
        </button>
      </div>
    );
  }

  // Pre-calculate some dashboard metrics based on context data
  const totalProperties = properties.length;
  const totalPhotos = photos.length;
  // Let's count active alerts later once we add them, for now 0
  const activeAlerts = photos.filter(p => p.hasAlert).length;

  // Group contractors by trade
  const contractors = users.filter(u => u.role === "technician" || u.role === "lead");

  const allTrades = ["plumbing", "electric", "tile", "cabinets", "paint", "windows", "doors", "floors", "misc"];

  return (
    <div className="min-h-screen bg-[#111827] text-[#f9fafb] font-sans pb-10 text-sm">
      <header className="bg-[#374151] p-3 border-b border-[#4b5563] shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-[#3b82f6]">Property Admin Dashboard <span className="text-[9px] md:text-[10px] text-[#10b981] border border-[#10b981] px-1 py-0.5 rounded align-middle ml-2">v2.0 LIVE</span></h1>
            <p className="text-xs text-[#d1d5db] mt-0.5">Authenticated Session: Property Manager</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="bg-[#4b5563] hover:bg-[#111827] text-white border border-[#4b5563] px-2 py-1 rounded text-xs transition"
          >
            &larr; Back to App
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-3 md:p-4 mt-2">

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#374151] p-3 rounded border-l-2 border-[#2563eb] shadow-sm">
            <div className="text-[#d1d5db] text-[10px] uppercase font-bold mb-0.5">Total Properties managed</div>
            <div className="text-xl font-bold">{totalProperties}</div>
          </div>
          <div className="bg-[#374151] p-3 rounded border-l-2 border-[#10b981] shadow-sm">
            <div className="text-[#d1d5db] text-[10px] uppercase font-bold mb-0.5">Active Contractors</div>
            <div className="text-xl font-bold">{contractors.length}</div>
          </div>
          <div className="bg-[#374151] p-3 rounded border-l-2 border-[#D4AF37] shadow-sm">
            <div className="text-[#d1d5db] text-[10px] uppercase font-bold mb-0.5">Tasks Documented</div>
            <div className="text-xl font-bold">{totalPhotos}</div>
          </div>
          <div className="bg-[#374151] p-3 rounded border-l-2 border-[#ef4444] shadow-sm">
            <div className="text-[#d1d5db] text-[10px] uppercase font-bold mb-0.5">Active Field Alerts</div>
            <div className="text-xl font-bold text-[#ef4444]">{activeAlerts}</div>
          </div>
        </div>

        {/* Dashboard Main Grid - Grid layout for categories */}
        <div className="bg-[#374151] p-3 md:p-4 rounded shadow-sm border-l-2 border-[#D4AF37]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold">Contractor Directory & Alert Status</h2>
            <div className="text-xs text-[#9ca3af]">Total: {contractors.length} Active</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {allTrades.map(trade => {
              // Find contractors who selected this trade (or have no trades selected yet for backward compatibility)
              const tradeContractors = contractors.filter(c => c.trades?.includes(trade) || (!c.trades?.length && trade === "plumbing"));
               return (
                <div key={trade} className="overflow-hidden border border-[#4b5563] rounded h-fit flex flex-col bg-[#1f2937]">
                  <div className="bg-[#4b5563] p-1.5 border-b border-[#374151]">
                    <h3 className="font-bold text-[10px] uppercase tracking-wider">{trade}</h3>
                  </div>
                  <div className="flex-1">
                    <ul className="flex flex-col text-xs">
                      {tradeContractors.length === 0 ? (
                        <li className="p-2 text-center text-[#9ca3af] italic bg-[#374151]/50 text-[10px]">
                          No contractors
                        </li>
                      ) : tradeContractors.map(c => {
                        // Check if this contractor has any active alerts anywhere in the system
                        const activeAlertPhoto = photos.find(p => p.hasAlert && p.contractorId === c.id);
                        const hasActiveAlert = !!activeAlertPhoto;

                        return (
                          <li key={c.id} className={`flex items-center justify-between p-2 border-b border-[#4b5563] last:border-0 transition ${hasActiveAlert ? "bg-red-900/20" : "hover:bg-[#4b5563]/30"}`}>
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="font-medium truncate text-[11px]">{c.name}</span>
                              <span className="text-[9px] text-[#9ca3af] truncate">{c.company}</span>
                            </div>
                            <div className="shrink-0">
                              {hasActiveAlert ? (
                                <Link
                                  href={`/properties/${activeAlertPhoto.propertyId}/trades/${activeAlertPhoto.trade}`}
                                  className="inline-flex items-center justify-center gap-1 px-1.5 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[9px] font-bold border border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.7)] transition-all animate-pulse"
                                  title="View Alert"
                                >
                                  <FaExclamationTriangle size={8} /> ALERT
                                </Link>
                              ) : (
                                <span className="inline-block px-1.5 py-0.5 bg-[#10b981]/20 text-[#10b981] rounded text-[9px] font-bold border border-[#10b981]/50">
                                  CLEAR
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
          {contractors.length === 0 && (
            <div className="text-center py-8 text-[#9ca3af]">
              No contractors have signed up yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
