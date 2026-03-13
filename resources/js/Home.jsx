import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0">
                <div className="card-body text-center p-5">
                    <h1 className="display-4 mb-4 text-dark">Bienvenido al Home Page</h1>
                    <p className="lead text-muted mb-4">Has iniciado sesión correctamente en el sistema.</p>
                    <button onClick={handleLogout} className="btn btn-outline-danger px-4">Cerrar Sesión</button>
                </div>
            </div>
        </div>
    );
}