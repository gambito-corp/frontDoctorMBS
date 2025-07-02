// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';

// Páginas públicas
import Login from '../pages/Domains/User/Login';
import Register from '../pages/Domains/User/Register';
import ForgotPassword from '../pages/Domains/User/ForgotPassword';
import ResetPassword from '../pages/Domains/User/ResetPassword';
import VerifyEmail from '../pages/Domains/User/VerifyEmail';

// Páginas principales
import Dashboard from '../pages/Domains/User/Dashboard';
import MedFlash from '../pages/Domains/MedFlash/MedFlash';
import Exam from '../pages/Domains/MedBank/Exam';
import Game from '../pages/Domains/MedFlash/Game';
import FinishGame from '../pages/Domains/MedFlash/FinishGame';
import MedBank from '../pages/Domains/MedBank/MedBank';

// Layout
import MainLayout from '../components/templates/MainLayout';
import NotFound from '../pages/NotFound';
import MedChat from "../pages/Domains/MedChat/MedChat";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Rutas de autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Rutas principales - SIN PROTECCIÓN */}
            <Route path="/" element={
                <MainLayout>
                    <Dashboard />
                </MainLayout>
            } />

            <Route path="/dashboard" element={
                <MainLayout>
                    <Dashboard />
                </MainLayout>
            } />

            <Route path="/medflash" element={
                <MainLayout>
                    <MedFlash />
                </MainLayout>
            } />

            <Route path="/medflash/game" element={
                <MainLayout>
                    <Game />
                </MainLayout>
            } />

            <Route path="/medflash/finish" element={
                <MainLayout>
                    <FinishGame />
                </MainLayout>
            } />

            <Route path="/doctor-mbs" element={
                <MainLayout>
                    <MedChat/>
                </MainLayout>
            } />

            <Route path="/medbank" element={
                <MainLayout>
                    <MedBank/>
                </MainLayout>
            } />

            <Route path="/medbank/:examId" element={
                <MainLayout>
                    <Exam />
                </MainLayout>
            } />


            {/* Ruta por defecto */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
