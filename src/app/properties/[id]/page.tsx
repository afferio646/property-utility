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
    <div className="min-h-screen bg-black text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation / Header */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <FaArrowLeft size={12} /> Back to Dashboard
        </button>

        <div className="mb-10 border-b border-gray-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{property.name}</h1>
            {property.address && (
              <p className="text-sm text-gray-400 mt-3 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                {property.address}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2 max-w-xl">
              Select a trade below to manage associated photos, track checklist progress, and review field notes for this specific project.
            </p>
          </div>
          <div className="flex gap-4">
             {/* Future stats / quick actions could go here */}
             <div className="bg-[#111111] border border-gray-800 rounded-lg px-4 py-3 text-center min-w-[120px]">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <p className="text-sm font-semibold text-green-500 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active
                </p>
             </div>
          </div>
        </div>

        {/* Trades List (Horizontal Cards) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white mb-2">Select Trade Category</h2>
          {tradeConfig.map((trade) => {
            const Icon = trade.icon;
            return (
              <Link
                href={`/properties/${id}/trades/${trade.type}`}
                key={trade.type}
                className="block group"
              >
                <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition duration-300 shadow-sm flex items-center p-4 border border-gray-100">
                  {/* Trade Icon (Thumbnail) */}
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Icon size={32} />
                  </div>

                  {/* Trade Info */}
                  <div className="ml-4 flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">{trade.label}</h2>
                    <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                      Manage photos and checklists
                    </p>
                  </div>

                  {/* Trade Actions */}
                  <div className="ml-4 shrink-0 flex items-center gap-4">
                     <button className="text-sm text-blue-600 font-medium group-hover:text-blue-800 transition-colors px-3 py-1.5 rounded-md hover:bg-blue-50">
                        View
                     </button>
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
