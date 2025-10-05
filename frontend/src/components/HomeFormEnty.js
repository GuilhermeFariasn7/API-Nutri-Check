import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  LogOut, 
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Info,
  BookOpen
} from "lucide-react";

function EntityDashboard() {
    const navigate = useNavigate();
    
    // Dados mock da entidade (você pode substituir por dados reais depois)
    const [entity] = useState({
        nomeFantasia: "Restaurante Teste",
        type: "Privada",
        category: "Restaurante",
        responsavelManipulacao: "João da Silva",
        endereco: "Rua Teste",
        numero: "123",
        bairro: "Centro",
        municipio: "São Paulo",
        uf: "SP"
    });

    const hasResponses = localStorage.getItem(`responses_${entity.id}`);
    const hasBestPracticesReport = localStorage.getItem(`best_practices_${entity.id}`);
    const [showBestPractices, setShowBestPractices] = useState(false);

    const handleLogout = () => {
        navigate('/login');
    };

    // Se não tiver entidade, mostra mensagem de erro
    if (!entity) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <p>Entidade não encontrada</p>
            </div>
        );
    }

    return (
        <div className="entity-container">
            {/* Header */}
            <header className="entity-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="header-icon">
                            <Building2 />
                        </div>
                        <div className="header-text">
                            <h1>{entity.nomeFantasia}</h1>
                            <p>{entity.category} • {entity.type}</p>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut className="btn-icon" />
                        Sair
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="entity-main">
                <div className="content-grid">
                    {/* Informações da Entidade */}
                    <div className="info-card">
                        <div className="card-header">
                            <h2>Informações da Entidade</h2>
                            <p>Dados cadastrais e informações principais</p>
                        </div>
                        <div className="card-content">
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Nome da Entidade</label>
                                    <p className="info-value">{entity.nomeFantasia}</p>
                                </div>
                                
                                <div className="info-item">
                                    <label>Tipo</label>
                                    <p className="info-value">{entity.type}</p>
                                </div>
                                
                                <div className="info-item">
                                    <label>Categoria</label>
                                    <p className="info-value">{entity.category}</p>
                                </div>
                                
                                <div className="info-item">
                                    <label>Responsável Técnico</label>
                                    <p className="info-value">{entity.responsavelManipulacao}</p>
                                </div>
                                
                                <div className="info-item full-width">
                                    <label>Endereço</label>
                                    <p className="info-value">
                                        {entity.endereco}, {entity.numero} - {entity.bairro}, {entity.municipio}/{entity.uf}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status do Questionário */}
                    <div className="questionnaire-card">
                        <div className="card-header">
                            <div className="card-title-with-icon">
                                <ClipboardList className="title-icon" />
                                <h2>Status do Questionário RN 003.DIVS.2010</h2>
                            </div>
                        </div>
                        <div className="card-content">
                            {hasResponses ? (
                                <div className="questionnaire-content">
                                    {/* Aqui viria o ReportsView */}
                                    <div className="reports-placeholder">
                                        <p>Relatórios disponíveis</p>
                                    </div>
                                    
                                    {/* Relatório de Boas Práticas se disponível */}
                                    {hasBestPracticesReport && (
                                        <div className="best-practices-card">
                                            <div className="card-header">
                                                <div className="card-title-with-icon">
                                                    <BookOpen className="title-icon primary" />
                                                    <h2 className="primary">Relatório de Boas Práticas</h2>
                                                </div>
                                                <p className="card-description">
                                                    Relatório personalizado baseado nas respostas do questionário
                                                </p>
                                            </div>
                                            <div className="card-content">
                                                {!showBestPractices ? (
                                                    <div className="best-practices-available">
                                                        <div className="status-badge success">
                                                            <CheckCircle className="status-icon" />
                                                            <span>Relatório Disponível</span>
                                                        </div>
                                                        
                                                        <p className="status-description">
                                                            O relatório de boas práticas foi gerado pelo administrador e está 
                                                            disponível para visualização.
                                                        </p>
                                                        
                                                        <button 
                                                            className="btn-primary"
                                                            onClick={() => setShowBestPractices(true)}
                                                        >
                                                            <BookOpen className="btn-icon" />
                                                            Visualizar Relatório de Boas Práticas
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="best-practices-view">
                                                        <button 
                                                            className="btn-outline"
                                                            onClick={() => setShowBestPractices(false)}
                                                        >
                                                            Voltar ao Resumo
                                                        </button>
                                                        {/* Aqui viria o BestPracticesReport */}
                                                        <div className="report-placeholder">
                                                            <p>Conteúdo do Relatório de Boas Práticas</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="questionnaire-pending">
                                    <div className="status-badge warning">
                                        <AlertTriangle className="status-icon" />
                                        <span>Questionário Pendente</span>
                                    </div>
                                    
                                    <div className="warning-message">
                                        <div className="warning-content">
                                            <Info className="warning-icon" />
                                            <div>
                                                <p className="warning-title">Questionário não preenchido</p>
                                                <p className="warning-description">
                                                    O questionário baseado na RN 003.DIVS.2010 ainda não foi preenchido 
                                                    pelo administrador do sistema. Entre em contato com a equipe responsável 
                                                    para solicitar o preenchimento.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default EntityDashboard;