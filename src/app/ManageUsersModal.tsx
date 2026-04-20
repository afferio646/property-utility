"use client";

import React, { useState } from "react";

import { useApp } from "@/hooks/useApp";
import { UserRole } from "@/contexts/DemoContext";
import { FaUserPlus, FaTimes, FaUserCog, FaTrash } from "react-icons/fa";

export default function ManageUsersModal() {
  const { userRole, users, updateUserRole, deleteUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState<UserRole>("contractor");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  // Also open when global event is fired
  React.useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("open-manage-users", handleOpenEvent);
    return () => window.removeEventListener("open-manage-users", handleOpenEvent);
  }, []);

  if (userRole !== "manager") return null;

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setRole("contractor");
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    if (name && email && phone && company && role) {
      setIsAdding(true);
      try {
        // Since this is a live Firebase app, we need to create a real user account.
        // **CRITICAL:** If we use the primary `auth` instance, it will log the manager out and
        // log them in as the new user. To prevent this, we must create a temporary, secondary
        // Firebase app instance solely for creating the new user.
        const { initializeApp } = await import("firebase/app");
        const { getAuth, createUserWithEmailAndPassword, signOut } = await import("firebase/auth");
        const { doc, setDoc } = await import("firebase/firestore");
        const { app: mainApp, db } = await import("@/lib/firebase/config");

        const { getApps, deleteApp } = await import("firebase/app");

        // Use the main app's config to create a secondary app
        // Check if it already exists to prevent duplicate-app errors
        const existingApp = getApps().find(app => app.name === "SecondaryApp");
        const secondaryApp = existingApp || initializeApp(mainApp.options, "SecondaryApp");
        const secondaryAuth = getAuth(secondaryApp);

        // Use a default password for admin-created accounts
        const defaultPassword = "password123!";

        // Create the user on the secondary auth instance (so the main session is untouched)
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, defaultPassword);
        const newUser = userCredential.user;

        // Save the profile info to the main Firestore database
        await setDoc(doc(db, "users", newUser.uid), {
          name,
          email,
          phone,
          company,
          role,
          trades: [],
          createdAt: new Date().toISOString()
        });

        // Sign out and clean up the secondary app instance
        await signOut(secondaryAuth);
        await deleteApp(secondaryApp);

        resetForm();
      } catch (err: unknown) {
        console.error("Error adding user via Manage Users:", err);
        if (err instanceof Error) {
          setAddError(err.message || "Failed to add user.");
        } else {
          setAddError("Failed to add user.");
        }
      } finally {
        setIsAdding(false);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-[#1f2937] hover:bg-[#374151] border border-[#374151] text-gray-300 hover:text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-all flex items-center gap-2"
      >
        <FaUserPlus /> Manage Users
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="bg-[#111827] border border-[#374151] text-white p-6 rounded-xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
               <FaUserCog className="text-blue-500" /> Manage Users
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Add User Form */}
              <div className="bg-[#1f2937] p-3 md:p-4 rounded-lg border border-[#374151]">
                <h3 className="text-md font-semibold mb-3 border-b border-[#374151] pb-1">Add New User</h3>
                {addError && <p className="text-red-500 text-xs mb-2 font-semibold">{addError}</p>}
                <form onSubmit={handleAddUser} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-0.5 text-gray-300">Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#111827] border border-[#374151] rounded p-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-0.5 text-gray-300">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#111827] border border-[#374151] rounded p-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-0.5 text-gray-300">Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#111827] border border-[#374151] rounded p-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-0.5 text-gray-300">Company</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-[#111827] border border-[#374151] rounded p-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-0.5 text-gray-300">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-[#111827] border border-[#374151] rounded p-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="manager">Manager</option>
                      <option value="lead">Lead</option>
                      <option value="contractor">Contractor</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold py-2 rounded transition-colors"
                  >
                    {isAdding ? "Adding..." : "Add User"}
                  </button>
                </form>
              </div>

              {/* User List */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b border-[#374151] pb-2">Current Users ({users.length})</h3>
                {users.length === 0 ? (
                  <p className="text-gray-400 text-sm">No users added yet. The system is currently running with default mock permissions based on your selection.</p>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {users.map((u) => (
                      <div key={u.id} className="bg-[#1f2937] p-3 rounded-lg border border-[#374151] flex items-center justify-between">
                         <div>
                           <p className="font-semibold text-white">{u.name}</p>
                           <p className="text-xs text-gray-400">{u.email}</p>
                           <p className="text-xs text-gray-500">{u.company}</p>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                               <select
                                 value={u.role}
                                 onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                                 className={`text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wider appearance-none cursor-pointer outline-none ${
                                   u.role === 'manager' ? 'bg-blue-900/50 text-blue-300 border border-blue-500/30 focus:border-blue-500' :
                                   u.role === 'lead' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30 focus:border-yellow-500' :
                                   'bg-green-900/50 text-green-300 border border-green-500/30 focus:border-green-500'
                                 }`}
                               >
                                 <option value="manager" className="bg-gray-800 text-white">Manager</option>
                                 <option value="lead" className="bg-gray-800 text-white">Lead</option>
                                 <option value="contractor" className="bg-gray-800 text-white">Contractor</option>
                               </select>
                               <button
                                 onClick={() => {
                                   if (confirm(`Are you sure you want to delete user ${u.name}?`)) {
                                     deleteUser(u.id);
                                   }
                                 }}
                                 className="text-gray-500 hover:text-red-500 transition-colors p-1"
                                 title="Delete User"
                               >
                                 <FaTrash size={14} />
                               </button>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
