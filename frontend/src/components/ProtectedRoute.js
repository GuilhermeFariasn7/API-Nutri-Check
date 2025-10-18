
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedTypes = [] }) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(userType)) {
    // Redireciona para a home apropriada do usuário
    const redirectPath = userType === 'admin' ? '/homeAdmin' : '/homeEnty';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;