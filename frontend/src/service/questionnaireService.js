// src/services/questionnaireService.js
export const questionnaireService = {
  async salvarQuestionario(dados) {
    // TODO: Implementar chamada real para a API
    console.log('Dados para salvar:', dados);
    
    // Simulando uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: '123', status: 'success' });
      }, 1000);
    });
  },

  async buscarPorEmpresa(empresaId) {
    // TODO: Implementar chamada real para a API
    console.log('Buscando questionário para empresa:', empresaId);
    
    // Simulando que não encontrou questionário
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 500);
    });
  }
};