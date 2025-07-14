import React, { useState } from 'react';

const BookingModal = ({ isOpen, onClose, parking, onBookSlot, isLoading }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);

    // Mock data for parking slots (in real app, this would come from API)
    const totalSlots = 8;
    const occupiedSlots = 3;
    const availableSlots = totalSlots - occupiedSlots;

    const generateSlots = () => {
        const slots = [];
        for (let i = 1; i <= totalSlots; i++) {
            const isOccupied = i <= occupiedSlots;
            const isSelected = selectedSlot === i;

            slots.push({
                id: i,
                isOccupied,
                isSelected,
                status: isOccupied ? 'occupied' : isSelected ? 'selected' : 'available'
            });
        }
        return slots;
    };

    const handleSlotClick = (slotId) => {
        if (!generateSlots().find(slot => slot.id === slotId)?.isOccupied) {
            setSelectedSlot(selectedSlot === slotId ? null : slotId);
        }
    };

    const handlePayment = () => {
        if (selectedSlot && !isPaymentLoading && !isLoading) {
            // Show loading in button for 1 second
            setIsPaymentLoading(true);
            setTimeout(() => {
                setIsPaymentLoading(false);
                setShowOtpInput(true);
            }, 1000);
        }
    };

    const handleOtpSubmit = () => {
        if (otpValue === '2312') {
            setOtpError('');
            // Show loading on verify button for 1 second
            setIsPaymentLoading(true);
            setTimeout(() => {
                setIsPaymentLoading(false);
                onBookSlot(parking, selectedSlot);
            }, 1000);
        } else {
            setOtpError('Invalid OTP. Please try again.');
        }
    };

    const getSlotColor = (status) => {
        switch (status) {
            case 'occupied':
                return 'bg-gray-500 cursor-not-allowed';
            case 'selected':
                return 'bg-yellow-400 cursor-pointer border-2 border-yellow-600';
            case 'available':
                return 'bg-green-400 hover:bg-green-500 cursor-pointer';
            default:
                return 'bg-gray-300';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-opacity-10 backdrop-blur-lg"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-black bg-opacity-10 backdrop-blur-2xl border border-yellow-400 border-opacity-30 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
                {/* Header */}
                {!showOtpInput && (
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">{parking?.name}</h2>
                        <p className="text-yellow-400 font-semibold">₹{parking?.basePrice}/hr</p>
                        <div className="mt-2 text-sm text-gray-300">
                            <span className="text-green-400">{availableSlots}</span> slots available out of {totalSlots}
                        </div>
                    </div>
                )}

                {/* Parking Slots Grid */}
                {!showOtpInput && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4 text-center">Select Parking Slot</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {generateSlots().map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() => handleSlotClick(slot.id)}
                                    disabled={slot.isOccupied}
                                    className={`
                    w-16 h-16 rounded-lg font-bold text-lg transition-all duration-200
                    ${getSlotColor(slot.status)}
                    ${slot.isOccupied ? 'opacity-60' : 'hover:scale-105'}
                  `}
                                >
                                    {slot.id}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Payment Method */}
                {!showOtpInput && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Payment Method</h3>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="text-yellow-400 focus:ring-yellow-400"
                                />
                                <span className="text-white">💳 Credit/Debit Card</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="upi"
                                    checked={paymentMethod === 'upi'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="text-yellow-400 focus:ring-yellow-400"
                                />
                                <span className="text-white">📱 UPI</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="wallet"
                                    checked={paymentMethod === 'wallet'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="text-yellow-400 focus:ring-yellow-400"
                                />
                                <span className="text-white">💰 Digital Wallet</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* OTP Input */}
                {showOtpInput && (
                    <div className="mb-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Payment Verification</h2>
                            <p className="text-yellow-400 font-semibold">₹{parking?.basePrice}</p>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-3 text-center">Enter OTP</h3>
                        <div className="text-center mb-4">
                            <p className="text-yellow-400 text-sm mb-2">OTP sent to your mobile</p>
                            {/* <p className="text-white text-xs">Use OTP: <span className="text-yellow-400 font-bold">2312</span></p> */}
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={otpValue}
                                onChange={(e) => setOtpValue(e.target.value)}
                                placeholder="Enter 4-digit OTP"
                                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-xl focus:border-yellow-400 focus:outline-none text-center text-lg tracking-widest"
                                maxLength={4}
                            />
                            {otpError && (
                                <p className="text-red-400 text-sm text-center">{otpError}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading || isPaymentLoading}
                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {(isLoading || isPaymentLoading) ? 'Please wait...' : 'Cancel'}
                    </button>
                    {!showOtpInput ? (
                        <button
                            onClick={handlePayment}
                            disabled={!selectedSlot || isLoading || isPaymentLoading}
                            className="flex-1 px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                        >
                            {isPaymentLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                                    Processing Payment...
                                </div>
                            ) : (
                                `Pay ₹${parking?.basePrice}`
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleOtpSubmit}
                            disabled={!otpValue || otpValue.length !== 4 || isLoading || isPaymentLoading}
                            className="flex-1 px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                        >
                            {isPaymentLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                                    Verifying...
                                </div>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal; 