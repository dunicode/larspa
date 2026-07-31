import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function Sessions() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSessions = async () => {
        setIsLoading(true);
        setStatus(null);
        setErrors(null);

        try {
            const response = await fetch('/api/auth/sessions', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setSessions(data.sessions || []);
            } else if (response.status === 401) {
                navigate('/login');
            } else {
                const data = await response.json();
                setErrors(data.message || 'No se pudo cargar las sesiones.');
            }
        } catch (error) {
            setErrors('No se pudo conectar con el servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleDeleteSession = async (id) => {
        setStatus(null);
        setErrors(null);

        try {
            const response = await fetch(`/api/auth/sessions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setStatus(data.status || 'Sesión cerrada correctamente.');
                fetchSessions();
            } else {
                setErrors(data.message || 'No se pudo cerrar la sesión.');
            }
        } catch (error) {
            setErrors('No se pudo conectar con el servidor.');
        }
    };

    const handleTerminateOthers = async () => {
        setStatus(null);
        setErrors(null);

        try {
            const response = await fetch('/api/auth/sessions/terminate-others', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setStatus(data.status || 'Otras sesiones cerradas correctamente.');
                fetchSessions();
            } else {
                setErrors(data.message || 'No se pudieron cerrar otras sesiones.');
            }
        } catch (error) {
            setErrors('No se pudo conectar con el servidor.');
        }
    };

    return (
        <div className="container mt-3">
            <div className="card shadow border-0 mx-auto" style={{ maxWidth: '800px' }}>
                <div className="card-header bg-white border-0 pt-3 pb-0 d-flex align-items-end justify-content-between">
                    <h2 className="text-primary mb-0">Sesiones abiertas</h2>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/profile')}>
                        Volver al perfil
                    </button>
                    <button className="btn btn-outline-primary" onClick={handleTerminateOthers} disabled={isLoading || sessions.length <= 1}>
                            Cerrar otras sesiones
                        </button>
                </div>
                <div className="card-body p-4">
                    {status && <div className="alert alert-success mb-4">{status}</div>}
                    {errors && <div className="alert alert-danger mb-4">{errors}</div>}
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center text-muted">No hay sesiones abiertas.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Dispositivo</th>
                                        <th>Creada</th>
                                        <th>Último uso</th>
                                        <th>Actual</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map((session) => (
                                        <tr key={session.id}>
                                            <td>{session.device}</td>
                                            <td>{session.created_at || '—'}</td>
                                            <td>{session.last_used_at || '—'}</td>
                                            <td>{session.is_current ? 'Sí' : 'No'}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    disabled={session.is_current}
                                                    onClick={() => handleDeleteSession(session.id)}
                                                >
                                                    Cerrar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
