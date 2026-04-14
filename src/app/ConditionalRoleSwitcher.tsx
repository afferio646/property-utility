"use client";

import { useApp } from "@/hooks/useApp";
import RoleSwitcher from "./RoleSwitcher";

export default function ConditionalRoleSwitcher() {
  const { isDemoMode } = useApp();

  if (!isDemoMode) return null;
  return <RoleSwitcher />;
}
