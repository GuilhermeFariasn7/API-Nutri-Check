import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Save, X } from "lucide-react";

function CadEntyForm({ onCancel }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        razaoSocial: '',
        nomeFantasia: '',
        alvara: '',
        inscricaoEstadual: '',
        cnpjCpf: '',
        fone: '',
        fax: '',
        email: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        municipio: '',
        uf: '',
        cep: '',
        ramoAtividade: '',
        numeroFuncionarios: '',
        numeroTurnos: '',
        responsavelManipulacao: '',
        representanteLegal: '',
        cpfRepresentante: '',
        motivoInspecao: [],
        type: '',
        category: '',
        login: '',
        password: ''
    });

    const categories = [
        'Restaurante',
        'Escola',
        'Hospital',
        'Hotel',
        'Padaria',
        'Açougue',
        'Supermercado',
        'Lanchonete',
        'Bar',
        'Outros'
    ];

    const motivosInspecao = [
        'SOLICITAÇÃO DE LICENÇA SANITÁRIA',
        'PROGRAMAS ESPECÍFICOS DE VIGILÂNCIA SANITÁRIA',
        'VERIFICAÇÃO OU APURAÇÃO DE DENÚNCIA',
        'INSPEÇÃO PROGRAMADA',
        'REINSPEÇÃO',
        'RENOVAÇÃO DE LICENÇA SANITÁRIA',
        'OUTROS'
    ];

    const ufs = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
        'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validação dos campos obrigatórios
            const requiredFields = [
                'razaoSocial', 'cnpjCpf', 'email', 'login', 'password'
            ];

            const hasEmptyRequired = requiredFields.some(field => !formData[field]);
            
            if (hasEmptyRequired) {
                alert("Preencha os campos obrigatórios: Razão Social, CNPJ/CPF, E-mail, Login e Senha");
                setIsLoading(false);
                return;
            }

            // Aqui você adicionaria a lógica para salvar a entidade
            // Por enquanto, vamos simular o salvamento
            console.log('Dados da entidade:', formData);
            
            // Simula o salvamento
            setTimeout(() => {
                alert(`${formData.nomeFantasia || formData.razaoSocial} foi cadastrada com sucesso`);
                if (onCancel) {
                    onCancel();
                } else {
                    navigate('/home');
                }
                setIsLoading(false);
            }, 1000);

        } catch (error) {
            alert("Erro ao cadastrar entidade. Tente novamente.");
            setIsLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMotivoChange = (motivo, checked) => {
        if (checked) {
            handleInputChange('motivoInspecao', [...formData.motivoInspecao, motivo]);
        } else {
            handleInputChange('motivoInspecao', formData.motivoInspecao.filter(m => m !== motivo));
        }
    };

    return (
        <div className="entity-form-container">
            <div className="entity-form-card">
                {/* Header do Card */}
                <div className="card-header">
                    <div className="header-with-icon">
                        <Building2 className="header-icon" />
                        <div>
                            <h1>Nova Entidade</h1>
                            <p>Cadastre uma nova entidade no sistema - Identificação da Empresa</p>
                        </div>
                    </div>
                </div>
                
                {/* Conteúdo do Formulário */}
                <div className="card-content">
                    <form onSubmit={handleSubmit} className="entity-form">
                        {/* Seção A - IDENTIFICAÇÃO DA EMPRESA */}
                        <div className="form-section">
                            <h3 className="section-title">
                                A - IDENTIFICAÇÃO DA EMPRESA
                            </h3>
                            
                            <div className="form-grid">
                                {/* Razão Social */}
                                <div className="form-group full-width">
                                    <label htmlFor="razaoSocial">1 - Razão Social *</label>
                                    <input
                                        id="razaoSocial"
                                        type="text"
                                        value={formData.razaoSocial}
                                        onChange={(e) => handleInputChange('razaoSocial', e.target.value)}
                                        placeholder="Razão social da empresa"
                                        required
                                    />
                                </div>

                                {/* Nome Fantasia */}
                                <div className="form-group full-width">
                                    <label htmlFor="nomeFantasia">2 - Nome de Fantasia</label>
                                    <input
                                        id="nomeFantasia"
                                        type="text"
                                        value={formData.nomeFantasia}
                                        onChange={(e) => handleInputChange('nomeFantasia', e.target.value)}
                                        placeholder="Nome fantasia da empresa"
                                    />
                                </div>

                                {/* Alvará */}
                                <div className="form-group">
                                    <label htmlFor="alvara">3 - Alvará/Licença Sanitária</label>
                                    <input
                                        id="alvara"
                                        type="text"
                                        value={formData.alvara}
                                        onChange={(e) => handleInputChange('alvara', e.target.value)}
                                        placeholder="Número do alvará"
                                    />
                                </div>

                                {/* Inscrição Estadual */}
                                <div className="form-group">
                                    <label htmlFor="inscricaoEstadual">4 - Inscrição Estadual/Municipal</label>
                                    <input
                                        id="inscricaoEstadual"
                                        type="text"
                                        value={formData.inscricaoEstadual}
                                        onChange={(e) => handleInputChange('inscricaoEstadual', e.target.value)}
                                        placeholder="Número da inscrição"
                                    />
                                </div>

                                {/* CNPJ/CPF */}
                                <div className="form-group">
                                    <label htmlFor="cnpjCpf">5 - CNPJ/CPF *</label>
                                    <input
                                        id="cnpjCpf"
                                        type="text"
                                        value={formData.cnpjCpf}
                                        onChange={(e) => handleInputChange('cnpjCpf', e.target.value)}
                                        placeholder="CNPJ ou CPF"
                                        required
                                    />
                                </div>

                                {/* Telefone */}
                                <div className="form-group">
                                    <label htmlFor="fone">6 - Telefone</label>
                                    <input
                                        id="fone"
                                        type="text"
                                        value={formData.fone}
                                        onChange={(e) => handleInputChange('fone', e.target.value)}
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>

                                {/* Fax */}
                                <div className="form-group">
                                    <label htmlFor="fax">7 - Fax</label>
                                    <input
                                        id="fax"
                                        type="text"
                                        value={formData.fax}
                                        onChange={(e) => handleInputChange('fax', e.target.value)}
                                        placeholder="(00) 0000-0000"
                                    />
                                </div>

                                {/* Email */}
                                <div className="form-group">
                                    <label htmlFor="email">8 - E-mail *</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="email@empresa.com"
                                        required
                                    />
                                </div>

                                {/* Endereço */}
                                <div className="form-group">
                                    <label htmlFor="endereco">9 - Endereço (Rua/Av.)</label>
                                    <input
                                        id="endereco"
                                        type="text"
                                        value={formData.endereco}
                                        onChange={(e) => handleInputChange('endereco', e.target.value)}
                                        placeholder="Nome da rua ou avenida"
                                    />
                                </div>

                                {/* Número */}
                                <div className="form-group">
                                    <label htmlFor="numero">10 - Número</label>
                                    <input
                                        id="numero"
                                        type="text"
                                        value={formData.numero}
                                        onChange={(e) => handleInputChange('numero', e.target.value)}
                                        placeholder="Número"
                                    />
                                </div>

                                {/* Complemento */}
                                <div className="form-group">
                                    <label htmlFor="complemento">11 - Complemento</label>
                                    <input
                                        id="complemento"
                                        type="text"
                                        value={formData.complemento}
                                        onChange={(e) => handleInputChange('complemento', e.target.value)}
                                        placeholder="Apto, sala, etc."
                                    />
                                </div>

                                {/* Bairro */}
                                <div className="form-group">
                                    <label htmlFor="bairro">12 - Bairro</label>
                                    <input
                                        id="bairro"
                                        type="text"
                                        value={formData.bairro}
                                        onChange={(e) => handleInputChange('bairro', e.target.value)}
                                        placeholder="Nome do bairro"
                                    />
                                </div>

                                {/* Município */}
                                <div className="form-group">
                                    <label htmlFor="municipio">13 - Município</label>
                                    <input
                                        id="municipio"
                                        type="text"
                                        value={formData.municipio}
                                        onChange={(e) => handleInputChange('municipio', e.target.value)}
                                        placeholder="Nome do município"
                                    />
                                </div>

                                {/* UF */}
                                <div className="form-group">
                                    <label htmlFor="uf">14 - UF</label>
                                    <select
                                        id="uf"
                                        value={formData.uf}
                                        onChange={(e) => handleInputChange('uf', e.target.value)}
                                    >
                                        <option value="">Selecione o estado</option>
                                        {ufs.map(uf => (
                                            <option key={uf} value={uf}>{uf}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* CEP */}
                                <div className="form-group">
                                    <label htmlFor="cep">15 - CEP</label>
                                    <input
                                        id="cep"
                                        type="text"
                                        value={formData.cep}
                                        onChange={(e) => handleInputChange('cep', e.target.value)}
                                        placeholder="00000-000"
                                    />
                                </div>

                                {/* Categoria */}
                                <div className="form-group">
                                    <label htmlFor="category">16 - Ramo de Atividade</label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                    >
                                        <option value="">Selecione a categoria</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Número de Funcionários */}
                                <div className="form-group">
                                    <label htmlFor="numeroFuncionarios">17 - Número de Funcionários</label>
                                    <input
                                        id="numeroFuncionarios"
                                        type="number"
                                        value={formData.numeroFuncionarios}
                                        onChange={(e) => handleInputChange('numeroFuncionarios', e.target.value)}
                                        placeholder="Quantidade"
                                    />
                                </div>

                                {/* Número de Turnos */}
                                <div className="form-group">
                                    <label htmlFor="numeroTurnos">18 - Número de Turnos</label>
                                    <input
                                        id="numeroTurnos"
                                        type="number"
                                        value={formData.numeroTurnos}
                                        onChange={(e) => handleInputChange('numeroTurnos', e.target.value)}
                                        placeholder="Quantidade"
                                    />
                                </div>

                                {/* Responsável pela Manipulação */}
                                <div className="form-group full-width">
                                    <label htmlFor="responsavelManipulacao">19 - Responsável pela Atividade de Manipulação</label>
                                    <input
                                        id="responsavelManipulacao"
                                        type="text"
                                        value={formData.responsavelManipulacao}
                                        onChange={(e) => handleInputChange('responsavelManipulacao', e.target.value)}
                                        placeholder="Nome do responsável"
                                    />
                                </div>

                                {/* Representante Legal */}
                                <div className="form-group">
                                    <label htmlFor="representanteLegal">20 - Representante Legal</label>
                                    <input
                                        id="representanteLegal"
                                        type="text"
                                        value={formData.representanteLegal}
                                        onChange={(e) => handleInputChange('representanteLegal', e.target.value)}
                                        placeholder="Nome do representante"
                                    />
                                </div>

                                {/* CPF do Representante */}
                                <div className="form-group">
                                    <label htmlFor="cpfRepresentante">21 - CPF do Representante</label>
                                    <input
                                        id="cpfRepresentante"
                                        type="text"
                                        value={formData.cpfRepresentante}
                                        onChange={(e) => handleInputChange('cpfRepresentante', e.target.value)}
                                        placeholder="000.000.000-00"
                                    />
                                </div>

                                {/* Tipo */}
                                <div className="form-group">
                                    <label htmlFor="type">Tipo</label>
                                    <select
                                        id="type"
                                        value={formData.type}
                                        onChange={(e) => handleInputChange('type', e.target.value)}
                                    >
                                        <option value="">Selecione o tipo</option>
                                        <option value="Pública">Pública</option>
                                        <option value="Privada">Privada</option>
                                    </select>
                                </div>

                                {/* Login */}
                                <div className="form-group">
                                    <label htmlFor="login">Login da Entidade *</label>
                                    <input
                                        id="login"
                                        type="text"
                                        value={formData.login}
                                        onChange={(e) => handleInputChange('login', e.target.value)}
                                        placeholder="usuário para acesso"
                                        required
                                    />
                                </div>

                                {/* Senha */}
                                <div className="form-group">
                                    <label htmlFor="password">Senha da Entidade *</label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="senha para acesso"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Motivo da Inspeção */}
                            <div className="checkbox-group">
                                <label>22 - Motivo da Inspeção</label>
                                <div className="checkbox-grid">
                                    {motivosInspecao.map(motivo => (
                                        <div key={motivo} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                id={motivo}
                                                checked={formData.motivoInspecao.includes(motivo)}
                                                onChange={(e) => handleMotivoChange(motivo, e.target.checked)}
                                            />
                                            <label htmlFor={motivo}>{motivo}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="loading-btn">
                                        <div className="spinner"></div>
                                        <span>Salvando...</span>
                                    </div>
                                ) : (
                                    <div className="btn-content">
                                        <Save className="btn-icon" />
                                        <span>Cadastrar Entidade</span>
                                    </div>
                                )}
                            </button>
                            
                            <button 
                                type="button" 
                                className="btn-outline"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                <X className="btn-icon" />
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default CadEntyForm;