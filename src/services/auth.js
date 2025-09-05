// Token atual
let currentToken = 'JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys';

// Headers padrão para todas as requisições
const getHeaders = () => ({
    'Authorization': `Bearer ${currentToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

// Função para verificar se o token é válido
const checkToken = async () => {
    try {
        const response = await fetch('https://app.reportei.com/api/v1/clients', {
            headers: getHeaders()
        });

        if (!response.ok) {
            // Se receber 401 ou 403, o token é inválido
            if (response.status === 401 || response.status === 403) {
                throw new Error('Token inválido ou expirado');
            }
            throw new Error(`Erro na verificação do token: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return false;
    }
};

// Função para renovar o token (implementar conforme necessário)
const refreshToken = async () => {
    // Aqui você implementaria a lógica para renovar o token
    // Por exemplo, fazer uma requisição para um endpoint de refresh
    throw new Error('Necessário renovar o token de autenticação');
};

module.exports = {
    getHeaders,
    checkToken,
    refreshToken
};
