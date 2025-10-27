import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { entidadeService } from '../service/entidadeService';
import { Building2, Users, FileText, Plus, LogOut, ClipboardList, Edit, Trash2, AlertTriangle } from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Buscar entidades do backend
    useEffect(() => {
        const carregarEntidades = async () => {
            try {
                const entidadesData = await entidadeService.listarEntidades();
                setEntities(entidadesData);
            } catch (error) {
                console.error('Erro ao carregar entidades:', error);
                alert('Erro ao carregar entidades');
            } finally {
                setLoading(false);
            }
        };

        carregarEntidades();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const handleNewEnty = () => {
        navigate('/createEnt');
    };

    const handleDeleteEntity = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta entidade?')) {
            try {
                await entidadeService.excluirEntidade(id);
                // Atualizar lista local
                setEntities(entities.filter(entity => entity.id !== id));
                alert('Entidade excluída com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir entidade:', error);
                alert('Erro ao excluir entidade');
            }
        }
    };

    const handleQuestionnaire = (entityId) => {
        // Navegar para o questionário desta entidade
        console.log("navegar questionarios: " + `/AdminQuestionaries/${entityId}` );
        navigate(`/AdminQuestionaries/${entityId}`);
    };

    const handleReport = (entityId) => {
        // Navegar para o relatório desta entidade
        navigate(`/relatorio/${entityId}`);
    };

    // Estatísticas
    const entitiesCount = entities.length;
    const pendingQuestionnaires = entities.filter(e => !localStorage.getItem(`responses_${e.id}`)).length;
    const generatedReports = entities.filter(e => localStorage.getItem(`responses_${e.id}`)).length;

    // Verificar se tem respostas (você pode ajustar essa lógica depois)
    const hasResponses = (entityId) => {
        return localStorage.getItem(`responses_${entityId}`);
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Header */}
            <div className="home-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="header-icon">
                            <Users />
                        </div>
                        <div className="header-text">
                            <h1>Painel Administrativo</h1>
                            <p>Bem-vindo, {user?.username || 'admin'}</p>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut className="btn-icon" />
                        <p className="logout-btn-text">Sair</p>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="home-main">
                {/* Cards de Estatísticas */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <h3>Entidades Cadastradas</h3>
                            <Building2 className="stat-icon primary" />
                        </div>
                        <div className="stat-value primary">{entitiesCount}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <h3>Questionários Pendentes</h3>
                            <FileText className="stat-icon warning" />
                        </div>
                        <div className="stat-value warning">{pendingQuestionnaires}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <h3>Relatórios Gerados</h3>
                            <ClipboardList className="stat-icon success" />
                        </div>
                        <div className="stat-value success">{generatedReports}</div>
                    </div>
                </div>

                {/* Seção de Entidades */}
                <div className="entities-section">
                    <div className="section-header">
                        <div className="section-title">
                            <h2>Entidades Cadastradas</h2>
                            <p>Gerencie as entidades e seus questionários</p>
                        </div>
                        <div className="section-actions">
                            <button className="btn-primary" onClick={handleNewEnty}>
                                <Plus className="btn-icon" />
                                Nova Entidade
                            </button>                            
                        </div>
                    </div>

                    {/* Lista de Entidades */}
                    <div className="entities-list">
                        {entities.length === 0 ? (
                            <div className="empty-state">
                                <Building2 className="empty-icon" />
                                <p>Nenhuma entidade cadastrada ainda</p>
                            </div>
                        ) : (
                            <div className="entities-grid">
                                {entities.map((entity) => {
                                    const hasResponse = hasResponses(entity.id);
                                    
                                    return (
                                        <div key={entity.id} className="entity-card">
                                            <div className="entity-header">
                                                <div className="entity-info">
                                                    <h3 className="entity-name">
                                                        {entity.nomeFantasia || entity.razaoSocial}
                                                    </h3>
                                                    <p className="entity-details">
                                                        {entity.ramoAtividade} • {entity.tipoEmpresa}
                                                    </p>
                                                    <p className="entity-details">
                                                        Responsável: {entity.responsavelManipulacao}
                                                    </p>
                                                </div>
                                                <div className="entity-status">
                                                    {hasResponse ? (
                                                        <span className="status-badge success">
                                                            Completo
                                                        </span>
                                                    ) : (
                                                        <span className="status-badge warning">
                                                            <AlertTriangle className="status-icon" />
                                                            Pendente
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="entity-actions">
                                                <button 
                                                    className="btn-primary includ"
                                                    onClick={() => handleQuestionnaire(entity.id)}
                                                >
                                                    <ClipboardList className="btn-icon" />
                                                    Questionário
                                                </button>
                                                
                                                {hasResponse && (
                                                    <button 
                                                        className="btn-primary includ"
                                                        onClick={() => handleReport(entity.id)}
                                                    >
                                                        <FileText className="btn-icon" />
                                                        Relatório
                                                    </button>
                                                )}
                                                
                                                <button 
                                                    className="btn-outline danger"
                                                    onClick={() => handleDeleteEntity(entity.id)}
                                                >
                                                    <Trash2 className="btn-icon" />
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;