import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const emailFromQuery = searchParams.get('email');
        if (emailFromQuery) {
            setEmail(emailFromQuery);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setStatus(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ token, email, password, password_confirmation }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus(data.status + ' Serás redirigido al login.');
                setTimeout(() => navigate('/'), 4000);
            } else {
                setErrors(data.errors || { form: [data.message || 'Ocurrió un error.'] });
            }
        } catch (error) {
            setErrors({ form: ['No se pudo conectar con el servidor.'] });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
            {isLoading && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1050 }}>
                    <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div>
                </div>
            )}
            <div className="card shadow border-0 p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4 text-primary">Restablecer Contraseña</h3>
                {status && <div className="alert alert-success small">{status}</div>}
                <form onSubmit={handleSubmit} noValidate>
                    {errors.form && <div className="alert alert-danger small p-2">{errors.form[0]}</div>}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={email} onChange={e => setEmail(e.target.value)} required readOnly />
                        {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nueva Contraseña</label>
                        <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={password} onChange={e => setPassword(e.target.value)} required />
                        {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Confirmar Nueva Contraseña</label>
                        <input type="password" className="form-control" value={password_confirmation} onChange={e => setPasswordConfirmation(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={!!status}>Restablecer</button>
                </form>
            </div>
        </div>
    );
}