import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GuiaCaraivaApp from './screens/GuiaCaraivaApp';
import './index.css';
createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><Routes><Route path="/guia" element={<GuiaCaraivaApp />} /><Route path="/" element={<Navigate to="/guia" replace />} /><Route path="*" element={<main style={{padding:40,color:'white'}}>Página indisponível. <a href="/guia">Abrir guia</a></main>} /></Routes></BrowserRouter></StrictMode>);
