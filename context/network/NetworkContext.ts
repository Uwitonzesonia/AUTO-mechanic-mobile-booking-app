import { createContext } from "react";
import type { NetworkContextType } from "@/types/network";

export const NetworkContext = createContext<NetworkContextType | undefined>(undefined);
