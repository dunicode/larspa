import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            localStorage.removeItem('auth_token');
            setIsLoading(false);
            navigate('/');
        }
    };

    return (
        <div className="container mt-5">
            {isLoading && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1050 }}>
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Cerrando sesión...</span>
                    </div>
                </div>
            )}
            <div className="card shadow-sm border-0">
                <div className="card-body text-center p-5">
                    <h1 className="display-4 mb-4 text-dark">Bienvenido al Home Page</h1>
                    <p className="lead text-muted mb-4">Has iniciado sesión correctamente en el sistema.</p>
                    <button onClick={handleLogout} className="btn btn-outline-danger px-4" disabled={isLoading}>
                        {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
}