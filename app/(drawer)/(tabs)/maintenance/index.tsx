import React, {useLayoutEffect} from "react";
import {StyleSheet, View} from "react-native";
import {useNavigation} from "expo-router";
import {LinearBgView} from "@/components/LinearBg";
import BottomCard from "@/components/maintenance/BottomCard";
import {MechanicDetailCard} from "@/components/maintenance/MechanicDetailCard";
import {TransparentHeaderCard} from "@/components/maintenance/TransparentHeaderCard";
import {MaintenanceMapView} from "@/components/maintenance/map/MaintenanceMapView";
import {LocationStateView} from "@/components/maintenance/map/LocationStateView";
import {useMaintenanceCoordinator} from "@/hooks/useMaintenanceCoordinator";

export default function MaintenanceScreen() {
    const navigation = useNavigation();

    const {
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
        handleResearch,
        handleConfirm,
        handleChat,
        handleCall,
        searchTrigger,
    } = useMaintenanceCoordinator();

    useLayoutEffect(() => {
        navigation.setOptions({header: () => null});
    }, [navigation]);

    return (
        <LinearBgView style={styles.container}>
            <TransparentHeaderCard
                onBackPress={handleBackPress}
                onCancelPress={handleCancelPress}
            />

            {userCoords ? (
                <>
                    <MaintenanceMapView
                        ref={mapRef}
                        userCoords={userCoords}
                        mechanics={mechanicsToRender}
                        selectedMechanic={selectedMechanic}
                        isSearching={isSearching}
                        showDetailModal={showDetailModal}
                        isBooked={isBooked}
                        routeCoordinates={route?.coordinates}
                        onSelectMechanic={handleSelectMechanic}
                    />

                    <View style={styles.bottomContainer} pointerEvents="box-none">
                        {showDetailModal && selectedMechanic && (
                            <MechanicDetailCard
                                mechanic={selectedMechanic}
                                distance={
                                    isBooked
                                        ? (route?.distanceKm ?? selectedMechanic.current_location?.distanceKm)
                                        : selectedMechanic.current_location?.distanceKm
                                }
                                durationText={isBooked ? route?.formattedDuration : undefined}
                                isBooked={isBooked}
                                onResearch={handleResearch}
                                handleOnBooking={handleConfirm}
                                onClose={handleCloseDetail}
                                onChat={handleChat}
                                onCall={handleCall}
                            />
                        )}

                        {!isBooked && (
                            <BottomCard
                                key={searchTrigger || "initial-search"}
                                isSearching={isSearching}
                                onSearchComplete={handleSearchComplete}
                            />
                        )}
                    </View>
                </>
            ) : (
                <LocationStateView
                    hasPermission={hasPermission}
                    onRetryPermission={refreshLocation}
                />
            )}
        </LinearBgView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0e1626",
    },
    bottomContainer: {
        position: "absolute",
        bottom: 8,
        left: 16,
        right: 16,
        gap: 8,
    },
});
