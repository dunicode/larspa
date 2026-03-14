import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [user, setUser] = useState({ name: 'Usuario' });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown usuario
    const [isNavOpen, setIsNavOpen] = useState(false); // Menú móvil
    const navigate = useNavigate();
    const location = useLocation();

    // Obtenemos el usuario solo para mostrar el nombre en el Navbar
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) return;
            
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
                }
            } catch (error) {
                console.error("No se pudo cargar el usuario en navbar");
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            localStorage.removeItem('auth_token');
            navigate('/');
        }
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
                    <ul className="navbar-nav">
                        
                    </ul>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/home' ? 'active fw-semibold' : ''}`} to="/home" onClick={() => setIsNavOpen(false)}>Home</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" onClick={(e) => { e.preventDefault(); setIsDropdownOpen(!isDropdownOpen); }}>
                                {user.name}
                            </a>
                            <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`} style={{ right: 0, left: 'auto' }}>
                                <li><Link className="dropdown-item" to="/profile" onClick={() => { setIsDropdownOpen(false); setIsNavOpen(false); }}>Ver Perfil</Link></li>
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