import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setStatus(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/forgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus(data.status);
                setEmail(''); // Limpiar campo
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors({ email: [data.message || 'Ocurrió un error.'] });
                }
            }
        } catch (error) {
            console.error(error);
            setErrors({ email: ['No se pudo conectar con el servidor.'] });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
             {isLoading && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1050 }}>
                    <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div>
                </div>
            )}
            <div className="card shadow border-0 p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4 text-primary">Recuperar Contraseña</h3>
                
                {status && <div className="alert alert-success small">{status}</div>}

                <p className="text-muted small mb-4">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label className="form-label">Email</label>
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={email} onChange={e => setEmail(e.target.value)} required />
                        {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Enviar enlace</button>
                </form>
                <p className="mt-3 text-center text-muted small">
                    <Link to="/" className="text-decoration-none">Volver al Login</Link>
                </p>
            </div>
        </div>
    );
}