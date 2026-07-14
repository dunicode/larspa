import React from 'react';
import Navbar from './Navbar';
import { useAuth } from './AuthProvider';

export default function Layout({ children }) {
    const { isAuthenticated } = useAuth();

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {isAuthenticated && <Navbar />}
            <main className="flex-grow-1">
                {children}
            </main>
        </div>
    );
}
