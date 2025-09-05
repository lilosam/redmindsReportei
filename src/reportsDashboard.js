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
        openButton.addEventListener('click', () => {
            // Redireciona para nossa página de dashboard personalizado
            window.location.href = `/custom-dashboard.html?reportId=${report.id}&clientId=${report.client_id}&startDate=${report.start_date}&endDate=${report.end_date}`;
        });

        // Configura o link para visualizar relatório
        const viewReportLink = card.querySelector('.view-report');
        viewReportLink.href = report.external_url;

        // Configura o botão de análise
        const analyzeBtn = card.querySelector('.analyze-btn');
        analyzeBtn.addEventListener('click', () => analyzeReport(report.id, card));

        reportsGrid.appendChild(card);
    });
}

// Função para analisar um relatório específico usando IA
async function analyzeReport(reportId, cardElement) {
    try {
        const analyzeBtn = cardElement.querySelector('.analyze-btn');
        const aiAnalysis = cardElement.querySelector('.ai-analysis');
        const analysisContent = cardElement.querySelector('.analysis-content');

        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Analisando...';

        const response = await fetch(`/api/reports/${reportId}/analyze`);
        const data = await response.json();

        // Exibe os insights da IA
        analysisContent.innerHTML = formatAnalysis(data.analysis);
        aiAnalysis.classList.remove('hidden');

        analyzeBtn.textContent = 'Atualizar Análise';
        analyzeBtn.disabled = false;
    } catch (error) {
        console.error('Erro ao analisar relatório:', error);
        alert('Erro ao analisar relatório. Por favor, tente novamente.');
    }
}

// Função auxiliar para formatar datas
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Função para formatar a análise da IA
function formatAnalysis(analysis) {
    if (!analysis || !analysis.insights) return '';

    return analysis.insights
        .map(insight => `<p class="insight">${insight}</p>`)
        .join('');
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
