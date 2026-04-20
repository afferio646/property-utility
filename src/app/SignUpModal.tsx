"use client";

import { useState, useEffect, Suspense } from "react";
import { UserRole } from "@/contexts/DemoContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

function SignUpModalContent() {
  const [isOpen, setIsOpen] = useState(false);

  const [role, setRole] = useState<UserRole>("none");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [managerCode, setManagerCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Contractor selections
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const allTrades = ["plumbing", "electric", "tile", "cabinets", "paint", "windows", "doors", "floors", "misc"];

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener("open-signup", handleOpenModal);
    return () => window.removeEventListener("open-signup", handleOpenModal);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !phone || !company || role === "none") {
      setError("Please fill out all fields.");
      return;
    }

    if (role === "manager" && managerCode.toLowerCase() !== "propman2026") {
      setError("Invalid Manager Access Code.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        phone,
        company,
        role,
        trades: role === "contractor" ? selectedTrades : [],
        createdAt: new Date().toISOString()
      });

      // Clear the form fields
      setRole("none");
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setCompany("");
      setManagerCode("");
      setSelectedTrades([]);

      setIsOpen(false);
      window.location.reload();
    } catch (err: unknown) {
      console.error("Firebase Auth/Firestore Error:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to create an account.");
      } else {
        setError("Failed to create an account.");
      }
      setLoading(false); // Only stop loading if there's an error, otherwise let the reload happen
    }
  };

  const toggleTrade = (trade: string) => {
    if (selectedTrades.includes(trade)) {
      setSelectedTrades(selectedTrades.filter(t => t !== trade));
    } else {
      setSelectedTrades([...selectedTrades, trade]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-2 py-2">
      <div className="bg-white text-black p-4 rounded-lg w-full max-w-sm shadow-2xl relative max-h-[95vh] overflow-y-auto hide-scrollbar">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-3 text-gray-500 hover:text-black font-bold text-lg"
        >
          &times;
        </button>

        <h2 className="text-lg font-bold mb-3 text-center uppercase tracking-wider">Sign Up</h2>

        {error && <p className="text-red-500 text-xs mb-2 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block text-[10px] font-bold mb-0.5 uppercase tracking-wider text-gray-700">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="none" disabled>Select a role...</option>
              <option value="manager">Manager</option>
              <option value="contractor">Contractor</option>
            </select>
          </div>

          {role === "manager" && (
             <div>
               <label className="block text-[10px] font-bold mb-0.5 uppercase tracking-wider text-gray-700">Manager Access Code</label>
               <input
                 type="password"
                 required
                 value={managerCode}
                 onChange={(e) => setManagerCode(e.target.value)}
                 className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                 placeholder="Enter access code"
               />
             </div>
          )}

          <div>
            <label className="block text-[10px] font-bold mb-0.5 uppercase tracking-wider text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold mb-0.5 uppercase tracking-wider text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>
          <div>
             <label className="block text-[10px] font-bold mb-0.5 uppercase tracking-wider text-gray-700">Password</label>
             <input
               type="password"
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
               placeholder="••••••••"
             />
           </div>
          <div>
            <label className="block text-[10px] font-bold mb-0.5 uppercase tracking-wider text-gray-700">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="555-0198"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold mb-0.5 uppercase tracking-wider text-gray-700">Company</label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="ACME Corp"
            />
          </div>

          {role === "contractor" && (
            <div className="pt-2 border-t border-gray-200 mt-2 space-y-2">
              <div>
                <label className="block text-[10px] font-bold mb-0.5 uppercase tracking-wider text-blue-600">Select Your Trade Categories</label>
                <div className="flex flex-wrap gap-1">
                  {allTrades.map(trade => (
                    <button
                      key={trade}
                      type="button"
                      onClick={() => toggleTrade(trade)}
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-colors border ${
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
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2.5 rounded uppercase tracking-wider mt-4 transition-colors"
          >
            {loading ? "Signing up..." : "Complete Sign Up"}
          </button>
        </form>
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
