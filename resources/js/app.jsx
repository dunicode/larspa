import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Layout from './Layout';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Profile from './Profile';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PublicRoute><Layout><Main /></Layout></PublicRoute>} />
                    <Route path="/login" element={<PublicRoute><Layout><Login /></Layout></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Layout><Register /></Layout></PublicRoute>} />
                    <Route path="/forgot-password" element={<PublicRoute><Layout><ForgotPassword /></Layout></PublicRoute>} />
                    <Route path="/reset-password/:token" element={<PublicRoute><Layout><ResetPassword /></Layout></PublicRoute>} />
                    <Route path="/home" element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);