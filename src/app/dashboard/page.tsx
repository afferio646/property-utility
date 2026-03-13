"use client";

import { useState } from "react";
import { useDemo } from "@/contexts/DemoContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaExclamationTriangle, FaTrash } from "react-icons/fa";

export default function Dashboard() {
  const { users, properties, photos, userRole, updateUserAssignedProperties, updateUserRole, deleteUser } = useDemo();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"directory" | "database" | "users">("directory");
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);
  const [expandedTrade, setExpandedTrade] = useState<string | null>(null);

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

  const totalProperties = properties.length;
  const totalPhotos = photos.length;
  const activeAlerts = photos.filter(p => p.hasAlert).length;

  const contractors = users.filter(u => u.role === "contractor" || u.role === "lead");
  const allTrades = ["plumbing", "electric", "tile", "cabinets", "paint", "windows", "doors", "floors", "misc"];

  return (
    <div className="min-h-screen bg-[#111827] text-[#f9fafb] font-sans pb-10 text-xs">
      <header className="bg-[#374151] p-2 border-b border-[#4b5563] shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            <h1 className="text-sm font-bold text-[#3b82f6]">Property Admin Dashboard <span className="text-[8px] text-[#10b981] border border-[#10b981] px-1 py-0.5 rounded align-middle ml-2">v2.0 LIVE</span></h1>
            <p className="text-[10px] text-[#d1d5db] mt-0.5">Authenticated Session: Property Manager</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="bg-[#4b5563] hover:bg-[#111827] text-white border border-[#4b5563] px-2 py-1 rounded text-[10px] font-bold transition flex items-center gap-1.5"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-2 md:p-3 mt-1">

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          <div className="bg-[#374151] p-2 rounded border-l-2 border-[#2563eb] shadow-sm">
            <div className="text-[#d1d5db] text-[9px] uppercase font-bold mb-0.5 truncate">Total Properties managed</div>
            <div className="text-base font-bold">{totalProperties}</div>
          </div>
          <div className="bg-[#374151] p-2 rounded border-l-2 border-[#10b981] shadow-sm">
            <div className="text-[#d1d5db] text-[9px] uppercase font-bold mb-0.5 truncate">Active Contractors</div>
            <div className="text-base font-bold">{contractors.length}</div>
          </div>
          <div className="bg-[#374151] p-2 rounded border-l-2 border-[#D4AF37] shadow-sm">
            <div className="text-[#d1d5db] text-[9px] uppercase font-bold mb-0.5 truncate">Tasks Documented</div>
            <div className="text-base font-bold">{totalPhotos}</div>
          </div>
          <div className="bg-[#374151] p-2 rounded border-l-2 border-[#ef4444] shadow-sm">
            <div className="text-[#d1d5db] text-[9px] uppercase font-bold mb-0.5 truncate">Active Field Alerts</div>
            <div className="text-base font-bold text-[#ef4444]">{activeAlerts}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#4b5563] mb-4 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-3 py-1.5 text-xs font-bold uppercase whitespace-nowrap transition-colors ${
              activeTab === "directory"
                ? "text-[#3b82f6] border-b-2 border-[#3b82f6]"
                : "text-[#9ca3af] hover:text-white"
            }`}
          >
            Property Contractors & Alerts
          </button>
          <button
            onClick={() => setActiveTab("database")}
            className={`px-3 py-1.5 text-xs font-bold uppercase whitespace-nowrap transition-colors ${
              activeTab === "database"
                ? "text-[#10b981] border-b-2 border-[#10b981]"
                : "text-[#9ca3af] hover:text-white"
            }`}
          >
            Contractor Database
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 text-xs font-bold uppercase whitespace-nowrap transition-colors ${
              activeTab === "users"
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-[#9ca3af] hover:text-white"
            }`}
          >
            System Users
          </button>
        </div>

        {/* Tab Content */}

        {/* TAB 1: Directory */}
        {activeTab === "directory" && (
          <div className="bg-[#374151] p-3 md:p-4 rounded shadow-sm border-l-2 border-[#3b82f6] flex flex-col gap-6">

            {/* Active Alerts Tracking Section */}
            {activeAlerts > 0 && (
              <div className="bg-red-900/20 border border-red-800 rounded p-3">
                <h2 className="text-red-500 font-bold mb-3 flex items-center gap-2">
                  <FaExclamationTriangle /> Active Field Alerts
                </h2>
                <div className="flex flex-col gap-2">
                  {photos.filter(p => p.hasAlert).map(alertPhoto => {
                    const contractor = contractors.find(c => c.id === alertPhoto.contractorId);
                    const prop = properties.find(p => p.id === alertPhoto.propertyId);
                    return (
                      <Link
                        key={alertPhoto.id}
                        href={`/properties/${alertPhoto.propertyId}/trades/${alertPhoto.trade}`}
                        className="bg-[#1f2937] border border-red-500/50 p-2 rounded flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:bg-[#374151] transition-colors"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm text-white">{prop?.name} <span className="text-gray-400 font-normal">({alertPhoto.trade})</span></span>
                          <span className="text-xs text-red-400">&quot;{alertPhoto.alertNote}&quot;</span>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1">
                          <span className="text-xs text-gray-300 font-medium">{contractor?.company || "Unknown Contractor"}</span>
                          <span className="inline-block px-2 py-1 bg-red-600/20 text-red-500 rounded text-[10px] font-bold border border-red-500/50 uppercase">
                            View Issue
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Properties Accordion List */}
            <div className="flex flex-col gap-4">
              {properties.map(property => {
                 return (
                    <div key={property.id} className="bg-[#1f2937] border border-[#4b5563] rounded overflow-hidden">
                       <div className="bg-[#4b5563]/50 p-3 border-b border-[#374151]">
                          <h3 className="font-bold text-sm text-white">{property.name}</h3>
                          {property.address && <p className="text-[10px] text-gray-400 mt-0.5">{property.address}</p>}
                       </div>

                       <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                          {allTrades.map(trade => {
                             // Find contractors assigned to this property AND this specific trade
                             const assignedContractors = contractors.filter(c => {
                                const propAssignment = c.assignedProperties?.find(ap => ap.propertyId === property.id);
                                return propAssignment && propAssignment.trades.includes(trade);
                             });

                             const isActive = assignedContractors.length > 0;

                             // Check for alerts specifically for this property and trade
                             const activeAlertPhoto = photos.find(p => p.propertyId === property.id && p.trade === trade && p.hasAlert);
                             const hasAlert = !!activeAlertPhoto;

                             const isExpanded = expandedProperty === property.id && expandedTrade === trade;

                             return (
                                <div key={trade} className="flex flex-col">
                                   <button
                                      onClick={() => {
                                         if (isActive) {
                                            if (isExpanded) {
                                               setExpandedProperty(null);
                                               setExpandedTrade(null);
                                            } else {
                                               setExpandedProperty(property.id);
                                               setExpandedTrade(trade);
                                            }
                                         }
                                      }}
                                      className={`px-2 py-2 rounded text-[10px] font-bold uppercase tracking-wider text-center transition-all border ${
                                         hasAlert ? 'bg-red-600 border-red-500 text-white animate-pulse-slow shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer' :
                                         isActive ? 'bg-[#10b981]/20 border-[#10b981]/50 text-[#10b981] cursor-pointer hover:bg-[#10b981]/30' :
                                         'bg-[#374151]/50 border-[#4b5563] text-gray-500 cursor-not-allowed'
                                      }`}
                                      disabled={!isActive}
                                   >
                                      <div className="flex items-center justify-center gap-1.5">
                                         {hasAlert && <FaExclamationTriangle />}
                                         {trade}
                                      </div>
                                   </button>

                                   {/* Expanded Accordion Area */}
                                   {isExpanded && isActive && (
                                      <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 mt-2 bg-[#111827] border border-[#3b82f6]/50 rounded p-2 order-last shadow-xl relative w-full">
                                         <div className="text-[9px] text-blue-400 font-bold uppercase mb-2 border-b border-blue-900/50 pb-1">{trade} Contractors</div>
                                         <div className="flex flex-col gap-2">
                                            {assignedContractors.map(c => {
                                               const contractorAlert = photos.find(p => p.propertyId === property.id && p.trade === trade && p.hasAlert && p.contractorId === c.id);

                                               return (
                                                  <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 bg-[#1f2937] p-2 rounded border border-[#374151]">
                                                     <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-white">{c.company}</span>
                                                        <span className="text-[10px] text-gray-400">{c.name} • {c.phone}</span>
                                                     </div>
                                                     {contractorAlert && (
                                                        <Link
                                                          href={`/properties/${property.id}/trades/${trade}`}
                                                          className="shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold border border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.7)] transition-all animate-pulse"
                                                        >
                                                          <FaExclamationTriangle size={10} /> ALERT
                                                        </Link>
                                                     )}
                                                  </div>
                                               )
                                            })}
                                         </div>
                                      </div>
                                   )}
                                </div>
                             )
                          })}
                       </div>
                    </div>
                 )
              })}

              {properties.length === 0 && (
                 <div className="text-center py-8 text-[#9ca3af] italic border border-dashed border-[#4b5563] rounded">
                    No properties exist in the system yet.
                 </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Database */}
        {activeTab === "database" && (
          <div className="bg-[#374151] p-3 md:p-4 rounded shadow-sm border-l-2 border-[#10b981]">
            <div className="mb-4">
              <h2 className="text-base font-bold text-white">Contractor Database & Assignments</h2>
              <p className="text-xs text-[#9ca3af] mt-1">Manage which properties each contractor is authorized to work on.</p>
            </div>

            <div className="space-y-4">
              {contractors.map(contractor => (
                <div key={contractor.id} className="bg-[#1f2937] border border-[#4b5563] rounded p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4 pb-4 border-b border-[#4b5563]">
                    <div className="flex flex-col gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{contractor.company}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <span className="text-sm text-[#d1d5db]">{contractor.name}</span>
                          <span className="text-sm text-[#9ca3af]">{contractor.email}</span>
                          <span className="text-sm text-[#9ca3af]">{contractor.phone}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                         {(contractor.trades || []).map(trade => (
                            <span key={trade} className="inline-block bg-[#374151] border border-[#4b5563] text-[#d1d5db] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                              {trade}
                            </span>
                         ))}
                         {(!contractor.trades || contractor.trades.length === 0) && (
                            <span className="text-[10px] text-gray-500 italic">No trades specified</span>
                         )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-block bg-[#3b82f6]/20 text-[#3b82f6] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-[#3b82f6]/30">
                        {contractor.role}
                      </span>
                    </div>
                  </div>

                  {/* Alert & Communications History */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-[#d1d5db] mb-2 uppercase tracking-wider flex items-center gap-2">
                       <FaExclamationTriangle className="text-gray-400" /> Communications / Alerts History
                    </h4>
                    <div className="bg-[#111827] border border-[#374151] rounded p-2 max-h-40 overflow-y-auto pr-2 space-y-2">
                      {(() => {
                        // Find all past and present alerts for this contractor
                        const contractorAlerts = photos.filter(p => p.contractorId === contractor.id && (p.hasAlert || p.alertNote));
                        if (contractorAlerts.length === 0) {
                          return <div className="text-xs text-[#9ca3af] italic p-2 text-center">No alerts or communications recorded.</div>;
                        }
                        return contractorAlerts.map((alertPhoto) => {
                           const prop = properties.find(p => p.id === alertPhoto.propertyId);
                           const isResolved = !alertPhoto.hasAlert;

                           return (
                             <div key={alertPhoto.id} className={`p-2 rounded border text-xs ${isResolved ? 'bg-[#374151]/50 border-[#4b5563]' : 'bg-red-900/20 border-red-800'}`}>
                               <div className="flex justify-between items-start gap-2 mb-1">
                                  <div className="font-bold text-gray-200">
                                    {prop?.name} <span className="text-gray-400 font-normal">({alertPhoto.trade})</span>
                                  </div>
                                  <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${isResolved ? 'bg-gray-600 text-gray-300' : 'bg-red-600 text-white animate-pulse'}`}>
                                    {isResolved ? 'Resolved' : 'Active'}
                                  </div>
                               </div>
                               <div className="text-gray-300 mb-1">
                                 <span className="font-semibold text-red-400">Issue:</span> {alertPhoto.alertNote}
                               </div>
                               {alertPhoto.managerAnswer && (
                                 <div className="text-gray-400 mt-1 pl-2 border-l-2 border-green-500/50">
                                   <span className="font-semibold text-green-500">Manager:</span> {alertPhoto.managerAnswer}
                                 </div>
                               )}
                             </div>
                           )
                        });
                      })()}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#d1d5db] mb-3 uppercase tracking-wider">Assigned Properties & Trades</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {properties.map(property => {
                        const assignedData = contractor.assignedProperties?.find(ap => ap.propertyId === property.id);
                        const isAssigned = !!assignedData;

                        return (
                          <div
                            key={property.id}
                            className={`flex flex-col gap-2 p-3 rounded border transition-colors ${
                              isAssigned
                                ? "bg-[#10b981]/10 border-[#10b981]/50"
                                : "bg-[#374151]/50 border-[#4b5563]"
                            }`}
                          >
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isAssigned}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    const currentAssigned = contractor.assignedProperties || [];
                                    let newAssigned;
                                    if (isChecked) {
                                      // Assign with default selected trades or empty
                                      newAssigned = [...currentAssigned, { propertyId: property.id, trades: contractor.trades || [] }];
                                    } else {
                                      newAssigned = currentAssigned.filter(ap => ap.propertyId !== property.id);
                                    }
                                    updateUserAssignedProperties(contractor.id, newAssigned);
                                  }}
                                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#10b981] focus:ring-[#10b981] focus:ring-offset-gray-800 bg-gray-700"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-medium truncate ${isAssigned ? "text-white" : "text-[#d1d5db]"}`}>
                                    {property.name}
                                  </div>
                                </div>
                            </label>

                            {/* Trade Selector for this Property */}
                            {isAssigned && (
                                <div className="pl-7 mt-2 pt-2 border-t border-gray-600/50 flex flex-col gap-1.5">
                                   <div className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Select Active Trades for this Property</div>
                                   <div className="flex flex-wrap gap-1.5">
                                      {allTrades.map(trade => {
                                         const isTradeAssigned = assignedData.trades.includes(trade);
                                         return (
                                            <label key={trade} className={`flex items-center gap-1 cursor-pointer px-1.5 py-0.5 rounded border ${isTradeAssigned ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-white' : 'bg-gray-800 border-gray-600 text-gray-400'} transition-colors`}>
                                               <input
                                                  type="checkbox"
                                                  className="sr-only"
                                                  checked={isTradeAssigned}
                                                  onChange={(e) => {
                                                     const isChecked = e.target.checked;
                                                     const currentAssigned = contractor.assignedProperties || [];
                                                     const newAssigned = currentAssigned.map(ap => {
                                                        if (ap.propertyId === property.id) {
                                                           return {
                                                              ...ap,
                                                              trades: isChecked
                                                                 ? [...ap.trades, trade]
                                                                 : ap.trades.filter(t => t !== trade)
                                                           };
                                                        }
                                                        return ap;
                                                     });
                                                     updateUserAssignedProperties(contractor.id, newAssigned);
                                                  }}
                                               />
                                               <span className="text-[9px] font-bold uppercase tracking-wider">{trade}</span>
                                            </label>
                                         );
                                      })}
                                   </div>
                                </div>
                            )}
                          </div>
                        );
                      })}
                      {properties.length === 0 && (
                        <p className="text-[10px] text-[#9ca3af] italic p-4">No properties exist in the system yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {contractors.length === 0 && (
                <div className="text-center py-8 text-[#9ca3af] border border-dashed border-[#4b5563] rounded">
                  No contractors in the database.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: System Users */}
        {activeTab === "users" && (
          <div className="bg-[#374151] p-3 md:p-4 rounded shadow-sm border-l-2 border-[#D4AF37]">
            <div className="mb-4">
              <h2 className="text-base font-bold text-white">All System Users</h2>
              <p className="text-xs text-[#9ca3af] mt-1">A complete list of everyone registered in the platform.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1f2937] border-b border-[#4b5563]">
                    <th className="p-3 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Name</th>
                    <th className="p-3 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Company</th>
                    <th className="p-3 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Role</th>
                    <th className="p-3 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-[#4b5563]/50 hover:bg-[#4b5563]/30 transition-colors">
                      <td className="p-3 text-sm font-medium text-white">{user.name}</td>
                      <td className="p-3 text-sm text-[#d1d5db]">{user.company}</td>
                      <td className="p-3 text-sm">
                        <select
                           value={user.role}
                           onChange={(e) => updateUserRole(user.id, e.target.value as "manager" | "lead" | "contractor" | "none")}
                           className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider appearance-none cursor-pointer outline-none transition-colors ${
                             user.role === 'manager' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 focus:border-[#D4AF37]' :
                             user.role === 'lead' ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 focus:border-[#3b82f6]' :
                             'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 focus:border-[#10b981]'
                           }`}
                         >
                           <option value="manager" className="bg-gray-800 text-white">MANAGER</option>
                           <option value="lead" className="bg-gray-800 text-white">LEAD</option>
                           <option value="contractor" className="bg-gray-800 text-white">CONTRACTOR</option>
                        </select>
                      </td>
                      <td className="p-3 text-sm text-[#9ca3af] flex justify-between items-center gap-2">
                        <div>
                          <div>{user.email}</div>
                          <div className="text-xs">{user.phone}</div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-500/10"
                          title="Delete User"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-[#9ca3af] italic">
                        No users registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 border-t border-[#4b5563] pt-4">
               <button
                  onClick={() => window.dispatchEvent(new Event("open-manage-users"))}
                  className="bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold py-2 px-4 rounded text-sm transition-colors"
               >
                  Manage Users & Permissions
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
