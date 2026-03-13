"use client";

import React, { useState, useEffect } from "react";
import { useDemo, UserRole } from "@/contexts/DemoContext";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function SignUpModalContent() {
  const { addUser, properties } = useDemo();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("none");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const allTrades = ["plumbing", "electric", "tile", "cabinets", "paint", "windows", "doors", "floors", "misc"];
  const [step, setStep] = useState(1); // 1 = form, 2 = upload app

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && (roleParam === "manager" || roleParam === "lead" || roleParam === "contractor")) {
      setTimeout(() => {
        setRole(roleParam as UserRole);
        setIsOpen(true);
      }, 0);

      // Remove param from URL cleanly without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete("role");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  // Also expose this component to open manually if needed via a global event or prop,
  // For now, let's just make it a singleton controlled by URL or a prop.
  // We can use a custom event to trigger it from the Header
  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener("open-signup", handleOpenModal);
    return () => window.removeEventListener("open-signup", handleOpenModal);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !company) return;

    // Default role if opened manually
    const finalRole = role !== "none" ? role : "manager";

    // Automatically assign all selected trades to all selected properties
    const formattedAssignedProperties = selectedProperties.map(propId => ({
      propertyId: propId,
      trades: selectedTrades
    }));

    addUser(name, email, phone, company, finalRole, selectedTrades, formattedAssignedProperties);
    setStep(2);
  };

  const toggleProperty = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
    } else {
      setSelectedProperties([...selectedProperties, propertyId]);
    }
  };

  const toggleTrade = (trade: string) => {
    if (selectedTrades.includes(trade)) {
      setSelectedTrades(selectedTrades.filter(t => t !== trade));
    } else {
      setSelectedTrades([...selectedTrades, trade]);
    }
  };

  const handleInstall = async () => {
    // In a real PWA, you would listen to `beforeinstallprompt` and trigger it here.
    // For this demo, we'll just show an alert and close the modal.
    alert("In a production environment, this will trigger the native PWA install prompt!");
    setIsOpen(false);
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-2 py-4">
      <div className="bg-white text-black p-4 md:p-5 rounded-lg w-full max-w-sm md:max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto hide-scrollbar">
        <button
          onClick={() => { setIsOpen(false); setStep(1); }}
          className="absolute top-2 right-3 text-gray-500 hover:text-black font-bold text-lg"
        >
          &times;
        </button>

        {step === 1 ? (
          <>
            <h2 className="text-lg md:text-xl font-bold mb-3 text-center">Sign Up</h2>
            {role !== "none" && (
              <p className="text-[10px] text-center text-gray-600 mb-4 uppercase tracking-wider font-semibold">
                Role: <span className="text-blue-600">{role}</span>
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium mb-0.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium mb-0.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium mb-0.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                    placeholder="555-0198"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium mb-0.5">Company</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                  placeholder="ACME Corp"
                />
              </div>

              {(role === "contractor" || role === "none") && (
                <div className="pt-2 border-t border-gray-200 mt-2 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-blue-600 mb-1.5">Select Your Trade Categories</label>
                    <div className="flex flex-wrap gap-1.5">
                      {allTrades.map(trade => (
                        <button
                          key={trade}
                          type="button"
                          onClick={() => toggleTrade(trade)}
                          className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase transition-colors border ${
                            selectedTrades.includes(trade)
                              ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                              : 'bg-gray-100 text-gray-600 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {trade}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-600 mb-1.5">Assigned Properties</label>
                    <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto border border-gray-300 rounded p-1.5 hide-scrollbar">
                      {properties.map(prop => (
                        <label key={prop.id} className="flex items-center gap-2 cursor-pointer p-0.5 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={selectedProperties.includes(prop.id)}
                            onChange={() => toggleProperty(prop.id)}
                            className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-[11px] text-gray-800 truncate">{prop.name}</span>
                        </label>
                      ))}
                      {properties.length === 0 && (
                        <p className="text-[10px] text-gray-500 italic">No properties available yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {role === "none" && (
                 <div>
                 <label className="block text-[11px] font-medium mb-0.5">Select Role</label>
                 <select
                   value={role}
                   onChange={(e) => setRole(e.target.value as UserRole)}
                   className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="none" disabled>Select a role...</option>
                   <option value="manager">Manager</option>
                   <option value="lead">Lead</option>
                   <option value="contractor">Contractor</option>
                 </select>
               </div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded mt-2 transition-colors"
              >
                Continue
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold mb-4">Welcome, {name}!</h2>
            <p className="text-gray-600 mb-8">
              To get the best experience and easy access, please install our app to your home screen.
            </p>
            <button
              onClick={handleInstall}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-lg shadow-[0_4px_0_rgb(21,128,61)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgb(21,128,61)] active:translate-y-[4px] active:shadow-none transition-all"
            >
              Upload App
            </button>
            <button
              onClick={() => { setIsOpen(false); setStep(1); }}
              className="mt-6 text-gray-500 underline text-sm"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignUpModal() {
  return (
    <Suspense fallback={null}>
      <SignUpModalContent />
    </Suspense>
  );
}
