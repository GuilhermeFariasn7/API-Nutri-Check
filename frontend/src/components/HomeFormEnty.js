import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    LogOut,
    ClipboardList,
    AlertTriangle,
    CheckCircle,
    Info,
    BookOpen,
    Loader
} from "lucide-react";
import { authService } from '../service/authService';
import { entidadeService } from '../service/entidadeService';

function EntityDashboard() {

    const navigate = useNavigate();

    const [entity, setEntity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [questionarioStatus, setQuestionarioStatus] = useState(null);
    const [showBestPractices, setShowBestPractices] = useState(false);

    useEffect(() => {
        carregarDadosEmpresa();
    }, []);

    const carregarDadosEmpresa = async () => {
        try {
            setLoading(true);
            setError(null);

            
            const userData = authService.getUserData();

            console.log("UserData: ",userData);
            
            const empresaData = await entidadeService.buscarEntidadePorId(userData.empresa_id);
            

            setEntity(empresaData);

            setQuestionarioStatus({
                respondido: false,
                relatorioGerado: false
            });

        } catch (error) {
            console.error('Erro ao carregar dados da empresa:', error);
            setError(error.message || 'Erro ao carregar dados da empresa');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    // Loading state
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <Loader className="spinner" size={32} />
                <p style={{ marginTop: '1rem' }}>Carregando dados da empresa...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <AlertTriangle size={48} color="#dc2626" />
                <h2 style={{ margin: '1rem 0' }}>Erro ao carregar dados</h2>
                <p style={{ marginBottom: '2rem' }}>{error}</p>
                <button onClick={carregarDadosEmpresa} style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                }}>
                    Tentar Novamente
                </button>
            </div>
        );
    }

    // Se não tiver entidade
    if (!entity) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <Info size={48} color="#3b82f6" />
                <h2 style={{ margin: '1rem 0' }}>Empresa não encontrada</h2>
                <p style={{ marginBottom: '2rem' }}>Não foi possível carregar os dados da sua empresa.</p>
                <button onClick={carregarDadosEmpresa} style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                }}>
                    Tentar Novamente
                </button>
            </div>
        );
    }
    console.log(entity);
    // Usar dados reais da empresa
    const hasResponses = questionarioStatus?.respondido || false;
    const hasBestPracticesReport = questionarioStatus?.relatorioGerado || false;

    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="header-icon">
                            <Building2 />
                        </div>
                        <div className="header-text">
                            <h1>{entity.nomeFantasia || entity.razaoSocial}</h1>
                            <p>{entity.ramoAtividade} • {entity.tipoEmpresa}</p>
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
                                    <label>Nome Fantasia</label>
                                    <p className="info-value">{entity.nomeFantasia || 'Não informado'}</p>
                                </div>

                                <div className="info-item">
                                    <label>Razão Social</label>
                                    <p className="info-value">{entity.razaoSocial || 'Não informado'}</p>
                                </div>

                                <div className="info-item">
                                    <label>CNPJ/CPF</label>
                                    <p className="info-value">{entity.cnpjCpf || 'Não informado'}</p>
                                </div>

                                <div className="info-item">
                                    <label>Telefone</label>
                                    <p className="info-value">{entity.telefone || 'Não informado'}</p>
                                </div>

                                <div className="info-item">
                                    <label>Email</label>
                                    <p className="info-value">{entity.email || 'Não informado'}</p>
                                </div>

                                <div className="info-item">
                                    <label>Ramo de Atividade</label>
                                    <p className="info-value">{entity.ramoAtividade || 'Não informado'}</p>
                                </div>

                                <div className="info-item">
                                    <label>Tipo de Empresa</label>
                                    <p className="info-value">{entity.tipoEmpresa || 'Não informado'}</p>
                                </div>

                                <div className="info-item">
                                    <label>Responsável Técnico</label>
                                    <p className="info-value">{entity.responsavelManipulacao || 'Não informado'}</p>
                                </div>

                                <div className="info-item full-width">
                                    <label>Endereço</label>
                                    <p className="info-value">
                                        {entity.endereco ?
                                            `${entity.endereco}, ${entity.numero || ''} - ${entity.bairro || ''}, ${entity.municipio || ''}/${entity.uf || ''}`
                                            : 'Não informado'
                                        }
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
                                    {/* Conteúdo quando tem questionário respondido */}
                                    <div className="status-badge success">
                                        <CheckCircle className="status-icon" />
                                        <span>Questionário Respondido</span>
                                    </div>

                                    {hasBestPracticesReport && (
                                        <div className="best-practices-card">
                                            {/* ... conteúdo do relatório ... */}
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
                                                    O questionário baseado na RN 003.DIVS.2010 ainda não foi preenchido.
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