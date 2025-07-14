import React from 'react';
import { Link } from 'react-router-dom';

const icons = {
    profile: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" /></svg>
    ),
    park: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
        </svg>
    ),
    history: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 3a9 9 0 1 0 8.95 10.05h-2.02A7 7 0 1 1 12 5a7 7 0 0 1 7 7h-4l5 5 5-5h-4A9 9 0 0 0 13 3zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" /></svg>
    ),
    favorites: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
    ),
    settings: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.007 7.007 0 0 0-1.63-.94l-.36-2.53A.488.488 0 0 0 14 2h-4a.488.488 0 0 0-.5.42l-.36 2.53c-.59.22-1.14.52-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22l-1.92 3.32a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.44.32.68.22l2.39-.96c.49.42 1.04.77 1.63.94l.36 2.53c.05.28.27.48.5.48h4c.23 0 .45-.2.5-.48l.36-2.53c.59-.22 1.14-.52 1.63-.94l2.39.96c.24.1.54.02.68-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" /></svg>
    ),
    help: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm1.07-7.75c-.9.92-1.07 1.24-1.07 2.25h-2v-.5c0-1.1.45-2.1 1.17-2.83.59-.59 1.43-1.17 1.43-2.17 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.3-.84 2.1-1.93 3.25z" /></svg>
    ),
    logout: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8c-1.1 0-2 .9-2 2v4h2V5h8v14h-8v-4h-2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /></svg>
    )
};

const Sidebar = () => {
    const menuItems = [
        { id: 'Park', icon: icons.park, label: 'Park', active: true }
        // { id: 'profile', icon: icons.profile, label: 'Profile', active: false },
        // { id: 'history', icon: icons.history, label: 'History', active: false },
        // { id: 'favorites', icon: icons.favorites, label: 'Favorites', active: false },
        // { id: 'settings', icon: icons.settings, label: 'Settings', active: false },
    ];

    return (
        <div className="sidebar-panel">
            <div className="flex flex-col items-center justify-start h-full space-y-6">

                {/* Navigation Icons */}
                <div className="flex flex-col items-center space-y-4 flex-1 w-full">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`sidebar-item  text-center ${item.active ? 'active' : ''}`}
                            title={item.label}
                        >
                            <div className="text-2xl mb-1">{item.icon}</div>
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Bottom section */}
                {/* <div className="mt-auto flex flex-col items-center  w-full">
                    <Link to="/register" className="sidebar-item w-full text-center">
                        <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                        </svg>
                        <span className="text-xs font-medium">Register</span>
                    </Link>
                </div> */}
            </div>
        </div>
    );
};

export default Sidebar; 