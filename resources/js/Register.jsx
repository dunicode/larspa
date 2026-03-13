import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Limpiar errores previos

        if (password !== password_confirmation) {
            setErrors({ password_confirmation: ['Las contraseñas no coinciden.'] });
            return;
        }
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                alert('¡Registro exitoso! Ahora serás redirigido para iniciar sesión.');
                navigate('/');
            } else {
                const errorData = await response.json();
                if (errorData && errorData.errors) {
                    setErrors(errorData.errors);
                } else {
                    setErrors({ form: ['Ocurrió un error inesperado.'] });
                }
                console.error('Error de registro:', errorData);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            setErrors({ form: ['No se pudo conectar con el servidor.'] });
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow border-0 p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4 text-success">Crear Cuenta</h2>
                <form onSubmit={handleSubmit} noValidate>
                    {errors.form && <div className="alert alert-danger small p-2">{errors.form[0]}</div>}
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={name} onChange={e => setName(e.target.value)} required />
                        {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={email} onChange={e => setEmail(e.target.value)} required />
                        {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={password} onChange={e => setPassword(e.target.value)} required />
                        {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Confirmar Contraseña</label>
                        <input type="password" className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`} value={password_confirmation} onChange={e => setPasswordConfirmation(e.target.value)} required />
                        {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation[0]}</div>}
                    </div>
                    <button type="submit" className="btn btn-success w-100">Registrarse</button>
                </form>
                <p className="mt-3 text-center text-muted small">
                    ¿Ya tienes cuenta? <Link to="/" className="text-decoration-none">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}