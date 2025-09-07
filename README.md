# DVR Monitoring API

## API em **Node.js + Express + MongoDB** para gerenciamento de clientes, DVRs, turnos, relatórios e logs. Suporta autenticação JWT e controle de acesso por **roles** (`admin`, `operator`, `client`).

## 🔹 Tecnologias

- Node.js
- Express
- MongoDB (Atlas ou local)
- Mongoose
- bcryptjs (hash de senhas)
- jsonwebtoken (JWT)
- dotenv
- cors
- nodemon (desenvolvimento)

---

## 🔹 Estrutura de Pastas

```
dvr-monitoring-api/
│── index.js
│── .env
│── package.json
│── models/
│    └── User.js
│    └── Client.js
│    └── Shift.js
│    └── Report.js
│    └── Log.js
│── routes/
│    └── auth.js
│    └── users.js
│    └── clients.js
│    └── shifts.js
│    └── reports.js
│    └── logs.js
│── middleware/
│    └── authMiddleware.js
```

---

## 🔹 Instalação

1. Clonar o projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd dvr-monitoring-api
```

2. Instalar dependências:

```bash
npm install
```

3. Configurar o arquivo `.env` na raiz:

```
PORT=5000
MONGO_URI=<sua_string_de_conexao_mongodb>
JWT_SECRET=<uma_chave_secreta_para_jwt>
```

4. Rodar servidor:

```bash
npx nodemon index.js
```

Servidor rodando em `http://localhost:5000`.

---

## 🔹 Rotas de Autenticação

### Registrar Usuário

```
POST /api/auth/register
```

Body JSON:

```json
{
  "name": "João Silva",
  "phone": "11999999999",
  "password": "123456"
}
```

⚠️ `role` será sempre `"operator"` por padrão.

---

### Login

```
POST /api/auth/login
```

Body JSON:

```json
{
  "phone": "11999999999",
  "password": "123456"
}
```

Resposta: `token` JWT + dados do usuário.

---

## 🔹 Rotas de Usuários (`/api/users`)

- **GET /** → Listar todos os usuários (apenas admin)
- **POST /create** → Criar usuário (admin cria admin/operator/client)
- **PUT /?id=<userId>** → Atualizar usuário (admin qualquer um, operador só ele mesmo)
- **DELETE /?id=<userId>** → Excluir usuário (apenas admin)

---

## 🔹 Rotas de Clientes (`/api/clients`)

- **POST /** → Criar cliente (operador ou admin)
  Body JSON:

```json
{
  "name": "Loja Centro",
  "address": "Rua Principal, 123 - São Paulo",
  "phone": "1133334444",
  "dvrIp": "192.168.1.50",
  "dvrUser": "admin",
  "dvrPassword": "12345"
}
```

- **GET /** → Listar todos clientes ou buscar por ID com query `?id=<clientId>`
- **PUT /** → Atualizar cliente por query `?id=<clientId>`
- **DELETE /** → Excluir cliente por query `?id=<clientId>`

---

## 🔹 Rotas de Turnos (`/api/shifts`)

- **POST /** → Criar turno
  Body JSON:

```json
{
  "operator": "<userId_do_operador>",
  "startTime": "2025-09-05T08:00:00.000Z",
  "endTime": "2025-09-05T16:00:00.000Z",
  "notes": "Turno da manhã, sem ocorrências até agora"
}
```

- **GET /** → Listar todos os turnos
- **GET /\:id** → Buscar turno por ID
- **PUT /\:id** → Atualizar turno
- **DELETE /\:id** → Excluir turno

---

## 🔹 Rotas de Relatórios (`/api/reports`)

- **POST /** → Criar relatório
  Body JSON:

```json
{
  "shift": "<shiftId>",
  "operator": "<userId>",
  "dateTime": "2025-09-05T10:00:00.000Z",
  "priority": "alta",
  "description": "Detectada falha no DVR",
  "alerts": ["alerta 1", "alerta 2"]
}
```

- **GET /** → Listar todos relatórios
- **GET /\:id** → Buscar relatório por ID
- **PUT /\:id** → Atualizar relatório
- **DELETE /\:id** → Excluir relatório

---

## 🔹 Rotas de Logs (`/api/logs`)

- **GET /** → Listar logs (apenas usuários `admin`)
- **POST /** → Criar log manual
  Body JSON:

```json
{
  "action": "Teste de log manual"
}
```

---

## 🔹 Testando no Postman

1. **Registrar usuário** → `POST /api/auth/register`
2. **Fazer login** → `POST /api/auth/login` → pegar token JWT
3. **Criar cliente** → `POST /api/clients` → header `Authorization: Bearer <token>`
4. **Criar turno** → `POST /api/shifts` → header `Authorization: Bearer <token>`
5. **Criar relatório** → `POST /api/reports` → header `Authorization: Bearer <token>`
6. **Ver logs** → `GET /api/logs` → apenas admins podem acessar

---

## 🔹 Observações

- Todos endpoints protegidos requerem token JWT.
- Usuários criados via `/register` **sempre serão operadores**, não é permitido auto-promover para admin.
- Logs são registrados automaticamente nas ações de CRUD de clientes, turnos e relatórios.

---
