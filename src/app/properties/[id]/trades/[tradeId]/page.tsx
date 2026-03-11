"use client";

import { useState } from "react";
import { useDemo, TradeType } from "@/contexts/DemoContext";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaCamera,
  FaCheckCircle,
  FaRegCircle,
  FaTrash,
  FaPencilAlt,
  FaPlus,
  FaFileInvoice,
  FaExclamationTriangle
} from "react-icons/fa";

export default function TradeDetailView() {
  const { id, tradeId } = useParams() as { id: string; tradeId: TradeType };
  const {
    properties,
    photos,
    addPhoto,
    updatePhotoStatus,
    deletePhoto,
    toggleAlert,
    submitAlertAnswer,
    resetAlert,
    addNote,
    toggleNote,
    deleteNote,
    editNote,
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


  // Format Date Helper
  const formatDate = (isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit"
    }) + " at " + date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).toLowerCase();
  };


  // Track new note text per photo card
  const [newNotes, setNewNotes] = useState<{ [key: string]: string }>({});
  const [alertNotes, setAlertNotes] = useState<{ [key: string]: string }>({});
  const [answerNotes, setAnswerNotes] = useState<{ [key: string]: string }>({});

  // Editing state: { photoId: string, noteId: string } or null
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const startEditing = (noteId: string, currentText: string) => {
    setEditingNoteId(noteId);
    setEditingText(currentText);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingText("");
  };

  const saveEdit = (photoId: string, noteId: string) => {
    if (editingText.trim()) {
      editNote(photoId, noteId, editingText.trim());
    }
    cancelEditing();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, photoId: string, noteId: string) => {
    if (e.key === 'Enter') {
      saveEdit(photoId, noteId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };


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
      <header className="bg-[#0b101e] border-b border-gray-800 p-4 shrink-0 z-10 sticky top-0 shadow-lg">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <button
            onClick={() => router.push(`/properties/${id}`)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-2 font-bold tracking-wider uppercase bg-transparent border border-gray-700 hover:border-gray-500 px-2 py-1 rounded shadow-sm hover:shadow-md w-fit"
          >
            <FaArrowLeft size={10} /> Back
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-2 mt-1">
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-widest uppercase mb-0.5 drop-shadow-md leading-tight">{tradeId} TRADE</h1>
              <p className="text-sm text-gray-300 font-medium tracking-wide leading-tight">
                {property.name}
              </p>
              {property.address && (
                <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider leading-tight">
                  {property.address}
                </p>
              )}
            </div>

            <button
              onClick={() => setShowAddPhoto(!showAddPhoto)}
              className="flex items-center gap-1.5 bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-all shadow-md border border-blue-400/50 hover:shadow-lg mt-2 md:mt-0"
            >
              <FaCamera size={12} /> Add New Task Card
            </button>
          </div>
        </div>
      </header>

      {showAddPhoto && (
        <div className="bg-[#151b2b] p-3 border-b border-gray-800 shrink-0 shadow-inner">
          <form onSubmit={handleAddPhoto} className="flex flex-col sm:flex-row gap-2 max-w-4xl mx-auto">
            <input
              type="file"
              accept="image/*"
              className="flex-1 bg-[#0b101e] border border-gray-600 text-gray-300 p-1.5 text-xs rounded shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Create a local object URL to display the image immediately
                  const localUrl = URL.createObjectURL(file);
                  setNewPhotoUrl(localUrl);
                }
              }}
              required
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAddPhoto(false)} className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-gray-400 hover:text-white transition bg-gray-800 hover:bg-gray-700 rounded border border-gray-600">
                Cancel
              </button>
              <button type="submit" className="bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase text-white transition shadow-md border border-blue-400/50 hover:from-blue-400 hover:to-blue-500">
                Upload
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content: List of Horizontal White Cards */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-2 pb-20">

        {tradePhotos.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-700 rounded-xl bg-[#151b2b] shadow-inner">
            <FaCamera className="mx-auto text-gray-500 mb-4" size={40} />
            <h2 className="text-lg font-bold tracking-wider uppercase text-gray-400 mb-2">No Field Documentation Yet</h2>
            <p className="text-gray-500 text-sm">Upload photos to start creating task checklists.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
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
              } else if (photo.status === 'Need to Inspect') {
                statusWrapperStyle = "p-[3px] rounded bg-gradient-to-b from-orange-400 to-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.6)]";
                statusSelectStyle = "bg-gradient-to-b from-orange-500 to-orange-700 text-white font-bold tracking-wider uppercase shadow-[inset_0_2px_5px_rgba(255,255,255,0.3)]";
              } else {
                // Work to be Done
                statusWrapperStyle = "p-[3px] rounded bg-gradient-to-b from-red-400 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.6)]";
                statusSelectStyle = "bg-gradient-to-b from-red-500 to-red-700 text-white font-bold tracking-wider uppercase shadow-[inset_0_2px_5px_rgba(255,255,255,0.3)]";
              }

              return (
                <div key={photo.id} className={`p-[2px] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group/taskcard relative ${photo.hasAlert ? "bg-gradient-to-b from-red-500 to-red-700 animate-pulse-slow" : "bg-gradient-to-b from-gray-200 to-gray-400"}`}>
                  <div className="bg-gradient-to-b from-white to-gray-50 rounded-md overflow-hidden flex flex-col p-2 h-full relative border border-white/60">
                    {userRole === "manager" && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (confirm("Are you sure you want to delete this entire task card?")) {
                            deletePhoto(photo.id);
                          }
                        }}
                        className="absolute top-2 right-2 z-30 bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover/taskcard:opacity-100 transition-all shadow-md backdrop-blur-sm"
                        title="Delete Task Card"
                      >
                        <FaTrash size={10} />
                      </button>
                    )}

                    {/* Far Left: Small Picture Thumbnail */}
                    <div className="h-40 w-full rounded overflow-hidden bg-gray-200 shrink-0 mb-3 border border-gray-300 shadow-inner relative group/photo">
                      <Image
                        src={photo.url}
                        alt={`Task Photo`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 112px"
                        unoptimized
                      />
                      {/* Inner shadow overlay for 3D picture frame effect */}
                      <div className="absolute inset-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] pointer-events-none"></div>

                      {/* Hover Overlay with Add Photo Button */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 z-10 backdrop-blur-[1px]">
                         <label
                           className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
                           title="Add additional photo"
                         >
                           <input
                             type="file"
                             accept="image/*,capture=camera"
                             className="hidden"
                             onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) alert("Photo selected: " + file.name + ". In a full app, this would append the photo to this task card.");
                             }}
                           />
                           <FaPlus size={10} />
                         </label>
                         <span className="text-[8px] font-bold text-white uppercase tracking-wider pointer-events-none">Add Photo</span>
                      </div>
                    </div>

                    {/* Center: Notes & Checkmarks */}
                    <div className="sm:ml-3 flex-1 flex flex-col gap-1.5 min-w-0 py-1">
                      {/* Add Note Form */}
                      <form onSubmit={(e) => handleAddNote(e, photo.id)} className="flex gap-1.5 w-full max-w-sm">
                        <input
                          type="text"
                          placeholder="Add new task..."
                          className="flex-1 bg-white border border-gray-300 text-gray-900 text-[11px] p-1.5 rounded shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                          value={newNotes[photo.id] || ""}
                          onChange={(e) => updateNewNoteText(photo.id, e.target.value)}
                        />
                        <button
                          type="submit"
                          className="bg-gradient-to-b from-blue-100 to-blue-200 text-blue-700 border border-blue-300 px-2 rounded shadow-sm hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all disabled:opacity-50 disabled:grayscale"
                          disabled={!(newNotes[photo.id] || "").trim()}
                        >
                          <FaPlus size={10} />
                        </button>
                      </form>

                      {/* Checklist */}
                      {photo.notes.length > 0 && (
                        <div className="mt-2 space-y-0.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                          {photo.notes.map((note) => (
                            <div key={note.id} className="flex flex-col justify-between gap-1 group/note p-1.5 hover:bg-gray-100 rounded transition-colors w-full border-b border-gray-100 last:border-0">
                              <div className="flex items-start gap-1.5 flex-1 min-w-0">
                                <button
                                  onClick={() => toggleNote(photo.id, note.id)}
                                  className={`mt-0.5 flex-shrink-0 transition-colors drop-shadow-sm ${
                                    note.completed ? "text-green-500" : "text-gray-400 hover:text-blue-500"
                                  }`}
                                >
                                  {note.completed ? <FaCheckCircle size={12} /> : <FaRegCircle size={12} />}
                                </button>

                                {editingNoteId === note.id ? (
                                  <div className="flex-1 flex gap-1 w-full">
                                    <input
                                      type="text"
                                      autoFocus
                                      className="flex-1 bg-white border border-blue-400 text-gray-900 text-[11px] px-1 py-0.5 rounded shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition w-full"
                                      value={editingText}
                                      onChange={(e) => setEditingText(e.target.value)}
                                      onKeyDown={(e) => handleEditKeyDown(e, photo.id, note.id)}
                                      onBlur={() => saveEdit(photo.id, note.id)}
                                    />
                                  </div>
                                ) : (
                                  <span
                                    className={`text-[11px] font-medium truncate flex-1 cursor-pointer leading-tight ${note.completed ? "text-gray-400 line-through" : "text-gray-800 hover:text-blue-600 transition-colors"}`}
                                    onClick={() => startEditing(note.id, note.text)}
                                    title="Click to edit task"
                                  >
                                    {note.text}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 pl-5 sm:pl-0">
                                <div className="text-[9px] text-gray-500 whitespace-nowrap flex flex-row gap-1.5">
                                  <span>Start: {formatDate(note.createdAt)}</span>
                                  {note.completed && note.completedDate && (
                                    <span>Completed: {formatDate(note.completedDate)}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-0.5 opacity-0 group-hover/note:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); startEditing(note.id, note.text); }}
                                    className="text-gray-300 hover:text-blue-500 p-0.5"
                                    title="Edit task"
                                  >
                                    <FaPencilAlt size={10} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); deleteNote(photo.id, note.id); }}
                                    className="text-gray-300 hover:text-red-500 p-0.5"
                                    title="Delete task"
                                  >
                                    <FaTrash size={10} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* ALERTS SECTION (Bottom Left of Content) */}
                      <div className="mt-2 flex flex-col gap-1.5">
                        {!photo.hasAlert ? (
                          <div className="flex gap-1 items-center max-w-sm">
                            <input
                              type="text"
                              placeholder="Type alert reason here..."
                              value={alertNotes[photo.id] || ""}
                              onChange={(e) => setAlertNotes({ ...alertNotes, [photo.id]: e.target.value })}
                              className="bg-red-50/50 border border-red-200 text-gray-800 text-[11px] px-1.5 py-1 rounded flex-1 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
                            />
                            <button
                              onClick={() => {
                                toggleAlert(photo.id, alertNotes[photo.id] || "Contractor initiated an alert for this task.");
                                setAlertNotes({ ...alertNotes, [photo.id]: "" });
                              }}
                              className="bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-600 border border-gray-300 px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 transition-all"
                            >
                              <FaExclamationTriangle size={10} />
                              Alert
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 max-w-sm">
                            {/* Contractor Alert Display */}
                            <div className="bg-red-100 border-l-2 border-red-500 p-1.5 rounded flex flex-col justify-start">
                              <span className="font-bold uppercase text-[9px] block text-red-600 mb-0.5">Active Alert</span>
                              <div className="text-[10px] text-red-800 font-medium">{photo.alertNote}</div>
                            </div>

                            {/* Manager Answer Display or Input */}
                            {photo.hasAnswer ? (
                              <div className="bg-green-100 border-l-2 border-green-500 p-1.5 rounded flex flex-col justify-start">
                                <span className="font-bold uppercase text-[9px] block text-green-600 mb-0.5">Manager Answer</span>
                                <div className="text-[10px] text-green-800 font-medium">{photo.managerAnswer}</div>
                              </div>
                            ) : (
                              userRole === "manager" && (
                                <div className="flex gap-1 items-center">
                                  <input
                                    type="text"
                                    placeholder="Type answer to contractor..."
                                    value={answerNotes[photo.id] || ""}
                                    onChange={(e) => setAnswerNotes({ ...answerNotes, [photo.id]: e.target.value })}
                                    className="bg-green-50/50 border border-green-200 text-gray-800 text-[11px] px-1.5 py-1 rounded flex-1 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                  />
                                  <button
                                    onClick={() => {
                                      submitAlertAnswer(photo.id, answerNotes[photo.id] || "Alert resolved by manager.");
                                      setAnswerNotes({ ...answerNotes, [photo.id]: "" });
                                    }}
                                    className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase transition-colors shadow-sm"
                                  >
                                    Answer
                                  </button>
                                </div>
                              )
                            )}

                            {/* Reset Button (Bottom) */}
                            <button
                              onClick={() => resetAlert(photo.id)}
                              className="mt-1 self-start text-[9px] font-bold text-gray-500 hover:text-gray-700 uppercase tracking-wider underline decoration-gray-400 underline-offset-2 transition-colors"
                            >
                              Reset Alert
                            </button>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Far Right: Work Status Dropdown & Tasks Counter */}
                    <div className="sm:ml-3 mt-2 sm:mt-0 shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <div className="text-[9px] font-bold tracking-wider uppercase text-gray-600 flex items-center gap-1 bg-gray-200 border border-gray-300 px-2 py-1 rounded shadow-sm">
                        <FaFileInvoice className="text-gray-500" size={10} /> Tasks: {completedNotes}/{totalNotes}
                      </div>

                      {/* 3D Glowing Status Dropdown Wrapper */}
                      <div className={statusWrapperStyle}>
                        <select
                          className={`text-[10px] w-full sm:w-auto px-2 py-1.5 rounded appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/50 transition-colors border-none ${statusSelectStyle}`}
                          value={photo.status}
                          onChange={(e) => updatePhotoStatus(photo.id, e.target.value as "Need to Inspect" | "Work to be Done" | "Work Started" | "Work Completed")}
                        >
                          <option value="Need to Inspect" className="bg-gray-800 text-white">NEED TO INSPECT</option>
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
