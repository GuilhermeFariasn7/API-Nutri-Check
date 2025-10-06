import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Users, FileText, Plus, LogOut, AlertTriangle, ClipboardList } from "lucide-react";

function HomeForm() {
    const navigate = useNavigate();
    const [entities] = useState([]); // Lista vazia para começar

    const handleLogout = () => {
        navigate('/login');
    };

    const handleNewEnty = () =>
    {
        navigate('/createEnt');
    };

    // Estatísticas
    const entitiesCount = entities.length;
    const pendingQuestionnaires = entities.filter(e => !localStorage.getItem(`responses_${e.id}`)).length;
    const generatedReports = entities.filter(e => localStorage.getItem(`responses_${e.id}`)).length;

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
                            <p>Bem-vindo, admin</p>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut className="btn-icon" />
                        Sair
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
                            <div className="entity-item">
                                {/* Conteúdo das entidades aparecerá aqui quando tiver */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeForm;