# Cadastro de Tarefas

Aplicação de **Cadastro de Tarefas** desenvolvida com **React + Vite** consumindo uma API fake com **JSON Server**.


---

## Tecnologias utilizadas

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [JSON Server](https://github.com/typicode/json-server)
- `useState` e `useEffect` para gerenciamento de estado
- `fetch` para requisições HTTP (GET e POST)

---

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/NightEdymion/Gerenciador-de-Tarefas
cd task-manager
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o JSON Server (API fake)

Abra um terminal e rode:

```bash
npm run api
```

A API estará disponível em: `http://localhost:3001/tarefas`

### 4. Inicie o React (em outro terminal)

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

---

---

## Endpoints da API

| Método | Rota        | Descrição               |
|--------|-------------|-------------------------|
| GET    | /tarefas    | Lista todas as tarefas  |
| POST   | /tarefas    | Cadastra nova tarefa    |

---

