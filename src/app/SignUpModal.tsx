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
    if (roleParam && (roleParam === "manager" || roleParam === "lead" || roleParam === "technician")) {
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
    addUser(name, email, phone, company, finalRole, selectedTrades as string[], selectedProperties);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-md shadow-2xl relative">
        <button
          onClick={() => { setIsOpen(false); setStep(1); }}
          className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold text-xl"
        >
          &times;
        </button>

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
            {role !== "none" && (
              <p className="text-sm text-center text-gray-600 mb-6 uppercase tracking-wider font-semibold">
                Role: <span className="text-blue-600">{role}</span>
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="555-0198"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="ACME Corp"
                />
              </div>

              {(role === "technician" || role === "none") && (
                <div className="pt-2 border-t border-gray-200 mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-blue-600 mb-2">Select Your Trade Categories (Contractors Only)</label>
                    <div className="flex flex-wrap gap-2">
                      {allTrades.map(trade => (
                        <button
                          key={trade}
                          type="button"
                          onClick={() => toggleTrade(trade)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors border ${
                            selectedTrades.includes(trade)
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                              : 'bg-gray-100 text-gray-600 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {trade}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-blue-600 mb-2">Assigned Properties</label>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
                      {properties.map(prop => (
                        <label key={prop.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedProperties.includes(prop.id)}
                            onChange={() => toggleProperty(prop.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-800">{prop.name}</span>
                        </label>
                      ))}
                      {properties.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No properties available yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {role === "none" && (
                 <div>
                 <label className="block text-sm font-medium mb-1">Select Role</label>
                 <select
                   value={role}
                   onChange={(e) => setRole(e.target.value as UserRole)}
                   className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="none" disabled>Select a role...</option>
                   <option value="manager">Manager</option>
                   <option value="lead">Lead</option>
                   <option value="technician">Technician/Contractor</option>
                 </select>
               </div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded mt-4 transition-colors"
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
