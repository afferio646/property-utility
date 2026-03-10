"use client";

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
  FaMapMarkerAlt
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
  const { properties } = useDemo();
  const router = useRouter();

  const property = properties.find((p) => p.id === id);

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
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation / Header */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6 font-bold tracking-wider uppercase"
        >
          <FaArrowLeft size={12} /> Back
        </button>

        <div className="mb-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-widest uppercase mb-1">{property.name}</h1>
            <p className="text-sm text-gray-400 uppercase tracking-wider">
              Select a trade to manage work
            </p>
          </div>
        </div>

        {/* Trades Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {tradeConfig.map((trade) => {
            const Icon = trade.icon;

            // Mock active state for specific trades (e.g. plumbing, electric, paint)
            const isActive = trade.type === 'plumbing' || trade.type === 'electric' || trade.type === 'paint';

            return (
              <Link
                href={`/properties/${id}/trades/${trade.type}`}
                key={trade.type}
                className="block group"
              >
                <div className={`bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-6 h-40 transition-all duration-300 ${
                  isActive
                    ? "border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105"
                    : "border border-gray-200 hover:border-blue-400 hover:ring-1 hover:ring-blue-400 hover:shadow-xl"
                }`}>
                  {/* Trade Icon */}
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    isActive ? "bg-blue-100 text-blue-600" : "bg-blue-50 text-blue-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                  }`}>
                    <Icon size={28} />
                  </div>

                  {/* Trade Info */}
                  <h2 className="text-sm font-bold text-gray-900 text-center tracking-wide">{trade.label}</h2>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
