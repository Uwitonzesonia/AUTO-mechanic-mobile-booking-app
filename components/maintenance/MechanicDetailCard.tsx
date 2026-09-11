import React, {useEffect, useRef} from "react";
import {Animated, StyleSheet} from "react-native";
import {MechanicPreviewCard} from "./detail/MechanicPreviewCard";
import {MechanicArrivingCard} from "./detail/MechanicArrivingCard";
import type {MechanicDetailCardProps} from "./detail/types";

export type {MechanicDetailCardProps};

export const MechanicDetailCard: React.FC<MechanicDetailCardProps> = ({
                                                                          mechanic,
                                                                          distance,
                                                                          distanceMeters,
                                                                          durationText,
                                                                          isBooked = false,
                                                                          isArrived = false,
                                                                          isInRepair = false,
                                                                          onResearch,
                                                                          handleOnBooking,
                                                                          onClose,
                                                                          onChat,
                                                                          onCall,
                                                                          onRate,
                                                                          style,
                                                                      }) => {
    const slideAnim = useRef(new Animated.Value(18)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        slideAnim.setValue(18);
        opacityAnim.setValue(0);

        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 280,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 280,
                useNativeDriver: true,
            }),
        ]).start();
    }, [mechanic.id, slideAnim, opacityAnim]);

    return (
        <Animated.View
            style={[
                isBooked ? styles.wrapperBooked : styles.wrapperPreview,
                {
                    opacity: opacityAnim,
                    transform: [{translateY: slideAnim}],
                },
                style,
            ]}
        >
            {isBooked ? (
                <MechanicArrivingCard
                    mechanic={mechanic}
                    distance={distance}
                    distanceMeters={distanceMeters}
                    durationText={durationText}
                    isArrived={isArrived}
                    isInRepair={isInRepair}
                    onClose={onClose}
                    onChat={onChat}
                    onCall={onCall}
                    onRate={onRate}
                />
            ) : (
                <MechanicPreviewCard
                    mechanic={mechanic}
                    distance={distance}
                    onResearch={onResearch}
                    onConfirm={handleOnBooking}
                    onClose={onClose}
                    onRate={onRate}
                />
            )}
        </Animated.View>
    );
};

export default MechanicDetailCard;

const styles = StyleSheet.create({
    wrapperPreview: {
        borderRadius: 22,
        overflow: "hidden",
        width: "75%",
        alignSelf: "center",
        borderWidth: 1.2,
        borderColor: "rgba(255, 255, 255, 0.35)",
    },
    wrapperBooked: {
        borderRadius: 24,
        overflow: "hidden",
        width: "100%",
        alignSelf: "stretch",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
        backgroundColor: "#141A22",
        shadowColor: "#000000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
    },
});
