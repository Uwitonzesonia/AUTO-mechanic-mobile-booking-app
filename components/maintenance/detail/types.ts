import { StyleProp, ViewStyle } from "react-native";
import type { Mechanic } from "@/types/mechanic";

export interface MechanicDetailCardProps {
  mechanic: Mechanic;
  distance?: number | null;
  distanceMeters?: number | null;
  durationText?: string | null;
  isBooked?: boolean;
  isArrived?: boolean;
  isInRepair?: boolean;
  onResearch?: () => void;
  handleOnBooking?: (mechanic: Mechanic) => void;
  onClose?: () => void;
  onChat?: (mechanic: Mechanic) => void;
  onCall?: (mechanic: Mechanic) => void;
  onRate?: (mechanic: Mechanic) => void;
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

export function formatDistance(distanceKm?: number | null, distanceMeters?: number | null): string {
  if (distanceMeters != null) {
    if (distanceMeters < 1000) {
      return `${Math.round(distanceMeters)} m`;
    }
    return `${(distanceMeters / 1000).toFixed(1)} km`;
  }
  if (distanceKm == null) return "0.0 km";
  if (distanceKm < 0.1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${Number(distanceKm).toFixed(1)} km`;
}

export function formatRealisticDuration(baseDate: Date = new Date(), hoursLater = 3): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getOrdinal = (d: number) => {
    if (d > 3 && d < 21) return `${d}th`;
    switch (d % 10) {
      case 1: return `${d}st`;
      case 2: return `${d}nd`;
      case 3: return `${d}rd`;
      default: return `${d}th`;
    }
  };

  const startDay = getOrdinal(baseDate.getDate());
  const startMonth = months[baseDate.getMonth()];
  const startYear = baseDate.getFullYear();

  const end = new Date(baseDate.getTime() + hoursLater * 60 * 60 * 1000);
  const endDay = end.getDate();
  const endMonth = months[end.getMonth()];
  const endYear = end.getFullYear();

  let endHour = end.getHours();
  const ampm = endHour >= 12 ? "pm" : "am";
  endHour = endHour % 12 || 12;

  return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}(${endHour}${ampm})`;
}
