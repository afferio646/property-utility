"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, doc, onSnapshot, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Property, Photo, User, AssignedProperty, PhotoStatus, CustomTrade, TradeType, UserRole } from "./DemoContext";
import { useAuth } from "./AuthContext";

interface DataContextType {
  properties: Property[];
  photos: Photo[];
  users: User[];

  // Properties
  addProperty: (name: string, address?: string, imageUrl?: string) => Promise<void>;
  deleteProperty: (propertyId: string) => Promise<void>;
  updatePropertyName: (propertyId: string, name: string) => Promise<void>;
  togglePropertyArchive: (propertyId: string, isArchived: boolean) => Promise<void>;
  addCustomTrade: (propertyId: string, label: string) => Promise<void>;

  // Photos & Tasks
  addPhoto: (propertyId: string, trade: TradeType, url: string) => Promise<void>;
  addPhotoToGallery: (photoId: string, url: string) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  updatePhotoStatus: (photoId: string, status: PhotoStatus) => Promise<void>;

  // Alerts
  toggleAlert: (photoId: string, note?: string) => Promise<void>;
  submitAlertAnswer: (photoId: string, answer: string) => Promise<void>;
  resetAlert: (photoId: string) => Promise<void>;

  // Notes / Checklists
  addNote: (photoId: string, text: string) => Promise<void>;
  toggleNote: (photoId: string, noteId: string) => Promise<void>;
  deleteNote: (photoId: string, noteId: string) => Promise<void>;
  editNote: (photoId: string, noteId: string, text: string) => Promise<void>;

  // Users
  updateUserAssignedProperties: (userId: string, assignedProperties: AssignedProperty[]) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Listen to Firestore
  useEffect(() => {
    let unsubProperties = () => {};
    let unsubPhotos = () => {};
    let unsubUsers = () => {};

    if (user) {
      unsubProperties = onSnapshot(collection(db, "properties"), (snapshot) => {
        setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property)));
      });

      unsubPhotos = onSnapshot(collection(db, "photos"), (snapshot) => {
        setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo)));
      });

      unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
      });
    } else {
      // Defer synchronous setState during effect setup if no user is present
      setTimeout(() => {
        setProperties([]);
        setPhotos([]);
        setUsers([]);
      }, 0);
    }

    return () => {
      unsubProperties();
      unsubPhotos();
      unsubUsers();
    };
  }, [user]);

  // PROPERTIES
  const addProperty = async (name: string, address?: string, imageUrl?: string) => {
    await addDoc(collection(db, "properties"), {
      name,
      address: address || "",
      imageUrl: imageUrl || "",
      createdAt: new Date().toISOString(),
      customTrades: [],
      isArchived: false,
    });
  };

  const deleteProperty = async (propertyId: string) => {
    await deleteDoc(doc(db, "properties", propertyId));
    // We should also delete photos for this property to keep the database clean
    const propertyPhotos = photos.filter(p => p.propertyId === propertyId);
    for (const photo of propertyPhotos) {
      await deleteDoc(doc(db, "photos", photo.id));
    }
  };

  const updatePropertyName = async (propertyId: string, name: string) => {
    await updateDoc(doc(db, "properties", propertyId), { name });
  };

  const togglePropertyArchive = async (propertyId: string, currentIsArchived: boolean) => {
    await updateDoc(doc(db, "properties", propertyId), { isArchived: !currentIsArchived });
  };

  const addCustomTrade = async (propertyId: string, label: string) => {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return;

    const type = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTrade: CustomTrade = { id: Date.now().toString(), type, label, iconName: "FaTools" };

    await updateDoc(doc(db, "properties", propertyId), {
      customTrades: [...(prop.customTrades || []), newTrade]
    });
  };

  // PHOTOS
  const addPhoto = async (propertyId: string, trade: TradeType, url: string) => {
    await addDoc(collection(db, "photos"), {
      propertyId,
      trade,
      url,
      galleryUrls: [],
      status: "Need to Inspect",
      timestamp: new Date().toISOString(),
      notes: [],
    });
  };

  const addPhotoToGallery = async (photoId: string, url: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    await updateDoc(doc(db, "photos", photoId), {
      galleryUrls: [...(photo.galleryUrls || []), url]
    });
  };

  const deletePhoto = async (photoId: string) => {
    await deleteDoc(doc(db, "photos", photoId));
  };

  const updatePhotoStatus = async (photoId: string, status: PhotoStatus) => {
    await updateDoc(doc(db, "photos", photoId), { status });
  };

  // ALERTS
  const toggleAlert = async (photoId: string, note?: string) => {
    await updateDoc(doc(db, "photos", photoId), {
      hasAlert: true,
      alertNote: note || "Alert triggered",
      contractorId: user?.uid || "",
      hasAnswer: false,
      managerAnswer: null
    });
  };

  const submitAlertAnswer = async (photoId: string, answer: string) => {
    await updateDoc(doc(db, "photos", photoId), {
      hasAnswer: true,
      managerAnswer: answer
    });
  };

  const resetAlert = async (photoId: string) => {
    await updateDoc(doc(db, "photos", photoId), {
      hasAlert: false,
      alertNote: null,
      contractorId: null,
      hasAnswer: false,
      managerAnswer: null
    });
  };

  // NOTES
  const addNote = async (photoId: string, text: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    const newNote = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      completed: false,
      completedDate: null,
      authorId: user?.uid || "unknown",
    };

    await updateDoc(doc(db, "photos", photoId), {
      notes: [...(photo.notes || []), newNote]
    });
  };

  const toggleNote = async (photoId: string, noteId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    const updatedNotes = photo.notes.map(n => {
      if (n.id === noteId) {
        const completed = !n.completed;
        return {
          ...n,
          completed,
          completedDate: completed ? new Date().toISOString() : null,
        };
      }
      return n;
    });

    const allCompleted = updatedNotes.length > 0 && updatedNotes.every(n => n.completed);

    await updateDoc(doc(db, "photos", photoId), {
      notes: updatedNotes,
      status: allCompleted ? "Work Completed" : photo.status
    });
  };

  const editNote = async (photoId: string, noteId: string, text: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    const updatedNotes = photo.notes.map(n => n.id === noteId ? { ...n, text } : n);
    await updateDoc(doc(db, "photos", photoId), { notes: updatedNotes });
  };

  const deleteNote = async (photoId: string, noteId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    const updatedNotes = photo.notes.filter(n => n.id !== noteId);
    await updateDoc(doc(db, "photos", photoId), { notes: updatedNotes });
  };

  // USERS
  const updateUserAssignedProperties = async (userId: string, assignedProperties: AssignedProperty[]) => {
    await updateDoc(doc(db, "users", userId), { assignedProperties });
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    await updateDoc(doc(db, "users", userId), { role });
  };

  const deleteUser = async (userId: string) => {
    await deleteDoc(doc(db, "users", userId));
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        photos,
        users,
        addProperty,
        deleteProperty,
        updatePropertyName,
        togglePropertyArchive,
        addCustomTrade,
        addPhoto,
        addPhotoToGallery,
        deletePhoto,
        updatePhotoStatus,
        toggleAlert,
        submitAlertAnswer,
        resetAlert,
        addNote,
        toggleNote,
        deleteNote,
        editNote,
        updateUserAssignedProperties,
        updateUserRole,
        deleteUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  return context;
};
