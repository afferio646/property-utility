"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export type UserRole = "manager" | "lead" | "technician" | "none";

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  trades?: TradeType[]; // Specific to technicians/contractors
}


export type TradeType = string;

export type PhotoStatus = "Need to Inspect" | "Work to be Done" | "Work Started" | "Work Completed";

export interface Note {
  id: string;
  createdAt: string;
  text: string;
  completed: boolean;
  completedDate: string | null;
  authorId: string;
}

export interface Photo {
  id: string;
  propertyId: string;
  trade: TradeType;
  url: string;
  status: PhotoStatus;
  timestamp?: string;
  notes: Note[];
  hasAlert?: boolean;
  alertNote?: string;
  contractorId?: string; // Who raised the alert
}

export interface CustomTrade {
  id: string;
  type: string;
  label: string;
  iconName: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  imageUrl?: string;
  customTrades?: CustomTrade[];
}

interface DemoContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  addUser: (name: string, email: string, company: string, role: UserRole, trades?: TradeType[]) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  updatePropertyName: (propertyId: string, name: string) => void;
  properties: Property[];
  addProperty: (name: string, address?: string, imageUrl?: string) => void;
  deleteProperty: (propertyId: string) => void;
  addCustomTrade: (propertyId: string, label: string) => void;
  photos: Photo[];
  addPhoto: (propertyId: string, trade: TradeType, url: string) => void;
  deletePhoto: (photoId: string) => void;
  updatePhotoStatus: (photoId: string, status: PhotoStatus) => void;
  toggleAlert: (photoId: string, note?: string) => void;
  addNote: (photoId: string, text: string) => void;
  toggleNote: (photoId: string, noteId: string) => void;
  deleteNote: (photoId: string, noteId: string) => void;
  editNote: (photoId: string, noteId: string, text: string) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Initial Demo Data
