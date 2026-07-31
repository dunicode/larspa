import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function ChangePassword() {
    const { token, updateToken } = useAuth();

    const [current_password, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setStatus(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ current_password, password, password_confirmation }),
            });

            const data = await response.json();

            if (response.ok) {
                const successMessage = 'Contraseña actualizada correctamente.';
                setStatus(successMessage);
                setCurrentPassword('');
                setPassword('');
                setPasswordConfirmation('');

                if (data.access_token) {
                    updateToken(data.access_token);
                }
            } else {
                const serverErrors = data.errors || {};
                if (serverErrors.form) {
                    setErrors(serverErrors);
                } else if (serverErrors.current_password || serverErrors.password || serverErrors.password_confirmation) {
                    setErrors(serverErrors);
                } else {
                    setErrors({ form: [data.message || 'Ocurrió un error al cambiar la contraseña.'] });
                }
            }
        } catch (error) {
            setErrors({ form: ['No se pudo conectar con el servidor.'] });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-70 py-5">
            {isLoading && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1050 }}>
                    <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div>
                </div>
            )}
            <div className="card shadow border-0 p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4 text-primary">Cambiar Contraseña</h3>
                {status && <div className="alert alert-success py-2 mb-3" role="alert">{status}</div>}
                <form onSubmit={handleSubmit} noValidate>
                    {errors.form && <div className="alert alert-danger small p-2">{errors.form[0]}</div>}
                    <div className="mb-3">
                        <label className="form-label">Contraseña Actual</label>
                        <input type="password" className={`form-control ${errors.current_password ? 'is-invalid' : ''}`} value={current_password} onChange={e => setCurrentPassword(e.target.value)} required />
                        {errors.current_password && <div className="invalid-feedback">{errors.current_password[0]}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nueva Contraseña</label>
                        <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={password} onChange={e => setPassword(e.target.value)} required />
                        {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Confirmar Nueva Contraseña</label>
                        <input type="password" className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`} value={password_confirmation} onChange={e => setPasswordConfirmation(e.target.value)} required />
                        {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation[0]}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>Restablecer</button>
                </form>
            </div>
        </div>
    );
}