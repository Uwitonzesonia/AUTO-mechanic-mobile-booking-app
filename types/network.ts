import * as Network from "expo-network";

export interface NetworkContextType {
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
    type: Network.NetworkStateType | null;
    isOnline: boolean;
    isOffline: boolean;
    isChecking: boolean;
    isInitialCheckDone: boolean;
    hasConnectedInitially: boolean;
    checkConnection: () => Promise<boolean>;
}
