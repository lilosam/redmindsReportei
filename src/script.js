document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando...');
    const listClientsButton = document.getElementById('listClients');
    const searchInput = document.getElementById('searchInput');
    const clientList = document.getElementById('clientList');
    let allClients = [];

    if (!listClientsButton) console.error('Botão de listar clientes não encontrado!');
    if (!searchInput) console.error('Campo de busca não encontrado!');
    if (!clientList) console.error('Lista de clientes não encontrada!');

    // Função para buscar os clientes
    async function fetchClients() {
        try {
            const response = await fetch('/api/v1/clients');

            if (!response.ok) {
                throw new Error('Erro ao buscar clientes');
            }

            const data = await response.json();
            allClients = data.data;
            displayClients(allClients);
        } catch (error) {
            console.error('Erro:', error);
            clientList.innerHTML = '<p style="color: red;">Erro ao carregar os clientes.</p>';
        }
    }

    // Função para exibir os clientes
    function displayClients(clients) {
        if (!Array.isArray(clients)) {
            console.error('Dados de clientes inválidos:', clients);
            return;
        }

        clientList.innerHTML = '';

        clients.forEach(client => {
            const clientCard = document.createElement('div');
            clientCard.className = 'client-card';
            
            const clientName = document.createElement('h3');
            clientName.textContent = client.name;
            
            const viewButton = document.createElement('button');
            viewButton.textContent = 'Ver Relatórios';
            viewButton.className = 'view-button';
            
            viewButton.addEventListener('click', () => {
                window.location.href = `/reports-dashboard.html?clientId=${client.id}`;
            });

            clientCard.appendChild(clientName);
            clientCard.appendChild(viewButton);
            clientList.appendChild(clientCard);
        });
    }

    // Função para filtrar clientes
    function filterClients(searchTerm) {
        const filteredClients = allClients.filter(client => 
            client.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayClients(filteredClients);
    }

    // Event Listeners
    listClientsButton.addEventListener('click', fetchClients);
    
    searchInput.addEventListener('input', (e) => {
        filterClients(e.target.value);
    });

    // Carregar clientes automaticamente ao abrir a página
    fetchClients();
});
