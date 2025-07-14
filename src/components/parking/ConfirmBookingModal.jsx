import React from 'react';

const ConfirmBookingModal = ({ parking, onConfirm, onCancel, userLocation }) => {
    if (!parking) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
                onClick={onCancel}
            ></div>
            {/* Modal */}
            <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-yellow-400">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Confirm Booking</h2>
                <div className="flex flex-col items-center mb-4">
                    <img src={parking.image} alt={parking.name} className="w-32 h-32 object-cover rounded-lg mb-2 shadow" />
                    <h3 className="text-xl font-semibold text-yellow-700 mb-1">{parking.name}</h3>
                    <div className="text-gray-700 mb-1">{parking.address}</div>
                    <div className="flex gap-4 text-gray-600 text-sm mb-2">
                        <span>Rating: <span className="font-bold text-yellow-500">{parking.rating}</span></span>
                        <span>Distance: <span className="font-bold">{userLocation ? `${(Math.round((Math.sqrt((userLocation.lat - parking.lat) ** 2 + (userLocation.lng - parking.lng) ** 2) * 111) * 10) / 10)} km` : 'N/A'}</span></span>
                    </div>
                    <div className="text-lg font-bold text-yellow-600 mb-2">₹{parking.basePrice} / hr</div>
                </div>
                <div className="flex gap-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmBookingModal; 