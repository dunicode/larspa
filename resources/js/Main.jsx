import React from 'react';
import { Link } from 'react-router-dom';

export default function Main() {
    return (
        <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 py-5">
            <div className="text-center px-3" style={{ maxWidth: '800px' }}>
                <div className="mb-4">
                    <span className="badge bg-light text-primary border border-primary px-3 py-2 rounded-pill fs-6 fw-semibold">
                        ¡Bienvenido a LarSpa!
                    </span>
                </div>
                <h1 className="display-3 fw-bold text-dark mb-3">
                    Una Experiencia Single Page Application Increíble
                </h1>
                <p className="lead text-muted mb-5">
                    Descubre una plataforma moderna, fluida y segura construida con Laravel y React. Gestiona tu perfil, controla tus accesos y disfruta de una interfaz intuitiva y responsiva.
                </p>
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                    <Link to="/login" className="btn btn-primary btn-lg px-4 py-3 shadow-sm fw-semibold">
                        Iniciar Sesión
                    </Link>
                    <Link to="/register" className="btn btn-outline-secondary btn-lg px-4 py-3 fw-semibold">
                        Crear una Cuenta
                    </Link>
                </div>
            </div>
            
            <div className="row mt-5 w-100 text-center" style={{ maxWidth: '960px' }}>
                <div className="col-md-4 mb-4">
                    <div className="card h-100 border-0 shadow-sm p-3">
                        <div className="card-body">
                            <div className="text-primary mb-3">
                                <i className="bi bi-shield-lock fs-1"></i>
                            </div>
                            <h5 className="fw-bold">Autenticación Segura</h5>
                            <p className="text-muted small mb-0">Protección completa de rutas y gestión segura de tokens de acceso para tus datos.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100 border-0 shadow-sm p-3">
                        <div className="card-body">
                            <div className="text-primary mb-3">
                                <i className="bi bi-lightning-charge fs-1"></i>
                            </div>
                            <h5 className="fw-bold">Rendimiento SPA</h5>
                            <p className="text-muted small mb-0">Navegación instantánea sin recargas de página, gracias a React Router 7.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100 border-0 shadow-sm p-3">
                        <div className="card-body">
                            <div className="text-primary mb-3">
                                <i className="bi bi-window fs-1"></i>
                            </div>
                            <h5 className="fw-bold">Diseño Responsivo</h5>
                            <p className="text-muted small mb-0">Interfaz optimizada para dispositivos móviles, tablets y ordenadores de escritorio.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
