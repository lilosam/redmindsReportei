# Reportei Analytics Dashboard

Uma aplicação web para visualização de métricas e análises do Facebook através da API do Reportei.

## Descrição

Esta aplicação permite visualizar dados e métricas de páginas do Facebook, incluindo:
- Métricas de engajamento
- Estatísticas de posts
- Análise de alcance
- Métricas de vídeo
- Insights de Reels
- E muito mais

## Estrutura do Projeto

- `src/` - Arquivos fonte do frontend
  - `index.html` - Página principal de listagem de clientes
  - `campaign-details.html` - Página de detalhes de campanha
  - `styles.css` - Estilos da aplicação
  - `script.js` - JavaScript principal
  - `campaign-details.js` - Lógica de detalhes da campanha

- `server.js` - Servidor Node.js que atua como proxy para a API do Reportei

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure a variável de ambiente com seu token do Reportei ou atualize o token diretamente no arquivo server.js

3. Inicie o servidor:
   ```
   npm start
   ```

4. Em outro terminal, inicie o servidor de desenvolvimento para o frontend:
   ```
   npx http-server src
   ```

## Endpoints

- `GET /api/v1/clients` - Lista todos os clientes
- `GET /api/v1/clients/:clientId/integrations` - Lista integrações de um cliente
- `GET /api/v1/integrations/:integrationId/widgets` - Lista widgets disponíveis
- `POST /api/v1/integrations/:integrationId/widgets/value` - Obtém valores dos widgets

## Funcionalidades

- Listagem de clientes
- Visualização de integrações por cliente
- Dashboard com métricas do Facebook
- Visualização de dados em diferentes formatos (números, gráficos, tabelas)
- Suporte a diferentes tipos de métricas (alcance, engajamento, vídeos, etc.)

## Notas Técnicas

- A aplicação usa fetch API para comunicação com o backend
- Implementa CORS para comunicação segura entre frontend e backend
- Utiliza sistema de logging para debug e monitoramento
- Implementa tratamento de erros robusto
