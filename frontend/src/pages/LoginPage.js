import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    console.log('Login realizado com sucesso:', userData);
    // O redirecionamento agora é feito no próprio LoginForm
  };

  return (
    <div>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}

export default LoginPage;