
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../service/authService";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {

    setError("");
    setSuccess(false);
    setIsLoading(true);
    try {
      // Service apenas faz a requisição, não trata erros
      const response = await authService.login(credentials);

      // Context atualiza o estado global
      login(response);

      setSuccess(true);

      setTimeout(() => {
        const userType = response.user?.tipo || response.tipo;
        const redirectPath = userType === 'admin' ? '/homeAdmin' : '/homeEnty';
        navigate(redirectPath, { replace: true });
      }, 1000);
    } catch (error) {
      let errorMessage = 'Erro ao fazer login';
      
      if (error.response) {
        // Erro do backend (4xx, 5xx)
        errorMessage = error.response.data?.message
          || error.response.data?.error
          || `${error.response.data}`;

      } else if (error.request) {
        // Sem resposta do servidor
        errorMessage = 'Servidor não respondeu. Verifique sua conexão.';
      } else {
        // Outros erros
        errorMessage = error.message || 'Erro inesperado';
      }

      setError(errorMessage);
      setTimeout(() => setError(""), 4000);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
      success={success}
    />
  );
}

export default LoginPage;