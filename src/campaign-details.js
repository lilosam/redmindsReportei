document.addEventListener('DOMContentLoaded', () => {
    const widgetsList = document.getElementById('widgetsList');
    const reportTitle = document.getElementById('campaignTitle');
    
    // Pegar o ID do cliente e do relatório da URL
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');
    const reportId = urlParams.get('id');
    const integrationId = urlParams.get('integrationId'); // Adicionado
    const campaignName = urlParams.get('name'); // Adicionado
    
    if (campaignName && reportTitle) {
        reportTitle.textContent = campaignName;
    }

    async function fetchWidgets(integrationId) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/integrations/${integrationId}/widgets`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar widgets');
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }

    async function fetchReportDetails(clientId, reportId) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/clients/${clientId}/reports/${reportId}`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar detalhes do relatório');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }

    async function fetchWidgetValues(integrationId, widgets) {
        try {
            // Preparar as datas
            const today = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            
            const formatDate = (date) => {
                return date.toISOString().split('T')[0];
            };
            
            // Filtrar e preparar widgets válidos
            const validWidgets = widgets
                .filter(w => w && w.reference_key && Array.isArray(w.metrics) && w.metrics.length > 0)
                .map(widget => {
                    // Garantir que cada widget tenha uma estrutura válida
                    const formattedWidget = {
                        id: widget.reference_key,  // Usando reference_key como ID
                        reference_key: widget.reference_key,
                        component: widget.component || 'number_v1',
                        metrics: widget.metrics.filter(m => typeof m === 'string')  // Garantir que métricas são strings
                    };
                    console.log('Widget formatado:', formattedWidget);
                    return formattedWidget;
                });
            
            console.log(`Widgets válidos: ${validWidgets.length} de ${widgets.length}`);
            
            if (validWidgets.length === 0) {
                console.warn('Nenhum widget válido encontrado');
                return {};
            }
            
            // Preparar o payload
            const payload = {
                start: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)),
                end: formatDate(today),
                widgets: validWidgets
            };

            console.log('Enviando payload:', JSON.stringify(payload, null, 2));
            
            const response = await fetch(`http://localhost:3000/api/v1/integrations/${integrationId}/widgets/value`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            let responseData;
            try {
                responseData = await response.json();
            } catch (e) {
                const text = await response.text();
                console.error('Erro ao parsear resposta:', text);
                throw new Error('Resposta inválida do servidor');
            }

            if (!response.ok) {
                console.error('Erro na resposta:', responseData);
                throw new Error(responseData.details?.message || responseData.error || 'Erro ao buscar valores dos widgets');
            }

            // Verificar se temos dados válidos
            if (!responseData.data || responseData.data.exception) {
                console.error('Dados inválidos recebidos:', responseData);
                throw new Error(responseData.data?.exception || 'Dados inválidos recebidos');
            }

            return responseData.data || {};
        } catch (error) {
            console.error('Erro ao buscar valores dos widgets:', error);
            throw new Error(`Falha ao carregar dados: ${error.message}`);
        }
    }

    function formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toLocaleString();
    }

    function createMetricCard(widget, values) {
        const widgetData = values[widget.reference_key];  // Usando reference_key em vez de id
        if (!widgetData) {
            console.log('Sem dados para o widget:', widget.reference_key);
            return null;
        }

        const trend = widgetData.trend?.data || [];
        const currentValue = widgetData.values;

        const cardElement = document.createElement('div');
        cardElement.className = 'metric-card';

        cardElement.innerHTML = `
            <div class="metric-header">
                <h3>${widget.name || 'Métrica'}</h3>
                <span class="metric-type">${widget.reference_key || ''}</span>
            </div>
            <div class="metric-value">
                ${formatNumber(currentValue)}
            </div>
            <div class="metric-trend">
                ${trend.map(value => `<span class="trend-point" style="--value: ${value}"></span>`).join('')}
            </div>
        `;

        return cardElement;
    }

    async function displayWidgets(widgets) {
        widgetsList.innerHTML = '';
        
        if (!widgets || widgets.length === 0) {
            widgetsList.innerHTML = '<div class="widget-item">Nenhum widget encontrado</div>';
            return;
        }

        // Adicionar loading state
        widgetsList.innerHTML = '<div class="loading">Carregando métricas...</div>';

        try {
            console.log('Widgets para processar:', widgets);
            const values = await fetchWidgetValues(integrationId, widgets);
            
            if (!values) {
                widgetsList.innerHTML = '<div class="error-message">Erro ao carregar valores das métricas</div>';
                return;
            }

            // Limpar loading
            widgetsList.innerHTML = '';

            // Container para o grid de métricas
            const metricsGrid = document.createElement('div');
            metricsGrid.className = 'metrics-grid';

            widgets.forEach(widget => {
                console.log('Processando widget:', widget.id, widget);
                const card = createMetricCard(widget, values);
                if (card) {
                    metricsGrid.appendChild(card);
                }
            });

            widgetsList.appendChild(metricsGrid);
        } catch (error) {
            console.error('Erro ao processar widgets:', error);
            widgetsList.innerHTML = '<div class="error-message">Erro ao processar métricas: ' + error.message + '</div>';
        }
    }

    if (integrationId) {
        fetchWidgets(integrationId)
            .then(widgets => displayWidgets(widgets))
            .catch(error => {
                console.error('Erro ao inicializar:', error);
                widgetsList.innerHTML = '<div class="error-message">Erro ao carregar widgets: ' + error.message + '</div>';
            });
    } else {
        widgetsList.innerHTML = '<div class="error-message">ID da campanha não fornecido</div>';
    }
});
