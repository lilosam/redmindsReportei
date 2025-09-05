# Reportei Analytics Dashboard

Interface personalizada para visualização de métricas e análises do Reportei, com suporte a web scraping para extração de dados.

## 🚀 Funcionalidades

- Visualização de relatórios do Reportei
- Extração automática de dados via web scraping
- Dashboard personalizado com métricas principais
- Interface simplificada e intuitiva
- Suporte a múltiplos tipos de relatórios

## 📋 Pré-requisitos

- Node.js >= 16.0.0
- NPM >= 8.0.0
- Token de acesso ao Reportei

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/lilosam/redmindsReportei.git
cd redmindsReportei
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione seu token do Reportei:
```env
REPORTEI_API_TOKEN=seu_token_aqui
PORT=3000
```

4. Inicie o servidor:
```bash
npm start
```

## 🛠️ Tecnologias

- **Backend**
  - Express.js - Framework web
  - Puppeteer - Web scraping e automação
  - CORS - Segurança e comunicação cross-origin
  - Dotenv - Gerenciamento de variáveis de ambiente

- **Frontend**
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
  - Fetch API para requisições

## 📁 Estrutura do Projeto

```
redmindsReportei/
├── src/
│   ├── campaign-details.html
│   ├── campaign-details.js
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   └── services/
│       └── scraper.js
├── server.js
├── requirements.txt
└── README.md
```

## 🔍 Endpoints da API

- `GET /api/proxy` - Proxy para requisições ao Reportei
- `GET /api/v1/clients/:clientId/reports` - Lista relatórios de um cliente
- `GET /api/v1/reports/:reportId` - Obtém dados de um relatório específico

## 🔐 Segurança

- Autenticação via token do Reportei
- Headers de segurança configurados
- Bypass de detecção de automação para scraping
- Tratamento de erros robusto

## ⚙️ Configurações Avançadas

### Configuração do Scraper

O scraper pode ser configurado através dos seguintes parâmetros:
- Timeout de navegação
- User agents rotativos
- Headers personalizados
- Modo headless/não-headless

### Otimizações

- Cache de requisições
- Bloqueio de recursos não essenciais
- Sistema de retry para falhas
- Logs detalhados para debug

## 📝 Notas de Desenvolvimento

- O sistema utiliza web scraping como alternativa à API oficial
- Implementa técnicas anti-detecção para maior confiabilidade
- Suporta diferentes tipos de relatórios e dashboards
- Interface responsiva e adaptável

## ⚠️ Limitações Conhecidas

- O scraping pode ser afetado por mudanças na interface do Reportei
- Alguns relatórios podem requerer adaptações específicas
- Performance pode variar dependendo da conexão e carga do servidor

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
