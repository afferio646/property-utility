"use client";

import React, { useEffect, useState } from "react";
import { useDemo } from "@/contexts/DemoContext";

export default function Header() {
  const { currentUser } = useDemo();

  const handleOpenSignUp = () => {
    // Dispatch a custom event to open the modal
    const event = new Event("open-signup");
    window.dispatchEvent(event);
  };

  return (
    <header className="bg-[#111827] border-b border-[#1f2937] px-4 py-3 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-xl text-black">
            N
          </div>
          <h1 className="text-xl font-bold tracking-wider text-white">
            PROP<span className="text-blue-500">UTIL</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-2">
               <span className="text-sm text-gray-400 capitalize">{currentUser.role}</span>
               <div className="bg-[#1f2937] px-3 py-1.5 rounded-full text-sm font-medium border border-[#374151]">
                  {currentUser.name}
               </div>
            </div>
          ) : (
            <button
              onClick={handleOpenSignUp}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors"
            >
              Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