const initialProperties: Property[] = [
  { id: "1", name: "123 Main St - Full Reno", address: "123 Main St, Springfield, IL 62701", createdAt: new Date().toISOString(), imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600&h=400" },
  { id: "2", name: "456 Oak Avenue", address: "456 Oak Ave, Riverside, CA 92501", createdAt: new Date().toISOString(), imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600&h=400" },
  { id: "3", name: "Sunset Boulevard Condo", address: "789 Sunset Blvd, Apt 4B, Los Angeles, CA 90028", createdAt: new Date().toISOString(), imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600&h=400" },
  { id: "4", name: "Maple Street Historic Home", address: "101 Maple St, Salem, MA 01970", createdAt: new Date().toISOString(), imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600&h=400" },
  { id: "5", name: "Pine Lake Cabin Retreat", address: "555 Pine Lake Rd, Lake Tahoe, NV 89451", createdAt: new Date().toISOString(), imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600&h=400" },
  { id: "6", name: "Downtown Loft Conversion", address: "202 Industrial Way, Unit 305, Brooklyn, NY 11211", createdAt: new Date().toISOString(), imageUrl: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=600&h=400" },
];

const mockPhotoUrls = [
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800&h=600", // Plumbing pipes
  "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=800&h=600", // Plumbing under sink
  "https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&q=80&w=800&h=600", // Finished sink/bathroom
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800&h=600", // Electrical panel
];

const initialPhotos: Photo[] = [
  {
    id: "p1",
    propertyId: "1",
    trade: "plumbing",
    url: mockPhotoUrls[0],
    status: "Work to be Done",
    notes: [
      { id: "n1", text: "Check main water valve for leaks", completed: false, createdAt: new Date().toISOString(), completedDate: null, authorId: "user1" },
      { id: "n1b", text: "Replace corroded copper section", completed: false, createdAt: new Date().toISOString(), completedDate: null, authorId: "user1" }
    ]
  },
  {
    id: "p2",
    propertyId: "1",
    trade: "plumbing",
    url: mockPhotoUrls[1],
    status: "Work Started",
    notes: [
      { id: "n2a", text: "Remove old trap", completed: true, createdAt: new Date().toISOString(), completedDate: new Date().toISOString(), authorId: "user1" },
      { id: "n2b", text: "Install new PVC piping", completed: false, createdAt: new Date().toISOString(), completedDate: null, authorId: "user1" }
    ]
  },
  {
    id: "p3",
    propertyId: "1",
    trade: "plumbing",
    url: mockPhotoUrls[2],
    status: "Work Completed",
    notes: [
      { id: "n3a", text: "Installed new sink and faucet", completed: true, createdAt: new Date().toISOString(), completedDate: new Date().toISOString(), authorId: "user1" },
      { id: "n3b", text: "Tested for leaks - passed", completed: true, createdAt: new Date().toISOString(), completedDate: new Date().toISOString(), authorId: "user1" }
    ]
  },
  {
    id: "p4",
    propertyId: "1",
    trade: "electric",
    url: mockPhotoUrls[3],
    status: "Work to be Done",
    notes: [
      { id: "n4a", text: "Label breaker box", completed: false, createdAt: new Date().toISOString(), completedDate: null, authorId: "user1" },
      { id: "n4b", text: "Run new 220v line for dryer", completed: false, createdAt: new Date().toISOString(), completedDate: null, authorId: "user1" }
    ]
  }
];

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userRole, setUserRole] = useState<UserRole>("manager"); // derived or fallback
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  const addUser = (name: string, email: string, company: string, role: UserRole) => {
    const newUser: User = { id: Date.now().toString(), name, email, company, role };
    setUsers([...users, newUser]);
    if (!currentUser) {
        setCurrentUser(newUser);
        setUserRole(role);
    }
  };

  const updatePropertyName = (propertyId: string, name: string) => {
    setProperties(properties.map(p => p.id === propertyId ? { ...p, name } : p));
  };

  const addCustomTrade = (propertyId: string, label: string) => {
    const type = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTrade: CustomTrade = { id: Date.now().toString(), type, label, iconName: "FaTools" };
    setProperties(properties.map(p => {
      if (p.id === propertyId) {
        return { ...p, customTrades: [...(p.customTrades || []), newTrade] };
      }
      return p;
    }));
  };


  const addProperty = (name: string, address?: string, imageUrl?: string) => {
    const newProp: Property = {
      id: Date.now().toString(),
      name,
      address: address || "",
      createdAt: new Date().toISOString(),
      imageUrl,
      customTrades: []
    };
    setProperties([...properties, newProp]);
  };

  const deleteProperty = (propertyId: string) => {
    setProperties(properties.filter(p => p.id !== propertyId));
    // Also delete associated photos to keep state clean
    setPhotos(photos.filter(p => p.propertyId !== propertyId));
  };


  const addPhoto = (propertyId: string, trade: TradeType, url: string) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      propertyId,
      trade,
      url,
      timestamp: new Date().toISOString(),
      notes: [],
      status: 'Need to Inspect'
    };
    setPhotos([...photos, newPhoto]);
  };

  const deletePhoto = (photoId: string) => {
    setPhotos(photos.filter(p => p.id !== photoId));
  };

  const updatePhotoStatus = (photoId: string, status: PhotoStatus) => {
    setPhotos(photos.map(p => p.id === photoId ? { ...p, status } : p));
  };

  const toggleAlert = (photoId: string, note?: string) => {
    setPhotos(photos.map(p => {
      if (p.id === photoId) {
        return {
          ...p,
          hasAlert: !p.hasAlert,
          alertNote: !p.hasAlert ? (note || "Alert triggered") : undefined,
          contractorId: !p.hasAlert && currentUser ? currentUser.id : undefined
        };
      }
      return p;
    }));
  };

  const addNote = (photoId: string, text: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      completed: false,
      completedDate: null,
      authorId: "current_user",
    };
    setPhotos(photos.map(p => {
      if (p.id === photoId) {
        return { ...p, notes: [...p.notes, newNote] };
      }
      return p;
    }));
  };

  const toggleNote = (photoId: string, noteId: string) => {
    setPhotos(photos.map(p => {
      if (p.id === photoId) {
        return {
          ...p,
          notes: p.notes.map(n => {
            if (n.id === noteId) {
              const completed = !n.completed;
              return {
                ...n,
                completed,
                completedDate: completed ? new Date().toISOString() : null,
              };
            }
            return n;
          })
        };
      }
      return p;
    }));
  };

  const editNote = (photoId: string, noteId: string, text: string) => {
      setPhotos(photos.map(p => {
          if (p.id === photoId) {
              return {
                  ...p,
                  notes: p.notes.map(n => n.id === noteId ? { ...n, text } : n)
              }
          }
          return p;
      }))
  }

  const deleteNote = (photoId: string, noteId: string) => {
      setPhotos(photos.map(p => {
          if (p.id === photoId) {
              return {
                  ...p,
                  notes: p.notes.filter(n => n.id !== noteId)
              }
          }
          return p;
      }))
  }

  return (
    <DemoContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        userRole,
        setUserRole,
        updatePropertyName,
        properties,
        addProperty,
        deleteProperty,
        addCustomTrade,
        photos,
        addPhoto,
        deletePhoto,
        updatePhotoStatus,
        toggleAlert,
        addNote,
        toggleNote,
        deleteNote,
        editNote
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
};
