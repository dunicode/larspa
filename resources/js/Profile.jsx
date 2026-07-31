import React from 'react';
import { useAuth } from './AuthProvider';

export default function Profile() {
    const { user, isLoading } = useAuth();

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
                <div className="card-body p-4 text-center">
                    {user && (
                        <>
                            <div className="mb-4">
                                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="mb-0">{user.name}</h3>
                                <span className="badge bg-light text-primary border border-primary mt-2">Cuenta verificada</span>
                            </div>
                            <hr className="my-4 opacity-25" />
                            <div className="row text-start">
                                <div className="col-12 mb-3">
                                    <label className="fw-bold text-muted small d-block mb-1">ID DE USUARIO</label>
                                    <div className="p-2 bg-light rounded border">
                                        <i className="bi bi-hash me-2 text-primary"></i>{user.id}
                                    </div>
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="fw-bold text-muted small d-block mb-1">CORREO ELECTRÓNICO</label>
                                    <div className="p-2 bg-light rounded border">
                                        <i className="bi bi-envelope me-2 text-primary"></i>{user.email}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}