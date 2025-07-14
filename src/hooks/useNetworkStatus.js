import { useState, useEffect } from 'react';

export function useNetworkStatus() {
    const [connectionInfo, setConnectionInfo] = useState(null);

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

    return connectionInfo;
} 