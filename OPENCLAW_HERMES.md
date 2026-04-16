# OpenClaw + Hermes — Descripción del Sistema

## Qué es OpenClaw

**OpenClaw** es la plataforma de agente AI que corre en el VPS de Hostinger (`72.62.16.119`).
Es el entorno de ejecución — las "manos". Provee:

- Un runtime de Node.js dentro de un container Docker
- Plugins para comunicarse via **Telegram**, Discord, Slack, WhatsApp
- Un workspace persistente en `/data/.openclaw/workspace/`
- Herramientas MCP (Model Context Protocol): Hostinger API, browser, shell, etc.
- Una web UI accesible en `http://72.62.16.119:49921/`

El container Docker (`ghcr.io/hostinger/hvps-openclaw:latest`) expone:
- Puerto `49921` → OpenClaw Web UI
- Puerto `3001` → Backend de apps (HeroSculpt Express server)

---

## Qué es Hermes

**Hermes** es el agente AI que vive dentro de OpenClaw. Es el "cerebro".

Hermes no es un chatbot — es un agente autónomo que:
- Recibe instrucciones via **Telegram** (bot: `@NoxforgeOpsBot`)
- Lee su estado desde `/data/.openclaw/workspace/hermes/state/state.json`
- Usa skills definidos en `/data/.openclaw/workspace/hermes/skills/`
- Escribe contratos/planes en `/data/.openclaw/workspace/hermes/plans/`
- Puede spawnear subagentes para tareas paralelas
- Persiste memoria en `/data/.openclaw/workspace/MEMORY.md`

**Protocolo de Hermes (obligatorio antes de cada tarea):**
1. Leer `hermes/state/state.json`
2. Leer el skill relevante en `hermes/skills/`
3. Decidir la tarea de mayor prioridad
4. Escribir contrato en `hermes/plans/[task].json`
5. Spawnear subagente
6. Actualizar `state.json`
7. `git commit + push`

---

## Arquitectura del sistema

```
Usuario
  │
  ├─ Telegram (@NoxforgeOpsBot)
  │       │
  │       ▼
  │   Hermes (cerebro AI)
  │       │
  │       ▼
  │   OpenClaw (runtime / manos)
  │       │
  │       ├─ Workspace: /data/.openclaw/workspace/
  │       │     ├─ HeroSculpt/     ← código del app
  │       │     ├─ hermes/         ← estado y skills de Hermes
  │       │     ├─ plaga-os/       ← proyecto PlagaOS Pro
  │       │     └─ MEMORY.md       ← memoria persistente
  │       │
  │       ├─ MCP Tools
  │       │     ├─ hostinger-api-mcp  ← deploy a Hostinger
  │       │     ├─ browser            ← control de navegador
  │       │     └─ shell              ← ejecución de comandos
  │       │
  │       └─ Docker ports
  │             ├─ :49921  → OpenClaw Web UI
  │             └─ :3001   → HeroSculpt backend
  │
  └─ GitHub (Koji72/HeroSculpt)
          │
          ▼
     GitHub Actions (push → main)
          │
          ├─ Deploy to Hostinger Staging
          │    └─ darkslategrey-ape-448372.hostingersite.com
          │
          └─ Deploy to OpenClaw VPS
               └─ herosculpt.loca.lt (via localtunnel)
```

---

## Proyectos activos en el workspace

| Proyecto | Descripción | Stack |
|---|---|---|
| **HeroSculpt** | Customizador 3D de superhéroes | React + Vite + Three.js |
| **PlagaOS Pro** | App para exterminadores | Next.js + Supabase |

---

## Cómo comunicarse con Hermes

**Via Telegram:** Manda un mensaje a `@NoxforgeOpsBot` con la instrucción.

Ejemplos:
- `"deployá HeroSculpt al staging"`
- `"revisá el estado de PlagaOS"`
- `"hacé un build de producción"`

**Via workspace (directo):** Escribir un archivo `.md` con instrucciones en
`/data/.openclaw/workspace/` — Hermes lo detecta en su próximo ciclo.

---

## Cuándo usar Claude Code vs Hermes

| Situación | Usar |
|---|---|
| Debugging de código, fixes, features | **Claude Code** (este asistente) |
| Deploy rutinario tras un push | **GitHub Actions** (automático) |
| Tarea autónoma larga / monitoreo | **Hermes via Telegram** |
| Algo está roto y no sabés por qué | **Claude Code** via SSH |
| Queres que algo pase mientras dormís | **Hermes** |
