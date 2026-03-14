import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Profile from './Profile';
import Navbar from './Navbar';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('auth_token');
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <Navbar />
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Navbar />
                        <Profile />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);