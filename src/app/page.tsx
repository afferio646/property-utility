"use client";

import { useState } from "react";
import { useDemo } from "@/contexts/DemoContext";
import Link from "next/link";
import { FaPlus, FaChevronRight } from "react-icons/fa";

export default function Home() {
  const { properties, addProperty, userRole } = useDemo();
  const [newPropName, setNewPropName] = useState("");
  const [newPropAddress, setNewPropAddress] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPropName.trim()) {
      addProperty(newPropName, newPropAddress);
      setNewPropName("");
      setNewPropAddress("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Active Properties</h1>
            <p className="text-sm text-gray-400 mt-2 max-w-2xl">
              Select a property below to view its associated trades, track project progress, and review field photos and checklists.
            </p>
          </div>
          {userRole === "manager" && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <FaPlus size={14} /> Add Property
            </button>
          )}
        </header>

        {/* Add Property Form */}
        {showAddForm && userRole === "manager" && (
          <form onSubmit={handleAddProperty} className="mb-10 bg-[#111111] p-6 rounded-lg border border-gray-800 shadow-2xl max-w-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Register New Property</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g., Summit Renovation"
                  className="w-full bg-black border border-gray-700 text-white p-3 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-sm"
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="e.g., 123 Mountain View Rd"
                  className="w-full bg-black border border-gray-700 text-white p-3 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-sm"
                  value={newPropAddress}
                  onChange={(e) => setNewPropAddress(e.target.value)}
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 transition shadow-lg"
                >
                  Save Property
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Property List (Horizontal Cards) */}
        <div className="flex flex-col gap-4">
          {properties.map((prop, index) => {
            // Pick a consistent pseudo-random house image for the demo
            const houseImage = `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600&h=400`;

            return (
              <Link href={`/properties/${prop.id}`} key={prop.id} className="block group">
                <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition duration-300 shadow-sm flex items-center p-4 border border-gray-100">
                  {/* Property Cover Image (Thumbnail) */}
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                    <img
                      src={index % 2 === 0 ? houseImage : `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600&h=400`}
                      alt={prop.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Property Info */}
                  <div className="ml-4 flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">{prop.name}</h2>
                    {prop.address && (
                      <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                        {prop.address}
                      </p>
                    )}
                  </div>

                  {/* Property Actions */}
                  <div className="ml-4 shrink-0 flex items-center gap-4">
                     <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                       JD
                     </div>
                     <button className="text-sm text-blue-600 font-medium group-hover:text-blue-800 transition-colors px-3 py-1.5 rounded-md hover:bg-blue-50">
                        Edit
                     </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-20 bg-[#111111] rounded-lg border border-dashed border-gray-800 mt-8">
            <p className="text-gray-400 text-sm">No properties registered yet.</p>
            {userRole === "manager" && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 text-blue-500 text-sm font-medium hover:text-blue-400 transition"
              >
                + Add your first property
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
