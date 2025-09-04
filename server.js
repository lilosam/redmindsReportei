const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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
        res.json(data);
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