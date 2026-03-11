"use client";

import { useDemo, User } from "@/contexts/DemoContext";
import { useRouter } from "next/navigation";
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

  const allTrades = ["plumbing", "electrical", "hvac", "roofing", "drywall", "painting", "flooring", "landscaping"];

  return (
    <div className="min-h-screen bg-[#111827] text-[#f9fafb] font-sans pb-20">
      <header className="bg-[#374151] p-4 border-b border-[#4b5563] shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#3b82f6]">Property Admin Dashboard <span className="text-[10px] md:text-xs text-[#10b981] border border-[#10b981] px-1.5 py-0.5 rounded align-middle ml-2">v2.0 LIVE</span></h1>
            <p className="text-sm text-[#d1d5db] mt-1">Authenticated Session: Property Manager</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="bg-[#4b5563] hover:bg-[#111827] text-white border border-[#4b5563] px-3 py-1.5 rounded text-sm transition"
          >
            &larr; Back to App
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6 mt-4">

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#374151] p-4 rounded-lg border-l-4 border-[#2563eb] shadow">
            <div className="text-[#d1d5db] text-xs uppercase font-bold mb-1">Total Properties managed</div>
            <div className="text-3xl font-bold">{totalProperties}</div>
          </div>
          <div className="bg-[#374151] p-4 rounded-lg border-l-4 border-[#10b981] shadow">
            <div className="text-[#d1d5db] text-xs uppercase font-bold mb-1">Active Contractors</div>
            <div className="text-3xl font-bold">{contractors.length}</div>
          </div>
          <div className="bg-[#374151] p-4 rounded-lg border-l-4 border-[#D4AF37] shadow">
            <div className="text-[#d1d5db] text-xs uppercase font-bold mb-1">Tasks Documented</div>
            <div className="text-3xl font-bold">{totalPhotos}</div>
          </div>
          <div className="bg-[#374151] p-4 rounded-lg border-l-4 border-[#ef4444] shadow">
            <div className="text-[#d1d5db] text-xs uppercase font-bold mb-1">Active Field Alerts</div>
            <div className="text-3xl font-bold text-[#ef4444]">{activeAlerts}</div>
          </div>
        </div>

        {/* Dashboard Main Grid - For now just full width tables */}
        <div className="bg-[#374151] p-4 md:p-6 rounded-lg shadow-md border-l-4 border-[#D4AF37]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Contractor Directory & Alert Status</h2>
            <div className="text-sm text-[#9ca3af]">Total: {contractors.length} Active</div>
          </div>

          <div className="space-y-8">
            {allTrades.map(trade => {
              // Find contractors who selected this trade (or have no trades selected yet for backward compatibility)
              const tradeContractors = contractors.filter(c => c.trades?.includes(trade) || (!c.trades && trade === "plumbing")); // default legacy users to plumbing

              if (tradeContractors.length === 0) return null;

              return (
                <div key={trade} className="overflow-hidden border border-[#4b5563] rounded-lg">
                  <div className="bg-[#4b5563] p-3 border-b border-[#374151]">
                    <h3 className="font-bold text-lg uppercase tracking-wider">{trade}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#111827]">
                          <th className="p-3 text-xs uppercase text-[#9ca3af] font-semibold">Contractor Name</th>
                          <th className="p-3 text-xs uppercase text-[#9ca3af] font-semibold">Company</th>
                          <th className="p-3 text-xs uppercase text-[#9ca3af] font-semibold">Email</th>
                          <th className="p-3 text-xs uppercase text-[#9ca3af] font-semibold text-center">Alert Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tradeContractors.map(c => {
                          // Check if this contractor has any active alerts anywhere in the system
                          const hasActiveAlert = photos.some(p => p.hasAlert && p.contractorId === c.id);

                          return (
                            <tr key={c.id} className={`border-b border-[#4b5563] last:border-0 transition ${hasActiveAlert ? "bg-red-900/20" : "hover:bg-[#4b5563]/30"}`}>
                              <td className="p-3 font-medium">{c.name}</td>
                              <td className="p-3 text-[#d1d5db]">{c.company}</td>
                              <td className="p-3 text-sm text-[#9ca3af]">{c.email}</td>
                              <td className="p-3 text-center">
                                {hasActiveAlert ? (
                                  <span className="inline-flex items-center justify-center gap-1 px-2 py-1 bg-red-600 text-white rounded text-xs font-bold border border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.7)] animate-pulse">
                                    <FaExclamationTriangle size={10} />
                                    ALERT ACTIVE
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-1 bg-[#10b981]/20 text-[#10b981] rounded text-xs font-bold border border-[#10b981]/50">
                                    CLEAR
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {contractors.length === 0 && (
               <div className="text-center py-8 text-[#9ca3af]">
                 No contractors have signed up yet.
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
