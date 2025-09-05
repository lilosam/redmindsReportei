document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Redminds Reportei - Inicializando...');
    
    // Elementos da interface
    const listClientsButton = document.getElementById('listClients');
    const searchInput = document.getElementById('searchInput');
    const clientList = document.getElementById('clientList');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const heroStats = document.getElementById('heroStats');
    const totalClientsSpan = document.getElementById('totalClients');
    const totalReportsSpan = document.getElementById('totalReports');
    const searchCount = document.getElementById('searchCount');
    const resultsCount = document.getElementById('resultsCount');
    const viewControls = document.getElementById('viewControls');
    
    let allClients = [];
    let currentView = 'grid';

    // Validar elementos
    if (!listClientsButton) console.error('❌ Botão de listar clientes não encontrado!');
    if (!searchInput) console.error('❌ Campo de busca não encontrado!');
    if (!clientList) console.error('❌ Lista de clientes não encontrada!');

    // Função para mostrar loading
    function showLoading() {
        loadingState.style.display = 'block';
        emptyState.style.display = 'none';
        clientList.innerHTML = '';
        searchCount.style.display = 'none';
    }

    // Função para esconder loading
    function hideLoading() {
        loadingState.style.display = 'none';
    }

    // Função para mostrar empty state
    function showEmptyState() {
        emptyState.style.display = 'block';
        hideLoading();
        clientList.innerHTML = '';
        searchCount.style.display = 'none';
    }

    // Função para gerar iniciais do nome
    function getInitials(name) {
        return name.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    // Função para gerar cor baseada no nome
    function getColorFromName(name) {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)'
        ];
        const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return colors[hash % colors.length];
    }

    // Função para buscar os clientes
    async function fetchClients() {
        try {
            console.log('📡 Buscando clientes...');
            showLoading();
            
            const response = await fetch('/api/v1/clients');

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            allClients = data.data || [];
            
            console.log(`✅ ${allClients.length} clientes carregados`);
            
            if (allClients.length === 0) {
                showEmptyState();
            } else {
                displayClients(allClients);
                updateStats();
                showViewControls();
            }
            
            hideLoading();
        } catch (error) {
            console.error('❌ Erro ao buscar clientes:', error);
            hideLoading();
            clientList.innerHTML = `
                <div class="error-card">
                    <h3>❌ Erro ao carregar clientes</h3>
                    <p>Não foi possível conectar com o servidor.</p>
                    <button onclick="location.reload()" class="retry-button">🔄 Tentar Novamente</button>
                </div>
            `;
        }
    }

    // Função para exibir os clientes
    function displayClients(clients) {
        if (!Array.isArray(clients)) {
            console.error('❌ Dados de clientes inválidos:', clients);
            return;
        }

        clientList.innerHTML = '';
        clientList.className = `clients-grid ${currentView === 'list' ? 'list-view' : ''}`;

        clients.forEach((client, index) => {
            const clientCard = document.createElement('div');
            clientCard.className = 'client-card';
            clientCard.style.animationDelay = `${index * 0.1}s`;
            
            const initials = getInitials(client.name);
            const avatarColor = getColorFromName(client.name);
            
            // Simular dados de relatórios (substituir por dados reais quando disponível)
            const reportCount = Math.floor(Math.random() * 15) + 1;
            const lastUpdate = Math.floor(Math.random() * 30) + 1;
            
            clientCard.innerHTML = `
                <div class="client-status"></div>
                <div class="client-header">
                    <div class="client-avatar" style="background: ${avatarColor}">
                        ${initials}
                    </div>
                    <div class="client-info">
                        <h3 class="client-name">${client.name}</h3>
                        <span class="client-id">ID: ${client.id}</span>
                    </div>
                </div>
                <div class="client-meta">
                    <div class="meta-item">
                        <span class="meta-number">${reportCount}</span>
                        <span class="meta-label">Relatórios</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-number">${lastUpdate}d</span>
                        <span class="meta-label">Última Atualização</span>
                    </div>
                </div>
            `;
            
            clientCard.addEventListener('click', () => {
                console.log(`🎯 Navegando para relatórios do cliente: ${client.name}`);
                window.location.href = `/reports-dashboard.html?clientId=${client.id}`;
            });

            clientList.appendChild(clientCard);
        });

        // Atualizar contadores
        updateSearchCount(clients.length);
    }

    // Função para atualizar estatísticas
    function updateStats() {
        const totalReports = allClients.reduce((sum, client) => {
            return sum + (Math.floor(Math.random() * 15) + 1); // Simular dados
        }, 0);
        
        totalClientsSpan.textContent = allClients.length;
        totalReportsSpan.textContent = totalReports;
        
        heroStats.style.display = 'flex';
    }

    // Função para atualizar contador de busca
    function updateSearchCount(count) {
        if (count < allClients.length) {
            resultsCount.textContent = count;
            searchCount.style.display = 'block';
        } else {
            searchCount.style.display = 'none';
        }
    }

    // Função para mostrar controles de visualização
    function showViewControls() {
        viewControls.style.display = 'flex';
    }

    // Função para filtrar clientes
    function filterClients(searchTerm) {
        const filteredClients = allClients.filter(client => 
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.id.toString().includes(searchTerm)
        );
        displayClients(filteredClients);
        
        console.log(`🔍 Busca: "${searchTerm}" - ${filteredClients.length} resultados`);
    }

    // Event Listeners
    listClientsButton.addEventListener('click', fetchClients);
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        if (allClients.length > 0) {
            filterClients(searchTerm);
        }
    });

    // Controles de visualização
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-toggle')) {
            const view = e.target.dataset.view;
            currentView = view;
            
            // Atualizar botões ativos
            document.querySelectorAll('.view-toggle').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Atualizar visualização
            if (allClients.length > 0) {
                displayClients(allClients);
            }
            
            console.log(`👁️ Visualização alterada para: ${view}`);
        }
    });

    // Inicialização
    console.log('🎯 Sistema pronto! Clique em "Carregar Clientes" para começar.');
});
