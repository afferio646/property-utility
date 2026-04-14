"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { UserRole } from "./DemoContext";

export interface AppUser {
  uid: string;
  email: string | null;
  role: UserRole;
  name: string;
  phone: string;
  company: string;
  trades?: string[];
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUser({
          uid,
          email: data.email || null,
          role: data.role as UserRole,
          name: data.name || "",
          phone: data.phone || "",
          company: data.company || "",
          trades: data.trades || [],
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
      setFirebaseUser(currentFirebaseUser);
      if (currentFirebaseUser) {
        await fetchUserData(currentFirebaseUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser.uid);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
