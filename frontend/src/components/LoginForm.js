
import React, { useState } from "react";
import { Shield, UserCheck, AlertCircle, CheckCircle } from "lucide-react";

function LoginForm({ onSubmit, isLoading, error, success }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            onSubmit({ username, password });
        } catch (error) {
            
            console.log('Erro no LoginForm:', error);
        }
        
    };

    return (
        <div className="container">
            <div className="login-header">
                <div className="icon-top">
                    <Shield />
                </div>
                <h1>Padroniza</h1>
                <p className="subtitle">Gestão de boas práticas para serviços de alimentação</p>
            </div>

            <div className="login-card">
                <h2>Acesso ao Sistema</h2>
                <p className="instruction">Digite suas credenciais para continuar</p>

                {/* Mensagem de SUCESSO */}
                {success && (
                    <div className="success-message">
                        <CheckCircle size={18} />
                        <span>Login realizado com sucesso! Redirecionando...</span>
                    </div>
                )}

                {/* Mensagem de ERRO */}
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
                            disabled={isLoading || success}
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
                            disabled={isLoading || success}
                        />
                        <Shield className="input-icon" />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || success}
                        className={success ? 'success' : ''}>
                        {isLoading ? (
                            <div className="loading-container">
                                <div className="spinner" />
                                <span>Verificando...</span>
                            </div>
                        ) : success ? (
                            <>
                                <CheckCircle className="button-icon" />
                                <span>Sucesso!</span>
                            </>
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