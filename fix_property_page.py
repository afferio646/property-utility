import sys

filepath = "src/app/properties/[id]/page.tsx"

with open(filepath, "r") as f:
    content = f.read()


# Import useState and add FaPlus
import_search = """import { useDemo, TradeType } from "@/contexts/DemoContext";
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
  FaArrowLeft,"""

import_replace = """import React, { useState } from "react";
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
  FaPlus,"""

content = content.replace(import_search, import_replace)

# Setup component state and combine standard trades with custom trades
state_search = """export default function PropertyTrades() {
  const { id } = useParams() as { id: string };
  const { properties, photos } = useDemo();
  const router = useRouter();

  const property = properties.find((p) => p.id === id);"""

state_replace = """export default function PropertyTrades() {
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
"""

content = content.replace(state_search, state_replace)

# Map dynamic trades
map_search = """        {/* Trades Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-[1000px] justify-items-center sm:justify-items-start">
          {tradeConfig.map((trade) => {"""

map_replace = """        {/* Trades Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-[1000px] justify-items-center sm:justify-items-start">
          {userRole === "manager" && (
            <div className="w-full max-w-[280px]">
              {isAddingTrade ? (
                <div className="p-4 rounded-2xl bg-[#1f2937] border border-[#374151] h-[150px] flex flex-col justify-center">
                  <form onSubmit={handleAddTrade}>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Trade Name..."
                      value={newTradeName}
                      onChange={(e) => setNewTradeName(e.target.value)}
                      className="w-full bg-[#111827] border border-blue-500 rounded p-2 text-white text-sm mb-2 outline-none"
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setIsAddingTrade(false)} className="text-xs text-gray-400 hover:text-white px-2 py-1">Cancel</button>
                      <button type="submit" className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded font-bold">Add</button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingTrade(true)}
                  className="w-full p-[3px] rounded-2xl bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 border border-dashed border-gray-600 hover:border-blue-500 transition-colors group flex flex-col items-center justify-center h-[150px]"
                >
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-800 text-gray-400 group-hover:text-blue-500 mb-2">
                    <FaPlus size={20} />
                  </div>
                  <span className="text-sm font-bold text-gray-400 group-hover:text-blue-500 tracking-wider">ADD TRADE</span>
                </button>
              )}
            </div>
          )}

          {/* Standard Trades + Custom Trades */}
          {[...tradeConfig, ...(property?.customTrades || []).map(ct => ({ type: ct.type as TradeType, label: ct.label, icon: FaTools }))].map((trade) => {"""

content = content.replace(map_search, map_replace)

with open(filepath, "w") as f:
    f.write(content)
