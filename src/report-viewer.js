document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('reportId');
    const clientId = urlParams.get('clientId');
    const reportTitle = urlParams.get('title') || 'Relatório';

    // Elementos da página - atualizados para corresponder ao novo HTML
    const titleElement = document.getElementById('reportTitle');
    const backBtn = document.getElementById('backBtn');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const reportIframe = document.getElementById('reportIframe');

    // Configurar título com emoji
    titleElement.textContent = `🔍 ${decodeURIComponent(reportTitle)}`;
    document.title = `🔍 ${decodeURIComponent(reportTitle)} - Redminds Reportei`;

    // Configurar botão de voltar
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (clientId) {
            window.location.href = `/reports-dashboard.html?clientId=${clientId}`;
        } else {
            window.history.back();
        }
    });

    if (!reportId || !clientId) {
        showError('Parâmetros inválidos. ID do relatório ou cliente não fornecido.');
        return;
    }

    try {
        // Buscar detalhes do relatório
        console.log('🔍 Buscando relatório:', { clientId, reportId });
        
        const response = await fetch(`/api/v1/clients/${clientId}/reports/${reportId}`);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar relatório: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📊 Dados do relatório:', data);

        if (!data.data || !data.data.external_url) {
            throw new Error('URL do relatório não encontrada');
        }

        const reportUrl = data.data.external_url;
        console.log('🌐 URL do relatório:', reportUrl);

        // Tentar carregar o relatório no iframe
        await loadReportInIframe(reportUrl);

    } catch (error) {
        console.error('❌ Erro ao carregar relatório:', error);
        showError(error.message);
    }
});

async function loadReportInIframe(url) {
    const loadingMessage = document.getElementById('loadingMessage');
    const reportIframe = document.getElementById('reportIframe');

    return new Promise((resolve, reject) => {
        // Configurar o iframe
        reportIframe.src = url;

        // Timeout para carregamento
        const timeout = setTimeout(() => {
            console.warn('⏰ Timeout no carregamento do iframe');
            // Mesmo com timeout, vamos mostrar o iframe
            showIframe();
            resolve();
        }, 10000); // 10 segundos

        // Quando o iframe carregar
        reportIframe.onload = () => {
            console.log('✅ Iframe carregado com sucesso');
            clearTimeout(timeout);
            showIframe();
            resolve();
        };

        // Se houver erro no carregamento
        reportIframe.onerror = (error) => {
            console.error('❌ Erro ao carregar iframe:', error);
            clearTimeout(timeout);
            
            // Tentar mostrar mesmo assim, pois alguns sites bloqueiam o evento onload
            setTimeout(() => {
                showIframe();
                resolve();
            }, 2000);
        };

        // Fallback: após 5 segundos, mostrar o iframe de qualquer forma
        setTimeout(() => {
            console.log('🔄 Fallback: mostrando iframe após 5 segundos');
            showIframe();
        }, 5000);
    });
}

function showIframe() {
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const reportIframe = document.getElementById('reportIframe');
    
    loadingMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    reportIframe.style.display = 'block';
    
    console.log('🎯 Iframe exibido com sucesso');
}

function showError(message) {
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    loadingMessage.style.display = 'none';
    if (errorText) {
        errorText.textContent = message;
    }
    errorMessage.style.display = 'flex';
    
    console.error('💥 Erro exibido:', message);
}

// Adicionar eventos de teclado para melhor UX
document.addEventListener('keydown', (e) => {
    const backBtn = document.getElementById('backBtn');
    
    // ESC para voltar
    if (e.key === 'Escape') {
        backBtn.click();
    }
    
    // F5 ou Ctrl+R para recarregar
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        location.reload();
    }
});

// Adicionar suporte ao botão de retry se existir
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('retry-button')) {
        e.preventDefault();
        location.reload();
    }
});
