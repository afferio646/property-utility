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
    <div className="min-h-screen bg-black text-gray-200 flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 p-6 shrink-0 z-10 sticky top-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/properties/${id}`)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight capitalize">{tradeId} Trade</h1>
              <p className="text-sm text-gray-400 mt-1 max-w-xl">
                Add notes to each picture, check off tasks, and update the current work status for this trade area.
              </p>
            </div>
          </div>

          {userRole !== "manager" && (
            <button
              onClick={() => setShowAddPhoto(!showAddPhoto)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg whitespace-nowrap"
            >
              <FaCamera size={14} /> Add Trade Photo
            </button>
          )}
        </div>
      </header>

      {showAddPhoto && (
        <div className="bg-[#111111] p-6 border-b border-gray-800 shrink-0">
          <form onSubmit={handleAddPhoto} className="flex gap-3 max-w-4xl mx-auto">
            <input
              type="url"
              placeholder="Paste image URL here..."
              className="flex-1 bg-black border border-gray-700 text-white p-3 text-sm rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowAddPhoto(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 px-6 py-2 rounded-md text-sm text-white font-medium hover:bg-blue-500 transition shadow-lg">
              Upload Note/Photo
            </button>
          </form>
        </div>
      )}

      {/* Main Content: List of Horizontal White Cards */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 pb-20">

        {tradePhotos.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl bg-[#111111]">
            <FaCamera className="mx-auto text-gray-600 mb-4" size={32} />
            <h2 className="text-lg font-medium text-gray-300 mb-2">No Field Documentation Yet</h2>
            <p className="text-gray-500 text-sm">Upload photos to start creating task checklists.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tradePhotos.map((photo) => {
              const completedNotes = photo.notes.filter(n => n.completed).length;
              const totalNotes = photo.notes.length;

              return (
                <div key={photo.id} className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition duration-300 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center p-4 border border-gray-200">

                  {/* Far Left: Small Picture Thumbnail */}
                  <div className="h-48 lg:h-24 w-full lg:w-32 rounded-lg overflow-hidden bg-gray-200 shrink-0 mb-4 lg:mb-0">
                    <img
                      src={photo.url}
                      alt={`Task Photo`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Center: Notes & Checkmarks */}
                  <div className="lg:ml-6 flex-1 flex flex-col gap-2 min-w-0">
                    {/* Add Note Form */}
                    <form onSubmit={(e) => handleAddNote(e, photo.id)} className="flex gap-2 w-full max-w-md">
                      <input
                        type="text"
                        placeholder="Add note/task..."
                        className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm p-2 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        value={newNotes[photo.id] || ""}
                        onChange={(e) => updateNewNoteText(photo.id, e.target.value)}
                      />
                      <button
                        type="submit"
                        className="bg-blue-100 text-blue-600 px-3 rounded-md hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50"
                        disabled={!(newNotes[photo.id] || "").trim()}
                      >
                        <FaPlus size={12} />
                      </button>
                    </form>

                    {/* Checklist */}
                    {photo.notes.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {photo.notes.map((note) => (
                          <div key={note.id} className="flex items-start gap-2 group/note">
                            <button
                              onClick={() => toggleNote(photo.id, note.id)}
                              className={`mt-1 flex-shrink-0 transition-colors ${
                                note.completed ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
                              }`}
                            >
                              {note.completed ? <FaCheckCircle size={14} /> : <FaRegCircle size={14} />}
                            </button>
                            <span className={`text-sm ${note.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                              {note.text}
                            </span>
                            <button
                              onClick={() => deleteNote(photo.id, note.id)}
                              className="text-gray-300 hover:text-red-500 p-0.5 ml-1 opacity-0 group-hover/note:opacity-100 transition-opacity"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Far Right: Work Status Dropdown & Tasks Counter */}
                  <div className="lg:ml-6 mt-4 lg:mt-0 shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2">
                    <div className="text-xs font-medium text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                      <FaFileInvoice className="text-gray-400" /> Tasks: {completedNotes}/{totalNotes}
                    </div>

                    <select
                      className={`text-sm font-semibold px-3 py-2 rounded-md border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${
                        photo.status === 'Work Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        photo.status === 'Work Started' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-white text-gray-700 border-gray-300'
                      }`}
                      value={photo.status}
                      onChange={(e) => updatePhotoStatus(photo.id, e.target.value as "Work to be Done" | "Work Started" | "Work Completed")}
                    >
                      <option value="Work to be Done">Work to be Done</option>
                      <option value="Work Started">Work Started</option>
                      <option value="Work Completed">Work Completed</option>
                    </select>
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
