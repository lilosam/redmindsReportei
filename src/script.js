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
            const response = await fetch('http://localhost:3000/api/v1/clients');

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
    async function fetchCampaigns(clientId) {
        try {
            console.log(`Buscando campanhas para o cliente ${clientId}`);
            const response = await fetch(`http://localhost:3000/api/v1/clients/${clientId}/integrations`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Erro na resposta: Status ${response.status}`, errorText);
                throw new Error(`Erro ao buscar campanhas: ${response.status}`);
            }

            const data = await response.json();
            console.log('Dados recebidos:', data);
            
            // Garante que sempre retornamos um array, mesmo que vazio
            return data.data || [];
        } catch (error) {
            console.error('Erro detalhado:', error);
            throw error;
        }
    }

    function displayClients(clients) {
        console.log('Exibindo clientes:', clients);
        clientList.innerHTML = '';
        
        if (!Array.isArray(clients)) {
            console.error('clients não é um array:', clients);
            return;
        }
        
        clients.forEach(client => {
            console.log('Criando elemento para cliente:', client);
            const clientElement = document.createElement('div');
            clientElement.className = 'client-item';
            
            const clientContent = document.createElement('div');
            clientContent.style.cursor = 'pointer';  // Adiciona cursor pointer para indicar que é clicável
            clientContent.innerHTML = `
                <span class="client-name">${client.name}</span>
                <span class="client-id">ID: ${client.id}</span>
            `;

            const campaignsList = document.createElement('div');
            campaignsList.className = 'campaigns-list';
            
            clientElement.appendChild(clientContent);
            clientElement.appendChild(campaignsList);
            
            clientContent.addEventListener('click', async () => {
                console.log('Cliente clicado:', client.name, 'ID:', client.id);
                // Toggle campaigns list
                const isActive = campaignsList.classList.contains('active');
                console.log('Estado atual da lista de campanhas:', isActive ? 'ativa' : 'inativa');
                
                if (!isActive && !campaignsList.hasAttribute('data-loaded')) {
                    console.log('Iniciando carregamento das campanhas...');
                    campaignsList.innerHTML = '<div class="loading">Carregando campanhas...</div>';
                    campaignsList.classList.add('active');
                    
                    try {
                        const campaigns = await fetchCampaigns(client.id);
                        campaignsList.innerHTML = '';
                        
                        if (campaigns.length === 0) {
                            campaignsList.innerHTML = '<div class="campaign-item">Nenhuma campanha encontrada</div>';
                        } else {
                            campaigns.forEach(campaign => {
                                const campaignElement = document.createElement('div');
                                campaignElement.className = 'campaign-item';
                                const campaignName = campaign.full_name || campaign.name || 'Sem nome';
                                campaignElement.innerHTML = `
                                    <div>${campaignName}</div>
                                `;
                                campaignElement.style.cursor = 'pointer';
                                
                                // Adicionar evento de clique para navegar para a página de detalhes
                                campaignElement.addEventListener('click', () => {
                                    const url = `campaign-details.html?id=${campaign.id}&name=${encodeURIComponent(campaignName)}`;
                                    window.location.href = url;
                                });
                                
                                campaignsList.appendChild(campaignElement);
                            });
                        }
                        
                        campaignsList.setAttribute('data-loaded', 'true');
                    } catch (error) {
                        campaignsList.innerHTML = '<div class="error-message">Erro ao carregar campanhas</div>';
                    }
                } else {
                    campaignsList.classList.toggle('active');
                }
            });
            
            clientList.appendChild(clientElement);
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
});
