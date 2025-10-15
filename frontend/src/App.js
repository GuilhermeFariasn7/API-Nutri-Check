import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './service/authService';
import LoginPage from './pages/LoginPage';
import HomePageAdmin from './pages/HomePageAdmin';
import HomePageEnty from './pages/HomePageEnty';
import CadEntyPage from './pages/CadEntyPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica autenticação ao montar o App
  useEffect(() => {
    const userData = authService.getUserData();
    if (authService.isAuthenticated() && userData) {
      setIsAuthenticated(true);
      setUserType(userData.tipo);
    } else {
      authService.logout(); // limpa token inválido
      setIsAuthenticated(false);
      setUserType(null);
    }
    setLoading(false);
  }, []);

  // Chamado pelo LoginPage quando login é bem-sucedido
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUserType(userData.user.tipo); // atualiza tipo
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserType(null);
  };

  // Componente para rotas protegidas
  const ProtectedRoute = ({ children, allowedTypes }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedTypes && !allowedTypes.includes(userType)) {
      return userType === 'admin' ? <Navigate to="/homeAdmin" replace /> : <Navigate to="/homeEnty" replace />;
    }

    return React.cloneElement(children, { onLogout: handleLogout });
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rota de login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              userType === 'admin' ? <Navigate to="/homeAdmin" replace /> : <Navigate to="/homeEnty" replace />
            ) : (
              <LoginPage onLoginSuccess={handleLogin} />
            )
          }
        />

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

        {/* Rotas protegidas para Enty */}
        <Route
          path="/homeEnty"
          element={
            <ProtectedRoute allowedTypes={['enty']}>
              <HomePageEnty />
            </ProtectedRoute>
          }
        />

        {/* Rota padrão */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              userType === 'admin' ? <Navigate to="/homeAdmin" replace /> : <Navigate to="/homeEnty" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rota curinga para qualquer caminho inválido */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              userType === 'admin' ? <Navigate to="/homeAdmin" replace /> : <Navigate to="/homeEnty" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
