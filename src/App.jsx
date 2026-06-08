import { useState, useEffect } from 'react'

// URL base da API (proxied pelo Vite dev server)
const API_URL = 'http://localhost:3001/tarefas'

function App() {
  // ── STATES ────────────────────────────────────────────────────────────────
  const [tarefas, setTarefas]       = useState([])       // lista de tarefas
  const [loading, setLoading]       = useState(true)     // carregando dados
  const [erro, setErro]             = useState(null)     // mensagem de erro
  const [sucesso, setSucesso]       = useState(false)    // feedback de cadastro
  const [enviando, setEnviando]     = useState(false)    // botão desabilitado
  const [filtro, setFiltro]         = useState('Todos')  // filtro por status

  // Campos do formulário
  const [titulo, setTitulo]         = useState('')
  const [descricao, setDescricao]   = useState('')
  const [prioridade, setPrioridade] = useState('Média')
  const [status, setStatus]         = useState('Pendente')

  // ── BUSCAR TAREFAS (GET) ──────────────────────────────────────────────────
  // useEffect dispara assim que o componente é montado
  useEffect(() => {
    buscarTarefas()
  }, [])

  function buscarTarefas() {
    setLoading(true)
    setErro(null)

    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Não foi possível conectar à API.')
        return res.json()
      })
      .then(dados => {
        setTarefas(dados)
        setLoading(false)
      })
      .catch(err => {
        setErro('Erro ao carregar tarefas. ' + err.message)
        setLoading(false)
      })
  }

  // ── CADASTRAR TAREFA (POST) ───────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault()

    if (!titulo.trim()) return

    const novaTarefa = { titulo, descricao, prioridade, status }

    setEnviando(true)

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaTarefa),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao cadastrar.')
        return res.json()
      })
      .then(tarefaCriada => {
        // Atualiza a lista sem precisar recarregar a página
        setTarefas(prev => [...prev, tarefaCriada])

        // Limpa o formulário
        setTitulo('')
        setDescricao('')
        setPrioridade('Média')
        setStatus('Pendente')

        // Mostra mensagem de sucesso por 3 segundos
        setSucesso(true)
        setTimeout(() => setSucesso(false), 3000)
      })
      .catch(() => {
        setErro('Erro ao cadastrar a tarefa.')
      })
      .finally(() => {
        setEnviando(false)
      })
  }

  // ── FILTRO ────────────────────────────────────────────────────────────────
  const opcoesFiltro = ['Todos', 'Pendente', 'Em andamento', 'Concluída']

  const tarefasFiltradas = filtro === 'Todos'
    ? tarefas
    : tarefas.filter(t => t.status === filtro)

  // ── HELPERS DE ESTILO ─────────────────────────────────────────────────────
  function classePrioridade(p) {
    if (p === 'Alta')  return 'pill pill-alta'
    if (p === 'Baixa') return 'pill pill-baixa'
    return 'pill pill-media'
  }

  function classeStatus(s) {
    if (s === 'Concluída')    return 'pill pill-concluida'
    if (s === 'Em andamento') return 'pill pill-andamento'
    return 'pill pill-pendente'
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <h1>Cadastro de<span>.</span>Tarefas</h1>
          <p>Registre e gerencie suas tarefas de forma simples e eficiente</p>
        </div>
        <span className="badge-count">{tarefas.length} tarefa{tarefas.length !== 1 ? 's' : ''}</span>
      </header>

      {/* ERRO GERAL */}
      {erro && <div className="error-banner">⚠ {erro}</div>}

      {/* FORMULÁRIO DE CADASTRO */}
      <div className="form-card">
        <h2>Nova tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* Campo 1: Título */}
            <div className="field form-full">
              <label htmlFor="titulo">Título *</label>
              <input
                id="titulo"
                type="text"
                placeholder="Ex: Comprar ingredientes para o jantar"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                required
              />
            </div>

            {/* Campo 2: Descrição */}
            <div className="field form-full">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                rows={2}
                placeholder="Detalhes da tarefa..."
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
              />
            </div>

            {/* Campo 3: Prioridade */}
            <div className="field">
              <label htmlFor="prioridade">Prioridade</label>
              <select
                id="prioridade"
                value={prioridade}
                onChange={e => setPrioridade(e.target.value)}
              >
                <option>Alta</option>
                <option>Média</option>
                <option>Baixa</option>
              </select>
            </div>

            {/* Campo 4: Status */}
            <div className="field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option>Pendente</option>
                <option>Em andamento</option>
                <option>Concluída</option>
              </select>
            </div>

          </div>

          <button type="submit" className="btn-submit" disabled={enviando || !titulo.trim()}>
            {enviando ? 'Cadastrando...' : '+ Cadastrar tarefa'}
          </button>
        </form>

        {/* Feedback de sucesso */}
        {sucesso && (
          <div className="toast">✓ Tarefa cadastrada com sucesso!</div>
        )}
      </div>

      {/* LISTAGEM */}
      <div>
        <div className="list-header">
          <h2>Tarefas cadastradas</h2>
          <div className="filter-row">
            {opcoesFiltro.map(op => (
              <button
                key={op}
                className={`filter-btn ${filtro === op ? 'active' : ''}`}
                onClick={() => setFiltro(op)}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && <div className="loading">carregando tarefas...</div>}

        {/* Lista de tarefas */}
        {!loading && (
          <div className="task-list">
            {tarefasFiltradas.length === 0 ? (
              <div className="empty">
                <p>[ ]</p>
                <p>nenhuma tarefa encontrada</p>
              </div>
            ) : (
              tarefasFiltradas.map(tarefa => (
                <div key={tarefa.id} className="task-card">
                  <div>
                    <p className="task-title">{tarefa.titulo}</p>
                    {tarefa.descricao && (
                      <p className="task-desc">{tarefa.descricao}</p>
                    )}
                    <div className="task-meta">
                      <span className={classePrioridade(tarefa.prioridade)}>
                        {tarefa.prioridade}
                      </span>
                      <span className={classeStatus(tarefa.status)}>
                        {tarefa.status}
                      </span>
                    </div>
                  </div>
                  <span className="task-id">#{tarefa.id}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
