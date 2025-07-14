import React, { useRef, useEffect, useState } from 'react';
import { calculateDistance } from '../../utils/distance';
import ConfirmBookingModal from './ConfirmBookingModal';

const ParkingCard = ({ parking, onBook, onSelect, isSelected, userLocation }) => {
    // Use user's actual location if available, otherwise fallback to default
    const userLat = userLocation ? userLocation.lat : 28.6139;
    const userLng = userLocation ? userLocation.lng : 77.2090;
    const distance = calculateDistance(userLat, userLng, parking.lat, parking.lng);

    const handleCardClick = (e) => {
        // Prevent triggering when clicking the button
        if (e.target.tagName === 'BUTTON') {
            return;
        }
        // Show route when card is clicked (like map markers)
        onSelect(parking);
    };

    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef();
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const observer = new window.IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className={`rounded-xl p-4 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-md cursor-pointer ${isSelected
                ? 'ring-2 ring-yellow-400 bg-yellow-200/30 border-2 border-yellow-300 backdrop-blur-lg'
                : 'bg-yellow-100/20 hover:bg-yellow-200/30 border border-yellow-200/50 hover:border-yellow-300 backdrop-blur-md'
                }`}
            onClick={handleCardClick}
        >
            {/* Lazy loaded image at the top */}
            <div className="w-full flex justify-center mb-3">
                {isVisible ? (
                    <img
                        src={parking.image}
                        alt={parking.name}
                        className="w-full h-48 object-cover rounded-lg shadow-md bg-white"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse" />
                )}
            </div>
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white drop-shadow-md">{parking.name}</h3>
                <div className="flex items-center  backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="ml-1 text-sm font-semibold text-yellow-400">{parking.rating}</span>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-white font-medium drop-shadow-md">Distance:</span>
                    <span className="text-lg font-bold text-yellow-200 drop-shadow-md">{distance} km</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-white font-medium drop-shadow-md">Price per hour:</span>
                    <span className="text-lg font-bold text-yellow-200 drop-shadow-md">₹{parking.pricePerKm}</span>
                </div>
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                className="w-full bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 backdrop-blur-sm text-gray-900 py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:scale-105 drop-shadow-sm"
            >
                Book Now
            </button>
            {showConfirm && (
                <ConfirmBookingModal
                    parking={parking}
                    onConfirm={() => { setShowConfirm(false); onBook(parking); }}
                    onCancel={() => setShowConfirm(false)}
                    userLocation={userLocation}
                />
            )}
        </div>
    );
};

export default ParkingCard; 