// Função para carregar os relatórios do cliente
async function loadReports(clientId) {
    try {
        console.log(`📡 Fazendo requisição para: /api/v1/clients/${clientId}/reports`);
        
        const response = await fetch(`/api/v1/clients/${clientId}/reports`);
        console.log('📡 Status da resposta:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Dados recebidos:', data);
        console.log(`📊 ${data.data ? data.data.length : 0} relatórios encontrados`);
        
        displayReports(data.data);
    } catch (error) {
        console.error('❌ Erro ao carregar relatórios:', error);
        alert('Erro ao carregar relatórios. Por favor, tente novamente.');
    }
}

// Função para exibir os relatórios na interface
function displayReports(reports) {
    console.log('🎨 Iniciando displayReports com', reports ? reports.length : 0, 'relatórios');
    
    const reportsGrid = document.getElementById('reportsList');
    if (!reportsGrid) {
        console.error('❌ Elemento reportsList não encontrado');
        return;
    }
    console.log('✅ Elemento reportsList encontrado');

    const template = document.getElementById('reportCard');
    if (!template) {
        console.error('❌ Template reportCard não encontrado');
        return;
    }
    console.log('✅ Template reportCard encontrado');

    reportsGrid.innerHTML = ''; // Limpa a lista atual
    console.log('🧹 Lista de relatórios limpa');

    if (!Array.isArray(reports) || reports.length === 0) {
        console.log('📭 Nenhum relatório para exibir');
        reportsGrid.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">Nenhum relatório encontrado para este cliente.</p>';
        return;
    }

    reports.forEach((report, index) => {
        console.log(`📄 Processando relatório ${index + 1}:`, report.title);
        
        const card = template.content.cloneNode(true);
        
        // Preenche os dados do relatório
        const titleElement = card.querySelector('.report-title');
        const subtitleElement = card.querySelector('.report-subtitle');
        const startDateElement = card.querySelector('.start-date');
        const endDateElement = card.querySelector('.end-date');
        
        if (titleElement) titleElement.textContent = report.title || 'Título não disponível';
        if (subtitleElement) subtitleElement.textContent = report.subtitle || 'Subtítulo não disponível';
        if (startDateElement) startDateElement.textContent = formatDate(report.start_date);
        if (endDateElement) endDateElement.textContent = formatDate(report.end_date);
        
        // Configura o botão de abrir dashboard
        const openButton = card.querySelector('.open-dashboard');
        if (openButton) {
            openButton.textContent = 'Ver Relatório';
            openButton.addEventListener('click', () => {
                console.log(`🎯 Abrindo relatório: ${report.title}`);
                // Redireciona para o visualizador de relatório com iframe
                const encodedTitle = encodeURIComponent(report.title || 'Relatório');
                window.location.href = `/report-viewer.html?reportId=${report.id}&clientId=${report.client_id}&title=${encodedTitle}`;
            });
        }

        // Configura o link para visualizar relatório
        const viewReportLink = card.querySelector('.view-report');
        if (viewReportLink) {
            viewReportLink.href = report.external_url;
        }

        reportsGrid.appendChild(card);
        console.log(`✅ Relatório ${index + 1} adicionado à lista`);
    });
    
    console.log('🎉 Todos os relatórios foram processados e exibidos');
}

// Função auxiliar para formatar datas
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Reports Dashboard - Inicializando...');
    
    // Pegar o ID do cliente da URL
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');
    
    console.log('📋 Parâmetros da URL:', { clientId });
    
    if (clientId) {
        console.log(`🎯 Carregando relatórios para cliente ID: ${clientId}`);
        loadReports(clientId);
    } else {
        console.error('❌ ID do cliente não fornecido na URL');
        alert('ID do cliente não fornecido. Redirecionando para a página inicial.');
        window.location.href = '/';
    }
});
