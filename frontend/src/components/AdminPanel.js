import React, { useState, useEffect } from "react";
import { 
  Building, 
  Users, 
  UserCog,  
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Shield,
  ArrowLeft
} from "lucide-react";
import { Undo } from "lucide-react";
function AdminPanel({ onBack }) {
  const [activeTab, setActiveTab] = useState("empresas");
  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [currentItem, setCurrentItem] = useState(null);

  // Dados mockados para exemplo
  useEffect(() => {
    // Simulando carregamento de dados
    setEmpresas([
      { id: 1, nome: "Restaurante Central", cnpj: "12.345.678/0001-90", status: "ativo" },
      { id: 2, nome: "Padaria Doce Pão", cnpj: "98.765.432/0001-10", status: "ativo" },
      { id: 3, nome: "Lanchonete Rápido", cnpj: "11.222.333/0001-44", status: "inativo" }
    ]);

    setUsuarios([
      { id: 1, nome: "João Silva", email: "joao@empresa.com", tipo: "admin", empresa: "Restaurante Central", status: "ativo" },
      { id: 2, nome: "Maria Santos", email: "maria@empresa.com", tipo: "gerente", empresa: "Padaria Doce Pão", status: "ativo" },
      { id: 3, nome: "Pedro Costa", email: "pedro@empresa.com", tipo: "usuario", empresa: "Lanchonete Rápido", status: "inativo" }
    ]);

    setTiposUsuario([
      { id: 1, nome: "Administrador", permissoes: ["todos"] },
      { id: 2, nome: "Gerente", permissoes: ["visualizar", "editar"] },
      { id: 3, nome: "Usuário", permissoes: ["visualizar"] }
    ]);
  }, []);

  const filteredData = {
    empresas: empresas.filter(empresa => 
      empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.cnpj.includes(searchTerm)
    ),
    usuarios: usuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    tiposUsuario: tiposUsuario.filter(tipo =>
      tipo.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  const handleCreate = (data) => {
    const newId = Math.max(...filteredData[activeTab].map(item => item.id)) + 1;
    const newItem = { id: newId, ...data, status: "ativo" };
    
    switch(activeTab) {
      case "empresas":
        setEmpresas([...empresas, newItem]);
        break;
      case "usuarios":
        setUsuarios([...usuarios, newItem]);
        break;
      case "tiposUsuario":
        setTiposUsuario([...tiposUsuario, newItem]);
        break;
    }
    setShowModal(false);
  };

  const handleEdit = (data) => {
    switch(activeTab) {
      case "empresas":
        setEmpresas(empresas.map(emp => emp.id === currentItem.id ? { ...emp, ...data } : emp));
        break;
      case "usuarios":
        setUsuarios(usuarios.map(user => user.id === currentItem.id ? { ...user, ...data } : user));
        break;
      case "tiposUsuario":
        setTiposUsuario(tiposUsuario.map(tipo => tipo.id === currentItem.id ? { ...tipo, ...data } : tipo));
        break;
    }
    setShowModal(false);
    setCurrentItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      switch(activeTab) {
        case "empresas":
          setEmpresas(empresas.filter(emp => emp.id !== id));
          break;
        case "usuarios":
          setUsuarios(usuarios.filter(user => user.id !== id));
          break;
        case "tiposUsuario":
          setTiposUsuario(tiposUsuario.filter(tipo => tipo.id !== id));
          break;
      }
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item);
    setShowModal(true);
  };

  const renderTable = () => {
    const data = filteredData[activeTab];
    
    switch(activeTab) {
      case "empresas":
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CNPJ</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map(empresa => (
                <tr key={empresa.id}>
                  <td>{empresa.nome}</td>
                  <td>{empresa.cnpj}</td>
                  <td>
                    <span className={`status-badge ${empresa.status}`}>
                      {empresa.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button onClick={() => openModal("edit", empresa)} className="btn-edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(empresa.id)} className="btn-delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "usuarios":
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Empresa</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.tipo}</td>
                  <td>{usuario.empresa}</td>
                  <td>
                    <span className={`status-badge ${usuario.status}`}>
                      {usuario.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button onClick={() => openModal("edit", usuario)} className="btn-edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(usuario.id)} className="btn-delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "tiposUsuario":
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Permissões</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map(tipo => (
                <tr key={tipo.id}>
                  <td>{tipo.nome}</td>
                  <td>{tipo.permissoes.join(", ")}</td>
                  <td className="actions">
                    <button onClick={() => openModal("edit", tipo)} className="btn-edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(tipo.id)} className="btn-delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="header-padrao">
        <button className="btn-voltar" onClick={onBack}>
        <Undo size={22} />
      </button>
        <div className="admin-title">
          <Shield size={24} />
          <h1>Painel Administrativo</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === "empresas" ? "active" : ""}`}
          onClick={() => setActiveTab("empresas")}
        >
          <Building size={18} />
          Empresas
        </button>
        <button 
          className={`tab-button ${activeTab === "usuarios" ? "active" : ""}`}
          onClick={() => setActiveTab("usuarios")}
        >
          <Users size={18} />
          Usuários
        </button>
        <button 
          className={`tab-button ${activeTab === "tiposUsuario" ? "active" : ""}`}
          onClick={() => setActiveTab("tiposUsuario")}
        >
          <UserCog size={18} />
          Tipos de Usuário
        </button>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="search-container">
          <Search size={18} />
          <input
            type="text"
            placeholder={`Pesquisar ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button 
          onClick={() => openModal("create")}
          className="btn-primary"
        >
          <Plus size={18} />
          Adicionar {activeTab === "tiposUsuario" ? "Tipo" : activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {filteredData[activeTab].length === 0 ? (
          <div className="empty-state">
            <p>Nenhum item encontrado.</p>
          </div>
        ) : (
          renderTable()
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AdminModal
          type={modalType}
          itemType={activeTab}
          item={currentItem}
          onClose={() => {
            setShowModal(false);
            setCurrentItem(null);
          }}
          onSubmit={modalType === "create" ? handleCreate : handleEdit}
          empresas={empresas}
          tiposUsuario={tiposUsuario}
        />
      )}
    </div>
  );
}

// Componente Modal para criar/editar
function AdminModal({ type, itemType, item, onClose, onSubmit, empresas, tiposUsuario }) {
  const [formData, setFormData] = useState(
    item || (itemType === "empresas" ? { nome: "", cnpj: "" } :
            itemType === "usuarios" ? { nome: "", email: "", tipo: "", empresa: "", senha: "" } :
            { nome: "", permissoes: [] })
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {type === "create" ? "Adicionar" : "Editar"} {
              itemType === "empresas" ? "Empresa" :
              itemType === "usuarios" ? "Usuário" : "Tipo de Usuário"
            }
          </h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {itemType === "empresas" && (
            <>
              <div className="form-group">
                <label>Nome da Empresa</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>CNPJ</label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => handleChange("cnpj", e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {itemType === "usuarios" && (
            <>
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
              {type === "create" && (
                <div className="form-group">
                  <label>Senha</label>
                  <input
                    type="password"
                    value={formData.senha}
                    onChange={(e) => handleChange("senha", e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label>Tipo de Usuário</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleChange("tipo", e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  {tiposUsuario.map(tipo => (
                    <option key={tipo.id} value={tipo.nome}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Empresa</label>
                <select
                  value={formData.empresa}
                  onChange={(e) => handleChange("empresa", e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  {empresas.map(empresa => (
                    <option key={empresa.id} value={empresa.nome}>
                      {empresa.nome}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {itemType === "tiposUsuario" && (
            <>
              <div className="form-group">
                <label>Nome do Tipo</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Permissões</label>
                <div className="permissions-grid">
                  {["visualizar", "editar", "excluir", "criar", "todos"].map(permissao => (
                    <label key={permissao} className="permission-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.permissoes?.includes(permissao)}
                        onChange={(e) => {
                          const newPermissoes = e.target.checked
                            ? [...(formData.permissoes || []), permissao]
                            : formData.permissoes.filter(p => p !== permissao);
                          handleChange("permissoes", newPermissoes);
                        }}
                      />
                      {permissao}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {type === "create" ? "Criar" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;