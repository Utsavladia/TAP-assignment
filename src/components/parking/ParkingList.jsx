import React from 'react';
import ParkingCard from './ParkingCard';

const ParkingList = ({ parkings, onBook, onSelect, selectedParking, userLocation }) => {
    return (
        <div className="w-full h-full">
            {parkings.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    <p>No parking spots found nearby</p>
                    <p className="text-sm mt-2">Try adjusting your location or search area</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {parkings.map((parking) => (
                        <div key={parking.id} className="rounded-lg">
                            <ParkingCard
                                parking={parking}
                                onBook={onBook}
                                onSelect={onSelect}
                                isSelected={selectedParking?.id === parking.id}
                                userLocation={userLocation}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParkingList; 