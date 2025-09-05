document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('reportId');
    const clientId = urlParams.get('clientId');
    const startDate = urlParams.get('startDate');
    const endDate = urlParams.get('endDate');

    if (!reportId || !clientId) {
        alert('Parâmetros inválidos');
        return;
    }

    try {
        console.log('Buscando dados do relatório:', clientId, reportId);
        
        // Primeiro, buscar o relatório específico
        const reportResponse = await fetch(`/api/v1/clients/${clientId}/reports/${reportId}`);
        if (!reportResponse.ok) {
            throw new Error(`Erro ao buscar relatório: ${reportResponse.status}`);
        }
        
        const reportData = await reportResponse.json();
        console.log('Dados do relatório recebidos:', reportData);
        
        if (!reportData.data || !reportData.data.external_url) {
            throw new Error('URL do relatório não encontrada nos dados');
        }

        console.log('URL do relatório:', reportData.data.external_url);

        // Agora buscar os dados do relatório original
        const dashboardResponse = await fetch(`/api/proxy?url=${encodeURIComponent(reportData.data.external_url)}`);
        const data = await dashboardResponse.json();
        
        if (!data || !data.data) {
            throw new Error('Dados inválidos recebidos do servidor');
        }

        console.log('Dados recebidos para o dashboard:', data);

        // Atualizar título e datas
        document.getElementById('dashboardTitle').textContent = data.data.title || 'Relatório Personalizado';
        document.getElementById('dateRange').textContent = 
            `${formatDate(startDate)} - ${formatDate(endDate)}`;

        // Processar e exibir os dados
        processMetrics(data.data);
        createCharts(data.data);
        createTables(data.data);

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        alert('Erro ao carregar os dados do dashboard');
    }
});

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function processMetrics(data) {
    const metricsContainer = document.getElementById('mainMetrics');
    // Aqui você processa os dados e cria os cards de métricas
    const metrics = [
        { label: 'Visualizações', value: data.pageviews || 0 },
        { label: 'Usuários', value: data.users || 0 },
        { label: 'Taxa de Conversão', value: `${(data.conversion_rate || 0).toFixed(2)}%` },
        { label: 'Tempo Médio', value: formatTime(data.avg_time || 0) }
    ];

    metrics.forEach(metric => {
        const metricCard = createMetricCard(metric);
        metricsContainer.appendChild(metricCard);
    });
}

function createMetricCard(metric) {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML = `
        <h4>${metric.label}</h4>
        <div class="metric-value">${metric.value}</div>
    `;
    return card;
}

function createCharts(data) {
    if (!data || !data.views_data || !data.dates) {
        console.error('Dados insuficientes para criar os gráficos');
        return;
    }

    // Criar gráfico de visualizações
    const viewsCtx = document.getElementById('viewsChart');
    if (!viewsCtx) {
        console.error('Elemento do gráfico não encontrado');
        return;
    }
    
    new Chart(viewsCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: data.dates || [],
            datasets: [{
                label: 'Visualizações',
                data: data.views_data || [],
                borderColor: '#3498db',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Criar gráfico de engajamento
    const engagementCtx = document.getElementById('engagementChart').getContext('2d');
    new Chart(engagementCtx, {
        type: 'pie',
        data: {
            labels: ['Direto', 'Orgânico', 'Social', 'Referral'],
            datasets: [{
                data: [
                    data.direct_traffic || 0,
                    data.organic_traffic || 0,
                    data.social_traffic || 0,
                    data.referral_traffic || 0
                ],
                backgroundColor: ['#2ecc71', '#3498db', '#9b59b6', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function createTables(data) {
    // Criar tabela de top páginas
    const topPagesContainer = document.getElementById('topPages');
    createDataTable(topPagesContainer, data.top_pages || [], ['Página', 'Visualizações']);

    // Criar tabela de fontes de tráfego
    const sourcesContainer = document.getElementById('trafficSources');
    createDataTable(sourcesContainer, data.traffic_sources || [], ['Fonte', 'Sessões']);
}

function createDataTable(container, data, headers) {
    const table = document.createElement('table');
    table.className = 'data-table';
    
    // Criar cabeçalho
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    table.appendChild(thead);

    // Criar corpo da tabela
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.appendChild(table);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
}
