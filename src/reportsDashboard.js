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
        console.log('📋 Template clonado');
        
        // Preenche os dados do relatório
        const titleElement = card.querySelector('.report-title');
        const subtitleElement = card.querySelector('.report-subtitle');
        const startDateElement = card.querySelector('.start-date');
        const endDateElement = card.querySelector('.end-date');
        
        console.log('🔍 Elementos encontrados:', {
            title: !!titleElement,
            subtitle: !!subtitleElement,
            startDate: !!startDateElement,
            endDate: !!endDateElement
        });
        
        if (titleElement) {
            titleElement.textContent = report.title || 'Título não disponível';
            console.log('✅ Título definido:', titleElement.textContent);
        }
        if (subtitleElement) {
            subtitleElement.textContent = report.subtitle || 'Subtítulo não disponível';
            console.log('✅ Subtítulo definido:', subtitleElement.textContent);
        }
        if (startDateElement) {
            startDateElement.textContent = formatDate(report.start_date);
            console.log('✅ Data inicial definida:', startDateElement.textContent);
        }
        if (endDateElement) {
            endDateElement.textContent = formatDate(report.end_date);
            console.log('✅ Data final definida:', endDateElement.textContent);
        }
        
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
            console.log('✅ Botão configurado');
        }

        // Configura o link para visualizar relatório
        const viewReportLink = card.querySelector('.view-report');
        if (viewReportLink) {
            viewReportLink.href = report.external_url;
            console.log('✅ Link configurado:', viewReportLink.href);
        }

        reportsGrid.appendChild(card);
        console.log(`✅ Relatório ${index + 1} adicionado à lista`);
        
        // Verificar se o card foi realmente adicionado
        const addedCard = reportsGrid.lastElementChild;
        console.log('🔍 Último elemento adicionado:', addedCard ? addedCard.className : 'Nenhum');
    });
    
    console.log('🎉 Todos os relatórios foram processados e exibidos');
    
    // Verificação final - forçar atualização visual
    setTimeout(() => {
        // Verificação final
        const totalCards = reportsGrid.children.length;
        console.log(`📊 Total de cards criados (verificação final): ${totalCards}`);
        console.log('🔍 Estado final do reportsGrid:', reportsGrid);
        console.log('🔍 Estilo do reportsGrid:', getComputedStyle(reportsGrid));
        
        // Forçar reflow/repaint
        reportsGrid.style.display = 'none';
        reportsGrid.offsetHeight; // Trigger reflow
        reportsGrid.style.display = 'grid';
        
        // Verificar se há algum card visível
        const visibleCards = Array.from(reportsGrid.children).filter(card => {
            const style = getComputedStyle(card);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        });
        console.log(`👁️ Cards visíveis (verificação final): ${visibleCards.length}`);
        
        // Se ainda não há cards visíveis, mostrar fallback
        if (visibleCards.length === 0 && reports.length > 0) {
            console.log('⚠️ Criando fallback HTML simples');
            reportsGrid.innerHTML = reports.map(report => `
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h3 style="color: #333; margin-bottom: 10px;">${report.title}</h3>
                    <p style="color: #666; margin-bottom: 15px;">${report.subtitle}</p>
                    <div style="color: #888; margin-bottom: 15px;">
                        📅 ${formatDate(report.start_date)} até ${formatDate(report.end_date)}
                    </div>
                    <div style="display: flex; gap: 10px; flex-direction: column;">
                        <button onclick="window.location.href='/report-viewer.html?reportId=${report.id}&clientId=${report.client_id}&title=${encodeURIComponent(report.title)}'" 
                                style="padding: 10px 15px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; cursor: pointer;">
                            🚀 Ver Relatório
                        </button>
                        <a href="${report.external_url}" target="_blank" 
                           style="padding: 10px 15px; background: linear-gradient(135deg, #f093fb, #f5576c); color: white; text-decoration: none; border-radius: 8px; text-align: center;">
                            🌐 Abrir no Reportei
                        </a>
                    </div>
                </div>
            `).join('');
        }
    }, 500);
    
    console.log('✅ Display reports finalizado');
}

// Função auxiliar para formatar datas
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Reports Dashboard - Inicializando...');
    
    // Configurar botão de voltar
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = '/';
        });
        console.log('✅ Botão de voltar configurado');
    }
    
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
