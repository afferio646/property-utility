import { useContext } from "react";
import { ModeContext } from "@/contexts/AppProvider";
import { useDemo } from "@/contexts/DemoContext";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

export const useApp = () => {
  const { isDemo } = useContext(ModeContext);

  // We call both hooks unconditionally to obey rules of hooks,
  // but only one will actually return data based on which Provider is wrapping the tree.
  const demoData = useDemo();
  const liveData = useData();
  const authData = useAuth();

  if (isDemo) {
    if (!demoData) throw new Error("DemoProvider is missing");
    return {
      ...demoData,
      isDemoMode: true,
      currentUser: demoData.currentUser,
      userRole: demoData.userRole
    };
  } else {
    if (!liveData) throw new Error("DataProvider is missing");
    return {
      ...liveData,
      isDemoMode: false,
      currentUser: authData.user ? {
        id: authData.user.uid,
        name: authData.user.name,
        email: authData.user.email || "",
        phone: authData.user.phone,
        company: authData.user.company,
        role: authData.user.role,
        trades: authData.user.trades
      } : null,
      userRole: authData.user?.role || "none",

      // Map live DataContext properties to missing DemoContext ones (like setCurrentUser)
      // Since live mode relies on Firebase Auth, setCurrentUser is mostly a no-op
      setCurrentUser: () => {},
      setUserRole: () => {},
      addUser: async () => {} // Handled via SignUpModal now
    };
  }
};
