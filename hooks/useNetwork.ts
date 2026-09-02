import { useContext } from "react";
import { NetworkContext } from "@/context/network/NetworkContext";
import type { NetworkContextType } from "@/types/network";

export const useNetwork = (): NetworkContextType => {
    const context = useContext(NetworkContext);

    if (!context) {
        throw new Error("useNetwork must be used within a NetworkProvider");
    }

    return context;
};

export default useNetwork;
