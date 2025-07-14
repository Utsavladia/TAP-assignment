import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import carIcon from '../../assets/car.svg';
import parkingIcon from '../../assets/parking.png';
import 'leaflet/dist/leaflet.css';
import { calculateDistance } from '../../utils/distance';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom car icon for user location using car.svg, rotated 90 degrees
const createCarIcon = () => {
    return L.divIcon({
        className: 'custom-car-marker',
        html: `<div style="transform: rotate(270deg); width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
            <img src='${carIcon}' width='40' height='40' style='display:block;' />
        </div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24],
    });
};

// Custom parking icon using parking.png
const createParkingIcon = () => {
    return L.divIcon({
        className: 'custom-parking-marker',
        html: `
            <div style="
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s ease;
            ">
                <img src='${parkingIcon}' width='32' height='32' style='display:block; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));' />
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

// Component to update map center and zoom when route changes
const MapUpdater = ({ userLocation, selectedParking, routeData, showParkingSide, isInitialMap }) => {
    const map = useMap();

    useEffect(() => {
        if (isInitialMap) return; // Do not override initial view
        if (userLocation && selectedParking) {
            // Calculate distance to determine zoom level
            const distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                selectedParking.lat, selectedParking.lng
            );

            // Dynamic zoom based on distance and whether parking side is shown
            let zoomLevel;
            if (!showParkingSide) {
                // When parking side is hidden, zoom to maximum and center on car
                zoomLevel = 21; // Maximum zoom level
                // Center on user location (car) instead of fitting bounds
                map.setView([userLocation.lat, userLocation.lng], zoomLevel, {
                    animate: true,
                    duration: 6,
                    easeLinearity: 0.1
                });
                setTimeout(() => {
                    map.invalidateSize();
                }, 700);
                return; // Exit early to prevent bounds fitting
            } else {
                // Normal zoom when parking side is visible
                if (distance < 1) {
                    zoomLevel = 16; // Very close - street level
                } else if (distance < 5) {
                    zoomLevel = 14; // Close - neighborhood level
                } else if (distance < 20) {
                    zoomLevel = 12; // Medium - city level
                } else {
                    zoomLevel = 10; // Far - regional level
                }
            }

            // Only fit bounds if parking side is visible
            if (showParkingSide) {
                // Create bounds to include both user location and parking
                const bounds = L.latLngBounds([
                    [userLocation.lat, userLocation.lng],
                    [selectedParking.lat, selectedParking.lng]
                ]);

                // Add padding to bounds for better visibility
                bounds.pad(0.1);

                // Fit map to show both points with calculated zoom
                map.fitBounds(bounds, {
                    maxZoom: zoomLevel,
                    animate: true,
                    duration: 3,
                    easeLinearity: 0.1
                });
            }
        } else if (userLocation) {
            // If no parking selected, just center on user location
            const zoom = showParkingSide ? 16 : 21;
            map.setView([userLocation.lat, userLocation.lng], zoom, {
                animate: true,
                duration: 3,
                easeLinearity: 0.1
            });
        }
    }, [userLocation, selectedParking, routeData, showParkingSide, map, isInitialMap]);

    return null;
};

const MapView = ({ userLocation, parkings, selectedParking, routeData, onParkingSelect, showParkingSide, isInitialMap }) => {
    // Default: India center
    const indiaCenter = [22.5937, 78.9629];
    const defaultCenter = [28.6139, 77.2090]; // Delhi coordinates
    let center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;
    let initialZoom = 16;
    if (isInitialMap) {
        center = indiaCenter;
        initialZoom = 5;
    }

    // Ref to track previous isInitialMap
    const prevIsInitialMap = useRef(isInitialMap);

    // Smooth flyTo animation when isInitialMap changes from true to false
    const mapRef = useRef();
    useEffect(() => {
        if (prevIsInitialMap.current && !isInitialMap && userLocation && mapRef.current) {
            mapRef.current.flyTo([userLocation.lat, userLocation.lng], 16, {
                animate: true,
                duration: 2.5,
                easeLinearity: 0.1
            });
        }
        prevIsInitialMap.current = isInitialMap;
    }, [isInitialMap, userLocation]);

    // Extract route coordinates from API response
    const getRouteCoordinates = () => {
        if (!routeData || !routeData.features || routeData.features.length === 0) {
            return null;
        }

        const coordinates = routeData.features[0].geometry.coordinates;
        return coordinates.map(coord => [coord[1], coord[0]]); // Convert [lng, lat] to [lat, lng]
    };

    const routePositions = getRouteCoordinates();

    return (
        <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
            <MapContainer
                center={center}
                zoom={initialZoom}
                style={{ height: '100%', width: '100%', minHeight: '500px' }}
                className="rounded-l-[2.5rem]"
                whenCreated={mapInstance => { mapRef.current = mapInstance; }}
            >
                {/* CartoDB Dark Matter (dark_all) map tiles for true dark theme */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Map updater to center and zoom based on route */}
                <MapUpdater
                    userLocation={userLocation}
                    selectedParking={selectedParking}
                    routeData={routeData}
                    showParkingSide={showParkingSide}
                    isInitialMap={isInitialMap}
                />

                {/* Actual route line from API */}
                {routePositions && (
                    <Polyline
                        positions={routePositions}
                        pathOptions={{
                            color: '#00f0ff',
                            weight: 6,
                            opacity: 0.95,
                            dashArray: '8, 12',
                            lineCap: 'round',
                            shadowBlur: 10
                        }}
                    />
                )}

                {/* User location marker with car.svg icon */}
                {userLocation && (
                    <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={createCarIcon()}
                    >
                        <Popup>
                            <div className="text-center">
                                <strong>Your Location</strong>
                                <br />
                                <span className="text-sm text-cyan-200">🚗 You are here</span>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Parking markers with parking.png icon */}
                {parkings.map((parking) => (
                    <Marker
                        key={parking.id}
                        position={[parking.lat, parking.lng]}
                        icon={createParkingIcon()}
                        eventHandlers={{
                            click: () => onParkingSelect(parking),
                        }}
                    >
                        <Popup>
                            <div className="text-center">
                                <strong>{parking.name}</strong>
                                <br />
                                <span className="text-sm font-bold text-orange-500">
                                    ₹{parking.basePrice} /hr
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView; 