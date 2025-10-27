import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { questionnaireService } from '../service/questionnaireService';
import { entidadeService } from '../service/entidadeService';
import { questions } from '../data/questions';
import { ClipboardList,ArrowLeft,ArrowRight } from "lucide-react";

function QuestionaryFormAdmin() {
    const navigate = useNavigate();
    const { entityId } = useParams();
    const { user } = useAuth();

    const [entity, setEntity] = useState(null);
    const [responses, setResponses] = useState({});
    const [observations, setObservations] = useState({});
    const [identificationData, setIdentificationData] = useState({
        numeroFuncionarios: '',
        numeroTurnos: '',
        responsavelManipulacao: '',
        representanteLegal: '',
        cpfRepresentante: '',
        motivoInspecao: [],
        localData: {
            local: '',
            data: new Date().toISOString().split('T')[0]
        }
    });
    const [responsaveisData, setResponsaveisData] = useState({
        responsavel1: '',
        matricula1: '',
        responsavelEmpresa: '',
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const motivosInspecao = [
        'SOLICITAÇÃO DE LICENÇA SANITÁRIA',
        'PROGRAMAS ESPECÍFICOS DE VIGILÂNCIA SANITÁRIA',
        'VERIFICAÇÃO OU APURAÇÃO DE DENÚNCIA',
        'INSPEÇÃO PROGRAMADA',
        'REINSPEÇÃO',
        'RENOVAÇÃO DE LICENÇA SANITÁRIA',
        'OUTROS'
    ];

    // Buscar entidade do backend
    useEffect(() => {
        const carregarEntidade = async () => {
            if (!entityId) return;

            setIsLoading(true);
            try {
                const entidadeData = await entidadeService.buscarEntidadePorId(entityId);
                setEntity(entidadeData);

                // Agora carregar o questionário existente
                await carregarQuestionarioExistente(entidadeData);
            } catch (error) {
                console.error('Erro ao carregar entidade:', error);
                setMessage('Erro: Não foi possível carregar os dados da empresa');
            } finally {
                setIsLoading(false);
            }
        };

        // Função separada para carregar questionário
        const carregarQuestionarioExistente = async (entidade) => {
            try {
                const questionarioExistente = await questionnaireService.buscarPorEmpresa(entityId);

                if (questionarioExistente) {
                    // Preencher dados de identificação
                    setIdentificationData({
                        numeroFuncionarios: questionarioExistente.numero_funcionarios || '',
                        numeroTurnos: questionarioExistente.numero_turnos || '',
                        responsavelManipulacao: questionarioExistente.responsavel_manipulacao || '',
                        representanteLegal: questionarioExistente.representante_legal || '',
                        cpfRepresentante: questionarioExistente.cpf_representante || '',
                        motivoInspecao: questionarioExistente.motivo_inspecao || [],
                        localData: {
                            local: questionarioExistente.local_inspecao || '',
                            data: questionarioExistente.data_inspecao || new Date().toISOString().split('T')[0]
                        }
                    });

                    // Preencher dados dos responsáveis
                    setResponsaveisData({
                        responsavel1: questionarioExistente.responsavel1 || '',
                        matricula1: questionarioExistente.matricula1 || '',
                        responsavelEmpresa: questionarioExistente.responsavel_empresa || '',
                    });

                    // Preencher respostas
                    const respostasCarregadas = {};
                    const observacoesCarregadas = {};

                    questionarioExistente.respostas_questionario?.forEach(resposta => {
                        respostasCarregadas[resposta.pergunta_id] = resposta.resposta;
                        if (resposta.observacao) {
                            observacoesCarregadas[resposta.pergunta_id] = resposta.observacao;
                        }
                    });

                    setResponses(respostasCarregadas);
                    setObservations(observacoesCarregadas);
                } else {
                    // Se não existe questionário, definir padrão "SIM" para todas as perguntas
                    const defaultResponses = {};
                    questions.forEach(question => {
                        defaultResponses[question.id] = 'SIM';
                    });
                    setResponses(defaultResponses);

                    // Preencher automaticamente com dados da empresa
                    if (entidade) {
                        setIdentificationData(prev => ({
                            ...prev,
                            numeroFuncionarios: entidade.numeroFuncionarios || '',
                            numeroTurnos: entidade.numeroTurnos || '',
                            responsavelManipulacao: entidade.responsavelManipulacao || '',
                            representanteLegal: entidade.representanteLegal || '',
                            cpfRepresentante: entidade.cpfRepresentante || '',
                            motivoInspecao: entidade.motivoInspecao || []
                        }));
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar questionário:', error);
                // Não mostrar erro aqui para não sobrepor mensagens
            }
        };

        carregarEntidade();
    }, [entityId]);

    // Handlers
    const handleResponseChange = (questionId, value) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleObservationChange = (questionId, value) => {
        setObservations(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleIdentificationChange = (field, value) => {
        setIdentificationData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMotivoChange = (motivo, checked) => {
        const currentMotivos = identificationData.motivoInspecao;
        if (checked) {
            handleIdentificationChange('motivoInspecao', [...currentMotivos, motivo]);
        } else {
            handleIdentificationChange('motivoInspecao', currentMotivos.filter(m => m !== motivo));
        }
    };

    const handleBack = () => {
        navigate('/homeAdmin');
    };

    // Preparar dados para enviar ao backend
    const prepararDadosParaBackend = () => {
        const respostasData = questions.map(question => ({
            pergunta_id: question.id,
            resposta: responses[question.id] || 'SIM',
            observacao: observations[question.id] || undefined
        }));

        return {
            empresa_id: parseInt(entityId),
            status: 'rascunho',
            numero_funcionarios: identificationData.numeroFuncionarios || undefined,
            numero_turnos: identificationData.numeroTurnos || undefined,
            responsavel_manipulacao: identificationData.responsavelManipulacao || undefined,
            representante_legal: identificationData.representanteLegal || undefined,
            cpf_representante: identificationData.cpfRepresentante || undefined,
            motivo_inspecao: identificationData.motivoInspecao.length > 0 ? identificationData.motivoInspecao : undefined,
            responsavel1: responsaveisData.responsavel1 || undefined,
            matricula1: responsaveisData.matricula1 || undefined,
            responsavel_empresa: responsaveisData.responsavelEmpresa || undefined,
            local_inspecao: identificationData.localData.local || undefined,
            data_inspecao: identificationData.localData.data || undefined,
            respostas: respostasData
        };
    };

    // Salvar no backend
    const handleSave = async () => {
        if (!entityId) {
            setMessage('Erro: ID da empresa não encontrado');
            return;
        }

        setIsSaving(true);
        setMessage('');

        try {
            const dadosParaSalvar = prepararDadosParaBackend();

            // Salvar no backend
            const resultado = await questionnaireService.salvarQuestionario(dadosParaSalvar);

            setMessage('Questionário salvo com sucesso!');

            // Redirecionar para o dashboard admin
            setTimeout(() => {
                navigate('/homeAdmin');
            }, 2000);
        } catch (error) {
            console.error('Erro ao salvar questionário:', error);
            setMessage('Erro ao salvar questionário. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    // Navegação entre páginas
    const categories = [...new Set(questions.map(q => q.category))];
    const pages = [
        { title: 'A - IDENTIFICAÇÃO DA EMPRESA', type: 'identification' },
        ...categories.map(category => ({ title: category, type: 'questions' })),
        { title: 'C - RESPONSÁVEIS PELA INSPEÇÃO', type: 'responsaveis' }
    ];

    const totalPages = pages.length;
    const currentPageData = pages[currentPage];

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getCategoryQuestions = (category) => {
        return questions.filter(q => q.category === category);
    };

    if (!entity && !isLoading) {
        return (
            <div className="home-container">
                <div className="loading">Entidade não encontrada</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="home-container">
                <div className="loading">Carregando questionário...</div>
            </div>
        );
    }

    return (
        <div className="questionary-form-container">
            {/* Header */}
            <div className="questionary-header">
                <button className="btn-voltar" onClick={handleBack}>
                    <ArrowLeft/>
                    <p className='btn-voltar-text'>Voltar</p>
                </button>
                <ClipboardList className="stat-icon primary" />
                <div className="questionary-header-text">
                    <h1>Questionário RN 003.DIVS.2010</h1>
                    <p>{entity.nomeFantasia}</p>
                </div>

            </div>

            {/* Mensagem de status */}
            {message && (
                <div className={`message-questionary ${message.includes('Erro') ? 'error-message' : 'success-message'}`}>
                    {message}
                </div>
            )}

            {/* Progresso */}
            <div className="questionary-progress-card">
                <div className="questionary-progress-content">
                    <div className="questionary-progress-info">
                        <span className="questionary-page-info">
                            Página {currentPage + 1} de {totalPages}
                        </span>
                        <span className="questionary-section-title">
                            {currentPageData.title}
                        </span>
                    </div>
                    <div className="questionary-progress-bar">
                        <div
                            className="questionary-progress-fill"
                            style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Conteúdo da Página */}
            {currentPageData.type === 'identification' && (
                <div className="questionary-card">
                    <div className="questionary-card-header">
                        <h2 className="questionary-card-title">A - IDENTIFICAÇÃO DA EMPRESA</h2>
                    </div>
                    <div className="questionary-card-content">
                        {/* Dados da Empresa (somente leitura) */}
                        <div className="questionary-entity-info-grid">
                            <div className="questionary-info-item-full">
                                <label className="questionary-info-label">1 - Razão Social:</label>
                                <p className="questionary-info-value">{entity.razaoSocial}</p>
                            </div>

                            <div className="questionary-info-item-full">
                                <label className="questionary-info-label">2 - Nome de Fantasia:</label>
                                <p className="questionary-info-value">{entity.nomeFantasia}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">3 - Alvará/Licença Sanitária:</label>
                                <p className="questionary-info-value">{entity.alvara || 'Não informado'}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">4 - Inscrição Estadual/Municipal:</label>
                                <p className="questionary-info-value">{entity.inscricaoEstadual || 'Não informado'}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">5 - CNPJ/CPF:</label>
                                <p className="questionary-info-value">{entity.cnpjCpf}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">6 - Fone:</label>
                                <p className="questionary-info-value">{entity.fone || 'Não informado'}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">7 - Fax:</label>
                                <p className="questionary-info-value">{entity.fax || 'Não informado'}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">8 - E-mail:</label>
                                <p className="questionary-info-value">{entity.email}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">9 - Endereço (Rua/Av.):</label>
                                <p className="questionary-info-value">{entity.endereco || 'Não informado'}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">10 - Nº:</label>
                                <p className="questionary-info-value">{entity.numero || 'Não informado'}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">11 - Complemento:</label>
                                <p className="questionary-info-value">{entity.complemento || 'Não informado'}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">12 - Bairro:</label>
                                <p className="questionary-info-value">{entity.bairro || 'Não informado'}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">13 - Município:</label>
                                <p className="questionary-info-value">{entity.municipio || 'Não informado'}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">14 - UF:</label>
                                <p className="questionary-info-value">{entity.uf || 'Não informado'}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">15 - CEP:</label>
                                <p className="questionary-info-value">{entity.cep || 'Não informado'}</p>
                            </div>

                            <div className="questionary-info-item">
                                <label className="questionary-info-label">16 - Ramo de Atividade:</label>
                                <p className="questionary-info-value">{entity.category}</p>
                            </div>
                        </div>

                        {/* Campos editáveis */}
                        <div className="questionary-form-section">
                            <div className="questionary-form-grid">
                                <div className="questionary-form-group">
                                    <label htmlFor="numeroFuncionarios" className="questionary-form-label">
                                        17 - Número de Funcionários:
                                    </label>
                                    <input
                                        id="numeroFuncionarios"
                                        type="number"
                                        value={identificationData.numeroFuncionarios}
                                        onChange={(e) => handleIdentificationChange('numeroFuncionarios', e.target.value)}
                                        className="questionary-form-input"
                                        placeholder="Quantidade"
                                    />
                                </div>

                                <div className="questionary-form-group">
                                    <label htmlFor="numeroTurnos" className="questionary-form-label">
                                        18 - Número de Turnos:
                                    </label>
                                    <input
                                        id="numeroTurnos"
                                        type="number"
                                        value={identificationData.numeroTurnos}
                                        onChange={(e) => handleIdentificationChange('numeroTurnos', e.target.value)}
                                        className="questionary-form-input"
                                        placeholder="Quantidade"
                                    />
                                </div>

                                <div className="questionary-form-group-full">
                                    <label htmlFor="responsavelManipulacao" className="questionary-form-label">
                                        19 - Responsável pela Atividade de Manipulação:
                                    </label>
                                    <input
                                        id="responsavelManipulacao"
                                        value={identificationData.responsavelManipulacao}
                                        onChange={(e) => handleIdentificationChange('responsavelManipulacao', e.target.value)}
                                        className="questionary-form-input"
                                        placeholder="Nome do responsável"
                                    />
                                </div>

                                <div className="questionary-form-group">
                                    <label htmlFor="representanteLegal" className="questionary-form-label">
                                        20 - Representante Legal:
                                    </label>
                                    <input
                                        id="representanteLegal"
                                        value={identificationData.representanteLegal}
                                        onChange={(e) => handleIdentificationChange('representanteLegal', e.target.value)}
                                        className="questionary-form-input"
                                        placeholder="Nome do representante"
                                    />
                                </div>

                                <div className="questionary-form-group">
                                    <label htmlFor="cpfRepresentante" className="questionary-form-label">
                                        21 - CPF:
                                    </label>
                                    <input
                                        id="cpfRepresentante"
                                        value={identificationData.cpfRepresentante}
                                        onChange={(e) => handleIdentificationChange('cpfRepresentante', e.target.value)}
                                        className="questionary-form-input"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                            </div>

                            {/* Motivo da Inspeção */}
                            <div className="questionary-checkbox-group">
                                <label className="questionary-checkbox-label">22 - Motivo da Inspeção:</label>
                                <div className="questionary-checkbox-grid">
                                    {motivosInspecao.map(motivo => (
                                        <div key={motivo} className="questionary-checkbox-item">
                                            <input
                                                type="checkbox"
                                                id={motivo}
                                                checked={identificationData.motivoInspecao.includes(motivo)}
                                                onChange={(e) => handleMotivoChange(motivo, e.target.checked)}
                                                className="questionary-checkbox-input"
                                            />
                                            <label htmlFor={motivo} className="questionary-checkbox-text">
                                                ( ) {motivo}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Perguntas */}
            {currentPageData.type === 'questions' && (
                <div className="questionary-card">
                    <div className="questionary-card-header">
                        <h2 className="questionary-card-title">B - AVALIAÇÃO - {currentPageData.title}</h2>
                    </div>
                    <div className="questionary-card-content">
                        {getCategoryQuestions(currentPageData.title).map(question => (
                            <div key={question.id} className="questionary-question-item">
                                <label className="questionary-question-text">
                                    {question.id}. {question.question}
                                </label>

                                <div className="questionary-radio-group">
                                    <div className="questionary-radio-option">
                                        <input
                                            type="radio"
                                            id={`${question.id}-sim`}
                                            value="SIM"
                                            checked={responses[question.id] === 'SIM'}
                                            onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                            className="questionary-radio-input"
                                        />
                                        <label htmlFor={`${question.id}-sim`} className="questionary-radio-label questionary-radio-success">
                                            SIM
                                        </label>
                                    </div>

                                    <div className="questionary-radio-option">
                                        <input
                                            type="radio"
                                            id={`${question.id}-nao`}
                                            value="NÃO"
                                            checked={responses[question.id] === 'NÃO'}
                                            onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                            className="questionary-radio-input"
                                        />
                                        <label htmlFor={`${question.id}-nao`} className="questionary-radio-label questionary-radio-danger">
                                            NÃO
                                        </label>
                                    </div>

                                    <div className="questionary-radio-option">
                                        <input
                                            type="radio"
                                            id={`${question.id}-na`}
                                            value="Não se aplica"
                                            checked={responses[question.id] === 'Não se aplica'}
                                            onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                            className="questionary-radio-input"
                                        />
                                        <label htmlFor={`${question.id}-na`} className="questionary-radio-label questionary-radio-warning">
                                            Não se aplica
                                        </label>
                                    </div>
                                </div>

                                {(responses[question.id] === 'NÃO' || responses[question.id] === 'Não se aplica') && (
                                    <div className="questionary-observation-group">
                                        <label htmlFor={`obs-${question.id}`} className="questionary-form-label">
                                            Obs:
                                        </label>
                                        <textarea
                                            id={`obs-${question.id}`}
                                            value={observations[question.id] || ''}
                                            onChange={(e) => handleObservationChange(question.id, e.target.value)}
                                            className="questionary-form-textarea"
                                            placeholder="Observações (opcional)"
                                            rows={2}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Responsáveis */}
            {currentPageData.type === 'responsaveis' && (
                <>
                    <div className="questionary-card">
                        <div className="questionary-card-header">
                            <h2 className="questionary-card-title">C - RESPONSÁVEIS PELA INSPEÇÃO</h2>
                        </div>
                        <div className="questionary-card-content">
                            <div className="questionary-form-grid">
                                <div className="questionary-form-group">
                                    <label htmlFor="responsavel1" className="questionary-form-label">
                                        Nome do responsável:
                                    </label>
                                    <input
                                        id="responsavel1"
                                        value={responsaveisData.responsavel1}
                                        onChange={(e) => setResponsaveisData(prev => ({ ...prev, responsavel1: e.target.value }))}
                                        className="questionary-form-input"
                                        placeholder="Nome completo"
                                    />
                                </div>

                                <div className="questionary-form-group">
                                    <label htmlFor="matricula1" className="questionary-form-label">
                                        Matrícula:
                                    </label>
                                    <input
                                        id="matricula1"
                                        value={responsaveisData.matricula1}
                                        onChange={(e) => setResponsaveisData(prev => ({ ...prev, matricula1: e.target.value }))}
                                        className="questionary-form-input"
                                        placeholder="Número da matrícula"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="questionary-card">
                        <div className="questionary-card-header">
                            <h2 className="questionary-card-title">D - RESPONSÁVEL PELA EMPRESA</h2>
                        </div>
                        <div className="questionary-card-content">
                            <div className="questionary-form-group">
                                <label htmlFor="responsavelEmpresa" className="questionary-form-label">
                                    Nome do responsável pelo estabelecimento:
                                </label>
                                <input
                                    id="responsavelEmpresa"
                                    value={responsaveisData.responsavelEmpresa}
                                    onChange={(e) => setResponsaveisData(prev => ({ ...prev, responsavelEmpresa: e.target.value }))}
                                    className="questionary-form-input"
                                    placeholder="Nome completo"
                                />
                            </div>

                            <div className="questionary-form-grid">
                                <div className="questionary-form-group">
                                    <label htmlFor="local" className="questionary-form-label">
                                        LOCAL:
                                    </label>
                                    <input
                                        id="local"
                                        value={identificationData.localData.local}
                                        onChange={(e) => setIdentificationData(prev => ({
                                            ...prev,
                                            localData: { ...prev.localData, local: e.target.value }
                                        }))}
                                        className="questionary-form-input"
                                        placeholder="Local da inspeção"
                                    />
                                </div>

                                <div className="questionary-form-group">
                                    <label htmlFor="data" className="questionary-form-label">
                                        DATA:
                                    </label>
                                    <input
                                        id="data"
                                        type="date"
                                        value={identificationData.localData.data}
                                        onChange={(e) => setIdentificationData(prev => ({
                                            ...prev,
                                            localData: { ...prev.localData, data: e.target.value }
                                        }))}
                                        className="questionary-form-input"
                                    />
                                </div>
                            </div>

                            <p className="questionary-help-text">
                                * Não se aplica: quando o item não se aplicar à realidade do estabelecimento
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Navegação */}
            <div className="questionary-navigation">
                <div className="questionary-navigation-buttons">
                    <button
                        className="btn-outline-questionary"
                        onClick={prevPage}
                        disabled={currentPage === 0}
                    >
                        <ArrowLeft/>
                        Anterior
                    </button>

                    <button
                        className="btn-outline-questionary"
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        Próxima
                        <ArrowRight/>
                    </button>
                </div>

                <div className="questionary-action-buttons">
                    <button
                        className="btn-primary-questionary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <div className="loading-container-questionary">
                                <div className="spinner-questionary"></div>
                                <span>Salvando no Banco de Dados...</span>
                            </div>
                        ) : (
                            <span>Salvar Questionário</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuestionaryFormAdmin;