# Orders API

API para gerenciamento de pedidos desenvolvida com Node.js, Express e MongoDB.

## Tecnologias

- **Node.js** — Runtime JavaScript
- **Express** — Framework web
- **MongoDB** — Banco de dados NoSQL
- **Mongoose** — ODM para MongoDB

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/devAndreotti/orders-api.git
cd orders-api

# Instalar dependências
npm install
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
MONGO_URI=mongodb://localhost:27017/orders-api
PORT=3000
```

## Execução

```bash
# Iniciar o servidor
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev
```

O servidor será iniciado em `http://localhost:3000`.

## Endpoints

### Criar Pedido

```bash
curl --location 'http://localhost:3000/order' \
--header 'Content-Type: application/json' \
--data '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
        {
            "idItem": "2434",
            "quantidadeItem": 1,
            "valorItem": 1000
        }
    ]
}'
```

**Resposta:** `201 Created`

### Obter Pedido por Número

```bash
curl --location 'http://localhost:3000/order/v10089015vdb-01'
```

**Resposta:** `200 OK` ou `404 Not Found`

### Listar Todos os Pedidos

```bash
curl --location 'http://localhost:3000/order/list'
```

**Resposta:** `200 OK`

### Atualizar Pedido

```bash
curl --location --request PUT 'http://localhost:3000/order/v10089015vdb-01' \
--header 'Content-Type: application/json' \
--data '{
    "valorTotal": 15000,
    "items": [
        {
            "idItem": "2434",
            "quantidadeItem": 2,
            "valorItem": 7500
        }
    ]
}'
```

**Resposta:** `200 OK` ou `404 Not Found`

### Deletar Pedido

```bash
curl --location --request DELETE 'http://localhost:3000/order/v10089015vdb-01'
```

**Resposta:** `200 OK` ou `404 Not Found`

## Mapeamento de Campos

A API recebe os dados no formato PT-BR e os transforma para o formato EN antes de salvar no banco:

| Recebido (PT-BR) | Salvo no Banco (EN) |
|-------------------|---------------------|
| `numeroPedido`    | `orderId`           |
| `valorTotal`      | `value`             |
| `dataCriacao`     | `creationDate`      |
| `idItem`          | `productId`         |
| `quantidadeItem`  | `quantity`          |
| `valorItem`       | `price`             |

## Respostas HTTP

| Situação           | Status                    |
|--------------------|---------------------------|
| Pedido criado      | `201 Created`             |
| Sucesso            | `200 OK`                  |
| Não encontrado     | `404 Not Found`           |
| Dados inválidos    | `400 Bad Request`         |
| Erro no servidor   | `500 Internal Server Error` |
