import api from './api';

export const entidadeService = {
  async cadastrarEntidade(entidadeData) {
    try {
      const response = await api.post('/empresas', entidadeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao cadastrar entidade');
    }
  },

  async listarEntidades() {
    try {
      const response = await api.get('/empresas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar empresas');
    }
  },

  async buscarEntidadePorId(id) {
    try {
      const response = await api.get(`/empresas/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar entidade');
    }
  },

  async atualizarEntidade(id, entidadeData) {
    try {      
      const response = await api.put(`/empresas/${id}`, entidadeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar entidade');
    }
  },

  async excluirEntidade(id) {
    try {      
      const response = await api.delete(`/empresas/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao excluir entidade');
    }
  }
};