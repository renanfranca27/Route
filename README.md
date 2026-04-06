# RouteLog

Sistema web completo de logística de rotas para pequenas transportadoras.

## Funcionalidades

- Pesquisa de rotas com origem, destino e múltiplas paradas
- Comparação de rotas alternativas com distância, tempo e custo
- Lista de cidades no percurso
- Cálculo automático de custo baseado em consumo de combustível
- Mapa interativo com Google Maps
- Histórico de rotas com filtros e exportação para CSV
- Sistema de login simples
- Configurações para chave da API e preferências de rota

## Tecnologias

- **Backend**: Node.js com Express
- **Frontend**: React
- **Banco de dados**: MongoDB
- **Integração**: Google Maps Directions API

## Instalação e Execução

### Pré-requisitos

- Node.js
- MongoDB
- Chave da API do Google Maps

### Backend

1. Navegue para a pasta `backend`:
   ```
   cd backend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o arquivo `.env` com sua chave da API e outras configurações.

4. Inicie o servidor:
   ```
   npm start
   ```

### Frontend

1. Navegue para a pasta `frontend`:
   ```
   cd frontend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o arquivo `.env` com sua chave da API.

4. Inicie a aplicação:
   ```
   npm start
   ```

A aplicação estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

```
RouteLog/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   ├── public/
│   ├── package.json
│   └── .env
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## Como Usar

1. Faça login ou registre-se.
2. Na dashboard, insira origem, destino e parâmetros de combustível.
3. Clique em "Calculate Routes" para obter alternativas.
4. Visualize as rotas no mapa e compare detalhes.
5. Salve rotas no histórico.
6. Acesse configurações para ajustar preferências.
7. Visualize e filtre o histórico de rotas.#
