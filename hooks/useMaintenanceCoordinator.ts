import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {BackHandler, Image} from "react-native";
import MapView from "react-native-maps";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useUserLocation} from "@/hooks/useUserLocation";
import {useMapboxRoute} from "@/hooks/useMapboxRoute";
import {MOCK_MECHANICS} from "@/constants/mechanics";
import {callPhoneNumber} from "@/utils/phone";
import {formatRealisticDuration, getMechanicAvatarUrl} from "@/components/maintenance/detail/types";
import {useMechanicMovement} from "@/hooks/useMechanicMovement";
import type {Mechanic} from "@/types/mechanic";

export function useMaintenanceCoordinator() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        searchTrigger?: string;
        car?: string;
        location?: string;
        category?: string;
        bookedMechanicId?: string;
        bookedTimestamp?: string;
        fromTab?: string;
        price?: string;
        duration?: string;
        showRatingModal?: string;
        ratingMechanicId?: string;
        ratingMechanicData?: string;
    }>();

    const mapRef = useRef<MapView | null>(null);
    const arrivalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isSearching, setIsSearching] = useState(true);
    const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [isBooked, setIsBooked] = useState(false);
    const [isInRepair, setIsInRepair] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingMechanic, setRatingMechanic] = useState<Mechanic | null>(null);

    const {route, fetchRoute, clearRoute} = useMapboxRoute();
    const {userCoords, nearbyMechanics, hasPermission, refreshLocation} = useUserLocation(5);

    const originCoords = useMemo(() => {
        if (!selectedMechanic) return null;
        const lat = selectedMechanic.current_location?.lat ?? selectedMechanic.location?.lat;
        const lon = selectedMechanic.current_location?.lon ?? selectedMechanic.location?.lon;
        if (lat == null || lon == null) return null;
        return { latitude: lat, longitude: lon };
    }, [selectedMechanic?.id]);

    const {
        currentLocation: movingLocation,
        remainingRoute,
        remainingDistanceMeters,
        remainingDistanceKm,
        remainingDurationText,
        isArrived,
        resetMovement,
    } = useMechanicMovement({
        isBooked,
        route,
        originCoords,
        userCoords,
    });

    const activeMechanic = useMemo(() => {
        if (!selectedMechanic) return null;
        if (!isBooked || !movingLocation) return selectedMechanic;
        return {
            ...selectedMechanic,
            current_location: {
                lat: movingLocation.latitude,
                lon: movingLocation.longitude,
                distanceKm:
                    remainingDistanceKm ??
                    selectedMechanic.current_location?.distanceKm ??
                    0,
            },
        };
    }, [selectedMechanic, isBooked, movingLocation, remainingDistanceKm]);

    // Ensure bottom card is shown when mechanic arrives at 5m, set isInRepair to true, wait 3s then navigate to job screen
    useEffect(() => {
        if (isArrived && isBooked) {
            setShowDetailModal(true);
            setIsInRepair(true);

            if (arrivalTimerRef.current) {
                clearTimeout(arrivalTimerRef.current);
            }

            arrivalTimerRef.current = setTimeout(() => {
                const targetPrice =
                    params.price ||
                    (selectedMechanic
                        ? String((selectedMechanic.flat_fee || 0) + (selectedMechanic.consultation_fee || 0))
                        : "50");

                router.push({
                    pathname: "/(drawer)/(tabs)/maintenance/job",
                    params: {
                        vehicle: params.car || "Toyota RAV4 (2020)",
                        pickupPoint: params.location || "KG 125 St, Kigali, Rwanda",
                        description: params.category || "General Checkup & Engine Diagnostic",
                        duration: params.duration || formatRealisticDuration(),
                        price: targetPrice,
                        mechanicId: selectedMechanic ? String(selectedMechanic.id) : undefined,
                        fromTab: params.fromTab,
                    },
                });
            }, 3000);
        }

        return () => {
            if (arrivalTimerRef.current) {
                clearTimeout(arrivalTimerRef.current);
            }
        };
    }, [
        isArrived,
        isBooked,
        params.car,
        params.location,
        params.category,
        params.price,
        params.duration,
        params.fromTab,
        selectedMechanic,
        router,
    ]);

    const prevSearchTriggerRef = useRef<string | undefined>(params.searchTrigger);
    const prevBookedKeyRef = useRef<string | undefined>(undefined);

    // Handle re-search trigger from Search/Location modals or job decline
    useEffect(() => {
        if (params.searchTrigger && params.searchTrigger !== prevSearchTriggerRef.current) {
            prevSearchTriggerRef.current = params.searchTrigger;
            if (arrivalTimerRef.current) {
                clearTimeout(arrivalTimerRef.current);
                arrivalTimerRef.current = null;
            }
            setIsInRepair(false);
            setIsSearching(true);
            setSelectedMechanic(null);
            setShowDetailModal(false);
            setIsBooked(false);
            prevBookedKeyRef.current = undefined;
            clearRoute();
            resetMovement();
            refreshLocation();

            router.setParams({
                bookedMechanicId: undefined,
                bookedTimestamp: undefined,
                price: undefined,
            });

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
    }, [params.searchTrigger, refreshLocation, userCoords, clearRoute, resetMovement, router]);

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
                        {latitude: userCoords.latitude, longitude: userCoords.longitude},
                        {latitude: mLat, longitude: mLon},
                    ],
                    {
                        edgePadding: {top: 120, right: 60, bottom: 280, left: 60},
                        animated: true,
                    }
                );

                fetchRoute(
                    {latitude: mLat, longitude: mLon},
                    {latitude: userCoords.latitude, longitude: userCoords.longitude}
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
                    {latitude: mLat, longitude: mLon},
                    {latitude: userCoords.latitude, longitude: userCoords.longitude}
                );
            }
        }
    }, [isBooked, selectedMechanic, userCoords, route, fetchRoute]);

    // Adjust camera to fit the full route polyline once loaded
    useEffect(() => {
        if (isBooked && route && route.coordinates.length > 0 && mapRef.current) {
            mapRef.current.fitToCoordinates(route.coordinates, {
                edgePadding: {top: 120, right: 60, bottom: 280, left: 60},
                animated: true,
            });
        }
    }, [isBooked, route]);

    // Handle incoming rating modal params
    useEffect(() => {
        if (params.showRatingModal === "true") {
            setShowRatingModal(true);
            setIsSearching(false);
            setShowDetailModal(false);
            setIsBooked(false);
            setIsInRepair(false);
            clearRoute();
            resetMovement();

            if (arrivalTimerRef.current) {
                clearTimeout(arrivalTimerRef.current);
                arrivalTimerRef.current = null;
            }

            if (params.ratingMechanicData) {
                try {
                    const parsed = JSON.parse(params.ratingMechanicData);
                    if (parsed && typeof parsed === "object") {
                        setRatingMechanic(parsed);
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
                        return;
                    }
                } catch {
                    // Fallback to id matching if parsing fails
                }
            }

            if (params.ratingMechanicId) {
                const found =
                    nearbyMechanics.find((m) => String(m.id) === String(params.ratingMechanicId)) ||
                    MOCK_MECHANICS.find((m) => String(m.id) === String(params.ratingMechanicId));
                setRatingMechanic(found || MOCK_MECHANICS[0]);
            } else if (selectedMechanic) {
                setRatingMechanic(selectedMechanic);
            } else {
                setRatingMechanic(MOCK_MECHANICS[0]);
            }

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
        } else {
            setShowRatingModal(false);
        }
    }, [
        params.showRatingModal,
        params.ratingMechanicId,
        params.ratingMechanicData,
        nearbyMechanics,
        selectedMechanic,
        userCoords,
        clearRoute,
        resetMovement,
    ]);

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
                if (img) Image.prefetch(img).catch(() => {
                });
            });
        }
    }, [nearbyMechanics]);

    const handleSearchComplete = useCallback(() => {
        setIsSearching(false);
        setShowDetailModal(false);
        setSelectedMechanic(null);
        setIsBooked(false);
        clearRoute();
        resetMovement();
    }, [clearRoute, resetMovement]);

    const handleSelectMechanic = useCallback(
        (mechanic: Mechanic) => {
            setSelectedMechanic(mechanic);
            setShowDetailModal(true);
            setIsBooked(false);
            clearRoute();
            resetMovement();

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
        [clearRoute, resetMovement]
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

    const getTargetTabPath = useCallback((tab?: string) => {
        if (tab === "garage") {
            return "/(drawer)/(tabs)/garage" as const;
        }
        if (tab === "wallet") {
            return "/(drawer)/(tabs)/wallet" as const;
        }
        if (tab === "profile") {
            return "/(drawer)/(tabs)/profile" as const;
        }
        return "/(drawer)/(tabs)" as const;
    }, []);

    const handleExitToTabs = useCallback(() => {
        if (arrivalTimerRef.current) {
            clearTimeout(arrivalTimerRef.current);
            arrivalTimerRef.current = null;
        }
        setIsInRepair(false);
        clearRoute();
        resetMovement();
        setSelectedMechanic(null);
        setShowDetailModal(false);
        setIsBooked(false);
        prevBookedKeyRef.current = undefined;
        prevSearchTriggerRef.current = undefined;
        setShowRatingModal(false);
        setRatingMechanic(null);

        router.setParams({
            bookedMechanicId: undefined,
            bookedTimestamp: undefined,
            searchTrigger: undefined,
            fromTab: undefined,
            showRatingModal: undefined,
            ratingMechanicId: undefined,
            ratingMechanicData: undefined,
        });

        if (router.canDismiss()) {
            router.dismissAll();
        }

        const targetPath = getTargetTabPath(params.fromTab);
        router.replace(targetPath);
    }, [clearRoute, resetMovement, router, getTargetTabPath, params.fromTab]);

    const handleOpenRatingModal = useCallback((mechanicToRate: Mechanic) => {
        setRatingMechanic(mechanicToRate);
        setShowRatingModal(true);
        setIsSearching(false);
        setShowDetailModal(false);
        setIsBooked(false);
        setIsInRepair(false);
        clearRoute();
        resetMovement();

        if (arrivalTimerRef.current) {
            clearTimeout(arrivalTimerRef.current);
            arrivalTimerRef.current = null;
        }

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
    }, [clearRoute, resetMovement, userCoords]);

    const handleCloseRatingModal = useCallback(() => {
        setShowRatingModal(false);
        setRatingMechanic(null);
        router.setParams({
            showRatingModal: undefined,
            ratingMechanicId: undefined,
            ratingMechanicData: undefined,
        });
        handleExitToTabs();
    }, [router, handleExitToTabs]);

    const handleCloseDetail = useCallback(() => {
        if (arrivalTimerRef.current) {
            clearTimeout(arrivalTimerRef.current);
            arrivalTimerRef.current = null;
        }
        setIsInRepair(false);
        if (isBooked) {
            handleExitToTabs();
            return;
        }
        setShowDetailModal(false);
        setSelectedMechanic(null);
        clearRoute();
        resetMovement();
        prevBookedKeyRef.current = undefined;
        router.setParams({
            bookedMechanicId: undefined,
            bookedTimestamp: undefined,
        });
        resetToInitialMap();
    }, [isBooked, handleExitToTabs, clearRoute, resetMovement, resetToInitialMap, router]);

    const handleBackPress = useCallback(() => {
        handleExitToTabs();
    }, [handleExitToTabs]);

    const handleCancelPress = useCallback(() => {
        handleExitToTabs();
    }, [handleExitToTabs]);

    // Handle Android hardware back press
    useEffect(() => {
        const onHardwareBack = () => {
            if (isBooked) {
                handleExitToTabs();
                return true;
            }
            if (showDetailModal || selectedMechanic) {
                handleCloseDetail();
                return true;
            }
            handleExitToTabs();
            return true;
        };

        const backSub = BackHandler.addEventListener("hardwareBackPress", onHardwareBack);
        return () => backSub.remove();
    }, [isBooked, showDetailModal, selectedMechanic, handleCloseDetail, handleExitToTabs]);

    const handleResearch = useCallback(() => {
        if (arrivalTimerRef.current) {
            clearTimeout(arrivalTimerRef.current);
            arrivalTimerRef.current = null;
        }
        setIsInRepair(false);
        setShowDetailModal(false);
        setSelectedMechanic(null);
        setIsBooked(false);
        clearRoute();
        resetMovement();
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
    }, [refreshLocation, userCoords, clearRoute, resetMovement]);

    const handleConfirm = useCallback(
        (mechanic: Mechanic) => {
            router.push({
                pathname: "/(drawer)/(tabs)/maintenance/booking",
                params: {
                    mechanicId: mechanic.id,
                    fromTab: params.fromTab,
                    car: params.car,
                    location: params.location,
                    category: params.category,
                },
            });
        },
        [router, params.fromTab, params.car, params.location, params.category]
    );

    const handleChat = useCallback(
        (mechanic: Mechanic) => {
            router.push({
                pathname: "/(drawer)/messages",
                params: {mechanicId: mechanic.id},
            });
        },
        [router]
    );

    const handleCall = useCallback((mechanic: Mechanic) => {
        callPhoneNumber(mechanic.telephone, mechanic.names || mechanic.fullName);
    }, []);

    const mechanicsToRender = useMemo(() => {
        if (!activeMechanic) return nearbyMechanics;
        const exists = nearbyMechanics.some((m) => String(m.id) === String(activeMechanic.id));
        if (exists) {
            return nearbyMechanics.map((m) =>
                String(m.id) === String(activeMechanic.id) ? activeMechanic : m
            );
        }
        return [...nearbyMechanics, activeMechanic];
    }, [nearbyMechanics, activeMechanic]);

    return {
        mapRef,
        userCoords,
        hasPermission,
        refreshLocation,
        route,
        isSearching,
        selectedMechanic: activeMechanic,
        showDetailModal,
        isBooked,
        isArrived,
        isInRepair,
        setIsInRepair,
        distanceMeters: remainingDistanceMeters,
        distanceKm: remainingDistanceKm,
        durationText: remainingDurationText ?? route?.formattedDuration,
        routeCoordinates:
            isBooked && remainingRoute.length > 0 ? remainingRoute : route?.coordinates,
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
        showRatingModal,
        ratingMechanic,
        handleCloseRatingModal,
        handleOpenRatingModal,
        searchTrigger: params.searchTrigger,
    };
}

