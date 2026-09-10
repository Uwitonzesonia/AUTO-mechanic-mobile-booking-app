import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { Mechanic } from "@/types/mechanic";
import {
  formatDistance,
  getMechanicAvatarUrl,
  getMechanicInitial,
  getMechanicName,
} from "./types";

interface MechanicPreviewCardProps {
  mechanic: Mechanic;
  distance?: number | null;
  onResearch?: () => void;
  onConfirm?: (mechanic: Mechanic) => void;
  onClose?: () => void;
}

export function MechanicPreviewCard({
  mechanic,
  distance,
  onResearch,
  onConfirm,
  onClose,
}: MechanicPreviewCardProps) {
  const name = getMechanicName(mechanic);
  const initial = getMechanicInitial(name);
  const avatarUrl = getMechanicAvatarUrl(mechanic);

  const rating = mechanic.rating != null ? Number(mechanic.rating).toFixed(1) : "0.0";
  const fixesCount = mechanic.total_services ?? 0;
  const experienceYears = mechanic.years_experience ?? 0;

  const resolvedDistance =
    distance ??
    mechanic.current_location?.distanceKm ??
    mechanic.location?.distanceKm;
  const distanceText = formatDistance(resolvedDistance);

  return (
    <BlurView intensity={90} tint="prominent" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Avatar
            imageUrl={avatarUrl}
            avatarSize={50}
            avatarBorderRadius={25}
            avatarBorderWidth={2}
            avatarBorderColor="#ffffff"
            avatarBackgroundColor="rgba(255, 255, 255, 0.12)"
          >
            <Text style={styles.avatarFallback}>{initial}</Text>
          </Avatar>
          {mechanic.is_online !== false && <View style={styles.onlineBadge} />}
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={13} color="#FFB800" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            icon={<Ionicons name="close-outline" size={18} color="#ffffff" />}
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityLabel="Close mechanic details"
          />
        )}
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{fixesCount}</Text>
          <Text style={styles.metricLabel}>Fixes</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{experienceYears}+</Text>
          <Text style={styles.metricLabel}>Years of experience</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{distanceText}</Text>
          <Text style={styles.metricLabel}>Away from you</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Button
          variant="custom"
          size="icon"
          icon={<Ionicons name="refresh-outline" size={22} color="#ffffff" />}
          style={styles.actionCircleButton}
          onPress={onResearch}
          accessibilityLabel="Search again"
        />

        <Button
          variant="custom"
          size="icon"
          icon={<Ionicons name="checkmark-outline" size={24} color="#ffffff" />}
          style={styles.actionCircleButton}
          onPress={() => onConfirm?.(mechanic)}
          accessibilityLabel={`Select ${name}`}
        />
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(14, 22, 38, 0.85)",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 12,
  },
  avatarFallback: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#141A22",
    zIndex: 10,
  },
  infoCol: {
    flex: 1,
    justifyContent: "flex-start",
  },
  name: {
    fontSize: 16.5,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  ratingBadge: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    gap: 4,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  ratingText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#000000",
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginLeft: 8,
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  metricValue: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900",
    color: "#ffffff",
    includeFontPadding: false,
  },
  metricLabel: {
    textAlign: "center",
    fontSize: 11,
    color: "#CBD5E1",
    includeFontPadding: false,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 36,
    marginTop: 4,
    paddingVertical: 4,
  },
  actionCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fd0d0d",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#fd0d0d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
