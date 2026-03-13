import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Hola desde React!</h1>} />
                {/* Tus rutas de React aquí */}
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);