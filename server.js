const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('src')); // Servir arquivos estáticos da pasta src

// Rotas específicas para arquivos estáticos (para garantir que funcionem no Vercel)
app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname + '/src/styles.css');
});

app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/src/script.js');
});

app.get('/reportsDashboard.js', (req, res) => {
    res.sendFile(__dirname + '/src/reportsDashboard.js');
});

app.get('/report-viewer.js', (req, res) => {
    res.sendFile(__dirname + '/src/report-viewer.js');
});

app.get('/customDashboard.js', (req, res) => {
    res.sendFile(__dirname + '/src/customDashboard.js');
});

app.get('/campaign-details.js', (req, res) => {
    res.sendFile(__dirname + '/src/campaign-details.js');
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/src/favicon.ico');
});

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

// Rota genérica para servir páginas HTML (com ou sem query parameters)
app.get('/reports-dashboard.html', (req, res) => {
    res.sendFile(__dirname + '/src/reports-dashboard.html');
});

app.get('/report-viewer.html', (req, res) => {
    res.sendFile(__dirname + '/src/report-viewer.html');
});

app.get('/campaign-details.html', (req, res) => {
    res.sendFile(__dirname + '/src/campaign-details.html');
});

app.get('/custom-dashboard.html', (req, res) => {
    res.sendFile(__dirname + '/src/custom-dashboard.html');
});

app.get('/debug.html', (req, res) => {
    res.sendFile(__dirname + '/src/debug.html');
});

// Rota catch-all para outras páginas HTML
app.get('/*.html', (req, res) => {
    const fileName = req.path.split('?')[0]; // Remove query parameters
    const filePath = __dirname + '/src' + fileName;
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erro ao servir arquivo:', fileName, err);
            res.status(404).send('Página não encontrada');
        }
    });
});

// Rota genérica para servir arquivos JavaScript
app.get('/*.js', (req, res) => {
    const fileName = req.path;
    const filePath = __dirname + '/src' + fileName;
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erro ao servir arquivo JS:', fileName, err);
            res.status(404).send('Arquivo JavaScript não encontrado');
        }
    });
});

// Middleware para log de todas as requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/api/v1/clients', async (req, res) => {
    try {
        const response = await fetch('https://app.reportei.com/api/v1/clients', {
            headers: {
                'Authorization': 'Bearer JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar clientes');
        }

        const data = await response.json();
        res.json({ data: data.data || [] }); // Garantir que sempre retorne um array na propriedade data
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

app.get('/api/v1/clients/:clientId/integrations', async (req, res) => {
    try {
        const { clientId } = req.params;
        const url = `https://app.reportei.com/api/v1/clients/${clientId}/integrations`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar integrações');
        }

        const data = await response.json();
        res.json({ data: data.data || [] });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para buscar relatórios do cliente
app.get('/api/v1/clients/:clientId/reports', async (req, res) => {
    try {
        const { clientId } = req.params;
        const url = `https://app.reportei.com/api/v1/clients/${clientId}/reports`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar relatórios');
        }

        const data = await response.json();
        res.json({ data: data.data || [] });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para buscar detalhes de um relatório específico
app.get('/api/v1/clients/:clientId/reports/:reportId', async (req, res) => {
    try {
        const { clientId, reportId } = req.params;
        console.log('Buscando relatório específico:', { clientId, reportId });
        
        // Primeiro, buscar a lista de relatórios do cliente
        const reportsUrl = `https://app.reportei.com/api/v1/clients/${clientId}/reports`;
        console.log('Buscando lista de relatórios:', reportsUrl);

        console.log('Headers da requisição:', {
            Authorization: 'Bearer JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys'
        });
        
        const reportsResponse = await fetch(reportsUrl, {
            headers: {
                'Authorization': 'Bearer JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys'
            }
        });

        if (!reportsResponse.ok) {
            throw new Error('Erro ao buscar lista de relatórios');
        }

        const responseText = await reportsResponse.text();
        console.log('Resposta bruta:', responseText);

        let reportsData;
        try {
            reportsData = JSON.parse(responseText);
            console.log('Dados dos relatórios:', reportsData);
        } catch (parseError) {
            console.error('Erro ao fazer parse da resposta:', parseError);
            throw new Error('Resposta inválida da API de relatórios');
        }

        if (!reportsData.data || !Array.isArray(reportsData.data)) {
            console.error('Dados inválidos recebidos:', reportsData);
            throw new Error('Formato de dados inválido');
        }

        // Encontrar o relatório específico na lista
        const report = reportsData.data.find(r => r.id.toString() === reportId.toString());
        
        if (!report) {
            throw new Error('Relatório não encontrado');
        }

        // Usar diretamente a URL externa do relatório
        if (!report.external_url) {
            throw new Error('URL externa não encontrada no relatório');
        }

        console.log('URL externa do relatório:', report.external_url);

        res.json({ 
            data: {
                ...report,
                external_url: report.external_url
            }
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint simples para informações do sistema
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Servidor funcionando',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/v1/integrations/:integrationId/widgets', async (req, res) => {
    try {
        const { integrationId } = req.params;
        const url = `https://app.reportei.com/api/v1/integrations/${integrationId}/widgets`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar widgets');
        }

        const data = await response.json();
        res.json({ data: data.data || [] });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/v1/integrations/:integrationId/widgets/value', async (req, res) => {
    try {
        const { integrationId } = req.params;
        const payload = req.body;
        
        console.log('=== Requisição de valores de widgets ===');
        console.log({
            endpoint: 'widgets/value',
            method: 'POST',
            integrationId: integrationId,
            requestedPeriod: {
                start: payload.start,
                end: payload.end
            },
            totalWidgets: payload.widgets.length,
            widgetTypes: payload.widgets.map(w => w.component),
            url: `https://app.reportei.com/api/v1/integrations/${integrationId}/widgets/value`
        });
        
        console.log('Payload completo:', JSON.stringify(payload, null, 2));
        
        const url = `https://app.reportei.com/api/v1/integrations/${integrationId}/widgets/value`;

        // Enviar o payload sem modificações
        // Adiciona um pequeno delay antes de fazer a requisição
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys'
            },
            body: JSON.stringify(payload)
        });

        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', Object.fromEntries(response.headers));

        // Primeiro tentar obter o corpo da resposta
        let responseBody;
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                responseBody = await response.json();
            } else {
                responseBody = await response.text();
            }
        } catch (e) {
            console.error('Erro ao ler corpo da resposta:', e);
            responseBody = 'Não foi possível ler o corpo da resposta';
        }

        console.log('Resposta completa:', {
            url: url,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers),
            body: responseBody
        });

        // Se a resposta não for ok, enviar detalhes do erro para o cliente
        if (!response.ok) {
            // Tentar extrair mais informações do erro
            const errorDetails = typeof responseBody === 'object' ? responseBody : { message: responseBody };
            
            console.error('Erro detalhado da API:', {
                status: response.status,
                statusText: response.statusText,
                details: errorDetails
            });

            return res.status(response.status).json({
                error: 'Erro na API do Reportei',
                status: response.status,
                statusText: response.statusText,
                details: errorDetails
            });
        }

        // Se chegou aqui, temos uma resposta JSON válida
        console.log('Dados recebidos:', JSON.stringify(responseBody, null, 2));

        // Se não houver dados ou se houver uma exceção, retornar erro específico
        if (!responseBody || responseBody.data?.exception) {
            return res.status(422).json({
                error: 'Dados inválidos recebidos da API',
                details: responseBody.data?.exception || 'Sem dados na resposta'
            });
        }

        res.json(responseBody);
    } catch (error) {
        console.error('Erro ao processar requisição:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});