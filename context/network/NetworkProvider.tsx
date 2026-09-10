import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as Network from "expo-network";
import { NetworkContext } from "./NetworkContext";
import { NetworkStartupModal } from "@/components/network/NetworkStartupModal";
import { NetworkOfflineBanner } from "@/components/network/NetworkOfflineBanner";
import type { ChildrenProps } from "@/types/general";
import type { NetworkContextType } from "@/types/network";

export const NetworkProvider: React.FC<ChildrenProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
    const [type, setType] = useState<Network.NetworkStateType | null>(null);
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [isInitialCheckDone, setIsInitialCheckDone] = useState<boolean>(false);
    const [hasConnectedInitially, setHasConnectedInitially] = useState<boolean>(false);

    // Compute online status
    // isConnected indicates network interface active
    // isInternetReachable indicates verified internet access
    const isOnline = Boolean(
        isConnected === true && (isInternetReachable === true || isInternetReachable === undefined)
    );
    const isOffline = Boolean(isInitialCheckDone && !isOnline);

    const hasConnectedRef = useRef(hasConnectedInitially);
    useEffect(() => {
        hasConnectedRef.current = hasConnectedInitially;
    }, [hasConnectedInitially]);

    /**
     * Check current network state directly from expo-network
     */
    const checkConnection = useCallback(async (): Promise<boolean> => {
        setIsChecking(true);
        try {
            const state = await Network.getNetworkStateAsync();

            setIsConnected(state.isConnected ?? false);
            setIsInternetReachable(state.isInternetReachable ?? (!!state.isConnected));
            setType(state.type ?? Network.NetworkStateType.UNKNOWN);

            const online = Boolean(
                state.isConnected === true &&
                (state.isInternetReachable === true || state.isInternetReachable === undefined)
            );

            if (online) {
                setHasConnectedInitially(true);
            }

            return online;
        } catch (error) {
            console.warn("Failed to retrieve network state:", error);
            setIsConnected(false);
            setIsInternetReachable(false);
            return false;
        } finally {
            setIsChecking(false);
            setIsInitialCheckDone(true);
        }
    }, []);

    // Initial check and listeners setup
    useEffect(() => {
        let isMounted = true;

        // Perform initial connectivity check on startup
        checkConnection();

        // Subscribe to network state changes
        let subscription: { remove: () => void } | null = null;
        try {
            subscription = Network.addNetworkStateListener((state) => {
                if (!isMounted) return;

                const connected = state.isConnected ?? false;
                const reachable = state.isInternetReachable ?? (connected);
                const currentType = state.type ?? Network.NetworkStateType.UNKNOWN;

                setIsConnected(connected);
                setIsInternetReachable(reachable);
                setType(currentType);

                const online = Boolean(
                    connected && (reachable || reachable === undefined)
                );

                if (online) {
                    setHasConnectedInitially(true);
                }
                setIsInitialCheckDone(true);
            });
        } catch (error) {
            console.warn("Could not attach network state listener:", error);
        }

        // Re-check network whenever app returns to foreground
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === "active") {
                checkConnection();
            }
        };

        const appStateSub = AppState.addEventListener("change", handleAppStateChange);

        return () => {
            isMounted = false;
            if (subscription && typeof subscription.remove === "function") {
                subscription.remove();
            }
            appStateSub.remove();
        };
    }, [checkConnection]);

    // When offline, periodically poll to detect re-connection promptly
    useEffect(() => {
        if (!isInitialCheckDone || isOnline) return;

        const interval = setInterval(() => {
            checkConnection();
        }, 4000);

        return () => clearInterval(interval);
    }, [isInitialCheckDone, isOnline, checkConnection]);

    const contextValue: NetworkContextType = useMemo(
        () => ({
            isConnected,
            isInternetReachable,
            type,
            isOnline,
            isOffline,
            isChecking,
            isInitialCheckDone,
            hasConnectedInitially,
            checkConnection,
        }),
        [
            isConnected,
            isInternetReachable,
            type,
            isOnline,
            isOffline,
            isChecking,
            isInitialCheckDone,
            hasConnectedInitially,
            checkConnection,
        ]
    );

    // Show startup modal if startup check completed and there is no initial connection
    const showStartupModal = !hasConnectedInitially && isInitialCheckDone && !isOnline;

    return (
        <NetworkContext.Provider value={contextValue}>
            {children}

            {/* Modal shown on app startup if offline */}
            <NetworkStartupModal
                visible={showStartupModal}
                isChecking={isChecking}
                onRetry={checkConnection}
            />

            {/* YouTube-style bottom red banner shown if app drops connection while running */}
            <NetworkOfflineBanner
                isOnline={isOnline}
                hasConnectedInitially={hasConnectedInitially}
                isChecking={isChecking}
                onRetry={checkConnection}
            />
        </NetworkContext.Provider>
    );
};

export default NetworkProvider;