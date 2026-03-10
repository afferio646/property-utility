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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-[1000px] justify-items-center sm:justify-items-start">
          {tradeConfig.map((trade) => {
            const Icon = trade.icon;

            // Mock active state for specific trades (e.g. plumbing, electric, paint)
            const isActive = trade.type === 'plumbing' || trade.type === 'electric' || trade.type === 'paint';

            // TODO: In the future, we will check if a trade is "completed" and apply a green border/highlight.
            // For now, it defaults to false.
            const isCompleted = false;

            // Determine styles based on state
            let containerStyles = "bg-white border-2 border-gray-300 hover:border-blue-500 hover:ring-2 hover:ring-blue-500 hover:shadow-xl";
            let iconContainerStyles = "bg-blue-50 text-blue-500 group-hover:bg-blue-100 group-hover:text-blue-600";

            if (isCompleted) {
               containerStyles = "bg-green-50 border-4 border-green-500 shadow-md";
               iconContainerStyles = "bg-green-100 text-green-600";
            } else if (isActive) {
               // Thicker blue border, light gray background to make it undeniably active
               containerStyles = "bg-gray-100 border-4 border-blue-600 shadow-[0_4px_20px_rgba(37,99,235,0.4)] scale-105";
               iconContainerStyles = "bg-blue-200 text-blue-700";
            }

            return (
              <Link
                href={`/properties/${id}/trades/${trade.type}`}
                key={trade.type}
                className="block group w-full max-w-[280px]"
              >
                <div className={`rounded-lg flex flex-col items-center justify-center p-6 h-36 transition-all duration-300 w-full ${containerStyles}`}>
                  {/* Trade Icon */}
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-3 transition-colors ${iconContainerStyles}`}>
                    <Icon size={24} />
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
