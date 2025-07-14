import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MapView from './components/MapView';
import ParkingList from './components/ParkingList';
import Sidebar from './components/Sidebar';
import BookingModal from './components/BookingModal';
import Register from './components/Register';
import parkingData from './data/parkings.json';
import './App.css';

function MainApp() {
  const [userLocation, setUserLocation] = useState(null);
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showParkingInterface, setShowParkingInterface] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedParkingForBooking, setSelectedParkingForBooking] = useState(null);
  const [showParkingSide, setShowParkingSide] = useState(true);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isInitialMap, setIsInitialMap] = useState(true);
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [locationWatchId, setLocationWatchId] = useState(null);
  const [isRouteUpdating, setIsRouteUpdating] = useState(false);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);
  const [isTrackingAfterBooking, setIsTrackingAfterBooking] = useState(false);
  const [bookedParking, setBookedParking] = useState(null);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Monitor network connection
  useEffect(() => {
    if (navigator.connection) {
      const updateConnectionInfo = () => {
        setConnectionInfo({
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
          saveData: navigator.connection.saveData
        });
      };

      navigator.connection.addEventListener('change', updateConnectionInfo);
      updateConnectionInfo();

      return () => {
        navigator.connection.removeEventListener('change', updateConnectionInfo);
      };
    }
  }, []);

  // Check if connection is slow or offline
  const isSlowConnection = () => {
    if (!navigator.onLine) return true;
    if (navigator.connection) {
      return navigator.connection.effectiveType === 'slow-2g' ||
        navigator.connection.effectiveType === '2g' ||
        navigator.connection.downlink < 1;
    }
    return false;
  };

  const createRoute = async (parking) => {
    if (!userLocation) {
      setError('User location not available');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use different routing strategies based on connection
      let routeUrl;
      if (navigator.connection && navigator.connection.effectiveType === '4g' && navigator.connection.downlink > 10) {
        // High-quality routing for fast connections
        routeUrl = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${parking.lng},${parking.lat}?overview=full&geometries=geojson&annotations=true`;
      } else {
        // Simplified routing for slower connections
        routeUrl = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${parking.lng},${parking.lat}?overview=simplified&geometries=geojson`;
      }

      const response = await fetch(routeUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const routeResponse = await response.json();

      if (routeResponse.routes && routeResponse.routes.length > 0) {
        const route = routeResponse.routes[0];
        const routeData = {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: route.geometry,
            properties: {
              distance: (route.distance / 1000).toFixed(1), // Convert meters to km
              duration: Math.round(route.duration / 60) // Convert seconds to minutes
            }
          }]
        };

        setRouteData(routeData);
        setSelectedParking(parking);
      } else {
        throw new Error('No route found');
      }
    } catch (error) {
      console.error('Route creation error:', error);
      setError('Failed to create route. Please try again.');

      // Fallback to simple route if OSRM fails
      const routeCoordinates = generateRouteCoordinates(
        userLocation.lat, userLocation.lng,
        parking.lat, parking.lng
      );

      const fallbackRouteData = {
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: routeCoordinates.map(coord => [coord[1], coord[0]])
          },
          properties: {
            distance: calculateDistance(userLocation.lat, userLocation.lng, parking.lat, parking.lng),
            duration: Math.round(calculateDistance(userLocation.lat, userLocation.lng, parking.lat, parking.lng) * 2)
          }
        }]
      };

      setRouteData(fallbackRouteData);
      setSelectedParking(parking);
    } finally {
      setIsLoading(false);
    }
  };

  // Update route when user location changes significantly
  const updateRouteForNewLocation = async (newLocation, parking) => {
    if (!newLocation || !parking) return;

    try {
      setIsRouteUpdating(true);

      // Use different routing strategies based on connection
      let routeUrl;
      if (navigator.connection && navigator.connection.effectiveType === '4g' && navigator.connection.downlink > 10) {
        // High-quality routing for fast connections
        routeUrl = `https://router.project-osrm.org/route/v1/driving/${newLocation.lng},${newLocation.lat};${parking.lng},${parking.lat}?overview=full&geometries=geojson&annotations=true`;
      } else {
        // Simplified routing for slower connections
        routeUrl = `https://router.project-osrm.org/route/v1/driving/${newLocation.lng},${newLocation.lat};${parking.lng},${parking.lat}?overview=simplified&geometries=geojson`;
      }

      const response = await fetch(routeUrl);

      if (!response.ok) {
        throw new Error('Failed to update route');
      }

      const routeResponse = await response.json();

      if (routeResponse.routes && routeResponse.routes.length > 0) {
        const route = routeResponse.routes[0];
        const updatedRouteData = {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: route.geometry,
            properties: {
              distance: (route.distance / 1000).toFixed(1), // Convert meters to km
              duration: Math.round(route.duration / 60) // Convert seconds to minutes
            }
          }]
        };

        setRouteData(updatedRouteData);
      }
    } catch (error) {
      console.error('Route update error:', error);
      // Don't show error for background route updates
    } finally {
      setIsRouteUpdating(false);
    }
  };

  // Calculate distance between two points using Haversine formula (fallback)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Generate route coordinates with some waypoints for fallback
  const generateRouteCoordinates = (startLat, startLng, endLat, endLng) => {
    const coordinates = [];
    const steps = 20;

    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const lat = startLat + (endLat - startLat) * ratio;
      const lng = startLng + (endLng - startLng) * ratio;

      const variation = Math.sin(ratio * Math.PI) * 0.001;
      coordinates.push([lat + variation, lng + variation]);
    }

    return coordinates;
  };

  const handleFindParking = () => {
    setIsLoading(true);
    setError(null);
    // Only set isInitialMap to false if userLocation is available
    if (userLocation) {
      setIsInitialMap(false);
    } else {
      // Wait for userLocation to be set, then set isInitialMap to false
      const interval = setInterval(() => {
        if (userLocation) {
          setIsInitialMap(false);
          clearInterval(interval);
        }
      }, 100);
    }
    // Simulate API call delay
    setTimeout(() => {
      setParkings(parkingData);
      setIsLoading(false);
      setShowParkingInterface(true);
    }, 1000);
  };

  const handleBookParking = (parking) => {
    // Direct booking without modal
    console.log(`Booking parking: ${parking.name}`);

    // Set the booked parking
    setBookedParking(parking);

    // Show success toast
    setShowSuccessToast(true);

    // Create route immediately
    createRoute(parking);

    // Start location tracking after a short delay
    setTimeout(() => {
      startLocationTracking();
    }, 1000);

    // Hide parking interface to show full map
    setTimeout(() => {
      setShowParkingSide(false);
    }, 2000);

    // Hide success toast after 3 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  const handleParkingSelect = (parking) => {
    createRoute(parking);
  };

  const handleBookSlot = (parking, slotNumber) => {
    // Here you would typically make an API call to book the slot
    console.log(`Booking slot ${slotNumber} for parking: ${parking.name}`);

    // Show success toast
    setShowSuccessToast(true);

    // Create route after booking
    createRoute(parking);

    // Start location tracking after booking
    setTimeout(() => {
      startLocationTracking();
    }, 1000); // Start tracking 1 second after booking

    // Keep modal open for 1 second with loading state (reduced from 2 seconds)
    setTimeout(() => {
      // Close modal and reset loading state
      setShowBookingModal(false);
      setSelectedParkingForBooking(null);
      setIsBookingLoading(false);

      // Small delay before hiding parking interface to ensure modal is closed
      setTimeout(() => {
        // Hide parking interface and show full map
        setShowParkingSide(false);
      }, 100);
    }, 1000);

    // Hide success toast after 3 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  // Get optimal update interval based on network speed
  const getUpdateInterval = () => {
    if (!navigator.connection) return 15000; // Default 15 seconds

    const { effectiveType, downlink } = navigator.connection;

    if (effectiveType === '4g' && downlink > 10) {
      return 5000; // 5 seconds for fast connections
    } else if (effectiveType === '4g' || effectiveType === '3g') {
      return 10000; // 10 seconds for medium connections
    } else {
      return 20000; // 20 seconds for slow connections
    }
  };

  // Start location tracking after booking
  const startLocationTracking = () => {
    if (locationUpdateInterval) {
      clearInterval(locationUpdateInterval);
    }

    const interval = getUpdateInterval();
    console.log(`Starting location tracking with ${interval / 1000}s intervals (${connectionInfo?.effectiveType || 'unknown'} connection)`);

    const updateInterval = setInterval(async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            setUserLocation(newLocation);

            // Update route if parking is selected
            if (selectedParking) {
              await updateRouteForNewLocation(newLocation, selectedParking);
            }
          },
          (error) => {
            console.error('Location update error:', error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 10000, // 10 seconds
            timeout: 5000 // 5 seconds
          }
        );
      }
    }, interval);

    setLocationUpdateInterval(updateInterval);
    setIsTrackingAfterBooking(true);
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    if (locationUpdateInterval) {
      clearInterval(locationUpdateInterval);
      setLocationUpdateInterval(null);
    }
    setIsTrackingAfterBooking(false);
    console.log('Stopped location tracking');
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
      }
    };
  }, [locationUpdateInterval]);

  return (
    <div className="h-full w-full flex items-center justify-start relative">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-panel">
        {/* Left: Map with yellow glow */}
        <div className={`${!showParkingInterface ? 'w-full' : 'flex-1'} map-panel`}>
          <MapView
            userLocation={userLocation}
            parkings={parkings}
            selectedParking={selectedParking}
            routeData={routeData}
            onParkingSelect={handleParkingSelect}
            showParkingSide={showParkingSide}
            isInitialMap={isInitialMap}
          />
        </div>

        {/* Right: Parking cards in yellow glass */}
        {showParkingSide && (
          <div className="right-panel">
            {!showParkingInterface ? (
              // Show only the button in the right panel
              <div className="flex items-center justify-center">
                <button
                  onClick={handleFindParking}
                  disabled={isLoading}
                  style={{
                    boxShadow: '0 0 40px 16px rgba(255,224,102,0.2)'
                  }}
                  className="bg-yellow-400 border border-black text-gray-900 px-8 py-4 rounded-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? 'Finding Parking...' : 'Find Parking'}
                </button>
              </div>
            ) : (
              // Show the parking interface in the right panel
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">Parkings Nearby</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ParkingList
                    parkings={parkings}
                    onBook={handleBookParking}
                    onSelect={handleParkingSelect}
                    selectedParking={selectedParking}
                    userLocation={userLocation}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedParkingForBooking(null);
          setIsBookingLoading(false);
        }}
        parking={selectedParkingForBooking}
        onBookSlot={handleBookSlot}
        isLoading={isBookingLoading}
      />

      {/* Success Toast */}
      {showSuccessToast && bookedParking && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold flex items-center space-x-2">
            <span className="text-xl">✅</span>
            <span>Booked: {bookedParking.name}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {
        error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold">
              {error}
            </div>
          </div>
        )
      }
    </div >
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;

