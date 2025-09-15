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

## 🔹 Rotas de Clientes (`/api/clients`)

- **POST /** → Criar cliente (operador ou admin)
  Body JSON:

```json
{
  "name": "Loja Centro",
  "dvrIp": "192.168.1.50",
  "dvrPort": 8080,
  "address": "Rua Principal, 123 - São Paulo",
  "dvrUser": "admin",
  "dvrPassword": "12345"
}
```

> Obs.: `createdBy` será preenchido automaticamente pelo usuário logado.

- **GET /** → Listar todos os clientes ou buscar por ID usando query `?id=<clientId>`
  Exemplo:

  ```
  GET /api/clients?id=68bd0214db4d60aaa988343f
  ```

- **PUT /** → Atualizar cliente por query `?id=<clientId>`
  Body JSON (campos opcionais):

```json
{
  "name": "Loja Centro Atualizada",
  "dvrIp": "192.168.1.51",
  "dvrPort": 8081,
  "address": "Rua Nova, 456 - São Paulo",
  "dvrUser": "admin2",
  "dvrPassword": "67890"
}
```

- **DELETE /** → Excluir cliente por query `?id=<clientId>`
  Exemplo:

```
DELETE /api/clients?id=68bd0214db4d60aaa988343f
```

> Todas as ações de CRUD registram logs automáticos com o usuário que realizou a operação.

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
---
Novas atualizações 

Perfeito! Vou te fornecer um **guia completo das rotas que você tem**, incluindo:

* URL
* Método HTTP
* Middleware (autenticação/role)
* JSON de exemplo que você deve enviar

Vou organizar por recurso: **Clients, Logs, Shifts, Users**.

---

## **1️⃣ Clients**

**Base URL:** `/api/clients`
**Middleware:** `authMiddleware` (qualquer usuário autenticado)

| Ação                  | Método | URL                           | Body JSON                                                                             | Observações                                                                           |
| --------------------- | ------ | ----------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Criar cliente         | POST   | `/api/clients`                | `json { "name": "Cliente Teste", "dvrIp": "192.168.0.10", "address": "Rua A, 123" } ` | `dvrPort`, `dvrUser` e `dvrPassword` são automáticos. `createdBy` é o usuário logado. |
| Listar todos clientes | GET    | `/api/clients`                | -                                                                                     | Retorna array de clientes.                                                            |
| Buscar cliente por ID | GET    | `/api/clients?id=<CLIENT_ID>` | -                                                                                     | Retorna o cliente específico.                                                         |
| Atualizar cliente     | PUT    | `/api/clients?id=<CLIENT_ID>` | `json { "name": "Novo Nome", "address": "Nova Rua, 456" } `                           | Atualiza campos informados.                                                           |
| Excluir cliente       | DELETE | `/api/clients?id=<CLIENT_ID>` | -                                                                                     | Remove o cliente.                                                                     |

---

## **2️⃣ Logs**

**Base URL:** `/api/logs`
**Middleware:** `authMiddleware` (+ admin para listar todos)

| Ação              | Método | URL         | Body JSON                             | Observações                              |
| ----------------- | ------ | ----------- | ------------------------------------- | ---------------------------------------- |
| Listar todos logs | GET    | `/api/logs` | -                                     | Apenas admin pode acessar.               |
| Criar log manual  | POST   | `/api/logs` | `json { "action": "Ação de teste" } ` | Qualquer usuário autenticado pode criar. |

---

## **3️⃣ Shifts (Turnos)**

**Base URL:** `/api/shifts`
**Middleware:** `authMiddleware`

| Ação                | Método | URL                      | Body JSON                                                                                                                                      | Observações                                  |
| ------------------- | ------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Criar turno         | POST   | `/api/shifts`            | `json { "operator": "<USER_ID>", "startTime": "2025-09-14T08:00:00.000Z", "endTime": "2025-09-14T16:00:00.000Z", "notes": "Turno de teste" } ` | `operator` deve ser ID de usuário existente. |
| Listar todos turnos | GET    | `/api/shifts`            | -                                                                                                                                              | Retorna array de turnos.                     |
| Buscar turno por ID | GET    | `/api/shifts/<SHIFT_ID>` | -                                                                                                                                              | Retorna o turno específico.                  |
| Atualizar turno     | PUT    | `/api/shifts/<SHIFT_ID>` | `json { "notes": "Notas atualizadas", "startTime": "...", "endTime": "..." } `                                                                 | Atualiza campos informados.                  |
| Excluir turno       | DELETE | `/api/shifts/<SHIFT_ID>` | -                                                                                                                                              | Remove o turno.                              |

---

## **4️⃣ Users**

**Base URL:** `/api/users`

| Ação                                | Método | URL                    | Body JSON                                                                                        | Middleware       | Observações                                                                        |
| ----------------------------------- | ------ | ---------------------- | ------------------------------------------------------------------------------------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| Registrar usuário (sempre operador) | POST   | `/api/users/register`  | `json { "name": "Operador Teste", "phone": "11999999999", "password": "123456" } `               | nenhum           | Cria usuário com role `operator`.                                                  |
| Criar usuário com qualquer role     | POST   | `/api/users/create`    | `json { "name": "Admin Teste", "phone": "11888888888", "password": "123456", "role": "admin" } ` | `auth + isAdmin` | Apenas admin pode definir role.                                                    |
| Atualizar usuário                   | PUT    | `/api/users/<USER_ID>` | `json { "name": "Novo Nome", "role": "operator" } `                                              | `auth`           | Admin pode atualizar qualquer usuário; operador apenas seus dados e não muda role. |
| Listar todos usuários               | GET    | `/api/users`           | -                                                                                                | nenhum           | Retorna array sem senha.                                                           |

---

💡 **Dicas importantes para os testes e CRUD manual:**

1. Sempre envie o **header Authorization** se a rota exigir `authMiddleware`:

```
Authorization: Bearer <TOKEN>
```

2. Para `operator` ou `admin` nos testes, primeiro crie os usuários e faça login para pegar o token:

```json
// POST /api/auth/login
{
  "phone": "11999999999",
  "password": "123456"
}
```

Resposta:

```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "_id": "<USER_ID>",
    "name": "Operador Teste",
    "phone": "11999999999",
    "role": "operator"
  }
}
```

3. Use os `_id` retornados em `operator`, `createdBy` ou `userId` nos outros objetos.

4. Sempre use **`new Date().toISOString()`** ou datas válidas ISO para `startTime` e `endTime`.

---

Se você quiser, posso montar **uma coleção pronta de exemplos de JSON para cada rota** já com todos os IDs fictícios para você **testar direto no Postman ou Insomnia**, sem precisar rodar os testes do Jest.

Quer que eu faça isso?
