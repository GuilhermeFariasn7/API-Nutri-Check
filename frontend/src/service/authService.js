import api from './api';

export const authService = {
    async login(credentials) {
        try {
            console.log('Enviando para backend:', credentials);
            const response = await api.post('/auth/login', {
                login: credentials.username,
                senha: credentials.password
            });

            console.log('RESPOSTA COMPLETA DO LOGIN:', response.data);

            // Apenas salva os dados se a resposta for bem-sucedida
            if (response.data.token) {
                localStorage.setItem('userToken', response.data.token);

                // Usar 'tipo' em vez de 'role' já que o backend retorna 'tipo'
                const userData = {
                    ...response.data.user,
                    role: response.data.user.tipo, // Mapear tipo para role
                    tipo: response.data.user.tipo  // Manter o original também
                };

                console.log('Salvando userData no localStorage:', userData);
                localStorage.setItem('userData', JSON.stringify(userData));
            }

            return response.data;

        } catch (error) {
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erro ao criar conta');
        }
    },

    logout() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
    },

    getToken() {
        return localStorage.getItem('userToken');
    },

    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },

    isAuthenticated() {
        return !!this.getToken();
    },


    getUserType() {
        const user = this.getUserData();
        return user ? (user.role || user.tipo) : null; // Tentar role primeiro, depois tipo
    },
};
