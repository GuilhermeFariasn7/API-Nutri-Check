import React, { useState } from "react";
import { Shield, UserCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../service/authService";

function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Validações básicas
            if (!username || !password) {
                throw new Error("Preencha todos os campos");
            }

            console.log('Dados sendo enviados:', {
            username: username,
            password: password
        });

            // Chamada REAL para o backend
            const response = await authService.login({
                username: username,
                password: password
            });

            // Login bem-sucedido
            if (onLoginSuccess) {
                onLoginSuccess(response);
            }

        } catch (error) {
            setError(error.message);
            console.error("Erro no login:", error);
        } finally {
            setIsLoading(false);
        }
        window.location.href = '/';
    };

    return (
        <div className="container">
            {/* Cabeçalho separado */}
            <div className="login-header">
                <div className="icon-top">
                    <Shield />
                </div>
                <h1>Padroniza</h1>
                <p className="subtitle">Gestão de boas práticas para serviços de alimentação</p>
            </div>
            
            {/* Card de login separado */}
            <div className="login-card">
                <h2>Acesso ao Sistema</h2>
                <p className="instruction">Digite suas credenciais para continuar</p>
                
                {/* Mensagem de erro */}
                {error && (
                    <div className="error-message">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <UserCheck className="input-icon" />
                    </div>
                    <div className="input-container">
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <Shield className="input-icon" />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <div className="loading-container">
                                <div className="spinner" />
                                <span>Verificando...</span>
                            </div>
                        ) : (
                            <>
                                <UserCheck className="button-icon" />
                                <span>Entrar</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;