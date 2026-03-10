"use client";

import { useState, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import Link from "next/link";
import { FaPlus, FaCamera, FaImage } from "react-icons/fa";

export default function Home() {
  const { properties, addProperty, userRole, setUserRole, photos, updatePropertyName } = useDemo();

  // Modal State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPropName, setNewPropName] = useState("");
  const [newPropAddress, setNewPropAddress] = useState("");
  const [newPropImage, setNewPropImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload this to a server/CDN.
      // Here, we use a local object URL to mock it immediately.
      const url = URL.createObjectURL(file);
      setNewPropImage(url);
    }
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPropName.trim()) {
      addProperty(
        newPropName,
        newPropAddress,
        newPropImage || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600&h=400" // Default fallback image
      );

      // Reset form
      setNewPropName("");
      setNewPropAddress("");
      setNewPropImage(null);
      setShowAddForm(false);
    }
  };

  const startEditing = (e: React.MouseEvent, propId: string, currentName: string) => {
    e.preventDefault();
    if (userRole === "manager") {
      setEditingPropertyId(propId);
      setEditingName(currentName);
    }
  };

  const handleEditSubmit = (e: React.FormEvent | React.FocusEvent, propId: string) => {
    e.preventDefault();
    if (editingName.trim()) {
      updatePropertyName(propId, editingName.trim());
    }
    setEditingPropertyId(null);
  };

  return (
    <div className="min-h-screen bg-[#0b101e] text-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Logo placeholder - styling similar to the Goldmorr 'G' */}
            <div className="w-12 h-12 bg-yellow-500 rounded-md flex items-center justify-center text-[#0b101e] font-bold text-2xl tracking-tighter shrink-0">
              PM
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-widest uppercase mb-1">
                Property Management Utility
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
                Manage your active properties and trades
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">


            {userRole === "manager" && (
              <>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-5 py-2.5 rounded text-sm font-bold tracking-wider uppercase transition-colors"
                >
                  <FaPlus size={12} /> New Property
                </button>
                <button
                  onClick={() => {
                    const event = new Event("open-manage-users");
                    window.dispatchEvent(event);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors"
                >
                  Manage Users
                </button>
              </>
            )}
          </div>
        </header>

        {/* Section Subtitle */}
        <div className="mb-6 border-b border-gray-800 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Properties</h2>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#2563eb] border-2 border-white shadow-sm block"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">No Active Trades</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-gray-700 border-2 border-white shadow-sm block"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Trades</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-600 border-2 border-white shadow-sm block"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trades Completed</span>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-[1000px] justify-items-center sm:justify-items-start">
          {properties.map((prop) => {
            // Determine property status based on its trades (photos)
            const propertyPhotos = photos.filter(p => p.propertyId === prop.id);
            let status = 'default';
            if (propertyPhotos.length > 0) {
              const allCompleted = propertyPhotos.every(p => p.status === 'Work Completed');
              status = allCompleted ? 'completed' : 'active';
            }

            let buttonClasses = "block w-full text-center py-2 rounded text-xs font-bold tracking-wider uppercase transition-colors shadow-sm border border-transparent";
            if (status === 'completed') {
              buttonClasses += " bg-green-600 hover:bg-green-700 text-white border-white";
            } else if (status === 'active') {
              buttonClasses += " bg-gray-700 hover:bg-gray-800 text-white border-white";
            } else {
              buttonClasses += " bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-white";
            }

            return (
            <div key={prop.id} className="bg-white rounded-lg overflow-hidden shadow-md border-2 border-gray-300 hover:shadow-xl hover:border-blue-500 hover:ring-2 hover:ring-blue-500 transition-all duration-300 flex flex-col w-full max-w-[280px]">
              {/* Property Image */}
              <div className="h-36 w-full bg-gray-200 relative border-b-2 border-gray-200">
                {prop.imageUrl ? (
                  <img
                    src={prop.imageUrl}
                    alt={prop.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaImage size={32} />
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-4 flex-1 flex flex-col">
                {editingPropertyId === prop.id ? (
                  <form onSubmit={(e) => handleEditSubmit(e, prop.id)} className="mb-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={(e) => handleEditSubmit(e, prop.id)}
                      autoFocus
                      className="text-sm font-bold text-gray-900 w-full border-b border-blue-500 outline-none bg-transparent"
                    />
                  </form>
                ) : (
                  <h3
                    className={`text-sm font-bold text-gray-900 mb-1 ${userRole === 'manager' ? 'cursor-pointer hover:text-blue-600' : ''}`}
                    title={prop.name}
                    onClick={(e) => startEditing(e, prop.id, prop.name)}
                  >
                    {prop.name}
                  </h3>
                )}
                <p className="text-xs text-gray-600 mb-4 line-clamp-2" title={prop.address}>{prop.address || "No address provided"}</p>

                <div className="mt-auto">
                  <Link
                    href={`/properties/${prop.id}`}
                    className={buttonClasses}
                  >
                    Property Trades
                  </Link>
                </div>
              </div>
            </div>
          )})}
        </div>

        {/* Empty State */}
        {properties.length === 0 && (
          <div className="text-center py-20 bg-[#151b2b] rounded-xl border border-dashed border-gray-800 mt-8">
            <p className="text-gray-400 text-sm tracking-wide">No properties registered yet.</p>
          </div>
        )}

        {/* Add Property Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#151b2b] w-full max-w-md rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">Register New Property</h2>
              </div>

              <div className="p-6 overflow-y-auto">
                <form id="add-property-form" onSubmit={handleAddProperty} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Property Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Wing B, Room 204"
                      className="w-full bg-[#0b101e] border border-gray-700 text-white px-4 py-3 rounded focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition text-sm"
                      value={newPropName}
                      onChange={(e) => setNewPropName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Address / Location</label>
                    <input
                      type="text"
                      placeholder="Optional details..."
                      className="w-full bg-[#0b101e] border border-gray-700 text-white px-4 py-3 rounded focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition text-sm"
                      value={newPropAddress}
                      onChange={(e) => setNewPropAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Property Image</label>

                    {newPropImage ? (
                      <div className="relative w-full h-40 rounded border border-gray-700 overflow-hidden group">
                        <img src={newPropImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700"
                          >
                            Change Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-600 rounded bg-[#0b101e] hover:bg-gray-800 hover:border-gray-500 transition-colors text-gray-400"
                      >
                        <FaCamera size={24} />
                        <span className="text-xs uppercase tracking-wider font-bold">Select Photo</span>
                      </button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-800 bg-[#0f1423] flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewPropName("");
                    setNewPropAddress("");
                    setNewPropImage(null);
                  }}
                  className="px-5 py-2.5 text-sm font-bold tracking-wider uppercase text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-property-form"
                  className="px-6 py-2.5 bg-yellow-500 text-[#0b101e] text-sm font-bold tracking-wider uppercase rounded hover:bg-yellow-400 transition"
                >
                  Save Property
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
