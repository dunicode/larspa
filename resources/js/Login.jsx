import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Redirect to home if already logged in (optional UX improvement)
    useEffect(() => {
        if (localStorage.getItem('auth_token')) {
            navigate('/home');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password, device_name: 'web'})
            });

            if (response.ok) {
                const data = await response.json();
                // Asumiendo que la API devuelve una propiedad 'token'
                localStorage.setItem('auth_token', data.token);
                navigate('/home');
            } else {
                const errorData = await response.json();
                if (errorData && errorData.errors) {
                    setErrors(errorData.errors);
                } else {
                    // Para errores generales como "Credenciales incorrectas"
                    setErrors({ form: [errorData.message || 'Credenciales incorrectas.'] });
                }
                console.error('Error de autenticación:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrors({ form: ['No se pudo conectar con el servidor.'] });
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow border-0 p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4 text-primary">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} noValidate>
                    {errors.form && <div className="alert alert-danger small p-2">{errors.form[0]}</div>}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={email} onChange={e => setEmail(e.target.value)} required />
                        {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={password} onChange={e => setPassword(e.target.value)} required />
                        {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Entrar</button>
                </form>
                <p className="mt-3 text-center text-muted small">
                    ¿No tienes cuenta? <Link to="/register" className="text-decoration-none">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
}