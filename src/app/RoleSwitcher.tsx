"use client";

import { useDemo, UserRole } from "@/contexts/DemoContext";

export default function RoleSwitcher() {
  const { userRole, setUserRole } = useDemo();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black/80 text-white px-3 py-2 rounded-full border border-gray-600 shadow-xl backdrop-blur-md">
      <span className="text-[10px] font-bold uppercase text-gray-400">TEST ROLE:</span>
      <select
        value={userRole}
        onChange={(e) => setUserRole(e.target.value as UserRole)}
        className="bg-transparent border-none text-xs focus:ring-0 cursor-pointer outline-none font-medium text-blue-400 uppercase"
      >
        <option value="manager" className="bg-gray-800 text-white">Manager</option>
        <option value="lead" className="bg-gray-800 text-white">Lead</option>
        <option value="contractor" className="bg-gray-800 text-white">Contractor</option>
      </select>
    </div>
  );
}
