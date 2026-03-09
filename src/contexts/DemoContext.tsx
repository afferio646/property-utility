"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export type UserRole = "manager" | "lead" | "technician";

export type TradeType =
  | "plumbing"
  | "electric"
  | "tile"
  | "cabinets"
  | "paint"
  | "windows"
  | "doors"
  | "floors"
  | "misc";

export type PhotoStatus = "Work to be Done" | "Work Started" | "Work Completed";

export interface Note {
  id: string;
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
  notes: Note[];
}

export interface Property {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  imageUrl?: string;
}

interface DemoContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  properties: Property[];
  addProperty: (name: string, address?: string, imageUrl?: string) => void;
  photos: Photo[];
  addPhoto: (propertyId: string, trade: TradeType, url: string) => void;
  updatePhotoStatus: (photoId: string, status: PhotoStatus) => void;
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
  "https://placehold.co/400x400/eeeeee/666666/png?text=Photo+1",
  "https://placehold.co/400x400/eeeeee/666666/png?text=Photo+2",
  "https://placehold.co/400x400/eeeeee/666666/png?text=Photo+3",
  "https://placehold.co/400x400/eeeeee/666666/png?text=Photo+4",
];

const initialPhotos: Photo[] = [
  {
    id: "p1",
    propertyId: "1",
    trade: "plumbing",
    url: mockPhotoUrls[0],
    status: "Work to be Done",
    notes: [
      { id: "n1", text: "Check water pressure", completed: false, completedDate: null, authorId: "user1" }
    ]
  },
  {
    id: "p2",
    propertyId: "1",
    trade: "plumbing",
    url: mockPhotoUrls[1],
    status: "Work Started",
    notes: []
  },
  {
    id: "p3",
    propertyId: "1",
    trade: "plumbing",
    url: mockPhotoUrls[2],
    status: "Work Completed",
    notes: [
      { id: "n2", text: "Installed new sink", completed: true, completedDate: new Date().toISOString(), authorId: "user1" }
    ]
  },
  {
    id: "p4",
    propertyId: "1",
    trade: "electric",
    url: mockPhotoUrls[3],
    status: "Work to be Done",
    notes: []
  }
];

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>("manager");
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  const addProperty = (name: string, address = "", imageUrl = "") => {
    const newProp: Property = {
      id: Date.now().toString(),
      name,
      address,
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    setProperties([...properties, newProp]);
  };

  const addPhoto = (propertyId: string, trade: TradeType, url: string) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      propertyId,
      trade,
      url,
      status: "Work to be Done",
      notes: [],
    };
    setPhotos([...photos, newPhoto]);
  };

  const updatePhotoStatus = (photoId: string, status: PhotoStatus) => {
    setPhotos(photos.map(p => p.id === photoId ? { ...p, status } : p));
  };

  const addNote = (photoId: string, text: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      text,
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
        userRole,
        setUserRole,
        properties,
        addProperty,
        photos,
        addPhoto,
        updatePhotoStatus,
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
