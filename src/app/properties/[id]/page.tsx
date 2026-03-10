"use client";

import React, { useState } from "react";
import { useDemo, TradeType } from "@/contexts/DemoContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FaWrench,
  FaBolt,
  FaBorderAll,
  FaColumns,
  FaPaintRoller,
  FaBorderNone,
  FaDoorOpen,
  FaLayerGroup,
  FaTools,
  FaArrowLeft,
  FaPlus
} from "react-icons/fa";

interface TradeIconProps {
  type: TradeType;
  label: string;
  icon: React.ElementType;
}

const tradeConfig: Omit<TradeIconProps, "propertyId">[] = [
  { type: "plumbing", label: "Plumbing", icon: FaWrench },
  { type: "electric", label: "Electric", icon: FaBolt },
  { type: "tile", label: "Tile", icon: FaBorderAll },
  { type: "cabinets", label: "Cabinets", icon: FaColumns },
  { type: "paint", label: "Paint", icon: FaPaintRoller },
  { type: "windows", label: "Windows", icon: FaBorderNone },
  { type: "doors", label: "Doors", icon: FaDoorOpen },
  { type: "floors", label: "Floors", icon: FaLayerGroup },
  { type: "misc", label: "Misc", icon: FaTools },
];

export default function PropertyTrades() {
  const { id } = useParams() as { id: string };
  const { properties, photos, userRole, addCustomTrade } = useDemo();
  const router = useRouter();

  const [isAddingTrade, setIsAddingTrade] = useState(false);
  const [newTradeName, setNewTradeName] = useState("");

  const property = properties.find((p) => p.id === id);

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTradeName.trim()) {
      addCustomTrade(id, newTradeName.trim());
      setNewTradeName("");
      setIsAddingTrade(false);
    }
  };


  if (!property) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">Property Not Found</h1>
        <button onClick={() => router.push("/")} className="text-blue-500 hover:text-blue-400 font-medium">
          &larr; Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b101e] text-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation / Header */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-white transition-colors mb-4 font-bold tracking-widest uppercase"
        >
          <FaArrowLeft size={8} /> Back
        </button>

        <div className="mb-6 pb-6 border-b border-gray-800/50">
          <h1 className="text-lg font-bold text-white tracking-widest uppercase mb-1 leading-tight">{property.name}</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-tight">
            Select a trade to manage work
          </p>
        </div>

        {/* Trades Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
          {userRole === "manager" && (
            <div className="w-full max-w-[180px]">
              {isAddingTrade ? (
                <div className="p-4 rounded-xl bg-[#111827] border border-blue-500/50 h-32 flex flex-col justify-center">
                  <form onSubmit={handleAddTrade}>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Trade Name..."
                      value={newTradeName}
                      onChange={(e) => setNewTradeName(e.target.value)}
                      className="w-full bg-[#1f2937] border border-gray-600 rounded p-1.5 text-white text-[10px] mb-2 outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-1.5">
                      <button type="button" onClick={() => setIsAddingTrade(false)} className="text-[9px] text-gray-400 hover:text-white px-1.5 py-0.5 uppercase tracking-wider font-bold">Cancel</button>
                      <button type="submit" className="text-[9px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">Add</button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingTrade(true)}
                  className="w-full rounded-xl bg-[#121927] border border-dashed border-[#3b82f6]/60 hover:border-[#3b82f6] hover:bg-[#1a2333] transition-colors group flex flex-col items-center justify-center h-24"
                >
                  <div className="text-[#3b82f6] mb-2 group-hover:scale-110 transition-transform">
                    <FaPlus size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-[#3b82f6] tracking-widest uppercase leading-tight">ADD TRADE</span>
                </button>
              )}
            </div>
          )}

          {/* Standard Trades + Custom Trades */}
          {[...tradeConfig, ...(property?.customTrades || []).map(ct => ({ type: ct.type as TradeType, label: ct.label, icon: FaTools }))].map((trade) => {
            const Icon = trade.icon;

            const tradePhotos = photos.filter(p => p.propertyId === id && p.trade === trade.type);
            const hasPhotos = tradePhotos.length > 0;
            const allCompleted = hasPhotos && tradePhotos.every(p => p.status === 'Work Completed');

            const isActive = hasPhotos && !allCompleted;
            const isCompleted = allCompleted;

            let buttonStyles = "w-full rounded-xl flex flex-col items-center justify-center h-24 transition-all duration-200 relative overflow-hidden group-hover:-translate-y-1 group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)] max-w-[180px]";
            let iconStyles = "mb-2 transition-transform group-hover:scale-110 z-10 relative";
            let textStyles = "text-[10px] font-bold tracking-widest uppercase z-10 relative leading-tight";

            if (isCompleted) {
              buttonStyles += " bg-gradient-to-b from-green-400 to-green-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_10px_rgba(34,197,94,0.3)] border border-green-500";
              iconStyles += " text-white drop-shadow-md";
              textStyles += " text-white drop-shadow-md";
            } else if (isActive) {
              buttonStyles += " bg-gradient-to-b from-[#4b5563] to-[#1f2937] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_15px_rgba(0,0,0,0.5)] border-t border-t-[#6b7280] border-b border-b-black border-l border-l-[#4b5563] border-r border-r-[#4b5563]";
              iconStyles += " text-white drop-shadow-md";
              textStyles += " text-white drop-shadow-md";
            } else {
              buttonStyles += " bg-gradient-to-b from-white to-gray-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_6px_rgba(0,0,0,0.1)] border border-gray-200 hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)]";
              iconStyles += " text-[#4b5563]";
              textStyles += " text-[#1f2937]";
            }

            return (
              <Link
                href={`/properties/${id}/trades/${trade.type}`}
                key={trade.type}
                className="block group w-full max-w-[180px]"
              >
                <div className={buttonStyles}>
                  {/* Top gloss reflection for 3D effect */}
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-xl opacity-70"></div>

                  <div className={iconStyles}>
                    <Icon size={18} />
                  </div>
                  <h2 className={textStyles}>{trade.label}</h2>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
