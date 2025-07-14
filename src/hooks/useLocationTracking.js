import { useRef, useCallback } from 'react';

export function useLocationTracking({ userLocation, selectedParking, updateRouteForNewLocation, connectionInfo }) {
    const intervalRef = useRef(null);
    const isTrackingRef = useRef(false);

    // Get optimal update interval based on network speed
    const getUpdateInterval = useCallback(() => {
        if (!connectionInfo) return 15000; // Default 15 seconds
        const { effectiveType, downlink } = connectionInfo;
        if (effectiveType === '4g' && downlink > 10) {
            return 5000;
        } else if (effectiveType === '4g' || effectiveType === '3g') {
            return 10000;
        } else {
            return 20000;
        }
    }, [connectionInfo]);

    const startLocationTracking = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const interval = getUpdateInterval();
        intervalRef.current = setInterval(async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const newLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        if (selectedParking) {
                            await updateRouteForNewLocation(newLocation, selectedParking);
                        }
                    },
                    (error) => {
                        // Optionally handle error
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 10000,
                        timeout: 5000
                    }
                );
            }
        }, interval);
        isTrackingRef.current = true;
    }, [getUpdateInterval, selectedParking, updateRouteForNewLocation]);

    const stopLocationTracking = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        isTrackingRef.current = false;
    }, []);

    return {
        startLocationTracking,
        stopLocationTracking,
        isTrackingAfterBooking: isTrackingRef.current
    };
} 