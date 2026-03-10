"use client";

import { useState } from "react";
import { useDemo, TradeType } from "@/contexts/DemoContext";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaCamera,
  FaCheckCircle,
  FaRegCircle,
  FaTrash,
  FaPlus,
  FaEllipsisV,
  FaFileInvoice
} from "react-icons/fa";

export default function TradeDetailView() {
  const { id, tradeId } = useParams() as { id: string; tradeId: TradeType };
  const {
    properties,
    photos,
    addPhoto,
    updatePhotoStatus,
    addNote,
    toggleNote,
    deleteNote,
    userRole
  } = useDemo();

  const router = useRouter();

  // Filter Data
  const property = properties.find((p) => p.id === id);
  const tradePhotos = photos.filter(
    (p) => p.propertyId === id && p.trade === tradeId
  );

  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [showAddPhoto, setShowAddPhoto] = useState(false);

  // Track new note text per photo card
  const [newNotes, setNewNotes] = useState<{ [key: string]: string }>({});

  if (!property) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">Property Not Found</h1>
        <button onClick={() => router.push("/")} className="text-blue-500 hover:text-blue-400 font-medium">
          &larr; Return Home
        </button>
      </div>
    );
  }

  // Handlers
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhotoUrl.trim()) {
      addPhoto(id, tradeId, newPhotoUrl);
      setNewPhotoUrl("");
      setShowAddPhoto(false);
    }
  };

  const handleAddNote = (e: React.FormEvent, photoId: string) => {
    e.preventDefault();
    const noteText = newNotes[photoId];
    if (noteText && noteText.trim()) {
      addNote(photoId, noteText);
      setNewNotes({ ...newNotes, [photoId]: "" }); // clear the input for this specific photo
    }
  };

  const updateNewNoteText = (photoId: string, text: string) => {
    setNewNotes({ ...newNotes, [photoId]: text });
  };

  return (
    <div className="min-h-screen bg-[#0b101e] text-gray-200 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#0b101e] border-b border-gray-800 p-6 shrink-0 z-10 sticky top-0 shadow-lg">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <button
            onClick={() => router.push(`/properties/${id}`)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4 font-bold tracking-wider uppercase bg-transparent border border-gray-700 hover:border-gray-500 px-4 py-2 rounded shadow-sm hover:shadow-md w-fit"
          >
            <FaArrowLeft size={12} /> Back
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mt-2">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase mb-1 drop-shadow-md">{tradeId} TRADE</h1>
              <p className="text-lg text-gray-300 font-medium tracking-wide">
                {property.name}
              </p>
              {property.address && (
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider">
                  {property.address}
                </p>
              )}
            </div>

            {userRole !== "manager" && (
              <button
                onClick={() => setShowAddPhoto(!showAddPhoto)}
                className="flex items-center gap-2 bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-5 py-2.5 rounded text-sm font-bold tracking-wider uppercase transition-all shadow-[0_4px_14px_rgba(37,99,235,0.4)] border border-blue-400/50 hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
              >
                <FaCamera size={14} /> Add Trade Photo
              </button>
            )}
          </div>
        </div>
      </header>

      {showAddPhoto && (
        <div className="bg-[#151b2b] p-6 border-b border-gray-800 shrink-0 shadow-inner">
          <form onSubmit={handleAddPhoto} className="flex flex-col sm:flex-row gap-3 max-w-4xl mx-auto">
            <input
              type="url"
              placeholder="Paste image URL here..."
              className="flex-1 bg-[#0b101e] border border-gray-600 text-white p-3 text-sm rounded shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAddPhoto(false)} className="px-5 py-2 text-sm font-bold tracking-wider uppercase text-gray-400 hover:text-white transition bg-gray-800 hover:bg-gray-700 rounded border border-gray-600">
                Cancel
              </button>
              <button type="submit" className="bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-2 rounded text-sm font-bold tracking-wider uppercase text-white transition shadow-[0_4px_10px_rgba(37,99,235,0.3)] border border-blue-400/50 hover:from-blue-400 hover:to-blue-500">
                Upload
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content: List of Horizontal White Cards */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 pb-20">

        {tradePhotos.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-700 rounded-xl bg-[#151b2b] shadow-inner">
            <FaCamera className="mx-auto text-gray-500 mb-4" size={40} />
            <h2 className="text-lg font-bold tracking-wider uppercase text-gray-400 mb-2">No Field Documentation Yet</h2>
            <p className="text-gray-500 text-sm">Upload photos to start creating task checklists.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {tradePhotos.map((photo) => {
              const completedNotes = photo.notes.filter(n => n.completed).length;
              const totalNotes = photo.notes.length;

              // Determine glowing styles based on status
              let statusWrapperStyle = "";
              let statusSelectStyle = "";

              if (photo.status === 'Work Completed') {
                statusWrapperStyle = "p-[3px] rounded bg-gradient-to-b from-green-400 to-green-600 shadow-[0_0_15px_rgba(34,197,94,0.6)]";
                statusSelectStyle = "bg-gradient-to-b from-green-500 to-green-700 text-white font-bold tracking-wider uppercase shadow-[inset_0_2px_5px_rgba(255,255,255,0.3)]";
              } else if (photo.status === 'Work Started') {
                statusWrapperStyle = "p-[3px] rounded bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-[0_0_15px_rgba(234,179,8,0.6)]";
                statusSelectStyle = "bg-gradient-to-b from-yellow-500 to-yellow-700 text-white font-bold tracking-wider uppercase shadow-[inset_0_2px_5px_rgba(255,255,255,0.4)]";
              } else {
                // Work to be Done
                statusWrapperStyle = "p-[3px] rounded bg-gradient-to-b from-red-400 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.6)]";
                statusSelectStyle = "bg-gradient-to-b from-red-500 to-red-700 text-white font-bold tracking-wider uppercase shadow-[inset_0_2px_5px_rgba(255,255,255,0.3)]";
              }

              return (
                <div key={photo.id} className="bg-gradient-to-b from-gray-200 to-gray-400 p-[3px] rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.8)] transition-all duration-300">
                  <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg overflow-hidden flex flex-col lg:flex-row items-stretch lg:items-center p-4 h-full relative border border-white/60 shadow-[inset_0_2px_10px_rgba(255,255,255,1),inset_0_-2px_10px_rgba(0,0,0,0.05)]">

                    {/* Far Left: Small Picture Thumbnail */}
                    <div className="h-48 lg:h-32 w-full lg:w-48 rounded-md overflow-hidden bg-gray-200 shrink-0 mb-4 lg:mb-0 border border-gray-300 shadow-inner relative">
                      <img
                        src={photo.url}
                        alt={`Task Photo`}
                        className="w-full h-full object-cover"
                      />
                      {/* Inner shadow overlay for 3D picture frame effect */}
                      <div className="absolute inset-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] pointer-events-none"></div>
                    </div>

                    {/* Center: Notes & Checkmarks */}
                    <div className="lg:ml-6 flex-1 flex flex-col gap-3 min-w-0 py-2">
                      {/* Add Note Form */}
                      <form onSubmit={(e) => handleAddNote(e, photo.id)} className="flex gap-2 w-full max-w-md">
                        <input
                          type="text"
                          placeholder="Add new task..."
                          className="flex-1 bg-white border border-gray-300 text-gray-900 text-sm p-2 rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                          value={newNotes[photo.id] || ""}
                          onChange={(e) => updateNewNoteText(photo.id, e.target.value)}
                        />
                        <button
                          type="submit"
                          className="bg-gradient-to-b from-blue-100 to-blue-200 text-blue-700 border border-blue-300 px-3 rounded shadow-sm hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all disabled:opacity-50 disabled:grayscale"
                          disabled={!(newNotes[photo.id] || "").trim()}
                        >
                          <FaPlus size={12} />
                        </button>
                      </form>

                      {/* Checklist */}
                      {photo.notes.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {photo.notes.map((note) => (
                            <div key={note.id} className="flex items-start gap-3 group/note p-1.5 hover:bg-gray-100 rounded transition-colors">
                              <button
                                onClick={() => toggleNote(photo.id, note.id)}
                                className={`mt-0.5 flex-shrink-0 transition-colors drop-shadow-sm ${
                                  note.completed ? "text-green-500" : "text-gray-400 hover:text-blue-500"
                                }`}
                              >
                                {note.completed ? <FaCheckCircle size={16} /> : <FaRegCircle size={16} />}
                              </button>
                              <span className={`text-sm font-medium ${note.completed ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                {note.text}
                              </span>
                              <button
                                onClick={() => deleteNote(photo.id, note.id)}
                                className="text-gray-300 hover:text-red-500 p-0.5 ml-auto opacity-0 group-hover/note:opacity-100 transition-opacity"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Far Right: Work Status Dropdown & Tasks Counter */}
                    <div className="lg:ml-6 mt-4 lg:mt-0 shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
                      <div className="text-xs font-bold tracking-wider uppercase text-gray-600 flex items-center gap-1.5 bg-gray-200 border border-gray-300 px-3 py-1.5 rounded shadow-sm">
                        <FaFileInvoice className="text-gray-500" /> Tasks: {completedNotes}/{totalNotes}
                      </div>

                      {/* 3D Glowing Status Dropdown Wrapper */}
                      <div className={statusWrapperStyle}>
                        <select
                          className={`text-xs w-full sm:w-auto px-4 py-2.5 rounded appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors border-none ${statusSelectStyle}`}
                          value={photo.status}
                          onChange={(e) => updatePhotoStatus(photo.id, e.target.value as "Work to be Done" | "Work Started" | "Work Completed")}
                        >
                          <option value="Work to be Done" className="bg-gray-800 text-white">WORK TO BE DONE</option>
                          <option value="Work Started" className="bg-gray-800 text-white">WORK STARTED</option>
                          <option value="Work Completed" className="bg-gray-800 text-white">WORK COMPLETED</option>
                        </select>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
