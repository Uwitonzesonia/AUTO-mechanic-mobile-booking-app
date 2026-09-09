import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, Image } from "react-native";
import MapView from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useMapboxRoute } from "@/hooks/useMapboxRoute";
import { MOCK_MECHANICS } from "@/constants/mechanics";
import { callPhoneNumber } from "@/utils/phone";
import { getMechanicAvatarUrl } from "@/components/maintenance/detail/types";
import type { Mechanic } from "@/types/mechanic";

export function useMaintenanceCoordinator() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    searchTrigger?: string;
    car?: string;
    location?: string;
    category?: string;
    bookedMechanicId?: string;
    bookedTimestamp?: string;
  }>();

  const mapRef = useRef<MapView | null>(null);

  const [isSearching, setIsSearching] = useState(true);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const { route, fetchRoute, clearRoute } = useMapboxRoute();
  const { userCoords, nearbyMechanics, hasPermission, refreshLocation } = useUserLocation(5);

  const prevSearchTriggerRef = useRef<string | undefined>(params.searchTrigger);
  const prevBookedKeyRef = useRef<string | undefined>(undefined);

  // Handle re-search trigger from Search/Location modals
  useEffect(() => {
    if (params.searchTrigger && params.searchTrigger !== prevSearchTriggerRef.current) {
      prevSearchTriggerRef.current = params.searchTrigger;
      setIsSearching(true);
      setSelectedMechanic(null);
      setShowDetailModal(false);
      setIsBooked(false);
      clearRoute();
      refreshLocation();

      if (mapRef.current && userCoords) {
        mapRef.current.animateToRegion(
          {
            latitude: userCoords.latitude,
            longitude: userCoords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          800
        );
      }
    }
  }, [params.searchTrigger, refreshLocation, userCoords, clearRoute]);

  // Handle incoming confirmed booking params
  useEffect(() => {
    if (!params.bookedMechanicId) return;

    const bookingKey = `${params.bookedMechanicId}-${params.bookedTimestamp || ""}`;
    if (bookingKey === prevBookedKeyRef.current) return;
    prevBookedKeyRef.current = bookingKey;

    setIsSearching(false);
    setIsBooked(true);

    let targetMechanic = nearbyMechanics.find(
      (m) => String(m.id) === String(params.bookedMechanicId)
    );

    if (!targetMechanic) {
      const raw = MOCK_MECHANICS.find(
        (m) => String(m.id) === String(params.bookedMechanicId)
      );
      if (raw && userCoords) {
        targetMechanic = {
          ...raw,
          current_location: {
            lat: userCoords.latitude + 0.0072,
            lon: userCoords.longitude + 0.0051,
            distanceKm: 0.9,
          },
        };
      } else if (raw) {
        targetMechanic = raw;
      }
    }

    if (targetMechanic) {
      setSelectedMechanic(targetMechanic);
      setShowDetailModal(true);

      const mLat = targetMechanic.current_location?.lat ?? targetMechanic.location?.lat;
      const mLon = targetMechanic.current_location?.lon ?? targetMechanic.location?.lon;

      if (userCoords && mLat !== undefined && mLon !== undefined) {
        mapRef.current?.fitToCoordinates(
          [
            { latitude: userCoords.latitude, longitude: userCoords.longitude },
            { latitude: mLat, longitude: mLon },
          ],
          {
            edgePadding: { top: 120, right: 60, bottom: 280, left: 60 },
            animated: true,
          }
        );

        fetchRoute(
          { latitude: mLat, longitude: mLon },
          { latitude: userCoords.latitude, longitude: userCoords.longitude }
        );
      }
    }
  }, [params.bookedMechanicId, params.bookedTimestamp, nearbyMechanics, userCoords, fetchRoute]);

  // Fetch route if coordinates resolve after initial booking setup
  useEffect(() => {
    if (isBooked && selectedMechanic && userCoords && !route) {
      const mLat = selectedMechanic.current_location?.lat ?? selectedMechanic.location?.lat;
      const mLon = selectedMechanic.current_location?.lon ?? selectedMechanic.location?.lon;
      if (mLat !== undefined && mLon !== undefined) {
        fetchRoute(
          { latitude: mLat, longitude: mLon },
          { latitude: userCoords.latitude, longitude: userCoords.longitude }
        );
      }
    }
  }, [isBooked, selectedMechanic, userCoords, route, fetchRoute]);

  // Adjust camera to fit the full route polyline once loaded
  useEffect(() => {
    if (isBooked && route && route.coordinates.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(route.coordinates, {
        edgePadding: { top: 120, right: 60, bottom: 280, left: 60 },
        animated: true,
      });
    }
  }, [isBooked, route]);

  // Animate to user location when first acquired
  useEffect(() => {
    if (mapRef.current && userCoords) {
      mapRef.current.animateToRegion(
        {
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        800
      );
    }
  }, [userCoords?.latitude, userCoords?.longitude]);

  // Prefetch mechanic avatar images for snappy map marker rendering
  useEffect(() => {
    if (nearbyMechanics?.length) {
      nearbyMechanics.forEach((m) => {
        const img = getMechanicAvatarUrl(m);
        if (img) Image.prefetch(img).catch(() => {});
      });
    }
  }, [nearbyMechanics]);

  const handleSearchComplete = useCallback(() => {
    setIsSearching(false);
    setShowDetailModal(false);
    setSelectedMechanic(null);
    setIsBooked(false);
    clearRoute();
  }, [clearRoute]);

  const handleSelectMechanic = useCallback(
    (mechanic: Mechanic) => {
      setSelectedMechanic(mechanic);
      setShowDetailModal(true);
      setIsBooked(false);
      clearRoute();

      const lat = mechanic.current_location?.lat ?? mechanic.location?.lat;
      const lon = mechanic.current_location?.lon ?? mechanic.location?.lon;

      if (mapRef.current && lat !== undefined && lon !== undefined) {
        mapRef.current.animateToRegion(
          {
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.035,
            longitudeDelta: 0.035,
          },
          500
        );
      }
    },
    [clearRoute]
  );

  const resetToInitialMap = useCallback(
    (duration: number = 600) => {
      if (mapRef.current && userCoords) {
        mapRef.current.animateToRegion(
          {
            latitude: userCoords.latitude,
            longitude: userCoords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          duration
        );
      }
    },
    [userCoords]
  );

  const handleCloseDetail = useCallback(() => {
    setShowDetailModal(false);
    setSelectedMechanic(null);
    setIsBooked(false);
    clearRoute();
    prevBookedKeyRef.current = undefined;
    router.setParams({
      bookedMechanicId: undefined,
      bookedTimestamp: undefined,
    });
    resetToInitialMap();
  }, [clearRoute, resetToInitialMap, router]);

  const handleBackPress = useCallback(() => {
    if (showDetailModal || selectedMechanic || isBooked) {
      handleCloseDetail();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(drawer)/(tabs)");
    }
  }, [showDetailModal, selectedMechanic, isBooked, handleCloseDetail, router]);

  const handleCancelPress = useCallback(() => {
    clearRoute();
    setSelectedMechanic(null);
    setShowDetailModal(false);
    setIsBooked(false);
    prevBookedKeyRef.current = undefined;
    prevSearchTriggerRef.current = undefined;

    router.setParams({
      bookedMechanicId: undefined,
      bookedTimestamp: undefined,
      searchTrigger: undefined,
    });

    resetToInitialMap();
  }, [clearRoute, resetToInitialMap, router]);

  // Handle Android hardware back press
  useEffect(() => {
    const onHardwareBack = () => {
      if (showDetailModal || selectedMechanic || isBooked) {
        handleCloseDetail();
        return true;
      }
      return false;
    };

    const backSub = BackHandler.addEventListener("hardwareBackPress", onHardwareBack);
    return () => backSub.remove();
  }, [showDetailModal, selectedMechanic, isBooked, handleCloseDetail]);

  const handleResearch = useCallback(() => {
    setShowDetailModal(false);
    setSelectedMechanic(null);
    setIsBooked(false);
    clearRoute();
    setIsSearching(true);
    refreshLocation();

    if (mapRef.current && userCoords) {
      mapRef.current.animateToRegion(
        {
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        800
      );
    }
  }, [refreshLocation, userCoords, clearRoute]);

  const handleConfirm = useCallback(
    (mechanic: Mechanic) => {
      router.push({
        pathname: "/(drawer)/(tabs)/maintenance/booking",
        params: { mechanicId: mechanic.id },
      });
    },
    [router]
  );

  const handleChat = useCallback(
    (mechanic: Mechanic) => {
      router.push("/(drawer)/messages");
    },
    [router]
  );

  const handleCall = useCallback((mechanic: Mechanic) => {
    callPhoneNumber(mechanic.telephone, mechanic.names || mechanic.fullName);
  }, []);

  const mechanicsToRender = useMemo(() => {
    if (
      selectedMechanic &&
      !nearbyMechanics.some((m) => String(m.id) === String(selectedMechanic.id))
    ) {
      return [...nearbyMechanics, selectedMechanic];
    }
    return nearbyMechanics;
  }, [nearbyMechanics, selectedMechanic]);

  return {
    mapRef,
    userCoords,
    hasPermission,
    refreshLocation,
    route,
    isSearching,
    selectedMechanic,
    showDetailModal,
    isBooked,
    mechanicsToRender,
    handleSearchComplete,
    handleSelectMechanic,
    handleCloseDetail,
    handleCancelPress,
    handleBackPress,
    resetToInitialMap,
    handleResearch,
    handleConfirm,
    handleChat,
    handleCall,
    searchTrigger: params.searchTrigger,
  };
}

