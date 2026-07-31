import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown usuario
    const [isNavOpen, setIsNavOpen] = useState(false); // Menú móvil
    const navigate = useNavigate();
    const location = useLocation();

    const isHomeActive = location.pathname === '/home';
    const isProfileActive = location.pathname === '/profile';
    const isChangePasswordActive = location.pathname === '/change-password';
    const isSessions = location.pathname === '/sessions';

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
            <div className="container">
                <Link className="navbar-brand fw-bold text-primary" to="/home">LarSpa</Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse justify-content-between ${isNavOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav"></ul>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link
                                className={`nav-link px-3 py-2 rounded-md ${isHomeActive ? 'active fw-bold text-primary bg-primary-subtle' : 'text-dark'}`}
                                to="/home"
                                onClick={() => setIsNavOpen(false)}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className={`nav-link dropdown-toggle px-3 py-2 rounded-md ${isProfileActive || isChangePasswordActive || isSessions ? 'fw-bold text-primary bg-primary-subtle' : 'text-dark'}`}
                                href="#"
                                role="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsDropdownOpen(!isDropdownOpen);
                                }}
                            >
                                {user?.name || 'Usuario'}
                            </a>
                            <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`} style={{ right: 0, left: 'auto' }}>
                                <li>
                                    <Link
                                        className={`dropdown-item ${isProfileActive ? 'active fw-bold text-white' : ''}`}
                                        to="/profile"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setIsNavOpen(false);
                                        }}
                                    >
                                        Ver Perfil
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar Sesión</button></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}