"use client";

import React, { useState } from "react";
import { useDemo, UserRole } from "@/contexts/DemoContext";
import { FaUserPlus, FaTimes, FaUserCog, FaTrash } from "react-icons/fa";

export default function ManageUsersModal() {
  const { userRole, users, addUser, updateUserRole, deleteUser } = useDemo();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState<UserRole>("contractor");

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

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && phone && company && role) {
      addUser(name, email, phone, company, role);
      resetForm();
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

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
               <FaUserCog className="text-blue-500" /> Manage Users
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Add User Form */}
              <div className="bg-[#1f2937] p-4 rounded-lg border border-[#374151]">
                <h3 className="text-lg font-semibold mb-4 border-b border-[#374151] pb-2">Add New User</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#111827] border border-[#374151] rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#111827] border border-[#374151] rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#111827] border border-[#374151] rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Company</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-[#111827] border border-[#374151] rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-[#111827] border border-[#374151] rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="manager">Manager</option>
                      <option value="lead">Lead</option>
                      <option value="contractor">Contractor</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition-colors"
                  >
                    Add User
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
