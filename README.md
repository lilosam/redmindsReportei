# Redminds Reportei - Dashboard de Relatórios

Sistema de dashboard para visualização de relatórios da plataforma Reportei, com interface iframe para visualização completa e navegação simplificada.

## 🚀 Funcionalidades

- **Lista de Clientes**: Visualização de todos os clientes disponíveis
- **Relatórios por Cliente**: Acesso aos relatórios específicos de cada cliente
- **Visualizador de Relatórios**: Sistema de iframe para visualização completa dos relatórios
- **Interface Responsiva**: Design adaptável para desktop e mobile
- **Navegação Intuitiva**: Sistema de navegação simples e eficiente

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Token de acesso da API Reportei

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/lilosam/redmindsReportei.git
cd redmindsReportei
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o token da API:
   - Abra o arquivo `server.js`
   - Localize a linha `const REPORTEI_TOKEN = 'SEU_TOKEN_AQUI';`
   - Substitua `'SEU_TOKEN_AQUI'` pelo seu token válido da API Reportei

4. Inicie o servidor:
```bash
npm start
```

5. Acesse a aplicação:
   - Abra o navegador e vá para `http://localhost:3000`

## 📁 Estrutura do Projeto

```
redmindsReportei/
├── src/                          # Frontend da aplicação
│   ├── index.html               # Página principal
│   ├── reports.html             # Página de relatórios
│   ├── report-viewer.html       # Visualizador de relatório em iframe
│   ├── styles.css               # Estilos da aplicação
│   ├── app.js                   # JavaScript principal
│   ├── reportsDashboard.js      # Lógica dos relatórios
│   └── report-viewer.js         # Lógica do visualizador
├── server.js                    # Servidor backend
├── package.json                 # Dependências e scripts
└── README.md                    # Este arquivo
```

## � Como Usar

### 1. Visualizar Clientes
- Na página inicial, clique em "Listar Clientes"
- Use a barra de pesquisa para filtrar clientes específicos
- Clique em um cliente para ver seus relatórios

### 2. Acessar Relatórios
- Após selecionar um cliente, você verá a lista de relatórios disponíveis
- Cada relatório mostra:
  - Título e subtítulo
  - Período de dados (data de início e fim)
  - Ações disponíveis

### 3. Visualizar Relatório
- **"Ver Relatório"**: Abre o relatório em uma nova página (iframe integrado)
- **"Abrir no Reportei"**: Abre o relatório diretamente no site do Reportei

### 4. Navegação
- Use o botão "Voltar" para retornar à lista anterior
- O título da página sempre mostra onde você está no sistema

## 🔌 API Endpoints

O servidor atua como proxy para a API do Reportei:

- `GET /api/v1/clients` - Lista todos os clientes
- `GET /api/v1/clients/:id/reports` - Lista relatórios de um cliente específico
- `GET /health` - Verificação de saúde do servidor

## ⚙️ Configurações

### Token da API
O token deve ser configurado no arquivo `server.js`:
```javascript
const REPORTEI_TOKEN = 'seu_token_aqui';
```

### Porta do Servidor
Por padrão, o servidor roda na porta 3000. Para alterar:
```javascript
const PORT = process.env.PORT || 3000;
```

## 🎨 Personalização

### Estilos
Os estilos estão centralizados no arquivo `src/styles.css` e incluem:
- Layout responsivo para todas as telas
- Design moderno com cards e grid system
- Animações suaves e transições
- Tema consistente em azul e cinza

### Tecnologias Utilizadas
- **Backend**: Node.js, Express.js, CORS
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Visualização**: iframes para relatórios externos
- **API**: Fetch API para comunicação com backend

## 🐛 Solução de Problemas

### Erro de Token
- Verifique se o token está correto no arquivo `server.js`
- Confirme se o token tem as permissões necessárias

### Erro de CORS
- O servidor já está configurado para lidar com CORS
- Verifique se não há proxy ou firewall bloqueando as requisições

### Relatórios não carregam
- Verifique a conexão com a internet
- Confirme se a API do Reportei está funcionando
- Verifique os logs do servidor no terminal

### Performance
- Os relatórios são carregados via iframe para melhor performance
- Evite abrir muitos relatórios simultaneamente

## 📝 Funcionalidades Futuras

- Análise automatizada com IA
- Exportação de relatórios
- Dashboard personalizado
- Cache de dados para melhor performance
- Notificações em tempo real

## 📄 Licença

Este projeto é de uso interno da Redminds.

## 🤝 Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento.
