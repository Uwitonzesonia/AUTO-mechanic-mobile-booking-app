import React, {useLayoutEffect} from "react";
import {StyleSheet, View} from "react-native";
import {useNavigation} from "expo-router";
import {LinearBgView} from "@/components/LinearBg";
import BottomCard from "@/components/maintenance/BottomCard";
import {MechanicDetailCard} from "@/components/maintenance/MechanicDetailCard";
import {TransparentHeaderCard} from "@/components/maintenance/TransparentHeaderCard";
import {MaintenanceMapView} from "@/components/maintenance/map/MaintenanceMapView";
import {LocationStateView} from "@/components/maintenance/map/LocationStateView";
import {RatingModal} from "@/components/maintenance/modal/RatingModal";
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
        isArrived,
        isInRepair,
        distanceMeters,
        durationText,
        routeCoordinates,
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
        showRatingModal,
        ratingMechanic,
        handleCloseRatingModal,
        handleOpenRatingModal,
        searchTrigger,
    } = useMaintenanceCoordinator();

    useLayoutEffect(() => {
        navigation.setOptions({header: () => null});
    }, [navigation]);

    return (
        <LinearBgView style={styles.container}>
            {!showRatingModal && (
                <TransparentHeaderCard
                    onBackPress={handleBackPress}
                    onCancelPress={handleCancelPress}
                />
            )}

            {userCoords ? (
                <>
                    <MaintenanceMapView
                        ref={mapRef}
                        userCoords={userCoords}
                        mechanics={showRatingModal ? [] : mechanicsToRender}
                        selectedMechanic={showRatingModal ? null : selectedMechanic}
                        isSearching={showRatingModal ? false : isSearching}
                        showDetailModal={showRatingModal ? false : showDetailModal}
                        isBooked={showRatingModal ? false : isBooked}
                        routeCoordinates={showRatingModal ? [] : routeCoordinates}
                        onSelectMechanic={handleSelectMechanic}
                        hideMarkers={showRatingModal}
                    />

                    {!showRatingModal && (
                        <View style={styles.bottomContainer} pointerEvents="box-none">
                            {showDetailModal && selectedMechanic && (
                                <MechanicDetailCard
                                    mechanic={selectedMechanic}
                                    distance={
                                        isBooked
                                            ? (selectedMechanic.current_location?.distanceKm ?? route?.distanceKm)
                                            : selectedMechanic.current_location?.distanceKm
                                    }
                                    distanceMeters={isBooked ? distanceMeters : undefined}
                                    durationText={isBooked ? durationText : undefined}
                                    isBooked={isBooked}
                                    isArrived={isArrived}
                                    isInRepair={isInRepair}
                                    onResearch={handleResearch}
                                    handleOnBooking={handleConfirm}
                                    onClose={handleCloseDetail}
                                    onChat={handleChat}
                                    onCall={handleCall}
                                    onRate={handleOpenRatingModal}
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
                    )}

                    <RatingModal
                        visible={showRatingModal}
                        mechanic={ratingMechanic}
                        onClose={handleCloseRatingModal}
                        onSubmit={handleCloseRatingModal}
                    />
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
