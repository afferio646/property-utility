import sys

filepath = "src/app/page.tsx"

with open(filepath, "r") as f:
    content = f.read()

# Add state variables for property editing
import_search = """import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDemo } from "@/contexts/DemoContext";"""

import_replace = """import { useState, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDemo } from "@/contexts/DemoContext";"""

content = content.replace(import_search, import_replace)


state_search = """export default function Home() {
  const { userRole, setUserRole, properties, photos, addProperty } = useDemo();
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [newPropName, setNewPropName] = useState("");
  const [newPropAddress, setNewPropAddress] = useState("");"""

state_replace = """export default function Home() {
  const { userRole, setUserRole, properties, photos, addProperty, updatePropertyName } = useDemo();
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [newPropName, setNewPropName] = useState("");
  const [newPropAddress, setNewPropAddress] = useState("");
  const [editingPropId, setEditingPropId] = useState<string | null>(null);
  const [editingPropText, setEditingPropText] = useState("");"""

content = content.replace(state_search, state_replace)


# Add handler functions
handler_search = """  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPropName.trim()) {
      addProperty(newPropName, newPropAddress);
      setIsAddingProperty(false);
      setNewPropName("");
      setNewPropAddress("");
    }
  };"""

handler_replace = """  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPropName.trim()) {
      addProperty(newPropName, newPropAddress);
      setIsAddingProperty(false);
      setNewPropName("");
      setNewPropAddress("");
    }
  };

  const startEditingProp = (id: string, name: string) => {
    if (userRole === "manager") {
      setEditingPropId(id);
      setEditingPropText(name);
    }
  };

  const cancelEditingProp = () => {
    setEditingPropId(null);
    setEditingPropText("");
  };

  const saveEditingProp = (id: string) => {
    if (editingPropText.trim()) {
      updatePropertyName(id, editingPropText.trim());
    }
    setEditingPropId(null);
    setEditingPropText("");
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      saveEditingProp(id);
    } else if (e.key === "Escape") {
      cancelEditingProp();
    }
  };"""

content = content.replace(handler_search, handler_replace)

# Render editable title inside the property map
render_search = """              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-bold text-white mb-1 shadow-sm leading-tight">
                  {prop.name}
                </h2>
                <p className="text-sm text-gray-300 truncate shadow-sm">
                  {prop.address}
                </p>"""

render_replace = """              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                {editingPropId === prop.id ? (
                    <input
                      type="text"
                      value={editingPropText}
                      onChange={(e) => setEditingPropText(e.target.value)}
                      onBlur={() => saveEditingProp(prop.id)}
                      onKeyDown={(e) => handleEditKeyDown(e, prop.id)}
                      className="w-full bg-black/50 text-white font-bold text-xl border border-blue-500 rounded px-1 mb-1 outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onClick={(e) => e.preventDefault()}
                    />
                ) : (
                  <h2
                    className={`text-xl font-bold text-white mb-1 shadow-sm leading-tight ${userRole === "manager" ? "cursor-pointer hover:text-blue-300 transition-colors" : ""}`}
                    onClick={(e) => {
                       if (userRole === "manager") {
                         e.preventDefault();
                         startEditingProp(prop.id, prop.name);
                       }
                    }}
                    title={userRole === "manager" ? "Click to edit" : undefined}
                  >
                    {prop.name} {userRole === "manager" && <span className="text-xs text-gray-400 font-normal ml-2 opacity-0 group-hover:opacity-100 transition-opacity">(edit)</span>}
                  </h2>
                )}

                <p className="text-sm text-gray-300 truncate shadow-sm">
                  {prop.address}
                </p>"""

content = content.replace(render_search, render_replace)


with open(filepath, "w") as f:
    f.write(content)
