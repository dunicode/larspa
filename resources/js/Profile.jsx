import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await fetch('/api/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    // Si falla el token (ej. expirado), mandamos al login
                    localStorage.removeItem('auth_token');
                    navigate('/');
                }
            } catch (error) {
                console.error(error);
                localStorage.removeItem('auth_token');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1050 }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando perfil...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card shadow border-0 mx-auto" style={{ maxWidth: '600px' }}>
                <div className="card-header bg-white border-0 pt-4 pb-0">
                    <h2 className="text-center text-primary">Mi Perfil</h2>
                </div>
                <div className="card-body p-4">
                    {user && (
                        <>
                            <div className="mb-3">
                                <label className="fw-bold text-muted small">NOMBRE</label>
                                <p className="fs-5">{user.name}</p>
                            </div>
                            <div className="mb-3">
                                <label className="fw-bold text-muted small">CORREO ELECTRÓNICO</label>
                                <p className="fs-5">{user.email}</p>
                            </div>
                            <div className="mb-3">
                                <label className="fw-bold text-muted small">ID DE USUARIO</label>
                                <p className="fs-5">#{user.id}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}