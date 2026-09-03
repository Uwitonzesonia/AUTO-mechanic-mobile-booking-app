export interface MechanicLocation {
    lat?: number;
    lon?: number;
    latitude?: number;
    longitude?: number;
    address?: string;
    distanceKm?: number;
}

export interface Mechanic {
    id: string | number;
    names?: string;
    fullName?: string;
    profileImage?: string;
    expertise?: string[];
    years_experience?: number;
    rating?: number;
    ratings?: number;
    total_services?: number;
    is_online?: boolean;
    current_location?: MechanicLocation;
    location?: MechanicLocation;
    flat_fee?: number;
    consultation_fee?: number;
    updated_at?: string | Date;
}
