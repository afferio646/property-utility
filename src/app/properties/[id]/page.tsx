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
  const { properties, photos } = useDemo();
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

            const tradePhotos = photos.filter(p => p.propertyId === id && p.trade === trade.type);
            const hasPhotos = tradePhotos.length > 0;
            const allCompleted = hasPhotos && tradePhotos.every(p => p.status === 'Work Completed');

            let isActive = hasPhotos && !allCompleted;
            let isCompleted = allCompleted;

            // Determine styles based on state - 3D styled buttons
            // Base styles for the outer metallic wrapper
            let wrapperStyles = "p-[3px] rounded-2xl bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 shadow-[0_8px_16px_rgba(0,0,0,0.5)] group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-all duration-300";

            // Inner styles for the glossy surface
            let innerStyles = "bg-gradient-to-b from-white to-gray-100 rounded-xl flex flex-col items-center justify-center p-6 h-36 relative overflow-hidden shadow-[inset_0_2px_10px_rgba(255,255,255,0.8),inset_0_-4px_10px_rgba(0,0,0,0.1)] border border-white/60";

            let iconContainerStyles = "text-gray-500 group-hover:text-gray-700 bg-white shadow-sm";
            let textStyles = "text-gray-700";

            if (isCompleted) {
               wrapperStyles = "p-[4px] rounded-2xl bg-gradient-to-b from-green-400 via-green-500 to-green-600 shadow-[0_8px_20px_rgba(34,197,94,0.4)]";
               innerStyles = "bg-gradient-to-b from-green-50 to-green-100 rounded-xl flex flex-col items-center justify-center p-6 h-36 relative overflow-hidden shadow-[inset_0_2px_10px_rgba(255,255,255,0.8),inset_0_-4px_10px_rgba(0,0,0,0.1)] border border-green-200/60";
               iconContainerStyles = "text-green-600 bg-white shadow-sm";
               textStyles = "text-green-800";
            } else if (isActive) {
               // Make wrapper thicker or glow more if needed. The 3D effect means darker gray surface
               wrapperStyles = "p-[4px] rounded-2xl bg-gradient-to-b from-gray-400 via-gray-500 to-gray-700 shadow-[0_8px_24px_rgba(255,255,255,0.1)] scale-[1.02] group-hover:scale-[1.05]";
               innerStyles = "bg-gradient-to-b from-gray-600 to-gray-800 rounded-xl flex flex-col items-center justify-center p-6 h-36 relative overflow-hidden shadow-[inset_0_2px_10px_rgba(255,255,255,0.2),inset_0_-4px_10px_rgba(0,0,0,0.4)] border border-gray-500/50";
               iconContainerStyles = "text-white bg-gray-700 shadow-inner";
               textStyles = "text-white";
            }

            return (
              <Link
                href={`/properties/${id}/trades/${trade.type}`}
                key={trade.type}
                className="block group w-full max-w-[280px]"
              >
                <div className={wrapperStyles}>
                  <div className={innerStyles}>
                    {/* Top shine highlight for 3D effect */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-xl"></div>

                    {/* Trade Icon */}
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-3 transition-colors z-10 relative ${iconContainerStyles}`}>
                      <Icon size={24} />
                    </div>

                    {/* Trade Info */}
                    <h2 className={`text-sm font-bold text-center tracking-wide z-10 relative ${textStyles}`}>{trade.label}</h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
