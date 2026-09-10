import { StyleProp, ViewStyle } from "react-native";
import type { Mechanic } from "@/types/mechanic";

export interface MechanicDetailCardProps {
  mechanic: Mechanic;
  distance?: number;
  durationText?: string;
  isBooked?: boolean;
  onResearch?: () => void;
  handleOnBooking?: (mechanic: Mechanic) => void;
  onClose?: () => void;
  onChat?: (mechanic: Mechanic) => void;
  onCall?: (mechanic: Mechanic) => void;
  style?: StyleProp<ViewStyle>;
}

export function getMechanicName(mechanic: Mechanic): string {
  return mechanic.names || mechanic.fullName || "Mechanic";
}

export function getMechanicInitial(name: string): string {
  return (name[0] || "M").toUpperCase();
}

export function getMechanicAvatarUrl(mechanic: Mechanic): string | undefined {
  return (
    mechanic.profileImage ||
    (mechanic as Record<string, any>).profile_image ||
    (mechanic as Record<string, any>).avatar_url ||
    (mechanic as Record<string, any>).photoURL
  );
}

export function formatDistance(distance?: number): string {
  if (distance == null) return "0.0 km";
  return `${Number(distance).toFixed(1)} km`;
}
