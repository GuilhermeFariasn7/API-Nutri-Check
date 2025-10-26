// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePageAdmin from './pages/HomePageAdmin';
import HomePageEnty from './pages/HomePageEnty';
import CadEntyPage from './pages/CadEntyPage';
import QuestionaryPageAdmin from './pages/QuestionaryPageAdmin'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota publica */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas protegidas para Admin */}
          <Route
            path="/homeAdmin"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <HomePageAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createEnt"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <CadEntyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminQuestionaries/:entityId"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <QuestionaryPageAdmin />
              </ProtectedRoute>
            }
          />
          {/* Rotas protegidas para empresa */}
          <Route
            path="/homeEnty"
            element={
              <ProtectedRoute allowedTypes={['empresa']}>
                <HomePageEnty />
              </ProtectedRoute>
            }
          />

          {/* Rota padrão - redireciona baseado na autenticação */}
          <Route path="/" element={<LoginPage />} />

          {/* Rota curinga */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;