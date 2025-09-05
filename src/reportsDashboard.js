// Função para carregar os relatórios do cliente
async function loadReports(clientId) {
    try {
        const response = await fetch(`/api/v1/clients/${clientId}/reports`);
        const data = await response.json();
        displayReports(data.data);
    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        alert('Erro ao carregar relatórios. Por favor, tente novamente.');
    }
}

// Função para exibir os relatórios na interface
function displayReports(reports) {
    const reportsGrid = document.getElementById('reportsList');
    if (!reportsGrid) {
        console.error('Elemento reportsList não encontrado');
        return;
    }

    const template = document.getElementById('reportCard');
    if (!template) {
        console.error('Template reportCard não encontrado');
        return;
    }

    reportsGrid.innerHTML = ''; // Limpa a lista atual

    reports.forEach(report => {
        const card = template.content.cloneNode(true);
        
        // Preenche os dados do relatório
        card.querySelector('.report-title').textContent = report.title;
        card.querySelector('.report-subtitle').textContent = report.subtitle;
        card.querySelector('.start-date').textContent = formatDate(report.start_date);
        card.querySelector('.end-date').textContent = formatDate(report.end_date);
        
        // Configura o botão de abrir dashboard
        const openButton = card.querySelector('.open-dashboard');
        openButton.textContent = 'Ver Relatório';
        openButton.addEventListener('click', () => {
            // Redireciona para o visualizador de relatório com iframe
            const encodedTitle = encodeURIComponent(report.title || 'Relatório');
            window.location.href = `/report-viewer.html?reportId=${report.id}&clientId=${report.client_id}&title=${encodedTitle}`;
        });

        // Configura o link para visualizar relatório
        const viewReportLink = card.querySelector('.view-report');
        viewReportLink.href = report.external_url;

        reportsGrid.appendChild(card);
    });
}

// Função auxiliar para formatar datas
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Pegar o ID do cliente da URL
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');

    if (clientId) {
        loadReports(clientId);
    } else {
        alert('ID do cliente não fornecido');
    }
});
