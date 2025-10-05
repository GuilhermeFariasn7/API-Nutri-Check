import React, { useState } from "react";
import { Shield, UserCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simula login
        setTimeout(() => {
            alert(`Usuário: ${username}, estaremos lhe redirecionando para página inicial`);
            navigate('/home');
            setIsLoading(false);
        }, 1000);
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
                
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
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