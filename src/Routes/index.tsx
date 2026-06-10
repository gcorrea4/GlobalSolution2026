import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Footer } from '../components/Footer';
import { Home } from '../pages/Home';
import { FAQ } from '../pages/FAQ';
import { Reconhecimentos } from '../pages/Reconhecimentos';
import { QuemSomos } from '../pages/QuemSomos';
import { Sobre } from '../pages/Sobre';
import { Contato } from '../pages/Contato';
import { Formulario } from '../pages/Formulario';
import { Cadastro } from '../pages/Cadastro';
import { Login } from '../pages/Login';
import { AdminDashboard } from '../pages/AdminDashboard';
import { MedicoDashboard } from '../pages/MedicoDashboard';
import { PacienteDashboard } from '../pages/PacienteDashboard';
import { CalculadoraScore } from '../pages/CalculadoraScore';
import { FormularioContato } from '../pages/FormularioContato';
import { Prontuario } from '../pages/Prontuario';
import { TicketPublico } from '../pages/TicketPublico';
import { ApoloniasDoBem } from '../pages/ApoloniasDoBem';
import { Integrantes } from '../pages/Integrantes';
import { Consultas } from '../pages/Consultas';
import { Regioes } from '../pages/Regioes';
import { NotFound } from '../pages/NotFound';
import { ScrollToTop } from '../components/ScrollToTop';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Header />
      <div className="flex-grow"><Outlet /></div>
      <Footer />
    </div>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ── Páginas com Header + Footer ── */}
        <Route element={<PublicLayout />}>
          <Route path="/"                  element={<Home />} />
          <Route path="/faq"               element={<FAQ />} />
          <Route path="/reconhecimentos"   element={<Reconhecimentos />} />
          <Route path="/quem-somos"        element={<QuemSomos />} />
          <Route path="/sobre"             element={<Sobre />} />
          <Route path="/integrantes"       element={<Integrantes />} />
          <Route path="/contato"           element={<Contato />} />
          <Route path="/consultas"         element={<Consultas />} />
          <Route path="/regioes"           element={<Regioes />} />
          <Route path="/apolonias"         element={<ApoloniasDoBem />} />
          <Route path="/formulario"        element={<Formulario />} />
          <Route path="/cadastro"          element={<Cadastro />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/Calculadora/Score" element={<CalculadoraScore />} />
          <Route path="/FormularioContato" element={<FormularioContato />} />
          <Route path="/prontuario/:id"    element={<Prontuario />} />

          {/* ── Catch-all 404 (mantém Header/Footer) ── */}
          <Route path="*"                  element={<NotFound />} />
        </Route>

        {/* ── Rota pública de acompanhamento de consulta (sem login) ── */}
        <Route path="/ticket/:codigo" element={<TicketPublico />} />

        {/* ── Dashboards protegidos — sem Header/Footer ── */}
        <Route path="/dashboard/admin"    element={<ProtectedRoute allowedRoles={['admin', 'dev']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/medico"   element={<ProtectedRoute allowedRoles={['medico', 'dev']}><MedicoDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/paciente" element={<ProtectedRoute allowedRoles={['paciente']}><PacienteDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
